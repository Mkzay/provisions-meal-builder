import { describe, expect, it } from "vitest";
import {
  findMatchingDishBlueprint,
  isCookingOil,
  isFruit,
  isSideCompatibleWithBase,
} from "../lib/dish-blueprints";
import { sanitizeMealWithAI } from "../lib/meal-sanitizer";
import { findBestPairings } from "../lib/pairings";
import { Ingredient } from "../lib/types";

describe("Culinary Dish Blueprints & Suggestion Engine", () => {
  const stock: Ingredient[] = [
    { id: "spag", name: "Spaghetti / Pasta", role: "Main", mealTypes: ["Lunch", "Dinner"], owner: "User", available: true },
    { id: "tomatoes", name: "Sliced Tomatoes & Onions", role: "Supplementary", mealTypes: ["Breakfast", "Lunch", "Dinner"], owner: "User", available: true },
    { id: "oil", name: "Extra Virgin Olive Oil", role: "Supplementary", mealTypes: ["Breakfast", "Lunch", "Dinner"], owner: "User", available: true },
    { id: "eggs", name: "Fresh Eggs", role: "Protein", mealTypes: ["Breakfast", "Lunch", "Dinner"], owner: "User", available: true },
    { id: "beef", name: "Lean Beef / Stew Beef", role: "Protein", mealTypes: ["Lunch", "Dinner"], owner: "User", available: true },
    { id: "yam", name: "Yam (Tuber / Raw Slices)", role: "Main", mealTypes: ["Breakfast", "Lunch", "Dinner"], owner: "User", available: true },
    { id: "amala", name: "Amala (Yam Flour / Elubo)", role: "Main", mealTypes: ["Lunch", "Dinner"], owner: "User", available: true },
    { id: "tuwo", name: "Tuwo (Rice / Corn Swallow)", role: "Main", mealTypes: ["Lunch", "Dinner"], owner: "User", available: true },
    { id: "rice", name: "White Rice (Long Grain / Parboiled)", role: "Main", mealTypes: ["Lunch", "Dinner"], owner: "User", available: true },
    { id: "beans", name: "Beans / Honey Beans / Moi Moi", role: "Protein", mealTypes: ["Breakfast", "Lunch", "Dinner"], owner: "User", available: true },
    { id: "plantain", name: "Plantains (Ripe / Green)", role: "Main", mealTypes: ["Breakfast", "Lunch", "Dinner", "Snack"], owner: "User", available: true },
    { id: "custard", name: "Custard Powder / Ogi (Akamu)", role: "Main", mealTypes: ["Breakfast", "Dinner"], owner: "User", available: true },
    { id: "croaker", name: "Croaker Fish (Fresh / Grilled)", role: "Protein", mealTypes: ["Lunch", "Dinner"], owner: "User", available: true },
    { id: "garri", name: "Garri (White / Yellow / Ijebu)", role: "Main", mealTypes: ["Breakfast", "Lunch", "Dinner", "Snack"], owner: "User", available: true },
    { id: "groundnuts", name: "Roasted Groundnuts / Peanuts", role: "Protein", mealTypes: ["Breakfast", "Lunch", "Snack"], owner: "User", available: true },
    { id: "oats", name: "Rolled Oats / Oatmeal", role: "Main", mealTypes: ["Breakfast", "Snack"], owner: "User", available: true },
    { id: "watermelon", name: "Watermelon", role: "Supplementary", mealTypes: ["Lunch", "Dinner"], owner: "User", available: true },
    { id: "chia", name: "Chia Seeds", role: "Supplementary", mealTypes: ["Breakfast", "Snack"], owner: "User", available: true },
    { id: "milk", name: "Evaporated Milk", role: "Supplementary", mealTypes: ["Breakfast", "Dinner", "Snack"], owner: "User", available: true },
    { id: "ewedu", name: "Ewedu Leaf / Jute Soup", role: "Supplementary", mealTypes: ["Lunch", "Dinner"], owner: "User", available: true },
  ];

  it("identifies cooking oils and fruits correctly", () => {
    expect(isCookingOil({ name: "Extra Virgin Olive Oil" })).toBe(true);
    expect(isCookingOil({ name: "Red Palm Oil (Unrefined)" })).toBe(true);
    expect(isFruit({ name: "Watermelon" })).toBe(true);
    expect(isFruit({ name: "Seedless Grapes" })).toBe(true);
    expect(isFruit({ name: "Amala (Yam Flour / Elubo)" })).toBe(false);
  });

  it("enforces strict side compatibility matrix", () => {
    const amala = stock.find((i) => i.id === "amala")!;
    const yam = stock.find((i) => i.id === "yam")!;
    const oats = stock.find((i) => i.id === "oats")!;
    const custard = stock.find((i) => i.id === "custard")!;
    const watermelon = stock.find((i) => i.id === "watermelon")!;
    const ewedu = stock.find((i) => i.id === "ewedu")!;
    const chia = stock.find((i) => i.id === "chia")!;

    // Watermelon is strictly NOT compatible with Amala or Yam stew
    expect(isSideCompatibleWithBase(watermelon, amala, "Dinner")).toBe(false);
    expect(isSideCompatibleWithBase(watermelon, yam, "Dinner")).toBe(false);

    // Watermelon IS compatible with Breakfast grains (Oats, Custard)
    expect(isSideCompatibleWithBase(watermelon, oats, "Breakfast")).toBe(true);
    expect(isSideCompatibleWithBase(watermelon, custard, "Breakfast")).toBe(true);

    // Ewedu is compatible with Amala, but NOT with Oats
    expect(isSideCompatibleWithBase(ewedu, amala, "Dinner")).toBe(true);
    expect(isSideCompatibleWithBase(ewedu, oats, "Breakfast")).toBe(false);

    // Chia seeds are compatible with Oats, but NOT with Amala
    expect(isSideCompatibleWithBase(chia, oats, "Breakfast")).toBe(true);
    expect(isSideCompatibleWithBase(chia, amala, "Dinner")).toBe(false);
  });

  it("disambiguates Amala from Boiled Yam so curated dish matches anchor base", () => {
    const amala = stock.find((i) => i.id === "amala")!;
    const pairing = findBestPairings(amala, stock, "Dinner");

    // Must NOT suggest Boiled Yam!
    expect(pairing.dishName).not.toContain("Boiled Yam");
    expect(pairing.dishName).toContain("Amala");
    // Watermelon must NOT be selected as a side on Amala
    expect(pairing.recommendedSupplementary?.name).not.toBe("Watermelon");
    expect(pairing.recommendedSupplementaries?.map((s) => s.name)).not.toContain("Watermelon");
  });

  it("disambiguates Tuwo from White Rice stew", () => {
    const tuwo = stock.find((i) => i.id === "tuwo")!;
    const bp = findMatchingDishBlueprint(tuwo, stock, "Dinner");

    expect(bp?.id).toBe("amala-ewedu-stew");
    expect(bp?.name).not.toContain("White Rice");
  });

  it("suggests Rice & Beans Combo when Rice and Beans are in stock", () => {
    const rice = stock.find((i) => i.id === "rice")!;
    const bp = findMatchingDishBlueprint(rice, stock, "Dinner");

    expect(bp?.id).toBe("rice-and-beans");
    const title = bp?.generateTitle(rice, stock.find((i) => i.id === "croaker"));
    expect(title).toContain("Rice & Beans");
  });

  it("curates multiple matching sides for Oatmeal (Chia + Milk + Fruit)", () => {
    const oats = stock.find((i) => i.id === "oats")!;
    const pairing = findBestPairings(oats, stock, "Breakfast");

    expect(pairing.dishName).toContain("Creamy Oatmeal");
    // Multi-side support: should recommend matching sides together
    expect(pairing.recommendedSupplementaries).toBeDefined();
    expect(pairing.recommendedSupplementaries!.length).toBeGreaterThanOrEqual(1);
    const sideNames = pairing.recommendedSupplementaries!.map((s) => s.name);
    expect(sideNames.some((n) => n.includes("Chia") || n.includes("Milk"))).toBe(true);
  });

  it("suggests Custard Bowl with milk and protein for breakfast", () => {
    const custard = stock.find((i) => i.id === "custard")!;
    const pairing = findBestPairings(custard, stock, "Breakfast");

    expect(pairing.dishName).toContain("Custard");
  });

  it("supports Plantain as standalone main", () => {
    const plantain = stock.find((i) => i.id === "plantain")!;
    const bp = findMatchingDishBlueprint(plantain, stock, "Lunch");

    expect(bp?.id).toBe("plantain-dish");
  });

  it("meal-sanitizer falls back silently to null when no API key or on error", async () => {
    const result = await sanitizeMealWithAI(
      {
        main: "Amala (Yam Flour / Elubo)",
        protein: "Croaker Fish",
        supplementary: ["Watermelon"],
        mealType: "Dinner",
      },
      "" // empty key to test silent fallback
    );

    expect(result).toBeNull();
  });
});
