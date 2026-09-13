"use client";

import {
  BookmarkSimple,
  CookingPot,
  Package,
  User,
} from "@/components/icons";
import React from "react";

export type NavTabId = "builder" | "recipes" | "pantry" | "hub";

interface BottomNavBarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  savedRecipesCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  savedRecipesCount = 0,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#141210]/95 backdrop-blur-md border-t-2 border-stone-900 dark:border-stone-800 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Builder Tab */}
        <button
          type="button"
          onClick={() => onSelectTab("builder")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-transform active:scale-95 ${
            activeTab === "builder"
              ? "bg-amber-300 dark:bg-amber-400 border-2 border-stone-900 shadow-brutal-xs text-stone-900 dark:text-stone-950 font-black"
              : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-bold"
          }`}
        >
          <CookingPot size={22} weight={activeTab === "builder" ? "fill" : "bold"} />
          <span className="text-[10px] tracking-tight mt-0.5">Kitchen</span>
        </button>

        {/* Saved Recipes Tab */}
        <button
          type="button"
          onClick={() => onSelectTab("recipes")}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-transform active:scale-95 ${
            activeTab === "recipes"
              ? "bg-orange-200 dark:bg-orange-400 border-2 border-stone-900 shadow-brutal-xs text-stone-900 dark:text-stone-950 font-black"
              : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-bold"
          }`}
        >
          <BookmarkSimple size={22} weight={activeTab === "recipes" ? "fill" : "bold"} />
          <span className="text-[10px] tracking-tight mt-0.5">Recipes</span>
          {savedRecipesCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 border border-stone-900 text-white text-[9px] font-black flex items-center justify-center">
              {savedRecipesCount}
            </span>
          )}
        </button>

        {/* Pantry / Inventory Tab */}
        <button
          type="button"
          onClick={() => onSelectTab("pantry")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-transform active:scale-95 ${
            activeTab === "pantry"
              ? "bg-emerald-200 dark:bg-emerald-400 border-2 border-stone-900 shadow-brutal-xs text-stone-900 dark:text-stone-950 font-black"
              : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-bold"
          }`}
        >
          <Package size={22} weight={activeTab === "pantry" ? "fill" : "bold"} />
          <span className="text-[10px] tracking-tight mt-0.5">Pantry</span>
        </button>

        {/* Hub / Profile Tab */}
        <button
          type="button"
          onClick={() => onSelectTab("hub")}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-transform active:scale-95 ${
            activeTab === "hub"
              ? "bg-sky-200 dark:bg-sky-400 border-2 border-stone-900 shadow-brutal-xs text-stone-900 dark:text-stone-950 font-black"
              : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-bold"
          }`}
        >
          <User size={22} weight={activeTab === "hub" ? "fill" : "bold"} />
          <span className="text-[10px] tracking-tight mt-0.5">Hub</span>
        </button>
      </div>
    </nav>
  );
};
