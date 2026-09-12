import { describe, expect, it } from "vitest";
import {
  FOOD_IDEAS_CATALOGUE,
  filterFoodIdeas,
} from "../lib/food-ideas-catalogue";

describe("Food Ideas & Inspiration Catalogue", () => {
  it("contains a balanced selection of bases, proteins, sides, and ready meals", () => {
    expect(FOOD_IDEAS_CATALOGUE.length).toBeGreaterThanOrEqual(20);

    const bases = FOOD_IDEAS_CATALOGUE.filter((i) => i.category === "Base");
    const proteins = FOOD_IDEAS_CATALOGUE.filter((i) => i.category === "Protein");
    const sides = FOOD_IDEAS_CATALOGUE.filter((i) => i.category === "Side");
    const readyMeals = FOOD_IDEAS_CATALOGUE.filter((i) => i.category === "ReadyMeal");

    expect(bases.length).toBeGreaterThanOrEqual(5);
    expect(proteins.length).toBeGreaterThanOrEqual(5);
    expect(sides.length).toBeGreaterThanOrEqual(4);
    expect(readyMeals.length).toBeGreaterThanOrEqual(3);
  });

  it("includes representative Nigerian & Global staples without ready-meal proliferation", () => {
    const names = FOOD_IDEAS_CATALOGUE.map((i) => i.name.toLowerCase());
    expect(names.some((n) => n.includes("yam"))).toBe(true);
    expect(names.some((n) => n.includes("plantain"))).toBe(true);
    expect(names.some((n) => n.includes("jollof"))).toBe(true);
    expect(names.some((n) => n.includes("golden morn"))).toBe(true);
    expect(names.some((n) => n.includes("akara mix"))).toBe(true);
    expect(names.some((n) => n.includes("honey beans"))).toBe(true);
    expect(names.some((n) => n.includes("veggies"))).toBe(true);
    // Sourdough bread must be removed
    expect(names.some((n) => n.includes("sourdough"))).toBe(false);
    // Ready meals strictly kept to 4, no new ready made meals added
    const readyMeals = FOOD_IDEAS_CATALOGUE.filter((i) => i.category === "ReadyMeal");
    expect(readyMeals.length).toBe(4);
  });

  describe("filterFoodIdeas", () => {
    it("filters by category", () => {
      const proteinsOnly = filterFoodIdeas(FOOD_IDEAS_CATALOGUE, {
        category: "Protein",
      });
      expect(proteinsOnly.every((i) => i.category === "Protein")).toBe(true);
    });

    it("filters by search query case-insensitively", () => {
      const yamResults = filterFoodIdeas(FOOD_IDEAS_CATALOGUE, {
        query: "yam",
      });
      expect(yamResults.length).toBeGreaterThan(0);
      expect(yamResults.some((i) => i.name.toLowerCase().includes("yam"))).toBe(true);
    });

    it("filters by suitable meal type", () => {
      const breakfastItems = filterFoodIdeas(FOOD_IDEAS_CATALOGUE, {
        mealType: "Breakfast",
      });
      expect(breakfastItems.every((i) => i.suitableMeals.includes("Breakfast"))).toBe(true);
    });
  });
});
