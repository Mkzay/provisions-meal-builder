"use client";

import { ChefHat, MagicWand, Sparkle } from "@/components/icons";
import { motion } from "framer-motion";
import React from "react";

interface ModeSelectProps {
  onSuggestForMe: () => void;
  onManualPick: () => void;
  availableMainsCount: number;
}

export const ModeSelect: React.FC<ModeSelectProps> = ({
  onSuggestForMe,
  onManualPick,
  availableMainsCount,
}) => {
  return (
    <div className="w-full space-y-4">

      <div className="px-1">
        <h3 className="text-2xl sm:text-3xl font-display font-black text-stone-900 tracking-tight">
          How do you want to choose today?
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
          Pick whichever matches your mood and energy level right now.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {/* Option 1: Suggest for me */}
        <motion.button
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => {
            if (typeof window !== "undefined" && window.navigator?.vibrate) {
              window.navigator.vibrate(15);
            }
            onSuggestForMe();
          }}
          aria-label="Suggest for me: Zero decision mode where the kitchen automatically selects a balanced pairing"
          className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border-[2.5px] border-stone-900 bg-[#FEF08A] text-left shadow-brutal hover:shadow-brutal-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-brutal-pressed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-900 focus-visible:ring-offset-2 transition-all"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-stone-900 text-stone-900 mb-4 shadow-brutal-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <MagicWand size={30} weight="duotone" className="text-amber-700" />
            </div>

            <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 bg-white/80 px-2.5 py-0.5 rounded-md border border-stone-900/40 inline-block mb-2">
              Zero Decision Mode
            </span>
            <h4 className="text-xl sm:text-2xl font-display font-black text-stone-900 tracking-tight">
              Suggest for me
            </h4>
            <p className="text-xs sm:text-sm text-stone-800 font-medium mt-1.5 leading-relaxed">
              Take a deep breath and let the kitchen decide. We&apos;ll automatically select a balanced main &amp; protein pairing.
            </p>
          </div>

          <div className="mt-6 pt-3.5 border-t-2 border-stone-900/20 w-full flex items-center justify-between text-xs font-black text-stone-900">
            <span>Surprise me with a meal</span>
            <span className="text-sm font-black group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </motion.button>

        {/* Option 2: I'll pick */}
        <motion.button
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => {
            if (typeof window !== "undefined" && window.navigator?.vibrate) {
              window.navigator.vibrate(12);
            }
            onManualPick();
          }}
          aria-label="I'll pick: Craving mode to browse available mains and choose custom pairings"
          className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border-[2.5px] border-stone-900 bg-[#A7F3D0] text-left shadow-brutal hover:shadow-brutal-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-brutal-pressed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-900 focus-visible:ring-offset-2 transition-all"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white border-2 border-stone-900 text-stone-900 mb-4 shadow-brutal-sm flex items-center justify-center group-hover:scale-105 transition-transform">
              <ChefHat size={30} weight="duotone" className="text-emerald-800" />
            </div>

            <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 bg-white/80 px-2.5 py-0.5 rounded-md border border-stone-900/40 inline-block mb-2">
              Craving Mode
            </span>
            <h4 className="text-xl sm:text-2xl font-display font-black text-stone-900 tracking-tight">
              I&apos;ll pick
            </h4>
            <p className="text-xs sm:text-sm text-stone-800 font-medium mt-1.5 leading-relaxed">
              Have a specific taste in mind? Browse your {availableMainsCount} available mains and we&apos;ll match the sides.
            </p>
          </div>

          <div className="mt-6 pt-3.5 border-t-2 border-stone-900/20 w-full flex items-center justify-between text-xs font-black text-stone-900">
            <span>Browse pantry mains</span>
            <span className="text-sm font-black group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
};
