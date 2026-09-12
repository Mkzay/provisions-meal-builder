"use client";

import {
  BowlFood,
  CheckFat,
  CookingPot,
  Package,
  Plus,
  X,
} from "@/components/icons";
import { AddSupplyInput, IngredientRole, MealType } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo, useRef, useState } from "react";
import { AddSupplyBulkTab } from "./AddSupplyBulkTab";
import { AddSupplySingleTab } from "./AddSupplySingleTab";

interface AddSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSupply: (input: AddSupplyInput) => Promise<void>;
  onAddBulkSupplies?: (inputs: AddSupplyInput[]) => Promise<void>;
  owner?: string;
}

export const AddSupplyModal: React.FC<AddSupplyModalProps> = ({
  isOpen,
  onClose,
  onAddSupply,
  onAddBulkSupplies,
  owner,
}) => {
  const [tabMode, setTabMode] = useState<"single" | "bulk">("single");
  const [kind, setKind] = useState<"ingredient" | "ready_meal">("ingredient");
  const [name, setName] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [role, setRole] = useState<IngredientRole>("Main");
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([
    "Lunch",
    "Dinner",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const parsedBulkItems = useMemo(() => {
    return bulkText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [bulkText]);

  const toggleMealType = (mt: MealType) => {
    if (selectedMealTypes.includes(mt)) {
      if (selectedMealTypes.length > 1) {
        setSelectedMealTypes(selectedMealTypes.filter((t) => t !== mt));
      }
    } else {
      setSelectedMealTypes([...selectedMealTypes, mt]);
    }
  };

  const handleAddSingle = async (keepOpen = false) => {
    if (!name.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const addedItemName = name.trim();
    try {
      await onAddSupply({
        kind,
        name: addedItemName,
        role: kind === "ingredient" ? role : undefined,
        mealTypes: selectedMealTypes,
        owner,
      });

      if (keepOpen) {
        setName("");
        setToastMessage(`Added "${addedItemName}"`);
        setTimeout(() => setToastMessage(null), 2500);
        setTimeout(() => nameInputRef.current?.focus(), 80);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setName("");
          onClose();
        }, 900);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBulk = async () => {
    if (parsedBulkItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    const inputs: AddSupplyInput[] = parsedBulkItems.map((itemName) => ({
      kind,
      name: itemName,
      role: kind === "ingredient" ? role : undefined,
      mealTypes: selectedMealTypes,
      owner,
    }));

    try {
      if (onAddBulkSupplies) {
        await onAddBulkSupplies(inputs);
      } else {
        for (const input of inputs) {
          await onAddSupply(input);
        }
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setBulkText("");
        onClose();
      }, 950);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tabMode === "single") {
      await handleAddSingle(false);
    } else {
      await handleAddBulk();
    }
  };

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
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF8F5] border-[2.5px] border-stone-900 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg overflow-hidden"
        >
          {/* Mobile Bottom Sheet Pull Bar */}
          <div className="sm:hidden w-12 h-1.5 bg-stone-300 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />

          {/* Pinned Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-2 border-stone-900 shrink-0 bg-[#FAF8F5]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-300 border-2 border-stone-900 shadow-brutal-sm flex items-center justify-center text-stone-900 shrink-0">
                {tabMode === "single" ? (
                  <Plus size={22} weight="bold" />
                ) : (
                  <Package size={22} weight="bold" />
                )}
              </div>
              <div>
                <h3
                  id="add-supply-modal-title"
                  className="text-lg sm:text-xl font-display font-black tracking-tight text-stone-900"
                >
                  Restock Kitchen
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 font-medium">
                  Add groceries or meals to {owner ? `${owner}'s` : "your"} kitchen.
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
            <div className="flex-1 overflow-y-auto no-scrollbar modal-scroll-contain p-5 sm:p-6 space-y-4 min-h-0">
              {/* Single vs Bulk Mode Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200 border-2 border-stone-900 rounded-2xl shadow-brutal-sm">
                <button
                  type="button"
                  onClick={() => setTabMode("single")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-black text-xs transition-all ${
                    tabMode === "single"
                      ? "bg-white text-stone-900 border-2 border-stone-900 shadow-brutal-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Plus size={15} weight="bold" />
                  <span>Single Item</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTabMode("bulk")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-black text-xs transition-all ${
                    tabMode === "bulk"
                      ? "bg-amber-300 text-stone-900 border-2 border-stone-900 shadow-brutal-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Package size={15} weight="bold" />
                  <span>Bulk Upload</span>
                </button>
              </div>

              {/* Kind Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 border-2 border-stone-900 rounded-2xl shadow-brutal-sm">
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
                  <span className="truncate">Pantry Items</span>
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
                  <span className="truncate">Ready Meals</span>
                </button>
              </div>

              {tabMode === "single" ? (
                <AddSupplySingleTab
                  name={name}
                  setName={setName}
                  nameInputRef={nameInputRef}
                  toastMessage={toastMessage}
                  kind={kind}
                  role={role}
                  setRole={setRole}
                  selectedMealTypes={selectedMealTypes}
                  toggleMealType={toggleMealType}
                />
              ) : (
                <AddSupplyBulkTab
                  bulkText={bulkText}
                  setBulkText={setBulkText}
                  parsedBulkItems={parsedBulkItems}
                  kind={kind}
                  role={role}
                  setRole={setRole}
                  selectedMealTypes={selectedMealTypes}
                  toggleMealType={toggleMealType}
                />
              )}
            </div>

            {/* Pinned Action Footer */}
            <div className="px-5 sm:px-6 py-3.5 border-t-2 border-stone-900 bg-stone-100/95 shrink-0 flex items-center justify-between gap-2.5 safe-area-bottom">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-3.5 py-2.5 rounded-xl border-2 border-stone-900 bg-white font-bold text-xs text-stone-700 hover:bg-stone-100 transition-all"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {tabMode === "single" ? (
                  <>
                    <button
                      type="button"
                      disabled={isSubmitting || !name.trim()}
                      onClick={() => handleAddSingle(true)}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-stone-900 font-black text-xs bg-amber-300 hover:bg-amber-200 text-stone-900 shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
                    >
                      <Plus size={15} weight="bold" />
                      <span>Add & Next</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !name.trim()}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-stone-900 font-black text-xs bg-emerald-400 hover:bg-emerald-300 text-stone-900 shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
                    >
                      {success ? (
                        <>
                          <CheckFat size={16} weight="fill" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <span>Add to Kitchen</span>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || parsedBulkItems.length === 0}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border-2 border-stone-900 font-black text-xs bg-emerald-400 hover:bg-emerald-300 text-stone-900 shadow-brutal-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
                  >
                    {success ? (
                      <>
                        <CheckFat size={16} weight="fill" />
                        <span>Added All!</span>
                      </>
                    ) : (
                      <>
                        <Package size={16} weight="bold" />
                        <span>
                          {isSubmitting
                            ? "Adding..."
                            : `Add ${parsedBulkItems.length || ""} Item${
                                parsedBulkItems.length === 1 ? "" : "s"
                              }`}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
