"use client";

import { IngredientRole, MealType } from "@/lib/types";
import React from "react";

interface AddSupplySingleTabProps {
  name: string;
  setName: (v: string) => void;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  toastMessage: string | null;
  kind: "ingredient" | "ready_meal";
  role: IngredientRole;
  setRole: (r: IngredientRole) => void;
  selectedMealTypes: MealType[];
  toggleMealType: (mt: MealType) => void;
}

export const AddSupplySingleTab: React.FC<AddSupplySingleTabProps> = ({
  name,
  setName,
  nameInputRef,
  toastMessage,
  kind,
  role,
  setRole,
  selectedMealTypes,
  toggleMealType,
}) => {
  return (
    <div className="space-y-4">
      {/* Name Input with Toast Feedback */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            {kind === "ingredient" ? "Ingredient Name" : "Ready Meal Title"}
          </label>
          {toastMessage && (
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-400">
              {toastMessage}
            </span>
          )}
        </div>
        <input
          ref={nameInputRef}
          type="text"
          required
          placeholder={
            kind === "ingredient"
              ? "e.g. Sourdough, Avocado, Oats..."
              : "e.g. Smoky Jollof, Veggie Stew..."
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white border-2 border-stone-900 rounded-xl px-3.5 py-2.5 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-brutal-sm"
        />
      </div>

      {/* Role Chips (if ingredient) */}
      {kind === "ingredient" && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            Culinary Role
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
