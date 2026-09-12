"use client";

import React from "react";

interface ProvisionsLogoProps {
  className?: string;
  size?: number;
}

/**
 * Bespoke neo-brutalist brand mark for Provisions.
 * Features a tactile butter-yellow canvas, ink-contour silhouette,
 * bold architectural "P", and a fresh culinary emerald leaf sprout.
 */
export const ProvisionsLogo: React.FC<ProvisionsLogoProps> = ({
  className = "w-9 h-9 sm:w-10 sm:h-10",
  size,
}) => {
  const customDimensions = size ? { width: size, height: size } : undefined;

  return (
    <div
      className={`relative rounded-xl sm:rounded-2xl bg-amber-200 border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 active:scale-95 select-none ${className}`}
      style={customDimensions}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[82%] h-[82%]"
      >
        {/* Subtle inner kitchen grid / warmth highlight */}
        <circle cx="24" cy="24" r="18" fill="#FEF9C3" opacity="0.6" />

        {/* The Bold Architectural "P" Body */}
        {/* Stem: x=10, y=7 to y=41 (rounded cap) */}
        {/* Bowl: x=10 to x=36, y=7 to y=29 with inner cutout */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 11C10 8.79086 11.7909 7 14 7H26C32.0751 7 37 11.9249 37 18C37 24.0751 32.0751 29 26 29H17.5V38C17.5 40.2091 15.7091 42 13.5 42H13C11.3431 42 10 40.6569 10 39V11ZM17.5 13.5V22.5H25.5C27.9853 22.5 30 20.4853 30 18C30 15.5147 27.9853 13.5 25.5 13.5H17.5Z"
          fill="#1C1917"
        />

        {/* Culinary Sprout nestled inside the "P" bowl: vibrant nourishing leaves */}
        {/* Primary Leaf */}
        <path
          d="M21 21C21 16 25 13.5 29 13.5C29 17.5 26.5 21 21 21Z"
          fill="#10B981"
          stroke="#1C1917"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Secondary Fresh Sprout Leaf */}
        <path
          d="M22 19C20 16.5 19 14.5 20.5 12.5C22.8 12.5 24 15.5 22 19Z"
          fill="#6EE7B7"
          stroke="#1C1917"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Leaf Rib Accent */}
        <path
          d="M22 20.5C24 18 26.5 16 28 14.5"
          stroke="#065F46"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Vitality Sparkle Accent at the top-right corner of the P */}
        <path
          d="M38 8L39 11L42 12L39 13L38 16L37 13L34 12L37 11L38 8Z"
          fill="#F59E0B"
          stroke="#1C1917"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
};
