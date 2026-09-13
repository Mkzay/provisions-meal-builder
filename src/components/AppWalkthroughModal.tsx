"use client";

import { ArrowLeft, ArrowRight, Check, X } from "@/components/icons";
import {
  MealMomentPreview,
  NavigationGuidePreview,
  PantryPlatePreview,
  SwapDemoPreview,
} from "@/components/WalkthroughPreviews";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface AppWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner?: string;
}

const STEPS = [
  {
    stepNumber: "1/4",
    tag: "Meal Moments",
    title: "Choose Your Meal Window",
    description:
      "Tap your meal slot. Provisions tailors recipes to the exact time of day—from quick breakfast eggs to rich evening swallows.",
    Component: MealMomentPreview,
  },
  {
    stepNumber: "2/4",
    tag: "Kitchen Intelligence",
    title: "100% In-Stock Nigerian Meals",
    description:
      "No phantom recipes or missing grocery runs. Provisions matches your pantry grains with verified in-stock proteins and fresh greens.",
    Component: PantryPlatePreview,
  },
  {
    stepNumber: "3/4",
    tag: "Instant Customization",
    title: "Swap Any Item In One Tap",
    description:
      "Don't feel like chicken tonight? Tap any protein or side on your plate to swap it with another ingredient from your pantry.",
    Component: SwapDemoPreview,
  },
  {
    stepNumber: "4/4",
    tag: "Kitchen Navigation",
    title: "Your 4 Essential Tools",
    description:
      "Use the bottom navigation to build meals in the Kitchen, save family recipes, track pantry stock, and personalize your health goals.",
    Component: NavigationGuidePreview,
  },
];

export const WALKTHROUGH_STORAGE_KEY = "provisions_walkthrough_seen_v1";

export const AppWalkthroughModal: React.FC<AppWalkthroughModalProps> = ({
  isOpen,
  onClose,
  owner,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      previousFocus.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() =>
        dialogRef.current?.querySelector<HTMLElement>("button")?.focus()
      );
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  const triggerHaptic = (ms = 8) => {
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(ms);
    }
  };

  const handleFinish = () => {
    try {
      localStorage.setItem(WALKTHROUGH_STORAGE_KEY, "true");
    } catch {}
    onClose();
  };

  const handleNext = () => {
    triggerHaptic(8);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    triggerHaptic(6);
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  // Keyboard navigation & a11y focus trapping (iPad/Desktop friendly)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleFinish();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
          )
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep]);

  // Touch swipe gesture handler (Mobile thumb-friendly)
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 45;
    const velocityThreshold = 280;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const StepComponent = step.Component;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="walkthrough-title"
      >
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full max-w-lg bg-[#FAF8F5] dark:bg-[#141210] border-t-[2.5px] sm:border-[2.5px] border-stone-900 dark:border-stone-700 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg dark:shadow-brutal-dark overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88vh]"
        >
          {/* Mobile Bottom-Sheet Pull Indicator */}
          <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

          {/* Story-Style Segmented Progress Bar */}
          <div className="flex items-center gap-1.5 px-5 pt-3 pb-1 shrink-0">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  triggerHaptic(6);
                  setCurrentStep(idx);
                }}
                className="flex-1 h-1.5 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-800 transition-colors focus:outline-none"
                aria-label={`Go to step ${idx + 1}`}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    idx <= currentStep ? "bg-stone-900 dark:bg-amber-400" : "bg-transparent"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Top Header */}
          <div className="flex items-center justify-between px-5 pt-2 pb-2.5 border-b border-stone-900/10 dark:border-stone-700/60 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-300 dark:bg-amber-400 border border-stone-900 dark:border-amber-700 text-stone-900 dark:text-stone-950 shadow-2xs">
                {step.tag}
              </span>
              {owner && (
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400 hidden xs:inline">
                  Welcome, {owner}
                </span>
              )}
            </div>

            <button
              onClick={handleFinish}
              aria-label="Skip walkthrough"
              className="text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors px-2 py-1"
            >
              Skip tour
            </button>
          </div>

          {/* Swipeable Body Stage */}
          <motion.div
            key={currentStep}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.2 }}
            className="p-5 sm:p-6 space-y-4 overflow-y-auto no-scrollbar modal-scroll-contain select-none cursor-grab active:cursor-grabbing"
          >
            {/* Title & Description */}
            <div className="text-center space-y-1.5">
              <h3
                id="walkthrough-title"
                className="text-lg sm:text-xl font-display font-black text-stone-900 dark:text-stone-100 leading-tight tracking-tight"
              >
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-medium leading-relaxed max-w-md mx-auto">
                {step.description}
              </p>
            </div>

            {/* Interactive Live Micro-Preview Widget */}
            <div className="py-1">
              <StepComponent />
            </div>

            {/* Mobile Swipe Hint */}
            <div className="text-center pt-1">
              <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 sm:hidden">
                ← Swipe left or right with your thumb →
              </span>
              <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 hidden sm:inline">
                Use arrow keys ← → or buttons to navigate
              </span>
            </div>
          </motion.div>

          {/* Footer Navigation Bar */}
          <div className="p-4 bg-stone-100/95 dark:bg-stone-900/95 border-t-2 border-stone-900 dark:border-stone-700 flex items-center justify-between gap-3 shrink-0 safe-area-bottom">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`py-2 px-3.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 font-black text-xs transition-all flex items-center gap-1.5 ${
                currentStep === 0
                  ? "opacity-30 cursor-not-allowed bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400"
                  : "bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-brutal-2xs active:translate-x-0.5 active:translate-y-0.5"
              }`}
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Back</span>
            </button>

            <span className="text-xs font-black text-stone-500 dark:text-stone-400">
              {step.stepNumber}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="py-2.5 px-5 rounded-xl border-2 border-stone-900 dark:border-stone-950 bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 dark:hover:bg-amber-300 font-black text-xs text-stone-900 dark:text-stone-950 shadow-brutal-2xs active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1.5"
            >
              <span>
                {currentStep === STEPS.length - 1 ? "Start Cooking" : "Next"}
              </span>
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
