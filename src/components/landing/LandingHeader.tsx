"use client";

import { List, Sparkle, X } from "@/components/icons";
import { ProvisionsLogo } from "@/components/ProvisionsLogo";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

export const LandingHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Blueprints", href: "#blueprints" },
    { label: "Interactive Demo", href: "#demo" },
    { label: "Features", href: "#features" },
    { label: "Saved Recipes", href: "#personal-recipes" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-md border-b-2 border-stone-900 transition-colors pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <ProvisionsLogo className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors">
                Provisions
              </span>
              <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md bg-emerald-200 border border-stone-900 text-emerald-950 leading-none">
                Nigerian Kitchen
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-stone-500 font-bold tracking-tight">
              Zero-Friction Meal Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (Hidden below 1024px to prevent iPad portrait collisions) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-black text-stone-700 hover:text-stone-950 uppercase tracking-wider transition-colors hover:underline decoration-amber-400 decoration-2 underline-offset-4"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTAs & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/login"
            className="hidden sm:inline-block px-3 py-2 text-xs font-black text-stone-800 hover:text-stone-950 uppercase tracking-wider transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/app"
            className="px-3 sm:px-4 py-2 rounded-xl bg-amber-300 hover:bg-amber-400 text-stone-900 text-[11px] sm:text-xs font-black uppercase tracking-wider border-2 border-stone-900 shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.97] transition-all flex items-center gap-1.5"
          >
            <span>Launch App</span>
            <span className="text-sm">→</span>
          </Link>

          {/* Mobile & Tablet Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl border-2 border-stone-900 bg-white hover:bg-amber-100 text-stone-900 shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-transform flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Animated Slide-down Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden border-t-2 border-stone-900 bg-amber-50/95 backdrop-blur-md px-4 py-4 overflow-hidden"
          >
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl border border-stone-900/20 bg-white hover:bg-amber-200 text-stone-900 text-xs font-black uppercase tracking-wider shadow-xs transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-stone-400">→</span>
                </a>
              ))}
              <div className="pt-2 border-t border-stone-900/10 flex items-center justify-between">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs font-black text-stone-800 uppercase tracking-wider hover:underline"
                >
                  Existing User? Sign In
                </Link>
                <span className="text-[10px] font-bold text-stone-500">v1.0 Nigerian Cuisine</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
