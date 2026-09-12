"use client";

import {
  BowlFood,
  Coffee,
  Cookie,
  CookingPot,
  Egg,
  Eye,
  EyeSlash,
  Heart,
  Sparkle,
  Sun,
} from "@/components/icons";
import { CulinaryBackdropSvg } from "@/components/CulinaryBackdropSvg";
import { ProvisionsLogo } from "@/components/ProvisionsLogo";
import { motion, TargetAndTransition } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

// Wonky "Provision" brand letters
const WONKY_LETTERS = [
  { char: "P", rotate: "-rotate-6", bg: "bg-[#FEF08A]", textColor: "text-amber-950", delay: 0.04 },
  { char: "R", rotate: "rotate-3", bg: "bg-[#A7F3D0]", textColor: "text-emerald-950", delay: 0.08 },
  { char: "O", rotate: "-rotate-3", bg: "bg-[#FECDD3]", textColor: "text-rose-950", delay: 0.12 },
  { char: "V", rotate: "rotate-6", bg: "bg-[#DDD6FE]", textColor: "text-purple-950", delay: 0.16 },
  { char: "I", rotate: "-rotate-2", bg: "bg-[#FEF08A]", textColor: "text-amber-950", delay: 0.2 },
  { char: "S", rotate: "rotate-4", bg: "bg-[#A7F3D0]", textColor: "text-emerald-950", delay: 0.24 },
  { char: "I", rotate: "-rotate-4", bg: "bg-[#FECDD3]", textColor: "text-rose-950", delay: 0.28 },
  { char: "O", rotate: "rotate-2", bg: "bg-[#DDD6FE]", textColor: "text-purple-950", delay: 0.32 },
  { char: "N", rotate: "-rotate-6", bg: "bg-[#FEF08A]", textColor: "text-amber-950", delay: 0.36 },
];

interface StickerItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  bg: string;
  textColor: string;
  pos: string;
  floatAnim: TargetAndTransition;
}

// Floating Culinary Stickers (responsive on mobile & desktop)
const STICKERS: StickerItem[] = [
  {
    id: "pot",
    label: "Fresh Provisions",
    shortLabel: "Fresh Eats",
    icon: <CookingPot size={16} weight="duotone" className="text-emerald-800 shrink-0" />,
    bg: "bg-[#A7F3D0]",
    textColor: "text-emerald-950",
    pos: "top-3 -left-2 sm:top-12 sm:left-8 md:left-20 lg:left-32",
    floatAnim: {
      y: [0, -10, 0],
      rotate: [-5, 1, -5],
      transition: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
    },
  },
  {
    id: "egg",
    label: "Morning Fuel",
    shortLabel: "Fuel Up",
    icon: <Egg size={16} weight="duotone" className="text-amber-800 shrink-0" />,
    bg: "bg-[#FEF08A]",
    textColor: "text-amber-950",
    pos: "top-4 -right-2 sm:top-14 sm:right-8 md:right-24 lg:right-36",
    floatAnim: {
      y: [0, 8, 0],
      rotate: [4, -2, 4],
      transition: { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
    },
  },
  {
    id: "snack",
    label: "Quick Bites",
    shortLabel: "Snack Ready",
    icon: <Cookie size={16} weight="duotone" className="text-purple-800 shrink-0" />,
    bg: "bg-[#DDD6FE]",
    textColor: "text-purple-950",
    pos: "bottom-4 -left-2 sm:bottom-14 sm:left-8 md:left-24 lg:left-40",
    floatAnim: {
      y: [0, -8, 0],
      rotate: [-3, 3, -3],
      transition: { duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
    },
  },
  {
    id: "dinner",
    label: "Comfort Dinners",
    shortLabel: "Warm Meals",
    icon: <BowlFood size={16} weight="duotone" className="text-rose-800 shrink-0" />,
    bg: "bg-[#FECDD3]",
    textColor: "text-rose-950",
    pos: "bottom-5 -right-2 sm:bottom-16 sm:right-8 md:right-20 lg:right-36",
    floatAnim: {
      y: [0, 10, 0],
      rotate: [3, -3, 3],
      transition: { duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
    },
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password) {
      setErrorMessage("Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        username: username.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("Invalid username or password");
        setIsLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 bg-[#FAF8F5] overflow-hidden select-none">
      {/* 1. Transparent Culinary Backdrop SVG */}
      <CulinaryBackdropSvg />

      {/* 2. Neo-brutalist Dotted Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] z-0"
        style={{
          backgroundImage: "radial-gradient(#1C1917 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 3. Warm Ambient Center Glow */}
      <div className="absolute w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] rounded-full bg-amber-200/40 blur-3xl pointer-events-none z-0" />

      {/* 4. Floating Kitchen Stickers (Active on both Mobile & Desktop) */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto overflow-hidden z-10">
        {STICKERS.map((s) => (
          <motion.div
            key={s.id}
            animate={s.floatAnim}
            className={`absolute flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm ${s.bg} ${s.textColor} font-bold text-[10px] sm:text-xs pointer-events-auto cursor-default transition-transform hover:scale-110 active:scale-95 ${s.pos}`}
          >
            {s.icon}
            <span className="tracking-wide uppercase font-black">
              <span className="inline sm:hidden">{s.shortLabel}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </span>
          </motion.div>
        ))}

        {/* Ambient Sparkles */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-8 left-1/4 text-amber-500 opacity-60"
        >
          <Sparkle size={20} weight="fill" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [-8, 8, -8] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-24 left-1/4 text-rose-400 opacity-60"
        >
          <Heart size={18} weight="fill" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-1/4 text-amber-500 opacity-60"
        >
          <Sun size={20} weight="fill" />
        </motion.div>
      </div>

      {/* 5. Wonky "Provision" Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 22 }}
        className="mb-4 sm:mb-6 z-20 flex items-center justify-center gap-1 sm:gap-1.5"
      >
        {WONKY_LETTERS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -12, rotate: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 18,
              delay: item.delay,
            }}
            whileHover={{ scale: 1.2, y: -5, rotate: 0 }}
            whileTap={{ scale: 0.9 }}
            className={`w-7 h-8 sm:w-9 sm:h-10 md:w-10 md:h-11 ${item.bg} ${item.textColor} ${item.rotate} border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm rounded-lg sm:rounded-xl flex items-center justify-center font-display font-black text-base sm:text-xl md:text-2xl transition-transform cursor-default`}
          >
            {item.char}
          </motion.div>
        ))}
      </motion.div>

      {/* 6. Login Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.15 }}
        className="w-full max-w-sm z-20"
      >
        <div className="relative p-5 sm:p-8 bg-white rounded-3xl border-[2.5px] border-stone-900 shadow-brutal-lg space-y-5 sm:space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <motion.div
              whileHover={{ rotate: [-3, 3, 0], scale: 1.08 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-1.5"
            >
              <div className="relative">
                <ProvisionsLogo size={50} />
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-stone-900"
                  title="Kitchen online"
                />
              </div>
            </motion.div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
              Sign in to access your kitchen catalogue and meals.
            </p>
          </div>

          {/* Error Alert with spring shake */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: [-8, 8, -6, 6, -3, 3, 0] }}
              transition={{ duration: 0.4 }}
              className="p-3.5 bg-rose-50 border-2 border-rose-600 rounded-2xl text-rose-950 text-xs font-black flex items-center gap-2.5 shadow-brutal-xs"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-stone-900 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-black uppercase tracking-wider text-stone-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 sm:py-3 bg-[#FAF8F5] border-2 border-stone-900 rounded-xl text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-black uppercase tracking-wider text-stone-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 sm:py-3 pr-11 bg-[#FAF8F5] border-2 border-stone-900 rounded-xl text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlash size={18} weight="bold" />
                  ) : (
                    <Eye size={18} weight="bold" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm border-2 border-stone-900 shadow-brutal transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none mt-2 flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-amber-200 text-amber-900 cursor-wait"
                  : "bg-amber-300 hover:bg-amber-400 text-amber-950"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-stone-900 border-t-transparent animate-spin shrink-0" />
                  <span>Entering Kitchen...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Kitchen</span>
                  <span>→</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Info note */}
          <div className="pt-2 border-t-2 border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-500">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Private Access
            </span>
            <span className="text-stone-400">Notion Synced</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="w-8 h-8 rounded-full border-3 border-stone-900 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

