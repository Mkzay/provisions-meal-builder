"use client";

import { ChartLineUp, Plus, TrashSimple } from "@/components/icons";
import {
  addClientWeightLog,
  deleteClientWeightLog,
  fetchClientWeightLogs,
  getCurrentOwner,
} from "@/lib/profile-storage";
import { WeightLogEntry } from "@/lib/types";
import React, { useEffect, useState } from "react";

interface ProgressLogSectionProps {
  owner?: string;
}

export const ProgressLogSection: React.FC<ProgressLogSectionProps> = ({
  owner: propOwner,
}) => {
  const owner = propOwner || getCurrentOwner();
  const [logs, setLogs] = useState<WeightLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dateInput, setDateInput] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [weightInput, setWeightInput] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    fetchClientWeightLogs(owner)
      .then((data) => {
        if (active) setLogs(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    setDateInput(new Date().toISOString().slice(0, 10));
    setWeightInput("");
    return () => {
      active = false;
    };
  }, [owner]);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (isNaN(val) || val <= 0) return;

    setIsSubmitting(true);
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(10);
    }

    const res = await addClientWeightLog({
      owner,
      date: dateInput,
      weight: val,
    });

    setIsSubmitting(false);
    if (res.success) {
      setLogs((prev) => [res.entry, ...prev]);
      setWeightInput("");
      setShowAddForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const res = await deleteClientWeightLog(id);
    setDeletingId(null);
    if (res.success) {
      setLogs((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  const getEntryDelta = (index: number) => {
    if (index >= logs.length - 1) return null;
    const current = logs[index].weight;
    const previous = logs[index + 1].weight;
    return Math.round((current - previous) * 10) / 10;
  };

  const latestEntry = logs[0];
  const oldestEntry = logs[logs.length - 1];
  const overallDelta =
    logs.length > 1
      ? Math.round((latestEntry.weight - oldestEntry.weight) * 10) / 10
      : null;

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      {logs.length > 0 && (
        <div className="p-4 bg-white rounded-2xl border-2 border-stone-900 shadow-brutal-xs flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
              Current Weight
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl sm:text-3xl font-display font-black text-stone-900">
                {latestEntry.weight}
              </span>
              <span className="text-xs font-bold text-stone-600">
                {latestEntry.unit}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
              Total Change
            </span>
            {overallDelta !== null ? (
              <span
                className={`inline-block mt-0.5 text-xs font-black px-2.5 py-0.5 rounded-lg border border-stone-900/30 ${
                  overallDelta > 0
                    ? "bg-amber-200 text-stone-900"
                    : overallDelta < 0
                    ? "bg-emerald-200 text-stone-900"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {overallDelta > 0 ? `+${overallDelta}` : overallDelta} {latestEntry.unit}
              </span>
            ) : (
              <span className="text-xs text-stone-400 font-bold block mt-0.5">
                First weigh-in
              </span>
            )}
          </div>
        </div>
      )}

      {/* Quick Add Form Section */}
      <div className="p-4 bg-amber-50 rounded-2xl border-2 border-stone-900 shadow-brutal-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-stone-900">
            Log New Weigh-In
          </span>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs font-bold text-stone-700 underline underline-offset-2"
          >
            {showAddForm ? "Hide form" : "+ Add entry"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddEntry} className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full bg-white border-2 border-stone-900 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-900"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-stone-600 block mb-1">
                  Weight
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    placeholder="58.5"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="w-full bg-white border-2 border-stone-900 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-900"
                    required
                  />
                  <span className="px-2.5 py-1.5 rounded-xl border-2 border-stone-900 bg-stone-100 text-xs font-black shrink-0 shadow-xs">
                    kg
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 px-4 rounded-xl font-black text-xs border-2 border-stone-900 shadow-brutal-xs flex items-center justify-center gap-2 active:translate-x-0.5 active:translate-y-0.5 ${
                isSubmitting
                  ? "bg-amber-200 text-stone-700 cursor-wait"
                  : "bg-emerald-400 hover:bg-emerald-300 text-stone-900"
              }`}
            >
              <Plus size={14} weight="bold" />
              <span>{isSubmitting ? "Saving to Notion..." : "Save Weigh-In to Notion"}</span>
            </button>
          </form>
        )}
      </div>

      {/* Past Entries */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Past Weigh-Ins ({logs.length})
          </span>
        </div>

        {isLoading && logs.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border-2 border-stone-200 space-y-2">
            <span className="text-xs font-bold text-stone-500 animate-pulse">
              Syncing with Notion...
            </span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-2xl border-2 border-dashed border-stone-300 space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 border border-stone-300 flex items-center justify-center mx-auto text-purple-700">
              <ChartLineUp size={20} weight="bold" />
            </div>
            <h4 className="text-sm font-bold text-stone-800">
              No weigh-ins recorded yet
            </h4>
            <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
              Track your weight at your own pace without pressure or fitness tracking suites.
            </p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-300 border-2 border-stone-900 text-xs font-black shadow-brutal-xs"
            >
              <Plus size={13} weight="bold" />
              <span>Log First Weight</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2 max-h-[38vh] overflow-y-auto no-scrollbar pr-0.5">
            {logs.map((entry, idx) => {
              const delta = getEntryDelta(idx);
              const isDeleting = deletingId === entry.id;
              return (
                <div
                  key={entry.id}
                  className={`p-3 bg-white rounded-2xl border-2 border-stone-900 shadow-brutal-xs flex items-center justify-between gap-3 transition-opacity ${
                    isDeleting ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 border border-stone-900 flex items-center justify-center text-xs font-black text-stone-700">
                      #{logs.length - idx}
                    </div>
                    <div>
                      <span className="text-sm font-black text-stone-900 block">
                        {entry.weight} {entry.unit || "kg"}
                      </span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {entry.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {delta !== null && (
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md border border-stone-900/30 ${
                          delta > 0
                            ? "bg-amber-200 text-stone-900"
                            : delta < 0
                            ? "bg-emerald-200 text-stone-900"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      disabled={isDeleting}
                      aria-label={`Delete entry for ${entry.date}`}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors disabled:opacity-40"
                    >
                      <TrashSimple size={15} weight="bold" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
