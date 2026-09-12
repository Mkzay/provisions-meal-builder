"use client";

import { CheckFat, Package, Plus } from "@/components/icons";
import React from "react";

interface AddSupplyFooterProps {
  onClose: () => void;
  tabMode: "single" | "bulk";
  isSubmitting: boolean;
  name: string;
  itemsCount: number;
  success: boolean;
  onAddSingle: (keepOpen: boolean) => void;
}

export const AddSupplyFooter: React.FC<AddSupplyFooterProps> = ({
  onClose,
  tabMode,
  isSubmitting,
  name,
  itemsCount,
  success,
  onAddSingle,
}) => {
  return (
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
              onClick={() => onAddSingle(true)}
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
            disabled={isSubmitting || itemsCount === 0}
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
                    : `Add ${itemsCount || ""} Item${itemsCount === 1 ? "" : "s"}`}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
