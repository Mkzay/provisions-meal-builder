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
import React, { useEffect, useMemo, useState } from "react";

export type TwoMealSchedule = "lunch_dinner" | "breakfast_dinner" | "breakfast_lunch";

interface MealTypeSelectorProps {
  selectedType: MealType;
  onSelect: (type: MealType) => void;
  mealsPerDay?: number;
}

export const MealTypeSelector: React.FC<MealTypeSelectorProps> = ({
  selectedType,
  onSelect,
  mealsPerDay = 4,
}) => {
  const effectiveMeals = mealsPerDay || 4;
  const isTwoMealsPlan = effectiveMeals === 2;
  const isThreeMealsPlan = effectiveMeals === 3;

  const [twoMealSchedule, setTwoMealSchedule] = useState<TwoMealSchedule>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("meal_builder_two_meal_schedule");
      if (saved === "lunch_dinner" || saved === "breakfast_dinner" || saved === "breakfast_lunch") {
        return saved;
      }
    }
    return "lunch_dinner";
  });

  const [showSnack, setShowSnack] = useState(false);

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
      icon: <SunHorizon size={26} weight="duotone" className="text-amber-800" />,
      cardBg: "bg-[#FEF08A]", // Rich Buttercup Yellow
      badgeBg: "bg-amber-100 text-amber-950 border-amber-800",
      tagText: "Morning Fuel",
    },
    {
      type: "Lunch",
      label: "Lunch",
      emphasis: "midday refuel",
      subtitle: "Hearty, nourishing plate to power your focus.",
      icon: <BowlFood size={26} weight="duotone" className="text-emerald-800" />,
      cardBg: "bg-[#A7F3D0]", // Vibrant Fresh Mint
      badgeBg: "bg-emerald-100 text-emerald-950 border-emerald-800",
      tagText: "Peak Energy",
    },
    {
      type: "Dinner",
      label: "Dinner",
      emphasis: "cozy comfort",
      subtitle: "Unwind from the day with a satisfying warm meal.",
      icon: <MoonStars size={26} weight="duotone" className="text-rose-900" />,
      cardBg: "bg-[#FECDD3]", // Sunset Terracotta Peach Coral
      badgeBg: "bg-rose-100 text-rose-950 border-rose-900",
      tagText: "Evening Unwind",
    },
    {
      type: "Snack",
      label: "Snack & Craving",
      emphasis: "zero hassle",
      subtitle: "Quick 2-minute nibbles, fruit bowls & sweet bites.",
      icon: <Cookie size={26} weight="duotone" className="text-purple-900" />,
      cardBg: "bg-[#DDD6FE]", // Electric Lavender Lilac
      badgeBg: "bg-purple-100 text-purple-950 border-purple-900",
      tagText: "Quick Bites",
    },
  ];

  const visibleOptions = useMemo(() => {
    if (isTwoMealsPlan) {
      let allowed: MealType[] = [];
      if (twoMealSchedule === "lunch_dinner") allowed = ["Lunch", "Dinner"];
      else if (twoMealSchedule === "breakfast_dinner") allowed = ["Breakfast", "Dinner"];
      else if (twoMealSchedule === "breakfast_lunch") allowed = ["Breakfast", "Lunch"];

      if (showSnack) allowed.push("Snack");
      return options.filter((opt) => allowed.includes(opt.type));
    }

    if (isThreeMealsPlan) {
      return options.filter((opt) => opt.type !== "Snack");
    }

    return options;
  }, [isTwoMealsPlan, isThreeMealsPlan, twoMealSchedule, showSnack]);

  // Ensure current selection is valid for active schedule
  useEffect(() => {
    const isCurrentVisible = visibleOptions.some((o) => o.type === selectedType);
    if (!isCurrentVisible && visibleOptions.length > 0) {
      onSelect(visibleOptions[0].type);
    }
  }, [visibleOptions, selectedType, onSelect]);

  const isThreeColumns = visibleOptions.length === 3;

  const handleScheduleChange = (schedule: TwoMealSchedule) => {
    setTwoMealSchedule(schedule);
    if (typeof window !== "undefined") {
      localStorage.setItem("meal_builder_two_meal_schedule", schedule);
      if (window.navigator?.vibrate) window.navigator.vibrate(10);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Title & Description Row */}
      <div className="space-y-1.5 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-stone-900">
            What meal are we having?
          </h2>
          {isTwoMealsPlan && (
            <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-amber-200 border-2 border-stone-900 shadow-brutal-xs text-stone-900">
              <Sparkle size={12} weight="fill" className="text-amber-700" />
              <span>2 Meals / Day</span>
            </span>
          )}
          {isThreeMealsPlan && (
            <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-emerald-200 border-2 border-stone-900 shadow-brutal-xs text-stone-900">
              <Sparkle size={12} weight="fill" className="text-emerald-700" />
              <span>3 Meals / Day</span>
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
          {isTwoMealsPlan
            ? "Calibrated to your 2-meals-a-day schedule. Choose your meal slot below."
            : isThreeMealsPlan
            ? "Breakfast, Lunch & Dinner calibrated to your 3-meals daily goal."
            : "Select a meal to explore ready-cooked meals or delicious pantry pairings."}
        </p>
      </div>

      {/* 2-Meals Schedule Switcher Toolbar on its own line */}
      {isTwoMealsPlan && (
        <div className="flex items-center gap-2 flex-wrap p-2 bg-stone-100/90 rounded-2xl border-2 border-stone-900 shadow-brutal-xs">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-600 px-2 shrink-0">
            Schedule:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => handleScheduleChange("lunch_dinner")}
              className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all ${
                twoMealSchedule === "lunch_dinner"
                  ? "bg-amber-300 text-stone-900 border-2 border-stone-900 shadow-brutal-xs"
                  : "text-stone-700 hover:text-stone-900 hover:bg-stone-200"
              }`}
            >
              Lunch &amp; Dinner
            </button>
            <button
              type="button"
              onClick={() => handleScheduleChange("breakfast_dinner")}
              className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all ${
                twoMealSchedule === "breakfast_dinner"
                  ? "bg-amber-300 text-stone-900 border-2 border-stone-900 shadow-brutal-xs"
                  : "text-stone-700 hover:text-stone-900 hover:bg-stone-200"
              }`}
            >
              Breakfast &amp; Dinner
            </button>
            <button
              type="button"
              onClick={() => handleScheduleChange("breakfast_lunch")}
              className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all ${
                twoMealSchedule === "breakfast_lunch"
                  ? "bg-amber-300 text-stone-900 border-2 border-stone-900 shadow-brutal-xs"
                  : "text-stone-700 hover:text-stone-900 hover:bg-stone-200"
              }`}
            >
              Breakfast &amp; Lunch
            </button>
          </div>
        </div>
      )}

      {/* Responsive Grid: 2 Columns for all plans (3-meal plan places 2 on top, 3rd centered below) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {visibleOptions.map((opt, index) => {
          const isSelected = selectedType === opt.type;
          const isNow = currentSuggested === opt.type;
          const isThirdInThree = visibleOptions.length === 3 && index === 2;

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
              className={`relative flex flex-col justify-between p-5 sm:p-6 rounded-3xl border-[2.5px] border-stone-900 text-left overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-900 focus-visible:ring-offset-2 ${
                opt.cardBg
              } ${
                isThirdInThree ? "sm:col-span-2 sm:w-[calc(50%-0.625rem)] sm:mx-auto" : ""
              } ${
                isSelected
                  ? "shadow-[6px_6px_0px_#1C1917] ring-2 ring-stone-900 -translate-y-1"
                  : "shadow-brutal hover:shadow-[6px_6px_0px_#1C1917]"
              }`}
            >
              {/* Card Top Row: Icon & Status Badge */}
              <div className="w-full flex items-center justify-between gap-2 mb-3.5">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white border-2 border-stone-900 shadow-brutal-sm flex items-center justify-center p-2 shrink-0">
                  {opt.icon}
                </div>

                <div className="flex items-center justify-end shrink-0">
                  {isNow && isSelected ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-stone-900 text-white border-2 border-stone-900 shadow-brutal-xs whitespace-nowrap shrink-0">
                      <Sparkle size={11} weight="fill" className="text-amber-400 shrink-0" />
                      <span>Now</span>
                      <span className="w-1 h-1 rounded-full bg-stone-500 shrink-0" />
                      <CheckFat size={11} weight="fill" className="text-emerald-400 shrink-0" />
                    </span>
                  ) : isNow ? (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-white text-stone-900 border-2 border-stone-900 shadow-brutal-xs whitespace-nowrap shrink-0">
                      <Sparkle size={11} weight="fill" className="text-amber-500 shrink-0" />
                      <span>Now</span>
                    </span>
                  ) : isSelected ? (
                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-stone-900 text-white border-2 border-stone-900 shadow-brutal-xs whitespace-nowrap shrink-0">
                      <CheckFat size={11} weight="fill" className="text-emerald-400 shrink-0" />
                      <span>Selected</span>
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Card Core Content */}
              <div className="space-y-1.5 my-2 min-w-0">
                <div className="text-xl sm:text-2xl font-display font-black text-stone-900 tracking-tight flex items-baseline gap-2">
                  <span>{opt.label}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                  {opt.subtitle}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t-2 border-stone-900/15 w-full flex items-center justify-between gap-2 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-stone-900 bg-white/90 px-2.5 py-1 rounded-xl border border-stone-900/30 whitespace-nowrap shrink-0">
                  {opt.tagText}
                </span>
                <span className="text-xs sm:text-sm font-black text-stone-900 flex items-center gap-1.5 whitespace-nowrap shrink-0">
                  <span>Explore</span>
                  <span>→</span>
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Optional snack craving toggle when on 2-meal schedule */}
      {isTwoMealsPlan && (
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => setShowSnack((prev) => !prev)}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 underline underline-offset-2 transition-colors"
          >
            {showSnack ? "← Hide snack slot" : "+ Need a snack craving today? Show snack option"}
          </button>
        </div>
      )}
    </div>
  );
};
