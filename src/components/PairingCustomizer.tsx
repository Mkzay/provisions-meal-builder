"use client";

import {
  ArrowRight,
  Check,
  Egg,
  ForkKnife,
  Grains,
  Sparkle,
} from "@/components/icons";
import { MissingUpgradesCard } from "@/components/MissingUpgradesCard";
import { findMatchingDishBlueprint } from "@/lib/dish-blueprints";
import { getComboNutrientTags } from "@/lib/nutrient-curation";
import {
  getCleanUpFootprint,
  getPrepTimeEstimate,
  getSuggestedComboName,
} from "@/lib/pairings";
import { Ingredient, MealType, NutrientTag, PairingResult } from "@/lib/types";
import React, { useEffect, useState } from "react";

interface PairingCustomizerProps {
  selectedMain: Ingredient;
  mealType: MealType;
  pairingResult: PairingResult;
  onChangeMain: () => void;
  onConfirmCombo: (main: Ingredient, protein?: Ingredient, supplementary?: Ingredient | Ingredient[]) => void;
  onQuickRestockUpgrade?: (name: string, role: "Main" | "Protein" | "Supplementary") => void;
}

export const PairingCustomizer: React.FC<PairingCustomizerProps> = ({
  selectedMain,
  mealType,
  pairingResult,
  onChangeMain,
  onConfirmCombo,
  onQuickRestockUpgrade,
}) => {
  const [selectedProtein, setSelectedProtein] = useState<Ingredient | undefined>(pairingResult.recommendedProtein);
  const [selectedSupplementaries, setSelectedSupplementaries] = useState<Ingredient[]>(() =>
    pairingResult.recommendedSupplementaries && pairingResult.recommendedSupplementaries.length > 0
      ? pairingResult.recommendedSupplementaries
      : pairingResult.recommendedSupplementary ? [pairingResult.recommendedSupplementary] : []
  );
  const [isChangingProtein, setIsChangingProtein] = useState(false);
  const [isChangingSides, setIsChangingSides] = useState(false);
  const [aiSanitized, setAiSanitized] = useState<{ dishName?: string; culinaryNote?: string } | null>(null);

  // Dynamic blueprint resolution based on current selections
  const inStockContext = [selectedMain, ...(selectedProtein ? [selectedProtein] : []), ...selectedSupplementaries];
  const activeBlueprint = findMatchingDishBlueprint(selectedMain, inStockContext, mealType);
  const curatedTitle = activeBlueprint
    ? activeBlueprint.generateTitle(selectedMain, selectedProtein, selectedSupplementaries)
    : getSuggestedComboName(selectedMain.name, selectedProtein?.name, selectedSupplementaries.map((s) => s.name));
  const curatedNote = activeBlueprint?.culinaryNote || pairingResult.culinaryNote;

  // Background AI inspection with silent fallback
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setAiSanitized(null);

    fetch("/api/curate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        main: selectedMain.name,
        protein: selectedProtein?.name,
        supplementary: selectedSupplementaries.map((s) => s.name),
        mealType,
        dishName: curatedTitle,
        culinaryNote: curatedNote,
      }),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.success && data.dishName && data.culinaryNote) {
          setAiSanitized({ dishName: data.dishName, culinaryNote: data.culinaryNote });
          if (Array.isArray(data.validSides)) {
            const allowedSides = new Set(data.validSides.map((side: string) => side.trim().toLowerCase()));
            setSelectedSupplementaries((current) => current.filter((side) => allowedSides.has(side.name.trim().toLowerCase())));
          }
        }
      })
      .catch(() => {});

    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedMain.id, selectedProtein?.id, selectedSupplementaries.map((side) => side.id).join(","), mealType, curatedTitle, curatedNote]);

  const displayTitle = aiSanitized?.dishName || curatedTitle;
  const displayNote = aiSanitized?.culinaryNote || curatedNote;

  const comboTags = getComboNutrientTags(
    selectedMain,
    selectedProtein,
    selectedSupplementaries
  );

  const handleConfirm = () => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(15);
    }
    onConfirmCombo(selectedMain, selectedProtein, selectedSupplementaries);
  };

  const renderMicroTags = (tags?: NutrientTag[]) => {
    if (!tags || tags.length === 0) return null;
    return (
      <div className="flex items-center gap-1 flex-wrap mt-0.5">
        {tags.map((tag) => {
          let badge = "bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700";
          let icon = "•";
          if (tag === "High Fiber") {
            badge = "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
            icon = "🌾";
          } else if (tag === "High Protein") {
            badge = "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
            icon = "🍗";
          } else if (tag === "High Fat") {
            badge = "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800";
            icon = "🥑";
          } else if (tag === "High Carb") {
            badge = "bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800";
            icon = "⚡";
          }
          return (
            <span
              key={tag}
              className={`text-[9px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded border ${badge}`}
            >
              {icon} {tag.replace("High ", "")}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full space-y-5">
      {/* Top Card: Curated Meal Presentation */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-amber-100 via-amber-50 to-white dark:from-[#2D1B03] dark:via-stone-900 dark:to-stone-900 rounded-3xl border-2 border-stone-900 dark:border-amber-500/50 shadow-brutal dark:shadow-brutal-dark space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-stone-900 dark:text-amber-200 bg-amber-300 dark:bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-stone-900 dark:border-amber-500/40 shadow-2xs">
            Curated Meal
          </span>
          <span className="text-xs font-bold text-stone-600 dark:text-stone-400">
            {mealType} Plate
          </span>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-display font-black text-stone-900 dark:text-stone-100 leading-tight">
            {displayTitle}
          </h3>
          {displayNote && (
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-medium mt-1 leading-relaxed">
              {displayNote}
            </p>
          )}
        </div>

        {comboTags.length > 0 && (
          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            {comboTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-[10px] font-extrabold border border-stone-900/40 dark:border-stone-700 shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tier 1: Anchor Base Card */}
      <div className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border-2 border-stone-900 dark:border-amber-500/40 text-stone-900 dark:text-amber-200 flex items-center justify-center shadow-brutal-xs shrink-0">
            <Grains size={26} weight="duotone" className="text-amber-800 dark:text-amber-300" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Anchor Base
            </span>
            <h4 className="text-base sm:text-lg font-display font-black text-stone-900 dark:text-stone-100 truncate">
              {selectedMain.name}
            </h4>
            {renderMicroTags(selectedMain.nutrientTags)}
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeMain}
          className="text-xs font-black text-stone-900 dark:text-stone-100 py-2 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-xs active:translate-x-[1px] active:translate-y-[1px] shrink-0 transition-all"
        >
          Change
        </button>
      </div>

      {/* Tier 2: Protein Source Card */}
      <div className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-stone-900 dark:border-emerald-500/40 text-stone-900 dark:text-emerald-200 flex items-center justify-center shadow-brutal-xs shrink-0">
              <Egg size={24} weight="duotone" className="text-emerald-800 dark:text-emerald-300" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                Protein Source
              </span>
              <h4 className="text-base sm:text-lg font-display font-black text-stone-900 dark:text-stone-100 truncate">
                {selectedProtein ? selectedProtein.name : "None / Plain Base"}
              </h4>
              {selectedProtein && renderMicroTags(selectedProtein.nutrientTags)}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsChangingProtein((prev) => !prev)}
            className={`text-xs font-black py-2 px-3.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-xs active:translate-x-[1px] active:translate-y-[1px] shrink-0 transition-all ${
              isChangingProtein
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                : "bg-emerald-200 hover:bg-emerald-300 text-stone-900 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-300 dark:border-emerald-500/50"
            }`}
          >
            {isChangingProtein ? "Done" : "Change"}
          </button>
        </div>

        {/* Collapsible Protein Swap Selection */}
        {isChangingProtein && (
          <div className="pt-3 border-t-2 border-stone-900/10 dark:border-stone-800 space-y-2.5">
            <p className="text-xs text-stone-600 dark:text-stone-400 font-bold">
              Select in-stock protein to swap:
            </p>
            <div className="flex flex-wrap gap-2">
              {pairingResult.availableProteins.map((protein) => {
                const isSelected = selectedProtein?.id === protein.id;
                return (
                  <button
                    key={protein.id}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.navigator?.vibrate) {
                        window.navigator.vibrate(8);
                      }
                      setSelectedProtein(protein);
                      setIsChangingProtein(false);
                    }}
                    className={`py-2 px-3 rounded-xl border-2 border-stone-900 dark:border-stone-700 text-xs font-black transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-amber-300 text-stone-900 dark:bg-amber-400 dark:text-stone-950 shadow-brutal-xs"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200"
                    }`}
                  >
                    {isSelected && <Check size={14} weight="bold" />}
                    <span>{protein.name}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setSelectedProtein(undefined);
                  setIsChangingProtein(false);
                }}
                className={`py-2 px-3 rounded-xl border-2 border-stone-900 dark:border-stone-700 text-xs font-black transition-all ${
                  !selectedProtein
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-400"
                }`}
              >
                None (Skip)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tier 3: Greens, Accents & Sides Card */}
      <div className="p-4 sm:p-5 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 border-2 border-stone-900 dark:border-purple-500/40 text-stone-900 dark:text-purple-200 flex items-center justify-center shadow-brutal-xs shrink-0">
              <ForkKnife size={24} weight="duotone" className="text-purple-800 dark:text-purple-300" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
                Greens, Accents &amp; Sides
              </span>
              <h4 className="text-base sm:text-lg font-display font-black text-stone-900 dark:text-stone-100 truncate">
                {selectedSupplementaries.length > 0
                  ? selectedSupplementaries.map((s) => s.name).join(", ")
                  : "None selected"}
              </h4>
              {selectedSupplementaries.length > 0 && (
                <span className="text-[10px] font-black text-purple-900 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-800 inline-block mt-0.5">
                  {selectedSupplementaries.length} selected
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsChangingSides((prev) => !prev)}
            className={`text-xs font-black py-2 px-3.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-xs active:translate-x-[1px] active:translate-y-[1px] shrink-0 transition-all ${
              isChangingSides
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                : "bg-purple-200 hover:bg-purple-300 text-stone-900 dark:bg-purple-500/20 dark:hover:bg-purple-500/30 dark:text-purple-300 dark:border-purple-500/50"
            }`}
          >
            {isChangingSides ? "Done" : selectedSupplementaries.length > 0 ? "Change" : "Add"}
          </button>
        </div>

        {/* Collapsible Sides Selection */}
        {isChangingSides && (
          <div className="pt-3 border-t-2 border-stone-900/10 dark:border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-600 dark:text-stone-400 font-bold">
                Toggle in-stock sides &amp; accents:
              </p>
              {selectedSupplementaries.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedSupplementaries([])}
                  className="text-xs font-black text-rose-700 dark:text-rose-400 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {pairingResult.availableSupplementary.map((side) => {
                const isSelected = selectedSupplementaries.some((s) => s.id === side.id);
                return (
                  <button
                    key={side.id}
                    onClick={() => {
                      if (typeof window !== "undefined" && window.navigator?.vibrate) {
                        window.navigator.vibrate(8);
                      }
                      setSelectedSupplementaries((prev) =>
                        prev.some((s) => s.id === side.id)
                          ? prev.filter((s) => s.id !== side.id)
                          : [...prev, side]
                      );
                    }}
                    className={`py-2 px-3 rounded-xl border-2 border-stone-900 dark:border-stone-700 text-xs font-black transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-purple-300 text-stone-900 dark:bg-purple-400 dark:text-stone-950 shadow-brutal-xs"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-200"
                    }`}
                  >
                    {isSelected && <Check size={14} weight="bold" />}
                    <span>{side.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Smart Missing Upgrade Suggestions Card */}
      <MissingUpgradesCard
        upgrades={pairingResult.missingUpgrades || []}
        onQuickRestockUpgrade={onQuickRestockUpgrade}
      />

      {/* Action Footer */}
      <div className="pt-4 border-t-2 border-stone-900/20 dark:border-stone-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-400 px-1">
          <span>⏱️ {getPrepTimeEstimate(selectedMain, selectedProtein, selectedSupplementaries)}</span>
          <span>🧼 {getCleanUpFootprint(selectedMain, selectedProtein, selectedSupplementaries)}</span>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-stone-900 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-stone-950 font-black text-base border-2 border-stone-900 dark:border-emerald-600/60 shadow-brutal dark:shadow-brutal-dark hover:shadow-brutal-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2.5"
        >
          <span>Looks Delicious · Confirm Plate</span>
          <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
};
