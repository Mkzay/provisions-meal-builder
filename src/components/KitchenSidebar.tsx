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
  onOpenStaples?: () => void;
  onOpenAddSupply?: () => void;
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
  onOpenAddSupply,
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
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 shadow-brutal dark:shadow-brutal-dark space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Your Pantry
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black border border-stone-900 dark:border-stone-700 ${mealsPerDay ? "bg-amber-200 dark:bg-amber-950/80 text-stone-900 dark:text-amber-200" : "bg-emerald-100 dark:bg-emerald-950/80 text-stone-900 dark:text-emerald-200"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${mealsPerDay ? "bg-amber-700 dark:bg-amber-400" : "bg-emerald-700 dark:bg-emerald-400"}`} />
            <span>{mealsPerDay ? `${mealsPerDay} Meals / Day` : "Active"}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-3 rounded-2xl bg-amber-200 dark:bg-amber-950/80 border-2 border-stone-900 dark:border-amber-600/70 shadow-brutal-sm dark:shadow-brutal-dark-sm">
            <span className="text-2xl font-display font-black text-stone-900 dark:text-amber-200">
              {availableReadyMeals.length}
            </span>
            <p className="text-xs font-bold text-stone-700 dark:text-amber-300/80 mt-0.5">
              Ready Meals
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-200 dark:bg-emerald-950/80 border-2 border-stone-900 dark:border-emerald-600/70 shadow-brutal-sm dark:shadow-brutal-dark-sm">
            <span className="text-2xl font-display font-black text-stone-900 dark:text-emerald-200">
              {availableIngredients.length}
            </span>
            <p className="text-xs font-bold text-stone-700 dark:text-emerald-300/80 mt-0.5">
              Available Items
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenAddSupply || onOpenStaples}
            className="w-full py-2 px-2.5 rounded-xl border-2 border-stone-900 dark:border-amber-700/70 bg-amber-100 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900 text-xs font-black text-stone-900 dark:text-amber-200 transition-all shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px]"
          >
            + Restock
          </button>
          {onOpenFoodIdeas && (
            <button
              onClick={onOpenFoodIdeas}
              className="w-full py-2 px-2.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-xs font-black text-stone-900 dark:text-stone-100 transition-all shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] inline-flex items-center justify-center gap-1"
            >
              <Sparkle size={13} weight="fill" className="text-amber-600 dark:text-amber-400" />
              <span>Food Ideas</span>
            </button>
          )}
        </div>

        {onOpenInventory && (
          <button
            onClick={onOpenInventory}
            className="w-full py-2.5 px-3 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-black text-stone-900 dark:text-stone-100 transition-all shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2"
          >
            <Package size={15} weight="bold" />
            <span>Manage Kitchen Stock ({readyMeals.length + ingredients.length})</span>
          </button>
        )}

        {onOpenSavedRecipes && (
          <button
            onClick={onOpenSavedRecipes}
            className="w-full py-2.5 px-3 rounded-xl border-2 border-stone-900 dark:border-orange-700/70 bg-orange-100 dark:bg-orange-950/80 hover:bg-orange-200 dark:hover:bg-orange-900 text-xs font-black text-stone-900 dark:text-orange-200 transition-all shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2"
          >
            <BookmarkSimple size={15} weight="bold" />
            <span>Saved Recipes {savedRecipesCount !== undefined ? `(${savedRecipesCount})` : ""}</span>
          </button>
        )}
      </div>

      {/* In The Fridge Now Card */}
      <div className="p-5 rounded-3xl bg-[#D1FAE5] dark:bg-[#062D1F] border-2 border-stone-900 dark:border-emerald-600/70 shadow-brutal dark:shadow-brutal-dark space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-emerald-600/60 text-stone-900 dark:text-emerald-300 flex items-center justify-center shadow-brutal-sm">
              <CookingPot size={18} weight="duotone" />
            </div>
            <h4 className="font-display font-black text-sm text-stone-900 dark:text-emerald-100">
              Cooked &amp; Ready
            </h4>
          </div>
          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-white dark:bg-emerald-950 text-stone-900 dark:text-emerald-200 border border-stone-900 dark:border-emerald-600/50">
            In Fridge
          </span>
        </div>

        {availableReadyMeals.length === 0 ? (
          <p className="text-xs text-stone-700 dark:text-emerald-200/80 font-medium italic py-1">
            No ready meals in fridge right now. Building fresh takes just 5 minutes!
          </p>
        ) : (
          <div className="space-y-2">
            {availableReadyMeals.map((meal) => (
              <button
                key={meal.id}
                onClick={() => onSelectReadyMeal(meal)}
                className="w-full p-3 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 text-left transition-all group flex items-center justify-between shadow-brutal-sm dark:shadow-brutal-dark-sm hover:translate-x-[1px]"
              >
                <div>
                  <div className="text-xs font-black text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {meal.name}
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400">
                    {meal.mealTypes.join(", ")}
                  </span>
                </div>
                <span className="text-xs font-black text-stone-900 dark:text-stone-950 bg-emerald-200 dark:bg-emerald-300 px-2 py-0.5 rounded-lg border border-stone-900 group-hover:translate-x-0.5 transition-transform">
                  Eat →
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Today's Meal Cadence Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 shadow-brutal dark:shadow-brutal-dark space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-200 dark:bg-amber-950/80 border-2 border-stone-900 dark:border-amber-600/70 text-stone-900 dark:text-amber-200 flex items-center justify-center shadow-brutal-sm">
            <Clock size={18} weight="duotone" />
          </div>
          <h4 className="font-display font-black text-sm text-stone-900 dark:text-stone-100">
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
                    ? "bg-purple-200 dark:bg-purple-950/80 border-stone-900 dark:border-purple-600/70 font-black text-stone-900 dark:text-purple-200 shadow-brutal-sm"
                    : "bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 font-bold text-stone-600 dark:text-stone-300"
                }`}
              >
                <span>{type}</span>
                {isCurrent && (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white dark:bg-stone-900 text-stone-900 dark:text-purple-200 px-2 py-0.5 rounded-full border border-stone-900 dark:border-purple-600/60">
                    Active Window
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onOpenAddSupply || onOpenStaples}
          className="w-full pt-2 border-t-2 border-stone-900 dark:border-stone-800 flex items-center justify-center gap-1.5 text-xs font-black text-stone-900 dark:text-stone-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
        >
          <PlusCircle size={15} weight="bold" />
          <span>Quick Restock Staples</span>
        </button>
      </div>
    </aside>
  );
};
