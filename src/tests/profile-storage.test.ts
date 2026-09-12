import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addClientWeightLog,
  deleteClientWeightLog,
  fetchClientProfile,
  fetchClientWeightLogs,
  getCurrentOwner,
  getDefaultGoalForOwner,
  hasProfilePromptBeenDismissed,
  saveClientProfile,
  setProfilePromptDismissed,
} from "../lib/profile-storage";

describe("Profile & Progress Client Logic (Notion API backed, zero localStorage)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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

  describe("Session-only Onboarding Prompt Dismissal", () => {
    it("tracks in-memory session dismissal without writing to localStorage", () => {
      setProfilePromptDismissed();
      expect(hasProfilePromptBeenDismissed()).toBe(true);
    });
  });

  describe("Client API Fetchers (calling server API routes)", () => {
    it("fetches profile from /api/notion/profile", async () => {
      const mockProfile = {
        id: "profile-1",
        owner: "Esther",
        goal: "Gain weight",
        height: 168,
      };

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ profile: mockProfile }),
      } as any);

      const profile = await fetchClientProfile("Esther");
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/notion/profile?owner=Esther",
        expect.objectContaining({ cache: "no-store" })
      );
      expect(profile).toEqual(mockProfile);
    });

    it("saves profile via POST /api/notion/profile", async () => {
      const mockSaved = {
        owner: "Esther",
        goal: "Gain weight" as const,
        height: 168,
      };

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, profile: mockSaved }),
      } as any);

      const result = await saveClientProfile(mockSaved);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/notion/profile",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
      expect(result.success).toBe(true);
      expect(result.profile.goal).toBe("Gain weight");
    });

    it("fetches weight logs from /api/notion/progress-log", async () => {
      const mockLogs = [
        { id: "wt-1", owner: "Esther", date: "2026-09-12", weight: 58.5, unit: "kg" },
      ];

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ logs: mockLogs }),
      } as any);

      const logs = await fetchClientWeightLogs("Esther");
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/notion/progress-log?owner=Esther");
      expect(logs).toEqual(mockLogs);
    });

    it("adds weight log via POST /api/notion/progress-log", async () => {
      const mockEntry = {
        id: "wt-created-1",
        owner: "Esther",
        date: "2026-09-12",
        weight: 58.5,
        unit: "kg",
      };

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, entry: mockEntry }),
      } as any);

      const result = await addClientWeightLog({
        owner: "Esther",
        date: "2026-09-12",
        weight: 58.5,
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/notion/progress-log",
        expect.objectContaining({
          method: "POST",
        })
      );
      expect(result.success).toBe(true);
      expect(result.entry.id).toBe("wt-created-1");
    });

    it("deletes weight log via DELETE /api/notion/progress-log", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as any);

      const result = await deleteClientWeightLog("wt-to-delete");
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/notion/progress-log?id=wt-to-delete",
        expect.objectContaining({
          method: "DELETE",
        })
      );
      expect(result.success).toBe(true);
    });
  });
});
