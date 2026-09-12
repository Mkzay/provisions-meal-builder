import { describe, expect, it, vi } from "vitest";
import {
  buildCompanionPrompt,
  fetchOpenRouterNote,
  getDefaultFallbackNote,
} from "../lib/openrouter";

describe("OpenRouter Companion Notes Engine", () => {
  describe("buildCompanionPrompt", () => {
    it("crafts breakfast prompt with user goal and name", () => {
      const prompt = buildCompanionPrompt({
        owner: "Esther",
        goal: "Gain weight",
        mealType: "Breakfast",
      });
      expect(prompt).toContain("Esther");
      expect(prompt).toContain("Gain weight");
      expect(prompt).toContain("Breakfast");
    });

    it("crafts dinner prompt for non-Esther instances", () => {
      const prompt = buildCompanionPrompt({
        owner: "Oluranti",
        goal: "Eat healthier",
        mealType: "Dinner",
      });
      expect(prompt).toContain("Oluranti");
      expect(prompt).toContain("Eat healthier");
      expect(prompt).toContain("Dinner");
    });

    it("includes specific nutrient synergy instructions when user priorities are met", () => {
      const prompt = buildCompanionPrompt({
        owner: "Esther",
        goal: "Eat healthier",
        mealType: "Lunch",
        nutrientPriorities: ["High Fiber", "High Protein"],
        matchedNutrientTags: ["High Fiber", "High Protein", "High Carb"],
        mealTitle: "Honey Beans & Boiled Plantain",
      });
      expect(prompt).toContain("Specific nutritional synergy");
      expect(prompt).toContain("High Fiber and High Protein");
      expect(prompt).toContain("Honey Beans & Boiled Plantain");
    });

    it("instructs not to force nutrient mentions when no priorities match", () => {
      const prompt = buildCompanionPrompt({
        owner: "Esther",
        mealType: "Lunch",
        nutrientPriorities: ["High Fat"],
        matchedNutrientTags: ["High Carb"],
      });
      expect(prompt).toContain("Do NOT force nutrient mentions");
    });
  });

  describe("getDefaultFallbackNote", () => {
    it("provides specific encouragement when nutrient priorities are hit", () => {
      const note = getDefaultFallbackNote("Lunch", "Esther", "Eat healthier", [
        "High Fiber",
        "High Protein",
      ]);
      expect(note).toContain("Good fiber and protein pairing");

      const proteinNote = getDefaultFallbackNote("Lunch", "Esther", "Gain weight", [
        "High Protein",
      ]);
      expect(proteinNote).toContain("protein foundation");
    });
    it("returns reassuring, non-empty text for all meal types", () => {
      const breakfast = getDefaultFallbackNote("Breakfast", "Esther", "Gain weight");
      const lunch = getDefaultFallbackNote("Lunch", "Esther", "Gain weight");
      const dinner = getDefaultFallbackNote("Dinner", "Esther", "Gain weight");
      const snack = getDefaultFallbackNote("Snack", "Esther", "Gain weight");

      expect(breakfast.length).toBeGreaterThan(20);
      expect(lunch.length).toBeGreaterThan(20);
      expect(dinner.length).toBeGreaterThan(20);
      expect(snack.length).toBeGreaterThan(20);
    });
  });

  describe("fetchOpenRouterNote", () => {
    it("returns AI generated note on successful API response", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content:
                  "Morning, Esther! A comforting anchor carb like oats or eggs and toast gives you steady energy for whatever today brings.",
              },
            },
          ],
        }),
      } as any);

      const note = await fetchOpenRouterNote({
        owner: "Esther",
        goal: "Gain weight",
        mealType: "Breakfast",
        apiKey: "test-key",
      });

      expect(note).toContain("Morning, Esther!");
    });

    it("silently falls back to default note when API fails or times out", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network timeout"));

      const note = await fetchOpenRouterNote({
        owner: "Esther",
        goal: "Gain weight",
        mealType: "Breakfast",
        apiKey: "test-key",
      });

      expect(note).toBeDefined();
      expect(note.length).toBeGreaterThan(15);
    });

    it("silently falls back when apiKey is missing", async () => {
      const note = await fetchOpenRouterNote({
        owner: "Esther",
        goal: "Gain weight",
        mealType: "Breakfast",
        apiKey: undefined,
      });

      expect(note).toBeDefined();
      expect(note.length).toBeGreaterThan(15);
    });
  });
});
