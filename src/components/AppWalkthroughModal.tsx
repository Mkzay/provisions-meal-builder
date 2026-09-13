"use client";

import { ArrowLeft, ArrowRight, Check, Sparkle, X } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface AppWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner?: string;
}

interface StepContent {
  badge: string;
  title: string;
  description: string;
  bullet: string;
  icon: string;
  bgAccent: string;
}

const STEPS: StepContent[] = [
  {
    badge: "Step 1 of 4",
    title: "Pick Your Meal Moment",
    description:
      "Start by tapping your meal slot—Breakfast, Lunch, or Dinner. Provisions automatically detects the time of day and prepares options that fit your routine.",
    bullet: "☀️ Breakfast · 🍲 Lunch · 🌙 Dinner",
    icon: "🍽️",
    bgAccent: "bg-amber-100",
  },
  {
    badge: "Step 2 of 4",
    title: "Curated Pantry Plates",
    description:
      "No more staring into the fridge wondering what to eat. We combine what's actually in your kitchen—pairing anchor grains with proteins, stews, and vegetables.",
    bullet: "✨ Real Nigerian staples · No phantom grocery items",
    icon: "🍱",
    bgAccent: "bg-emerald-100",
  },
  {
    badge: "Step 3 of 4",
    title: "Swap Anything In One Tap",
    description:
      "Don't like the suggested protein or side? Simply tap the card or swap button to choose another available ingredient from your kitchen.",
    bullet: "🔄 Tap to swap · Full control of your plate",
    icon: "⚡",
    bgAccent: "bg-purple-100",
  },
  {
    badge: "Step 4 of 4",
    title: "Cook, Log & Personalize",
    description:
      "Confirm your plate in 10 seconds to log what you ate. You can also track your eating goal and weight anytime from the profile button at the top.",
    bullet: "🚀 Zero calorie stress · Low friction everyday fuel",
    icon: "🎉",
    bgAccent: "bg-rose-100",
  },
];

export const WALKTHROUGH_STORAGE_KEY = "provisions_walkthrough_seen_v1";

export const AppWalkthroughModal: React.FC<AppWalkthroughModalProps> = ({
  isOpen,
  onClose,
  owner,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleFinish();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleFinish = () => {
    try {
      localStorage.setItem(WALKTHROUGH_STORAGE_KEY, "true");
    } catch {}
    onClose();
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate(8);
      }
      setCurrentStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate(6);
      }
      setCurrentStep((s) => s - 1);
    }
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="walkthrough-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full max-w-md bg-[#FAF8F5] border-[2.5px] border-stone-900 rounded-3xl shadow-brutal-lg overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b-2 border-stone-900/10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-300 border border-stone-900 text-stone-900 shadow-2xs">
                {step.badge}
              </span>
              {owner && (
                <span className="text-xs font-bold text-stone-500">
                  Welcome, {owner}
                </span>
              )}
            </div>

            <button
              onClick={handleFinish}
              aria-label="Skip walkthrough"
              className="text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors px-2 py-1"
            >
              Skip tour
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-4">
            {/* Visual Icon Box */}
            <div
              className={`w-16 h-16 rounded-2xl ${step.bgAccent} border-2 border-stone-900 shadow-brutal-xs flex items-center justify-center text-3xl mx-auto`}
            >
              {step.icon}
            </div>

            <div className="text-center space-y-2">
              <h3
                id="walkthrough-title"
                className="text-xl font-display font-black text-stone-900 leading-tight"
              >
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
            </div>

            {/* Feature Highlight Pill */}
            <div className="p-3 bg-white rounded-xl border-2 border-stone-900 shadow-brutal-2xs text-center">
              <span className="text-xs font-black text-stone-800">
                {step.bullet}
              </span>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {STEPS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all border border-stone-900 ${
                    idx === currentStep
                      ? "w-6 bg-stone-900"
                      : "w-2 bg-stone-200 hover:bg-stone-300"
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-4 bg-stone-100/90 border-t-2 border-stone-900 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`py-2 px-3.5 rounded-xl border-2 border-stone-900 font-black text-xs transition-all flex items-center gap-1.5 ${
                currentStep === 0
                  ? "opacity-30 cursor-not-allowed bg-stone-200"
                  : "bg-white hover:bg-stone-50 shadow-brutal-2xs active:translate-x-0.5 active:translate-y-0.5"
              }`}
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="py-2 px-5 rounded-xl border-2 border-stone-900 bg-amber-300 hover:bg-amber-400 font-black text-xs text-stone-900 shadow-brutal-2xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <span>{currentStep === STEPS.length - 1 ? "Get Started" : "Next"}</span>
              {currentStep === STEPS.length - 1 ? (
                <Check size={14} weight="bold" />
              ) : (
                <ArrowRight size={14} weight="bold" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
