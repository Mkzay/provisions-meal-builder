"use client";

import { Scales, SignOut, User, X } from "@/components/icons";
import { MealProfileSection } from "@/components/MealProfileSection";
import { ProgressLogSection } from "@/components/ProgressLogSection";
import { ThemeSegmentedControl } from "@/components/ThemeToggle";
import { MealProfile } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";

export type PersonalHubTab = "profile" | "progress";

interface PersonalHubModalProps {
  isOpen: boolean;
  initialTab?: PersonalHubTab;
  onClose: () => void;
  onProfileSaved?: (profile: MealProfile) => void;
  owner?: string;
}

export const PersonalHubModal: React.FC<PersonalHubModalProps> = ({
  isOpen,
  initialTab = "profile",
  onClose,
  onProfileSaved,
  owner: propOwner,
}) => {
  const owner = propOwner || "User";
  const [activeTab, setActiveTab] = useState<PersonalHubTab>(initialTab);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isProfileJustSaved, setIsProfileJustSaved] = useState(false);
  const saveProfileRef = React.useRef<(() => Promise<void>) | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="personal-hub-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF8F5] dark:bg-[#181614] border-[2.5px] border-stone-900 dark:border-stone-700 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg dark:shadow-[6px_6px_0px_#000000] overflow-hidden"
        >
          {/* Mobile Bottom Sheet Pull Bar */}
          <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-2 border-stone-900 dark:border-stone-800 shrink-0 bg-[#FAF8F5] dark:bg-[#181614]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-200 dark:bg-rose-950/80 border-2 border-stone-900 dark:border-rose-600/70 shadow-brutal-sm dark:shadow-brutal-dark-sm flex items-center justify-center text-stone-900 dark:text-rose-200 shrink-0">
                {activeTab === "profile" ? (
                  <User size={22} weight="bold" />
                ) : (
                  <Scales size={22} weight="bold" />
                )}
              </div>
              <div>
                <h3
                  id="personal-hub-modal-title"
                  className="text-lg sm:text-xl font-display font-black tracking-tight text-stone-900 dark:text-stone-100"
                >
                  {owner}&apos;s Personal Space
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 font-medium">
                  {activeTab === "profile"
                    ? "Eating goal & personal context"
                    : "Standalone weight progress log"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close personal space"
              className="p-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:bg-stone-100 dark:hover:bg-stone-700 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Theme & Segmented Tab Switcher */}
          <div className="px-5 sm:px-6 pt-3 pb-2 border-b-2 border-stone-900/10 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#181614] shrink-0 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Color Theme
              </span>
              <div className="w-56">
                <ThemeSegmentedControl />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200/80 dark:bg-stone-800/80 rounded-2xl border-2 border-stone-900 dark:border-stone-700">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && window.navigator?.vibrate) {
                    window.navigator.vibrate(8);
                  }
                  setActiveTab("profile");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "profile"
                    ? "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950 border-2 border-stone-900 dark:border-stone-900 shadow-brutal-xs"
                    : "text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                <User size={15} weight="bold" />
                <span>Eating Goal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && window.navigator?.vibrate) {
                    window.navigator.vibrate(8);
                  }
                  setActiveTab("progress");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "progress"
                    ? "bg-purple-300 dark:bg-purple-400 text-stone-900 dark:text-stone-950 border-2 border-stone-900 dark:border-stone-900 shadow-brutal-xs"
                    : "text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                <Scales size={15} weight="bold" />
                <span>Weight Log</span>
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar modal-scroll-contain p-5 sm:p-6 min-h-0">
            {activeTab === "profile" ? (
              <MealProfileSection
                owner={owner}
                onSaved={onProfileSaved}
                onRegisterSave={(fn) => {
                  saveProfileRef.current = fn;
                }}
                onSaveStateChange={(saving, saved) => {
                  setIsProfileSaving(saving);
                  setIsProfileJustSaved(saved);
                }}
              />
            ) : (
              <ProgressLogSection owner={owner} />
            )}
          </div>

          {/* Auto-save bar directly above the bottom footer of the modal */}
          {activeTab === "profile" && (
            <div className="px-5 sm:px-6 py-2.5 bg-[#FEF9C3] dark:bg-[#261E0A] border-t-2 border-stone-900 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    isProfileJustSaved ? "bg-emerald-500 animate-pulse" : "bg-emerald-500"
                  }`}
                />
                <span className="text-[11px] sm:text-xs font-bold text-stone-800 dark:text-amber-200 truncate">
                  {isProfileJustSaved ? "✓ Profile & weight saved to cloud!" : "Auto-saves on selection"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => saveProfileRef.current?.()}
                disabled={isProfileSaving}
                className={`py-1.5 px-3.5 sm:px-4 rounded-xl font-black text-xs border-2 border-stone-900 shadow-brutal-xs transition-all active:translate-x-[1px] active:translate-y-[1px] shrink-0 ${
                  isProfileJustSaved
                    ? "bg-emerald-400 text-stone-900"
                    : isProfileSaving
                    ? "bg-amber-200 dark:bg-amber-950 text-stone-700 dark:text-amber-200 cursor-wait"
                    : "bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 dark:hover:bg-amber-300 text-stone-900 dark:text-stone-950"
                }`}
              >
                <span>
                  {isProfileSaving
                    ? "Saving..."
                    : isProfileJustSaved
                    ? "✓ Saved!"
                    : "Save Profile & Weight"}
                </span>
              </button>
            </div>
          )}

          {/* Pinned Footer */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-stone-900 dark:border-stone-800 bg-stone-100/90 dark:bg-stone-900 shrink-0 flex items-center justify-between gap-2 sm:gap-3 safe-area-bottom">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-900 dark:text-rose-200 border-2 border-stone-900 dark:border-rose-700 shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all"
              title="Sign out of current account"
            >
              <SignOut size={14} weight="bold" />
              <span>Sign Out</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline text-[11px] font-bold text-stone-500 dark:text-stone-400">
                {owner}&apos;s instance · No calorie counting
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 border-2 border-stone-900 dark:border-stone-900 shadow-brutal-sm hover:bg-stone-800 dark:hover:bg-amber-300 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
