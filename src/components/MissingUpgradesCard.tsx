"use client";

import { Check, Plus, Sparkle } from "@/components/icons";
import { MissingUpgradeSuggestion } from "@/lib/types";
import React, { useState } from "react";

interface MissingUpgradesCardProps {
  upgrades: MissingUpgradeSuggestion[];
  onQuickRestockUpgrade?: (name: string, role: "Main" | "Protein" | "Supplementary") => void;
}

export const MissingUpgradesCard: React.FC<MissingUpgradesCardProps> = ({
  upgrades,
  onQuickRestockUpgrade,
}) => {
  const [restockedIds, setRestockedIds] = useState<string[]>([]);

  if (!upgrades || upgrades.length === 0) return null;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-2 px-1">
        <div className="w-8 h-8 rounded-xl bg-amber-300 dark:bg-amber-950/60 border-2 border-stone-900 dark:border-amber-500/40 text-stone-900 dark:text-amber-300 flex items-center justify-center shadow-brutal-sm dark:shadow-brutal-dark-sm">
          <Sparkle size={18} weight="fill" className="text-amber-800 dark:text-amber-300" />
        </div>
        <div>
          <h4 className="font-display font-black text-base text-stone-900 dark:text-stone-100 leading-tight">
            Upgrade Ideas for Next Time
          </h4>
          <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">
            Not currently in your kitchen, but would give this meal optimal balance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {upgrades.map((upgrade) => {
          const isRestocked = restockedIds.includes(upgrade.id);
          return (
            <div
              key={upgrade.id}
              className="p-4 rounded-3xl bg-[#FEF9C3] dark:bg-stone-900 border-2 border-stone-900 dark:border-amber-500/30 shadow-brutal-sm dark:shadow-brutal-dark-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-black text-sm text-stone-900 dark:text-stone-100">
                    {upgrade.name}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 border border-stone-900 dark:border-stone-700 text-stone-800 dark:text-stone-200 shadow-xs">
                    {upgrade.role === "Protein" ? "Protein Boost" : "Fiber & Greens"}
                  </span>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
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
                  className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-black text-xs border-2 border-stone-900 dark:border-stone-700 transition-all ${
                    isRestocked
                      ? "bg-emerald-300 text-stone-900 dark:bg-emerald-500 dark:text-stone-950 cursor-default"
                      : "bg-white hover:bg-stone-50 text-stone-900 dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-100 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none"
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
  );
};
