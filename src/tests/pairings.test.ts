import { describe, expect, it } from "vitest";
import {
  findBestPairings,
  getCleanUpFootprint,
  getFirstStepKickoff,
  getPrepTimeEstimate,
  getSuggestedComboName,
} from "../lib/pairings";
import { Ingredient } from "../lib/types";

describe("Culinary Pairing Logic", () => {
  const mockIngredients: Ingredient[] = [
    {
      id: "ing-rice",
      name: "Basmati Rice",
      role: "Main",
      mealTypes: ["Lunch", "Dinner"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ing-yam",
      name: "Boiled Yam",
      role: "Main",
      mealTypes: ["Breakfast", "Lunch"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ing-bread",
      name: "Sliced Bread",
      role: "Main",
      mealTypes: ["Breakfast"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ing-stew",
      name: "Beef Stew",
      role: "Protein",
      mealTypes: ["Lunch", "Dinner"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ing-egg",
      name: "Fried Egg",
      role: "Protein",
      mealTypes: ["Breakfast", "Lunch", "Dinner"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ing-sardines",
      name: "Canned Sardines",
      role: "Protein",
      mealTypes: ["Breakfast", "Lunch"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ing-dodo",
      name: "Dodo (Fried Plantain)",
      role: "Supplementary",
      mealTypes: ["Lunch", "Dinner"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ing-tea",
      name: "Hot Tea",
      role: "Supplementary",
      mealTypes: ["Breakfast"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ing-fish-unavail",
      name: "Smoked Fish",
      role: "Protein",
      mealTypes: ["Lunch", "Dinner"],
      owner: "Esther",
      available: false,
    },
  ];

  it("prioritizes Beef Stew when Rice is chosen as Main for Lunch", () => {
    const rice = mockIngredients.find((i) => i.id === "ing-rice")!;
    const pairing = findBestPairings(rice, mockIngredients, "Lunch");

    expect(pairing.recommendedProtein).toBeDefined();
    expect(pairing.recommendedProtein?.name).toBe("Beef Stew");
    expect(pairing.availableProteins.map((p) => p.name)).toContain("Beef Stew");
    expect(pairing.availableProteins.map((p) => p.name)).toContain("Fried Egg");
    // Unavailable fish should not be in available list
    expect(pairing.availableProteins.map((p) => p.name)).not.toContain("Smoked Fish");
  });

  it("prioritizes Fried Egg or Sauce when Yam is chosen for Breakfast", () => {
    const yam = mockIngredients.find((i) => i.id === "ing-yam")!;
    const pairing = findBestPairings(yam, mockIngredients, "Breakfast");

    expect(pairing.recommendedProtein).toBeDefined();
    expect(pairing.recommendedProtein?.name).toBe("Fried Egg");
  });

  it("falls back to next available protein if top preferred pairing is unavailable", () => {
    // Make stew unavailable
    const updatedIngredients = mockIngredients.map((ing) =>
      ing.id === "ing-stew" ? { ...ing, available: false } : ing
    );
    const rice = updatedIngredients.find((i) => i.id === "ing-rice")!;
    const pairing = findBestPairings(rice, updatedIngredients, "Lunch");

    expect(pairing.recommendedProtein).toBeDefined();
    expect(pairing.recommendedProtein?.name).toBe("Fried Egg");
  });

  it("handles when no proteins are available gracefully without throwing", () => {
    const onlyMains = mockIngredients.filter((i) => i.role === "Main");
    const rice = onlyMains[0];
    const pairing = findBestPairings(rice, onlyMains, "Lunch");

    expect(pairing.recommendedProtein).toBeUndefined();
    expect(pairing.availableProteins).toHaveLength(0);
  });

  it("generates natural default combo title for leftover packaging", () => {
    const title = getSuggestedComboName("Basmati Rice", "Beef Stew", "Dodo (Fried Plantain)");
    expect(title).toBe("Basmati Rice & Beef Stew with Dodo");

    const simpleTitle = getSuggestedComboName("Boiled Yam", "Fried Egg");
    expect(simpleTitle).toBe("Boiled Yam & Fried Egg");
  });

  it("suggests missing upgrade ingredients like Crisp Apple when Oats is chosen", () => {
    const oats: Ingredient = {
      id: "ing-oats",
      name: "Rolled Oats",
      role: "Main",
      mealTypes: ["Breakfast"],
      owner: "Esther",
      available: true,
    };
    const pairing = findBestPairings(oats, mockIngredients, "Breakfast");
    expect(pairing.missingUpgrades).toBeDefined();
    expect(pairing.missingUpgrades!.length).toBeGreaterThan(0);
    const appleUpgrade = pairing.missingUpgrades!.find((u) => u.name.includes("Apple"));
    expect(appleUpgrade).toBeDefined();
    expect(appleUpgrade?.reason).toContain("apple");
  });

  it("calculates accurate prep time estimates based on cooking requirements", () => {
    const bread = mockIngredients.find((i) => i.id === "ing-bread")!;
    const yam = mockIngredients.find((i) => i.id === "ing-yam")!;
    const egg = mockIngredients.find((i) => i.id === "ing-egg")!;

    expect(getPrepTimeEstimate(bread)).toBe("⚡ 2–3 min assembly");
    expect(getPrepTimeEstimate(yam, egg)).toBe("🍲 12–15 min warm cook");
  });

  it("calculates clean-up footprint correctly", () => {
    const bread = mockIngredients.find((i) => i.id === "ing-bread")!;
    const yam = mockIngredients.find((i) => i.id === "ing-yam")!;
    const egg = mockIngredients.find((i) => i.id === "ing-egg")!;
    const dodo = mockIngredients.find((i) => i.id === "ing-dodo")!;

    expect(getCleanUpFootprint(bread)).toBe("🥣 No Pots (Plate & Eat)");
    expect(getCleanUpFootprint(yam)).toBe("🍲 1 Pot");
    expect(getCleanUpFootprint(yam, egg, dodo)).toBe("🍳 2 Pans");
  });

  it("provides concrete physical first-step kickoff prompt", () => {
    const bread = mockIngredients.find((i) => i.id === "ing-bread")!;
    const yam = mockIngredients.find((i) => i.id === "ing-yam")!;

    expect(getFirstStepKickoff(bread)).toContain("butter knife");
    expect(getFirstStepKickoff(yam)).toContain("pot with water");
  });
});
