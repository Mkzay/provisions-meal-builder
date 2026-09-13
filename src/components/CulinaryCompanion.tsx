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
import { getComboNutrientTags } from "@/lib/nutrient-curation";
import { getClientProfileCached } from "@/lib/profile-storage";
import React from "react";
import { CompanionNoteCard } from "./CompanionNoteCard";

interface CulinaryCompanionProps {
  mealType: MealType;
  source: MealSource;
  readyMeal?: ReadyMeal;
  mainIngredient?: Ingredient;
  protein?: Ingredient;
  supplementary?: Ingredient;
  supplementaries?: Ingredient[];
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
  supplementaries,
  missingUpgrade,
  owner,
}) => {
  const effectiveSupps = supplementaries && supplementaries.length > 0
    ? supplementaries
    : supplementary ? [supplementary] : [];

  const getDishTitle = () => {
    if (readyMeal) return readyMeal.name;
    if (!mainIngredient) return "Selecting Dish...";
    let title = mainIngredient.name;
    if (protein) title += ` & ${protein.name}`;
    if (effectiveSupps.length > 0) {
      if (effectiveSupps.length === 1) {
        title += ` with ${effectiveSupps[0].name}`;
      } else if (effectiveSupps.length === 2) {
        title += ` with ${effectiveSupps[0].name} & ${effectiveSupps[1].name}`;
      } else {
        const last = effectiveSupps[effectiveSupps.length - 1].name;
        const rest = effectiveSupps.slice(0, -1).map((s) => s.name).join(", ");
        title += ` with ${rest} & ${last}`;
      }
    }
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
    return "Combining an anchor base with a wholesome protein and fresh sides gives you steady, sustained energy.";
  };

  const comboTags = getComboNutrientTags(mainIngredient, protein, effectiveSupps, readyMeal);
  const cachedProfile = getClientProfileCached(owner || "User");
  const hitPriorities = (cachedProfile?.nutrientPriorities || []).filter((p) =>
    comboTags.includes(p)
  );

  return (
    <aside className="w-full lg:w-76 xl:w-80 space-y-4 shrink-0">
      {/* Live Plate Card */}
      <div className="p-5 rounded-3xl bg-[#FEF08A] dark:bg-stone-900 border-2 border-stone-900 dark:border-amber-500/40 shadow-brutal dark:shadow-brutal-dark space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Current Plate
          </span>
          <div className="flex items-center gap-1.5">
            {hitPriorities.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-300 dark:bg-emerald-500/20 text-stone-900 dark:text-emerald-300 border border-stone-900 dark:border-emerald-500/50 shadow-2xs">
                ✓ {hitPriorities.join(" & ")}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm">
              {mealType}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-display font-black text-stone-900 dark:text-stone-100 leading-snug">
            {getDishTitle()}
          </h4>
          <span className="text-xs text-stone-700 dark:text-stone-400 font-bold mt-0.5 block">
            {source === "Ready Meal" ? "Fully cooked & ready" : "Built from available items"}
          </span>
        </div>

        {/* Live Plate Layer Pills */}
        <div className="space-y-2 pt-2 border-t-2 border-stone-900/20 dark:border-stone-800 text-xs font-bold">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm">
            <span className="text-stone-600 dark:text-stone-400">Anchor Base</span>
            <span className="font-black text-stone-900 dark:text-stone-100">
              {readyMeal ? readyMeal.name : mainIngredient ? mainIngredient.name : "Not picked"}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm">
            <span className="text-stone-600 dark:text-stone-400">Protein</span>
            <span className="font-black text-stone-900 dark:text-stone-100">
              {readyMeal ? "Included" : protein ? protein.name : "None / Plain"}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm">
            <span className="text-stone-600 dark:text-stone-400">Greens & Sides</span>
            <span className="font-black text-stone-900 dark:text-stone-100 truncate max-w-[150px] text-right">
              {readyMeal
                ? "Included"
                : effectiveSupps.length > 0
                ? effectiveSupps.map((s) => s.name).join(", ")
                : "None"}
            </span>
          </div>
        </div>
      </div>

      {/* Culinary Synergy Note */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 shadow-brutal dark:shadow-brutal-dark space-y-2.5">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <div className="w-7 h-7 rounded-lg bg-emerald-300 dark:bg-emerald-950/60 border-2 border-stone-900 dark:border-emerald-500/40 flex items-center justify-center text-stone-900 dark:text-emerald-300 shadow-brutal-sm dark:shadow-brutal-dark-sm">
            <Lightbulb size={18} weight="bold" />
          </div>
          <h5 className="font-display font-black text-sm text-stone-900 dark:text-stone-100">
            Why This Combo Works
          </h5>
        </div>
        <p className="text-xs text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
          {getPairingAffinityTip()}
        </p>
      </div>

      {/* Missing Upgrade Synergy Tip */}
      {missingUpgrade && (
        <div className="p-5 rounded-3xl bg-[#FEF9C3] dark:bg-stone-900 border-2 border-stone-900 dark:border-amber-500/40 shadow-brutal dark:shadow-brutal-dark space-y-2">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
            <div className="w-7 h-7 rounded-lg bg-amber-300 dark:bg-amber-950/60 border-2 border-stone-900 dark:border-amber-500/40 flex items-center justify-center text-stone-900 dark:text-amber-300 shadow-brutal-sm dark:shadow-brutal-dark-sm">
              <Sparkle size={16} weight="fill" className="text-amber-800 dark:text-amber-300" />
            </div>
            <h5 className="font-display font-black text-sm text-stone-900 dark:text-stone-100">
              Upgrade: {missingUpgrade.name}
            </h5>
          </div>
          <p className="text-xs text-stone-800 dark:text-stone-300 font-medium leading-relaxed">
            {missingUpgrade.reason}
          </p>
        </div>
      )}

      {/* AI-Curated Culinary Companion Note */}
      <CompanionNoteCard
        mealType={mealType}
        owner={owner || "User"}
        tags={comboTags}
        mealTitle={getDishTitle()}
        isDismissible={false}
      />
    </aside>
  );
};
