"use client";

import {
  BowlFood,
  Check,
  CookingPot,
  Package,
  PencilSimple,
  Plus,
  Sparkle,
  TrashSimple,
  X,
} from "@/components/icons";
import { Ingredient, MealType, ReadyMeal } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { EditSupplyModal } from "./EditSupplyModal";

interface KitchenInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  readyMeals: ReadyMeal[];
  onToggleAvailability: (id: string, kind: "ingredient" | "ready_meal", available: boolean) => void;
  onUpdateSupply?: (
    id: string,
    kind: "ingredient" | "ready_meal",
    updates: { name: string; role?: "Main" | "Protein" | "Supplementary"; mealTypes: MealType[] }
  ) => Promise<void>;
  onDeleteSupply: (id: string, kind: "ingredient" | "ready_meal", name?: string) => void;
  onOpenAddSupply: () => void;
  onOpenFoodIdeas?: () => void;
  onSeedStarterIngredients?: () => Promise<void> | void;
  owner: string;
}

type StatusFilter = "all" | "in_stock" | "out_of_stock";
type CategoryFilter = "all" | "Main" | "Protein" | "Supplementary" | "Ready Meal";

interface InventoryRowItem {
  id: string;
  name: string;
  kind: "ingredient" | "ready_meal";
  role?: string;
  mealTypes: MealType[];
  available: boolean;
}

export const KitchenInventoryModal: React.FC<KitchenInventoryModalProps> = ({
  isOpen,
  onClose,
  ingredients,
  readyMeals,
  onToggleAvailability,
  onUpdateSupply,
  onDeleteSupply,
  onOpenAddSupply,
  onOpenFoodIdeas,
  onSeedStarterIngredients,
  owner,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [isSeeding, setIsSeeding] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryRowItem | null>(null);

  const allItems: InventoryRowItem[] = useMemo(() => {
    const list: InventoryRowItem[] = [];
    readyMeals.forEach((m) => {
      list.push({ id: m.id, name: m.name, kind: "ready_meal", role: "Ready Meal", mealTypes: m.mealTypes, available: m.available });
    });
    ingredients.forEach((ing) => {
      list.push({ id: ing.id, name: ing.name, kind: "ingredient", role: ing.role, mealTypes: ing.mealTypes, available: ing.available });
    });
    return list;
  }, [ingredients, readyMeals]);

  const inStockCount = useMemo(() => allItems.filter((i) => i.available).length, [allItems]);
  const outOfStockCount = allItems.length - inStockCount;

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      if (statusFilter === "in_stock" && !item.available) return false;
      if (statusFilter === "out_of_stock" && item.available) return false;
      if (categoryFilter !== "all") {
        if (categoryFilter === "Ready Meal" && item.kind !== "ready_meal") return false;
        if (categoryFilter !== "Ready Meal" && item.role !== categoryFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return item.name.toLowerCase().includes(q) || (item.role && item.role.toLowerCase().includes(q));
      }
      return true;
    });
  }, [allItems, statusFilter, categoryFilter, searchQuery]);

  const handleToggle = (item: InventoryRowItem) => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) window.navigator.vibrate(10);
    onToggleAvailability(item.id, item.kind, !item.available);
  };

  const handleDelete = (item: InventoryRowItem) => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) window.navigator.vibrate(15);
    onDeleteSupply(item.id, item.kind, item.name);
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs" role="dialog" aria-modal="true">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF8F5] dark:bg-[#141210] border-[2.5px] border-stone-900 dark:border-stone-700 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg dark:shadow-brutal-dark overflow-hidden"
        >
          <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-stone-900 dark:border-stone-700 shrink-0 bg-[#FAF8F5] dark:bg-[#141210] gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-300 dark:bg-emerald-950/60 border-2 border-stone-900 dark:border-emerald-700 shadow-brutal-xs sm:shadow-brutal-sm dark:shadow-brutal-dark-sm flex items-center justify-center text-stone-900 dark:text-emerald-300 shrink-0">
                <Package size={20} weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-display font-black tracking-tight text-stone-900 dark:text-stone-100 truncate">
                  Kitchen Stock &amp; Inventory
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-400 font-medium truncate">
                  {inStockCount} in stock • {outOfStockCount} out of stock • {owner}&apos;s kitchen
                </p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close inventory modal" className="p-1.5 sm:p-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-brutal-xs sm:shadow-brutal-sm dark:shadow-brutal-dark-sm hover:bg-stone-100 dark:hover:bg-stone-700 active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0">
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-3.5 sm:px-6 sm:py-3 border-b-2 border-stone-900 dark:border-stone-700 bg-stone-100/90 dark:bg-stone-900/90 space-y-3 shrink-0">
            <input
              type="text"
              placeholder="Search pantry items (e.g. Eggs, Yam, Rice)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-brutal-xs dark:shadow-brutal-dark-sm"
            />
            <div
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1.5 pb-1 px-0.5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 border-stone-900 dark:border-stone-700 ${statusFilter === "all" ? "bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 shadow-brutal-xs dark:shadow-brutal-dark-sm" : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"}`}
              >
                All ({allItems.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("in_stock")}
                className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 border-stone-900 dark:border-stone-700 ${statusFilter === "in_stock" ? "bg-emerald-400 dark:bg-emerald-900/60 text-stone-900 dark:text-emerald-200 shadow-brutal-xs dark:shadow-brutal-dark-sm" : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"}`}
              >
                In Stock ({inStockCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("out_of_stock")}
                className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 border-stone-900 dark:border-stone-700 ${statusFilter === "out_of_stock" ? "bg-rose-300 dark:bg-rose-900/60 text-stone-900 dark:text-rose-200 shadow-brutal-xs dark:shadow-brutal-dark-sm" : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"}`}
              >
                Out of Stock ({outOfStockCount})
              </button>
              <span className="w-[1px] h-4 bg-stone-300 dark:bg-stone-700 mx-1 shrink-0" />
              {(["all", "Main", "Protein", "Supplementary", "Ready Meal"] as CategoryFilter[]).map((cat) => {
                if (cat === "all") return null;
                const isCatActive = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(isCatActive ? "all" : cat)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black whitespace-nowrap transition-all border border-stone-900 dark:border-stone-700 ${isCatActive ? "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950 shadow-brutal-xs dark:shadow-brutal-dark-sm" : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item List */}
          <div
            className="flex-1 overflow-y-auto no-scrollbar p-3.5 sm:p-6 min-h-0 space-y-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {allItems.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white dark:bg-stone-900/90 rounded-3xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-200 dark:bg-amber-950/60 border-2 border-stone-900 dark:border-amber-700 text-stone-900 dark:text-amber-300 flex items-center justify-center mx-auto shadow-brutal-xs dark:shadow-brutal-dark-sm">
                  <Package size={24} weight="bold" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-stone-900 dark:text-stone-100">Your kitchen is empty</h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-medium max-w-sm mx-auto">
                    Start fresh by adding your own items, or load standard Nigerian starter ingredients.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                  {onSeedStarterIngredients && (
                    <button
                      type="button"
                      disabled={isSeeding}
                      onClick={async () => {
                        setIsSeeding(true);
                        try {
                          await onSeedStarterIngredients();
                        } finally {
                          setIsSeeding(false);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border-2 border-stone-900 dark:border-amber-700 bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 dark:hover:bg-amber-300 text-stone-900 dark:text-stone-950 text-xs font-black shadow-brutal-xs dark:shadow-brutal-dark-sm active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-50"
                    >
                      <Sparkle size={14} weight="fill" className={isSeeding ? "animate-spin" : "text-amber-700 dark:text-amber-900"} />
                      <span>{isSeeding ? "Loading Starter Staples..." : "Load Starter Ingredients (Staples)"}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onOpenAddSupply}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs font-black shadow-brutal-xs dark:shadow-brutal-dark-sm active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  >
                    <Plus size={14} weight="bold" />
                    <span>+ Add Manually</span>
                  </button>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white dark:bg-stone-900/60 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 space-y-2">
                <p className="text-sm font-bold text-stone-700 dark:text-stone-300">No items found matching your filters.</p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button onClick={onOpenAddSupply} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-900 dark:border-amber-700 bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950 text-xs font-black shadow-brutal-xs dark:shadow-brutal-dark-sm">
                    <Plus size={14} weight="bold" />
                    <span>Add New Item</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm transition-all gap-3 ${item.available ? "bg-white dark:bg-stone-800/90" : "bg-stone-100/80 dark:bg-stone-900/50 opacity-85"}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-xl border-2 border-stone-900 dark:border-stone-700 flex items-center justify-center shrink-0 ${item.kind === "ready_meal" ? "bg-amber-200 dark:bg-amber-950/70 text-stone-900 dark:text-amber-300" : item.role === "Protein" ? "bg-rose-200 dark:bg-rose-950/70 text-stone-900 dark:text-rose-300" : item.role === "Supplementary" ? "bg-emerald-200 dark:bg-emerald-950/70 text-stone-900 dark:text-emerald-300" : "bg-orange-200 dark:bg-orange-950/70 text-stone-900 dark:text-orange-300"}`}>
                      {item.kind === "ready_meal" ? <CookingPot size={16} weight="duotone" /> : <BowlFood size={16} weight="duotone" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 truncate ${!item.available ? "line-through text-stone-500 dark:text-stone-500" : ""}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-stone-900 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {item.role || (item.kind === "ready_meal" ? "Ready" : "Staple")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium truncate">{item.mealTypes.join(" • ")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      aria-label={`Mark ${item.name} as ${item.available ? "out of stock" : "in stock"}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 text-xs font-black transition-all shadow-brutal-xs dark:shadow-brutal-dark-sm active:translate-x-[1px] active:translate-y-[1px] ${
                        item.available ? "bg-emerald-300 dark:bg-emerald-900/60 hover:bg-emerald-400 dark:hover:bg-emerald-800 text-stone-900 dark:text-emerald-200" : "bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      {item.available ? (<><Check size={13} weight="bold" /><span>In Stock</span></>) : (<><X size={13} weight="bold" /><span>Out of Stock</span></>)}
                    </button>
                    {onUpdateSupply && (
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        aria-label={`Edit ${item.name}`}
                        className="p-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 active:translate-x-[1px] active:translate-y-[1px] transition-all shadow-brutal-xs dark:shadow-brutal-dark-sm shrink-0"
                        title="Edit staple / meal"
                      >
                        <PencilSimple size={15} weight="bold" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      aria-label={`Remove ${item.name} from kitchen`}
                      className="p-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-stone-600 dark:text-stone-400 hover:text-rose-700 dark:hover:text-rose-300 active:translate-x-[1px] active:translate-y-[1px] transition-all shadow-brutal-xs dark:shadow-brutal-dark-sm shrink-0"
                    >
                      <TrashSimple size={15} weight="bold" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:px-6 sm:py-3.5 border-t-2 border-stone-900 dark:border-stone-700 bg-[#FAF8F5] dark:bg-[#141210] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onClose(); onOpenAddSupply(); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-900 dark:border-amber-700 bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 dark:hover:bg-amber-300 text-stone-900 dark:text-stone-950 text-xs font-black shadow-brutal-xs dark:shadow-brutal-dark-sm active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                <Plus size={14} weight="bold" />
                <span>+ Add Item</span>
              </button>
              {onOpenFoodIdeas && (
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenFoodIdeas(); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs font-black shadow-brutal-xs dark:shadow-brutal-dark-sm active:translate-x-[1px] active:translate-y-[1px] transition-all"
                >
                  <Sparkle size={13} weight="fill" className="text-amber-600 dark:text-amber-400" />
                  <span>Food Ideas</span>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-950 bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 text-xs font-black hover:bg-stone-800 dark:hover:bg-amber-300 transition-all shadow-brutal-xs dark:shadow-brutal-dark-sm"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>

      {editingItem && onUpdateSupply && (
        <EditSupplyModal
          isOpen={!!editingItem}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={async (id, kind, updates) => {
            await onUpdateSupply(id, kind, updates);
          }}
        />
      )}
    </AnimatePresence>
  );
};
