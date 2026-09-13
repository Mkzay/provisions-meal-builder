"use client";

import { Sparkle, X } from "@/components/icons";
import {
  clearNoteDismissal,
  dismissNoteForMealWindow,
  fetchClientCompanionNote,
  isNoteDismissedForMealWindow,
} from "@/lib/companion-notes";
import { MealType } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface CompanionNoteCardProps {
  mealType: MealType;
  owner: string;
  tags?: import("@/lib/types").NutrientTag[];
  mealTitle?: string;
  className?: string;
  isDismissible?: boolean;
}

const THEMES: Record<MealType, { bg: string; iconBg: string; text: string }> = {
  Breakfast: {
    bg: "bg-[#FEF9C3] dark:bg-[#2D1B03] dark:border-amber-500/50",
    iconBg: "bg-amber-300 dark:bg-amber-950/60 dark:text-amber-300",
    text: "text-amber-950 dark:text-amber-100",
  },
  Lunch: {
    bg: "bg-[#FED7AA] dark:bg-[#2A1605] dark:border-orange-500/50",
    iconBg: "bg-orange-300 dark:bg-orange-950/60 dark:text-orange-300",
    text: "text-amber-950 dark:text-orange-100",
  },
  Dinner: {
    bg: "bg-[#FECDD3] dark:bg-[#330812] dark:border-rose-500/50",
    iconBg: "bg-rose-300 dark:bg-rose-950/60 dark:text-rose-300",
    text: "text-rose-950 dark:text-rose-100",
  },
  Snack: {
    bg: "bg-[#D1FAE5] dark:bg-[#04261B] dark:border-emerald-500/50",
    iconBg: "bg-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300",
    text: "text-emerald-950 dark:text-emerald-100",
  },
};

export const CompanionNoteCard: React.FC<CompanionNoteCardProps> = ({
  mealType,
  owner,
  tags,
  mealTitle,
  className = "",
  isDismissible = true,
}) => {
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const dismissed = isNoteDismissedForMealWindow(mealType);
    setIsDismissed(dismissed);

    if (!dismissed) {
      setIsLoading(true);
      fetchClientCompanionNote(owner, mealType, false, tags, mealTitle)
        .then((text) => {
          if (active) {
            setNote(text);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (active) setIsLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [mealType, owner, tags?.join(","), mealTitle]);

  const handleDismiss = () => {
    dismissNoteForMealWindow(mealType);
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  const theme = THEMES[mealType] || THEMES.Lunch;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className={`p-4 rounded-2xl border-2 border-stone-900 shadow-brutal-sm dark:shadow-brutal-dark-sm ${theme.bg} ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-lg ${theme.iconBg} border border-stone-900 flex items-center justify-center text-stone-900 shadow-2xs`}
            >
              <Sparkle size={14} weight="fill" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Chef&apos;s Thought · {mealType}
            </span>
          </div>

          {isDismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              title="Dismiss for this meal window"
              aria-label="Dismiss note"
              className="p-1 rounded-md text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X size={13} weight="bold" />
            </button>
          )}
        </div>

        <p
          className={`text-xs font-medium leading-relaxed ${theme.text} ${
            isLoading ? "opacity-50 animate-pulse" : ""
          }`}
        >
          {note || "Taking time to feed yourself is the kindest thing you can do for your mind and body."}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
