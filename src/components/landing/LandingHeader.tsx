"use client";

import Link from "next/link";
import React from "react";

export const LandingHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md border-b-2 border-stone-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-stone-900 shadow-brutal-xs flex items-center justify-center font-display font-black text-stone-900 text-lg group-hover:rotate-6 transition-transform">
            🍲
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl tracking-tight text-stone-900">
                Provisions
              </span>
              <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md bg-emerald-200 border border-stone-900 text-emerald-950">
                Nigerian Kitchen
              </span>
            </div>
            <span className="text-[10px] text-stone-500 font-bold tracking-tight">
              Zero-Friction Meal Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#blueprints"
            className="text-xs font-black text-stone-700 hover:text-stone-950 transition-colors uppercase tracking-wider"
          >
            Blueprints
          </a>
          <a
            href="#demo"
            className="text-xs font-black text-stone-700 hover:text-stone-950 transition-colors uppercase tracking-wider"
          >
            Interactive Demo
          </a>
          <a
            href="#features"
            className="text-xs font-black text-stone-700 hover:text-stone-950 transition-colors uppercase tracking-wider"
          >
            Features
          </a>
          <a
            href="#personal-recipes"
            className="text-xs font-black text-stone-700 hover:text-stone-950 transition-colors uppercase tracking-wider"
          >
            Saved Recipes
          </a>
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-3 py-2 text-xs font-black text-stone-800 hover:text-stone-950 uppercase tracking-wider transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/app"
            className="px-4 py-2 rounded-xl bg-amber-300 hover:bg-amber-400 text-stone-900 text-xs font-black uppercase tracking-wider border-2 border-stone-900 shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.97] transition-all flex items-center gap-1.5"
          >
            <span>Launch App</span>
            <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
