"use client";

import { List, Sparkle, X } from "@/components/icons";
import { ProvisionsLogo } from "@/components/ProvisionsLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatePresence, motion, type Variants } from "framer-motion";
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const header = document.querySelector("header");
        const headerHeight = header ? header.getBoundingClientRect().height : 64;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 16;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
        if (window.history?.replaceState) {
          window.history.replaceState(null, "", href);
        }
      }
    }
  };

  const menuContainerVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        height: { type: "spring", stiffness: 320, damping: 28 },
        opacity: { duration: 0.2 },
        staggerChildren: 0.05,
        delayChildren: 0.03,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.2 },
        opacity: { duration: 0.15 },
      },
    },
  };

  const menuItemVariants: Variants = {
    hidden: { opacity: 0, x: -14 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 350, damping: 25 },
    },
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-50/95 dark:bg-[#141210]/95 backdrop-blur-md border-b-2 border-stone-900 dark:border-stone-700 transition-colors pt-[max(1.125rem,env(safe-area-inset-top,20px))] pb-2.5 sm:pb-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0">
          <ProvisionsLogo className="w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                Provisions
              </span>
              <span className="hidden sm:inline-flex text-[9px] uppercase font-black px-1.5 py-0.5 rounded-md bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 border border-stone-900 dark:border-stone-700 text-emerald-950 leading-none shrink-0">
                Nigerian Kitchen
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-stone-500 dark:text-stone-400 font-bold tracking-tight">
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
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-xs font-black text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white uppercase tracking-wider transition-colors hover:underline decoration-amber-400 decoration-2 underline-offset-4 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTAs & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Distinctive Colorful Sign In & Sign Up Buttons */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-xl bg-emerald-200 hover:bg-emerald-300 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:text-emerald-200 text-emerald-950 text-xs font-black uppercase tracking-wider border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.97] transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs font-black uppercase tracking-wider border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.97] transition-all"
          >
            Sign Up
          </Link>
          <Link
            href="/app"
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-300 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300 text-stone-900 dark:text-stone-950 text-[11px] sm:text-xs font-black uppercase tracking-wider border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.97] transition-all flex items-center gap-1 shrink-0"
          >
            <span>Launch</span>
            <span className="hidden xs:inline">App</span>
            <span className="text-xs sm:text-sm">→</span>
          </Link>

          {/* Mobile & Tablet Hamburger Toggle - Guaranteed visible & shrink-proof */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-brutal-xs dark:shadow-brutal-dark-sm active:translate-x-0.5 active:translate-y-0.5 transition-transform flex items-center justify-center shrink-0"
          >
            <motion.div animate={{ rotate: isMobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
              {isMobileMenuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Animated Slide-down Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden border-t-2 border-stone-900 dark:border-stone-700 bg-amber-50/98 dark:bg-stone-900/98 backdrop-blur-lg px-4 py-4 overflow-hidden mt-2.5 shadow-brutal dark:shadow-brutal-dark"
          >
            <div className="flex flex-col gap-2 max-w-md mx-auto">
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  variants={menuItemVariants}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3.5 py-2.5 rounded-xl border-2 border-stone-900/40 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-amber-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 text-xs font-black uppercase tracking-wider shadow-brutal-xs dark:shadow-brutal-dark-sm active:scale-[0.99] transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>{link.label}</span>
                  <span className="text-stone-400 dark:text-stone-500 text-sm">→</span>
                </motion.a>
              ))}

              <motion.div variants={menuItemVariants} className="pt-2 border-t border-stone-900/20 dark:border-stone-700/60 flex flex-col gap-2">
                <Link
                  href="/app"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Launch Provisions App</span>
                  <span>→</span>
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-emerald-200 hover:bg-emerald-300 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-950 dark:text-emerald-200 font-black text-xs uppercase tracking-wider border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm active:scale-[0.99] transition-all block"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-black text-xs uppercase tracking-wider border-2 border-stone-900 dark:border-stone-700 shadow-brutal-xs dark:shadow-brutal-dark-sm active:scale-[0.99] transition-all block"
                  >
                    Sign Up
                  </Link>
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 dark:text-stone-400 px-1 pt-1">
                  <span>Provisions Intelligence</span>
                  <span>v1.0 Nigerian Cuisine</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
