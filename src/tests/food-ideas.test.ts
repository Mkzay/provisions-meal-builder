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

  it("includes obscure raw staples: Chia seeds, Fennel seeds, Whole milk, Tiger nuts, Greek yogurt", () => {
    const names = FOOD_IDEAS_CATALOGUE.map((i) => i.name.toLowerCase());
    expect(names.some((n) => n.includes("chia"))).toBe(true);
    expect(names.some((n) => n.includes("fennel"))).toBe(true);
    expect(names.some((n) => n.includes("milk"))).toBe(true);
    expect(names.some((n) => n.includes("tiger nuts") || n.includes("ofio"))).toBe(true);
    expect(names.some((n) => n.includes("greek yogurt"))).toBe(true);

    const chia = FOOD_IDEAS_CATALOGUE.find((i) => i.name.toLowerCase().includes("chia"))!;
    expect(chia.nutrientTags).toContain("High Fiber");
    expect(chia.nutrientTags).toContain("High Fat");

    const greekYogurt = FOOD_IDEAS_CATALOGUE.find((i) => i.name.toLowerCase().includes("greek yogurt"))!;
    expect(greekYogurt.nutrientTags).toContain("High Protein");
  });

  it("includes all Nigerian household reference staples from pantry inventory list", () => {
    const names = FOOD_IDEAS_CATALOGUE.map((i) => i.name.toLowerCase());

    // Mains
    expect(names.some((n) => n.includes("amala"))).toBe(true);
    expect(names.some((n) => n.includes("fufu"))).toBe(true);
    expect(names.some((n) => n.includes("tuwo"))).toBe(true);
    expect(names.some((n) => n.includes("cassava"))).toBe(true);
    expect(names.some((n) => n.includes("cocoyam"))).toBe(true);
    expect(names.some((n) => n.includes("wheat meal"))).toBe(true);
    expect(names.some((n) => n.includes("bread"))).toBe(true);
    expect(names.some((n) => n.includes("ofada"))).toBe(true);
    expect(names.some((n) => n.includes("unripe plantain"))).toBe(true);

    // Proteins
    expect(names.some((n) => n.includes("goat meat"))).toBe(true);
    expect(names.some((n) => n.includes("croaker"))).toBe(true);
    expect(names.some((n) => n.includes("catfish"))).toBe(true);
    expect(names.some((n) => n.includes("panla"))).toBe(true);
    expect(names.some((n) => n.includes("turkey"))).toBe(true);
    expect(names.some((n) => n.includes("snail"))).toBe(true);
    expect(names.some((n) => n.includes("shaki"))).toBe(true);
    expect(names.some((n) => n.includes("ponmo"))).toBe(true);
    expect(names.some((n) => n.includes("stockfish"))).toBe(true);
    expect(names.some((n) => n.includes("crayfish"))).toBe(true);
    expect(names.some((n) => n.includes("lentils"))).toBe(true);
    expect(names.some((n) => n.includes("egg whites"))).toBe(true);

    // Vegetables / Supplementary
    expect(names.some((n) => n.includes("ugu"))).toBe(true);
    expect(names.some((n) => n.includes("ewedu"))).toBe(true);
    expect(names.some((n) => n.includes("okra"))).toBe(true);
    expect(names.some((n) => n.includes("bitterleaf"))).toBe(true);
    expect(names.some((n) => n.includes("waterleaf"))).toBe(true);
    expect(names.some((n) => n.includes("efo shoko"))).toBe(true);
    expect(names.some((n) => n.includes("green beans"))).toBe(true);
    expect(names.some((n) => n.includes("palm oil"))).toBe(true);
    expect(names.some((n) => n.includes("iru"))).toBe(true);
    expect(names.some((n) => n.includes("peanut butter"))).toBe(true);

    // Fruits
    expect(names.some((n) => n.includes("banana"))).toBe(true);
    expect(names.some((n) => n.includes("pawpaw"))).toBe(true);
    expect(names.some((n) => n.includes("watermelon"))).toBe(true);
    expect(names.some((n) => n.includes("orange"))).toBe(true);
    expect(names.some((n) => n.includes("pineapple"))).toBe(true);
    expect(names.some((n) => n.includes("mango"))).toBe(true);
    expect(names.some((n) => n.includes("guava"))).toBe(true);
    expect(names.some((n) => n.includes("apple"))).toBe(true);
    expect(names.some((n) => n.includes("coconut"))).toBe(true);

    // Palm oil honestly tagged High Fat
    const palmOil = FOOD_IDEAS_CATALOGUE.find((i) => i.name.toLowerCase().includes("palm oil"))!;
    expect(palmOil.nutrientTags).toContain("High Fat");

    // Amala tagged High Fiber and High Carb
    const amala = FOOD_IDEAS_CATALOGUE.find((i) => i.name.toLowerCase().includes("amala"))!;
    expect(amala.nutrientTags).toContain("High Fiber");
    expect(amala.nutrientTags).toContain("High Carb");

    // Snail tagged High Protein
    const snail = FOOD_IDEAS_CATALOGUE.find((i) => i.name.toLowerCase().includes("snail"))!;
    expect(snail.nutrientTags).toContain("High Protein");
  });

  it("validates that all food ideas have qualitative nutrient tags from allowed set", () => {
    const validTags = new Set(["High Fiber", "High Protein", "High Carb", "High Fat"]);
    for (const idea of FOOD_IDEAS_CATALOGUE) {
      expect(idea.nutrientTags).toBeDefined();
      expect(Array.isArray(idea.nutrientTags)).toBe(true);
      for (const tag of idea.nutrientTags!) {
        expect(validTags.has(tag)).toBe(true);
      }
    }
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
