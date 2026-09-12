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
  className?: string;
  isDismissible?: boolean;
}

const THEMES: Record<MealType, { bg: string; iconBg: string; text: string }> = {
  Breakfast: {
    bg: "bg-[#FEF9C3]", // Warm morning butter
    iconBg: "bg-amber-300",
    text: "text-amber-950",
  },
  Lunch: {
    bg: "bg-[#FED7AA]", // Energizing midday peach
    iconBg: "bg-orange-300",
    text: "text-amber-950",
  },
  Dinner: {
    bg: "bg-[#FECDD3]", // Calming evening rose
    iconBg: "bg-rose-300",
    text: "text-rose-950",
  },
  Snack: {
    bg: "bg-[#D1FAE5]", // Fresh crisp mint
    iconBg: "bg-emerald-300",
    text: "text-emerald-950",
  },
};

export const CompanionNoteCard: React.FC<CompanionNoteCardProps> = ({
  mealType,
  owner,
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
      fetchClientCompanionNote(owner, mealType)
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
  }, [mealType, owner]);

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
        className={`p-4 rounded-2xl border-2 border-stone-900 shadow-brutal-sm ${theme.bg} ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-lg ${theme.iconBg} border border-stone-900 flex items-center justify-center text-stone-900 shadow-2xs`}
            >
              <Sparkle size={14} weight="fill" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-900">
              Chef&apos;s Thought · {mealType}
            </span>
          </div>

          {isDismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              title="Dismiss for this meal window"
              aria-label="Dismiss note"
              className="p-1 rounded-md text-stone-500 hover:text-stone-900 hover:bg-black/5 transition-colors"
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
