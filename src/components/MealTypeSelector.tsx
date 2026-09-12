"use client";

import {
  BowlFood,
  CheckFat,
  Cookie,
  MoonStars,
  Sparkle,
  SunHorizon,
} from "@/components/icons";
import { getDefaultMealTypeByHour } from "@/lib/flow-logic";
import { MealType } from "@/lib/types";
import { motion } from "framer-motion";
import React from "react";

interface MealTypeSelectorProps {
  selectedType: MealType;
  onSelect: (type: MealType) => void;
}

export const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  const currentSuggested = getDefaultMealTypeByHour(new Date().getHours());

  const options: Array<{
    type: MealType;
    label: string;
    emphasis: string;
    subtitle: string;
    icon: React.ReactNode;
    cardBg: string;
    badgeBg: string;
    tagText: string;
  }> = [
    {
      type: "Breakfast",
      label: "Breakfast",
      emphasis: "morning warmth",
      subtitle: "Gentle start with quick warm comforts & tea.",
      icon: <SunHorizon size={28} weight="duotone" className="text-amber-800" />,
      cardBg: "bg-[#FEF08A]", // Rich Buttercup Yellow
      badgeBg: "bg-amber-100 text-amber-950 border-amber-800",
      tagText: "Morning Fuel",
    },
    {
      type: "Lunch",
      label: "Lunch",
      emphasis: "midday refuel",
      subtitle: "Hearty, nourishing plate to power your focus.",
      icon: <BowlFood size={28} weight="duotone" className="text-emerald-800" />,
      cardBg: "bg-[#A7F3D0]", // Vibrant Fresh Mint
      badgeBg: "bg-emerald-100 text-emerald-950 border-emerald-800",
      tagText: "Peak Energy",
    },
    {
      type: "Snack",
      label: "Snack & Craving",
      emphasis: "zero hassle",
      subtitle: "Quick 2-minute nibbles, fruit bowls & sweet bites.",
      icon: <Cookie size={28} weight="duotone" className="text-purple-900" />,
      cardBg: "bg-[#DDD6FE]", // Electric Lavender Lilac
      badgeBg: "bg-purple-100 text-purple-950 border-purple-900",
      tagText: "Quick Bites",
    },
    {
      type: "Dinner",
      label: "Dinner",
      emphasis: "cozy comfort",
      subtitle: "Unwind from the day with a satisfying warm meal.",
      icon: <MoonStars size={28} weight="duotone" className="text-rose-900" />,
      cardBg: "bg-[#FECDD3]", // Sunset Terracotta Peach Coral
      badgeBg: "bg-rose-100 text-rose-950 border-rose-900",
      tagText: "Evening Unwind",
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-stone-900">
            What meal are we having?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
            Select a meal to explore ready-cooked meals or delicious pantry pairings.
          </p>
        </div>
      </div>

      {/* Spacious 2x2 Grid - No More Squeezed Cards! */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {options.map((opt) => {
          const isSelected = selectedType === opt.type;
          const isNow = currentSuggested === opt.type;

          return (
            <motion.button
              key={opt.type}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                if (typeof window !== "undefined" && window.navigator?.vibrate) {
                  window.navigator.vibrate(14);
                }
                onSelect(opt.type);
              }}
              aria-pressed={isSelected}
              aria-label={`Select ${opt.label} (${opt.emphasis})`}
              className={`relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl border-[2.5px] border-stone-900 text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-900 focus-visible:ring-offset-2 ${
                opt.cardBg
              } ${
                isSelected
                  ? "shadow-[6px_6px_0px_#1C1917] ring-2 ring-stone-900 -translate-y-1"
                  : "shadow-brutal hover:shadow-[6px_6px_0px_#1C1917]"
              }`}
            >
              {/* Card Top Row: Icon & Status Badge */}
              <div className="w-full flex items-center justify-between gap-2 mb-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white border-2 border-stone-900 shadow-brutal-sm flex items-center justify-center p-2 shrink-0">
                  {opt.icon}
                </div>

                <div className="flex items-center justify-end shrink-0 whitespace-nowrap">
                  {isNow && isSelected ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-stone-900 text-white border-2 border-stone-900 shadow-brutal-xs whitespace-nowrap shrink-0">
                      <Sparkle size={11} weight="fill" className="text-amber-400 shrink-0" />
                      <span className="whitespace-nowrap">Right Now</span>
                      <span className="w-1 h-1 rounded-full bg-stone-500 shrink-0" />
                      <CheckFat size={11} weight="fill" className="text-emerald-400 shrink-0" />
                    </span>
                  ) : isNow ? (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-white text-stone-900 border-2 border-stone-900 shadow-brutal-xs whitespace-nowrap shrink-0">
                      <Sparkle size={11} weight="fill" className="text-amber-500 shrink-0" />
                      <span className="whitespace-nowrap">Right Now</span>
                    </span>
                  ) : isSelected ? (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-stone-900 text-white border-2 border-stone-900 shadow-brutal-xs whitespace-nowrap shrink-0">
                      <CheckFat size={11} weight="fill" className="text-emerald-400 shrink-0" />
                      <span className="whitespace-nowrap">Selected</span>
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Card Core Content */}
              <div className="space-y-1.5 my-2">
                <div className="text-xl sm:text-2xl font-display font-black text-stone-900 tracking-tight flex items-baseline gap-2">
                  <span>{opt.label}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                  {opt.subtitle}
                </p>
              </div>

              {/* Card Footer Pill Strip */}
              <div className="mt-4 pt-3.5 border-t-2 border-stone-900/20 w-full flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-stone-900 bg-white/80 px-2.5 py-1 rounded-xl border border-stone-900/40 whitespace-nowrap shrink-0">
                  {opt.tagText}
                </span>
                <span className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap shrink-0">
                  <span>Explore</span>
                  <span>→</span>
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
