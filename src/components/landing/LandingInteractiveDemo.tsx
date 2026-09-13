"use client";

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
    <section id="demo" className="py-16 sm:py-24 border-b-2 border-stone-900 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200 px-3 py-1 rounded-full border border-stone-900 mb-3">
            Interactive Live Demo
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-stone-950 tracking-tight mb-4">
            See the Nigerian Pairing Engine in action.
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-medium">
            Select a kitchen base below to watch how Provisions pairs proteins, sides, and nutritional balance in real time.
          </p>
        </div>

        {/* Base Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {DEMO_DISHES.map((dish) => {
            const isSelected = dish.id === selectedId;
            return (
              <button
                key={dish.id}
                type="button"
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
              </button>
            );
          })}
        </div>

        {/* Live Result Card */}
        <div className="max-w-3xl mx-auto bg-amber-50 rounded-3xl border-2 border-stone-900 p-6 sm:p-8 shadow-brutal">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-stone-900/15">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
                Curated Combination
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-stone-950 mt-0.5">
                {activeDish.main} + {currentProtein}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600 bg-white px-3 py-1.5 rounded-xl border border-stone-900 shadow-brutal-xs">
                ⏱️ {activeDish.time}
              </span>
              <span className="text-xs font-bold text-stone-600 bg-white px-3 py-1.5 rounded-xl border border-stone-900 shadow-brutal-xs">
                🧼 {activeDish.cleanup}
              </span>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
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
          <div className="bg-white/80 p-3.5 rounded-2xl border border-stone-900 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">🔄</span>
              <span className="text-xs font-bold text-stone-800">
                Simulate: What if you run out of {activeDish.protein}?
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOutOfPrimaryProtein(!isOutOfPrimaryProtein)}
              className="text-xs font-black px-3 py-1.5 rounded-xl border border-stone-900 bg-amber-200 hover:bg-amber-300 shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all self-end sm:self-auto"
            >
              {isOutOfPrimaryProtein ? "Restock Primary" : "Test Fallback Match"}
            </button>
          </div>

          {/* Culinary Note Quote */}
          <div className="p-4 bg-amber-200/60 rounded-2xl border-2 border-stone-900 mb-6 text-xs text-stone-800 font-medium leading-relaxed">
            <span className="font-black text-stone-950 block mb-1">👩🏾‍🍳 Culinary Intelligence Note:</span>
            &ldquo;{activeDish.note}&rdquo;
          </div>

          {/* CTA */}
          <div className="text-center pt-2">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-stone-950 text-xs font-black uppercase tracking-wider border-2 border-stone-900 shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <span>Build Your Next Meal in Provisions</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
