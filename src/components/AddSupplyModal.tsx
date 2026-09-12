"use client";

import {
  BowlFood,
  CheckFat,
  CookingPot,
  Plus,
  Sparkle,
  X,
} from "@/components/icons";
import { AddSupplyInput, IngredientRole, MealType } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface AddSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSupply: (input: AddSupplyInput) => Promise<void>;
}

export const AddSupplyModal: React.FC<AddSupplyModalProps> = ({
  isOpen,
  onClose,
  onAddSupply,
}) => {
  const [kind, setKind] = useState<"ingredient" | "ready_meal">("ingredient");
  const [name, setName] = useState("");
  const [role, setRole] = useState<IngredientRole>("Main");
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([
    "Lunch",
    "Dinner",
  ]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleMealType = (mt: MealType) => {
    if (selectedMealTypes.includes(mt)) {
      if (selectedMealTypes.length > 1) {
        setSelectedMealTypes(selectedMealTypes.filter((t) => t !== mt));
      }
    } else {
      setSelectedMealTypes([...selectedMealTypes, mt]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddSupply({
        kind,
        name: name.trim(),
        role: kind === "ingredient" ? role : undefined,
        mealTypes: selectedMealTypes,
        notes: notes.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setNotes("");
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-supply-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF8F5] border-[2.5px] border-stone-900 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg overflow-hidden"
        >
          {/* Pinned Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-2 border-stone-900 shrink-0 bg-[#FAF8F5]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-300 border-2 border-stone-900 shadow-brutal-sm flex items-center justify-center text-stone-900 shrink-0">
                <Plus size={22} weight="bold" />
              </div>
              <div>
                <h3 id="add-supply-modal-title" className="text-lg sm:text-xl font-display font-black tracking-tight text-stone-900">
                  Restock Kitchen
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 font-medium">
                  Add new groceries or ready meals to Esther&apos;s kitchen.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close restock modal"
              className="p-2 rounded-xl border-2 border-stone-900 bg-white shadow-brutal-sm hover:bg-stone-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-6 space-y-4 min-h-0">
              {/* Kind Selector Tabs (Symmetric, No Wrapping) */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-200 border-2 border-stone-900 rounded-2xl shadow-brutal-sm">
                <button
                  type="button"
                  onClick={() => setKind("ingredient")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap min-h-[42px] ${
                    kind === "ingredient"
                      ? "bg-white text-stone-900 border-2 border-stone-900 shadow-brutal-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <BowlFood size={16} weight="duotone" className="shrink-0" />
                  <span className="truncate">Pantry Item</span>
                </button>
                <button
                  type="button"
                  onClick={() => setKind("ready_meal")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap min-h-[42px] ${
                    kind === "ready_meal"
                      ? "bg-white text-stone-900 border-2 border-stone-900 shadow-brutal-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <CookingPot size={16} weight="duotone" className="shrink-0" />
                  <span className="truncate">Ready Meal</span>
                </button>
              </div>

              {/* Name Input with Mobile-Safe Placeholder */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  {kind === "ingredient" ? "Ingredient Name" : "Ready Meal Title"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    kind === "ingredient"
                      ? "e.g. Sourdough, Avocado, Oats..."
                      : "e.g. Smoky Jollof, Veggie Stew..."
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border-2 border-stone-900 rounded-xl px-3.5 py-2.5 text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-brutal-sm"
                />
              </div>

              {/* Role Chips (Balanced 1-line Grid) */}
              {kind === "ingredient" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Culinary Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Main", "Protein", "Supplementary"] as IngredientRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`min-h-[44px] py-2 px-2 flex items-center justify-center text-center rounded-xl border-2 border-stone-900 text-xs font-bold transition-all whitespace-nowrap ${
                          role === r
                            ? "bg-amber-300 text-stone-900 shadow-brutal-sm -translate-y-0.5"
                            : "bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {r === "Main" ? "Carb / Base" : r === "Protein" ? "Protein" : "Side / Extra"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Meal Types Multi-Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Suitable Meals
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  {(["Breakfast", "Lunch", "Snack", "Dinner"] as MealType[]).map((mt) => {
                    const isSelected = selectedMealTypes.includes(mt);
                    return (
                      <button
                        key={mt}
                        type="button"
                        onClick={() => toggleMealType(mt)}
                        className={`min-h-[44px] py-2.5 px-3 flex items-center justify-center text-center rounded-xl border-2 border-stone-900 text-xs font-black transition-all ${
                          isSelected
                            ? "bg-purple-300 text-stone-900 shadow-brutal-sm -translate-y-0.5"
                            : "bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {mt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pinned Action Footer */}
            <div className="px-5 sm:px-6 py-3.5 border-t-2 border-stone-900 bg-stone-100/90 shrink-0 flex items-center justify-end gap-3 safe-area-bottom">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border-2 border-stone-900 bg-white font-bold text-xs text-stone-700 hover:bg-stone-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-stone-900 font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-stone-900 shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
              >
                {success ? (
                  <>
                    <CheckFat size={16} weight="fill" />
                    <span>Added to Kitchen!</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} weight="bold" />
                    <span>{isSubmitting ? "Adding..." : "Add to Kitchen"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
