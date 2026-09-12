"use client";

import { LeftoverDecision, MealSource, MealType } from "@/lib/types";
import { Check, CheckCircle, Package, Sparkle, X, XCircle } from "@/components/icons";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface LeftoverModalProps {
  isOpen: boolean;
  mealType: MealType;
  source: MealSource;
  readyMealId?: string;
  readyMealName?: string;
  mainIngredient?: string;
  protein?: string;
  supplementary?: string;
  onSubmitDecision: (decision: LeftoverDecision) => void;
  onClose: () => void;
}

export const LeftoverModal: React.FC<LeftoverModalProps> = ({
  isOpen,
  mealType,
  source,
  readyMealId,
  mainIngredient,
  protein,
  supplementary,
  onSubmitDecision,
  onClose,
}) => {
  const [step, setStep] = useState<"ask" | "name_built" | "done">("ask");
  const [hadLeftovers, setHadLeftovers] = useState<boolean>(false);

  const defaultNewName = protein
    ? `${mainIngredient} + ${protein}`
    : mainIngredient || "Leftover Meal";

  const [customName, setCustomName] = useState(defaultNewName);

  // Keyboard Escape listener for impeccable a11y
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAnswer = (leftovers: boolean) => {
    setHadLeftovers(leftovers);

    if (source === "Built" && leftovers) {
      setStep("name_built");
      return;
    }

    const decision: LeftoverDecision = {
      source,
      readyMealId,
      hadLeftovers: leftovers,
      mealType,
      mainIngredient,
      protein,
      supplementary,
    };

    onSubmitDecision(decision);
    setStep("done");
  };

  const handleSaveBuiltLeftovers = () => {
    const decision: LeftoverDecision = {
      source: "Built",
      hadLeftovers: true,
      mealType,
      mainIngredient,
      protein,
      supplementary,
      customName: customName.trim() || defaultNewName,
    };

    onSubmitDecision(decision);
    setStep("done");
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-foreground/40 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leftover-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className="w-full max-w-md max-h-[92dvh] sm:max-h-[88vh] bg-surface border-[2.5px] border-ink rounded-t-[28px] sm:rounded-3xl p-6 sm:p-7 shadow-brutal-lg overflow-y-auto no-scrollbar modal-scroll-contain relative"
        >
          {/* Mobile Bottom Sheet Pull Bar */}
          <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto -mt-2 mb-4 shrink-0" />
          {step === "ask" && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-saffron-300 border-2 border-ink text-ink flex items-center justify-center mx-auto shadow-brutal-sm">
                <Package size={28} weight="bold" />
              </div>

              <div>
                <h3 id="leftover-modal-title" className="text-2xl font-display font-extrabold text-ink">
                  Any leftovers for later?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {source === "Ready Meal"
                    ? "If yes, this stays available in your ready meals. If no, we'll mark it finished so you don't see it next time."
                    : "If yes, we'll automatically package this as a ready meal for next time so you won't have to cook."}
                </p>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAnswer(false)}
                  className="min-h-[48px] py-3.5 px-5 rounded-2xl border-2 border-ink bg-stone-100 hover:bg-stone-200 text-ink font-extrabold text-sm transition-all shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <XCircle size={20} weight="bold" className="text-stone-500 shrink-0" />
                  <span className="whitespace-nowrap">All finished</span>
                </button>

                <button
                  onClick={() => handleAnswer(true)}
                  className="min-h-[48px] py-3.5 px-5 rounded-2xl border-2 border-ink bg-emerald-300 hover:bg-emerald-400 text-ink font-extrabold text-sm transition-all shadow-brutal-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                  <CheckCircle size={20} weight="bold" className="shrink-0" />
                  <span className="whitespace-nowrap">Yes, saved some</span>
                </button>
              </div>
            </div>
          )}

          {step === "name_built" && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-lavender-200 border-2 border-ink text-ink flex items-center justify-center mx-auto mb-3 shadow-brutal-sm">
                  <Sparkle size={28} weight="bold" />
                </div>
                <h3 className="text-2xl font-display font-extrabold text-ink">
                  Name your ready meal
                </h3>
                <p className="text-xs text-stone-600 font-medium mt-1">
                  This will now appear in your ready meals pool next time you need a zero-effort meal.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-ink uppercase tracking-wider">
                  Meal Title
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={defaultNewName}
                  className="w-full px-4 py-3 rounded-xl border-2 border-ink bg-white text-ink text-sm font-bold placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-ink shadow-brutal-sm"
                />
              </div>

              <button
                onClick={handleSaveBuiltLeftovers}
                className="w-full py-3.5 px-4 rounded-xl border-2 border-ink bg-emerald-300 hover:bg-emerald-400 text-ink font-extrabold text-sm transition-all shadow-brutal hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Save to Ready Meals</span>
                <Check size={18} weight="bold" />
              </button>
            </div>
          )}

          {step === "done" && (
            <div className="space-y-5 text-center py-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-200 border-2 border-ink text-ink flex items-center justify-center mx-auto shadow-brutal-sm">
                <CheckCircle size={36} weight="bold" />
              </div>

              <div>
                <h3 className="text-2xl font-display font-extrabold text-ink">
                  Enjoy your meal, Esther!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1.5 max-w-xs mx-auto">
                  {hadLeftovers
                    ? "Leftovers successfully added to your ready meals."
                    : "Meal logged. Kitchen catalogue kept completely up to date."}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 px-5 rounded-2xl border-2 border-ink bg-saffron-300 hover:bg-saffron-400 text-ink font-extrabold text-sm transition-all shadow-brutal hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
