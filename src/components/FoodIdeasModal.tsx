"use client";

import {
  BowlFood,
  Check,
  CookingPot,
  Egg,
  Package,
  Plant,
  Plus,
  Sparkle,
  X,
} from "@/components/icons";
import {
  FOOD_IDEAS_CATALOGUE,
  filterFoodIdeas,
  FoodCategory,
  FoodIdea,
} from "@/lib/food-ideas-catalogue";
import { AddSupplyInput, Ingredient, ReadyMeal } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";

interface FoodIdeasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSupply: (input: AddSupplyInput) => Promise<void>;
  ingredients: Ingredient[];
  readyMeals: ReadyMeal[];
  owner?: string;
}

const CATEGORIES: { id: FoodCategory | "All"; label: string; icon: React.ReactNode }[] = [
  { id: "All", label: "All Ideas", icon: <Sparkle size={14} weight="bold" /> },
  { id: "Base", label: "Anchor Bases", icon: <BowlFood size={14} weight="bold" /> },
  { id: "Protein", label: "Protein Sources", icon: <Egg size={14} weight="bold" /> },
  { id: "Side", label: "Greens, Sides & Fats", icon: <Plant size={14} weight="bold" /> },
  { id: "ReadyMeal", label: "Ready Meals", icon: <CookingPot size={14} weight="bold" /> },
];

export const FoodIdeasModal: React.FC<FoodIdeasModalProps> = ({
  isOpen,
  onClose,
  onAddSupply,
  ingredients,
  readyMeals,
  owner,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [stockingId, setStockingId] = useState<string | null>(null);
  const [justStockedIds, setJustStockedIds] = useState<Set<string>>(new Set());

  // Set of lowercase names currently in the user's kitchen
  const stockedNames = useMemo(() => {
    const names = new Set<string>();
    ingredients.forEach((i) => names.add(i.name.toLowerCase().trim()));
    readyMeals.forEach((r) => names.add(r.name.toLowerCase().trim()));
    return names;
  }, [ingredients, readyMeals]);

  const filteredIdeas = useMemo(() => {
    return filterFoodIdeas(FOOD_IDEAS_CATALOGUE, {
      category: selectedCategory,
      query: searchQuery,
    });
  }, [selectedCategory, searchQuery]);

  const handleStock = async (idea: FoodIdea) => {
    if (stockingId) return;
    setStockingId(idea.id);

    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(12);
    }

    try {
      await onAddSupply({
        kind: idea.kind,
        name: idea.name,
        role: idea.kind === "ingredient" ? idea.role : undefined,
        mealTypes: idea.suitableMeals,
        owner,
      });

      setJustStockedIds((prev) => new Set(prev).add(idea.id));
    } catch (err) {
      console.error("Failed to stock food idea:", err);
    } finally {
      setStockingId(null);
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="food-ideas-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF8F5] border-[2.5px] border-stone-900 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg overflow-hidden"
        >
          {/* Mobile Pull Bar */}
          <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b-2 border-stone-900 shrink-0 bg-[#FAF8F5] gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-300 border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm flex items-center justify-center text-stone-900 shrink-0">
                <Sparkle size={20} weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  id="food-ideas-title"
                  className="text-base sm:text-xl font-display font-black tracking-tight text-stone-900 leading-snug"
                >
                  Food Ideas &amp; Inspiration
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 font-medium leading-normal">
                  Tap any staple to stock into your kitchen
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close food ideas modal"
              className="p-2 rounded-xl border-2 border-stone-900 bg-white shadow-brutal-xs sm:shadow-brutal-sm hover:bg-stone-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Controls: Search & Category Tabs */}
          <div className="p-4 sm:px-6 sm:py-3.5 border-b-2 border-stone-900 bg-stone-100/90 space-y-3 shrink-0">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search foods (e.g. Yam, Salmon, Oats, Stew)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-brutal-xs"
            />

            {/* Category Filter Pills */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1.5 pb-1 px-0.5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {CATEGORIES.map(({ id, label, icon }) => {
                const isActive = selectedCategory === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedCategory(id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 border-stone-900 ${
                      isActive
                        ? "bg-amber-300 text-stone-900 shadow-brutal-xs"
                        : "bg-white text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Ideas Grid */}
          <div
            className="flex-1 overflow-y-auto no-scrollbar modal-scroll-contain p-4 sm:p-6 min-h-0 space-y-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredIdeas.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border-2 border-dashed border-stone-300">
                <p className="text-sm font-bold text-stone-600">
                  No foods found matching &quot;{searchQuery}&quot;
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-xs font-black text-amber-700 underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredIdeas.map((idea) => {
                  const isStocked =
                    stockedNames.has(idea.name.toLowerCase().trim()) ||
                    justStockedIds.has(idea.id);
                  const isBusy = stockingId === idea.id;

                  return (
                    <div
                      key={idea.id}
                      className="p-4 bg-white border-2 border-stone-900 rounded-2xl shadow-brutal-xs flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-black text-sm text-stone-900 leading-snug">
                            {idea.name}
                          </h4>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-stone-900 bg-stone-100 text-stone-800">
                              {idea.kind === "ready_meal" ? "Ready Meal" : idea.role === "Main" ? "Anchor Base" : idea.role === "Protein" ? "Protein" : "Greens & Sides"}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white text-stone-500 border border-stone-300">
                              {idea.origin}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-600 mt-1 leading-relaxed line-clamp-2">
                          {idea.description}
                        </p>

                        {idea.nutrientTags && idea.nutrientTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {idea.nutrientTags.map((nt) => (
                              <span
                                key={nt}
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-300"
                              >
                                {nt}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-[11px] font-bold text-stone-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200 mt-2">
                          💡 <span className="font-black text-amber-950">Pair Idea:</span> {idea.combos}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          {idea.suitableMeals.map((m) => (
                            <span
                              key={m}
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600"
                            >
                              {m.slice(0, 1)}
                            </span>
                          ))}
                        </div>

                        {isStocked ? (
                          <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-400">
                            <Check size={13} weight="bold" />
                            <span>In Kitchen</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStock(idea)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 text-xs font-black text-stone-900 bg-amber-300 hover:bg-amber-200 px-3 py-1.5 rounded-xl border-2 border-stone-900 shadow-2xs active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
                          >
                            <Plus size={13} weight="bold" />
                            <span>{isBusy ? "Adding..." : idea.kind === "ready_meal" ? "+ Stock Meal" : "+ Stock Item"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-stone-900 bg-stone-100/90 shrink-0 flex items-center justify-between safe-area-bottom">
            <span className="text-xs font-bold text-stone-500">
              Showing {filteredIdeas.length} idea{filteredIdeas.length === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl font-bold text-xs bg-stone-900 text-white border-2 border-stone-900 shadow-brutal-sm hover:bg-stone-800 transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
