"use client";

import { SmileyMeh, ThumbsDown, ThumbsUp, X } from "@/components/icons";
import { MealRating } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect } from "react";

interface MealRatingCardProps {
  isOpen: boolean;
  mealName?: string;
  onRate: (rating: MealRating) => void;
  onSkip: () => void;
}

export const MealRatingCard: React.FC<MealRatingCardProps> = ({
  isOpen,
  mealName,
  onRate,
  onSkip,
}) => {
  // ESC key listener for accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onSkip]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rating-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-sm bg-amber-50 dark:bg-stone-900 border-3 border-stone-900 dark:border-stone-700 rounded-3xl p-6 shadow-brutal dark:shadow-brutal-dark text-stone-900 dark:text-stone-100"
        >
          {/* Close / Skip top corner button */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 p-1.5 rounded-full border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 transition-colors"
            aria-label="Skip meal rating"
          >
            <X size={16} weight="bold" />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <h2 id="rating-title" className="text-xl font-black tracking-tight mb-1 text-stone-900 dark:text-stone-100">
              How was that?
            </h2>
            {mealName && (
              <p className="text-xs font-bold text-stone-600 dark:text-stone-400 line-clamp-1">
                {mealName}
              </p>
            )}
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              1-tap feedback trains your personalized suggestion engine.
            </p>
          </div>

          {/* 3 Rating Actions */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Liked */}
            <button
              onClick={() => onRate("Liked")}
              className="flex flex-col items-center justify-center gap-2 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-2 border-stone-900 dark:border-emerald-600/50 rounded-2xl shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all group"
            >
              <div className="p-2 bg-emerald-400 dark:bg-emerald-500 text-stone-950 rounded-xl border border-stone-900 dark:border-emerald-600 group-hover:scale-110 transition-transform">
                <ThumbsUp size={22} weight="fill" />
              </div>
              <span className="text-xs font-black text-emerald-950 dark:text-emerald-300">Liked</span>
            </button>

            {/* Neutral */}
            <button
              onClick={() => onRate("Neutral")}
              className="flex flex-col items-center justify-center gap-2 p-3.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border-2 border-stone-900 dark:border-stone-700 rounded-2xl shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all group"
            >
              <div className="p-2 bg-stone-300 dark:bg-stone-700 text-stone-900 dark:text-stone-200 rounded-xl border border-stone-900 dark:border-stone-600 group-hover:scale-110 transition-transform">
                <SmileyMeh size={22} weight="bold" />
              </div>
              <span className="text-xs font-black text-stone-800 dark:text-stone-200">Neutral</span>
            </button>

            {/* Disliked */}
            <button
              onClick={() => onRate("Disliked")}
              className="flex flex-col items-center justify-center gap-2 p-3.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border-2 border-stone-900 dark:border-rose-600/50 rounded-2xl shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all group"
            >
              <div className="p-2 bg-rose-400 dark:bg-rose-500 text-stone-950 rounded-xl border border-stone-900 dark:border-rose-600 group-hover:scale-110 transition-transform">
                <ThumbsDown size={22} weight="fill" />
              </div>
              <span className="text-xs font-black text-rose-950 dark:text-rose-300">Disliked</span>
            </button>
          </div>

          {/* Prominent Non-blocking Skip */}
          <div className="text-center">
            <button
              onClick={onSkip}
              className="text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 underline underline-offset-4 decoration-stone-400 transition-colors"
            >
              Skip, leave unrated
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
