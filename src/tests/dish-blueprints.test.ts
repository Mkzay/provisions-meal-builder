import { describe, expect, it } from "vitest";
import { findMatchingDishBlueprint, isCookingOil } from "../lib/dish-blueprints";
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
    { id: "garri", name: "Garri (White / Yellow / Ijebu)", role: "Main", mealTypes: ["Breakfast", "Lunch", "Dinner", "Snack"], owner: "User", available: true },
    { id: "groundnuts", name: "Roasted Groundnuts / Peanuts", role: "Protein", mealTypes: ["Breakfast", "Lunch", "Snack"], owner: "User", available: true },
    { id: "oats", name: "Rolled Oats / Oatmeal", role: "Main", mealTypes: ["Breakfast", "Snack"], owner: "User", available: true },
    { id: "banana", name: "Fresh Banana", role: "Supplementary", mealTypes: ["Breakfast", "Lunch", "Snack"], owner: "User", available: true },
  ];

  it("identifies cooking oils and excludes them from edible standalone sides", () => {
    expect(isCookingOil({ name: "Extra Virgin Olive Oil" })).toBe(true);
    expect(isCookingOil({ name: "Red Palm Oil (Unrefined)" })).toBe(true);
    expect(isCookingOil({ name: "Fresh Banana" })).toBe(false);
    expect(isCookingOil({ name: "Sliced Tomatoes & Onions" })).toBe(false);
  });

  it("matches Jollof Spaghetti when Spaghetti and Tomatoes/Onions are in stock", () => {
    const spag = stock.find((i) => i.id === "spag")!;
    const bp = findMatchingDishBlueprint(spag, stock, "Dinner");

    expect(bp).toBeDefined();
    expect(bp?.id).toBe("jollof-spaghetti");
  });

  it("suggests Jollof Spaghetti with Eggs rather than raw oil when Dinner is selected", () => {
    const spag = stock.find((i) => i.id === "spag")!;
    const pairing = findBestPairings(spag, stock, "Dinner");

    expect(pairing.dishName).toBe("Jollof Spaghetti with Fresh Eggs");
    expect(pairing.culinaryNote).toContain("Simmered pasta in rich, seasoned tomato");
    // Ensure olive oil is NOT in available supplementary sides
    expect(pairing.availableSupplementary.map((s) => s.name)).not.toContain("Extra Virgin Olive Oil");
  });

  it("suggests Boiled Yam & Fresh Egg Sauce when Yam and Eggs are in stock for Breakfast", () => {
    const yam = stock.find((i) => i.id === "yam")!;
    const pairing = findBestPairings(yam, stock, "Breakfast");

    expect(pairing.dishName).toContain("Boiled Yam");
    expect(pairing.recommendedProtein?.name).toBe("Fresh Eggs");
  });

  it("suggests Ijebu Garri with Cold Water & Groundnuts for Lunch", () => {
    const garri = stock.find((i) => i.id === "garri")!;
    const pairing = findBestPairings(garri, stock, "Lunch");

    expect(pairing.dishName).toContain("Ijebu Garri");
    expect(pairing.recommendedProtein?.name).toBe("Roasted Groundnuts / Peanuts");
    expect(pairing.availableSupplementary.map((s) => s.name)).not.toContain("Extra Virgin Olive Oil");
  });

  it("updates dish title dynamically when protein is swapped", () => {
    const spag = stock.find((i) => i.id === "spag")!;
    const beef = stock.find((i) => i.id === "beef")!;
    const bp = findMatchingDishBlueprint(spag, stock, "Dinner")!;

    const titleWithBeef = bp.generateTitle(spag, beef, []);
    expect(titleWithBeef).toBe("Jollof Spaghetti with Lean Beef / Stew Beef");
  });
});
