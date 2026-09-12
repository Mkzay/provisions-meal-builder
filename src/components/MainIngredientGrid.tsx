"use client";

import {
  ArrowLeft,
  BowlFood,
  Bread,
  Cookie,
  CookingPot,
  Grains,
  Plant,
  Sparkle,
} from "@/components/icons";
import { Ingredient } from "@/lib/types";
import { motion } from "framer-motion";
import React from "react";

interface MainIngredientGridProps {
  mains: Ingredient[];
  onSelectMain: (main: Ingredient) => void;
  onBack: () => void;
}

export const MainIngredientGrid: React.FC<MainIngredientGridProps> = ({
  mains,
  onSelectMain,
  onBack,
}) => {
  const getIngredientVisual = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("cracker") || lower.includes("biscuit") || lower.includes("cookie") || lower.includes("snack")) {
      return {
        icon: <Cookie size={26} weight="duotone" className="text-purple-800" />,
        bg: "bg-purple-200",
      };
    }
    if (lower.includes("yogurt") || lower.includes("fruit") || lower.includes("berry")) {
      return {
        icon: <BowlFood size={26} weight="duotone" className="text-pink-800" />,
        bg: "bg-pink-200",
      };
    }
    if (lower.includes("rice") || lower.includes("jollof")) {
      return {
        icon: <BowlFood size={26} weight="duotone" className="text-amber-800" />,
        bg: "bg-amber-200",
      };
    }
    if (lower.includes("yam") || lower.includes("potato")) {
      return {
        icon: <Plant size={26} weight="duotone" className="text-emerald-800" />,
        bg: "bg-emerald-200",
      };
    }
    if (lower.includes("bread") || lower.includes("toast")) {
      return {
        icon: <Bread size={26} weight="duotone" className="text-amber-800" />,
        bg: "bg-amber-200",
      };
    }
    if (lower.includes("pasta") || lower.includes("spaghetti") || lower.includes("noodle")) {
      return {
        icon: <CookingPot size={26} weight="duotone" className="text-rose-800" />,
        bg: "bg-rose-200",
      };
    }
    return {
      icon: <Grains size={26} weight="duotone" className="text-emerald-800" />,
      bg: "bg-emerald-200",
    };
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-black text-stone-900 py-2 px-3.5 rounded-xl bg-white border-2 border-stone-900 shadow-brutal-sm hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-all active:translate-x-[1px] active:translate-y-[1px]"
        >
          <ArrowLeft size={16} weight="bold" />
          <span>Back to modes</span>
        </button>
        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-200 text-stone-900 border-2 border-stone-900 shadow-brutal-sm">
          {mains.length} {mains.length === 1 ? "main available" : "mains available"}
        </span>
      </div>

      <div className="px-1">
        <h3 className="text-2xl sm:text-3xl font-display font-black text-stone-900 tracking-tight">
          What are you craving?
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
          Pick your anchor main ingredient. We&apos;ll automatically match the proteins and sides next.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {mains.map((main) => {
          const visual = getIngredientVisual(main.name);

          return (
            <motion.button
              key={main.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (typeof window !== "undefined" && window.navigator?.vibrate) {
                  window.navigator.vibrate(12);
                }
                onSelectMain(main);
              }}
              className="flex flex-col items-center justify-center p-5 min-h-[130px] rounded-3xl border-2 border-stone-900 bg-white shadow-brutal-sm hover:shadow-brutal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-900 focus-visible:ring-offset-2 transition-all text-center group active:translate-x-[1px] active:translate-y-[1px]"
            >
              <div
                className={`w-13 h-13 rounded-2xl ${visual.bg} border-2 border-stone-900 flex items-center justify-center mb-3 shadow-brutal-sm group-hover:scale-105 transition-transform`}
              >
                {visual.icon}
              </div>
              <span className="font-display font-black text-stone-900 text-sm sm:text-base leading-snug">
                {main.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
