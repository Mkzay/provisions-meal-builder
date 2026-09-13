"use client";

import { Sparkle, User, X } from "@/components/icons";
import { setProfilePromptDismissed } from "@/lib/profile-storage";
import React, { useState } from "react";

interface ProfileOnboardingBannerProps {
  onOpenProfile: () => void;
  owner?: string;
}

export const ProfileOnboardingBanner: React.FC<ProfileOnboardingBannerProps> = ({
  onOpenProfile,
  owner: propOwner,
}) => {
  const owner = propOwner || "User";
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    setProfilePromptDismissed(owner);
  };

  if (isDismissed) return null;

  return (
    <div className="mb-6 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#FEF08A] dark:bg-stone-900 border-2 border-stone-900 dark:border-amber-500/40 shadow-brutal-sm dark:shadow-brutal-dark-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 flex items-center justify-center shrink-0 shadow-brutal-xs text-stone-900 dark:text-amber-300">
          <Sparkle size={20} weight="fill" className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 border border-stone-900/40 dark:border-stone-700 text-stone-900 dark:text-stone-200">
              Optional Setup
            </span>
            <span className="text-xs font-bold text-stone-700 dark:text-stone-400 truncate">
              {propOwner ? `For ${propOwner}` : "Personalize Your Plan"}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
            Set your meal goal to personalize recommendations at your own pace.
          </p>
        </div>
      </div>

      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2.5 pt-2.5 sm:pt-0 border-t-2 border-stone-900/10 dark:border-stone-800 sm:border-0 shrink-0">
        <button
          type="button"
          onClick={handleDismiss}
          className="py-2 px-3 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/10 transition-all text-left sm:text-center"
        >
          Maybe later
        </button>
        <button
          type="button"
          onClick={onOpenProfile}
          className="py-2 px-4 rounded-xl text-xs font-black bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 shrink-0"
        >
          <User size={14} weight="bold" />
          <span>Set Goal</span>
        </button>
      </div>
    </div>
  );
};
