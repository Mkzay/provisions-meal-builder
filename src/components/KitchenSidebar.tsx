"use client";

import {
  BookmarkSimple,
  BowlFood,
  CheckCircle,
  Clock,
  CookingPot,
  Fire,
  Package,
  PlusCircle,
  Sparkle,
} from "@/components/icons";
import { Ingredient, MealType, ReadyMeal } from "@/lib/types";
import React from "react";

interface KitchenSidebarProps {
  readyMeals: ReadyMeal[];
  ingredients: Ingredient[];
  currentMealType: MealType;
  isCachedFallback?: boolean;
  onSelectReadyMeal: (meal: ReadyMeal) => void;
  onOpenSettings?: () => void;
  onOpenStaples: () => void;
  onOpenFoodIdeas?: () => void;
  onOpenInventory?: () => void;
  onOpenSavedRecipes?: () => void;
  savedRecipesCount?: number;
  mealsPerDay?: number;
}

export const KitchenSidebar: React.FC<KitchenSidebarProps> = ({
  readyMeals,
  ingredients,
  currentMealType,
  isCachedFallback = false,
  onSelectReadyMeal,
  onOpenSettings,
  onOpenStaples,
  onOpenFoodIdeas,
  onOpenInventory,
  onOpenSavedRecipes,
  savedRecipesCount,
  mealsPerDay,
}) => {
  const availableReadyMeals = readyMeals.filter((m) => m.available);
  const availableIngredients = ingredients.filter((i) => i.available);

  return (
    <aside className="w-full lg:w-76 xl:w-80 space-y-4 shrink-0">
      {/* Kitchen Hub Status Card */}
      <div className="p-5 rounded-3xl bg-white border-2 border-stone-900 shadow-brutal space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-stone-900">
            Your Pantry
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black border border-stone-900 ${mealsPerDay ? "bg-amber-200 text-stone-900" : "bg-emerald-100 text-stone-900"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${mealsPerDay ? "bg-amber-700" : "bg-emerald-700"}`} />
            <span>{mealsPerDay ? `${mealsPerDay} Meals / Day` : "Active"}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-3 rounded-2xl bg-amber-200 border-2 border-stone-900 shadow-brutal-sm">
            <span className="text-2xl font-display font-black text-stone-900">
              {availableReadyMeals.length}
            </span>
            <p className="text-xs font-bold text-stone-700 mt-0.5">
              Ready Meals
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-200 border-2 border-stone-900 shadow-brutal-sm">
            <span className="text-2xl font-display font-black text-stone-900">
              {availableIngredients.length}
            </span>
            <p className="text-xs font-bold text-stone-700 mt-0.5">
              Available Items
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenStaples}
            className="w-full py-2 px-2.5 rounded-xl border-2 border-stone-900 bg-amber-100 hover:bg-amber-200 text-xs font-black text-stone-900 transition-all shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px]"
          >
            + Restock
          </button>
          {onOpenFoodIdeas && (
            <button
              onClick={onOpenFoodIdeas}
              className="w-full py-2 px-2.5 rounded-xl border-2 border-stone-900 bg-white hover:bg-stone-50 text-xs font-black text-stone-900 transition-all shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] inline-flex items-center justify-center gap-1"
            >
              <Sparkle size={13} weight="fill" className="text-amber-600" />
              <span>Food Ideas</span>
            </button>
          )}
        </div>

        {onOpenInventory && (
          <button
            onClick={onOpenInventory}
            className="w-full py-2.5 px-3 rounded-xl border-2 border-stone-900 bg-stone-100 hover:bg-stone-200 text-xs font-black text-stone-900 transition-all shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2"
          >
            <Package size={15} weight="bold" />
            <span>Manage Kitchen Stock ({readyMeals.length + ingredients.length})</span>
          </button>
        )}

        {onOpenSavedRecipes && (
          <button
            onClick={onOpenSavedRecipes}
            className="w-full py-2.5 px-3 rounded-xl border-2 border-stone-900 bg-orange-100 hover:bg-orange-200 text-xs font-black text-stone-900 transition-all shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2"
          >
            <BookmarkSimple size={15} weight="bold" />
            <span>Saved Recipes {savedRecipesCount !== undefined ? `(${savedRecipesCount})` : ""}</span>
          </button>
        )}
      </div>

      {/* In The Fridge Now Card */}
      <div className="p-5 rounded-3xl bg-[#D1FAE5] border-2 border-stone-900 shadow-brutal space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white border-2 border-stone-900 text-stone-900 flex items-center justify-center shadow-brutal-sm">
              <CookingPot size={18} weight="duotone" />
            </div>
            <h4 className="font-display font-black text-sm text-stone-900">
              Cooked &amp; Ready
            </h4>
          </div>
          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-white text-stone-900 border border-stone-900">
            In Fridge
          </span>
        </div>

        {availableReadyMeals.length === 0 ? (
          <p className="text-xs text-stone-700 font-medium italic py-1">
            No ready meals in fridge right now. Building fresh takes just 5 minutes!
          </p>
        ) : (
          <div className="space-y-2">
            {availableReadyMeals.map((meal) => (
              <button
                key={meal.id}
                onClick={() => onSelectReadyMeal(meal)}
                className="w-full p-3 rounded-2xl bg-white border-2 border-stone-900 text-left transition-all group flex items-center justify-between shadow-brutal-sm hover:translate-x-[1px]"
              >
                <div>
                  <div className="text-xs font-black text-stone-900 group-hover:text-emerald-700 transition-colors">
                    {meal.name}
                  </div>
                  <span className="text-[10px] font-bold text-stone-500">
                    {meal.mealTypes.join(", ")}
                  </span>
                </div>
                <span className="text-xs font-black text-stone-900 bg-emerald-200 px-2 py-0.5 rounded-lg border border-stone-900 group-hover:translate-x-0.5 transition-transform">
                  Eat →
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Today's Meal Cadence Card */}
      <div className="p-5 rounded-3xl bg-white border-2 border-stone-900 shadow-brutal space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-200 border-2 border-stone-900 text-stone-900 flex items-center justify-center shadow-brutal-sm">
            <Clock size={18} weight="duotone" />
          </div>
          <h4 className="font-display font-black text-sm text-stone-900">
            Today&apos;s Rhythm
          </h4>
        </div>

        <div className="space-y-2 text-xs">
          {(["Breakfast", "Lunch", "Snack", "Dinner"] as MealType[]).map((type) => {
            const isCurrent = currentMealType === type;
            return (
              <div
                key={type}
                className={`flex items-center justify-between p-2.5 rounded-xl border-2 transition-all ${
                  isCurrent
                    ? "bg-purple-200 border-stone-900 font-black text-stone-900 shadow-brutal-sm"
                    : "bg-white border-stone-300 font-bold text-stone-600"
                }`}
              >
                <span>{type}</span>
                {isCurrent && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-stone-900">
                    Active Window
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onOpenStaples}
          className="w-full pt-2 border-t-2 border-stone-900 flex items-center justify-center gap-1.5 text-xs font-black text-stone-900 hover:text-emerald-700 transition-colors"
        >
          <PlusCircle size={15} weight="bold" />
          <span>Quick Restock Staples</span>
        </button>
      </div>
    </aside>
  );
};
