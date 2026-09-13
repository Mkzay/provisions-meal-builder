"use client";

import { ProvisionsLogo } from "@/components/ProvisionsLogo";
import React from "react";

interface PulsingLogoLoaderProps {
  label?: string;
  sublabel?: string;
  fullscreen?: boolean;
}

export const PulsingLogoLoader: React.FC<PulsingLogoLoaderProps> = ({
  label = "Opening your kitchen...",
  sublabel = "Checking in-stock ingredients & pantry staples",
  fullscreen = true,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 text-center px-4 select-none">
      {/* Pulsing Logo Container */}
      <div className="relative flex items-center justify-center">
        {/* Soft background pulse halo */}
        <div className="absolute w-20 h-20 rounded-3xl bg-amber-300/40 animate-ping opacity-60 pointer-events-none" />
        <div className="relative animate-pulse">
          <ProvisionsLogo size={64} className="w-16 h-16 shadow-brutal-md" />
        </div>
      </div>

      {/* Loading Labels */}
      <div className="space-y-1">
        <h4 className="font-display font-black text-base sm:text-lg text-stone-900 tracking-tight">
          {label}
        </h4>
        {sublabel && (
          <p className="text-xs text-stone-600 font-medium max-w-xs mx-auto">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF8F5]/95 backdrop-blur-xs"
        role="status"
        aria-live="polite"
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className="w-full py-12 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      {content}
    </div>
  );
};
