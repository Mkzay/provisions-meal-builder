"use client";

import { motion } from "framer-motion";
import React from "react";

interface LandingHeroIllustrationProps {
  className?: string;
  isBackgroundWatermark?: boolean;
}

/**
 * Neo-brutalist Nigerian culinary illustration featuring:
 * - A traditional bubbling cooking pot (Isasūn) with savory broth
 * - Caramelized golden dodo (fried plantain)
 * - Fresh fiery scotch bonnet pepper (ata rodo)
 * - Rising steam spirals and culinary spice badges with Framer Motion
 */
export const LandingHeroIllustration: React.FC<LandingHeroIllustrationProps> = ({
  className = "",
  isBackgroundWatermark = false,
}) => {
  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 380 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Ambient Warm Backing Glow / Plate Halo (Slow organic rotation) */}
        <motion.circle
          cx="190"
          cy="200"
          r="150"
          fill="#FEF08A"
          stroke="#1C1917"
          strokeWidth="3"
          strokeDasharray="6 6"
          opacity={isBackgroundWatermark ? 0.7 : 0.85}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          style={{ transformOrigin: "190px 200px" }}
        />

        {/* Traditional Cooking Pot Shadow */}
        <ellipse cx="190" cy="295" rx="105" ry="18" fill="#1C1917" opacity="0.18" />

        {/* --- STEAM SPIRALS (Animated) --- */}
        {!isBackgroundWatermark && (
          <g>
            <motion.path
              d="M160 145C155 125 170 110 162 90C155 75 165 60 160 45"
              stroke="#1C1917"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              animate={{ y: [0, -12, 0], opacity: [0.35, 0.9, 0.35] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <motion.path
              d="M190 140C185 118 200 102 192 82C186 68 195 52 190 38"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              animate={{ y: [0, -14, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.path
              d="M220 148C215 128 230 114 222 95C216 80 225 65 220 50"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              animate={{ y: [0, -12, 0], opacity: [0.35, 0.9, 0.35] }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.6 }}
            />
          </g>
        )}

        {/* --- THE TRADITIONAL NIGERIAN COOKING POT (Isasūn) (Animated gentle bobbing) --- */}
        <motion.g
          animate={{ y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}
        >
          {/* Pot Ears / Handles */}
          <path
            d="M60 215C50 215 42 225 45 238C48 248 58 255 72 250"
            stroke="#1C1917"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M320 215C330 215 338 225 335 238C332 248 322 255 308 250"
            stroke="#1C1917"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Pot Belly Body */}
          <path
            d="M75 195C75 265 115 305 190 305C265 305 305 265 305 195C305 185 295 180 190 180C85 180 75 185 75 195Z"
            fill="#EA580C"
            stroke="#1C1917"
            strokeWidth="6"
            strokeLinejoin="round"
          />

          {/* Pot Belly Shadow / Depth Accent */}
          <path
            d="M95 240C115 285 150 295 190 295C230 295 265 285 285 240C260 270 225 280 190 280C155 280 120 270 95 240Z"
            fill="#9A3412"
            opacity="0.6"
          />

          {/* Pot Rim & Bubbling Golden Broth */}
          <ellipse
            cx="190"
            cy="185"
            rx="115"
            ry="26"
            fill="#FDE047"
            stroke="#1C1917"
            strokeWidth="6"
          />

          {/* Savory Stew Swirl inside Pot */}
          <ellipse cx="190" cy="186" rx="98" ry="20" fill="#F97316" />
          <ellipse cx="180" cy="187" rx="75" ry="14" fill="#DC2626" opacity="0.8" />

          {/* Stew Garnish / Pepper flakes */}
          <circle cx="150" cy="186" r="4" fill="#FEF08A" stroke="#1C1917" strokeWidth="1.5" />
          <circle cx="185" cy="190" r="5" fill="#10B981" stroke="#1C1917" strokeWidth="1.5" />
          <circle cx="225" cy="185" r="4" fill="#FEF08A" stroke="#1C1917" strokeWidth="1.5" />
          <circle cx="205" cy="182" r="3" fill="#10B981" stroke="#1C1917" strokeWidth="1" />
        </motion.g>

        {/* --- CARAMELIZED FRIED PLANTAIN (Dodo) (Animated floating & rocking) --- */}
        <motion.g
          transform="translate(48, 120) rotate(-14)"
          animate={{ y: [-7, 7, -7], rotate: [-16, -8, -16] }}
          transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
        >
          <ellipse
            cx="40"
            cy="24"
            rx="38"
            ry="18"
            fill="#FBBF24"
            stroke="#1C1917"
            strokeWidth="4"
          />
          <path
            d="M12 24C18 32 62 32 68 24C60 30 20 30 12 24Z"
            fill="#B45309"
          />
          <path
            d="M22 18C28 14 52 14 58 18"
            stroke="#92400E"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="34" cy="23" r="2.5" fill="#78350F" />
          <circle cx="48" cy="22" r="2" fill="#78350F" />
        </motion.g>

        {/* --- FRESH FIERY ATA RODO (Scotch Bonnet Pepper) (Animated spicy bob) --- */}
        <motion.g
          transform="translate(265, 125) rotate(16)"
          animate={{ y: [6, -6, 6], rotate: [12, 22, 12] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        >
          <path
            d="M32 8C32 2 38 -4 46 -6"
            stroke="#1C1917"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M32 8C32 2 38 -4 46 -6"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M22 10C26 6 38 6 42 10L32 14Z"
            fill="#059669"
            stroke="#1C1917"
            strokeWidth="2"
          />
          <path
            d="M20 12C12 24 16 42 32 46C48 42 52 24 44 12C38 14 26 14 20 12Z"
            fill="#EF4444"
            stroke="#1C1917"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M26 18C22 26 24 36 32 40"
            stroke="#FCA5A5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Sparkling Culinary Star Badges (Animated twinkle) */}
        <motion.path
          d="M80 70L84 82L96 86L84 90L80 102L76 90L64 86L76 82Z"
          fill="#F59E0B"
          stroke="#1C1917"
          strokeWidth="2"
          animate={{ scale: [0.85, 1.25, 0.85], rotate: [0, 90, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          style={{ transformOrigin: "80px 86px" }}
        />
        <motion.path
          d="M310 75L313 84L322 87L313 90L310 99L307 90L298 87L307 84Z"
          fill="#10B981"
          stroke="#1C1917"
          strokeWidth="2"
          animate={{ scale: [0.85, 1.25, 0.85], rotate: [0, -90, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.7 }}
          style={{ transformOrigin: "310px 87px" }}
        />
      </svg>
    </div>
  );
};
