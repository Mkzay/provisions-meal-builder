"use client";

import { Desktop, MoonStars, Sun } from "@/components/icons";
import { Theme, useTheme } from "@/lib/theme-context";
import React, { useEffect, useState } from "react";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 ${className}`}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`p-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-amber-300 shadow-brutal-xs hover:bg-stone-50 dark:hover:bg-stone-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center ${className}`}
    >
      {isDark ? (
        <Sun size={18} weight="bold" className="text-amber-400" />
      ) : (
        <MoonStars size={18} weight="bold" className="text-stone-800" />
      )}
    </button>
  );
};

export const ThemeSegmentedControl: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-full h-10 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border-2 border-stone-900 dark:border-stone-700 animate-pulse ${className}`}
      />
    );
  }

  const options: Array<{
    id: Theme;
    label: string;
    icon: (isActive: boolean) => React.ReactNode;
  }> = [
    {
      id: "light",
      label: "Light",
      icon: (isActive) => (
        <Sun
          size={14}
          weight={isActive ? "fill" : "bold"}
          className={isActive ? "text-stone-950" : "text-amber-500 dark:text-amber-400"}
        />
      ),
    },
    {
      id: "dark",
      label: "Dark",
      icon: (isActive) => (
        <MoonStars
          size={14}
          weight={isActive ? "fill" : "bold"}
          className={isActive ? "text-stone-950" : "text-indigo-500 dark:text-indigo-400"}
        />
      ),
    },
    {
      id: "system",
      label: "System",
      icon: (isActive) => (
        <Desktop
          size={14}
          weight={isActive ? "fill" : "bold"}
          className={isActive ? "text-stone-950" : "text-sky-500 dark:text-sky-400"}
        />
      ),
    },
  ];

  return (
    <div
      className={`grid grid-cols-3 gap-1 p-1 bg-stone-200/70 dark:bg-stone-800/90 rounded-2xl border-2 border-stone-900 dark:border-stone-700 shadow-brutal-2xs dark:shadow-brutal-dark-xs ${className}`}
    >
      {options.map((opt) => {
        const isActive = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            className={`py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 ${
              isActive
                ? "bg-amber-300 dark:bg-amber-400 text-stone-950 border border-stone-900 dark:border-stone-950 shadow-xs"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            {opt.icon(isActive)}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
