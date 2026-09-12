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
import { getComboNutrientTags } from "@/lib/nutrient-curation";
import {
  getCleanUpFootprint,
  getPrepTimeEstimate,
  getSuggestedComboName,
} from "@/lib/pairings";
import { Ingredient, MealType, NutrientTag, PairingResult } from "@/lib/types";
import React, { useState } from "react";

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
  const [selectedProtein, setSelectedProtein] = useState<Ingredient | undefined>(
    pairingResult.recommendedProtein
  );
  const [selectedSupplementaries, setSelectedSupplementaries] = useState<Ingredient[]>(() =>
    pairingResult.recommendedSupplementary ? [pairingResult.recommendedSupplementary] : []
  );

  const previewName = getSuggestedComboName(
    selectedMain.name,
    selectedProtein?.name,
    selectedSupplementaries.map((s) => s.name)
  );

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
          let badge = "bg-stone-100 text-stone-700 border-stone-300";
          let icon = "•";
          if (tag === "High Fiber") {
            badge = "bg-emerald-100 text-emerald-900 border-emerald-300";
            icon = "🌾";
          } else if (tag === "High Protein") {
            badge = "bg-amber-100 text-amber-900 border-amber-300";
            icon = "🍗";
          } else if (tag === "High Fat") {
            badge = "bg-rose-100 text-rose-900 border-rose-300";
            icon = "🥑";
          } else if (tag === "High Carb") {
            badge = "bg-sky-100 text-sky-900 border-sky-300";
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
    <div className="w-full space-y-6">
      {/* Anchor Base Overview Header */}
      <div className="flex items-center justify-between p-5 sm:p-6 bg-[#FEF08A] rounded-3xl border-2 border-stone-900 shadow-brutal">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-white border-2 border-stone-900 text-stone-900 flex items-center justify-center shadow-brutal-sm shrink-0">
            <Grains size={28} weight="duotone" className="text-amber-800" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 bg-white/80 px-2 py-0.5 rounded-md border border-stone-900/40 inline-block mb-1">
              Anchor Base
            </span>
            <h4 className="text-xl sm:text-2xl font-display font-black text-stone-900 leading-tight">
              {selectedMain.name}
            </h4>
            {renderMicroTags(selectedMain.nutrientTags)}
          </div>
        </div>

        <button
          onClick={onChangeMain}
          className="text-xs font-black text-stone-900 py-2 px-3.5 rounded-xl bg-white border-2 border-stone-900 shadow-brutal-sm hover:bg-stone-100 transition-all active:translate-x-[1px] active:translate-y-[1px] shrink-0"
        >
          Change Base
        </button>
      </div>

      {/* Protein Source Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-200 border-2 border-stone-900 text-stone-900 flex items-center justify-center shadow-brutal-sm">
              <Egg size={18} weight="duotone" />
            </div>
            <div>
              <h4 className="font-display font-black text-base text-stone-900 leading-none">
                Protein Source
              </h4>
              <p className="text-[11px] text-stone-600 font-medium mt-0.5">
                Satiety &amp; strength • 1-tap selection
              </p>
            </div>
          </div>
        </div>

        {pairingResult.availableProteins.length === 0 ? (
          <p className="text-xs text-stone-600 italic px-1 font-medium">
            No proteins currently available in your kitchen for {mealType}.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {pairingResult.availableProteins.map((protein) => {
              const isSelected = selectedProtein?.id === protein.id;
              const isRecommended = pairingResult.recommendedProtein?.id === protein.id;

              return (
                <button
                  key={protein.id}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.navigator?.vibrate) {
                      window.navigator.vibrate(8);
                    }
                    setSelectedProtein(isSelected ? undefined : protein);
                  }}
                  className={`flex flex-col items-start gap-1 py-2 px-3.5 rounded-2xl border-2 border-stone-900 transition-all text-left ${
                    isSelected
                      ? "bg-amber-300 text-stone-900 shadow-brutal-sm -translate-y-0.5"
                      : "bg-white hover:bg-stone-50 text-stone-900 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-sm font-black">
                    {isRecommended && !isSelected && (
                      <Sparkle size={15} weight="fill" className="text-amber-500" />
                    )}
                    {isSelected && <Check size={15} weight="bold" />}
                    <span>{protein.name}</span>
                  </div>
                  {renderMicroTags(protein.nutrientTags)}
                </button>
              );
            })}

            <button
              onClick={() => setSelectedProtein(undefined)}
              className="py-2.5 px-3.5 rounded-2xl text-xs font-black border-2 border-stone-900 transition-all bg-stone-100 hover:bg-stone-200 text-stone-900 shadow-brutal-sm hover:shadow-none active:translate-x-0.5 active:translate-y-0.5 self-center"
            >
              None (Base only)
            </button>
          </div>
        )}
      </div>

      {/* Greens, Accents & Nourishing Sides Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-200 border-2 border-stone-900 text-stone-900 flex items-center justify-center shadow-brutal-sm">
              <ForkKnife size={18} weight="duotone" />
            </div>
            <div>
              <h4 className="font-display font-black text-base text-stone-900 leading-none">
                Greens, Accents &amp; Nourishing Sides
              </h4>
              <p className="text-[11px] text-stone-600 font-medium mt-0.5">
                Fiber, clean fats &amp; flavor • Multi-select
              </p>
            </div>
          </div>
          {selectedSupplementaries.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 border border-stone-900 shadow-xs">
                {selectedSupplementaries.length} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedSupplementaries([])}
                className="text-[11px] font-black text-stone-600 hover:text-stone-900 underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {pairingResult.availableSupplementary.length === 0 ? (
          <p className="text-xs text-stone-600 italic px-1 font-medium">
            No greens or sides currently available for {mealType}.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
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
                  className={`flex flex-col items-start gap-1 py-2 px-3.5 rounded-2xl border-2 border-stone-900 transition-all text-left ${
                    isSelected
                      ? "bg-purple-300 text-stone-900 shadow-brutal-sm -translate-y-0.5"
                      : "bg-white hover:bg-stone-50 text-stone-900 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-sm font-black">
                    {isSelected && <Check size={15} weight="bold" />}
                    <span>{side.name}</span>
                  </div>
                  {renderMicroTags(side.nutrientTags)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Smart Missing Upgrade Suggestions Card */}
      <MissingUpgradesCard
        upgrades={pairingResult.missingUpgrades || []}
        onQuickRestockUpgrade={onQuickRestockUpgrade}
      />

      {/* Plate Summary & Action Bar */}
      <div className="pt-5 border-t-2 border-stone-900/20 space-y-4">
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#D1FAE5] border-2 border-stone-900 shadow-brutal-sm space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-stone-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-stone-900/30 inline-block">
              Current Plate
            </span>
            <span className="text-xs font-bold text-emerald-900">
              Balanced &amp; Ready
            </span>
          </div>
          <div className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
            {previewName}
          </div>
          {comboTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {comboTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-lg bg-white/90 text-stone-800 text-[10px] font-extrabold border border-stone-900/40 shadow-2xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg bg-white/80 border border-stone-900/40 text-stone-800 shadow-xs">
              {getPrepTimeEstimate(selectedMain, selectedProtein, selectedSupplementaries)}
            </span>
            <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg bg-white/80 border border-stone-900/40 text-stone-800 shadow-xs">
              {getCleanUpFootprint(selectedMain, selectedProtein, selectedSupplementaries)}
            </span>
          </div>
        </div>

        {(selectedProtein || selectedSupplementaries.length > 0) && (
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.navigator?.vibrate) {
                window.navigator.vibrate(8);
              }
              setSelectedProtein(undefined);
              setSelectedSupplementaries([]);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 font-bold text-xs border border-stone-900/40 transition-all text-center"
          >
            Just the base is plenty today (Skip pairings)
          </button>
        )}

        <button
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-stone-900 font-black text-base border-2 border-stone-900 shadow-brutal hover:shadow-brutal-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2.5"
        >
          <span>Looks Delicious · Confirm Plate</span>
          <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
};
