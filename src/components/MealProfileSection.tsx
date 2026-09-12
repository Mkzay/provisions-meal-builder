"use client";

import { Check } from "@/components/icons";
import {
  fetchClientProfile,
  getClientProfileCached,
  getCurrentOwner,
  getDefaultGoalForOwner,
  saveClientProfile,
} from "@/lib/profile-storage";
import { MealProfile, NutrientTag, UserGoal } from "@/lib/types";
import React, { useEffect, useState } from "react";

interface MealProfileSectionProps {
  owner?: string;
  onSaved?: (profile: MealProfile) => void;
}

const NUTRIENT_OPTIONS: { tag: NutrientTag; label: string; icon: string; desc: string }[] = [
  { tag: "High Fiber", label: "High Fiber", icon: "🌾", desc: "Digestion & steady blood sugar" },
  { tag: "High Protein", label: "High Protein", icon: "🍗", desc: "Strength & long-lasting satiety" },
  { tag: "High Carb", label: "High Carb", icon: "⚡", desc: "Immediate fuel & stamina" },
  { tag: "High Fat", label: "High Fat", icon: "🥑", desc: "Clean cell energy & calm focus" },
];

const GOAL_OPTIONS: { goal: UserGoal; label: string; badge: string; description: string }[] = [
  { goal: "Gain weight", label: "Gain weight", badge: "Default", description: "Hearty, nourishing meals to steadily increase intake and energy." },
  { goal: "Eat healthier", label: "Eat healthier", badge: "Balanced", description: "Wholesome foods, vibrant proteins, and consistent daily fuel." },
  { goal: "Eat more food generally", label: "Eat more food generally", badge: "Regular Intake", description: "Overcoming meal skipping with low-friction, appetizing plates." },
  { goal: "Lose weight", label: "Lose weight", badge: "Paced", description: "Satisfying, mindful meals that leave you light and refreshed." },
];

export const MealProfileSection: React.FC<MealProfileSectionProps> = ({
  owner: propOwner,
  onSaved,
}) => {
  const owner = propOwner || getCurrentOwner();
  const cachedInitial = getClientProfileCached(owner);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal>(() => cachedInitial?.goal || getDefaultGoalForOwner(owner));
  const [selectedPriorities, setSelectedPriorities] = useState<NutrientTag[]>(() => cachedInitial?.nutrientPriorities || []);
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [heightCm, setHeightCm] = useState<string>(() => cachedInitial?.height ? String(cachedInitial.height) : "");
  const initInches = cachedInitial?.height ? Math.round(cachedInitial.height / 2.54) : null;
  const [feet, setFeet] = useState<string>(() => initInches ? String(Math.floor(initInches / 12)) : "");
  const [inches, setInches] = useState<string>(() => initInches ? String(initInches % 12) : "");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleCmChange = (val: string) => {
    setHeightCm(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const totalIn = Math.round(num / 2.54);
      setFeet(String(Math.floor(totalIn / 12)));
      setInches(String(totalIn % 12));
    } else {
      setFeet("");
      setInches("");
    }
  };

  const handleFeetChange = (val: string) => {
    setFeet(val);
    const f = parseInt(val) || 0;
    const i = parseFloat(inches) || 0;
    setHeightCm(f > 0 || i > 0 ? String(Math.round((f * 12 + i) * 2.54)) : "");
  };

  const handleInchesChange = (val: string) => {
    setInches(val);
    const f = parseInt(feet) || 0;
    const i = parseFloat(val) || 0;
    setHeightCm(f > 0 || i > 0 ? String(Math.round((f * 12 + i) * 2.54)) : "");
  };

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchClientProfile(owner)
      .then((existing) => {
        if (!active) return;
        if (existing) {
          setSelectedGoal(existing.goal || getDefaultGoalForOwner(owner));
          setSelectedPriorities(existing.nutrientPriorities || []);
          if (existing.height) {
            const cmVal = existing.height;
            setHeightCm(String(cmVal));
            const totalIn = Math.round(cmVal / 2.54);
            setFeet(String(Math.floor(totalIn / 12)));
            setInches(String(totalIn % 12));
          }
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [owner]);

  const togglePriority = (tag: NutrientTag) => {
    setSelectedPriorities((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    let validHeight: number | undefined;
    if (heightUnit === "cm") {
      const num = parseFloat(heightCm);
      if (!isNaN(num) && num > 0) validHeight = Math.round(num);
    } else {
      const f = parseInt(feet) || 0;
      const i = parseFloat(inches) || 0;
      if (f > 0 || i > 0) {
        validHeight = Math.round((f * 12 + i) * 2.54);
      }
    }

    const res = await saveClientProfile({
      owner,
      goal: selectedGoal,
      height: validHeight,
      nutrientPriorities: selectedPriorities,
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

      {/* Nutrient Priorities Configuration */}
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-stone-900">
              Nutrient Priorities (Optional)
            </label>
            <span className="text-[10px] font-bold text-stone-500">Multi-select</span>
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            Steers meal suggestions toward pairings that hit these qualities.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {NUTRIENT_OPTIONS.map((item) => {
            const isSelected = selectedPriorities.includes(item.tag);
            return (
              <button
                key={item.tag}
                type="button"
                onClick={() => togglePriority(item.tag)}
                className={`text-left p-2.5 rounded-xl border-2 border-stone-900 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-200 shadow-brutal-xs -translate-y-0.5"
                    : "bg-white hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm">{item.icon}</span>
                  <div
                    className={`w-4 h-4 rounded-md border border-stone-900 flex items-center justify-center ${
                      isSelected ? "bg-stone-900 text-white" : "bg-white"
                    }`}
                  >
                    {isSelected && <Check size={10} weight="bold" />}
                  </div>
                </div>
                <div className="font-display font-black text-xs text-stone-900 leading-tight">
                  {item.label}
                </div>
                <div className="text-[10px] text-stone-600 font-medium leading-tight mt-0.5">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Height Configuration */}
      <div className="p-4 bg-white rounded-2xl border-2 border-stone-900 shadow-brutal-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-stone-900">
            Height (Optional)
          </label>
          {/* Segmented Pill Switcher */}
          <div className="inline-flex items-center p-0.5 bg-stone-200/90 rounded-lg border border-stone-900">
            <button
              type="button"
              onClick={() => setHeightUnit("cm")}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all ${
                heightUnit === "cm"
                  ? "bg-amber-300 text-stone-900 border border-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              cm
            </button>
            <button
              type="button"
              onClick={() => setHeightUnit("ft")}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all ${
                heightUnit === "ft"
                  ? "bg-purple-300 text-stone-900 border border-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              ft / in
            </button>
          </div>
        </div>

        <p className="text-[11px] text-stone-600 leading-snug">
          Stored in your profile. No derived BMI or calories calculated.
        </p>

        {heightUnit === "cm" ? (
          <div className="relative">
            <input
              type="number"
              min="50"
              max="260"
              step="1"
              inputMode="numeric"
              pattern="[0-9]*"
              enterKeyHint="done"
              value={heightCm}
              onChange={(e) => handleCmChange(e.target.value)}
              placeholder="e.g. 178"
              className="w-full bg-[#FAF8F5] border-2 border-stone-900 rounded-xl px-3.5 py-2.5 pr-14 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-stone-600 px-2 py-1 bg-stone-200/80 border border-stone-900 rounded-lg">
              cm
            </span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="3"
                  max="8"
                  step="1"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  enterKeyHint="next"
                  value={feet}
                  onChange={(e) => handleFeetChange(e.target.value)}
                  placeholder="5"
                  className="w-full bg-[#FAF8F5] border-2 border-stone-900 rounded-xl px-3.5 py-2.5 pr-12 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-stone-600 px-2 py-1 bg-stone-200/80 border border-stone-900 rounded-lg">
                  ft
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="11.9"
                  step="any"
                  inputMode="decimal"
                  enterKeyHint="done"
                  value={inches}
                  onChange={(e) => handleInchesChange(e.target.value)}
                  placeholder="10"
                  className="w-full bg-[#FAF8F5] border-2 border-stone-900 rounded-xl px-3.5 py-2.5 pr-12 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-stone-600 px-2 py-1 bg-stone-200/80 border border-stone-900 rounded-lg">
                  in
                </span>
              </div>
            </div>
            {heightCm && (
              <p className="text-[10px] font-bold text-stone-500 pl-1">
                Equivalent to ~{heightCm} cm
              </p>
            )}
          </div>
        )}
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
            ? "Saving Profile..."
            : justSaved
            ? "✓ Profile Saved!"
            : "Save Eating Profile"}
        </span>
      </button>
    </div>
  );
};
