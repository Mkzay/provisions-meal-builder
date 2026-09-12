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
}

export const NotionSettingsModal: React.FC<NotionSettingsModalProps> = ({
  isOpen,
  isCachedFallback = false,
  onClose,
  onRefreshCatalogue,
  onResetSeedData,
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
          className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-surface border-[2.5px] border-ink rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg overflow-hidden"
        >
          {/* Pinned Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-2 border-stone-200 shrink-0 bg-surface">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-200 border-2 border-ink text-ink flex items-center justify-center shadow-brutal-sm shrink-0">
                <Database size={22} weight="bold" />
              </div>
              <div>
                <h3 id="notion-modal-title" className="font-display font-extrabold text-base sm:text-lg text-ink">
                  Kitchen Sync &amp; Notion Setup
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {isCachedFallback
                    ? "Operating on offline-first cached snapshot"
                    : "Connected directly to Notion API"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Notion settings"
              className="p-2 rounded-xl border-2 border-ink bg-white shadow-brutal-sm hover:bg-stone-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 sm:px-6 py-4 space-y-4 min-h-0">
            {/* Sync status card */}
            <div className="p-4 rounded-2xl bg-saffron-100 border-2 border-ink shadow-brutal-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold text-ink block">
                  Database Connection
                </span>
                <p className="text-[11px] text-stone-600 font-medium mt-0.5">
                  {isCachedFallback
                    ? "Running on local starter kitchen catalogue"
                    : "Active Notion credentials linked"}
                </p>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border-2 border-ink hover:bg-stone-50 text-xs font-extrabold text-ink shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 transition-all min-h-[40px]"
              >
                <ArrowClockwise
                  size={16}
                  weight="bold"
                  className={`text-ink ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Sync Now</span>
              </button>
            </div>

            {/* Notion Schema Reference */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2">
                <FileText size={18} weight="bold" className="text-ink" />
                <h4 className="font-display font-extrabold text-sm text-ink">
                  Notion Database Schema Guide
                </h4>
              </div>
              <p className="text-xs text-stone-600 font-medium leading-relaxed">
                Create 3 databases in Notion with these exact column names to connect Esther&apos;s live workspace:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-2xl border-2 border-ink bg-white shadow-brutal-sm">
                  <div className="font-extrabold text-ink mb-1">
                    1. Ingredients Catalogue
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600 font-medium">
                    <li><strong className="text-ink">Name</strong> (Title)</li>
                    <li><strong className="text-ink">Meal Type</strong> (Multi-select: Breakfast, Lunch, Dinner, Snack)</li>
                    <li><strong className="text-ink">Role</strong> (Select: Main, Protein, Supplementary)</li>
                    <li><strong className="text-ink">Available</strong> (Checkbox)</li>
                    <li><strong className="text-ink">Owner</strong> (Select: Esther)</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl border-2 border-ink bg-white shadow-brutal-sm">
                  <div className="font-extrabold text-ink mb-1">
                    2. Ready Meals
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600 font-medium">
                    <li><strong className="text-ink">Name</strong> (Title)</li>
                    <li><strong className="text-ink">Meal Type</strong> (Multi-select: Breakfast, Lunch, Dinner, Snack)</li>
                    <li><strong className="text-ink">Available</strong> (Checkbox)</li>
                    <li><strong className="text-ink">Owner</strong> (Select: Esther)</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl border-2 border-ink bg-white shadow-brutal-sm">
                  <div className="font-extrabold text-ink mb-1">
                    3. Meal Log
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600 font-medium">
                    <li><strong className="text-ink">Date</strong> (Date)</li>
                    <li><strong className="text-ink">Meal Type</strong> (Select)</li>
                    <li><strong className="text-ink">Source</strong> (Select: Ready Meal, Built)</li>
                    <li><strong className="text-ink">Main Ingredient</strong> (Rich text)</li>
                    <li><strong className="text-ink">Protein</strong> (Rich text)</li>
                    <li><strong className="text-ink">Supplementary</strong> (Rich text)</li>
                    <li><strong className="text-ink">Had Leftovers</strong> (Checkbox)</li>
                    <li><strong className="text-ink">Owner</strong> (Select: Esther)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Pinned Footer */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-stone-200 bg-stone-100/90 shrink-0 flex items-center justify-between safe-area-bottom">
            <button
              onClick={onResetSeedData}
              className="text-xs font-bold text-stone-500 hover:text-paprika-600 underline"
            >
              Reset to demo kitchen
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl border-2 border-ink bg-saffron-300 hover:bg-saffron-400 text-ink text-xs font-extrabold shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all min-h-[44px]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
