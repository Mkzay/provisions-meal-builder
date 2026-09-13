"use client";

import Link from "next/link";
import React from "react";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-100 border-t-2 border-stone-900">
      {/* Pre-Footer Action Banner */}
      <div className="bg-amber-300 text-stone-950 py-12 sm:py-16 border-b-2 border-stone-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block text-xs font-black uppercase tracking-wider bg-white px-3 py-1 rounded-full border-2 border-stone-900 shadow-brutal-xs">
            Start Right Now
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-tight">
            Your kitchen is already stocked. <br className="hidden sm:block" />
            Let&apos;s build tonight&apos;s dinner.
          </h2>
          <p className="text-stone-800 text-sm sm:text-base font-semibold max-w-xl mx-auto">
            No grocery runs required. See your in-stock staples come together in an authentic Nigerian meal within 30 seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-500 text-stone-950 text-sm font-black uppercase tracking-wider border-2 border-stone-900 shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.98] transition-all"
            >
              <span>Launch Provisions App</span>
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-black text-sm">
              🍲
            </div>
            <div>
              <span className="font-display font-black text-base tracking-tight text-white block">
                Provisions
              </span>
              <span className="text-[11px] text-stone-400 font-medium">
                Authentic Nigerian Kitchen Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-stone-300">
            <a href="#blueprints" className="hover:text-amber-300 transition-colors">
              Blueprints
            </a>
            <a href="#demo" className="hover:text-amber-300 transition-colors">
              Live Demo
            </a>
            <a href="#features" className="hover:text-amber-300 transition-colors">
              Features
            </a>
            <Link href="/login" className="hover:text-amber-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
          <span>&copy; {new Date().getFullYear()} Provisions. Designed for real households.</span>
          <span>Crafted with authentic Nigerian culinary wisdom.</span>
        </div>
      </div>
    </footer>
  );
};
