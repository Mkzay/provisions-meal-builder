"use client";

import { Bell, User } from "@/components/icons";
import { MealType } from "@/lib/types";
import React from "react";

interface MobileHeaderProps {
  owner: string;
  mealType: MealType;
  onOpenNotification: () => void;
  onOpenProfile: () => void;
  onOpenWalkthrough?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  owner,
  mealType,
  onOpenNotification,
  onOpenProfile,
  onOpenWalkthrough,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMealEmoji = (type: MealType) => {
    switch (type) {
      case "Breakfast":
        return "🍳";
      case "Lunch":
        return "🍲";
      case "Dinner":
        return "🍛";
      case "Snack":
        return "🥪";
      default:
        return "🍽️";
    }
  };

  return (
    <header className="sm:hidden sticky top-0 z-30 bg-stone-50/95 backdrop-blur-md border-b-2 border-stone-900 px-4 sm:px-6 pt-[max(0.875rem,env(safe-area-inset-top,14px))] pb-3.5 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      {/* Left: Greeting & Meal Badge */}
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider leading-none">
          {getGreeting()}, {owner}
        </span>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-sm leading-none">{getMealEmoji(mealType)}</span>
          <span className="text-xs font-black text-stone-900 bg-amber-200 border border-stone-900 px-2 py-0.5 rounded-md shadow-brutal-xs leading-none">
            {mealType} Time
          </span>
        </div>
      </div>

      {/* Right: Tour, Quick Notifications & Profile Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {onOpenWalkthrough && (
          <button
            type="button"
            onClick={onOpenWalkthrough}
            className="w-8 h-8 rounded-xl border-2 border-stone-900 bg-purple-200 hover:bg-purple-300 text-stone-900 font-display font-black text-xs shadow-brutal-xs flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 transition-transform shrink-0"
            title="How Provisions Works"
            aria-label="How Provisions Works"
          >
            ?
          </button>
        )}
        <button
          type="button"
          onClick={onOpenNotification}
          className="p-2 rounded-xl border-2 border-stone-900 bg-white hover:bg-stone-100 text-stone-900 shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          aria-label="Notifications"
        >
          <Bell size={16} weight="bold" />
        </button>
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-8 h-8 rounded-xl border-2 border-stone-900 bg-amber-300 text-stone-900 font-black text-xs shadow-brutal-xs flex items-center justify-center active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          aria-label="Profile and Settings"
        >
          {owner ? owner.charAt(0).toUpperCase() : <User size={16} weight="bold" />}
        </button>
      </div>
    </header>
  );
};
