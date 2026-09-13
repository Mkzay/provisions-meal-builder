"use client";

import {
  CookingPot,
  Envelope,
  Eye,
  EyeSlash,
  Heart,
  Lock,
  Sparkle,
} from "@/components/icons";
import { CulinaryBackdropSvg } from "@/components/CulinaryBackdropSvg";
import { ProvisionsLogo } from "@/components/ProvisionsLogo";
import { motion, TargetAndTransition } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

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
  icon: React.ReactNode;
  bg: string;
  textColor: string;
  pos: string;
  floatAnim: TargetAndTransition;
}

const STICKERS: StickerItem[] = [
  {
    id: "pot",
    label: "Fresh Eats",
    icon: <CookingPot size={16} weight="duotone" className="text-emerald-800 shrink-0" />,
    bg: "bg-[#A7F3D0]",
    textColor: "text-emerald-950",
    pos: "top-4 left-2 sm:top-12 sm:left-12 md:left-24",
    floatAnim: {
      y: [0, -10, 0],
      rotate: [-5, 1, -5],
      transition: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
    },
  },
  {
    id: "lock",
    label: "Private Kitchen",
    icon: <Lock size={16} weight="duotone" className="text-amber-800 shrink-0" />,
    bg: "bg-[#FEF08A]",
    textColor: "text-amber-950",
    pos: "top-8 right-3 sm:top-14 sm:right-12 md:right-28",
    floatAnim: {
      y: [0, 8, 0],
      rotate: [4, -3, 4],
      transition: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
    },
  },
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [household, setHousehold] = useState("");
  const [password, setPassword] = useState("");

  const developerEmail = "ayomikunwahab18@gmail.com";
  const mailtoLink = `mailto:${developerEmail}?subject=${encodeURIComponent(
    "Provisions Early Access Request"
  )}&body=${encodeURIComponent(
    `Hi Ayo,\n\nI would love to test Provisions for my kitchen/household!\n\nName: ${name || "[Your Name]"}\nHousehold: ${household || "[e.g. My Family]"}\nEmail: ${email || "[Your Email]"}\n\nThanks!`
  )}`;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 bg-[#FAF8F5] overflow-x-clip select-none py-10">
      <CulinaryBackdropSvg />

      {/* Retro Dotted Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] z-0"
        style={{
          backgroundImage: "radial-gradient(#1C1917 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Ambient Center Glow */}
      <div className="absolute w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] rounded-full bg-emerald-200/40 blur-3xl pointer-events-none z-0" />

      {/* Floating Kitchen Stickers */}
      <div className="absolute inset-0 pointer-events-none max-w-6xl mx-auto overflow-hidden z-10">
        {STICKERS.map((s) => (
          <motion.div
            key={s.id}
            animate={s.floatAnim}
            className={`absolute flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm ${s.bg} ${s.textColor} font-bold text-[10px] sm:text-xs pointer-events-auto cursor-default ${s.pos}`}
          >
            {s.icon}
            <span className="tracking-wide uppercase font-black">{s.label}</span>
          </motion.div>
        ))}
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-16 left-8 text-amber-500 opacity-50"
        >
          <Sparkle size={20} weight="fill" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-1/4 text-rose-500 opacity-60"
        >
          <Heart size={18} weight="fill" />
        </motion.div>
      </div>

      {/* Wonky Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 22 }}
        className="mb-4 sm:mb-6 z-20 flex items-center justify-center gap-1 sm:gap-1.5"
      >
        {WONKY_LETTERS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 18,
              delay: item.delay,
            }}
            whileHover={{ scale: 1.2, y: -5 }}
            className={`w-7 h-8 sm:w-9 sm:h-10 md:w-10 md:h-11 ${item.bg} ${item.textColor} ${item.rotate} border-2 border-stone-900 shadow-brutal-xs sm:shadow-brutal-sm rounded-lg sm:rounded-xl flex items-center justify-center font-display font-black text-base sm:text-xl md:text-2xl transition-transform cursor-default`}
          >
            {item.char}
          </motion.div>
        ))}
      </motion.div>

      {/* Main Signup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24, delay: 0.15 }}
        className="w-full max-w-md z-20"
      >
        <div className="relative p-5 sm:p-7 bg-white rounded-3xl border-[2.5px] border-stone-900 shadow-brutal-lg space-y-5">
          {/* Brand Header */}
          <div className="text-center space-y-1.5">
            <div className="flex justify-center mb-1">
              <ProvisionsLogo size={46} />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Create Your Kitchen
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Join Provisions to organize your household meals.
            </p>
          </div>

          {/* Prominent Invite-Only Developer Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-amber-100/90 border-2 border-stone-900 rounded-2xl shadow-brutal-xs space-y-2.5"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span className="text-xs font-black uppercase tracking-wide text-amber-950">
                Signup is Currently Disabled
              </span>
            </div>
            <p className="text-xs text-stone-800 font-medium leading-relaxed">
              New account registration is currently invite-only. If you would like to test Provisions for your kitchen, please reach out directly to the developer:
            </p>
            <a
              href={mailtoLink}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-400 text-stone-950 text-xs font-black border-2 border-stone-900 shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:scale-[0.98] transition-all text-center"
            >
              <Envelope size={16} weight="bold" />
              <span className="truncate">Email Developer: @{developerEmail}</span>
            </a>
          </motion.div>

          {/* Pure UI Mockup Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = mailtoLink;
            }}
            className="space-y-3 pt-1"
          >
            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-700">
                Household Name
              </label>
              <input
                type="text"
                value={household}
                onChange={(e) => setHousehold(e.target.value)}
                placeholder="e.g. The Adelekes Kitchen"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border-2 border-stone-900 rounded-xl text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase tracking-wider text-stone-700">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Esther"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border-2 border-stone-900 rounded-xl text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-black uppercase tracking-wider text-stone-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border-2 border-stone-900 rounded-xl text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-black uppercase tracking-wider text-stone-700">
                Preferred Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 bg-[#FAF8F5] border-2 border-stone-900 rounded-xl text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-500 hover:text-stone-900 transition-colors"
                >
                  {showPassword ? <EyeSlash size={16} weight="bold" /> : <Eye size={16} weight="bold" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider border-2 border-stone-900 shadow-brutal-xs bg-stone-200 text-stone-500 cursor-not-allowed flex items-center justify-center gap-2"
                title="Public signups are currently closed. Use the email link to request test access."
              >
                <span>Sign Up (Invite Only)</span>
              </button>
            </div>
          </form>

          {/* Links back to Login and Landing Page */}
          <div className="pt-3 border-t-2 border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-stone-600 gap-2">
            <span>
              Already have an account?{" "}
              <Link href="/login" className="text-stone-950 underline decoration-amber-400 decoration-2 font-black">
                Sign In
              </Link>
            </span>
            <Link href="/" className="text-stone-500 hover:text-stone-950 transition-colors text-[11px]">
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
