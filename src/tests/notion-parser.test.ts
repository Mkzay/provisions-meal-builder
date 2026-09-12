import { describe, expect, it } from "vitest";
import {
  buildMealLogProperties,
  buildMealProfileProperties,
  buildNewReadyMealProperties,
  buildWeightLogProperties,
  parseNotionIngredient,
  parseNotionMealProfile,
  parseNotionReadyMeal,
  parseNotionWeightLog,
} from "../lib/notion-parser";
import { MealLogEntry } from "../lib/types";

describe("Notion API Data Parser & Transformer", () => {
  it("parses ingredient page with multi_select Meal Type correctly", () => {
    const rawPage: any = {
      id: "notion-ing-1",
      properties: {
        Name: {
          type: "title",
          title: [{ plain_text: "Basmati Rice" }],
        },
        "Meal Type": {
          type: "multi_select",
          multi_select: [{ name: "Lunch" }, { name: "Dinner" }],
        },
        Role: {
          type: "select",
          select: { name: "Main" },
        },
        Owner: {
          type: "select",
          select: { name: "Esther" },
        },
        Available: {
          type: "checkbox",
          checkbox: true,
        },
      },
    };

    const ingredient = parseNotionIngredient(rawPage);
    expect(ingredient).toBeDefined();
    expect(ingredient?.name).toBe("Basmati Rice");
    expect(ingredient?.role).toBe("Main");
    expect(ingredient?.mealTypes).toEqual(["Lunch", "Dinner"]);
    expect(ingredient?.available).toBe(true);
    expect(ingredient?.owner).toBe("Esther");
  });

  it("parses ingredient page with single select Meal Type gracefully", () => {
    const rawPage: any = {
      id: "notion-ing-2",
      properties: {
        Name: {
          type: "title",
          title: [{ plain_text: "Sliced Bread" }],
        },
        "Meal Type": {
          type: "select",
          select: { name: "Breakfast" },
        },
        Role: {
          type: "select",
          select: { name: "Main" },
        },
        Available: {
          type: "checkbox",
          checkbox: true,
        },
      },
    };

    const ingredient = parseNotionIngredient(rawPage);
    expect(ingredient?.mealTypes).toEqual(["Breakfast"]);
    expect(ingredient?.owner).toBe("Esther");
  });

  it("parses ready meal page correctly", () => {
    const rawPage: any = {
      id: "notion-ready-1",
      properties: {
        Name: {
          type: "title",
          title: [{ plain_text: "Leftover Stew & Rice" }],
        },
        "Meal Type": {
          type: "multi_select",
          multi_select: [{ name: "Lunch" }],
        },
        Available: {
          type: "checkbox",
          checkbox: true,
        },
      },
    };

    const readyMeal = parseNotionReadyMeal(rawPage);
    expect(readyMeal?.name).toBe("Leftover Stew & Rice");
    expect(readyMeal?.mealTypes).toEqual(["Lunch"]);
    expect(readyMeal?.available).toBe(true);
  });

  it("builds valid Notion relation properties for Meal Log", () => {
    const entry: MealLogEntry = {
      date: "2026-09-12T12:30:00.000Z",
      mealType: "Lunch",
      source: "Built",
      mainIngredientId: "3a8f4c2e-7b1a-4d9e-8f2c-1a2b3c4d5e6f",
      mainIngredient: "Basmati Rice",
      proteinId: "4b9f4c2e-7b1a-4d9e-8f2c-1a2b3c4d5e70",
      protein: "Beef Stew",
      supplementaryId: "5c0f4c2e-7b1a-4d9e-8f2c-1a2b3c4d5e71",
      supplementary: "Dodo",
      hadLeftovers: true,
      owner: "Esther",
    };

    const properties: any = buildMealLogProperties(entry);
    expect(properties.Date.date.start).toBe("2026-09-12T12:30:00.000Z");
    expect(properties["Meal Type"].select.name).toBe("Lunch");
    expect(properties.Source.select.name).toBe("Built");
    expect(properties["Had Leftovers"].checkbox).toBe(true);
    expect(properties.Owner.select.name).toBe("Esther");

    // Relations to Ingredients Catalogue
    expect(properties["Main Ingredient"].relation).toEqual([
      { id: "3a8f4c2e-7b1a-4d9e-8f2c-1a2b3c4d5e6f" },
    ]);
    expect(properties.Protein.relation).toEqual([
      { id: "4b9f4c2e-7b1a-4d9e-8f2c-1a2b3c4d5e70" },
    ]);
    expect(properties.Supplementary.relation).toEqual([
      { id: "5c0f4c2e-7b1a-4d9e-8f2c-1a2b3c4d5e71" },
    ]);
  });

  it("builds ready meal relation for Ready Meal source in Meal Log", () => {
    const entry: MealLogEntry = {
      date: "2026-09-12T13:00:00.000Z",
      mealType: "Dinner",
      source: "Ready Meal",
      readyMealId: "8f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
      readyMeal: "Jollof Rice & Chicken",
      hadLeftovers: false,
      owner: "Esther",
    };

    const properties: any = buildMealLogProperties(entry);
    expect(properties["Ready Meal"].relation).toEqual([
      { id: "8f9a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c" },
    ]);
  });

  it("builds valid payload properties for creating new Ready Meal", () => {
    const properties: any = buildNewReadyMealProperties("Yam + Egg Sauce", "Breakfast", "Esther");
    expect(properties.Name.title[0].text.content).toBe("Yam + Egg Sauce");
    expect(properties["Meal Type"].multi_select[0].name).toBe("Breakfast");
    expect(properties.Available.checkbox).toBe(true);
    expect(properties.Owner.select.name).toBe("Esther");
  });

  describe("Database 4: Meal Profile (Notion)", () => {
    it("parses Meal Profile page from Notion", () => {
      const rawPage: any = {
        id: "profile-page-123",
        last_edited_time: "2026-09-12T10:00:00.000Z",
        properties: {
          Name: {
            title: [{ plain_text: "Esther's Profile" }],
          },
          Owner: {
            select: { name: "Esther" },
          },
          Goal: {
            select: { name: "Gain weight" },
          },
          Height: {
            number: 168,
          },
        },
      };

      const profile = parseNotionMealProfile(rawPage);
      expect(profile).toBeDefined();
      expect(profile?.id).toBe("profile-page-123");
      expect(profile?.owner).toBe("Esther");
      expect(profile?.goal).toBe("Gain weight");
      expect(profile?.height).toBe(168);
    });

    it("builds valid Notion properties for Meal Profile", () => {
      const properties: any = buildMealProfileProperties({
        owner: "Esther",
        goal: "Gain weight",
        height: 168,
      });

      expect(properties.Owner.select.name).toBe("Esther");
      expect(properties.Goal.select.name).toBe("Gain weight");
      expect(properties.Height.number).toBe(168);
    });
  });

  describe("Database 5: Progress Log (Notion)", () => {
    it("parses Weight Log page from Notion", () => {
      const rawPage: any = {
        id: "weight-page-456",
        created_time: "2026-09-12T08:00:00.000Z",
        properties: {
          Owner: {
            select: { name: "Esther" },
          },
          Date: {
            date: { start: "2026-09-12" },
          },
          Weight: {
            number: 58.5,
          },
        },
      };

      const entry = parseNotionWeightLog(rawPage);
      expect(entry).toBeDefined();
      expect(entry?.id).toBe("weight-page-456");
      expect(entry?.owner).toBe("Esther");
      expect(entry?.date).toBe("2026-09-12");
      expect(entry?.weight).toBe(58.5);
    });

    it("builds valid Notion properties for Weight Log with two-decimal precision and unit", () => {
      const properties: any = buildWeightLogProperties({
        owner: "Esther",
        date: "2026-09-12",
        weight: 58.54,
        unit: "lbs",
      });

      expect(properties.Owner.select.name).toBe("Esther");
      expect(properties.Date.date.start).toBe("2026-09-12");
      expect(properties.Weight.number).toBe(58.54);
      expect(properties.Name.title[0].text.content).toContain("lbs");
    });
  });
});
