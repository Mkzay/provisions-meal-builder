"use client";

import {
  BowlFood,
  CheckCircle,
  Egg,
  ForkKnife,
  Heart,
  Lightbulb,
  Sparkle,
} from "@/components/icons";
import { Ingredient, MealSource, MealType, MissingUpgradeSuggestion, ReadyMeal } from "@/lib/types";
import React from "react";
import { CompanionNoteCard } from "./CompanionNoteCard";

interface CulinaryCompanionProps {
  mealType: MealType;
  source: MealSource;
  readyMeal?: ReadyMeal;
  mainIngredient?: Ingredient;
  protein?: Ingredient;
  supplementary?: Ingredient;
  missingUpgrade?: MissingUpgradeSuggestion;
  owner?: string;
}

export const CulinaryCompanion: React.FC<CulinaryCompanionProps> = ({
  mealType,
  source,
  readyMeal,
  mainIngredient,
  protein,
  supplementary,
  missingUpgrade,
  owner,
}) => {
  const getDishTitle = () => {
    if (readyMeal) return readyMeal.name;
    if (!mainIngredient) return "Selecting Dish...";
    let title = mainIngredient.name;
    if (protein) title += ` & ${protein.name}`;
    if (supplementary) title += ` with ${supplementary.name}`;
    return title;
  };

  const getPairingAffinityTip = () => {
    if (readyMeal) {
      return "Ready meals save you 100% of prep friction. Heating up already-cooked food is the kindest, quickest way to stay well-fed.";
    }
    if (mealType === "Snack") {
      return "Snacks and quick nibbles keep energy even between tasks. A touch of protein or fruit prevents late-day mental fatigue.";
    }
    if (mainIngredient?.name.toLowerCase().includes("rice")) {
      return "Rice provides steady complex carbs. Pairing it with a savory stew or protein ensures sustained energy without a crash.";
    }
    if (mainIngredient?.name.toLowerCase().includes("yam")) {
      return "Yam is nutrient-dense and grounding. An egg sauce or fish pairing balances it with healthy fats and clean protein.";
    }
    if (mainIngredient?.name.toLowerCase().includes("bread")) {
      return "Toasted bread with eggs, sardines, or nut butter creates a 5-minute complete protein meal requiring near-zero effort.";
    }
    return "Combining an anchor carb with a wholesome protein helps regulate blood sugar and keeps you feeling satisfied for hours.";
  };

  return (
    <aside className="w-full lg:w-76 xl:w-80 space-y-4 shrink-0">
      {/* Live Plate Card */}
      <div className="p-5 rounded-3xl bg-[#FEF08A] border-2 border-stone-900 shadow-brutal space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-stone-900">
            Current Plate
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-stone-900 border border-stone-900 shadow-brutal-sm">
            {mealType}
          </span>
        </div>

        <div>
          <h4 className="text-lg font-display font-black text-stone-900 leading-snug">
            {getDishTitle()}
          </h4>
          <span className="text-xs text-stone-700 font-bold mt-0.5 block">
            {source === "Ready Meal" ? "Fully cooked & ready" : "Built from available items"}
          </span>
        </div>

        {/* Live Plate Layer Pills */}
        <div className="space-y-2 pt-2 border-t-2 border-stone-900/20 text-xs font-bold">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border-2 border-stone-900 shadow-brutal-sm">
            <span className="text-stone-600">Main Base</span>
            <span className="font-black text-stone-900">
              {readyMeal ? readyMeal.name : mainIngredient ? mainIngredient.name : "Not picked"}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border-2 border-stone-900 shadow-brutal-sm">
            <span className="text-stone-600">Protein</span>
            <span className="font-black text-stone-900">
              {readyMeal ? "Included" : protein ? protein.name : "None / Plain"}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border-2 border-stone-900 shadow-brutal-sm">
            <span className="text-stone-600">Side / Sauce</span>
            <span className="font-black text-stone-900">
              {readyMeal ? "Included" : supplementary ? supplementary.name : "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Culinary Synergy Note */}
      <div className="p-5 rounded-3xl bg-white border-2 border-stone-900 shadow-brutal space-y-2.5">
        <div className="flex items-center gap-2 text-stone-900">
          <div className="w-7 h-7 rounded-lg bg-emerald-300 border-2 border-stone-900 flex items-center justify-center text-stone-900 shadow-brutal-sm">
            <Lightbulb size={18} weight="bold" />
          </div>
          <h5 className="font-display font-black text-sm text-stone-900">
            Why This Combo Works
          </h5>
        </div>
        <p className="text-xs text-stone-700 font-medium leading-relaxed">
          {getPairingAffinityTip()}
        </p>
      </div>

      {/* Missing Upgrade Synergy Tip */}
      {missingUpgrade && (
        <div className="p-5 rounded-3xl bg-[#FEF9C3] border-2 border-stone-900 shadow-brutal space-y-2">
          <div className="flex items-center gap-2 text-stone-900">
            <div className="w-7 h-7 rounded-lg bg-amber-300 border-2 border-stone-900 flex items-center justify-center text-stone-900 shadow-brutal-sm">
              <Sparkle size={16} weight="fill" className="text-amber-800" />
            </div>
            <h5 className="font-display font-black text-sm text-stone-900">
              Upgrade: {missingUpgrade.name}
            </h5>
          </div>
          <p className="text-xs text-stone-800 font-medium leading-relaxed">
            {missingUpgrade.reason}
          </p>
        </div>
      )}

      {/* AI-Curated Culinary Companion Note */}
      <CompanionNoteCard
        mealType={mealType}
        owner={owner || "User"}
        isDismissible={false}
      />
    </aside>
  );
};
