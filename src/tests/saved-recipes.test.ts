import { describe, expect, it } from "vitest";
import {
  buildSavedRecipeProperties,
  parseNotionSavedRecipe,
} from "../lib/notion-recipes";
import {
  findMatchingSavedRecipe,
  suggestNutrientAwareCombo,
} from "../lib/nutrient-curation";
import { CreateSavedRecipeInput, Ingredient, SavedRecipe } from "../lib/types";

describe("Saved Recipes (Database 6 & Personal Suggestion Scoring)", () => {
  const stock: Ingredient[] = [
    { id: "ing-rice", name: "Basmati Rice", role: "Main", mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true },
    { id: "ing-chicken", name: "Grilled Chicken Breast", role: "Protein", mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true },
    { id: "ing-dodo", name: "Fried Sweet Plantains (Dodo)", role: "Supplementary", mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true },
    { id: "ing-yam", name: "Yam (Tuber / Raw Slices)", role: "Main", mealTypes: ["Breakfast", "Lunch"], owner: "Esther", available: true },
    { id: "ing-eggs", name: "Fresh Eggs", role: "Protein", mealTypes: ["Breakfast", "Lunch"], owner: "Esther", available: false }, // out of stock!
  ];

  const rice = stock.find((i) => i.id === "ing-rice")!;
  const chicken = stock.find((i) => i.id === "ing-chicken")!;
  const dodo = stock.find((i) => i.id === "ing-dodo")!;
  const yam = stock.find((i) => i.id === "ing-yam")!;
  const eggs = stock.find((i) => i.id === "ing-eggs")!;

  describe("Notion Database 6 Serialization & Parsing", () => {
    it("builds valid Notion properties for creating a Saved Recipe", () => {
      const input: CreateSavedRecipeInput = {
        name: "Mama's Special Sunday Rice",
        mealTypes: ["Lunch", "Dinner"],
        mainIngredientId: "ing-rice",
        proteinId: "ing-chicken",
        supplementaryId: "ing-dodo",
        owner: "Esther",
        sourceUrl: "https://example.com/sunday-rice",
      };

      const props = buildSavedRecipeProperties(input);
      expect(props.Name.title[0].text.content).toBe("Mama's Special Sunday Rice");
      expect(props["Meal Type"].multi_select).toEqual([{ name: "Lunch" }, { name: "Dinner" }]);
      expect(props["Main Ingredient"].relation).toEqual([{ id: "ing-rice" }]);
      expect(props.Protein.relation).toEqual([{ id: "ing-chicken" }]);
      expect(props.Supplementary.relation).toEqual([{ id: "ing-dodo" }]);
      expect(props.Owner.select.name).toBe("Esther");
      expect(props["Source URL"].url).toBe("https://example.com/sunday-rice");
    });

    it("parses raw Notion page into SavedRecipe with resolved ingredient names", () => {
      const ingredientMap = new Map([
        ["ing-rice", "Basmati Rice"],
        ["ing-chicken", "Grilled Chicken Breast"],
        ["ing-dodo", "Fried Sweet Plantains (Dodo)"],
      ]);

      const rawPage: any = {
        id: "recipe-1",
        created_time: "2026-09-13T10:00:00.000Z",
        properties: {
          Name: { title: [{ plain_text: "Mama's Special Sunday Rice" }] },
          "Meal Type": { multi_select: [{ name: "Lunch" }, { name: "Dinner" }] },
          "Main Ingredient": { relation: [{ id: "ing-rice" }] },
          Protein: { relation: [{ id: "ing-chicken" }] },
          Supplementary: { relation: [{ id: "ing-dodo" }] },
          Owner: { select: { name: "Esther" } },
          "Source URL": { url: "https://example.com/sunday-rice" },
        },
      };

      const recipe = parseNotionSavedRecipe(rawPage, ingredientMap);
      expect(recipe).not.toBeNull();
      expect(recipe?.id).toBe("recipe-1");
      expect(recipe?.name).toBe("Mama's Special Sunday Rice");
      expect(recipe?.mealTypes).toEqual(["Lunch", "Dinner"]);
      expect(recipe?.mainIngredientId).toBe("ing-rice");
      expect(recipe?.mainIngredientName).toBe("Basmati Rice");
      expect(recipe?.proteinId).toBe("ing-chicken");
      expect(recipe?.proteinName).toBe("Grilled Chicken Breast");
      expect(recipe?.supplementaryId).toBe("ing-dodo");
      expect(recipe?.supplementaryName).toBe("Fried Sweet Plantains (Dodo)");
      expect(recipe?.owner).toBe("Esther");
      expect(recipe?.sourceUrl).toBe("https://example.com/sunday-rice");
    });
  });

  describe("findMatchingSavedRecipe", () => {
    const estherRecipe: SavedRecipe = {
      id: "recipe-1",
      name: "Mama's Special Sunday Rice",
      mealTypes: ["Lunch", "Dinner"],
      mainIngredientId: "ing-rice",
      mainIngredientName: "Basmati Rice",
      proteinId: "ing-chicken",
      proteinName: "Grilled Chicken Breast",
      supplementaryId: "ing-dodo",
      supplementaryName: "Fried Sweet Plantains (Dodo)",
      owner: "Esther",
    };

    it("matches when candidate ingredients correspond and all are in stock", () => {
      const match = findMatchingSavedRecipe(rice, chicken, dodo, [estherRecipe], stock);
      expect(match).toBeDefined();
      expect(match?.name).toBe("Mama's Special Sunday Rice");
    });

    it("does NOT match if a required ingredient is out of stock", () => {
      const yamEggRecipe: SavedRecipe = {
        id: "recipe-2",
        name: "Classic Yam & Egg Sauce",
        mealTypes: ["Breakfast"],
        mainIngredientId: "ing-yam",
        mainIngredientName: "Yam (Tuber / Raw Slices)",
        proteinId: "ing-eggs",
        proteinName: "Fresh Eggs",
        owner: "Esther",
      };

      // eggs are available: false in stock
      const match = findMatchingSavedRecipe(yam, eggs, undefined, [yamEggRecipe], stock);
      expect(match).toBeUndefined();
    });
  });

  describe("Plugging into Suggestion Engine Scoring", () => {
    const estherRecipe: SavedRecipe = {
      id: "recipe-1",
      name: "Mama's Special Sunday Rice",
      mealTypes: ["Lunch", "Dinner"],
      mainIngredientId: "ing-rice",
      mainIngredientName: "Basmati Rice",
      proteinId: "ing-chicken",
      proteinName: "Grilled Chicken Breast",
      supplementaryId: "ing-dodo",
      supplementaryName: "Fried Sweet Plantains (Dodo)",
      owner: "Esther",
    };

    it("awards strong personal affinity bonus and adopts saved recipe title when full match exists", () => {
      const result = suggestNutrientAwareCombo({
        availableMains: [rice],
        allIngredients: stock,
        mealType: "Lunch",
        savedRecipes: [estherRecipe],
      });

      expect(result).not.toBeNull();
      expect(result?.main.id).toBe("ing-rice");
      expect(result?.protein?.id).toBe("ing-chicken");
      expect(result?.supplementary?.id).toBe("ing-dodo");
      // The curated title must be the personal recipe name!
      expect(result?.pairings.dishName).toBe("Mama's Special Sunday Rice");
    });

    it("isolates saved recipes by owner: Esther's recipe does not affect Oluranti", () => {
      // Oluranti's suggestions must NOT use Esther's saved recipe title
      const result = suggestNutrientAwareCombo({
        availableMains: [rice],
        allIngredients: stock.map((s) => ({ ...s, owner: "Oluranti" })),
        mealType: "Lunch",
        savedRecipes: [estherRecipe], // belongs to Esther
      });

      expect(result).not.toBeNull();
      expect(result?.pairings.dishName).not.toBe("Mama's Special Sunday Rice");
    });
  });
});
