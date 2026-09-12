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
  sendTestNudge,
} from "@/lib/notifications";
import { DayOfWeek, NotificationConfig, ReminderFrequency } from "@/lib/types";
import { ReminderPicker } from "@/components/ReminderPickers";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEAL_TIME_FIELDS: { key: keyof NotificationConfig; label: string; bg: string; iconColor: string }[] = [
  { key: "breakfastTime", label: "Breakfast", bg: "bg-amber-50", iconColor: "text-amber-600" },
  { key: "lunchTime", label: "Lunch", bg: "bg-emerald-50", iconColor: "text-emerald-600" },
  { key: "snackTime", label: "Snack", bg: "bg-purple-50", iconColor: "text-purple-600" },
  { key: "dinnerTime", label: "Dinner", bg: "bg-rose-50", iconColor: "text-rose-600" },
];

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [config, setConfig] = useState<NotificationConfig>(getStoredNotificationConfig);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [testSent, setTestSent] = useState(false);

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

  const handleToggleEnabled = async () => {
    if (!config.enabled && permission !== "granted") {
      const res = await requestNotificationPermission();
      setPermission(res);
      if (res === "granted") {
        const updated = { ...config, enabled: true };
        setConfig(updated);
        saveNotificationConfig(updated);
      }
    } else {
      const updated = { ...config, enabled: !config.enabled };
      setConfig(updated);
      saveNotificationConfig(updated);
    }
  };

  const handleToggleGroceryNudges = () => {
    const updated = { ...config, includeGroceryNudges: !config.includeGroceryNudges };
    setConfig(updated);
    saveNotificationConfig(updated);
  };

  const handleTogglePantryAudit = () => {
    const updated = { ...config, pantryAuditReminder: !config.pantryAuditReminder };
    setConfig(updated);
    saveNotificationConfig(updated);
  };

  const handlePantryFrequencyChange = (freq: ReminderFrequency) => {
    const updated = { ...config, pantryAuditFrequency: freq };
    setConfig(updated);
    saveNotificationConfig(updated);
  };

  const handlePantryDayChange = (day: DayOfWeek) => {
    const updated = { ...config, pantryAuditDay: day };
    setConfig(updated);
    saveNotificationConfig(updated);
  };

  const handleToggleGroceryShopping = () => {
    const updated = { ...config, groceryShoppingReminder: !config.groceryShoppingReminder };
    setConfig(updated);
    saveNotificationConfig(updated);
  };

  const handleGroceryFrequencyChange = (freq: ReminderFrequency) => {
    const updated = { ...config, groceryShoppingFrequency: freq };
    setConfig(updated);
    saveNotificationConfig(updated);
  };

  const handleGroceryDayChange = (day: DayOfWeek) => {
    const updated = { ...config, groceryShoppingDay: day };
    setConfig(updated);
    saveNotificationConfig(updated);
  };

  const handleTimeChange = (field: keyof NotificationConfig, value: string) => {
    const updated = { ...config, [field]: value };
    setConfig(updated);
    saveNotificationConfig(updated);
  };

  const handleSendTest = () => {
    if (permission !== "granted") {
      requestNotificationPermission().then((res) => {
        setPermission(res);
        if (res === "granted") {
          sendTestNudge(config.includeGroceryNudges);
          setTestSent(true);
          setTimeout(() => setTestSent(false), 3000);
        }
      });
    } else {
      sendTestNudge(config.includeGroceryNudges);
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
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
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-[#FAF8F5] border-[2.5px] border-stone-900 rounded-t-[28px] sm:rounded-3xl shadow-brutal-lg overflow-hidden"
        >
          {/* Pinned Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b-2 border-stone-900 shrink-0 bg-[#FAF8F5]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-300 border-2 border-stone-900 shadow-brutal-sm flex items-center justify-center text-stone-900 shrink-0">
                <BellRinging size={22} weight="duotone" />
              </div>
              <div>
                <h3 id="notification-modal-title" className="text-lg sm:text-xl font-display font-black tracking-tight text-stone-900">
                  Esther&apos;s Meal Reminders
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
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-6 space-y-4 min-h-0">
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
                  <div key={field.key} className={`p-3 ${field.bg} border-2 border-stone-900 rounded-2xl shadow-brutal-sm`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-stone-900">{field.label}</span>
                      <Sparkle size={14} className={field.iconColor} />
                    </div>
                    <input
                      type="time"
                      value={config[field.key] as string}
                      onChange={(e) => handleTimeChange(field.key, e.target.value)}
                      className="w-full bg-white border-2 border-stone-900 rounded-xl px-2 py-1 text-sm font-bold text-stone-900"
                    />
                  </div>
                ))}

                {config.includeGroceryNudges && (
                  <div className="p-3 bg-stone-100 border-2 border-stone-900 rounded-2xl shadow-brutal-sm col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-stone-900">Market / Restock Prep Window</span>
                      <Sparkle size={14} className="text-stone-700" />
                    </div>
                    <input
                      type="time"
                      value={config.groceryReminderTime || "10:30"}
                      onChange={(e) => handleTimeChange("groceryReminderTime", e.target.value)}
                      className="w-full bg-white border-2 border-stone-900 rounded-xl px-2 py-1 text-sm font-bold text-stone-900"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pinned Footer */}
          <div className="px-5 sm:px-6 py-3.5 border-t-2 border-stone-900 bg-stone-100/90 shrink-0 flex items-center justify-between gap-3 safe-area-bottom">
            <button
              type="button"
              onClick={handleSendTest}
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-900 bg-amber-300 hover:bg-amber-400 border-2 border-stone-900 shadow-brutal-sm px-4 py-2.5 rounded-xl active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            >
              <Bell size={16} weight="bold" />
              <span>{testSent ? "Test Nudge Sent!" : "Send Test Nudge Now"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-stone-900 text-white border-2 border-stone-900 shadow-brutal-sm hover:bg-stone-800 transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
