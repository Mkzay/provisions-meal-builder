import { describe, expect, it } from "vitest";
import {
  calculateFeedbackScore,
  suggestNutrientAwareCombo,
} from "../lib/nutrient-curation";
import { Ingredient, RatedMealRecord } from "../lib/types";

describe("Feedback-Weighted Scoring & Nutrient Curation", () => {
  const stock: Ingredient[] = [
    { id: "yam", name: "Yam (Tuber / Raw Slices)", role: "Main", mealTypes: ["Breakfast", "Lunch", "Dinner"], owner: "Esther", available: true },
    { id: "rice", name: "White Rice (Long Grain)", role: "Main", mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true },
    { id: "eggs", name: "Fresh Eggs", role: "Protein", mealTypes: ["Breakfast", "Lunch", "Dinner"], owner: "Esther", available: true },
    { id: "beef", name: "Lean Beef / Stew Beef", role: "Protein", mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true },
    { id: "dodo", name: "Fried Sweet Plantains (Dodo)", role: "Supplementary", mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true },
  ];

  const yam = stock.find((i) => i.id === "yam")!;
  const rice = stock.find((i) => i.id === "rice")!;
  const eggs = stock.find((i) => i.id === "eggs")!;
  const beef = stock.find((i) => i.id === "beef")!;

  describe("calculateFeedbackScore", () => {
    it("returns 0 for cold start when rated history is empty or combo is unrated", () => {
      expect(calculateFeedbackScore(yam, eggs, [])).toBe(0);
      expect(calculateFeedbackScore(yam, eggs, undefined)).toBe(0);

      const unrelatedHistory: RatedMealRecord[] = [
        { baseName: "Spaghetti", proteinName: "Fish", rating: "Liked", owner: "Esther" },
      ];
      expect(calculateFeedbackScore(yam, eggs, unrelatedHistory)).toBe(0);
    });

    it("returns positive bounded score (+1.5) for liked meals", () => {
      const history: RatedMealRecord[] = [
        { baseName: "Yam (Tuber / Raw Slices)", proteinName: "Fresh Eggs", rating: "Liked", owner: "Esther" },
      ];
      const score = calculateFeedbackScore(yam, eggs, history);
      expect(score).toBeGreaterThanOrEqual(1.5);
      expect(score).toBeLessThanOrEqual(2.5);
    });

    it("returns bounded penalty (-2.0) for disliked meals", () => {
      const history: RatedMealRecord[] = [
        { baseName: "Yam (Tuber / Raw Slices)", proteinName: "Lean Beef / Stew Beef", rating: "Disliked", owner: "Esther" },
      ];
      const score = calculateFeedbackScore(yam, beef, history);
      expect(score).toBeLessThanOrEqual(-2.0);
      expect(score).toBeGreaterThanOrEqual(-3.5);
    });

    it("normalizes ingredient names across raw tokens and clean names", () => {
      const history: RatedMealRecord[] = [
        { baseName: "Yam", proteinName: "Eggs", rating: "Liked", owner: "Esther" },
      ];
      const score = calculateFeedbackScore(yam, eggs, history);
      expect(score).toBeGreaterThanOrEqual(1.5);
    });
  });

  describe("suggestNutrientAwareCombo with Feedback History", () => {
    it("suggests meal seamlessly with cold-start (empty rated history)", () => {
      const result = suggestNutrientAwareCombo({
        availableMains: [yam],
        allIngredients: stock,
        mealType: "Breakfast",
        ratedHistory: [],
      });

      expect(result).not.toBeNull();
      expect(result?.main.name).toContain("Yam");
    });

    it("deprioritizes disliked combos in favor of unrated or liked combos", () => {
      // Both Yam and Rice available. Yam + Eggs is Disliked, Rice + Beef is unrated
      const history: RatedMealRecord[] = [
        { baseName: "Yam", proteinName: "Fresh Eggs", rating: "Disliked", owner: "Esther" },
      ];

      // Run multiple times to verify Yam + Eggs is not chosen when Rice is available
      let yamEggsChosen = false;
      for (let i = 0; i < 10; i++) {
        const result = suggestNutrientAwareCombo({
          availableMains: [yam, rice],
          allIngredients: stock,
          mealType: "Lunch",
          ratedHistory: history,
        });
        if (result?.main.id === "yam" && result?.protein?.id === "eggs") {
          yamEggsChosen = true;
        }
      }
      expect(yamEggsChosen).toBe(false);
    });

    it("NEVER hard-excludes disliked combos if they are the ONLY option in stock", () => {
      // ONLY Yam is available as main, and ONLY Beef as protein. User disliked it.
      const history: RatedMealRecord[] = [
        { baseName: "Yam", proteinName: "Lean Beef / Stew Beef", rating: "Disliked", owner: "Esther" },
      ];

      const result = suggestNutrientAwareCombo({
        availableMains: [yam],
        allIngredients: [yam, beef],
        mealType: "Dinner",
        ratedHistory: history,
      });

      // Crucial requirement: Must STILL suggest it, never return null!
      expect(result).not.toBeNull();
      expect(result?.main.id).toBe("yam");
      expect(result?.protein?.id).toBe("beef");
    });

    it("isolates ratings by owner: Esther ratings do not affect Oluranti", () => {
      const history: RatedMealRecord[] = [
        // Esther liked Yam + Eggs
        { baseName: "Yam", proteinName: "Fresh Eggs", rating: "Liked", owner: "Esther" },
        // Oluranti disliked Yam + Eggs
        { baseName: "Yam", proteinName: "Fresh Eggs", rating: "Disliked", owner: "Oluranti" },
      ];

      const estherHistory = history.filter((h) => h.owner === "Esther");
      const olurantiHistory = history.filter((h) => h.owner === "Oluranti");

      expect(calculateFeedbackScore(yam, eggs, estherHistory)).toBeGreaterThanOrEqual(1.5);
      expect(calculateFeedbackScore(yam, eggs, olurantiHistory)).toBeLessThanOrEqual(-2.0);
    });

    it("ensures favorite combos do not monopolize suggestions (variety tie-breaking)", () => {
      // Both Yam + Eggs and Rice + Beef are Liked
      const history: RatedMealRecord[] = [
        { baseName: "Yam", proteinName: "Fresh Eggs", rating: "Liked", owner: "Esther" },
        { baseName: "White Rice", proteinName: "Lean Beef / Stew Beef", rating: "Liked", owner: "Esther" },
      ];

      const selectedMains = new Set<string>();
      // Over 25 runs, both top liked combos should be selected
      for (let i = 0; i < 25; i++) {
        const result = suggestNutrientAwareCombo({
          availableMains: [yam, rice],
          allIngredients: stock,
          mealType: "Lunch",
          ratedHistory: history,
        });
        if (result?.main.id) {
          selectedMains.add(result.main.id);
        }
      }

      // Both should have been picked at least once across 25 runs
      expect(selectedMains.has("yam")).toBe(true);
      expect(selectedMains.has("rice")).toBe(true);
    });
  });
});
