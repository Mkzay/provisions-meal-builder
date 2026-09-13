"use client";

import { AddSupplyInput, CreateSavedRecipeInput, Ingredient, MealType } from "@/lib/types";
import React, { useMemo, useState } from "react";

const ALL_MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

interface SavedRecipeFormProps {
  ingredients: Ingredient[];
  owner: string;
  onAddSupply: (input: AddSupplyInput) => Promise<{ success: boolean; id?: string } | void>;
  onSubmit: (input: CreateSavedRecipeInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const SavedRecipeForm: React.FC<SavedRecipeFormProps> = ({
  ingredients,
  owner,
  onAddSupply,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [name, setName] = useState("");
  const [mealTypes, setMealTypes] = useState<MealType[]>(["Lunch", "Dinner"]);
  const [mainId, setMainId] = useState("");
  const [proteinIds, setProteinIds] = useState<string[]>([]);
  const [supplementaryIds, setSupplementaryIds] = useState<string[]>([]);
  const [sourceUrl, setSourceUrl] = useState("");

  const [creatingRole, setCreatingRole] = useState<"Main" | "Protein" | "Supplementary" | null>(null);
  const [newIngredientName, setNewIngredientName] = useState("");
  const [newIngredientInStock, setNewIngredientInStock] = useState(false);
  const [isCreatingIngredient, setIsCreatingIngredient] = useState(false);

  const mains = useMemo(() => ingredients.filter((i) => i.role === "Main"), [ingredients]);
  const proteins = useMemo(() => ingredients.filter((i) => i.role === "Protein"), [ingredients]);
  const sides = useMemo(() => ingredients.filter((i) => i.role === "Supplementary"), [ingredients]);

  const toggleMealType = (mt: MealType) => {
    if (mealTypes.includes(mt)) {
      if (mealTypes.length > 1) setMealTypes(mealTypes.filter((t) => t !== mt));
    } else {
      setMealTypes([...mealTypes, mt]);
    }
  };

  const handleInlineCreate = async () => {
    if (!newIngredientName.trim() || !creatingRole || isCreatingIngredient) return;
    setIsCreatingIngredient(true);
    const itemName = newIngredientName.trim();
    try {
      const res = await onAddSupply({
        name: itemName,
        role: creatingRole,
        mealTypes,
        available: newIngredientInStock,
        owner,
        kind: "ingredient",
      });

      const returnedId = res && typeof res === "object" && "id" in res ? res.id : undefined;
      const targetId = returnedId || ingredients.find(
        (i) => i.name.toLowerCase() === itemName.toLowerCase() && i.role === creatingRole
      )?.id;

      if (targetId) {
        if (creatingRole === "Main") setMainId(targetId);
        else if (creatingRole === "Protein") setProteinIds((prev) => [...prev, targetId]);
        else if (creatingRole === "Supplementary") setSupplementaryIds((prev) => [...prev, targetId]);
      }
      setNewIngredientName("");
      setNewIngredientInStock(false);
      setCreatingRole(null);
    } catch (err) {
      console.error("Failed to add ingredient inline:", err);
    } finally {
      setIsCreatingIngredient(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mainId || isSubmitting) return;
    await onSubmit({
      name: name.trim(),
      mealTypes,
      mainIngredientId: mainId,
      proteinId: proteinIds[0] || undefined,
      proteinIds,
      supplementaryId: supplementaryIds[0] || undefined,
      supplementaryIds,
      sourceUrl: sourceUrl.trim() || undefined,
      owner,
    });
  };

  const removeProtein = (id: string) => setProteinIds((prev) => prev.filter((p) => p !== id));
  const removeSide = (id: string) => setSupplementaryIds((prev) => prev.filter((s) => s !== id));

  const renderInlineAdd = (role: "Main" | "Protein" | "Supplementary", placeholder: string) => {
    if (creatingRole !== role) return null;
    return (
      <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border-2 border-amber-400 dark:border-amber-700 mb-2 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={placeholder}
            value={newIngredientName}
            onChange={(e) => setNewIngredientName(e.target.value)}
            className="flex-1 px-2.5 py-1 text-xs border border-stone-900 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
          />
          <button
            type="button"
            disabled={isCreatingIngredient || !newIngredientName.trim()}
            onClick={handleInlineCreate}
            className="px-3 py-1 bg-amber-300 dark:bg-amber-400 border border-stone-900 dark:border-amber-700 rounded-lg text-xs font-black text-stone-900 dark:text-stone-950 shadow-brutal-xs"
          >
            {isCreatingIngredient ? "Adding..." : "Add"}
          </button>
        </div>
        <label className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
          <input
            type="checkbox"
            checked={newIngredientInStock}
            onChange={(e) => setNewIngredientInStock(e.target.checked)}
            className="rounded border-stone-400 dark:border-stone-600"
          />
          I have this in stock now
        </label>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
          Recipe Name *
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Auntie Lola's Fried Rice"
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:bg-white dark:focus:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none shadow-brutal-xs dark:shadow-brutal-dark-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
          Suitable Meal Times *
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_MEAL_TYPES.map((mt) => (
            <button
              key={mt}
              type="button"
              onClick={() => toggleMealType(mt)}
              className={`px-3 py-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 text-xs font-black transition-all shadow-brutal-xs ${
                mealTypes.includes(mt) ? "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950" : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              {mt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Ingredient */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Main / Base Ingredient *
          </label>
          <button
            type="button"
            onClick={() => setCreatingRole(creatingRole === "Main" ? null : "Main")}
            className="text-[11px] font-black text-amber-700 dark:text-amber-400 hover:underline"
          >
            {creatingRole === "Main" ? "Cancel" : "+ Add New Main"}
          </button>
        </div>
        {renderInlineAdd("Main", "New base name...")}
        <select
          required
          value={mainId}
          onChange={(e) => setMainId(e.target.value)}
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:bg-white dark:focus:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none shadow-brutal-xs dark:shadow-brutal-dark-sm"
        >
          <option value="">Select Main Ingredient...</option>
          {mains.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} {m.available ? "• in stock" : "(out of stock)"}
            </option>
          ))}
        </select>
      </div>

      {/* Proteins (Multiple Supported) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Proteins (Optional, Multi-select)
          </label>
          <button
            type="button"
            onClick={() => setCreatingRole(creatingRole === "Protein" ? null : "Protein")}
            className="text-[11px] font-black text-amber-700 dark:text-amber-400 hover:underline"
          >
            {creatingRole === "Protein" ? "Cancel" : "+ Add New Protein"}
          </button>
        </div>
        {renderInlineAdd("Protein", "New protein name...")}
        {proteinIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {proteinIds.map((id) => {
              const p = proteins.find((item) => item.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 border-stone-900 dark:border-amber-700 bg-amber-200 dark:bg-amber-950/60 text-stone-900 dark:text-amber-300 text-xs font-black shadow-brutal-xs"
                >
                  {p ? p.name : "Protein"}
                  <button
                    type="button"
                    onClick={() => removeProtein(id)}
                    className="hover:text-red-600 dark:hover:text-red-400 font-black ml-0.5 text-sm"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
        <select
          value=""
          onChange={(e) => {
            if (e.target.value && !proteinIds.includes(e.target.value)) {
              setProteinIds([...proteinIds, e.target.value]);
            }
          }}
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:bg-white dark:focus:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none shadow-brutal-xs dark:shadow-brutal-dark-sm"
        >
          <option value="">+ Add Protein...</option>
          {proteins
            .filter((p) => !proteinIds.includes(p.id))
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.available ? "• in stock" : "(out of stock)"}
              </option>
            ))}
        </select>
      </div>

      {/* Sides / Supplementary (Multiple Supported) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Sides / Supplementary (Optional, Multi-select)
          </label>
          <button
            type="button"
            onClick={() => setCreatingRole(creatingRole === "Supplementary" ? null : "Supplementary")}
            className="text-[11px] font-black text-amber-700 dark:text-amber-400 hover:underline"
          >
            {creatingRole === "Supplementary" ? "Cancel" : "+ Add New Side"}
          </button>
        </div>
        {renderInlineAdd("Supplementary", "New side dish name...")}
        {supplementaryIds.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {supplementaryIds.map((id) => {
              const s = sides.find((item) => item.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 border-stone-900 dark:border-orange-700 bg-orange-200 dark:bg-orange-950/60 text-stone-900 dark:text-orange-300 text-xs font-black shadow-brutal-xs"
                >
                  {s ? s.name : "Side"}
                  <button
                    type="button"
                    onClick={() => removeSide(id)}
                    className="hover:text-red-600 dark:hover:text-red-400 font-black ml-0.5 text-sm"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
        <select
          value=""
          onChange={(e) => {
            if (e.target.value && !supplementaryIds.includes(e.target.value)) {
              setSupplementaryIds([...supplementaryIds, e.target.value]);
            }
          }}
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:bg-white dark:focus:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none shadow-brutal-xs dark:shadow-brutal-dark-sm"
        >
          <option value="">+ Add Side Dish...</option>
          {sides
            .filter((s) => !supplementaryIds.includes(s.id))
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.available ? "• in stock" : "(out of stock)"}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
          Source URL (Optional reference link)
        </label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://example.com/recipe"
          className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:bg-white dark:focus:bg-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none shadow-brutal-xs dark:shadow-brutal-dark-sm"
        />
      </div>

      <div className="pt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-black text-stone-700 dark:text-stone-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || !mainId}
          className="px-5 py-2 rounded-xl border-2 border-stone-900 dark:border-stone-950 bg-emerald-300 dark:bg-emerald-400 hover:bg-emerald-400 dark:hover:bg-emerald-300 text-stone-900 dark:text-stone-950 text-xs font-black shadow-brutal-xs dark:shadow-brutal-dark-sm active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save to My Recipes"}
        </button>
      </div>
    </form>
  );
};
