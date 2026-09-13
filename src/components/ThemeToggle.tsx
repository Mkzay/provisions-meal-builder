"use client";

import { MoonStars, SunHorizon } from "@/components/icons";
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
        <SunHorizon size={18} weight="duotone" className="text-amber-400" />
      ) : (
        <MoonStars size={18} weight="duotone" className="text-stone-800" />
      )}
    </button>
  );
};

export const ThemeSegmentedControl: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const options: Array<{ id: Theme; label: string; icon: string }> = [
    { id: "light", label: "Light", icon: "☀️" },
    { id: "dark", label: "Dark", icon: "🌙" },
    { id: "system", label: "System", icon: "💻" },
  ];

  return (
    <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl border-2 border-stone-900 dark:border-stone-700">
      {options.map((opt) => {
        const isActive = theme === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              isActive
                ? "bg-amber-300 dark:bg-amber-400 text-stone-950 border border-stone-900 shadow-xs"
                : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            }`}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
