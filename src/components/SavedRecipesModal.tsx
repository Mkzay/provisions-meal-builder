"use client";

import {
  BookmarkSimple,
  Check,
  CookingPot,
  PencilSimple,
  Plus,
  TrashSimple,
  X,
} from "@/components/icons";
import { normalizeFoodName } from "@/lib/nutrient-curation";
import {
  AddSupplyInput,
  CreateSavedRecipeInput,
  Ingredient,
  SavedRecipe,
  UpdateSavedRecipeInput,
} from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { SavedRecipeForm } from "./SavedRecipeForm";

interface SavedRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecipes: SavedRecipe[];
  ingredients: Ingredient[];
  onAddSupply: (input: AddSupplyInput) => Promise<{ success: boolean; id?: string } | void>;
  onCreateRecipe: (input: CreateSavedRecipeInput) => Promise<{ success: boolean; id?: string }>;
  onUpdateRecipe?: (id: string, input: UpdateSavedRecipeInput) => Promise<{ success: boolean }>;
  onDeleteRecipe: (id: string) => Promise<{ success: boolean }>;
  onCookRecipe?: (recipe: SavedRecipe) => void;
  owner: string;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({
  isOpen,
  onClose,
  savedRecipes,
  ingredients,
  onAddSupply,
  onCreateRecipe,
  onUpdateRecipe,
  onDeleteRecipe,
  onCookRecipe,
  owner,
}) => {
  const [activeTab, setActiveTab] = useState<"list" | "create" | "edit">("list");
  const [editingRecipe, setEditingRecipe] = useState<SavedRecipe | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stockMap = useMemo(() => {
    const idMap = new Map<string, boolean>();
    const nameMap = new Map<string, boolean>();
    ingredients.forEach((i) => {
      idMap.set(i.id, i.available);
      if (i.name) nameMap.set(normalizeFoodName(i.name), i.available);
    });
    return { idMap, nameMap };
  }, [ingredients]);

  const isIngredientInStock = (id?: string, name?: string): boolean => {
    if (id && stockMap.idMap.has(id)) return stockMap.idMap.get(id)!;
    if (name && stockMap.nameMap.has(normalizeFoodName(name))) {
      return stockMap.nameMap.get(normalizeFoodName(name))!;
    }
    return false;
  };

  const getIngredientDisplayName = (id?: string, fallbackName?: string): string => {
    if (id) {
      const found = ingredients.find((i) => i.id === id);
      if (found?.name) return found.name;
    }
    if (fallbackName) {
      const norm = normalizeFoodName(fallbackName);
      const found = ingredients.find((i) => normalizeFoodName(i.name) === norm);
      if (found?.name) return found.name;
      return fallbackName;
    }
    return "Ingredient";
  };

  const handleCreateRecipe = async (input: CreateSavedRecipeInput) => {
    setIsSubmitting(true);
    try {
      const res = await onCreateRecipe(input);
      if (res.success) {
        setActiveTab("list");
      }
    } catch (err) {
      console.error("Error creating recipe:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRecipe = async (input: CreateSavedRecipeInput) => {
    if (!editingRecipe || !onUpdateRecipe) return;
    setIsSubmitting(true);
    try {
      const res = await onUpdateRecipe(editingRecipe.id, {
        name: input.name,
        mealTypes: input.mealTypes,
        mainIngredientId: input.mainIngredientId,
        mainIngredientName: input.mainIngredientName,
        proteinIds: input.proteinIds,
        proteinNames: input.proteinNames,
        supplementaryIds: input.supplementaryIds,
        supplementaryNames: input.supplementaryNames,
        sourceUrl: input.sourceUrl,
      });
      if (res.success) {
        setEditingRecipe(null);
        setActiveTab("list");
      }
    } catch (err) {
      console.error("Error updating recipe:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#141210] border-t-2 sm:border-2 border-stone-900 dark:border-stone-700 rounded-t-3xl sm:rounded-3xl shadow-brutal dark:shadow-brutal-dark p-5 sm:p-7 max-h-[85vh] sm:max-h-[90vh] flex flex-col"
        >
          {/* Mobile Bottom Drawer Drag Handle */}
          <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-3 sm:hidden shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-stone-900/10 dark:border-stone-700/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-200 dark:bg-orange-950/60 border-2 border-stone-900 dark:border-orange-700 shadow-brutal-xs">
                <BookmarkSimple size={20} weight="fill" className="text-stone-900 dark:text-orange-300" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-display font-black text-stone-900 dark:text-stone-100">
                  {owner}&apos;s Saved Recipes
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">
                  Personal recipes surfaced automatically when in stock
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-brutal-xs transition-transform active:translate-x-0.5 active:translate-y-0.5"
              aria-label="Close modal"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 pt-4 pb-3 shrink-0">
            <button
              onClick={() => {
                setEditingRecipe(null);
                setActiveTab("list");
              }}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-black rounded-xl border-2 border-stone-900 dark:border-stone-700 transition-all shadow-brutal-xs ${
                activeTab === "list" ? "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              My Recipes ({savedRecipes.length})
            </button>
            <button
              onClick={() => {
                setEditingRecipe(null);
                setActiveTab("create");
              }}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-black rounded-xl border-2 border-stone-900 dark:border-stone-700 transition-all shadow-brutal-xs flex items-center justify-center gap-1.5 ${
                activeTab === "create" ? "bg-emerald-300 dark:bg-emerald-900/70 text-stone-900 dark:text-emerald-200" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
              }`}
            >
              <Plus size={14} weight="bold" />
              <span>Save New Recipe</span>
            </button>
            {activeTab === "edit" && editingRecipe && (
              <div className="py-2 px-3 text-xs sm:text-sm font-black rounded-xl border-2 border-stone-900 dark:border-amber-700 bg-amber-400 dark:bg-amber-500 text-stone-900 dark:text-stone-950 shadow-brutal-xs flex items-center gap-1.5 shrink-0">
                <PencilSimple size={14} weight="bold" />
                <span className="truncate max-w-[120px]">Edit Recipe</span>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-3 min-h-0">
            {activeTab === "list" ? (
              savedRecipes.length === 0 ? (
                <div className="text-center py-10 px-4 bg-stone-50 dark:bg-stone-900/60 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700">
                  <BookmarkSimple size={36} className="mx-auto text-stone-400 dark:text-stone-500 mb-2" />
                  <h3 className="text-base font-black text-stone-800 dark:text-stone-200">No saved recipes yet</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1 mb-4">
                    Save personal favorite recipes from family, friends, or online. They will get prioritized in suggestions whenever ingredients are in stock.
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl bg-amber-300 dark:bg-amber-400 border-2 border-stone-900 dark:border-stone-700 text-stone-900 dark:text-stone-950 shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <Plus size={14} weight="bold" />
                    <span>Save Your First Recipe</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedRecipes.map((recipe) => {
                    const mainInStock = isIngredientInStock(recipe.mainIngredientId, recipe.mainIngredientName);

                    const pIds = recipe.proteinIds?.length ? recipe.proteinIds : (recipe.proteinId ? [recipe.proteinId] : []);
                    const missingProteins: string[] = [];
                    pIds.forEach((pid, idx) => {
                      const pName = recipe.proteinNames?.[idx] || (pid === recipe.proteinId ? recipe.proteinName : undefined);
                      if (!isIngredientInStock(pid, pName)) {
                        missingProteins.push(getIngredientDisplayName(pid, pName));
                      }
                    });

                    const sIds = recipe.supplementaryIds?.length ? recipe.supplementaryIds : (recipe.supplementaryId ? [recipe.supplementaryId] : []);
                    const missingSupps: string[] = [];
                    sIds.forEach((sid, idx) => {
                      const sName = recipe.supplementaryNames?.[idx] || (sid === recipe.supplementaryId ? recipe.supplementaryName : undefined);
                      if (!isIngredientInStock(sid, sName)) {
                        missingSupps.push(getIngredientDisplayName(sid, sName));
                      }
                    });

                    const missingNames: string[] = [];
                    if (!mainInStock) missingNames.push(getIngredientDisplayName(recipe.mainIngredientId, recipe.mainIngredientName));
                    missingNames.push(...missingProteins);
                    missingNames.push(...missingSupps);

                    const allInStock = missingNames.length === 0;
                    const proteinDisplay = recipe.proteinNames?.length ? recipe.proteinNames.join(" + ") : recipe.proteinName;
                    const suppDisplay = recipe.supplementaryNames?.length ? recipe.supplementaryNames.join(" + ") : recipe.supplementaryName;

                    return (
                      <div
                        key={recipe.id}
                        className="p-4 rounded-2xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800/90 shadow-brutal-xs dark:shadow-brutal-dark-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display font-black text-stone-900 dark:text-stone-100 text-sm sm:text-base truncate">
                              {recipe.name}
                            </span>
                            {allInStock ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-800 dark:border-emerald-700">
                                <Check size={10} weight="bold" />
                                <span>All in stock</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-800 dark:border-rose-700 truncate max-w-[220px]">
                                Missing: {missingNames.join(", ")}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 font-medium">
                            <span className="font-bold text-stone-800 dark:text-stone-200">{recipe.mainIngredientName}</span>
                            {proteinDisplay && <span>+ {proteinDisplay}</span>}
                            {suppDisplay && <span>+ {suppDisplay}</span>}
                          </div>

                          <div className="flex items-center gap-2 pt-0.5">
                            {recipe.mealTypes.map((mt) => (
                              <span key={mt} className="text-[10px] font-black px-1.5 py-0.5 bg-stone-100 dark:bg-stone-700 rounded border border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-300">
                                {mt}
                              </span>
                            ))}
                            {recipe.sourceUrl && (
                              <a
                                href={recipe.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] font-bold text-amber-700 dark:text-amber-400 underline hover:text-amber-800 dark:hover:text-amber-300 ml-1"
                              >
                                Source link
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          {onCookRecipe && (
                            <button
                              onClick={() => {
                                onCookRecipe(recipe);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-xl border-2 border-stone-900 dark:border-amber-700 bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 dark:hover:bg-amber-300 text-stone-900 dark:text-stone-950 text-xs font-black shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1"
                            >
                              <CookingPot size={14} weight="bold" />
                              <span>Cook This</span>
                            </button>
                          )}
                          {onUpdateRecipe && (
                            <button
                              onClick={() => {
                                setEditingRecipe(recipe);
                                setActiveTab("edit");
                              }}
                              className="p-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all"
                              title="Edit recipe"
                              aria-label="Edit recipe"
                            >
                              <PencilSimple size={15} weight="bold" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteRecipe(recipe.id)}
                            className="p-1.5 rounded-xl border-2 border-stone-900 dark:border-rose-700 bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-800 dark:text-rose-300 shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all"
                            title="Delete recipe"
                            aria-label="Delete recipe"
                          >
                            <TrashSimple size={15} weight="bold" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : activeTab === "create" ? (
              <SavedRecipeForm
                ingredients={ingredients}
                owner={owner}
                onAddSupply={onAddSupply}
                onSubmit={handleCreateRecipe}
                onCancel={() => setActiveTab("list")}
                isSubmitting={isSubmitting}
              />
            ) : (
              <SavedRecipeForm
                key={editingRecipe?.id}
                ingredients={ingredients}
                owner={owner}
                onAddSupply={onAddSupply}
                onSubmit={handleUpdateRecipe}
                onCancel={() => {
                  setEditingRecipe(null);
                  setActiveTab("list");
                }}
                isSubmitting={isSubmitting}
                initialRecipe={editingRecipe ?? undefined}
                isEdit={true}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
