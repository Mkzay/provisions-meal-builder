import { describe, expect, it } from "vitest";
import {
  classifyBaseCategory,
  classifySideCategory,
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

  it("dynamically formats curated dish title from the exact anchor base (Ofada vs White vs Basmati Rice)", () => {
    const ofada: Ingredient = {
      id: "ofada",
      name: "Ofada Rice (Unpolished Brown Rice)",
      role: "Main",
      mealTypes: ["Lunch", "Dinner"],
      owner: "User",
      available: true,
    };
    const stockWithoutBeans = stock.filter((i) => i.id !== "beans");
    const pairing = findBestPairings(ofada, [...stockWithoutBeans, ofada], "Lunch");

    // Curated title MUST say "Ofada Rice" and NEVER "White Rice"
    expect(pairing.dishName).toContain("Ofada Rice");
    expect(pairing.dishName).not.toContain("White Rice");
    expect(pairing.dishName).toBe("Ofada Rice & Tomato Stew with Lean Beef / Stew Beef");

    // Test Basmati
    const basmati: Ingredient = {
      id: "basmati",
      name: "Basmati Rice",
      role: "Main",
      mealTypes: ["Lunch", "Dinner"],
      owner: "User",
      available: true,
    };
    const basmatiPairing = findBestPairings(basmati, [...stockWithoutBeans, basmati], "Lunch");
    expect(basmatiPairing.dishName).toContain("Basmati Rice");
    expect(basmatiPairing.dishName).not.toContain("White Rice");
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

  describe("Generalized Category Classification & Compatibility Matrix", () => {
    it("correctly classifies bases into swallow, breakfast_grain, savory_starch, and snack", () => {
      expect(classifyBaseCategory({ name: "Amala (Yam Flour / Elubo)" })).toBe("swallow");
      expect(classifyBaseCategory({ name: "Eba (Yellow Garri)" })).toBe("swallow");
      expect(classifyBaseCategory({ name: "Tuwo Shinkafa" })).toBe("swallow");
      expect(classifyBaseCategory({ name: "Rolled Oats / Oatmeal" })).toBe("breakfast_grain");
      expect(classifyBaseCategory({ name: "Custard Powder / Ogi" })).toBe("breakfast_grain");
      expect(classifyBaseCategory({ name: "Sliced White Bread" })).toBe("breakfast_grain");
      expect(classifyBaseCategory({ name: "White Rice" })).toBe("savory_starch");
      expect(classifyBaseCategory({ name: "Yam (Tuber / Raw Slices)" })).toBe("savory_starch");
      expect(classifyBaseCategory({ name: "Spaghetti / Pasta" })).toBe("savory_starch");
      expect(classifyBaseCategory({ name: "Honey Beans Porridge" })).toBe("savory_starch");
      expect(classifyBaseCategory({ name: "Chin Chin Snack" })).toBe("snack");
    });

    it("correctly classifies sides into standard culinary categories", () => {
      expect(classifySideCategory({ name: "Red Palm Oil (Unrefined)" })).toBe("cooking_oil");
      expect(classifySideCategory({ name: "Cold Pressed Avocado Oil" })).toBe("cooking_oil");
      expect(classifySideCategory({ name: "Dragonfruit Slices" })).toBe("raw_fruit");
      expect(classifySideCategory({ name: "Fresh Strawberries" })).toBe("raw_fruit");
      expect(classifySideCategory({ name: "Ewedu Leaf / Jute Soup" })).toBe("leafy_soup");
      expect(classifySideCategory({ name: "Okra Soup" })).toBe("leafy_soup");
      expect(classifySideCategory({ name: "Organic Honey / Agave" })).toBe("breakfast_sweet_topping");
      expect(classifySideCategory({ name: "Chia Seeds" })).toBe("breakfast_sweet_topping");
      expect(classifySideCategory({ name: "Sliced Tomatoes & Onions" })).toBe("raw_condiment_aromatic");
      expect(classifySideCategory({ name: "Fried Sweet Plantains (Dodo)" })).toBe("savory_side");
    });

    it("automatically enforces category compatibility for newly added unknown ingredients without new blueprints", () => {
      // Newly added fruit: "Golden Papaya"
      const papaya: Ingredient = {
        id: "papaya",
        name: "Golden Papaya Chunks",
        role: "Supplementary",
        mealTypes: ["Breakfast", "Snack"],
        owner: "User",
        available: true,
      };
      // Newly added oil: "Sesame Oil"
      const sesameOil: Ingredient = {
        id: "sesame_oil",
        name: "Toasted Sesame Oil",
        role: "Supplementary",
        mealTypes: ["Lunch", "Dinner"],
        owner: "User",
        available: true,
      };
      // Newly added sweet topping: "Maple Syrup"
      const mapleSyrup: Ingredient = {
        id: "maple_syrup",
        name: "Pure Maple Syrup",
        role: "Supplementary",
        mealTypes: ["Breakfast"],
        owner: "User",
        available: true,
      };

      const amala: Ingredient = {
        id: "amala",
        name: "Amala (Yam Flour)",
        role: "Main",
        mealTypes: ["Lunch", "Dinner"],
        owner: "User",
        available: true,
      };
      const rice: Ingredient = {
        id: "rice",
        name: "Basmati Rice",
        role: "Main",
        mealTypes: ["Lunch", "Dinner"],
        owner: "User",
        available: true,
      };
      const oatmeal: Ingredient = {
        id: "oats",
        name: "Rolled Oatmeal",
        role: "Main",
        mealTypes: ["Breakfast"],
        owner: "User",
        available: true,
      };

      // Cooking oil is NEVER compatible with any base as a side
      expect(isSideCompatibleWithBase(sesameOil, amala)).toBe(false);
      expect(isSideCompatibleWithBase(sesameOil, rice)).toBe(false);
      expect(isSideCompatibleWithBase(sesameOil, oatmeal)).toBe(false);

      // Raw fruit is NOT compatible with swallow or savory starch, but IS compatible with breakfast grain
      expect(isSideCompatibleWithBase(papaya, amala)).toBe(false);
      expect(isSideCompatibleWithBase(papaya, rice)).toBe(false);
      expect(isSideCompatibleWithBase(papaya, oatmeal, "Breakfast")).toBe(true);

      // Sweet topping is NOT compatible with swallow or savory starch, but IS compatible with breakfast grain
      expect(isSideCompatibleWithBase(mapleSyrup, amala)).toBe(false);
      expect(isSideCompatibleWithBase(mapleSyrup, rice)).toBe(false);
      expect(isSideCompatibleWithBase(mapleSyrup, oatmeal, "Breakfast")).toBe(true);
    });
  });

  describe("Expanded Authentic Blueprints", () => {
    it("requires peppersoup spice to trigger Nigerian Peppersoup Pot", () => {
      const yam: Ingredient = { id: "yam", name: "Yam (Tuber / Raw Slices)", role: "Main", available: true };
      const chicken: Ingredient = { id: "chk", name: "Chicken Breast", role: "Protein", available: true };
      const spice: Ingredient = { id: "spice", name: "Peppersoup Spice Blend", role: "Supplementary", available: true };
      const ugwu: Ingredient = { id: "ugwu", name: "Ugwu (Fluted Pumpkin Leaves)", role: "Supplementary", available: true };

      // With peppersoup spice -> matches peppersoup-pot
      const bpWithSpice = findMatchingDishBlueprint(yam, [yam, chicken, spice, ugwu], "Dinner");
      expect(bpWithSpice?.id).toBe("peppersoup-pot");
      expect(bpWithSpice?.generateTitle(yam, chicken, [ugwu])).toContain("Peppersoup with Chicken Breast");
      expect(bpWithSpice?.generateTitle(yam, chicken, [ugwu])).toContain("Shredded Ugwu");

      // Without peppersoup spice -> does NOT match peppersoup-pot
      const bpWithoutSpice = findMatchingDishBlueprint(yam, [yam, chicken, ugwu], "Dinner");
      expect(bpWithoutSpice?.id).not.toBe("peppersoup-pot");
    });

    it("triggers Asaro (Yam Porridge) when palm oil or crayfish are in stock", () => {
      const yam: Ingredient = { id: "yam", name: "Yam Slices", role: "Main", available: true };
      const palmOil: Ingredient = { id: "oil", name: "Pure Red Palm Oil", role: "Supplementary", available: true };
      const fish: Ingredient = { id: "fish", name: "Smoked Titus Fish", role: "Protein", available: true };

      const bp = findMatchingDishBlueprint(yam, [yam, palmOil, fish], "Lunch");
      expect(bp?.id).toBe("asaro-yam-porridge");
      expect(bp?.generateTitle(yam, fish)).toContain("Asaro (Yam Porridge)");
    });

    it("triggers Spiced Nigerian Noodles with toppings", () => {
      const indomie: Ingredient = { id: "indomie", name: "Indomie Instant Noodles", role: "Main", available: true };
      const egg: Ingredient = { id: "egg", name: "Fried Eggs", role: "Protein", available: true };
      const dodo: Ingredient = { id: "dodo", name: "Fried Plantain / Dodo", role: "Supplementary", available: true };

      const bp = findMatchingDishBlueprint(indomie, [indomie, egg, dodo], "Breakfast");
      expect(bp?.id).toBe("spiced-nigerian-noodles");
      expect(bp?.generateTitle(indomie, egg, [dodo])).toContain("Spiced Noodles with Fried Eggs & Fried Plantain");
    });

    it("triggers Nigerian Party Fried Rice with mixed veggies", () => {
      const rice: Ingredient = { id: "rice", name: "White Rice", role: "Main", available: true };
      const veggies: Ingredient = { id: "veg", name: "Sweet Corn & Green Peas", role: "Supplementary", available: true };
      const chicken: Ingredient = { id: "chk", name: "Peppered Chicken", role: "Protein", available: true };

      const bp = findMatchingDishBlueprint(rice, [rice, veggies, chicken], "Lunch");
      expect(bp?.id).toBe("nigerian-fried-rice");
      expect(bp?.generateTitle(rice, chicken)).toContain("Nigerian Fried White Rice with Peppered Chicken");
    });

    it("triggers Plantain Porridge and Ewa Aganyin appropriately", () => {
      const plantain: Ingredient = { id: "pln", name: "Unripe Plantain", role: "Main", available: true };
      const palmOil: Ingredient = { id: "po", name: "Palm Oil", role: "Supplementary", available: true };
      const fish: Ingredient = { id: "fsh", name: "Dried Fish", role: "Protein", available: true };
      const bpPorridge = findMatchingDishBlueprint(plantain, [plantain, palmOil, fish], "Lunch");
      expect(bpPorridge?.id).toBe("plantain-porridge");

      const beans: Ingredient = { id: "bns", name: "Honey Beans", role: "Main", available: true };
      const agege: Ingredient = { id: "brd", name: "Agege Bread", role: "Supplementary", available: true };
      const bpAganyin = findMatchingDishBlueprint(beans, [beans, agege], "Breakfast");
      expect(bpAganyin?.id).toBe("ewa-aganyin-bread");
    });

    it("supports Irish Potatoes as a distinct base", () => {
      const potato: Ingredient = { id: "pot", name: "Irish Potato", role: "Main", available: true };
      const egg: Ingredient = { id: "egg", name: "Fresh Eggs", role: "Protein", available: true };

      const bp = findMatchingDishBlueprint(potato, [potato, egg], "Breakfast");
      expect(bp?.id).toBe("irish-potatoes-savory");
      expect(bp?.generateTitle(potato, egg)).toContain("Boiled Irish Potatoes & Fresh Eggs");
    });
  });
});
