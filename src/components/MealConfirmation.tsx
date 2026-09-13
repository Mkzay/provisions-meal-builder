"use client";

import {
  ArrowLeft,
  BowlFood,
  Check,
  CookingPot,
  Fire,
  ForkKnife,
  Sparkle,
} from "@/components/icons";
import { ProvisionsLogo } from "@/components/ProvisionsLogo";
import { getFirstStepKickoff, getSuggestedComboName } from "@/lib/pairings";
import { Ingredient, MealSource, MealType, ReadyMeal } from "@/lib/types";
import { getComboNutrientTags } from "@/lib/nutrient-curation";
import { getClientProfileCached } from "@/lib/profile-storage";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface MealConfirmationProps {
  mealType: MealType;
  source: MealSource;
  readyMeal?: ReadyMeal;
  mainIngredient?: Ingredient;
  protein?: Ingredient;
  supplementary?: Ingredient;
  supplementaries?: Ingredient[];
  onConfirmAndLog: () => void;
  onBack: () => void;
  isLogging?: boolean;
  owner?: string;
}

export const MealConfirmation: React.FC<MealConfirmationProps> = ({
  mealType,
  source,
  readyMeal,
  mainIngredient,
  protein,
  supplementary,
  supplementaries,
  onConfirmAndLog,
  onBack,
  isLogging = false,
  owner,
}) => {
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const allSupps: Ingredient[] =
    supplementaries && supplementaries.length > 0
      ? supplementaries
      : supplementary
      ? [supplementary]
      : [];

  const comboTags = getComboNutrientTags(mainIngredient, protein, allSupps, readyMeal);
  const cachedProfile = getClientProfileCached(owner || "User");
  const hitPriorities = (cachedProfile?.nutrientPriorities || []).filter((p) =>
    comboTags.includes(p)
  );

  const getMealTitle = () => {
    if (readyMeal) return readyMeal.name;
    if (!mainIngredient) return "Wholesome Meal";
    return getSuggestedComboName(
      mainIngredient.name,
      protein?.name,
      allSupps.map((s) => s.name)
    );
  };

  const kickoffStep = readyMeal
    ? "Take your container from the fridge and warm it up in a pot or microwave."
    : getFirstStepKickoff(mainIngredient, protein, allSupps);

  const handleConfirm = () => {
    setHasConfirmed(true);

    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate([25, 60, 25]);
    }

    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.7 },
        colors: ["#F59E0B", "#10B981", "#F43F5E", "#059669", "#D97706"],
      });
    } catch {
      // Ignore if confetti not supported
    }

    onConfirmAndLog();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full space-y-6"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={hasConfirmed || isLogging}
          className="inline-flex items-center gap-2 min-h-[44px] text-xs font-black text-stone-900 dark:text-stone-100 py-2 px-3.5 rounded-xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:bg-stone-100 dark:hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-all active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-40"
        >
          <ArrowLeft size={16} weight="bold" />
          <span>Change choice</span>
        </button>
        <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-300 dark:bg-amber-500/20 text-stone-900 dark:text-amber-300 border-2 border-stone-900 dark:border-amber-500/50 shadow-brutal-sm dark:shadow-brutal-dark-sm">
          Ready to Savor
        </span>
      </div>

      {/* Main Plate Card */}
      <div className="p-7 sm:p-9 bg-[#FEF08A] dark:bg-stone-900 rounded-3xl border-[2.5px] border-stone-900 dark:border-amber-500/40 shadow-brutal dark:shadow-brutal-dark text-center relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs font-black text-stone-900 dark:text-stone-100 mb-4 shadow-brutal-sm dark:shadow-brutal-dark-sm">
            {source === "Ready Meal" ? (
              <>
                <Fire size={16} weight="fill" className="text-emerald-700 dark:text-emerald-400" />
                <span>Ready-Cooked Meal</span>
              </>
            ) : (
              <>
                <Sparkle size={16} weight="fill" className="text-amber-500 dark:text-amber-400" />
                <span>Custom Built Plate</span>
              </>
            )}
            <span>•</span>
            <span className="text-stone-600 dark:text-stone-400">{mealType}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-stone-900 dark:text-stone-100 tracking-tight leading-snug max-w-md mx-auto">
            {getMealTitle()}
          </h3>

          {hitPriorities.length > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-300 dark:bg-emerald-500/20 border-2 border-stone-900 dark:border-emerald-500/50 text-xs font-black text-stone-900 dark:text-emerald-300 mt-2.5 shadow-brutal-sm dark:shadow-brutal-dark-sm">
              <span>⭐ Covers your {hitPriorities.join(" & ")} priority</span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-300 font-medium mt-2.5 max-w-sm mx-auto leading-relaxed">
            Everything is set. Sit down, nourish your body, and take your time.
          </p>

          {/* Breakdown tags */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-7">
            {mainIngredient && (
              <span className="px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs font-black text-stone-900 dark:text-stone-100 shadow-brutal-sm dark:shadow-brutal-dark-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-stone-900 dark:border-stone-700" />
                <span>{mainIngredient.name}</span>
              </span>
            )}
            {protein && (
              <span className="px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs font-black text-stone-900 dark:text-stone-100 shadow-brutal-sm dark:shadow-brutal-dark-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-stone-900 dark:border-stone-700" />
                <span>{protein.name}</span>
              </span>
            )}
            {allSupps.map((supp) => (
              <span
                key={supp.id}
                className="px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs font-black text-stone-900 dark:text-stone-100 shadow-brutal-sm dark:shadow-brutal-dark-sm flex items-center gap-1.5"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-stone-900 dark:border-stone-700" />
                <span>{supp.name}</span>
              </span>
            ))}
          </div>

          {comboTags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
              {comboTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-lg bg-white/90 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-[10px] font-extrabold border border-stone-900/40 dark:border-stone-700 shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* First-step physical kickoff card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-300 dark:bg-amber-950/60 border-2 border-stone-900 dark:border-amber-500/40 text-stone-900 dark:text-amber-300 flex items-center justify-center shrink-0 shadow-xs text-sm">
          👉
        </div>
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
            First Move
          </span>
          <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
            {kickoffStep}
          </p>
        </div>
      </div>

      {/* Confirmation CTA */}
      <div className="space-y-2.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleConfirm}
          disabled={hasConfirmed || isLogging}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-400 hover:bg-emerald-300 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-stone-900 dark:text-stone-950 font-black text-base sm:text-lg border-2 border-stone-900 dark:border-emerald-600/60 shadow-brutal dark:shadow-brutal-dark hover:shadow-brutal-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-900 focus-visible:ring-offset-2 transition-all flex items-center justify-center gap-3 disabled:opacity-80"
        >
          {isLogging ? (
            <span className="inline-flex items-center gap-2.5">
              <ProvisionsLogo size={20} className="w-5 h-5 animate-pulse shrink-0 shadow-none border-stone-900" />
              <span>Logging Meal...</span>
            </span>
          ) : (
            <>
              <ForkKnife size={22} weight="duotone" />
              <span>I&apos;m Eating This</span>
            </>
          )}
        </motion.button>
        <p className="text-center text-[11px] font-bold text-stone-600 dark:text-stone-400">
          Silently logs to your Kitchen Meal Log &amp; initiates the leftover check.
        </p>
      </div>
    </motion.div>
  );
};
