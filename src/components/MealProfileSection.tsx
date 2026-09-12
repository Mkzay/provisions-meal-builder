"use client";

import { Check } from "@/components/icons";
import {
  fetchClientProfile,
  getCurrentOwner,
  getDefaultGoalForOwner,
  saveClientProfile,
} from "@/lib/profile-storage";
import { MealProfile, UserGoal } from "@/lib/types";
import React, { useEffect, useState } from "react";

interface MealProfileSectionProps {
  owner?: string;
  onSaved?: (profile: MealProfile) => void;
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

export const MealProfileSection: React.FC<MealProfileSectionProps> = ({
  owner: propOwner,
  onSaved,
}) => {
  const owner = propOwner || getCurrentOwner();
  const [selectedGoal, setSelectedGoal] = useState<UserGoal>(() =>
    getDefaultGoalForOwner(owner)
  );
  const [height, setHeight] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchClientProfile(owner)
      .then((existing) => {
        if (!active) return;
        if (existing) {
          setSelectedGoal(existing.goal || getDefaultGoalForOwner(owner));
          setHeight(existing.height ? String(existing.height) : "");
        } else {
          setSelectedGoal(getDefaultGoalForOwner(owner));
          setHeight("");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [owner]);

  const handleSave = async () => {
    setIsSaving(true);
    const parsedHeight = parseFloat(height);
    const validHeight =
      !isNaN(parsedHeight) && parsedHeight > 0
        ? Math.round(parsedHeight)
        : undefined;

    const res = await saveClientProfile({
      owner,
      goal: selectedGoal,
      height: validHeight,
    });

    setIsSaving(false);
    if (res.success) {
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate(12);
      }
      setJustSaved(true);
      onSaved?.(res.profile);
      setTimeout(() => {
        setJustSaved(false);
      }, 1800);
    }
  };

  return (
    <div className="space-y-4">
      {/* Owner Notice */}
      <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border-2 border-stone-900 shadow-brutal-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-stone-900" />
          <span className="text-xs font-bold text-stone-800">Instance:</span>
          <span className="text-xs font-black text-stone-900 bg-amber-200 px-2 py-0.5 rounded-md border border-stone-900/30">
            {owner}
          </span>
        </div>
        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
          Single User Setup
        </span>
      </div>

      {/* Goal Picker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
            Current Eating Goal
          </label>
          <span className="text-[11px] font-bold text-stone-500">Choose 1</span>
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
          <label className="text-xs font-bold text-stone-900">Height in cm (Optional)</label>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Notion Record
          </span>
        </div>
        <p className="text-[11px] text-stone-600 leading-snug">
          Stored in your Notion profile. No derived BMI or calories calculated.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="50"
            max="260"
            step="1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 168"
            className="flex-1 bg-[#FAF8F5] border-2 border-stone-900 rounded-xl px-3 py-2 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <span className="text-xs font-black text-stone-700 px-3 py-2 bg-stone-100 border-2 border-stone-900 rounded-xl">
            cm
          </span>
        </div>
      </div>

      {/* Action CTA */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving || isLoading}
        className={`w-full py-3 px-4 rounded-xl font-black text-xs border-2 border-stone-900 shadow-brutal-sm transition-all active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-2 ${
          justSaved
            ? "bg-emerald-400 text-stone-900"
            : isSaving
            ? "bg-amber-200 text-stone-700 cursor-wait"
            : "bg-amber-300 hover:bg-amber-400 text-stone-900"
        }`}
      >
        <span>
          {isSaving
            ? "Saving to Notion..."
            : justSaved
            ? "✓ Profile Saved to Notion!"
            : "Save Eating Profile"}
        </span>
      </button>
    </div>
  );
};
