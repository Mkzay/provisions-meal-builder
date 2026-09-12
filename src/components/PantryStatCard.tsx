"use client";

import {
  BowlFood,
  CookingPot,
  Package,
  Plus,
} from "@/components/icons";
import React from "react";

interface PantryStatCardProps {
  readyMealsCount: number;
  ingredientsCount: number;
  isCachedFallback?: boolean;
  onOpenAddSupply: () => void;
  onOpenSettings?: () => void;
  onOpenInventory?: () => void;
  className?: string;
}

/**
 * Mobile and iPad Pantry State & Stat Card.
 * Displays real-time kitchen readiness stats (ready meals + available ingredients)
 * with tactile neo-brutalist styling.
 */
export const PantryStatCard: React.FC<PantryStatCardProps> = ({
  readyMealsCount,
  ingredientsCount,
  isCachedFallback = false,
  onOpenAddSupply,
  onOpenSettings,
  onOpenInventory,
  className = "",
}) => {
  return (
    <div
      className={`w-full p-4 sm:p-5 rounded-3xl bg-white border-[2.5px] border-stone-900 shadow-brutal ${className}`}
    >
      {/* Header: Title & Notion Status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-200 border-2 border-stone-900 flex items-center justify-center shadow-brutal-xs shrink-0">
            <CookingPot size={17} weight="duotone" className="text-stone-900" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-stone-900">
              Your Pantry Reserves
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">
              Real-time kitchen inventory
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border border-stone-900 shadow-brutal-xs bg-emerald-100 text-stone-900 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{readyMealsCount + ingredientsCount} Ready</span>
        </div>
      </div>

      {/* Two Vibrant Stat Tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Tile 1: Ready Meals */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-200 border-2 border-stone-900 shadow-brutal-xs flex items-center justify-between">
          <div>
            <span className="text-2xl sm:text-3xl font-display font-black text-stone-900 leading-none">
              {readyMealsCount}
            </span>
            <p className="text-xs font-bold text-stone-800 mt-1">
              Ready Meals
            </p>
            <p className="text-[10px] text-stone-600 font-medium">
              0 min prep in fridge
            </p>
          </div>
          <CookingPot
            size={26}
            weight="duotone"
            className="text-stone-900/40 shrink-0 hidden xs:block sm:block"
          />
        </div>

        {/* Tile 2: Ingredients */}
        <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-200 border-2 border-stone-900 shadow-brutal-xs flex items-center justify-between">
          <div>
            <span className="text-2xl sm:text-3xl font-display font-black text-stone-900 leading-none">
              {ingredientsCount}
            </span>
            <p className="text-xs font-bold text-stone-800 mt-1">
              Fresh Items
            </p>
            <p className="text-[10px] text-stone-600 font-medium">
              Pantry & fridge supplies
            </p>
          </div>
          <BowlFood
            size={26}
            weight="duotone"
            className="text-stone-900/40 shrink-0 hidden xs:block sm:block"
          />
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-900/10 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddSupply}
            className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border-2 border-stone-900 shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <Plus size={14} weight="bold" />
            <span>Restock</span>
          </button>
          {onOpenInventory && (
            <button
              onClick={onOpenInventory}
              className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-200 hover:bg-emerald-300 text-stone-900 border-2 border-stone-900 shadow-brutal-xs active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              <Package size={14} weight="bold" />
              <span>Manage Stock</span>
            </button>
          )}
        </div>
        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-600 hover:text-stone-900 hover:underline"
          >
            <span>Notion Connection →</span>
          </button>
        )}
      </div>
    </div>
  );
};
