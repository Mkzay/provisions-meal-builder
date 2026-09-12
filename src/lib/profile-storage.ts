import { MealProfile, UserGoal, WeightLogEntry } from "./types";

/**
 * Fallback instance owner name when no authenticated session owner is specified.
 */
export function getCurrentOwner(): string {
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

// In-memory transient flag for soft onboarding banner dismissal during active session
let sessionPromptDismissed = false;

export function hasProfilePromptBeenDismissed(_owner?: string): boolean {
  return sessionPromptDismissed;
}

export function setProfilePromptDismissed(_owner?: string): void {
  sessionPromptDismissed = true;
}

/**
 * Client-side API fetchers (calling Notion API routes, zero localStorage)
 */
export async function fetchClientProfile(owner?: string): Promise<MealProfile | null> {
  const targetOwner = owner || getCurrentOwner();
  try {
    const res = await fetch(`/api/notion/profile?owner=${encodeURIComponent(targetOwner)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.profile || null;
  } catch (err) {
    console.error("Failed to fetch client profile:", err);
    return null;
  }
}

export async function saveClientProfile(profile: {
  owner?: string;
  goal: UserGoal;
  height?: number;
}): Promise<{ success: boolean; profile: MealProfile }> {
  const targetOwner = profile.owner || getCurrentOwner();
  try {
    const res = await fetch("/api/notion/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: targetOwner,
        goal: profile.goal,
        height: profile.height,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();
    setProfilePromptDismissed();
    return data;
  } catch (err) {
    console.error("Failed to save client profile:", err);
    return {
      success: false,
      profile: {
        owner: targetOwner,
        goal: profile.goal,
        height: profile.height,
        updatedAt: new Date().toISOString(),
      },
    };
  }
}

export async function fetchClientWeightLogs(owner?: string): Promise<WeightLogEntry[]> {
  const targetOwner = owner || getCurrentOwner();
  try {
    const res = await fetch(`/api/notion/progress-log?owner=${encodeURIComponent(targetOwner)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.error("Failed to fetch client weight logs:", err);
    return [];
  }
}

export async function addClientWeightLog(input: {
  owner?: string;
  date: string;
  weight: number;
  unit?: "kg" | "lbs";
}): Promise<{ success: boolean; entry: WeightLogEntry }> {
  const targetOwner = input.owner || getCurrentOwner();
  const activeUnit = input.unit === "lbs" ? "lbs" : "kg";
  try {
    const res = await fetch("/api/notion/progress-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: targetOwner,
        date: input.date,
        weight: input.weight,
        unit: activeUnit,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to add client weight log:", err);
    return {
      success: false,
      entry: {
        id: `err-${Date.now()}`,
        owner: targetOwner,
        date: input.date,
        weight: input.weight,
        unit: activeUnit,
      },
    };
  }
}

export async function deleteClientWeightLog(id: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/notion/progress-log?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Failed to delete client weight log:", err);
    return { success: false };
  }
}
