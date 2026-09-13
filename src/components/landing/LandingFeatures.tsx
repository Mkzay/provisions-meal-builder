"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export const LandingFeatures: React.FC = () => {
  return (
    <div id="features" className="scroll-mt-16 sm:scroll-mt-20 divide-y-2 divide-stone-900 dark:divide-stone-700 bg-stone-50 dark:bg-[#141210]">
      {/* 1. The 15 Dish Blueprints Section */}
      <section id="blueprints" className="scroll-mt-16 sm:scroll-mt-20 py-14 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-5 space-y-4 text-center sm:text-left"
            >
              <span className="inline-block text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-stone-900 dark:border-stone-700">
                Pillar 1: Cultural Intelligence
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-stone-950 dark:text-stone-100 tracking-tight leading-tight">
                Built on{" "}
                <span className="bg-amber-200 dark:bg-amber-400 text-stone-900 dark:text-stone-950 px-1.5 py-0.5 border border-stone-900 dark:border-stone-700 rounded-lg inline-block rotate-[-0.5deg]">
                  15 verified blueprints
                </span>
                . Not generic AI slop.
              </h2>
              <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                Generic recipe apps assume Western pantry staples and suggest bizarre pairings. Provisions is programmed with shared, verified Nigerian culinary rules: it knows why Vegetable Soup requires Assorted Meat, why Boiled Yam calls for Garden Egg or Pepper Sauce, and how Jollof pairs with Dodo.
              </p>
              <div className="pt-2">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-300 underline decoration-2 underline-offset-4"
                >
                  <span>Explore all 15 blueprints in the app</span>
                  <span>→</span>
                </Link>
              </div>
            </motion.div>

            {/* Blueprint Grid Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3"
            >
              {[
                { name: "Party Jollof Rice", emoji: "🍚", type: "Rice Main" },
                { name: "Puna Yam & Eggs", emoji: "🍠", type: "Tuber Main" },
                { name: "Honey Beans & Dodo", emoji: "🫘", type: "Legume Main" },
                { name: "Rich Egusi Soup", emoji: "🥣", type: "Traditional Soup" },
                { name: "Efo Riro Greens", emoji: "🥬", type: "Vegetable Soup" },
                { name: "Catfish Pepper Soup", emoji: "🍲", type: "Broth / Stew" },
                { name: "Fried Plantain (Dodo)", emoji: "🍌", type: "Staple Side" },
                { name: "Nigerian Fried Rice", emoji: "🥘", type: "Rice Main" },
                { name: "Moi Moi Steamed Bean", emoji: "📦", type: "Protein Side" },
              ].map((bp) => (
                <div
                  key={bp.name}
                  className="p-3 sm:p-3.5 bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
                >
                  <span className="text-2xl block mb-1.5">{bp.emoji}</span>
                  <span className="text-xs font-black text-stone-900 dark:text-stone-100 block leading-tight">
                    {bp.name}
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 block mt-1 uppercase">
                    {bp.type}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Zero-Waste Leftovers Engine */}
      <section className="py-16 sm:py-24 bg-amber-100/40 dark:bg-stone-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block text-xs font-black uppercase tracking-wider text-orange-800 dark:text-orange-300 bg-orange-200 dark:bg-orange-950/80 px-3 py-1 rounded-full border border-stone-900 dark:border-stone-700 mb-3 shadow-brutal-xs dark:shadow-brutal-dark-sm">
              Pillar 2: Zero Food Waste
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-black text-2xl sm:text-4xl text-stone-950 dark:text-stone-100 tracking-tight mb-4"
            >
              Turn tonight’s big batch into tomorrow’s instant{" "}
              <span className="bg-emerald-200 dark:bg-emerald-400 text-stone-900 dark:text-stone-950 px-1.5 py-0.5 border border-stone-900 dark:border-stone-700 rounded-lg inline-block rotate-[0.5deg]">
                2-minute lunch
              </span>
              .
            </motion.h2>
            <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium">
              Nigerian cooking is batch cooking. When you confirm dinner in Provisions, one quick tap logs your leftovers into your Ready Meals inventory so nothing ever spoils in the back of the fridge.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto"
          >
            <div className="p-5 sm:p-6 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal dark:shadow-brutal-dark space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-300 dark:bg-amber-400 text-stone-950 border-2 border-stone-900 dark:border-stone-700 flex items-center justify-center font-black text-lg shadow-brutal-xs dark:shadow-brutal-dark-sm">
                1
              </div>
              <h3 className="font-display font-black text-lg text-stone-900 dark:text-stone-100">
                One-Tap Leftover Prompt
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                Right after &quot;I&apos;m Eating This,&quot; Provisions asks: &quot;Did you cook enough for leftovers?&quot; No complex forms. Just a single tap.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal dark:shadow-brutal-dark space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-300 dark:bg-emerald-400 text-stone-950 border-2 border-stone-900 dark:border-stone-700 flex items-center justify-center font-black text-lg shadow-brutal-xs dark:shadow-brutal-dark-sm">
                2
              </div>
              <h3 className="font-display font-black text-lg text-stone-900 dark:text-stone-100">
                Prioritized at Lunchtime
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                When 1:00 PM arrives, Ready Meals appear first with heat-and-eat badges, saving you from cooking when work or life is busy.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal dark:shadow-brutal-dark space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-300 dark:bg-sky-400 text-stone-950 border-2 border-stone-900 dark:border-stone-700 flex items-center justify-center font-black text-lg shadow-brutal-xs dark:shadow-brutal-dark-sm">
                3
              </div>
              <h3 className="font-display font-black text-lg text-stone-900 dark:text-stone-100">
                Pantry Stash Sync
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
                Once eaten, the meal rotates out of stock automatically. Your household inventory stays accurate with zero manual upkeep.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Personal Recipe Vault */}
      <section id="personal-recipes" className="scroll-mt-16 sm:scroll-mt-20 py-16 sm:py-24 bg-white dark:bg-[#141210]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-6 space-y-4"
            >
              <span className="inline-block text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-300 bg-rose-200 dark:bg-rose-950/80 px-3 py-1 rounded-full border border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm">
                Pillar 3: Personal Taste
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-stone-950 dark:text-stone-100 tracking-tight leading-tight">
                Your private recipe vault. Surfaced only when{" "}
                <span className="bg-rose-200 dark:bg-rose-400 text-stone-900 dark:text-stone-950 px-1.5 py-0.5 border border-stone-900 dark:border-stone-700 rounded-lg inline-block rotate-[-0.5deg]">
                  ingredients are in stock
                </span>
                .
              </h2>
              <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                Found a great recipe on TikTok or got Auntie&apos;s secret spice ratio? Save it in your personal catalogue. It supports multiple proteins and sides, and only appears in suggestions when every required ingredient is present in your kitchen.
              </p>
              <div className="space-y-2 pt-2 text-xs font-bold text-stone-800 dark:text-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>Multi-protein (e.g. Chicken + Beef) &amp; multi-side support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>Automatic stock tracking (shows &quot;All in stock&quot; or missing items)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                  <span>One-click &quot;Cook This&quot; pre-selects all pairing steps</span>
                </div>
              </div>
            </motion.div>

            {/* Recipe Card Mockup */}
            <div className="lg:col-span-6">
              <div className="p-6 bg-amber-50 dark:bg-stone-900 rounded-3xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal dark:shadow-brutal-dark space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900/10 dark:border-stone-700">
                  <div>
                    <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Saved Recipe</span>
                    <h4 className="font-display font-black text-lg text-stone-950 dark:text-stone-100">Auntie Lola&apos;s Party Rice</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-800 dark:border-emerald-600 text-[10px] font-black uppercase">
                    All In Stock
                  </span>
                </div>
                <div className="text-xs text-stone-700 dark:text-stone-300 space-y-1.5 font-semibold">
                  <div><span className="text-stone-400 dark:text-stone-500">Base:</span> Smoky Parboiled Rice</div>
                  <div><span className="text-stone-400 dark:text-stone-500">Proteins:</span> Peppered Turkey + Fried Beef</div>
                  <div><span className="text-stone-400 dark:text-stone-500">Sides:</span> Fried Dodo + Coleslaw</div>
                </div>
                <div className="pt-2">
                  <span className="w-full py-2 bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950 text-xs font-black uppercase tracking-wider rounded-xl border border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm flex items-center justify-center gap-1.5">
                    🍳 Ready to Cook Tonight
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
