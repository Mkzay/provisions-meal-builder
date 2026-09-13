"use client";

import { ClassifiedBulkItem } from "@/lib/culinary-classifier";
import { IngredientRole, MealType } from "@/lib/types";
import React from "react";

interface AddSupplyBulkTabProps {
  bulkText: string;
  setBulkText: (v: string) => void;
  items: ClassifiedBulkItem[];
  onUpdateRole: (id: string, newRole: IngredientRole) => void;
  onRemoveItem: (id: string) => void;
  kind: "ingredient" | "ready_meal";
  selectedMealTypes: MealType[];
  toggleMealType: (mt: MealType) => void;
}

const ROLES: { role: IngredientRole; label: string; short: string; activeColor: string }[] = [
  { role: "Main", label: "Carb / Base", short: "Carb", activeColor: "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950" },
  { role: "Protein", label: "Protein", short: "Protein", activeColor: "bg-rose-300 dark:bg-rose-900/70 text-stone-900 dark:text-rose-200" },
  { role: "Supplementary", label: "Side / Extra", short: "Side", activeColor: "bg-emerald-300 dark:bg-emerald-900/70 text-stone-900 dark:text-emerald-200" },
];

export const AddSupplyBulkTab: React.FC<AddSupplyBulkTabProps> = ({
  bulkText,
  setBulkText,
  items,
  onUpdateRole,
  onRemoveItem,
  kind,
  selectedMealTypes,
  toggleMealType,
}) => {
  const mainCount = items.filter((i) => i.role === "Main").length;
  const proteinCount = items.filter((i) => i.role === "Protein").length;
  const sideCount = items.filter((i) => i.role === "Supplementary").length;

  return (
    <div className="space-y-4">
      {/* Multiline Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
            Paste Items (one per line or comma-separated)
          </label>
          {items.length > 0 && (
            <span className="text-xs font-black text-stone-900 dark:text-amber-200 bg-amber-200 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-stone-900 dark:border-amber-700">
              {items.length} detected
            </span>
          )}
        </div>
        <textarea
          rows={3}
          required
          placeholder={
            kind === "ingredient"
              ? "e.g. Rice, Chicken Breast, Eggs, Avocado, Plantain, Greek Yogurt"
              : "e.g. Smoky Jollof, Chicken Curry, Lasagna, Beef Stew"
          }
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          className="w-full bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-brutal-sm dark:shadow-brutal-dark-sm resize-none"
        />
      </div>

      {/* Auto-Classification & 1-Click Overrides for Ingredients */}
      {kind === "ingredient" && items.length > 0 && (
        <div className="space-y-2">
          {/* Category Count Summaries */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Auto-Sorted Roles (Tap to adjust)
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-black">
              <span className="px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-950/60 text-stone-900 dark:text-amber-300 border border-stone-800 dark:border-amber-700">
                {mainCount} Carb
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-200 dark:bg-rose-950/60 text-stone-900 dark:text-rose-300 border border-stone-800 dark:border-rose-700">
                {proteinCount} Protein
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-950/60 text-stone-900 dark:text-emerald-300 border border-stone-800 dark:border-emerald-700">
                {sideCount} Side
              </span>
            </div>
          </div>

          {/* Interactive Item Row Chips with 1-Click Role Switch */}
          <div className="max-h-44 overflow-y-auto no-scrollbar space-y-1.5 p-2 bg-stone-100 dark:bg-stone-900/80 border-2 border-stone-900 dark:border-stone-700 rounded-2xl">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-1.5 bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-xl shadow-brutal-xs dark:shadow-brutal-dark-sm"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate pl-1">
                    {item.name}
                  </span>
                </div>

                {/* 1-Click Role Selector Pills */}
                <div className="flex items-center gap-1 shrink-0">
                  {ROLES.map(({ role, short, activeColor }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => onUpdateRole(item.id, role)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                        item.role === role
                          ? `${activeColor} border border-stone-900 dark:border-stone-700 shadow-xs scale-105`
                          : "bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border border-stone-300 dark:border-stone-700"
                      }`}
                    >
                      {short}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 font-black text-xs transition-colors ml-0.5"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suitable Meals Multi-Select */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
          Suitable Meals
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {(["Breakfast", "Lunch", "Snack", "Dinner"] as MealType[]).map((mt) => {
            const isSelected = selectedMealTypes.includes(mt);
            return (
              <button
                key={mt}
                type="button"
                onClick={() => toggleMealType(mt)}
                className={`min-h-[42px] py-2 px-3 flex items-center justify-center text-center rounded-xl border-2 border-stone-900 dark:border-stone-700 text-xs font-black transition-all ${
                  isSelected
                    ? "bg-purple-300 dark:bg-purple-900/60 text-stone-900 dark:text-purple-200 shadow-brutal-sm dark:shadow-brutal-dark-sm -translate-y-0.5"
                    : "bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700"
                }`}
              >
                {mt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
