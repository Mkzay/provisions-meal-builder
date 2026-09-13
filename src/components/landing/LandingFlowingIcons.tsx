"use client";

import {
  BookmarkSimple,
  Bread,
  ChefHat,
  Clock,
  Fire,
  Fish,
  ForkKnife,
  Grains,
  MagicWand,
  Package,
  Plant,
  Sparkle,
} from "@/components/icons";
import { motion, TargetAndTransition } from "framer-motion";
import React from "react";

interface FlowingToken {
  id: string;
  label: string;
  icon: React.ReactNode;
  bg: string;
  textColor: string;
  pos: string;
  floatAnim: TargetAndTransition;
}

const FLOWING_TOKENS: FlowingToken[] = [
  {
    id: "fire",
    label: "Smoky Firewood",
    icon: <Fire size={14} weight="duotone" className="text-amber-800" />,
    bg: "bg-[#FEF08A]",
    textColor: "text-amber-950",
    pos: "top-[8%] left-[3%] lg:left-[5%]",
    floatAnim: {
      y: [0, -12, 0],
      rotate: [-4, 3, -4],
      transition: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  {
    id: "greens",
    label: "Fresh Ugwu",
    icon: <Plant size={14} weight="duotone" className="text-emerald-800" />,
    bg: "bg-[#A7F3D0]",
    textColor: "text-emerald-950",
    pos: "top-[18%] right-[4%] lg:right-[7%]",
    floatAnim: {
      y: [0, 14, 0],
      rotate: [3, -5, 3],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
    },
  },
  {
    id: "fish",
    label: "Catfish Broth",
    icon: <Fish size={14} weight="duotone" className="text-sky-800" />,
    bg: "bg-[#BAE6FD]",
    textColor: "text-sky-950",
    pos: "top-[36%] left-[2%] lg:left-[4%]",
    floatAnim: {
      y: [0, -15, 0],
      rotate: [-5, 4, -5],
      transition: { duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1 },
    },
  },
  {
    id: "grains",
    label: "Honey Beans",
    icon: <Grains size={14} weight="duotone" className="text-amber-900" />,
    bg: "bg-[#FED7AA]",
    textColor: "text-amber-950",
    pos: "top-[48%] right-[3%] lg:right-[6%]",
    floatAnim: {
      y: [0, 12, 0],
      rotate: [4, -3, 4],
      transition: { duration: 6.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
    },
  },
  {
    id: "bread",
    label: "Agege Loaf",
    icon: <Bread size={14} weight="duotone" className="text-orange-800" />,
    bg: "bg-[#FDE68A]",
    textColor: "text-orange-950",
    pos: "top-[64%] left-[4%] lg:left-[6%]",
    floatAnim: {
      y: [0, -10, 0],
      rotate: [-3, 5, -3],
      transition: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
    },
  },
  {
    id: "pairing",
    label: "Zero Guesswork",
    icon: <MagicWand size={14} weight="duotone" className="text-purple-800" />,
    bg: "bg-[#DDD6FE]",
    textColor: "text-purple-950",
    pos: "top-[78%] right-[4%] lg:right-[8%]",
    floatAnim: {
      y: [0, 14, 0],
      rotate: [5, -4, 5],
      transition: { duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
    },
  },
  {
    id: "speed",
    label: "30s Decisions",
    icon: <Clock size={14} weight="duotone" className="text-rose-800" />,
    bg: "bg-[#FECDD3]",
    textColor: "text-rose-950",
    pos: "top-[92%] left-[3%] lg:left-[7%]",
    floatAnim: {
      y: [0, -12, 0],
      rotate: [-4, 3, -4],
      transition: { duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
    },
  },
];

export const LandingFlowingIcons: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-10"
    >
      {FLOWING_TOKENS.map((token) => (
        <motion.div
          key={token.id}
          animate={token.floatAnim}
          className={`absolute ${token.pos} hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 border-stone-900 shadow-brutal-xs text-[10px] font-black uppercase tracking-wider ${token.bg} ${token.textColor} opacity-85 hover:opacity-100 transition-opacity`}
        >
          {token.icon}
          <span>{token.label}</span>
        </motion.div>
      ))}

      {/* Scattered Ambient Sparkles */}
      <motion.div
        animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-[25%] left-[12%] text-amber-500 opacity-30 hidden md:block"
      >
        <Sparkle size={20} weight="fill" />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        className="absolute top-[55%] right-[14%] text-emerald-500 opacity-35 hidden md:block"
      >
        <Sparkle size={24} weight="fill" />
      </motion.div>
      <motion.div
        animate={{ scale: [0.9, 1.25, 0.9], rotate: [0, 90, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[85%] right-[20%] text-rose-400 opacity-25 hidden md:block"
      >
        <Sparkle size={18} weight="fill" />
      </motion.div>
    </div>
  );
};
