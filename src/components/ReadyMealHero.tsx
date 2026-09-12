"use client";

import { ArrowRight, CookingPot, Fire, Sparkle } from "@/components/icons";
import { MealType, ReadyMeal } from "@/lib/types";
import { motion } from "framer-motion";
import React from "react";

interface ReadyMealHeroProps {
  readyMeals: ReadyMeal[];
  mealType: MealType;
  onSelectReadyMeal: (meal: ReadyMeal) => void;
  onBypassToBuild: () => void;
}

export const ReadyMealHero: React.FC<ReadyMealHeroProps> = ({
  readyMeals,
  mealType,
  onSelectReadyMeal,
  onBypassToBuild,
}) => {
  if (readyMeals.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[#A7F3D0] border-[2.5px] border-stone-900 rounded-3xl p-6 sm:p-7 shadow-brutal relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white border-2 border-stone-900 text-stone-900 shadow-brutal-sm">
            <Fire size={18} weight="fill" className="text-amber-500" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-stone-900 bg-white/70 px-2 py-0.5 rounded-lg border border-stone-900/40">
            Zero-Cooking Rescue
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-display font-black text-stone-900 tracking-tight">
          You already have food ready!
        </h3>
        <p className="text-xs sm:text-sm text-stone-800 font-medium mt-1 mb-6 max-w-lg leading-relaxed">
          It&apos;s waiting in your fridge right now. No prep, no pots, no thinking. Warm it up and you&apos;re nourished in 3 minutes.
        </p>

        {/* Ready Meal Cards */}
        <div className="space-y-3.5 mb-6">
          {readyMeals.map((meal) => (
            <motion.div
              key={meal.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-3xl border-2 border-stone-900 shadow-brutal-sm hover:shadow-brutal transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-13 h-13 rounded-2xl bg-[#FEF08A] border-2 border-stone-900 text-stone-900 flex items-center justify-center shrink-0 shadow-brutal-sm">
                  <CookingPot size={26} weight="duotone" />
                </div>
                <div>
                  <h4 className="font-display font-black text-lg sm:text-xl text-stone-900 leading-tight">
                    {meal.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-700/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>Ready in Fridge</span>
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-stone-600 px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-300">
                      0 min prep
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectReadyMeal(meal)}
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-2xl font-black text-xs sm:text-sm bg-emerald-400 hover:bg-emerald-300 text-stone-900 border-2 border-stone-900 shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-all shrink-0"
              >
                <span>I&apos;m Eating This</span>
                <ArrowRight size={15} weight="bold" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bypass Option */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t-2 border-stone-900/20">
          <p className="text-xs text-stone-800 font-bold">
            Don&apos;t feel like ready food today?
          </p>
          <button
            onClick={onBypassToBuild}
            className="min-h-[44px] inline-flex items-center text-xs font-black text-stone-900 underline underline-offset-4 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-md transition-colors"
          >
            I&apos;ll pick or build from scratch →
          </button>
        </div>
      </div>
    </motion.section>
  );
};
