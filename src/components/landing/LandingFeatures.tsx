"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export const LandingFeatures: React.FC = () => {
  return (
    <div id="features" className="divide-y-2 divide-stone-900 bg-stone-50">
      {/* 1. The 15 Dish Blueprints Section */}
      <section id="blueprints" className="py-14 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-5 space-y-4 text-center sm:text-left"
            >
              <span className="inline-block text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-200 px-3 py-1 rounded-full border border-stone-900">
                Pillar 1: Cultural Intelligence
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-stone-950 tracking-tight leading-tight">
                Built on 15 verified Nigerian dish blueprints. Not generic AI slop.
              </h2>
              <p className="text-sm sm:text-base text-stone-700 font-medium leading-relaxed">
                Generic recipe apps assume Western pantry staples and suggest bizarre pairings. Provisions is programmed with shared, verified Nigerian culinary rules: it knows why Vegetable Soup requires Assorted Meat, why Boiled Yam calls for Garden Egg or Pepper Sauce, and how Jollof pairs with Dodo.
              </p>
              <div className="pt-2">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 hover:text-amber-950 underline decoration-2 underline-offset-4"
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
                  className="p-3 sm:p-3.5 bg-white rounded-2xl border-2 border-stone-900 shadow-brutal-xs hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
                >
                  <span className="text-2xl block mb-1.5">{bp.emoji}</span>
                  <span className="text-xs font-black text-stone-900 block leading-tight">
                    {bp.name}
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 block mt-1 uppercase">
                    {bp.type}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Zero-Waste Leftovers Engine */}
      <section className="py-16 sm:py-24 bg-amber-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block text-xs font-black uppercase tracking-wider text-orange-800 bg-orange-200 px-3 py-1 rounded-full border border-stone-900 mb-3">
              Pillar 2: Zero Food Waste
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-stone-950 tracking-tight mb-4">
              Turn tonight’s big batch into tomorrow’s instant 2-minute lunch.
            </h2>
            <p className="text-sm sm:text-base text-stone-700 font-medium">
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
            <div className="p-5 sm:p-6 bg-white rounded-3xl border-2 border-stone-900 shadow-brutal space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-300 border-2 border-stone-900 flex items-center justify-center font-black text-lg shadow-brutal-xs">
                1
              </div>
              <h3 className="font-display font-black text-lg text-stone-900">
                One-Tap Leftover Prompt
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                Right after &quot;I&apos;m Eating This,&quot; Provisions asks: &quot;Did you cook enough for leftovers?&quot; No complex forms. Just a single tap.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white rounded-3xl border-2 border-stone-900 shadow-brutal space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-300 border-2 border-stone-900 flex items-center justify-center font-black text-lg shadow-brutal-xs">
                2
              </div>
              <h3 className="font-display font-black text-lg text-stone-900">
                Prioritized at Lunchtime
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                When 1:00 PM arrives, Ready Meals appear first with heat-and-eat badges, saving you from cooking when work or life is busy.
              </p>
            </div>

            <div className="p-5 sm:p-6 bg-white rounded-3xl border-2 border-stone-900 shadow-brutal space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-300 border-2 border-stone-900 flex items-center justify-center font-black text-lg shadow-brutal-xs">
                3
              </div>
              <h3 className="font-display font-black text-lg text-stone-900">
                Pantry Stash Sync
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                Once eaten, the meal rotates out of stock automatically. Your household inventory stays accurate with zero manual upkeep.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Personal Recipe Vault */}
      <section id="personal-recipes" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="inline-block text-xs font-black uppercase tracking-wider text-rose-800 bg-rose-200 px-3 py-1 rounded-full border border-stone-900">
                Pillar 3: Personal Taste
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-stone-950 tracking-tight leading-tight">
                Your private recipe vault. Surfaced only when ingredients are in stock.
              </h2>
              <p className="text-sm sm:text-base text-stone-700 font-medium leading-relaxed">
                Found a great recipe on TikTok or got Auntie&apos;s secret spice ratio? Save it in your personal catalogue. It supports multiple proteins and sides, and only appears in suggestions when every required ingredient is present in your kitchen.
              </p>
              <div className="space-y-2 pt-2 text-xs font-bold text-stone-800">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Multi-protein (e.g. Chicken + Beef) & multi-side support</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Automatic stock tracking (shows &quot;All in stock&quot; or missing items)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>One-click &quot;Cook This&quot; pre-selects all pairing steps</span>
                </div>
              </div>
            </div>

            {/* Recipe Card Mockup */}
            <div className="lg:col-span-6">
              <div className="p-6 bg-amber-50 rounded-3xl border-2 border-stone-900 shadow-brutal space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900/10">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Saved Recipe</span>
                    <h4 className="font-display font-black text-lg text-stone-950">Auntie Lola&apos;s Party Rice</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-800 text-[10px] font-black uppercase">
                    All In Stock
                  </span>
                </div>
                <div className="text-xs text-stone-700 space-y-1.5 font-semibold">
                  <div><span className="text-stone-400">Base:</span> Smoky Parboiled Rice</div>
                  <div><span className="text-stone-400">Proteins:</span> Peppered Turkey + Fried Beef</div>
                  <div><span className="text-stone-400">Sides:</span> Fried Dodo + Coleslaw</div>
                </div>
                <div className="pt-2">
                  <span className="w-full py-2 bg-amber-300 text-stone-900 text-xs font-black uppercase tracking-wider rounded-xl border border-stone-900 shadow-brutal-xs flex items-center justify-center gap-1.5">
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
