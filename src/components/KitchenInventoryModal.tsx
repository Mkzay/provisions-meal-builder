"use client";

import {
  BowlFood,
  Check,
  CookingPot,
  Package,
  Plus,
  Sparkle,
  TrashSimple,
  X,
} from "@/components/icons";
import { Ingredient, MealType, ReadyMeal } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useState } from "react";

interface KitchenInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: Ingredient[];
  readyMeals: ReadyMeal[];
  onToggleAvailability: (id: string, kind: "ingredient" | "ready_meal", available: boolean) => void;
  onDeleteSupply: (id: string, kind: "ingredient" | "ready_meal") => void;
  onOpenAddSupply: () => void;
  onOpenFoodIdeas?: () => void;
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
  onDeleteSupply,
  onOpenAddSupply,
  onOpenFoodIdeas,
  owner,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

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
    onDeleteSupply(item.id, item.kind);
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
          className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF8F5] border-[2.5px] border-stone-900 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg overflow-hidden"
        >
          <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b-2 border-stone-900 shrink-0 bg-[#FAF8F5] gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-300 border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm flex items-center justify-center text-stone-900 shrink-0">
                <Package size={20} weight="fill" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-display font-black tracking-tight text-stone-900 truncate">
                  Kitchen Stock &amp; Inventory
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-600 font-medium truncate">
                  {inStockCount} in stock • {outOfStockCount} out of stock • {owner}&apos;s kitchen
                </p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close inventory modal" className="p-1.5 sm:p-2 rounded-xl border-2 border-stone-900 bg-white shadow-brutal-xs sm:shadow-brutal-sm hover:bg-stone-100 active:translate-x-[1px] active:translate-y-[1px] transition-all shrink-0">
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-3.5 sm:px-6 sm:py-3 border-b-2 border-stone-900 bg-stone-100/90 space-y-3 shrink-0">
            <input
              type="text"
              placeholder="Search pantry items (e.g. Eggs, Yam, Rice)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-brutal-xs"
            />
            <div
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1.5 pb-1 px-0.5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 border-stone-900 ${statusFilter === "all" ? "bg-stone-900 text-white shadow-brutal-xs" : "bg-white text-stone-700 hover:bg-stone-50"}`}
              >
                All ({allItems.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("in_stock")}
                className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 border-stone-900 ${statusFilter === "in_stock" ? "bg-emerald-400 text-stone-900 shadow-brutal-xs" : "bg-white text-stone-700 hover:bg-stone-50"}`}
              >
                In Stock ({inStockCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("out_of_stock")}
                className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 border-stone-900 ${statusFilter === "out_of_stock" ? "bg-rose-300 text-stone-900 shadow-brutal-xs" : "bg-white text-stone-700 hover:bg-stone-50"}`}
              >
                Out of Stock ({outOfStockCount})
              </button>
              <span className="w-[1px] h-4 bg-stone-300 mx-1 shrink-0" />
              {(["all", "Main", "Protein", "Supplementary", "Ready Meal"] as CategoryFilter[]).map((cat) => {
                if (cat === "all") return null;
                const isCatActive = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(isCatActive ? "all" : cat)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black whitespace-nowrap transition-all border border-stone-900 ${isCatActive ? "bg-amber-300 text-stone-900 shadow-brutal-xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
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
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 px-4 bg-white rounded-2xl border-2 border-dashed border-stone-300 space-y-2">
                <p className="text-sm font-bold text-stone-700">No items found matching your filters.</p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button onClick={onOpenAddSupply} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-900 bg-amber-300 text-stone-900 text-xs font-black shadow-brutal-xs">
                    <Plus size={14} weight="bold" />
                    <span>Add New Item</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border-2 border-stone-900 shadow-brutal-xs transition-all gap-3 ${item.available ? "bg-white" : "bg-stone-100/80 opacity-85"}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-xl border-2 border-stone-900 flex items-center justify-center shrink-0 ${item.kind === "ready_meal" ? "bg-amber-200" : item.role === "Protein" ? "bg-rose-200" : item.role === "Supplementary" ? "bg-emerald-200" : "bg-orange-200"}`}>
                      {item.kind === "ready_meal" ? <CookingPot size={16} weight="duotone" className="text-stone-900" /> : <BowlFood size={16} weight="duotone" className="text-stone-900" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs sm:text-sm font-black text-stone-900 truncate ${!item.available ? "line-through text-stone-500" : ""}`}>
                          {item.name}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-stone-900 bg-stone-100 text-stone-700">
                          {item.role || (item.kind === "ready_meal" ? "Ready" : "Staple")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-stone-500 font-medium truncate">{item.mealTypes.join(" • ")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      aria-label={`Mark ${item.name} as ${item.available ? "out of stock" : "in stock"}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-900 text-xs font-black transition-all shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] ${
                        item.available ? "bg-emerald-300 hover:bg-emerald-400 text-stone-900" : "bg-stone-200 hover:bg-stone-300 text-stone-600"
                      }`}
                    >
                      {item.available ? (<><Check size={13} weight="bold" /><span>In Stock</span></>) : (<><X size={13} weight="bold" /><span>Out of Stock</span></>)}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      aria-label={`Remove ${item.name} from kitchen`}
                      className="p-1.5 rounded-xl border-2 border-stone-900 bg-white hover:bg-rose-100 text-stone-600 hover:text-rose-700 active:translate-x-[1px] active:translate-y-[1px] transition-all shadow-brutal-xs shrink-0"
                    >
                      <TrashSimple size={15} weight="bold" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 sm:px-6 sm:py-3.5 border-t-2 border-stone-900 bg-[#FAF8F5] flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { onClose(); onOpenAddSupply(); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-900 bg-amber-300 hover:bg-amber-400 text-stone-900 text-xs font-black shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] transition-all"
              >
                <Plus size={14} weight="bold" />
                <span>+ Add Item</span>
              </button>
              {onOpenFoodIdeas && (
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenFoodIdeas(); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-900 bg-white hover:bg-stone-100 text-stone-900 text-xs font-black shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] transition-all"
                >
                  <Sparkle size={13} weight="fill" className="text-amber-600" />
                  <span>Food Ideas</span>
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border-2 border-stone-900 bg-stone-900 text-white text-xs font-black hover:bg-stone-800 transition-all shadow-brutal-xs"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
