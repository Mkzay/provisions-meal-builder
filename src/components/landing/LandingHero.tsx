"use client";

import Link from "next/link";
import React from "react";

export const LandingHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b-2 border-stone-900 bg-amber-50/50">
      {/* Subtle retro dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#1c1917 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="max-w-3xl mx-auto sm:mx-0">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-200 border-2 border-stone-900 text-stone-900 text-xs font-black shadow-brutal-xs mb-6">
            <span>🇳🇬</span>
            <span>The Intelligent Nigerian Kitchen Companion</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-stone-950 tracking-tight leading-[1.1] mb-6">
            Cook what you actually have.{" "}
            <span className="bg-amber-300 px-2 py-0.5 border-2 border-stone-900 inline-block shadow-brutal-xs rotate-[-1deg]">
              Zero guesswork.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-stone-700 font-medium leading-relaxed mb-8 max-w-2xl">
            Provisions checks what’s stocked in your fridge right now, applies authentic Nigerian culinary blueprints, and serves you balanced combinations in seconds. No repetitive meals. No forgotten leftovers.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-12">
            <Link
              href="/app"
              className="px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-stone-950 text-sm font-black uppercase tracking-wider border-2 border-stone-900 shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
            >
              <span>Launch App & Start Cooking</span>
              <span className="text-base">→</span>
            </Link>
            <a
              href="#demo"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 text-sm font-black uppercase tracking-wider border-2 border-stone-900 shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.98] transition-all text-center"
            >
              Try Interactive Demo ↓
            </a>
          </div>

          {/* Value Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t-2 border-stone-900/10">
            <div className="p-3 bg-white rounded-xl border-2 border-stone-900 shadow-brutal-xs">
              <span className="block font-display font-black text-2xl sm:text-3xl text-stone-900">
                15
              </span>
              <span className="text-[11px] font-bold text-stone-600 uppercase">
                Dish Blueprints
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border-2 border-stone-900 shadow-brutal-xs">
              <span className="block font-display font-black text-2xl sm:text-3xl text-stone-900">
                100%
              </span>
              <span className="text-[11px] font-bold text-stone-600 uppercase">
                In-Stock Match
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border-2 border-stone-900 shadow-brutal-xs">
              <span className="block font-display font-black text-2xl sm:text-3xl text-stone-900">
                &lt; 30s
              </span>
              <span className="text-[11px] font-bold text-stone-600 uppercase">
                Decision Time
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border-2 border-stone-900 shadow-brutal-xs">
              <span className="block font-display font-black text-2xl sm:text-3xl text-stone-900">
                0
              </span>
              <span className="text-[11px] font-bold text-stone-600 uppercase">
                Wasted Leftovers
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
