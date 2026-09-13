"use client";

import { LandingHeroIllustration } from "@/components/landing/LandingHeroIllustration";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export const LandingHero: React.FC = () => {
  const handleScrollToDemo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("demo");
    if (!element) return;
    const header = document.querySelector("header");
    const headerHeight = header ? header.getBoundingClientRect().height : 64;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - 16;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: "smooth",
    });

    if (window.history?.replaceState) {
      window.history.replaceState(null, "", "#demo");
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 border-b-2 border-stone-900 dark:border-stone-700 bg-amber-50/40 dark:bg-[#141210]">
      {/* Subtle retro dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#1c1917 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Fun Background Culinary SVG Illustration for Mobile & iPad */}
      <div className="absolute -right-12 top-6 sm:-right-6 sm:top-8 md:right-4 md:top-6 w-72 h-72 sm:w-96 sm:h-96 opacity-20 sm:opacity-25 dark:opacity-15 lg:hidden pointer-events-none -z-0">
        <LandingHeroIllustration isBackgroundWatermark />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-12 items-center">
          {/* Left Column: Copy, CTAs, and Stats (7 Cols on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 text-center sm:text-left z-10"
          >
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-amber-200 dark:bg-amber-950/80 border-2 border-stone-900 dark:border-stone-700 text-stone-900 dark:text-amber-300 text-[11px] sm:text-xs font-black shadow-brutal-xs dark:shadow-brutal-dark-sm mb-5 sm:mb-6"
            >
              <span>🇳🇬</span>
              <span className="truncate">The Intelligent Nigerian Kitchen Companion</span>
            </motion.div>

            {/* Main Headline with Animated Reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-display font-black text-3xl sm:text-5xl lg:text-5xl xl:text-6xl text-stone-950 dark:text-stone-100 tracking-tight leading-[1.12] mb-5 sm:mb-6 break-words"
            >
              Cook what you actually have.{" "}
              <motion.span
                animate={{ rotate: [-1.5, 0.5, -1.5], scale: [1, 1.02, 1] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="bg-amber-300 dark:bg-amber-400 text-stone-950 px-2 py-0.5 border-2 border-stone-900 dark:border-stone-700 inline-block shadow-brutal-xs dark:shadow-brutal-dark-sm rotate-[-1deg] mt-1 sm:mt-0"
              >
                Zero guesswork.
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg lg:text-xl text-stone-700 dark:text-stone-300 font-medium leading-relaxed mb-8 max-w-2xl mx-auto sm:mx-0">
              Provisions checks what’s stocked in your fridge right now, applies authentic Nigerian culinary blueprints, and serves you balanced combinations in seconds. No repetitive meals. No forgotten leftovers.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-10 sm:mb-12">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/app"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-stone-950 text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-stone-900 dark:border-stone-700 shadow-brutal dark:shadow-brutal-dark hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>Launch App &amp; Start Cooking</span>
                  <span className="text-base">→</span>
                </Link>
              </motion.div>

              <motion.a
                href="#demo"
                onClick={handleScrollToDemo}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-black uppercase tracking-wider border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm hover:shadow-none active:scale-[0.98] transition-all text-center flex items-center justify-center cursor-pointer"
              >
                Try Interactive Demo ↓
              </motion.a>
            </div>

            {/* Value Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-6 border-t-2 border-stone-900/10 dark:border-stone-800">
              <div className="p-3 sm:p-3.5 bg-white dark:bg-stone-900 rounded-xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm text-center sm:text-left">
                <span className="block font-display font-black text-2xl sm:text-3xl text-stone-900 dark:text-amber-400">
                  15
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-tight">
                  Dish Blueprints
                </span>
              </div>
              <div className="p-3 sm:p-3.5 bg-white dark:bg-stone-900 rounded-xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm text-center sm:text-left">
                <span className="block font-display font-black text-2xl sm:text-3xl text-stone-900 dark:text-emerald-400">
                  100%
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-tight">
                  In-Stock Match
                </span>
              </div>
              <div className="p-3 sm:p-3.5 bg-white dark:bg-stone-900 rounded-xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm text-center sm:text-left">
                <span className="block font-display font-black text-2xl sm:text-3xl text-stone-900 dark:text-sky-400">
                  &lt; 30s
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-tight">
                  Decision Time
                </span>
              </div>
              <div className="p-3 sm:p-3.5 bg-white dark:bg-stone-900 rounded-xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm text-center sm:text-left">
                <span className="block font-display font-black text-2xl sm:text-3xl text-stone-900 dark:text-rose-400">
                  0
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-tight">
                  Wasted Leftovers
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Free-Standing Animated Culinary Illustration (No Card Container) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex lg:col-span-5 items-center justify-center relative p-4"
          >
            <div className="relative w-full max-w-[420px] flex items-center justify-center">
              <LandingHeroIllustration className="w-full h-auto drop-shadow-md" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
