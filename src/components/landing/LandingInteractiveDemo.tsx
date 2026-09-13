"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

interface DemoDish {
  id: string;
  name: string;
  emoji: string;
  main: string;
  protein: string;
  proteinAlt: string;
  side: string;
  time: string;
  cleanup: string;
  note: string;
}

const DEMO_DISHES: DemoDish[] = [
  {
    id: "jollof",
    name: "Classic Party Jollof",
    emoji: "🍚",
    main: "Smoky Jollof Rice",
    protein: "Peppered Chicken",
    proteinAlt: "Fried Fish",
    side: "Fried Dodo (Plantain) + Coleslaw",
    time: "35 mins",
    cleanup: "2 pots",
    note: "Rich party smokiness demands caramelized fried plantains to balance savory pepper heat.",
  },
  {
    id: "yam",
    name: "Boiled Yam & Sauce",
    emoji: "🍠",
    main: "Puna Yam (Boiled)",
    protein: "Scrambled Pepper Eggs",
    proteinAlt: "Flaked Mackerel Sauce",
    side: "Sautéed Ugu Greens",
    time: "20 mins",
    cleanup: "1 pot, 1 pan",
    note: "Hearty yam absorbs aromatic egg and tomato sauce cleanly, delivering sustained morning energy.",
  },
  {
    id: "beans",
    name: "Slow-Cooked Honey Beans",
    emoji: "🫘",
    main: "Oloyin Honey Beans",
    protein: "Pan-Fried Beef Strips",
    proteinAlt: "Hard-Boiled Egg",
    side: "Ripe Plantain (Dodo) & Garri Sprinkle",
    time: "25 mins",
    cleanup: "2 pots",
    note: "The quintessential pairing: the natural sweetness of honey beans compounds with fried ripe plantain.",
  },
];

export const LandingInteractiveDemo: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>("jollof");
  const [isOutOfPrimaryProtein, setIsOutOfPrimaryProtein] = useState<boolean>(false);

  const activeDish = DEMO_DISHES.find((d) => d.id === selectedId) || DEMO_DISHES[0];
  const currentProtein = isOutOfPrimaryProtein ? activeDish.proteinAlt : activeDish.protein;

  return (
    <section id="demo" className="scroll-mt-16 sm:scroll-mt-20 py-16 sm:py-24 border-b-2 border-stone-900 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200 px-3 py-1 rounded-full border border-stone-900 mb-3 shadow-brutal-xs"
          >
            Interactive Live Demo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="font-display font-black text-2xl sm:text-4xl text-stone-950 tracking-tight mb-4"
          >
            See the Nigerian Pairing Engine in action.
          </motion.h2>
          <p className="text-sm sm:text-base text-stone-600 font-medium">
            Select a kitchen base below to watch how Provisions pairs proteins, sides, and nutritional balance in real time.
          </p>
        </div>

        {/* Base Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-8 px-2">
          {DEMO_DISHES.map((dish) => {
            const isSelected = dish.id === selectedId;
            return (
              <motion.button
                key={dish.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedId(dish.id);
                  setIsOutOfPrimaryProtein(false);
                }}
                className={`px-4 py-2.5 rounded-2xl border-2 border-stone-900 text-xs sm:text-sm font-black transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-amber-300 text-stone-950 shadow-brutal translate-x-[-1px] translate-y-[-1px]"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 shadow-brutal-xs"
                }`}
              >
                <span className="text-lg">{dish.emoji}</span>
                <span>{dish.name}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Demo Stage Container with Flanking Neo-Brutalist Callout Cards */}
        <div className="relative max-w-6xl mx-auto flex items-center justify-center">
          {/* Left Flanking Cards (Visible on large screens - Two Up & Two Down) */}
          <div className="hidden xl:flex flex-col justify-between absolute -left-2 top-8 bottom-12 z-10 pointer-events-none">
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [-2, 1, -2] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="w-56 p-3.5 rounded-2xl bg-white border-2 border-stone-900 shadow-brutal-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">🇳🇬</span>
                <span className="text-[11px] font-black uppercase text-stone-900">Cultural Blueprints</span>
              </div>
              <p className="text-[10px] text-stone-600 font-medium leading-relaxed">
                Authentic Nigerian pairings. No awkward AI suggestions.
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5], rotate: [1.5, -1.5, 1.5] }}
              transition={{ repeat: Infinity, duration: 5.4, ease: "easeInOut", delay: 0.4 }}
              className="w-56 p-3.5 rounded-2xl bg-amber-100 border-2 border-stone-900 shadow-brutal-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">♻️</span>
                <span className="text-[11px] font-black uppercase text-stone-900">Leftover Memory</span>
              </div>
              <p className="text-[10px] text-stone-700 font-medium leading-relaxed">
                Dinner leftovers auto-promote into tomorrow&apos;s 2-minute lunch.
              </p>
            </motion.div>
          </div>

          {/* Right Flanking Cards (Visible on large screens - Two Up & Two Down) */}
          <div className="hidden xl:flex flex-col justify-between absolute -right-2 top-8 bottom-12 z-10 pointer-events-none">
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [2, -1, 2] }}
              transition={{ repeat: Infinity, duration: 4.6, ease: "easeInOut", delay: 0.2 }}
              className="w-56 p-3.5 rounded-2xl bg-emerald-100 border-2 border-stone-900 shadow-brutal-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">⚡</span>
                <span className="text-[11px] font-black uppercase text-stone-900">In-Stock Only</span>
              </div>
              <p className="text-[10px] text-stone-700 font-medium leading-relaxed">
                Zero shopping runs. Built from whatever you currently have.
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [4, -4, 4], rotate: [-1.5, 2, -1.5] }}
              transition={{ repeat: Infinity, duration: 5.8, ease: "easeInOut", delay: 0.6 }}
              className="w-56 p-3.5 rounded-2xl bg-purple-100 border-2 border-stone-900 shadow-brutal-xs"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">🥗</span>
                <span className="text-[11px] font-black uppercase text-stone-900">Balanced Nutrition</span>
              </div>
              <p className="text-[10px] text-stone-700 font-medium leading-relaxed">
                Automatic tracking for high protein, fiber, and iron.
              </p>
            </motion.div>
          </div>

          {/* Live Result Card with Framer Motion Transitions */}
          <div className="w-full max-w-3xl bg-amber-50 rounded-3xl border-2 border-stone-900 p-5 sm:p-8 shadow-brutal">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeDish.id}-${isOutOfPrimaryProtein}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-5 border-b-2 border-stone-900/15">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                    Curated Combination
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-stone-950 mt-0.5">
                    {activeDish.main} + {currentProtein}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-600 bg-white px-2.5 py-1.5 rounded-xl border border-stone-900 shadow-brutal-xs">
                    ⏱️ {activeDish.time}
                  </span>
                  <span className="text-xs font-bold text-stone-600 bg-white px-2.5 py-1.5 rounded-xl border border-stone-900 shadow-brutal-xs">
                    🧼 {activeDish.cleanup}
                  </span>
                </div>
              </div>

              {/* Breakdown Items */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
                <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-900 shadow-brutal-xs">
                  <span className="block text-[10px] font-black uppercase text-stone-500">Base / Main</span>
                  <span className="font-black text-stone-900 text-sm mt-1 block">{activeDish.main}</span>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 mt-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                    ✓ In Kitchen Pantry
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-900 shadow-brutal-xs">
                  <span className="block text-[10px] font-black uppercase text-stone-500">Curated Protein</span>
                  <span className="font-black text-stone-900 text-sm mt-1 block">{currentProtein}</span>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 mt-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                    ✓ High Protein
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border-2 border-stone-900 shadow-brutal-xs">
                  <span className="block text-[10px] font-black uppercase text-stone-500">Sides / Balance</span>
                  <span className="font-black text-stone-900 text-sm mt-1 block">{activeDish.side}</span>
                  <span className="inline-block text-[10px] font-bold text-amber-800 mt-1 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                    Authentic Pairing
                  </span>
                </div>
              </div>

              {/* Intelligent Simulation Toggle */}
              <div className="bg-white/90 p-3.5 rounded-2xl border border-stone-900 mb-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🔄</span>
                  <span className="text-xs font-bold text-stone-800">
                    Simulate: What if you run out of {activeDish.protein}?
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOutOfPrimaryProtein(!isOutOfPrimaryProtein)}
                  className="text-xs font-black px-3.5 py-2 rounded-xl border border-stone-900 bg-amber-200 hover:bg-amber-300 shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all text-center"
                >
                  {isOutOfPrimaryProtein ? "Restock Primary" : "Test Fallback Match"}
                </button>
              </div>

              {/* Culinary Note Quote */}
              <div className="p-4 bg-amber-200/60 rounded-2xl border-2 border-stone-900 mb-6 text-xs text-stone-800 font-medium leading-relaxed">
                <span className="font-black text-stone-950 block mb-1">👩🏾‍🍳 Culinary Intelligence Note:</span>
                &ldquo;{activeDish.note}&rdquo;
              </div>
            </motion.div>
          </AnimatePresence>

          {/* CTA with Clean Mobile Text Wrapping */}
          <div className="text-center pt-2 px-1">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block w-full sm:w-auto">
              <Link
                href="/app"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-stone-950 text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-stone-900 shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center leading-snug"
              >
                <span>Build Your Next Meal in Provisions</span>
                <span className="text-base shrink-0">→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
};
