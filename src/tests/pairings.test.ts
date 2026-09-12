import { describe, expect, it } from "vitest";
import {
  getComboNutrientTags,
  suggestNutrientAwareCombo,
} from "../lib/nutrient-curation";
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

describe("Nutrient Curation Engine", () => {
  const nutrientIngredients: Ingredient[] = [
    {
      id: "oats",
      name: "Rolled Oats",
      role: "Main",
      mealTypes: ["Breakfast"],
      owner: "Esther",
      available: true,
      nutrientTags: ["High Fiber", "High Carb"],
    },
    {
      id: "toast",
      name: "White Bread",
      role: "Main",
      mealTypes: ["Breakfast"],
      owner: "Esther",
      available: true,
      nutrientTags: ["High Carb"],
    },
    {
      id: "greek-yogurt",
      name: "Greek Yogurt",
      role: "Protein",
      mealTypes: ["Breakfast"],
      owner: "Esther",
      available: true,
      nutrientTags: ["High Protein"],
    },
    {
      id: "egg",
      name: "Boiled Egg",
      role: "Protein",
      mealTypes: ["Breakfast"],
      owner: "Esther",
      available: true,
      nutrientTags: ["High Protein", "High Fat"],
    },
    {
      id: "chia",
      name: "Chia Seeds",
      role: "Supplementary",
      mealTypes: ["Breakfast"],
      owner: "Esther",
      available: true,
      nutrientTags: ["High Fiber", "High Fat"],
    },
  ];

  it("combines and deduplicates nutrient tags across assembled combo", () => {
    const main = nutrientIngredients.find((i) => i.id === "oats")!;
    const protein = nutrientIngredients.find((i) => i.id === "greek-yogurt")!;
    const side = nutrientIngredients.find((i) => i.id === "chia")!;

    const tags = getComboNutrientTags(main, protein, side);
    expect(tags).toContain("High Fiber");
    expect(tags).toContain("High Carb");
    expect(tags).toContain("High Protein");
    expect(tags).toContain("High Fat");
    expect(new Set(tags).size).toBe(tags.length);
  });

  it("prefers combos covering user nutrient priorities", () => {
    // Only oats has high fiber among mains, and no fiber side is provided
    const ingredientsWithoutSide = nutrientIngredients.filter((i) => i.role !== "Supplementary");
    const mains = ingredientsWithoutSide.filter((i) => i.role === "Main");
    const result = suggestNutrientAwareCombo({
      availableMains: mains,
      allIngredients: ingredientsWithoutSide,
      mealType: "Breakfast",
      nutrientPriorities: ["High Fiber", "High Protein"],
    });

    expect(result).toBeDefined();
    expect(result?.main.name).toBe("Rolled Oats");
    expect(result?.matchedPriorities).toContain("High Fiber");
    expect(result?.matchedPriorities).toContain("High Protein");
  });

  it("breaks ties with culinary affinity when priority coverage is equal", () => {
    // Toast with Fresh Egg (affinity match) vs Toast with another protein
    const breadAndProteins: Ingredient[] = [
      {
        id: "bread",
        name: "Sliced Bread",
        role: "Main",
        mealTypes: ["Breakfast"],
        owner: "Esther",
        available: true,
        nutrientTags: ["High Carb"],
      },
      {
        id: "egg",
        name: "Fresh Eggs",
        role: "Protein",
        mealTypes: ["Breakfast"],
        owner: "Esther",
        available: true,
        nutrientTags: ["High Protein"],
      },
      {
        id: "tofu",
        name: "Steamed Tofu",
        role: "Protein",
        mealTypes: ["Breakfast"],
        owner: "Esther",
        available: true,
        nutrientTags: ["High Protein"],
      },
    ];

    const result = suggestNutrientAwareCombo({
      availableMains: [breadAndProteins[0]],
      allIngredients: breadAndProteins,
      mealType: "Breakfast",
      nutrientPriorities: ["High Protein"],
    });

    expect(result).toBeDefined();
    expect(result?.main.name).toBe("Sliced Bread");
    expect(result?.protein?.name).toBe("Fresh Eggs");
  });

  it("falls back cleanly to standard affinity combo when nutrient priorities are empty", () => {
    const mains = nutrientIngredients.filter((i) => i.role === "Main");
    const result = suggestNutrientAwareCombo({
      availableMains: mains,
      allIngredients: nutrientIngredients,
      mealType: "Breakfast",
      nutrientPriorities: [],
    });

    expect(result).toBeDefined();
    expect(result?.matchedPriorities).toHaveLength(0);
  });

  it("never returns null or blocks suggestions when priorities cannot be satisfied", () => {
    const toastOnly = [nutrientIngredients.find((i) => i.id === "toast")!];
    const result = suggestNutrientAwareCombo({
      availableMains: toastOnly,
      allIngredients: toastOnly,
      mealType: "Breakfast",
      nutrientPriorities: ["High Protein", "High Fat"],
    });

    expect(result).toBeDefined();
    expect(result?.main.name).toBe("White Bread");
    expect(result?.matchedPriorities).toHaveLength(0);
  });
});
