"use client";

import React from "react";

interface ProfileMetricsInputsProps {
  heightUnit: "cm" | "ft";
  onHeightUnitChange: (u: "cm" | "ft") => void;
  heightCm: string;
  onCmChange: (val: string) => void;
  feet: string;
  onFeetChange: (val: string) => void;
  inches: string;
  onInchesChange: (val: string) => void;
  weightUnit: "kg" | "lbs";
  onWeightUnitChange: (u: "kg" | "lbs") => void;
  weightInput: string;
  onWeightChange: (val: string) => void;
}

export const ProfileMetricsInputs: React.FC<ProfileMetricsInputsProps> = ({
  heightUnit,
  onHeightUnitChange,
  heightCm,
  onCmChange,
  feet,
  onFeetChange,
  inches,
  onInchesChange,
  weightUnit,
  onWeightUnitChange,
  weightInput,
  onWeightChange,
}) => {
  return (
    <div className="space-y-3">
      {/* 1. Weight Configuration (Primary & Unified) */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span>⚖️ Current Weight</span>
            <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 lowercase">(optional)</span>
          </label>
          {/* Segmented Pill Switcher */}
          <div className="inline-flex items-center p-0.5 bg-stone-200/90 dark:bg-stone-800 rounded-lg border border-stone-900 dark:border-stone-700">
            <button
              type="button"
              onClick={() => onWeightUnitChange("kg")}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all ${
                weightUnit === "kg"
                  ? "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950 border border-stone-900 shadow-xs"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              kg
            </button>
            <button
              type="button"
              onClick={() => onWeightUnitChange("lbs")}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all ${
                weightUnit === "lbs"
                  ? "bg-purple-300 dark:bg-purple-400 text-stone-900 dark:text-stone-950 border border-stone-900 shadow-xs"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              lbs
            </button>
          </div>
        </div>

        <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
          Saved in your profile and logs your progress history automatically.
        </p>

        <div className="relative flex items-center">
          <input
            type="number"
            step="any"
            inputMode="decimal"
            enterKeyHint="done"
            min={weightUnit === "kg" ? "20" : "44"}
            max={weightUnit === "kg" ? "350" : "770"}
            placeholder={weightUnit === "kg" ? "e.g. 75.5" : "e.g. 166.5"}
            value={weightInput}
            onChange={(e) => onWeightChange(e.target.value)}
            className="w-full bg-[#FAF8F5] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-xl px-3.5 py-2.5 pr-14 text-sm font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-stone-600 dark:text-stone-300 px-2 py-1 bg-stone-200/80 dark:bg-stone-700 border border-stone-900 dark:border-stone-600 rounded-lg uppercase">
            {weightUnit}
          </span>
        </div>
      </div>

      {/* 2. Height Configuration */}
      <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <span>📏 Height</span>
            <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 lowercase">(optional)</span>
          </label>
          {/* Segmented Pill Switcher */}
          <div className="inline-flex items-center p-0.5 bg-stone-200/90 dark:bg-stone-800 rounded-lg border border-stone-900 dark:border-stone-700">
            <button
              type="button"
              onClick={() => onHeightUnitChange("cm")}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all ${
                heightUnit === "cm"
                  ? "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950 border border-stone-900 shadow-xs"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              cm
            </button>
            <button
              type="button"
              onClick={() => onHeightUnitChange("ft")}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-black transition-all ${
                heightUnit === "ft"
                  ? "bg-purple-300 dark:bg-purple-400 text-stone-900 dark:text-stone-950 border border-stone-900 shadow-xs"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              ft / in
            </button>
          </div>
        </div>

        <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
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
              onChange={(e) => onCmChange(e.target.value)}
              placeholder="e.g. 178"
              className="w-full bg-[#FAF8F5] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-xl px-3.5 py-2.5 pr-14 text-sm font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-stone-600 dark:text-stone-300 px-2 py-1 bg-stone-200/80 dark:bg-stone-700 border border-stone-900 dark:border-stone-600 rounded-lg">
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
                  onChange={(e) => onFeetChange(e.target.value)}
                  placeholder="5"
                  className="w-full bg-[#FAF8F5] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-xl px-3.5 py-2.5 pr-12 text-sm font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-stone-600 dark:text-stone-300 px-2 py-1 bg-stone-200/80 dark:bg-stone-700 border border-stone-900 dark:border-stone-600 rounded-lg">
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
                  onChange={(e) => onInchesChange(e.target.value)}
                  placeholder="10"
                  className="w-full bg-[#FAF8F5] dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-xl px-3.5 py-2.5 pr-12 text-sm font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-stone-600 dark:text-stone-300 px-2 py-1 bg-stone-200/80 dark:bg-stone-700 border border-stone-900 dark:border-stone-600 rounded-lg">
                  in
                </span>
              </div>
            </div>
            {heightCm && (
              <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 pl-1">
                Equivalent to ~{heightCm} cm
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
