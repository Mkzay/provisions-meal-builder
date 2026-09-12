import { beforeEach, describe, expect, it } from "vitest";
import {
  addWeightLog,
  deleteWeightLog,
  getCurrentOwner,
  getDefaultGoalForOwner,
  getStoredProfile,
  getWeightLogs,
  hasProfilePromptBeenDismissed,
  saveStoredProfile,
  setProfilePromptDismissed,
} from "../lib/profile-storage";
import { MealProfile } from "../lib/types";

let storage: Record<string, string> = {};

const mockLocalStorage = {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, val: string) => {
    storage[key] = String(val);
  },
  removeItem: (key: string) => {
    delete storage[key];
  },
  clear: () => {
    storage = {};
  },
};

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

if (typeof window === "undefined") {
  (globalThis as any).window = globalThis;
}

describe("Profile & Progress Storage Logic", () => {
  beforeEach(() => {
    storage = {};
  });

  describe("Owner & Defaults", () => {
    it("returns Esther as default instance owner", () => {
      expect(getCurrentOwner()).toBe("Esther");
    });

    it("defaults goal to 'Gain weight' for Esther", () => {
      expect(getDefaultGoalForOwner("Esther")).toBe("Gain weight");
      expect(getDefaultGoalForOwner("esther")).toBe("Gain weight");
    });

    it("defaults goal to 'Eat healthier' for non-Esther instances", () => {
      expect(getDefaultGoalForOwner("Victor")).toBe("Eat healthier");
      expect(getDefaultGoalForOwner("Alex")).toBe("Eat healthier");
    });
  });

  describe("Meal Profile persistence", () => {
    it("returns null when no profile has been saved", () => {
      expect(getStoredProfile("Esther")).toBeNull();
    });

    it("saves and retrieves profile accurately", () => {
      const profile: MealProfile = {
        owner: "Esther",
        goal: "Gain weight",
        height: "168 cm",
        updatedAt: new Date().toISOString(),
      };

      saveStoredProfile(profile);
      const loaded = getStoredProfile("Esther");
      expect(loaded).toBeDefined();
      expect(loaded?.goal).toBe("Gain weight");
      expect(loaded?.height).toBe("168 cm");
    });

    it("isolates profiles between different instance owners", () => {
      saveStoredProfile({
        owner: "Esther",
        goal: "Gain weight",
        updatedAt: new Date().toISOString(),
      });
      saveStoredProfile({
        owner: "Victor",
        goal: "Lose weight",
        updatedAt: new Date().toISOString(),
      });

      expect(getStoredProfile("Esther")?.goal).toBe("Gain weight");
      expect(getStoredProfile("Victor")?.goal).toBe("Lose weight");
    });

    it("tracks soft onboarding prompt dismissal flag", () => {
      expect(hasProfilePromptBeenDismissed("Esther")).toBe(false);
      setProfilePromptDismissed("Esther");
      expect(hasProfilePromptBeenDismissed("Esther")).toBe(true);
    });
  });

  describe("Weight Log persistence", () => {
    it("returns empty array when no weight logs exist", () => {
      expect(getWeightLogs("Esther")).toEqual([]);
    });

    it("adds weight entries and rounds to 1 decimal place", () => {
      const entry = addWeightLog({
        owner: "Esther",
        date: "2026-09-10",
        weight: 58.456,
        unit: "kg",
      });

      expect(entry.id).toBeDefined();
      expect(entry.weight).toBe(58.5);
      expect(entry.unit).toBe("kg");

      const logs = getWeightLogs("Esther");
      expect(logs).toHaveLength(1);
      expect(logs[0].id).toBe(entry.id);
    });

    it("sorts entries chronologically descending (newest date first)", () => {
      addWeightLog({ owner: "Esther", date: "2026-09-01", weight: 57.0 });
      addWeightLog({ owner: "Esther", date: "2026-09-12", weight: 58.2 });
      addWeightLog({ owner: "Esther", date: "2026-09-05", weight: 57.8 });

      const logs = getWeightLogs("Esther");
      expect(logs).toHaveLength(3);
      expect(logs[0].date).toBe("2026-09-12");
      expect(logs[1].date).toBe("2026-09-05");
      expect(logs[2].date).toBe("2026-09-01");
    });

    it("deletes a weight entry cleanly", () => {
      const e1 = addWeightLog({ owner: "Esther", date: "2026-09-01", weight: 57.0 });
      const e2 = addWeightLog({ owner: "Esther", date: "2026-09-02", weight: 57.2 });

      deleteWeightLog(e1.id, "Esther");
      const logs = getWeightLogs("Esther");
      expect(logs).toHaveLength(1);
      expect(logs[0].id).toBe(e2.id);
    });
  });
});
