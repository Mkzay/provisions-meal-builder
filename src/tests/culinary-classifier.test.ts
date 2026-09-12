import { describe, expect, it } from "vitest";
import { inferIngredientRole, parseAndClassifyBulkItems } from "../lib/culinary-classifier";

describe("Culinary Auto-Classifier", () => {
  describe("inferIngredientRole", () => {
    it("correctly identifies Carbs & Bases (Main)", () => {
      expect(inferIngredientRole("Jasmine Rice")).toBe("Main");
      expect(inferIngredientRole("Sourdough Bread")).toBe("Main");
      expect(inferIngredientRole("Spaghetti")).toBe("Main");
      expect(inferIngredientRole("Rolled Oats")).toBe("Main");
      expect(inferIngredientRole("Sweet Potato")).toBe("Main");
      expect(inferIngredientRole("Fried Plantains")).toBe("Main");
      expect(inferIngredientRole("Garri")).toBe("Main");
    });

    it("correctly identifies Proteins", () => {
      expect(inferIngredientRole("Chicken Breast")).toBe("Protein");
      expect(inferIngredientRole("Eggs")).toBe("Protein");
      expect(inferIngredientRole("Salmon Fillet")).toBe("Protein");
      expect(inferIngredientRole("Greek Yogurt")).toBe("Protein");
      expect(inferIngredientRole("Ground Beef")).toBe("Protein");
      expect(inferIngredientRole("Tofu")).toBe("Protein");
      expect(inferIngredientRole("Canned Tuna")).toBe("Protein");
    });

    it("correctly identifies Sides & Extras (Supplementary)", () => {
      expect(inferIngredientRole("Avocado")).toBe("Supplementary");
      expect(inferIngredientRole("Baby Spinach")).toBe("Supplementary");
      expect(inferIngredientRole("Olive Oil")).toBe("Supplementary");
      expect(inferIngredientRole("Cheddar Cheese")).toBe("Supplementary");
      expect(inferIngredientRole("Sliced Almonds")).toBe("Supplementary");
      expect(inferIngredientRole("Tomatoes")).toBe("Supplementary");
    });

    it("falls back to Supplementary for unknown generic ingredients", () => {
      expect(inferIngredientRole("Exotic Herb Spice Mix")).toBe("Supplementary");
    });
  });

  describe("parseAndClassifyBulkItems", () => {
    it("parses comma and newline separated inputs into classified items", () => {
      const input = "Rice, Chicken Breast\nEggs\nAvocado, Plantain";
      const result = parseAndClassifyBulkItems(input);
      expect(result).toHaveLength(5);
      expect(result[0]).toMatchObject({ name: "Rice", role: "Main" });
      expect(result[1]).toMatchObject({ name: "Chicken Breast", role: "Protein" });
      expect(result[2]).toMatchObject({ name: "Eggs", role: "Protein" });
      expect(result[3]).toMatchObject({ name: "Avocado", role: "Supplementary" });
      expect(result[4]).toMatchObject({ name: "Plantain", role: "Main" });
    });

    it("ignores empty entries and extra whitespace", () => {
      const input = "  ,  \nRice \n\n, Eggs , ";
      const result = parseAndClassifyBulkItems(input);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Rice");
      expect(result[1].name).toBe("Eggs");
    });
  });
});
