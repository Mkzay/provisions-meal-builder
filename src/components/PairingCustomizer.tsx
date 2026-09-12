"use client";

import {
  getCleanUpFootprint,
  getPrepTimeEstimate,
  getSuggestedComboName,
} from "@/lib/pairings";
import { Ingredient, MealType, PairingResult } from "@/lib/types";
import {
  ArrowRight,
  Check,
  Egg,
  Fish,
  ForkKnife,
  Grains,
  Plus,
  Sparkle,
} from "@/components/icons";
import React, { useState } from "react";

interface PairingCustomizerProps {
  selectedMain: Ingredient;
  mealType: MealType;
  pairingResult: PairingResult;
  onChangeMain: () => void;
  onConfirmCombo: (main: Ingredient, protein?: Ingredient, supplementary?: Ingredient) => void;
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
  const [selectedSupplementary, setSelectedSupplementary] = useState<Ingredient | undefined>(
    pairingResult.recommendedSupplementary
  );

  const [restockedIds, setRestockedIds] = useState<string[]>([]);

  const previewName = getSuggestedComboName(
    selectedMain.name,
    selectedProtein?.name,
    selectedSupplementary?.name
  );

  const handleConfirm = () => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(15);
    }
    onConfirmCombo(selectedMain, selectedProtein, selectedSupplementary);
  };

  return (
    <div className="w-full space-y-6">
      {/* Anchor Main Overview Header */}
      <div className="flex items-center justify-between p-5 sm:p-6 bg-[#FEF08A] rounded-3xl border-2 border-stone-900 shadow-brutal">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-white border-2 border-stone-900 text-stone-900 flex items-center justify-center shadow-brutal-sm">
            <Grains size={28} weight="duotone" className="text-amber-800" />
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 bg-white/80 px-2 py-0.5 rounded-md border border-stone-900/40 inline-block mb-1">
              Anchor Main
            </span>
            <h4 className="text-xl sm:text-2xl font-display font-black text-stone-900">
              {selectedMain.name}
            </h4>
          </div>
        </div>

        <button
          onClick={onChangeMain}
          className="text-xs font-black text-stone-900 py-2 px-3.5 rounded-xl bg-white border-2 border-stone-900 shadow-brutal-sm hover:bg-stone-100 transition-all active:translate-x-[1px] active:translate-y-[1px]"
        >
          Change Main
        </button>
      </div>

      {/* Protein Pairing Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-200 border-2 border-stone-900 text-stone-900 flex items-center justify-center shadow-brutal-sm">
              <Egg size={18} weight="duotone" />
            </div>
            <h4 className="font-display font-black text-base text-stone-900">
              Pair with Protein
            </h4>
          </div>
          <span className="text-xs font-bold text-stone-600">1-tap swap</span>
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
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-2xl text-sm font-black border-2 border-stone-900 transition-all ${
                    isSelected
                      ? "bg-amber-300 text-stone-900 shadow-brutal-sm -translate-y-0.5"
                      : "bg-white hover:bg-stone-50 text-stone-900 shadow-xs"
                  }`}
                >
                  {isRecommended && !isSelected && (
                    <Sparkle size={16} weight="fill" className="text-amber-500" />
                  )}
                  {isSelected && <Check size={16} weight="bold" />}
                  <span>{protein.name}</span>
                </button>
              );
            })}

            {/* Option to deselect protein */}
            <button
              onClick={() => setSelectedProtein(undefined)}
              className="py-2.5 px-3.5 rounded-2xl text-xs font-black border-2 border-stone-900 transition-all bg-stone-100 hover:bg-stone-200 text-stone-900 shadow-brutal-sm hover:shadow-none active:translate-x-0.5 active:translate-y-0.5"
            >
              None (Main only)
            </button>
          </div>
        )}
      </div>

      {/* Supplementary / Sides Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-200 border-2 border-stone-900 text-stone-900 flex items-center justify-center shadow-brutal-sm">
              <ForkKnife size={18} weight="duotone" />
            </div>
            <h4 className="font-display font-black text-base text-stone-900">
              Add a Side or Sauce (Optional)
            </h4>
          </div>
        </div>

        {pairingResult.availableSupplementary.length === 0 ? (
          <p className="text-xs text-stone-600 italic px-1 font-medium">
            No supplementary sides available for {mealType}.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {pairingResult.availableSupplementary.map((side) => {
              const isSelected = selectedSupplementary?.id === side.id;

              return (
                <button
                  key={side.id}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.navigator?.vibrate) {
                      window.navigator.vibrate(8);
                    }
                    setSelectedSupplementary(isSelected ? undefined : side);
                  }}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-2xl text-sm font-black border-2 border-stone-900 transition-all ${
                    isSelected
                      ? "bg-purple-300 text-stone-900 shadow-brutal-sm -translate-y-0.5"
                      : "bg-white hover:bg-stone-50 text-stone-900 shadow-xs"
                  }`}
                >
                  {isSelected && <Check size={16} weight="bold" />}
                  <span>{side.name}</span>
                </button>
              );
            })}

            {selectedSupplementary && (
              <button
                onClick={() => setSelectedSupplementary(undefined)}
                className="text-xs font-black text-stone-700 hover:text-stone-900 py-2 px-3 underline underline-offset-2"
              >
                Clear side
              </button>
            )}
          </div>
        )}
      </div>

      {/* Optional Smart Missing Upgrade Suggestions */}
      {pairingResult.missingUpgrades && pairingResult.missingUpgrades.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 rounded-xl bg-amber-300 border-2 border-stone-900 text-stone-900 flex items-center justify-center shadow-brutal-sm">
              <Sparkle size={18} weight="fill" className="text-amber-800" />
            </div>
            <div>
              <h4 className="font-display font-black text-base text-stone-900 leading-tight">
                Upgrade Ideas for Next Time
              </h4>
              <p className="text-[11px] text-stone-600 font-medium">
                Not currently in your kitchen, but would make this meal more balanced.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {pairingResult.missingUpgrades.map((upgrade) => {
              const isRestocked = restockedIds.includes(upgrade.id);
              return (
                <div
                  key={upgrade.id}
                  className="p-4 rounded-3xl bg-[#FEF9C3] border-2 border-stone-900 shadow-brutal-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-black text-sm text-stone-900">
                        {upgrade.name}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-stone-900 text-stone-800 shadow-xs">
                        {upgrade.role === "Protein" ? "Protein Boost" : "Fiber & Texture"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 font-medium leading-relaxed">
                      {upgrade.reason}
                    </p>
                  </div>

                  {onQuickRestockUpgrade && (
                    <button
                      type="button"
                      disabled={isRestocked}
                      onClick={() => {
                        if (typeof window !== "undefined" && window.navigator?.vibrate) {
                          window.navigator.vibrate(12);
                        }
                        onQuickRestockUpgrade(upgrade.name, upgrade.role);
                        setRestockedIds((prev) => [...prev, upgrade.id]);
                      }}
                      className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-black text-xs border-2 border-stone-900 transition-all ${
                        isRestocked
                          ? "bg-emerald-300 text-stone-900 cursor-default"
                          : "bg-white hover:bg-stone-50 text-stone-900 shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
                      }`}
                    >
                      {isRestocked ? (
                        <>
                          <Check size={14} weight="bold" />
                          <span>Restocked!</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} weight="bold" />
                          <span>Restock to Kitchen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Plate Summary & Action Bar */}
      <div className="pt-5 border-t-2 border-stone-900/20 space-y-4">
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#D1FAE5] border-2 border-stone-900 shadow-brutal-sm space-y-2">
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
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg bg-white/80 border border-stone-900/40 text-stone-800 shadow-xs">
              {getPrepTimeEstimate(selectedMain, selectedProtein, selectedSupplementary)}
            </span>
            <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg bg-white/80 border border-stone-900/40 text-stone-800 shadow-xs">
              {getCleanUpFootprint(selectedMain, selectedProtein, selectedSupplementary)}
            </span>
          </div>
        </div>

        {(selectedProtein || selectedSupplementary) && (
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.navigator?.vibrate) {
                window.navigator.vibrate(8);
              }
              setSelectedProtein(undefined);
              setSelectedSupplementary(undefined);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 font-bold text-xs border border-stone-900/40 transition-all text-center"
          >
            Just the main is plenty today (Skip pairings)
          </button>
        )}

        <button
          onClick={handleConfirm}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-stone-900 font-black text-base border-2 border-stone-900 shadow-brutal hover:shadow-brutal-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2.5"
        >
          <span>Looks Delicious · Confirm</span>
          <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
};
