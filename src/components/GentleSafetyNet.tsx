"use client";

import {
  Bread,
  Check,
  CookingPot,
  Cookie,
  Egg,
  Heart,
  PlusCircle,
  Sparkle,
} from "@/components/icons";
import { Ingredient } from "@/lib/types";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface GentleSafetyNetProps {
  onQuickAddStaples: (selectedIngredients: Ingredient[]) => void;
  onOpenSettings: () => void;
}

export const GentleSafetyNet: React.FC<GentleSafetyNetProps> = ({
  onQuickAddStaples,
  onOpenSettings,
}) => {
  const [showStaplesDrawer, setShowStaplesDrawer] = useState(false);
  const [selectedStapleIds, setSelectedStapleIds] = useState<string[]>([]);

  const emergencyComforts = [
    {
      title: "Warm Buttered Toast & Soft Egg",
      time: "5 mins",
      desc: "Toasted sliced bread, warm butter, and a fried or boiled egg. Immediate comfort.",
      icon: <Bread size={24} weight="duotone" className="text-amber-800" />,
      badgeBg: "bg-amber-100 text-amber-950 border-amber-800",
    },
    {
      title: "Quick PB & Apple / Crackers",
      time: "2 mins",
      desc: "Cream crackers or fruit slices with thick peanut butter. Instant calm & satiety.",
      icon: <Cookie size={24} weight="duotone" className="text-purple-900" />,
      badgeBg: "bg-purple-100 text-purple-950 border-purple-900",
    },
    {
      title: "Upgraded Noodles with Egg & Sardines",
      time: "5 mins",
      desc: "If eating noodles, add an egg or canned sardines so your body gets real protein.",
      icon: <CookingPot size={24} weight="duotone" className="text-rose-900" />,
      badgeBg: "bg-rose-100 text-rose-950 border-rose-900",
    },
  ];

  const commonStaples: Ingredient[] = [
    {
      id: "staple-eggs",
      name: "Fresh Eggs",
      role: "Protein",
      mealTypes: ["Breakfast", "Lunch", "Dinner"],
      owner: "Esther",
      available: true,
    },
    {
      id: "staple-bread",
      name: "Sliced Bread",
      role: "Main",
      mealTypes: ["Breakfast", "Snack"],
      owner: "Esther",
      available: true,
    },
    {
      id: "staple-rice",
      name: "Rice",
      role: "Main",
      mealTypes: ["Lunch", "Dinner"],
      owner: "Esther",
      available: true,
    },
    {
      id: "staple-crackers",
      name: "Cream Crackers",
      role: "Main",
      mealTypes: ["Snack"],
      owner: "Esther",
      available: true,
    },
    {
      id: "staple-sardines",
      name: "Canned Sardines",
      role: "Protein",
      mealTypes: ["Breakfast", "Lunch"],
      owner: "Esther",
      available: true,
    },
    {
      id: "staple-pb",
      name: "Peanut Butter",
      role: "Protein",
      mealTypes: ["Breakfast", "Snack"],
      owner: "Esther",
      available: true,
    },
  ];

  const handleApplyStaples = () => {
    const selected = commonStaples.filter((s) => selectedStapleIds.includes(s.id));
    onQuickAddStaples(selected);
    setShowStaplesDrawer(false);
  };

  // Keyboard Escape listener for staples drawer
  React.useEffect(() => {
    if (!showStaplesDrawer) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowStaplesDrawer(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showStaplesDrawer]);

  return (
    <div className="w-full space-y-6">
      <div className="p-7 bg-[#FEF08A] rounded-3xl border-[2.5px] border-stone-900 shadow-brutal text-center space-y-3.5">
        <div className="w-14 h-14 rounded-2xl bg-white border-2 border-stone-900 text-stone-900 flex items-center justify-center mx-auto shadow-brutal-sm">
          <Heart size={30} weight="fill" className="text-rose-600" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-display font-black text-stone-900">
          Kitchen feeling bare, Esther?
        </h3>

        <p className="text-xs sm:text-sm text-stone-800 font-medium max-w-md mx-auto leading-relaxed">
          No ingredients are marked available right now. That is 100% fine! We don&apos;t want you skipping meals or stressing.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setShowStaplesDrawer(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-stone-900 font-black text-xs sm:text-sm transition-all border-2 border-stone-900 shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} weight="bold" />
            <span>Quick-Tap Pantry Staples (10s)</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border-2 border-stone-900 bg-white hover:bg-stone-100 text-stone-900 font-black text-xs sm:text-sm transition-all shadow-brutal-sm"
          >
            Check Notion Sync
          </button>
        </div>
      </div>

      {/* 3 Quick Comforts */}
      <div className="space-y-3">
        <div className="px-1">
          <h4 className="font-display font-black text-lg text-stone-900">
            3 Zero-Effort Lifesavers
          </h4>
          <p className="text-xs text-stone-600 font-medium">
            If you just need food in your belly right now without thinking:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {emergencyComforts.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-5 bg-white rounded-3xl border-2 border-stone-900 shadow-brutal-sm hover:shadow-brutal transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 border-2 border-stone-900 flex items-center justify-center shadow-brutal-sm">
                    {item.icon}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-stone-900 ${item.badgeBg}`}
                  >
                    {item.time}
                  </span>
                </div>
                <h5 className="font-display font-black text-base text-stone-900">
                  {item.title}
                </h5>
                <p className="text-xs text-stone-700 font-medium mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Staples Drawer Modal */}
      {showStaplesDrawer && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="staples-drawer-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-[#FAF8F5] border-[2.5px] border-stone-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-brutal-lg space-y-4"
          >
            <div className="text-center">
              <h4 id="staples-drawer-title" className="text-xl font-display font-black text-stone-900">
                Tap what you have right now
              </h4>
              <p className="text-xs text-stone-600 font-medium mt-1">
                Select 1 or 2 items and we&apos;ll build your meal immediately.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {commonStaples.map((staple) => {
                const isSelected = selectedStapleIds.includes(staple.id);
                return (
                  <button
                    key={staple.id}
                    onClick={() => {
                      setSelectedStapleIds((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== staple.id)
                          : [...prev, staple.id]
                      );
                    }}
                    className={`min-h-[44px] flex items-center justify-between p-3.5 rounded-2xl border-2 border-stone-900 text-left text-xs font-black transition-all ${
                      isSelected
                        ? "bg-amber-300 text-stone-900 shadow-brutal-sm"
                        : "bg-white hover:bg-stone-50 text-stone-900"
                    }`}
                  >
                    <span>{staple.name}</span>
                    {isSelected && <Check size={16} weight="bold" />}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowStaplesDrawer(false)}
                className="flex-1 min-h-[44px] py-3 rounded-xl border-2 border-stone-900 bg-white text-xs font-black text-stone-700 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyStaples}
                disabled={selectedStapleIds.length === 0}
                className="flex-1 min-h-[44px] py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-stone-900 font-black text-xs border-2 border-stone-900 shadow-brutal active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
              >
                Use Selected ({selectedStapleIds.length})
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
