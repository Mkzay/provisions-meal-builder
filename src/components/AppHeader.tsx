"use client";

import {
  Bell,
  BookmarkSimple,
  Plus,
  Sparkle,
  User,
} from "@/components/icons";
import { ProvisionsLogo } from "@/components/ProvisionsLogo";
import React from "react";

interface AppHeaderProps {
  isCachedFallback?: boolean;
  onOpenSettings?: () => void;
  onResetToHome: () => void;
  onOpenNotifications: () => void;
  onOpenAddSupply: () => void;
  onOpenSavedRecipes?: () => void;
  onOpenPersonalHub?: (initialTab?: "profile" | "progress") => void;
  onOpenProfile?: () => void;
  onOpenProgressLog?: () => void;
  onOpenWalkthrough?: () => void;
  owner?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  isCachedFallback = false,
  onOpenSettings,
  onResetToHome,
  onOpenNotifications,
  onOpenAddSupply,
  onOpenSavedRecipes,
  onOpenPersonalHub,
  onOpenProfile,
  onOpenProgressLog,
  onOpenWalkthrough,
  owner: propOwner,
}) => {
  const owner = propOwner?.trim() || "";
  const displayName = owner || "there";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        text: `Good morning, ${displayName}`,
        subtitle: "Start your day with something easy & nourishing.",
      };
    }
    if (hour >= 12 && hour < 17) {
      return {
        text: `Lunchtime, ${displayName}`,
        subtitle: "Refuel your mind with what's in your kitchen.",
      };
    }
    if (hour >= 17 && hour < 22) {
      return {
        text: `Good evening, ${displayName}`,
        subtitle: "Unwind and enjoy a comforting home dinner.",
      };
    }
    return {
      text: `Night craving, ${displayName}?`,
      subtitle: "Grab a soothing snack or warm drink before bed.",
    };
  };

  const greeting = getGreeting();

  return (
    <div className="w-full">
      {/* 1. Global Navigation Header Bar (Distinct tactile top bar with bottom divider) */}
      <header className="w-full pb-3.5 sm:pb-4 border-b-2 border-stone-900/10">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <button
            onClick={onResetToHome}
            className="flex items-center gap-2 sm:gap-3 text-left group transition-transform active:scale-[0.99] shrink-0"
            aria-label="Provisions Home"
          >
            <ProvisionsLogo className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
            <div className="flex flex-col justify-center shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-2xl font-display font-black tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                  Provisions
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-300 text-stone-900 border border-stone-900">
                  <Sparkle size={11} weight="fill" />
                  <span>Kitchen</span>
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-stone-500 font-medium">
                Your meal decider
              </p>
            </div>
          </button>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Restock Button */}
            <button
              onClick={onOpenAddSupply}
              aria-label="Restock supplies to kitchen"
              className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 sm:min-h-[42px] text-xs font-black px-2.5 sm:px-3.5 rounded-xl bg-emerald-300 hover:bg-emerald-400 text-stone-900 border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-all shrink-0"
              title="Add new ingredient or ready meal"
            >
              <Plus size={16} weight="bold" />
              <span className="hidden sm:inline">Restock</span>
            </button>

            {/* Saved Recipes Button */}
            {onOpenSavedRecipes && (
              <button
                onClick={onOpenSavedRecipes}
                className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 sm:min-h-[42px] text-xs font-black px-2.5 sm:px-3.5 rounded-xl bg-orange-200 hover:bg-orange-300 text-stone-900 border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-all shrink-0"
                title="My Saved Recipes"
                aria-label="My Saved Recipes"
              >
                <BookmarkSimple size={16} weight="bold" />
                <span className="hidden sm:inline">Recipes</span>
              </button>
            )}

            {/* Meal Reminders Button */}
            <button
              onClick={onOpenNotifications}
              className="inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 sm:min-h-[42px] sm:min-w-[42px] p-2 sm:p-2.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-stone-900 border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-all shrink-0"
              title="Manage meal notification reminders"
              aria-label="Meal Reminders"
            >
              <Bell size={17} weight="bold" />
            </button>

            {/* How It Works Tour Button */}
            {onOpenWalkthrough && (
              <button
                onClick={onOpenWalkthrough}
                className="inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 sm:min-h-[42px] sm:min-w-[42px] p-2 sm:p-2.5 rounded-xl bg-purple-200 hover:bg-purple-300 text-stone-900 border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-all shrink-0 font-display font-black text-xs"
                title="How Provisions Works (Tour)"
                aria-label="How Provisions Works"
              >
                ?
              </button>
            )}

            {/* Personal Hub Button (Unified Eating Goal & Weight Log) */}
            {(onOpenPersonalHub || onOpenProfile || onOpenProgressLog) && (
              <button
                onClick={() => {
                  if (onOpenPersonalHub) {
                    onOpenPersonalHub("profile");
                  } else if (onOpenProfile) {
                    onOpenProfile();
                  } else if (onOpenProgressLog) {
                    onOpenProgressLog();
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 h-9 sm:h-10 sm:min-h-[42px] text-xs font-black px-2.5 sm:px-3.5 rounded-xl bg-rose-200 hover:bg-rose-300 text-stone-900 border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-all shrink-0"
                title={`${owner}'s Personal Space (Eating Goal & Weight Log)`}
                aria-label={`${owner}'s Personal Space`}
              >
                <User size={16} weight="bold" />
                <span className="hidden sm:inline">{owner}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Page Welcome & Daily Pulse (Distinct hero section with its own clear dividing boundary) */}
      <section className="w-full pt-4 sm:pt-5 pb-5 sm:pb-6 border-b-2 border-stone-900/10 mb-5 sm:mb-7">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black tracking-tight text-stone-900 leading-tight">
            {greeting.text}
          </h1>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-300 text-stone-900 border border-stone-900 shadow-brutal-xs">
            <Sparkle size={11} weight="fill" />
            <span>Studio</span>
          </span>
        </div>
        <p className="text-[13px] sm:text-sm lg:text-base text-stone-700 font-semibold mt-1 sm:mt-1.5 leading-relaxed max-w-2xl">
          {greeting.subtitle}
        </p>
      </section>
    </div>
  );
};

