"use client";

import { DayOfWeek, ReminderFrequency } from "@/lib/types";
import React from "react";

export const FREQUENCY_OPTIONS: { id: ReminderFrequency; label: string }[] = [
  { id: "every_3_days", label: "Every 3 days" },
  { id: "weekly", label: "Once a week" },
  { id: "biweekly", label: "Every 2 weeks" },
];

export const DAYS_OF_WEEK: { id: DayOfWeek; label: string; short: string }[] = [
  { id: "monday", label: "Monday", short: "Mon" },
  { id: "tuesday", label: "Tuesday", short: "Tue" },
  { id: "wednesday", label: "Wednesday", short: "Wed" },
  { id: "thursday", label: "Thursday", short: "Thu" },
  { id: "friday", label: "Friday", short: "Fri" },
  { id: "saturday", label: "Saturday", short: "Sat" },
  { id: "sunday", label: "Sunday", short: "Sun" },
];

interface ReminderPickerProps {
  frequency: ReminderFrequency;
  day?: DayOfWeek;
  onFrequencyChange: (freq: ReminderFrequency) => void;
  onDayChange: (day: DayOfWeek) => void;
  dayPromptLabel?: string;
}

export const ReminderPicker: React.FC<ReminderPickerProps> = ({
  frequency,
  day = "sunday",
  onFrequencyChange,
  onDayChange,
  dayPromptLabel = "Which day of the week?",
}) => {
  const showDayPicker = frequency === "weekly" || frequency === "biweekly";

  return (
    <div className="pt-2.5 border-t border-stone-900/15 dark:border-stone-700/60 space-y-3">
      {/* Frequency selector */}
      <div>
        <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300 block mb-1.5">
          How frequently?
        </span>
        <div className="grid grid-cols-3 gap-2">
          {FREQUENCY_OPTIONS.map((opt) => {
            const isSelected = frequency === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onFrequencyChange(opt.id)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold border-2 border-stone-900 dark:border-stone-700 transition-all text-center ${
                  isSelected
                    ? "bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 shadow-brutal-sm dark:shadow-brutal-dark-sm -translate-y-0.5"
                    : "bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 shadow-xs"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional Day-of-Week Picker: Only shown when weekly or biweekly is active to keep modal uncluttered */}
      {showDayPicker && (
        <div className="pt-1.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300">
              {dayPromptLabel}
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md border border-stone-900/20 dark:border-stone-700">
              {DAYS_OF_WEEK.find((d) => d.id === day)?.label || "Sunday"}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {DAYS_OF_WEEK.map((item) => {
              const isSelected = day === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  aria-pressed={isSelected}
                  onClick={() => onDayChange(item.id)}
                  className={`py-2 rounded-xl text-xs font-black border-2 border-stone-900 dark:border-stone-700 transition-all text-center flex items-center justify-center ${
                    isSelected
                      ? "bg-amber-300 dark:bg-amber-400 text-stone-900 dark:text-stone-950 shadow-brutal-sm dark:shadow-brutal-dark-sm -translate-y-0.5"
                      : "bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 shadow-xs"
                  }`}
                >
                  {item.short}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
