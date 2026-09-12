"use client";

import { Check, Sparkle, User, X } from "@/components/icons";
import {
  getCurrentOwner,
  getDefaultGoalForOwner,
  getStoredProfile,
  saveStoredProfile,
} from "@/lib/profile-storage";
import { MealProfile, UserGoal } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface MealProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProgressLog?: () => void;
  onProfileSaved?: (profile: MealProfile) => void;
}

const GOAL_OPTIONS: {
  goal: UserGoal;
  label: string;
  badge: string;
  description: string;
}[] = [
  {
    goal: "Gain weight",
    label: "Gain weight",
    badge: "Esther's Default",
    description: "Hearty, nourishing meals to steadily increase intake and energy.",
  },
  {
    goal: "Eat healthier",
    label: "Eat healthier",
    badge: "Balanced",
    description: "Wholesome foods, vibrant proteins, and consistent daily fuel.",
  },
  {
    goal: "Eat more food generally",
    label: "Eat more food generally",
    badge: "Regular Intake",
    description: "Overcoming meal skipping with low-friction, appetizing plates.",
  },
  {
    goal: "Lose weight",
    label: "Lose weight",
    badge: "Paced",
    description: "Satisfying, mindful meals that leave you light and refreshed.",
  },
];

export const MealProfileModal: React.FC<MealProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenProgressLog,
  onProfileSaved,
}) => {
  const owner = getCurrentOwner();
  const [selectedGoal, setSelectedGoal] = useState<UserGoal>(() => {
    const existing = getStoredProfile(owner);
    return existing?.goal || getDefaultGoalForOwner(owner);
  });
  const [height, setHeight] = useState<string>(() => {
    const existing = getStoredProfile(owner);
    return existing?.height || "";
  });
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existing = getStoredProfile(owner);
      setSelectedGoal(existing?.goal || getDefaultGoalForOwner(owner));
      setHeight(existing?.height || "");
      setJustSaved(false);
    }
  }, [isOpen, owner]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = () => {
    const updatedProfile: MealProfile = {
      owner,
      goal: selectedGoal,
      height: height.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    saveStoredProfile(updatedProfile);

    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(15);
    }

    setJustSaved(true);
    onProfileSaved?.(updatedProfile);
    setTimeout(() => {
      setJustSaved(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-profile-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF8F5] border-[2.5px] border-stone-900 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-2 border-stone-900 shrink-0 bg-[#FAF8F5]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-300 border-2 border-stone-900 shadow-brutal-sm flex items-center justify-center text-stone-900 shrink-0">
                <User size={22} weight="bold" />
              </div>
              <div>
                <h3
                  id="meal-profile-modal-title"
                  className="text-lg sm:text-xl font-display font-black tracking-tight text-stone-900"
                >
                  {owner}&apos;s Meal Profile
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 font-medium">
                  Your eating goal &amp; personal context. Editable anytime.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close profile"
              className="p-2 rounded-xl border-2 border-stone-900 bg-white shadow-brutal-sm hover:bg-stone-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-6 space-y-5 min-h-0">
            {/* Owner Instance Notice */}
            <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border-2 border-stone-900 shadow-brutal-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-stone-900" />
                <span className="text-xs font-bold text-stone-800">
                  Instance Owner:
                </span>
                <span className="text-xs font-black text-stone-900 bg-amber-200 px-2 py-0.5 rounded-md border border-stone-900/30">
                  {owner}
                </span>
              </div>
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                Single User
              </span>
            </div>

            {/* Goal Picker */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                  Your Current Eating Goal
                </label>
                <span className="text-[11px] font-bold text-stone-500">
                  Choose 1
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {GOAL_OPTIONS.map((item) => {
                  const isSelected = selectedGoal === item.goal;
                  return (
                    <button
                      key={item.goal}
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined" && window.navigator?.vibrate) {
                          window.navigator.vibrate(8);
                        }
                        setSelectedGoal(item.goal);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border-2 border-stone-900 transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? "bg-amber-200 shadow-brutal-sm -translate-y-0.5"
                          : "bg-white hover:bg-stone-50 shadow-xs"
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-black text-sm text-stone-900">
                            {item.label}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-stone-900/30 text-stone-700">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-700 font-medium leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border-2 border-stone-900 shrink-0 mt-0.5 flex items-center justify-center ${
                          isSelected ? "bg-stone-900 text-white" : "bg-white"
                        }`}
                      >
                        {isSelected && <Check size={12} weight="bold" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Static Height */}
            <div className="p-4 bg-white rounded-2xl border-2 border-stone-900 shadow-brutal-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-900">
                  Height (Optional)
                </label>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Static record
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                Stored once here for your records. No derived BMI or calories calculated.
              </p>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 168 cm or 5'6&quot;"
                className="w-full bg-[#FAF8F5] border-2 border-stone-900 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Switch to Progress Log link */}
            {onOpenProgressLog && (
              <div className="p-4 rounded-2xl bg-purple-50 border-2 border-stone-900 shadow-brutal-xs flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    Weight Progress Log
                  </span>
                  <span className="text-[11px] text-stone-600">
                    Track your weigh-ins over time independently.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenProgressLog();
                  }}
                  className="px-3 py-1.5 rounded-xl font-black text-xs bg-white hover:bg-stone-100 border-2 border-stone-900 shadow-brutal-xs text-stone-900 shrink-0 active:translate-x-0.5 active:translate-y-0.5"
                >
                  View Log →
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-stone-900 bg-stone-100/90 shrink-0 flex items-center justify-between gap-3 safe-area-bottom">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-stone-800 border-2 border-stone-900 shadow-brutal-sm hover:bg-stone-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-6 py-2.5 rounded-xl font-black text-xs border-2 border-stone-900 shadow-brutal-sm transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                justSaved
                  ? "bg-emerald-400 text-stone-900"
                  : "bg-amber-300 hover:bg-amber-400 text-stone-900"
              }`}
            >
              {justSaved ? "Saved!" : "Save Profile"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
