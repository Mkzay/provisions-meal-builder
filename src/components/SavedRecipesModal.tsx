"use client";

import {
  BookmarkSimple,
  Check,
  CookingPot,
  Plus,
  TrashSimple,
  X,
} from "@/components/icons";
import { AddSupplyInput, CreateSavedRecipeInput, Ingredient, SavedRecipe } from "@/lib/types";
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
  onDeleteRecipe,
  onCookRecipe,
  owner,
}) => {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stockMap = useMemo(() => {
    const map = new Map<string, boolean>();
    ingredients.forEach((i) => map.set(i.id, i.available));
    return map;
  }, [ingredients]);

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white border-t-2 sm:border-2 border-stone-900 rounded-t-3xl sm:rounded-3xl shadow-brutal p-5 sm:p-7 max-h-[85vh] sm:max-h-[90vh] flex flex-col"
        >
          {/* Mobile Bottom Drawer Drag Handle */}
          <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-3 sm:hidden shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-stone-900/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-200 border-2 border-stone-900 shadow-brutal-xs">
                <BookmarkSimple size={20} weight="fill" className="text-stone-900" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-display font-black text-stone-900">
                  {owner}&apos;s Saved Recipes
                </h2>
                <p className="text-xs text-stone-500 font-semibold">
                  Personal recipes surfaced automatically when in stock
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border-2 border-stone-900 bg-stone-100 hover:bg-stone-200 text-stone-900 shadow-brutal-xs transition-transform active:translate-x-0.5 active:translate-y-0.5"
              aria-label="Close modal"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 pt-4 pb-3 shrink-0">
            <button
              onClick={() => setActiveTab("list")}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-black rounded-xl border-2 border-stone-900 transition-all shadow-brutal-xs ${
                activeTab === "list" ? "bg-amber-300 text-stone-900" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              My Recipes ({savedRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-black rounded-xl border-2 border-stone-900 transition-all shadow-brutal-xs flex items-center justify-center gap-1.5 ${
                activeTab === "create" ? "bg-emerald-300 text-stone-900" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <Plus size={14} weight="bold" />
              <span>Save New Recipe</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-3 min-h-0">
            {activeTab === "list" ? (
              savedRecipes.length === 0 ? (
                <div className="text-center py-10 px-4 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300">
                  <BookmarkSimple size={36} className="mx-auto text-stone-400 mb-2" />
                  <h3 className="text-base font-black text-stone-800">No saved recipes yet</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                    Save personal favorite recipes from family, friends, or online. They will get prioritized in suggestions whenever ingredients are in stock.
                  </p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl bg-amber-300 border-2 border-stone-900 shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <Plus size={14} weight="bold" />
                    <span>Save Your First Recipe</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedRecipes.map((recipe) => {
                    const mainInStock = recipe.mainIngredientId
                      ? (stockMap.get(recipe.mainIngredientId) ?? false)
                      : false;

                    const pIds = recipe.proteinIds?.length ? recipe.proteinIds : (recipe.proteinId ? [recipe.proteinId] : []);
                    const missingProteins: string[] = [];
                    pIds.forEach((pid, idx) => {
                      if (!(stockMap.get(pid) ?? false)) {
                        const pName = recipe.proteinNames?.[idx] || (pid === recipe.proteinId ? recipe.proteinName : undefined) || "Protein";
                        missingProteins.push(pName);
                      }
                    });

                    const sIds = recipe.supplementaryIds?.length ? recipe.supplementaryIds : (recipe.supplementaryId ? [recipe.supplementaryId] : []);
                    const missingSupps: string[] = [];
                    sIds.forEach((sid, idx) => {
                      if (!(stockMap.get(sid) ?? false)) {
                        const sName = recipe.supplementaryNames?.[idx] || (sid === recipe.supplementaryId ? recipe.supplementaryName : undefined) || "Side";
                        missingSupps.push(sName);
                      }
                    });

                    const missingNames: string[] = [];
                    if (!mainInStock) missingNames.push(recipe.mainIngredientName || "Base");
                    missingNames.push(...missingProteins);
                    missingNames.push(...missingSupps);

                    const allInStock = missingNames.length === 0;
                    const proteinDisplay = recipe.proteinNames?.length ? recipe.proteinNames.join(" + ") : recipe.proteinName;
                    const suppDisplay = recipe.supplementaryNames?.length ? recipe.supplementaryNames.join(" + ") : recipe.supplementaryName;

                    return (
                      <div
                        key={recipe.id}
                        className="p-4 rounded-2xl border-2 border-stone-900 bg-white shadow-brutal-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display font-black text-stone-900 text-sm sm:text-base truncate">
                              {recipe.name}
                            </span>
                            {allInStock ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-800">
                                <Check size={10} weight="bold" />
                                <span>All in stock</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-800 truncate max-w-[220px]">
                                Missing: {missingNames.join(", ")}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 font-medium">
                            <span className="font-bold text-stone-800">{recipe.mainIngredientName}</span>
                            {proteinDisplay && <span>+ {proteinDisplay}</span>}
                            {suppDisplay && <span>+ {suppDisplay}</span>}
                          </div>

                          <div className="flex items-center gap-2 pt-0.5">
                            {recipe.mealTypes.map((mt) => (
                              <span key={mt} className="text-[10px] font-black px-1.5 py-0.5 bg-stone-100 rounded border border-stone-300 text-stone-600">
                                {mt}
                              </span>
                            ))}
                            {recipe.sourceUrl && (
                              <a
                                href={recipe.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] font-bold text-amber-700 underline hover:text-amber-800 ml-1"
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
                              className="px-3 py-1.5 rounded-xl border-2 border-stone-900 bg-amber-300 hover:bg-amber-400 text-stone-900 text-xs font-black shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1"
                            >
                              <CookingPot size={14} weight="bold" />
                              <span>Cook This</span>
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteRecipe(recipe.id)}
                            className="p-1.5 rounded-xl border-2 border-stone-900 bg-rose-100 hover:bg-rose-200 text-rose-800 shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all"
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
            ) : (
              <SavedRecipeForm
                ingredients={ingredients}
                owner={owner}
                onAddSupply={onAddSupply}
                onSubmit={handleCreateRecipe}
                onCancel={() => setActiveTab("list")}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
