"use client";

import { MagicWand, Plus, Sparkle } from "@/components/icons";
import React, { useState } from "react";

interface EmptyKitchenStarterCardProps {
  onSeedStarterIngredients: () => Promise<void>;
  onOpenAddSupply: () => void;
}

export const EmptyKitchenStarterCard: React.FC<EmptyKitchenStarterCardProps> = ({
  onSeedStarterIngredients,
  onOpenAddSupply,
}) => {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate(15);
      }
      await onSeedStarterIngredients();
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="w-full bg-[#FEF9C3] rounded-3xl border-[2.5px] border-stone-900 shadow-brutal p-5 sm:p-7 mb-6 transition-all">
      <div className="flex flex-col gap-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full bg-amber-300 border-2 border-stone-900 text-stone-900 shadow-brutal-xs">
              <Sparkle size={13} weight="fill" className="text-amber-700" />
              <span>Empty Pantry Setup</span>
            </span>
            <span className="text-xs font-bold text-stone-600">
              Fresh Kitchen Account
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-stone-900">
            Welcome to your kitchen!
          </h2>

          <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed max-w-2xl">
            Your pantry currently has 0 ingredients. Kickstart your meal planner instantly by
            loading verified Nigerian staples, or start completely fresh by adding custom items.
          </p>

          <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] font-bold text-stone-700">
            <span className="bg-white/80 border border-stone-900/30 px-2.5 py-1 rounded-lg">
              🌾 Jollof &amp; White Rice
            </span>
            <span className="bg-white/80 border border-stone-900/30 px-2.5 py-1 rounded-lg">
              🫘 Honey Beans &amp; Garri
            </span>
            <span className="bg-white/80 border border-stone-900/30 px-2.5 py-1 rounded-lg">
              🍳 Eggs &amp; Plantains
            </span>
            <span className="bg-white/80 border border-stone-900/30 px-2.5 py-1 rounded-lg">
              🌶️ Stew Bases &amp; Seasonings
            </span>
          </div>
        </div>

        {/* Action buttons at the bottom */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t-2 border-stone-900/10">
          <button
            type="button"
            onClick={handleSeed}
            disabled={isSeeding}
            className="inline-flex items-center justify-center gap-2 text-sm font-black px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-stone-900 border-2 border-stone-900 shadow-brutal active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-75 disabled:cursor-wait"
          >
            <MagicWand size={18} weight="bold" className={isSeeding ? "animate-spin" : ""} />
            <span>{isSeeding ? "Stocking Pantry..." : "Load Starter Staples"}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddSupply}
            disabled={isSeeding}
            className="inline-flex items-center justify-center gap-2 text-sm font-bold px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-900 border-2 border-stone-900 shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            <Plus size={16} weight="bold" />
            <span>Add Custom Items</span>
          </button>
        </div>
      </div>
    </div>
  );
};
