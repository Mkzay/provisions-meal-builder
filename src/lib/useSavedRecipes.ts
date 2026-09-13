"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CreateSavedRecipeInput, SavedRecipe, UpdateSavedRecipeInput } from "./types";

export function useSavedRecipes() {
  const { data: session, status } = useSession();
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRecipes = useCallback(async () => {
    if (status !== "authenticated") return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/notion/recipes", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.recipes)) {
          setSavedRecipes(data.recipes);
        }
      }
    } catch (err) {
      console.error("Failed to fetch saved recipes:", err);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchRecipes();
    }
  }, [status, fetchRecipes]);

  const createRecipe = useCallback(
    async (input: CreateSavedRecipeInput): Promise<{ success: boolean; id?: string }> => {
      setIsSaving(true);
      const tempId = `temp-recipe-${Date.now()}`;
      const optimisticRecipe: SavedRecipe = {
        id: tempId,
        name: input.name,
        mealTypes: input.mealTypes,
        mainIngredientId: input.mainIngredientId,
        proteinId: input.proteinId || input.proteinIds?.[0],
        proteinIds: input.proteinIds || (input.proteinId ? [input.proteinId] : []),
        supplementaryId: input.supplementaryId || input.supplementaryIds?.[0],
        supplementaryIds: input.supplementaryIds || (input.supplementaryId ? [input.supplementaryId] : []),
        sourceUrl: input.sourceUrl,
        owner: (session?.user as { owner?: string })?.owner || "User",
        createdAt: new Date().toISOString(),
      };
      setSavedRecipes((prev) => [optimisticRecipe, ...prev]);

      try {
        const res = await fetch("/api/notion/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (res.ok) {
          const data = await res.json();
          await fetchRecipes();
          return { success: true, id: data.id };
        }
        setSavedRecipes((prev) => prev.filter((r) => r.id !== tempId));
        return { success: false };
      } catch (err) {
        console.error("Failed to create saved recipe:", err);
        setSavedRecipes((prev) => prev.filter((r) => r.id !== tempId));
        return { success: false };
      } finally {
        setIsSaving(false);
      }
    },
    [fetchRecipes, session]
  );

  const updateRecipe = useCallback(
    async (id: string, input: UpdateSavedRecipeInput): Promise<{ success: boolean }> => {
      setIsSaving(true);
      setSavedRecipes((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                name: input.name ?? r.name,
                mealTypes: input.mealTypes ?? r.mealTypes,
                mainIngredientId: input.mainIngredientId !== undefined ? input.mainIngredientId : r.mainIngredientId,
                mainIngredientName: input.mainIngredientName ?? r.mainIngredientName,
                proteinIds: input.proteinIds ?? r.proteinIds,
                proteinNames: input.proteinNames ?? r.proteinNames,
                supplementaryIds: input.supplementaryIds ?? r.supplementaryIds,
                supplementaryNames: input.supplementaryNames ?? r.supplementaryNames,
                sourceUrl: input.sourceUrl !== undefined ? input.sourceUrl : r.sourceUrl,
              }
            : r
        )
      );

      try {
        const res = await fetch("/api/notion/recipes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...input }),
        });
        if (res.ok) {
          await fetchRecipes();
          return { success: true };
        }
        await fetchRecipes();
        return { success: false };
      } catch (err) {
        console.error("Failed to update saved recipe:", err);
        await fetchRecipes();
        return { success: false };
      } finally {
        setIsSaving(false);
      }
    },
    [fetchRecipes]
  );

  const deleteRecipe = useCallback(
    async (id: string): Promise<{ success: boolean }> => {
      // Optimistic delete
      setSavedRecipes((prev) => prev.filter((r) => r.id !== id));
      try {
        const res = await fetch(`/api/notion/recipes?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          // Re-fetch on failure to rollback
          await fetchRecipes();
          return { success: false };
        }
        return { success: true };
      } catch (err) {
        console.error("Failed to delete saved recipe:", err);
        await fetchRecipes();
        return { success: false };
      }
    },
    [fetchRecipes]
  );

  return {
    savedRecipes,
    isOpen,
    isLoading,
    isSaving,
    openSavedRecipes: () => setIsOpen(true),
    closeSavedRecipes: () => setIsOpen(false),
    fetchRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
}
