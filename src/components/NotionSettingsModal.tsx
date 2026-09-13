"use client";

import {
  ArrowClockwise,
  CheckCircle,
  Database,
  FileText,
  Sparkle,
  X,
} from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface NotionSettingsModalProps {
  isOpen: boolean;
  isCachedFallback?: boolean;
  onClose: () => void;
  onRefreshCatalogue: () => Promise<void>;
  onResetSeedData: () => void;
  owner?: string;
}

export const NotionSettingsModal: React.FC<NotionSettingsModalProps> = ({
  isOpen,
  isCachedFallback = false,
  onClose,
  onRefreshCatalogue,
  onResetSeedData,
  owner,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Keyboard Escape listener for impeccable a11y
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshCatalogue();
    setIsRefreshing(false);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-foreground/40 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notion-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF8F5] dark:bg-[#141210] border-[2.5px] border-stone-900 dark:border-stone-700 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg dark:shadow-brutal-dark overflow-hidden"
        >
          {/* Pinned Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-2 border-stone-200 dark:border-stone-700 shrink-0 bg-[#FAF8F5] dark:bg-[#141210]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-200 dark:bg-emerald-950/60 border-2 border-stone-900 dark:border-emerald-700 text-stone-900 dark:text-emerald-300 flex items-center justify-center shadow-brutal-sm dark:shadow-brutal-dark-sm shrink-0">
                <Database size={22} weight="bold" />
              </div>
              <div>
                <h3 id="notion-modal-title" className="font-display font-extrabold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  Kitchen Sync &amp; Notion Setup
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {isCachedFallback
                    ? "Operating on offline-first cached snapshot"
                    : "Connected directly to Notion API"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Notion settings"
              className="p-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:bg-stone-100 dark:hover:bg-stone-700 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 sm:px-6 py-4 space-y-4 min-h-0">
            {/* Sync status card */}
            <div className="p-4 rounded-2xl bg-amber-100 dark:bg-amber-950/40 border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100 block">
                  Database Connection
                </span>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium mt-0.5">
                  {isCachedFallback
                    ? "Running on local starter kitchen catalogue"
                    : "Active Notion credentials linked"}
                </p>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 text-xs font-extrabold text-stone-900 dark:text-stone-100 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 transition-all min-h-[40px]"
              >
                <ArrowClockwise
                  size={16}
                  weight="bold"
                  className={`text-stone-900 dark:text-stone-100 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Sync Now</span>
              </button>
            </div>

            {/* Notion Schema Reference */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2">
                <FileText size={18} weight="bold" className="text-stone-900 dark:text-stone-100" />
                <h4 className="font-display font-extrabold text-sm text-stone-900 dark:text-stone-100">
                  Notion Database Schema Guide
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                Create 3 databases in Notion with these exact column names to connect {owner ? `${owner}'s` : "your"} live workspace:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-2xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800/80 shadow-brutal-sm dark:shadow-brutal-dark-sm">
                  <div className="font-extrabold text-stone-900 dark:text-stone-100 mb-1">
                    1. Ingredients Catalogue
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600 dark:text-stone-400 font-medium">
                    <li><strong className="text-stone-900 dark:text-stone-200">Name</strong> (Title)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Meal Type</strong> (Multi-select: Breakfast, Lunch, Dinner, Snack)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Role</strong> (Select: Main, Protein, Supplementary)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Available</strong> (Checkbox)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Owner</strong> (Select: {owner || "your name"})</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800/80 shadow-brutal-sm dark:shadow-brutal-dark-sm">
                  <div className="font-extrabold text-stone-900 dark:text-stone-100 mb-1">
                    2. Ready Meals
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600 dark:text-stone-400 font-medium">
                    <li><strong className="text-stone-900 dark:text-stone-200">Name</strong> (Title)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Meal Type</strong> (Multi-select: Breakfast, Lunch, Dinner, Snack)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Available</strong> (Checkbox)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Owner</strong> (Select: {owner || "your name"})</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800/80 shadow-brutal-sm dark:shadow-brutal-dark-sm">
                  <div className="font-extrabold text-stone-900 dark:text-stone-100 mb-1">
                    3. Meal Log
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600 dark:text-stone-400 font-medium">
                    <li><strong className="text-stone-900 dark:text-stone-200">Date</strong> (Date)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Meal Type</strong> (Select)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Source</strong> (Select: Ready Meal, Built)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Main Ingredient</strong> (Rich text)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Protein</strong> (Rich text)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Supplementary</strong> (Rich text)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Had Leftovers</strong> (Checkbox)</li>
                    <li><strong className="text-stone-900 dark:text-stone-200">Owner</strong> (Select: {owner || "your name"})</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pinned Footer */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-stone-200 dark:border-stone-700 bg-stone-100/90 dark:bg-stone-900/90 shrink-0 flex items-center justify-between safe-area-bottom">
            <button
              onClick={onResetSeedData}
              className="text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 underline"
            >
              Reset to demo kitchen
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl border-2 border-stone-900 dark:border-stone-950 bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 dark:hover:bg-amber-300 text-stone-900 dark:text-stone-950 text-xs font-extrabold shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all min-h-[44px]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
