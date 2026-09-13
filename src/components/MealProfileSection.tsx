"use client";

import { Check } from "@/components/icons";
import { ProfileMetricsInputs } from "@/components/ProfileMetricsInputs";
import { GOAL_OPTIONS, NUTRIENT_OPTIONS } from "@/lib/profile-constants";
import {
  addClientWeightLog,
  fetchClientProfile,
  fetchClientWeightLogs,
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
  onRegisterSave?: (saveFn: () => Promise<void>) => void;
  onSaveStateChange?: (isSaving: boolean, justSaved: boolean) => void;
}

export const MealProfileSection: React.FC<MealProfileSectionProps> = ({
  owner: propOwner,
  onSaved,
  onRegisterSave,
  onSaveStateChange,
}) => {
  const owner = propOwner || getCurrentOwner();
  const cachedInitial = getClientProfileCached(owner);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal>(() => cachedInitial?.goal || getDefaultGoalForOwner(owner));
  const [mealsPerDay, setMealsPerDay] = useState<number>(() => cachedInitial?.mealsPerDay || 4);
  const [selectedPriorities, setSelectedPriorities] = useState<NutrientTag[]>(() => cachedInitial?.nutrientPriorities || []);
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [heightCm, setHeightCm] = useState<string>(() => cachedInitial?.height ? String(cachedInitial.height) : "");
  const initInches = cachedInitial?.height ? Math.round(cachedInitial.height / 2.54) : null;
  const [feet, setFeet] = useState<string>(() => initInches ? String(Math.floor(initInches / 12)) : "");
  const [inches, setInches] = useState<string>(() => initInches ? String(initInches % 12) : "");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [weightInput, setWeightInput] = useState<string>(() =>
    cachedInitial?.weight ? String(cachedInitial.weight) : ""
  );
  const [twoMealSchedule, setTwoMealSchedule] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("meal_builder_two_meal_schedule") || "lunch_dinner";
    }
    return "lunch_dinner";
  });
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

  const syncImperialToCm = (fStr: string, inStr: string) => {
    const f = parseInt(fStr) || 0;
    const i = parseFloat(inStr) || 0;
    setHeightCm(f > 0 || i > 0 ? String(Math.round((f * 12 + i) * 2.54)) : "");
  };
  const handleFeetChange = (val: string) => { setFeet(val); syncImperialToCm(val, inches); };
  const handleInchesChange = (val: string) => { setInches(val); syncImperialToCm(feet, val); };

  const handleWeightUnitChange = (u: "kg" | "lbs") => {
    if (u === weightUnit) return;
    setWeightUnit(u);
    const num = parseFloat(weightInput);
    if (!isNaN(num) && num > 0) {
      setWeightInput(String(Math.round((u === "lbs" ? num * 2.20462 : num / 2.20462) * 10) / 10));
    }
  };

  const vibrate = (ms = 8) => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) window.navigator.vibrate(ms);
  };

  const handleScheduleSelect = (sch: string) => {
    vibrate(8);
    setTwoMealSchedule(sch);
    if (typeof window !== "undefined") {
      localStorage.setItem("meal_builder_two_meal_schedule", sch);
      window.dispatchEvent(new Event("two_meal_schedule_changed"));
    }
    handleSave({ mealsPerDay: 2 });
  };

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchClientProfile(owner)
      .then((existing) => {
        if (!active || !existing) return;
        setSelectedGoal(existing.goal || getDefaultGoalForOwner(owner));
        if (existing.mealsPerDay) setMealsPerDay(existing.mealsPerDay);
        setSelectedPriorities(existing.nutrientPriorities || []);
        if (existing.height) {
          const cmVal = existing.height;
          setHeightCm(String(cmVal));
          const totalIn = Math.round(cmVal / 2.54);
          setFeet(String(Math.floor(totalIn / 12)));
          setInches(String(totalIn % 12));
        }
        if (existing.weight) {
          setWeightInput(String(existing.weight));
        } else {
          fetchClientWeightLogs(owner).then((logs) => {
            if (active && logs[0]?.weight) setWeightInput(String(logs[0].weight));
          });
        }
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [owner]);

  const togglePriority = (tag: NutrientTag) => {
    const next = selectedPriorities.includes(tag)
      ? selectedPriorities.filter((t) => t !== tag)
      : [...selectedPriorities, tag];
    setSelectedPriorities(next);
    handleSave({ nutrientPriorities: next });
  };

  const handleSave = async (overrides?: Partial<MealProfile>) => {
    setIsSaving(true);
    const parsedCm = parseFloat(heightCm);
    const parsedFt = parseInt(feet) || 0;
    const parsedIn = parseFloat(inches) || 0;
    const validHeight = heightUnit === "cm"
      ? (!isNaN(parsedCm) && parsedCm > 0 ? Math.round(parsedCm) : undefined)
      : (parsedFt > 0 || parsedIn > 0 ? Math.round((parsedFt * 12 + parsedIn) * 2.54) : undefined);

    const wNum = parseFloat(weightInput);
    const validWeight = !isNaN(wNum) && wNum > 0
      ? Math.round((weightUnit === "kg" ? wNum : wNum / 2.20462) * 10) / 10
      : undefined;

    const res = await saveClientProfile({
      owner,
      goal: overrides?.goal || selectedGoal,
      height: validHeight,
      weight: validWeight,
      nutrientPriorities: overrides?.nutrientPriorities || selectedPriorities,
      mealsPerDay: overrides?.mealsPerDay || mealsPerDay,
    });

    if (res.success && validWeight) {
      addClientWeightLog({
        owner,
        date: new Date().toISOString().slice(0, 10),
        weight: validWeight,
        unit: "kg",
      }).catch(() => {});
    }

    setIsSaving(false);
    if (res.success) {
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate(10);
      }
      setJustSaved(true);
      onSaved?.(res.profile);
      setTimeout(() => setJustSaved(false), 2000);
    }
  };

  useEffect(() => {
    onRegisterSave?.(() => handleSave());
  }, [onRegisterSave]);

  useEffect(() => {
    onSaveStateChange?.(isSaving, justSaved);
  }, [isSaving, justSaved, onSaveStateChange]);

  return (
    <div className="space-y-4">
      {/* Owner Notice */}
      <div className="flex items-center justify-between p-3.5 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-stone-900" />
          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">Instance:</span>
          <span className="text-xs font-black text-stone-900 dark:text-amber-200 bg-amber-200 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-stone-900/30 dark:border-amber-600/50">
            {owner}
          </span>
        </div>
        <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          Single User Setup
        </span>
      </div>

      {/* Goal Picker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 block">
            Current Eating Goal
          </label>
          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">Choose 1</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {GOAL_OPTIONS.map((item) => {
            const isSelected = selectedGoal === item.goal;
            return (
              <button
                key={item.goal}
                type="button"
                onClick={() => {
                  vibrate(8);
                  setSelectedGoal(item.goal);
                  handleSave({ goal: item.goal });
                }}
                className={`w-full text-left p-3.5 rounded-2xl border-2 border-stone-900 dark:border-stone-700 transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? "bg-amber-200 dark:bg-amber-950/80 dark:border-amber-500/80 shadow-brutal-sm -translate-y-0.5"
                    : "bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-xs"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display font-black text-sm text-stone-900 dark:text-stone-100">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 dark:bg-stone-800 border border-stone-900/30 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 border-stone-900 dark:border-stone-600 shrink-0 mt-0.5 flex items-center justify-center ${
                    isSelected ? "bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950" : "bg-white dark:bg-stone-800"
                  }`}
                >
                  {isSelected && <Check size={12} weight="bold" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meals Per Day Configuration */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <label className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Meals Per Day
          </label>
          <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400">Daily rhythm</span>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400">
          How many meals you aim to eat daily (calibrates target intake and reminders).
        </p>

        <div className="grid grid-cols-3 gap-2">
          {[
            { count: 2, label: "2", sub: "Two Meals" },
            { count: 3, label: "3", sub: "No Snack" },
            { count: 4, label: "4", sub: "Default (+ Snack)" },
          ].map((item) => {
            const isSelected = mealsPerDay === item.count;
            return (
              <button
                key={item.count}
                type="button"
                onClick={() => {
                  vibrate(8);
                  setMealsPerDay(item.count);
                  handleSave({ mealsPerDay: item.count });
                }}
                className={`py-2.5 px-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 text-center transition-all flex flex-col items-center justify-center ${
                  isSelected
                    ? "bg-amber-200 dark:bg-amber-400 shadow-brutal-xs -translate-y-0.5 font-black text-stone-900 dark:text-stone-950"
                    : "bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 font-bold text-stone-700 dark:text-stone-300 shadow-xs"
                }`}
              >
                <span className="text-base font-black font-display leading-tight">{item.label}</span>
                <span className="text-[10px] font-bold tracking-tight text-stone-600 dark:text-stone-400 mt-0.5 leading-none">
                  {item.sub}
                </span>
              </button>
            );
          })}
        </div>

        {mealsPerDay === 2 && (
          <div className="mt-2.5 p-2.5 bg-stone-50 dark:bg-stone-900 rounded-2xl border-2 border-stone-900 dark:border-stone-700 space-y-1.5">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
                2-Meal Combination
              </span>
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400">Pick daily cadence</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "lunch_dinner", label: "Lunch & Dinner" },
                { id: "breakfast_dinner", label: "Breakfast & Dinner" },
                { id: "breakfast_lunch", label: "Breakfast & Lunch" },
              ].map((sch) => (
                <button
                  key={sch.id}
                  type="button"
                  onClick={() => handleScheduleSelect(sch.id)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-black border-2 border-stone-900 dark:border-stone-700 transition-all text-center leading-tight ${
                    twoMealSchedule === sch.id
                      ? "bg-amber-300 dark:bg-amber-400 shadow-brutal-xs -translate-y-0.5 text-stone-900 dark:text-stone-950"
                      : "bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
                  }`}
                >
                  {sch.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nutrient Priorities Configuration */}
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Nutrient Priorities (Optional)
            </label>
            <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400">Multi-select</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
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
                className={`text-left p-2.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-200 dark:bg-amber-950/80 dark:border-amber-500/80 text-stone-900 dark:text-amber-100 shadow-brutal-xs -translate-y-0.5"
                    : "bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm">{item.icon}</span>
                  <div
                    className={`w-4 h-4 rounded-md border border-stone-900 dark:border-stone-600 flex items-center justify-center ${
                      isSelected ? "bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950" : "bg-white dark:bg-stone-800"
                    }`}
                  >
                    {isSelected && <Check size={10} weight="bold" />}
                  </div>
                </div>
                <div className="font-display font-black text-xs text-stone-900 dark:text-stone-100 leading-tight">
                  {item.label}
                </div>
                <div className="text-[10px] text-stone-600 dark:text-stone-300 font-medium leading-tight mt-0.5">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Unified Weight & Height Configuration */}
      <ProfileMetricsInputs
        heightUnit={heightUnit} onHeightUnitChange={setHeightUnit}
        heightCm={heightCm} onCmChange={handleCmChange}
        feet={feet} onFeetChange={handleFeetChange}
        inches={inches} onInchesChange={handleInchesChange}
        weightUnit={weightUnit} onWeightUnitChange={handleWeightUnitChange}
        weightInput={weightInput} onWeightChange={setWeightInput}
      />
    </div>
  );
};
