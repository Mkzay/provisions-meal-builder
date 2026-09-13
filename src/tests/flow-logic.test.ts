import { describe, expect, it } from "vitest";
import {
  getAvailableMains,
  getAvailableReadyMeals,
  getDefaultMealTypeByHour,
  resolveLeftoverAction,
} from "../lib/flow-logic";
import { Ingredient, LeftoverDecision, ReadyMeal } from "../lib/types";

describe("Flow Logic & Leftover State Transitions", () => {
  const mockReadyMeals: ReadyMeal[] = [
    {
      id: "ready-1",
      name: "Leftover Stew & Rice",
      mealTypes: ["Lunch", "Dinner"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ready-2",
      name: "Breakfast Pancake & Sausage",
      mealTypes: ["Breakfast"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ready-3",
      name: "Eaten Soup",
      mealTypes: ["Lunch", "Dinner"],
      owner: "Esther",
      available: false,
    },
  ];

  const mockIngredients: Ingredient[] = [
    {
      id: "ing-1",
      name: "Basmati Rice",
      role: "Main",
      mealTypes: ["Lunch", "Dinner"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ing-2",
      name: "Oatmeal",
      role: "Main",
      mealTypes: ["Breakfast"],
      owner: "Esther",
      available: true,
    },
    {
      id: "ing-3",
      name: "Expired Rice",
      role: "Main",
      mealTypes: ["Lunch", "Dinner"],
      owner: "Esther",
      available: false,
    },
    {
      id: "ing-4",
      name: "Beef Stew",
      role: "Protein",
      mealTypes: ["Lunch", "Dinner"],
      owner: "Esther",
      available: true,
    },
  ];

  describe("getAvailableReadyMeals", () => {
    it("returns only active ready meals matching meal type", () => {
      const lunchReady = getAvailableReadyMeals(mockReadyMeals, "Lunch");
      expect(lunchReady).toHaveLength(1);
      expect(lunchReady[0].name).toBe("Leftover Stew & Rice");

      const breakfastReady = getAvailableReadyMeals(mockReadyMeals, "Breakfast");
      expect(breakfastReady).toHaveLength(1);
      expect(breakfastReady[0].name).toBe("Breakfast Pancake & Sausage");
    });

    it("excludes ready meals marked as available = false", () => {
      const dinnerReady = getAvailableReadyMeals(mockReadyMeals, "Dinner");
      expect(dinnerReady.map((r) => r.id)).not.toContain("ready-3");
    });
  });

  describe("getAvailableMains", () => {
    it("returns only available ingredients with Role = Main matching meal type", () => {
      const lunchMains = getAvailableMains(mockIngredients, "Lunch");
      expect(lunchMains).toHaveLength(1);
      expect(lunchMains[0].name).toBe("Basmati Rice");

      const breakfastMains = getAvailableMains(mockIngredients, "Breakfast");
      expect(breakfastMains).toHaveLength(1);
      expect(breakfastMains[0].name).toBe("Oatmeal");
    });
  });

  describe("resolveLeftoverAction", () => {
    it("leaves ready meal available when Ready Meal + leftovers = yes", () => {
      const decision: LeftoverDecision = {
        source: "Ready Meal",
        readyMealId: "ready-1",
        hadLeftovers: true,
        mealType: "Lunch",
      };

      const result = resolveLeftoverAction(decision);
      expect(result.action).toBe("keep_ready");
      expect(result.readyMealId).toBe("ready-1");
    });

    it("unchecks ready meal availability when Ready Meal + leftovers = no", () => {
      const decision: LeftoverDecision = {
        source: "Ready Meal",
        readyMealId: "ready-1",
        hadLeftovers: false,
        mealType: "Lunch",
      };

      const result = resolveLeftoverAction(decision);
      expect(result.action).toBe("uncheck_ready");
      expect(result.readyMealId).toBe("ready-1");
    });

    it("creates a new Ready Meal entry when Built + leftovers = yes", () => {
      const decision: LeftoverDecision = {
        source: "Built",
        mainIngredient: "Basmati Rice",
        protein: "Beef Stew",
        hadLeftovers: true,
        mealType: "Dinner",
      };

      const result = resolveLeftoverAction(decision);
      expect(result.action).toBe("create_ready");
      expect(result.newReadyMeal).toBeDefined();
      expect(result.newReadyMeal?.name).toBe("Basmati Rice + Beef Stew");
      expect(result.newReadyMeal?.available).toBe(true);
      expect(result.newReadyMeal?.mealType).toBe("Dinner");
      expect(result.newReadyMeal?.owner).toBe("Esther");
    });

    it("allows custom name for new ready meal when specified", () => {
      const decision: LeftoverDecision = {
        source: "Built",
        mainIngredient: "Yam",
        protein: "Egg Sauce",
        customName: "Mom's Special Yam & Egg",
        hadLeftovers: true,
        mealType: "Breakfast",
      };

      const result = resolveLeftoverAction(decision);
      expect(result.action).toBe("create_ready");
      expect(result.newReadyMeal?.name).toBe("Mom's Special Yam & Egg");
    });

    it("does nothing when Built + leftovers = no", () => {
      const decision: LeftoverDecision = {
        source: "Built",
        mainIngredient: "Pasta",
        protein: "Sardines",
        hadLeftovers: false,
        mealType: "Lunch",
      };

      const result = resolveLeftoverAction(decision);
      expect(result.action).toBe("none");
      expect(result.newReadyMeal).toBeUndefined();
    });
  });

  describe("getDefaultMealTypeByHour with mealsPerDay plans", () => {
    it("returns correct 4-meal cycle for standard schedule", () => {
      expect(getDefaultMealTypeByHour(8, 4)).toBe("Breakfast");
      expect(getDefaultMealTypeByHour(13, 4)).toBe("Lunch");
      expect(getDefaultMealTypeByHour(16, 4)).toBe("Snack");
      expect(getDefaultMealTypeByHour(20, 4)).toBe("Dinner");
      expect(getDefaultMealTypeByHour(23, 4)).toBe("Snack");
    });

    it("returns Breakfast, Lunch, or Dinner for 3-meals plan and NEVER Snack", () => {
      expect(getDefaultMealTypeByHour(8, 3)).toBe("Breakfast");
      expect(getDefaultMealTypeByHour(13, 3)).toBe("Lunch");
      expect(getDefaultMealTypeByHour(15, 3)).toBe("Lunch"); // 3 PM stays Lunch for 3-meal
      expect(getDefaultMealTypeByHour(16, 3)).toBe("Dinner");
      expect(getDefaultMealTypeByHour(19, 3)).toBe("Dinner");
      expect(getDefaultMealTypeByHour(23, 3)).toBe("Dinner");
      expect(getDefaultMealTypeByHour(2, 3)).toBe("Dinner");
    });

    it("returns Lunch or Dinner for 2-meals plan and NEVER Snack or Breakfast", () => {
      expect(getDefaultMealTypeByHour(8, 2)).toBe("Lunch");
      expect(getDefaultMealTypeByHour(13, 2)).toBe("Lunch");
      expect(getDefaultMealTypeByHour(15, 2)).toBe("Dinner");
      expect(getDefaultMealTypeByHour(20, 2)).toBe("Dinner");
      expect(getDefaultMealTypeByHour(23, 2)).toBe("Dinner");
    });
  });
});
