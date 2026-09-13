"use client";

import { Check, PencilSimple, X } from "@/components/icons";
import { MealType } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const ALL_MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];
const ROLES: Array<"Main" | "Protein" | "Supplementary"> = ["Main", "Protein", "Supplementary"];

export interface EditSupplyItem {
  id: string;
  name: string;
  kind: "ingredient" | "ready_meal";
  role?: string;
  mealTypes: MealType[];
}

interface EditSupplyModalProps {
  isOpen: boolean;
  item: EditSupplyItem | null;
  onClose: () => void;
  onSave: (
    id: string,
    kind: "ingredient" | "ready_meal",
    updates: { name: string; role?: "Main" | "Protein" | "Supplementary"; mealTypes: MealType[] }
  ) => Promise<void>;
}

export const EditSupplyModal: React.FC<EditSupplyModalProps> = ({
  isOpen,
  item,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"Main" | "Protein" | "Supplementary">("Main");
  const [mealTypes, setMealTypes] = useState<MealType[]>(["Lunch", "Dinner"]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setRole((item.role as "Main" | "Protein" | "Supplementary") || "Main");
      setMealTypes(item.mealTypes.length > 0 ? item.mealTypes : ["Lunch", "Dinner"]);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const toggleMealType = (mt: MealType) => {
    if (mealTypes.includes(mt)) {
      if (mealTypes.length > 1) {
        setMealTypes(mealTypes.filter((t) => t !== mt));
      }
    } else {
      setMealTypes([...mealTypes, mt]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || mealTypes.length === 0 || isSaving) return;
    setIsSaving(true);
    try {
      await onSave(item.id, item.kind, {
        name: name.trim(),
        role: item.kind === "ingredient" ? role : undefined,
        mealTypes,
      });
      onClose();
    } catch (err) {
      console.error("Failed to update supply:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="w-full max-w-md bg-white dark:bg-[#141210] border-2 border-stone-900 dark:border-stone-700 rounded-3xl shadow-brutal dark:shadow-brutal-dark p-5 sm:p-6 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-stone-900/10 dark:border-stone-700/60">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-200 dark:bg-amber-950/60 border-2 border-stone-900 dark:border-amber-700 shadow-brutal-xs text-stone-900 dark:text-amber-300">
                <PencilSimple size={16} weight="bold" />
              </div>
              <div>
                <h3 className="text-base font-display font-black text-stone-900 dark:text-stone-100">
                  Edit {item.kind === "ready_meal" ? "Ready Meal" : "Food Staple"}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-semibold">
                  Update name, meal times or category
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 shadow-brutal-xs"
              aria-label="Close"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                Item Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm font-semibold rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none shadow-brutal-xs"
              />
            </div>

            {/* Role (for ingredients) */}
            {item.kind === "ingredient" && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                  Category Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-1.5 px-2 text-xs font-black rounded-xl border-2 border-stone-900 dark:border-stone-700 transition-all ${
                        role === r
                          ? "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950 shadow-brutal-xs"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
                      }`}
                    >
                      {r === "Supplementary" ? "Side / Veg" : r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Meal Times */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                Suggested For
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_MEAL_TYPES.map((mt) => {
                  const isSelected = mealTypes.includes(mt);
                  return (
                    <button
                      key={mt}
                      type="button"
                      onClick={() => toggleMealType(mt)}
                      className={`px-3 py-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 text-xs font-black transition-all shadow-brutal-xs flex items-center gap-1 ${
                        isSelected
                          ? "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
                      }`}
                    >
                      {isSelected && <Check size={12} weight="bold" />}
                      <span>{mt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-xs font-black text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !name.trim() || mealTypes.length === 0}
                className="px-5 py-2 rounded-xl border-2 border-stone-900 dark:border-stone-950 bg-emerald-300 dark:bg-emerald-400 hover:bg-emerald-400 dark:hover:bg-emerald-300 text-stone-900 dark:text-stone-950 text-xs font-black shadow-brutal-xs active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
