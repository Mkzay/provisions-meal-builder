import { getDefaultFallbackNote } from "./openrouter";
import { MealType } from "./types";

const NOTE_CACHE_PREFIX = "provisions_companion_note_";
const NOTE_DISMISS_PREFIX = "provisions_note_dismissed_";

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getCachedCompanionNote(
  owner: string,
  mealType: MealType
): string | null {
  if (typeof window === "undefined") return null;
  const key = `${NOTE_CACHE_PREFIX}${owner.toLowerCase()}_${mealType}_${getTodayKey()}`;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setCachedCompanionNote(
  owner: string,
  mealType: MealType,
  note: string
): void {
  if (typeof window === "undefined") return;
  const key = `${NOTE_CACHE_PREFIX}${owner.toLowerCase()}_${mealType}_${getTodayKey()}`;
  try {
    localStorage.setItem(key, note);
  } catch {
    // Ignore storage quota errors
  }
}

export function isNoteDismissedForMealWindow(mealType: MealType): boolean {
  if (typeof window === "undefined") return false;
  const key = `${NOTE_DISMISS_PREFIX}${mealType}_${getTodayKey()}`;
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export function dismissNoteForMealWindow(mealType: MealType): void {
  if (typeof window === "undefined") return;
  const key = `${NOTE_DISMISS_PREFIX}${mealType}_${getTodayKey()}`;
  try {
    localStorage.setItem(key, "true");
  } catch {
    // Ignore
  }
}

export function clearNoteDismissal(mealType: MealType): void {
  if (typeof window === "undefined") return;
  const key = `${NOTE_DISMISS_PREFIX}${mealType}_${getTodayKey()}`;
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

export async function fetchClientCompanionNote(
  owner: string,
  mealType: MealType,
  forceRefresh = false,
  tags?: import("./types").NutrientTag[],
  mealTitle?: string
): Promise<string> {
  const hasSpecificContext = Boolean((tags && tags.length > 0) || mealTitle);
  if (!forceRefresh && !hasSpecificContext) {
    const cached = getCachedCompanionNote(owner, mealType);
    if (cached) return cached;
  }

  try {
    const params = new URLSearchParams({
      owner,
      mealType,
    });
    if (tags && tags.length > 0) {
      params.set("tags", tags.join(","));
    }
    if (mealTitle) {
      params.set("mealTitle", mealTitle);
    }

    const res = await fetch(`/api/companion?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const fallback = getDefaultFallbackNote(mealType, owner, undefined, tags);
      if (!hasSpecificContext) setCachedCompanionNote(owner, mealType, fallback);
      return fallback;
    }

    const data = await res.json();
    const note = data?.note || getDefaultFallbackNote(mealType, owner, undefined, tags);
    if (!hasSpecificContext) setCachedCompanionNote(owner, mealType, note);
    return note;
  } catch {
    const fallback = getDefaultFallbackNote(mealType, owner, undefined, tags);
    if (!hasSpecificContext) setCachedCompanionNote(owner, mealType, fallback);
    return fallback;
  }
}
