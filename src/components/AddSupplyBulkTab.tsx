"use client";

import { IngredientRole, MealType } from "@/lib/types";
import React from "react";

interface AddSupplyBulkTabProps {
  bulkText: string;
  setBulkText: (v: string) => void;
  parsedBulkItems: string[];
  kind: "ingredient" | "ready_meal";
  role: IngredientRole;
  setRole: (r: IngredientRole) => void;
  selectedMealTypes: MealType[];
  toggleMealType: (mt: MealType) => void;
}

export const AddSupplyBulkTab: React.FC<AddSupplyBulkTabProps> = ({
  bulkText,
  setBulkText,
  parsedBulkItems,
  kind,
  role,
  setRole,
  selectedMealTypes,
  toggleMealType,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            Item List (1 per line or comma-separated)
          </label>
          {parsedBulkItems.length > 0 && (
            <span className="text-xs font-black text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md border border-stone-900">
              {parsedBulkItems.length} item{parsedBulkItems.length === 1 ? "" : "s"} detected
            </span>
          )}
        </div>
        <textarea
          rows={4}
          required
          placeholder={`e.g.\nGreek Yogurt\nSalmon Fillet\nBananas\nEggs\n(Or comma-separated: Milk, Oats, Avocado)`}
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          className="w-full bg-white border-2 border-stone-900 rounded-xl px-3.5 py-2.5 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-brutal-sm resize-none"
        />
        {parsedBulkItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto no-scrollbar p-2 bg-stone-100 border-2 border-dashed border-stone-300 rounded-xl">
            {parsedBulkItems.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-white text-stone-800 border border-stone-800 shadow-xs"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Role selector for pantry items */}
      {kind === "ingredient" && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            Default Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["Main", "Protein", "Supplementary"] as IngredientRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`min-h-[42px] py-2 px-2 flex items-center justify-center text-center rounded-xl border-2 border-stone-900 text-xs font-bold transition-all whitespace-nowrap ${
                  role === r
                    ? "bg-amber-300 text-stone-900 shadow-brutal-sm -translate-y-0.5"
                    : "bg-white text-stone-700 hover:bg-stone-50"
                }`}
              >
                {r === "Main" ? "Carb / Base" : r === "Protein" ? "Protein" : "Side / Extra"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Meal Types Multi-Select */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
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
                className={`min-h-[42px] py-2 px-3 flex items-center justify-center text-center rounded-xl border-2 border-stone-900 text-xs font-black transition-all ${
                  isSelected
                    ? "bg-purple-300 text-stone-900 shadow-brutal-sm -translate-y-0.5"
                    : "bg-white text-stone-700 hover:bg-stone-50"
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
