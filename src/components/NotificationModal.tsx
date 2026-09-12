"use client";

import {
  Bell,
  BellRinging,
  CheckCircle,
  Clock,
  Package,
  ShoppingCartSimple,
  Sparkle,
  X,
} from "@/components/icons";
import {
  getStoredNotificationConfig,
  requestNotificationPermission,
  saveNotificationConfig,
} from "@/lib/notifications";
import { DayOfWeek, NotificationConfig, ReminderFrequency } from "@/lib/types";
import { ReminderPicker } from "@/components/ReminderPickers";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  owner?: string;
}

const MEAL_TIME_FIELDS: { key: keyof NotificationConfig; label: string; bg: string; iconColor: string }[] = [
  { key: "breakfastTime", label: "Breakfast", bg: "bg-amber-50", iconColor: "text-amber-600" },
  { key: "lunchTime", label: "Lunch", bg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { key: "snackTime", label: "Snack", bg: "bg-purple-50", iconColor: "text-purple-600" },
  { key: "dinnerTime", label: "Dinner", bg: "bg-rose-50", iconColor: "text-rose-600" },
];

function formatTime12h(time24: string): string {
  if (!time24) return "12:00 PM";
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  if (isNaN(h)) return time24;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${mStr || "00"} ${period}`;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  owner,
}) => {
  const [config, setConfig] = useState<NotificationConfig>(() => getStoredNotificationConfig(owner));
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredNotificationConfig(owner));
    }
  }, [isOpen, owner]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, [isOpen]);

  // Keyboard Escape listener for impeccable a11y
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const updateConfig = (updated: NotificationConfig) => {
    setConfig(updated);
    saveNotificationConfig(updated, owner);
  };

  const handleToggleEnabled = async () => {
    if (!config.enabled && permission !== "granted") {
      const res = await requestNotificationPermission();
      setPermission(res);
      if (res === "granted") {
        updateConfig({ ...config, enabled: true });
      }
    } else {
      updateConfig({ ...config, enabled: !config.enabled });
    }
  };

  const handleToggleGroceryNudges = () => {
    updateConfig({ ...config, includeGroceryNudges: !config.includeGroceryNudges });
  };

  const handleTogglePantryAudit = () => {
    updateConfig({ ...config, pantryAuditReminder: !config.pantryAuditReminder });
  };

  const handlePantryFrequencyChange = (freq: ReminderFrequency) => {
    updateConfig({ ...config, pantryAuditFrequency: freq });
  };

  const handlePantryDayChange = (day: DayOfWeek) => {
    updateConfig({ ...config, pantryAuditDay: day });
  };

  const handleToggleGroceryShopping = () => {
    updateConfig({ ...config, groceryShoppingReminder: !config.groceryShoppingReminder });
  };

  const handleGroceryFrequencyChange = (freq: ReminderFrequency) => {
    updateConfig({ ...config, groceryShoppingFrequency: freq });
  };

  const handleGroceryDayChange = (day: DayOfWeek) => {
    updateConfig({ ...config, groceryShoppingDay: day });
  };

  const handleTimeChange = (field: keyof NotificationConfig, value: string) => {
    updateConfig({ ...config, [field]: value });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-modal-title"
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
              <div className="w-11 h-11 rounded-2xl bg-amber-300 border-2 border-stone-900 shadow-brutal-sm flex items-center justify-center text-stone-900 shrink-0">
                <BellRinging size={22} weight="duotone" />
              </div>
              <div>
                <h3 id="notification-modal-title" className="text-lg sm:text-xl font-display font-black tracking-tight text-stone-900">
                  Your Meal Reminders
                </h3>
                <p className="text-xs text-stone-600 mt-0.5 font-medium">
                  Gentle nudges so you never get lost in work and skip eating.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close notification settings"
              className="p-2 rounded-xl border-2 border-stone-900 bg-white shadow-brutal-sm hover:bg-stone-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar modal-scroll-contain p-5 sm:p-6 space-y-4 min-h-0">
            {/* Status & Master Toggle */}
            <div className="p-4 rounded-2xl bg-white border-2 border-stone-900 shadow-brutal-sm flex items-center justify-between gap-3">
              <div>
                <span className="text-sm font-bold text-stone-900 block">
                  Eat-on-Time Alerts
                </span>
                <span className="text-xs text-stone-500">
                  {permission === "granted" && config.enabled
                    ? "Active & watching your meal windows"
                    : permission === "denied"
                    ? "Notifications blocked in browser settings"
                    : "Turn on to receive reminders"}
                </span>
              </div>
              <button
                onClick={handleToggleEnabled}
                className={`shrink-0 px-4 py-2 rounded-xl font-bold text-xs border-2 border-stone-900 shadow-brutal-sm transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                  config.enabled && permission === "granted"
                    ? "bg-emerald-300 text-stone-900"
                    : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                }`}
              >
                {config.enabled && permission === "granted" ? "Enabled" : "Enable"}
              </button>
            </div>

            {/* Smart Missing Item Grocery Nudges Toggle */}
            <div className="p-4 rounded-2xl bg-white border-2 border-stone-900 shadow-brutal-sm flex items-center justify-between gap-3">
              <div className="space-y-0.5 min-w-0">
                <span className="text-sm font-bold text-stone-900 block">
                  Smart Grocery &amp; Missing Item Nudges
                </span>
                <span className="text-xs text-stone-500 leading-snug block">
                  Attaches friendly reminders for out-of-stock upgrades (like apples for oats or greens for stew).
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleGroceryNudges}
                className={`shrink-0 px-4 py-2 rounded-xl font-bold text-xs border-2 border-stone-900 shadow-brutal-sm transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                  config.includeGroceryNudges
                    ? "bg-purple-300 text-stone-900"
                    : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                }`}
              >
                {config.includeGroceryNudges ? "Active" : "Off"}
              </button>
            </div>

            {/* Pantry Update Reminder Card */}
            <div className="p-4 rounded-2xl bg-white border-2 border-stone-900 shadow-brutal-sm space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-200 border-2 border-stone-900 text-stone-900 flex items-center justify-center shrink-0 shadow-xs">
                    <Package size={18} weight="bold" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-sm font-bold text-stone-900 block">
                      Pantry Update Reminders
                    </span>
                    <span className="text-xs text-stone-500 leading-snug block">
                      Gentle prompt to refresh what ingredients you currently have.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePantryAudit}
                  className={`shrink-0 px-4 py-2 rounded-xl font-bold text-xs border-2 border-stone-900 shadow-brutal-sm transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                    config.pantryAuditReminder
                      ? "bg-emerald-300 text-stone-900"
                      : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                  }`}
                >
                  {config.pantryAuditReminder ? "Active" : "Off"}
                </button>
              </div>

              {config.pantryAuditReminder && (
                <ReminderPicker
                  frequency={config.pantryAuditFrequency}
                  day={config.pantryAuditDay}
                  onFrequencyChange={handlePantryFrequencyChange}
                  onDayChange={handlePantryDayChange}
                  dayPromptLabel="Which day for pantry check?"
                />
              )}
            </div>

            {/* Grocery Shopping Reminder Card */}
            <div className="p-4 rounded-2xl bg-white border-2 border-stone-900 shadow-brutal-sm space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-purple-200 border-2 border-stone-900 text-stone-900 flex items-center justify-center shrink-0 shadow-xs">
                    <ShoppingCartSimple size={18} weight="bold" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-sm font-bold text-stone-900 block">
                      Grocery Shopping Reminders
                    </span>
                    <span className="text-xs text-stone-500 leading-snug block">
                      Reminds you when it is time to hit the market or grocery store.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleGroceryShopping}
                  className={`shrink-0 px-4 py-2 rounded-xl font-bold text-xs border-2 border-stone-900 shadow-brutal-sm transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                    config.groceryShoppingReminder
                      ? "bg-purple-300 text-stone-900"
                      : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                  }`}
                >
                  {config.groceryShoppingReminder ? "Active" : "Off"}
                </button>
              </div>

              {config.groceryShoppingReminder && (
                <ReminderPicker
                  frequency={config.groceryShoppingFrequency}
                  day={config.groceryShoppingDay}
                  onFrequencyChange={handleGroceryFrequencyChange}
                  onDayChange={handleGroceryDayChange}
                  dayPromptLabel="Which day for grocery run?"
                />
              )}
            </div>

            {/* Schedule Times */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Daily Meal Windows
              </label>

              <div className="grid grid-cols-2 gap-3">
                {MEAL_TIME_FIELDS.map((field) => (
                  <div key={field.key} className={`p-3 sm:p-3.5 ${field.bg} border-2 border-stone-900 rounded-2xl shadow-brutal-sm flex flex-col justify-between gap-2`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-stone-900">{field.label}</span>
                      <Sparkle size={13} className={field.iconColor} />
                    </div>
                    <div className="relative flex items-center justify-center gap-1.5 py-2 px-3 bg-white border-2 border-stone-900 rounded-xl shadow-xs hover:bg-stone-50 active:translate-y-[1px] cursor-pointer transition-all">
                      <Clock size={14} weight="bold" className="text-stone-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-black text-stone-900 tracking-tight">
                        {formatTime12h(config[field.key] as string)}
                      </span>
                      <input
                        type="time"
                        value={config[field.key] as string}
                        onChange={(e) => handleTimeChange(field.key, e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        aria-label={`${field.label} reminder time`}
                      />
                    </div>
                  </div>
                ))}

                {config.includeGroceryNudges && (
                  <div className="p-3.5 bg-stone-100 border-2 border-stone-900 rounded-2xl shadow-brutal-sm col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-stone-900">Market / Restock Prep Window</span>
                        <Sparkle size={13} className="text-stone-600 shrink-0" />
                      </div>
                      <span className="text-[11px] text-stone-500 font-medium block">
                        Reminder to review supplies before grocery runs
                      </span>
                    </div>
                    <div className="relative flex items-center justify-center gap-1.5 py-2 px-3.5 bg-white border-2 border-stone-900 rounded-xl shadow-xs hover:bg-stone-50 active:translate-y-[1px] cursor-pointer transition-all shrink-0">
                      <Clock size={14} weight="bold" className="text-stone-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-black text-stone-900 tracking-tight">
                        {formatTime12h(config.groceryReminderTime || "10:30")}
                      </span>
                      <input
                        type="time"
                        value={config.groceryReminderTime || "10:30"}
                        onChange={(e) => handleTimeChange("groceryReminderTime", e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                        aria-label="Market restock reminder time"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pinned Footer */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-stone-900 bg-stone-100/90 shrink-0 flex items-center justify-end gap-3 safe-area-bottom">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-2.5 rounded-xl font-bold text-xs bg-stone-900 text-white border-2 border-stone-900 shadow-brutal-sm hover:bg-stone-800 transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
