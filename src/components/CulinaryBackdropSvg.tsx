"use client";

import React from "react";

export const CulinaryBackdropSvg: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-[0.07]"
    >
      <svg
        className="w-full h-full object-cover text-stone-900"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Top Left: Skillet & Steam */}
        <g transform="translate(80, 70)">
          <circle cx="45" cy="45" r="32" />
          <path d="M72 65 L105 95" strokeWidth="3.5" />
          <path d="M40 22 C40 16 48 14 44 8" strokeDasharray="3 3" />
          <path d="M50 24 C50 18 58 16 54 10" strokeDasharray="3 3" />
          <circle cx="45" cy="45" r="14" strokeDasharray="4 4" />
        </g>

        {/* Top Center-Left: Rolling Pin */}
        <g transform="translate(360, 60) rotate(25)">
          <rect x="25" y="10" width="85" height="22" rx="4" />
          <path d="M8 21 L25 21" strokeWidth="3.5" />
          <path d="M110 21 L127 21" strokeWidth="3.5" />
        </g>

        {/* Top Right: Chef Knife & Board */}
        <g transform="translate(920, 70) rotate(-15)">
          <rect x="0" y="0" width="110" height="75" rx="8" />
          <circle cx="15" cy="38" r="6" />
          <path d="M30 18 L85 18 C95 18 100 28 95 38 L30 38 Z" fill="currentColor" fillOpacity="0.05" />
          <path d="M12 28 L30 28" strokeWidth="3.5" />
        </g>

        {/* Middle Far-Left: Salt & Pepper */}
        <g transform="translate(60, 410)">
          <path d="M15 25 L35 25 L32 65 L18 65 Z" />
          <path d="M18 14 L32 14 L35 25 L15 25 Z" />
          <circle cx="22" cy="18" r="1" fill="currentColor" />
          <circle cx="25" cy="18" r="1" fill="currentColor" />
          <circle cx="28" cy="18" r="1" fill="currentColor" />
          <text x="21" y="48" fontSize="11" fontWeight="900" fill="currentColor" stroke="none">S</text>
        </g>

        {/* Middle Far-Right: Steaming Soup Bowl */}
        <g transform="translate(1000, 380)">
          <path d="M15 35 C15 65 75 65 75 35 Z" />
          <path d="M10 35 L80 35" strokeWidth="3" />
          <path d="M30 70 L60 70" strokeWidth="3" />
          <path d="M32 24 C32 15 40 14 36 6" strokeDasharray="3 3" />
          <path d="M45 22 C45 13 53 12 49 4" strokeDasharray="3 3" />
          <path d="M58 24 C58 15 66 14 62 6" strokeDasharray="3 3" />
        </g>

        {/* Bottom Left: Coffee Mug & Croissant */}
        <g transform="translate(100, 700)">
          <rect x="20" y="25" width="45" height="42" rx="6" />
          <path d="M65 34 C76 34 76 54 65 54" strokeWidth="3" />
          <path d="M36 17 C36 10 42 10 39 3" strokeDasharray="2 2" />
          <path d="M48 17 C48 10 54 10 51 3" strokeDasharray="2 2" />
          <path d="M15 70 L70 70" strokeWidth="3" />
          <path d="M85 55 C80 35 110 30 115 50 C118 60 90 65 85 55 Z" />
        </g>

        {/* Bottom Center: Whisk & Fork-Knife */}
        <g transform="translate(520, 750)">
          <g transform="rotate(45)">
            <ellipse cx="40" cy="20" rx="14" ry="22" />
            <path d="M40 0 L40 42" />
            <path d="M28 20 C28 35 52 35 52 20" />
            <path d="M40 42 L40 85" strokeWidth="3.5" />
          </g>
          <g transform="translate(70, -10) rotate(-35)">
            <path d="M20 15 L20 40 L28 40 L28 15" />
            <path d="M24 15 L24 35" />
            <path d="M24 40 L24 85" strokeWidth="3" />
          </g>
        </g>

        {/* Bottom Right: Olive Oil Bottle & Garlic */}
        <g transform="translate(940, 680)">
          <path d="M35 30 L45 30 L52 48 L52 90 L28 90 L28 48 Z" />
          <rect x="37" y="18" width="6" height="12" />
          <path d="M35 18 L45 18" strokeWidth="3" />
          <circle cx="40" cy="65" r="7" strokeDasharray="3 3" />
          <path d="M75 75 C68 62 82 52 88 62 C95 52 108 62 102 75 C100 84 78 84 75 75 Z" />
          <path d="M88 56 L88 50" strokeWidth="2.5" />
        </g>

        {/* Scattered Sparkles */}
        <g transform="translate(260, 220)">
          <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" fill="currentColor" />
        </g>
        <g transform="translate(860, 260)">
          <path d="M12 0 L15 9 L24 12 L15 15 L12 24 L9 15 L0 12 L9 9 Z" fill="currentColor" />
        </g>
        <g transform="translate(320, 640)">
          <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="currentColor" />
        </g>
        <g transform="translate(820, 600)">
          <path d="M10 0 L12 7 L20 10 L12 13 L10 20 L8 13 L0 10 L8 7 Z" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
};
