import { describe, expect, it } from "vitest";
import {
  buildMealLogProperties,
  buildNewReadyMealProperties,
  parseNotionIngredient,
  parseNotionReadyMeal,
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
    expect(ingredient?.owner).toBe("Esther"); // default fallback
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

  it("builds valid Notion payload properties for Meal Log", () => {
    const entry: MealLogEntry = {
      date: "2026-09-12T12:30:00.000Z",
      mealType: "Lunch",
      source: "Built",
      mainIngredient: "Basmati Rice",
      protein: "Beef Stew",
      supplementary: "Dodo",
      hadLeftovers: true,
      owner: "Esther",
    };

    const properties: any = buildMealLogProperties(entry);
    expect(properties.Date.date.start).toBe("2026-09-12T12:30:00.000Z");
    expect(properties["Meal Type"].select.name).toBe("Lunch");
    expect(properties.Source.select.name).toBe("Built");
    expect(properties["Main Ingredient"].rich_text[0].text.content).toBe("Basmati Rice");
    expect(properties.Protein.rich_text[0].text.content).toBe("Beef Stew");
    expect(properties.Supplementary.rich_text[0].text.content).toBe("Dodo");
    expect(properties["Had Leftovers"].checkbox).toBe(true);
    expect(properties.Owner.select.name).toBe("Esther");
  });

  it("builds valid payload properties for creating new Ready Meal", () => {
    const properties: any = buildNewReadyMealProperties("Yam + Egg Sauce", "Breakfast", "Esther");
    expect(properties.Name.title[0].text.content).toBe("Yam + Egg Sauce");
    expect(properties["Meal Type"].multi_select[0].name).toBe("Breakfast");
    expect(properties.Available.checkbox).toBe(true);
    expect(properties.Owner.select.name).toBe("Esther");
  });
});
