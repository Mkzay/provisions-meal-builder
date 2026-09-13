"use client";

import {
  BowlFood,
  CookingPot,
  Package,
  Plus,
  X,
} from "@/components/icons";
import { ClassifiedBulkItem, inferIngredientRole } from "@/lib/culinary-classifier";
import { AddSupplyInput, IngredientRole, MealType } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { AddSupplyBulkTab } from "./AddSupplyBulkTab";
import { AddSupplyFooter } from "./AddSupplyFooter";
import { AddSupplySingleTab } from "./AddSupplySingleTab";

interface AddSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSupply: (input: AddSupplyInput) => Promise<void>;
  onAddBulkSupplies?: (inputs: AddSupplyInput[]) => Promise<void>;
  onOpenFoodIdeas?: () => void;
  owner?: string;
}

export const AddSupplyModal: React.FC<AddSupplyModalProps> = ({
  isOpen,
  onClose,
  onAddSupply,
  onAddBulkSupplies,
  onOpenFoodIdeas,
  owner,
}) => {
  const [tabMode, setTabMode] = useState<"single" | "bulk">("single");
  const [kind, setKind] = useState<"ingredient" | "ready_meal">("ingredient");
  const [name, setName] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [classifiedItems, setClassifiedItems] = useState<ClassifiedBulkItem[]>([]);
  const [role, setRole] = useState<IngredientRole>("Main");
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([
    "Lunch",
    "Dinner",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Sync bulkText with classifiedItems, preserving manual role overrides
  useEffect(() => {
    const rawNames = bulkText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    setClassifiedItems((prev) => {
      const prevMap = new Map(prev.map((it) => [it.name.toLowerCase(), it.role]));
      return rawNames.map((itemName, idx) => ({
        id: `bulk-${idx}-${itemName.toLowerCase()}`,
        name: itemName,
        role: prevMap.get(itemName.toLowerCase()) || inferIngredientRole(itemName),
      }));
    });
  }, [bulkText]);

  const handleUpdateRole = (id: string, newRole: IngredientRole) => {
    setClassifiedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, role: newRole } : item))
    );
  };

  const handleRemoveBulkItem = (id: string) => {
    const itemToRemove = classifiedItems.find((it) => it.id === id);
    if (!itemToRemove) return;
    setClassifiedItems((prev) => prev.filter((it) => it.id !== id));
    const updated = bulkText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.toLowerCase() !== itemToRemove.name.toLowerCase())
      .join("\n");
    setBulkText(updated);
  };

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
    if (classifiedItems.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    const inputs: AddSupplyInput[] =
      kind === "ingredient"
        ? classifiedItems.map((item) => ({
            kind: "ingredient",
            name: item.name,
            role: item.role,
            mealTypes: selectedMealTypes,
            owner,
          }))
        : classifiedItems.map((item) => ({
            kind: "ready_meal",
            name: item.name,
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
        setClassifiedItems([]);
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

  useEffect(() => {
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
          className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF8F5] dark:bg-[#141210] border-[2.5px] border-stone-900 dark:border-stone-700 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg dark:shadow-brutal-dark overflow-hidden"
        >
          {/* Mobile Pull Bar */}
          <div className="sm:hidden w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mt-2.5 mb-0.5 shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-2 border-stone-900 dark:border-stone-700 shrink-0 bg-[#FAF8F5] dark:bg-[#141210]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-300 dark:bg-emerald-950/60 border-2 border-stone-900 dark:border-emerald-700 shadow-brutal-sm dark:shadow-brutal-dark-sm flex items-center justify-center text-stone-900 dark:text-emerald-300 shrink-0">
                {tabMode === "single" ? (
                  <Plus size={22} weight="bold" />
                ) : (
                  <Package size={22} weight="bold" />
                )}
              </div>
              <div>
                <h3
                  id="add-supply-modal-title"
                  className="text-lg sm:text-xl font-display font-black tracking-tight text-stone-900 dark:text-stone-100"
                >
                  Restock Kitchen
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 font-medium flex items-center gap-1.5 flex-wrap">
                  <span>Add groceries to {owner ? `${owner}'s` : "your"} kitchen.</span>
                  {onOpenFoodIdeas && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenFoodIdeas();
                      }}
                      className="text-amber-800 dark:text-amber-400 font-bold underline hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
                    >
                      Browse Ideas →
                    </button>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close restock modal"
              className="p-2 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-brutal-sm dark:shadow-brutal-dark-sm hover:bg-stone-100 dark:hover:bg-stone-700 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar modal-scroll-contain p-5 sm:p-6 space-y-4 min-h-0">
              {/* Single vs Bulk Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-200 dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 rounded-2xl shadow-brutal-sm dark:shadow-brutal-dark-sm">
                <button
                  type="button"
                  onClick={() => setTabMode("single")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-black text-xs transition-all ${
                    tabMode === "single"
                      ? "bg-white dark:bg-amber-400 text-stone-900 dark:text-stone-950 border-2 border-stone-900 dark:border-stone-950 shadow-brutal-sm dark:shadow-brutal-dark-sm"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
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
                      ? "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950 border-2 border-stone-900 dark:border-stone-950 shadow-brutal-sm dark:shadow-brutal-dark-sm"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
                  }`}
                >
                  <Package size={15} weight="bold" />
                  <span>Bulk Upload</span>
                </button>
              </div>

              {/* Kind Selector */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-stone-100 dark:bg-stone-900/80 border-2 border-stone-900 dark:border-stone-700 rounded-2xl shadow-brutal-sm dark:shadow-brutal-dark-sm">
                <button
                  type="button"
                  onClick={() => setKind("ingredient")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all whitespace-nowrap min-h-[42px] ${
                    kind === "ingredient"
                      ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
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
                      ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-900 dark:border-stone-700 shadow-brutal-sm dark:shadow-brutal-dark-sm"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
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
                  items={classifiedItems}
                  onUpdateRole={handleUpdateRole}
                  onRemoveItem={handleRemoveBulkItem}
                  kind={kind}
                  selectedMealTypes={selectedMealTypes}
                  toggleMealType={toggleMealType}
                />
              )}
            </div>

            <AddSupplyFooter
              onClose={onClose}
              tabMode={tabMode}
              isSubmitting={isSubmitting}
              name={name}
              itemsCount={classifiedItems.length}
              success={success}
              onAddSingle={handleAddSingle}
            />
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
