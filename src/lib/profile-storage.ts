import { MealProfile, UserGoal, WeightLogEntry } from "./types";

const PROFILE_STORAGE_KEY_PREFIX = "meal_builder_profile_";
const WEIGHT_STORAGE_KEY_PREFIX = "meal_builder_weight_log_";
const PROMPT_DISMISSED_KEY_PREFIX = "meal_builder_profile_prompt_dismissed_";

/**
 * Returns the configured instance owner, defaulting to Esther.
 * When expanding to other standalone instances (e.g. Victor), setting NEXT_PUBLIC_APP_OWNER
 * isolates data cleanly without multi-user picker complexity.
 */
export function getCurrentOwner(): string {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_APP_OWNER) {
    return process.env.NEXT_PUBLIC_APP_OWNER.trim();
  }
  return "Esther";
}

/**
 * Default goal for the instance owner. For Esther, defaults to "Gain weight".
 * For other owners, defaults to "Eat healthier". Editable anytime.
 */
export function getDefaultGoalForOwner(owner?: string): UserGoal {
  const target = (owner || getCurrentOwner()).trim().toLowerCase();
  if (target === "esther") {
    return "Gain weight";
  }
  return "Eat healthier";
}

export function getStoredProfile(owner?: string): MealProfile | null {
  if (typeof window === "undefined") return null;
  const targetOwner = owner || getCurrentOwner();
  try {
    const raw = localStorage.getItem(`${PROFILE_STORAGE_KEY_PREFIX}${targetOwner}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load meal profile", err);
    return null;
  }
}

export function saveStoredProfile(profile: MealProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${PROFILE_STORAGE_KEY_PREFIX}${profile.owner}`,
      JSON.stringify(profile)
    );
    // Automatically mark the setup prompt as dismissed once saved
    setProfilePromptDismissed(profile.owner);
  } catch (err) {
    console.error("Failed to save meal profile", err);
  }
}

export function hasProfilePromptBeenDismissed(owner?: string): boolean {
  if (typeof window === "undefined") return true;
  const targetOwner = owner || getCurrentOwner();
  try {
    return localStorage.getItem(`${PROMPT_DISMISSED_KEY_PREFIX}${targetOwner}`) === "true";
  } catch {
    return false;
  }
}

export function setProfilePromptDismissed(owner?: string): void {
  if (typeof window === "undefined") return;
  const targetOwner = owner || getCurrentOwner();
  try {
    localStorage.setItem(`${PROMPT_DISMISSED_KEY_PREFIX}${targetOwner}`, "true");
  } catch (err) {
    console.error("Failed to dismiss profile prompt", err);
  }
}

export function getWeightLogs(owner?: string): WeightLogEntry[] {
  if (typeof window === "undefined") return [];
  const targetOwner = owner || getCurrentOwner();
  try {
    const raw = localStorage.getItem(`${WEIGHT_STORAGE_KEY_PREFIX}${targetOwner}`);
    if (!raw) return [];
    const entries: WeightLogEntry[] = JSON.parse(raw);
    return entries.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.createdAt.localeCompare(a.createdAt);
    });
  } catch (err) {
    console.error("Failed to load weight logs", err);
    return [];
  }
}

export function addWeightLog(input: {
  owner?: string;
  date: string;
  weight: number;
  unit?: "kg" | "lbs";
}): WeightLogEntry {
  const targetOwner = input.owner || getCurrentOwner();
  const newEntry: WeightLogEntry = {
    id: `wt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    owner: targetOwner,
    date: input.date,
    weight: Math.round(input.weight * 10) / 10,
    unit: input.unit || "kg",
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const current = getWeightLogs(targetOwner);
      const updated = [newEntry, ...current];
      localStorage.setItem(
        `${WEIGHT_STORAGE_KEY_PREFIX}${targetOwner}`,
        JSON.stringify(updated)
      );
    } catch (err) {
      console.error("Failed to save weight log", err);
    }
  }

  return newEntry;
}

export function deleteWeightLog(id: string, owner?: string): void {
  if (typeof window === "undefined") return;
  const targetOwner = owner || getCurrentOwner();
  try {
    const current = getWeightLogs(targetOwner);
    const updated = current.filter((entry) => entry.id !== id);
    localStorage.setItem(
      `${WEIGHT_STORAGE_KEY_PREFIX}${targetOwner}`,
      JSON.stringify(updated)
    );
  } catch (err) {
    console.error("Failed to delete weight log", err);
  }
}
