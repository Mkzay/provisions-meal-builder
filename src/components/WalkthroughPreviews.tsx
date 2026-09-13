"use client";

import {
  ArrowClockwise,
  BookmarkSimple,
  CheckCircle,
  CookingPot,
  Package,
  Sparkle,
  User,
} from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

/**
 * Slide 1: Interactive Meal Moment Picker
 */
export const MealMomentPreview: React.FC = () => {
  const [selected, setSelected] = useState<"Breakfast" | "Lunch" | "Dinner">("Lunch");

  const moments = [
    { id: "Breakfast", label: "Breakfast", icon: "☀️", bg: "bg-amber-100 dark:bg-amber-950/60", activeBg: "bg-amber-300 dark:bg-amber-400 dark:text-stone-950", hint: "Light grains, eggs & warming porridge" },
    { id: "Lunch", label: "Lunch", icon: "🍲", bg: "bg-emerald-100 dark:bg-emerald-950/60", activeBg: "bg-emerald-300 dark:bg-emerald-400 dark:text-stone-950", hint: "Sustained staples, rich stews & veggies" },
    { id: "Dinner", label: "Dinner", icon: "🌙", bg: "bg-purple-100 dark:bg-purple-950/60", activeBg: "bg-purple-300 dark:bg-purple-400 dark:text-stone-950", hint: "Deep comfort, swallows & restorative broths" },
  ] as const;

  const current = moments.find((m) => m.id === selected)!;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {moments.map((m) => {
          const isActive = selected === m.id;
          return (
            <motion.button
              key={m.id}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => setSelected(m.id)}
              className={`p-2.5 rounded-2xl border-2 border-stone-900 dark:border-stone-700 flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? `${m.activeBg} shadow-brutal-xs -translate-y-0.5 font-black text-stone-900`
                  : "bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 font-bold"
              }`}
            >
              <span className="text-xl">{m.icon}</span>
              <span className="text-[11px] leading-tight">{m.label}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-900/20 dark:border-stone-700 text-center">
        <p className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
          <span className="font-bold text-stone-900 dark:text-stone-100">{selected}:</span> {current.hint}
        </p>
      </div>
    </div>
  );
};

/**
 * Slide 2: Real In-Stock Plate Demo
 */
export const PantryPlatePreview: React.FC = () => {
  const items = [
    { type: "Base", name: "Smoky Jollof Rice", tag: "In Stock" },
    { type: "Protein", name: "Peppered Chicken", tag: "In Stock" },
    { type: "Side", name: "Golden Fried Dodo", tag: "In Stock" },
  ];

  return (
    <div className="p-3 bg-white dark:bg-stone-800 rounded-2xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs space-y-2">
      <div className="flex items-center justify-between pb-1.5 border-b border-stone-900/10 dark:border-stone-700 text-[10px] font-black uppercase text-stone-500 dark:text-stone-400">
        <span>Tonight&apos;s Curated Plate</span>
        <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
          100% Pantry Stocked
        </span>
      </div>
      <div className="space-y-1.5">
        {items.map((it) => (
          <div
            key={it.type}
            className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/80 border border-stone-900/15 dark:border-stone-700"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-950/60 border border-stone-900/30 dark:border-amber-700 text-stone-800 dark:text-amber-300">
                {it.type}
              </span>
              <span className="text-xs font-black text-stone-900 dark:text-stone-100">{it.name}</span>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
              <CheckCircle size={12} weight="fill" />
              <span>{it.tag}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Slide 3: Interactive Tap-To-Swap Micro-Interaction
 */
export const SwapDemoPreview: React.FC = () => {
  const proteins = [
    { name: "Crisp Fried Chicken", tag: "Lean & Golden", icon: "🍗" },
    { name: "Grilled Croaker Fish", tag: "Omega-3 Rich", icon: "🐟" },
    { name: "Slow-Stewed Beef", tag: "Iron Rich", icon: "🥩" },
    { name: "Steamed Moi Moi", tag: "Plant Protein", icon: "🫘" },
  ];

  const [index, setIndex] = useState(0);

  const handleSwap = () => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(8);
    }
    setIndex((prev) => (prev + 1) % proteins.length);
  };

  const current = proteins[index];

  return (
    <div className="space-y-2.5">
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={handleSwap}
        className="w-full p-3.5 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 rounded-2xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs flex items-center justify-between text-left transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 shadow-2xs flex items-center justify-center text-xl shrink-0">
            {current.icon}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">
              Tap Card to Swap
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={current.name}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 block"
              >
                {current.name}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-black text-purple-900 dark:text-purple-300 bg-white dark:bg-stone-800 border border-stone-900 dark:border-stone-700 px-2.5 py-1 rounded-xl shadow-2xs group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
          <ArrowClockwise size={13} weight="bold" />
          <span>Swap</span>
        </div>
      </motion.button>
      <p className="text-[10px] text-center text-stone-500 dark:text-stone-400 font-bold">
        Tap the card above to cycle through proteins in real time
      </p>
    </div>
  );
};

/**
 * Slide 4: Bottom Navigation & Kitchen Hub Guide
 */
export const NavigationGuidePreview: React.FC = () => {
  const tabs = [
    { label: "Kitchen", desc: "Build meals from in-stock staples", icon: CookingPot, bg: "bg-amber-300 dark:bg-amber-400" },
    { label: "Recipes", desc: "Save & re-cook family favorites", icon: BookmarkSimple, bg: "bg-orange-200 dark:bg-orange-400" },
    { label: "Pantry", desc: "Update ingredients & stock levels", icon: Package, bg: "bg-emerald-200 dark:bg-emerald-400" },
    { label: "Hub", desc: "Personal goals & health settings", icon: User, bg: "bg-purple-200 dark:bg-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {tabs.map((t) => {
        const Icon = t.icon;
        return (
          <div
            key={t.label}
            className="p-2.5 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 shadow-2xs flex items-start gap-2 text-left"
          >
            <div className={`w-7 h-7 rounded-xl ${t.bg} border border-stone-900 dark:border-stone-950 flex items-center justify-center shrink-0 mt-0.5`}>
              <Icon size={15} weight="bold" className="text-stone-900 dark:text-stone-950" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black text-stone-900 dark:text-stone-100 block leading-tight">
                {t.label}
              </span>
              <span className="text-[9px] text-stone-600 dark:text-stone-400 font-medium leading-tight line-clamp-2">
                {t.desc}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
