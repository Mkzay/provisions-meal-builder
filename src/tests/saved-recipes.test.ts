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
    { id: "ing-beef", name: "Stewed Beef", role: "Protein", mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true },
    { id: "ing-dodo", name: "Fried Sweet Plantains (Dodo)", role: "Supplementary", mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true },
    { id: "ing-coleslaw", name: "Creamy Coleslaw", role: "Supplementary", mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true },
    { id: "ing-yam", name: "Yam (Tuber / Raw Slices)", role: "Main", mealTypes: ["Breakfast", "Lunch"], owner: "Esther", available: true },
    { id: "ing-eggs", name: "Fresh Eggs", role: "Protein", mealTypes: ["Breakfast", "Lunch"], owner: "Esther", available: false }, // out of stock!
  ];

  const rice = stock.find((i) => i.id === "ing-rice")!;
  const chicken = stock.find((i) => i.id === "ing-chicken")!;
  const beef = stock.find((i) => i.id === "ing-beef")!;
  const dodo = stock.find((i) => i.id === "ing-dodo")!;
  const coleslaw = stock.find((i) => i.id === "ing-coleslaw")!;
  const yam = stock.find((i) => i.id === "ing-yam")!;
  const eggs = stock.find((i) => i.id === "ing-eggs")!;

  describe("Notion Database 6 Serialization & Parsing", () => {
    it("builds valid Notion properties for creating a Saved Recipe with single or multiple proteins/sides", () => {
      const input: CreateSavedRecipeInput = {
        name: "Mama's Special Sunday Rice",
        mealTypes: ["Lunch", "Dinner"],
        mainIngredientId: "3d91c68e-ece0-8143-b609-d1e1ffc78f21",
        proteinIds: ["3d91c68e-ece0-81c4-94da-fa511e545ed0", "3d91c68e-ece0-810f-99e5-d1c47344b1cb"],
        supplementaryIds: ["3da1c68e-ece0-8128-bc49-f4793b43de97"],
        owner: "Esther",
        sourceUrl: "https://example.com/sunday-rice",
      };

      const props = buildSavedRecipeProperties(input);
      expect(props.Name.title[0].text.content).toBe("Mama's Special Sunday Rice");
      expect(props["Meal Type"].multi_select).toEqual([{ name: "Lunch" }, { name: "Dinner" }]);
      expect(props["Main Ingredient"].relation).toEqual([{ id: "3d91c68e-ece0-8143-b609-d1e1ffc78f21" }]);
      expect(props.Protein.relation).toEqual([
        { id: "3d91c68e-ece0-81c4-94da-fa511e545ed0" },
        { id: "3d91c68e-ece0-810f-99e5-d1c47344b1cb" },
      ]);
      expect(props.Supplementary.relation).toEqual([{ id: "3da1c68e-ece0-8128-bc49-f4793b43de97" }]);
      expect(props.Owner.select.name).toBe("Esther");
      expect(props["Source URL"].url).toBe("https://example.com/sunday-rice");
    });

    it("parses raw Notion page into SavedRecipe with resolved multiple proteins and sides", () => {
      const ingredientMap = new Map([
        ["ing-rice", "Basmati Rice"],
        ["ing-chicken", "Grilled Chicken Breast"],
        ["ing-beef", "Stewed Beef"],
        ["ing-dodo", "Fried Sweet Plantains (Dodo)"],
        ["ing-coleslaw", "Creamy Coleslaw"],
      ]);

      const rawPage: any = {
        id: "recipe-1",
        created_time: "2026-09-13T10:00:00.000Z",
        properties: {
          Name: { title: [{ plain_text: "Mama's Feast Rice" }] },
          "Meal Type": { multi_select: [{ name: "Lunch" }, { name: "Dinner" }] },
          "Main Ingredient": { relation: [{ id: "ing-rice" }] },
          Protein: { relation: [{ id: "ing-chicken" }, { id: "ing-beef" }] },
          Supplementary: { relation: [{ id: "ing-dodo" }, { id: "ing-coleslaw" }] },
          Owner: { select: { name: "Esther" } },
          "Source URL": { url: "https://example.com/sunday-rice" },
        },
      };

      const recipe = parseNotionSavedRecipe(rawPage, ingredientMap);
      expect(recipe).not.toBeNull();
      expect(recipe?.id).toBe("recipe-1");
      expect(recipe?.name).toBe("Mama's Feast Rice");
      expect(recipe?.proteinIds).toEqual(["ing-chicken", "ing-beef"]);
      expect(recipe?.proteinNames).toEqual(["Grilled Chicken Breast", "Stewed Beef"]);
      expect(recipe?.proteinName).toBe("Grilled Chicken Breast & Stewed Beef");
      expect(recipe?.supplementaryIds).toEqual(["ing-dodo", "ing-coleslaw"]);
      expect(recipe?.supplementaryNames).toEqual(["Fried Sweet Plantains (Dodo)", "Creamy Coleslaw"]);
      expect(recipe?.supplementaryName).toBe("Fried Sweet Plantains (Dodo) & Creamy Coleslaw");
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

    it("matches multi-protein/side recipe when candidate is one of the proteins and all recipe items are in stock", () => {
      const feastRecipe: SavedRecipe = {
        id: "recipe-3",
        name: "Mama's Feast Rice",
        mealTypes: ["Lunch", "Dinner"],
        mainIngredientId: "ing-rice",
        mainIngredientName: "Basmati Rice",
        proteinIds: ["ing-chicken", "ing-beef"],
        proteinNames: ["Grilled Chicken Breast", "Stewed Beef"],
        supplementaryIds: ["ing-dodo", "ing-coleslaw"],
        supplementaryNames: ["Fried Sweet Plantains (Dodo)", "Creamy Coleslaw"],
        owner: "Esther",
      };

      // Both chicken and beef, and both dodo and coleslaw are in stock!
      const match = findMatchingSavedRecipe(rice, chicken, dodo, [feastRecipe], stock);
      expect(match).toBeDefined();
      expect(match?.name).toBe("Mama's Feast Rice");
    });

    it("does NOT match multi-protein recipe if any of the required proteins is out of stock", () => {
      const feastRecipe: SavedRecipe = {
        id: "recipe-4",
        name: "Mama's Feast Rice with Eggs",
        mealTypes: ["Lunch", "Dinner"],
        mainIngredientId: "ing-rice",
        proteinIds: ["ing-chicken", "ing-eggs"], // eggs are out of stock!
        owner: "Esther",
      };

      const match = findMatchingSavedRecipe(rice, chicken, undefined, [feastRecipe], stock);
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
