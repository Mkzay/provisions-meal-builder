import {
  Ingredient,
  LeftoverActionResult,
  LeftoverDecision,
  MealType,
  ReadyMeal,
} from "./types";

export function getAvailableReadyMeals(
  readyMeals: ReadyMeal[],
  mealType: MealType
): ReadyMeal[] {
  return readyMeals.filter(
    (meal) => meal.available && meal.mealTypes.includes(mealType)
  );
}

export function getAvailableMains(
  ingredients: Ingredient[],
  mealType: MealType
): Ingredient[] {
  return ingredients.filter(
    (ing) =>
      ing.role === "Main" && ing.available && ing.mealTypes.includes(mealType)
  );
}

export function resolveLeftoverAction(
  decision: LeftoverDecision
): LeftoverActionResult {
  if (decision.source === "Ready Meal") {
    if (decision.hadLeftovers) {
      return {
        action: "keep_ready",
        readyMealId: decision.readyMealId,
      };
    } else {
      return {
        action: "uncheck_ready",
        readyMealId: decision.readyMealId,
      };
    }
  }

  // Source is "Built"
  if (decision.hadLeftovers) {
    const suggestedName =
      decision.customName ||
      (decision.protein
        ? `${decision.mainIngredient} + ${decision.protein}`
        : decision.mainIngredient || "Leftover Meal");

    return {
      action: "create_ready",
      newReadyMeal: {
        name: suggestedName,
        mealType: decision.mealType,
        owner: "Esther",
        available: true,
      },
    };
  }

  return {
    action: "none",
  };
}

export function getDefaultMealTypeByHour(hour: number): MealType {
  if (hour >= 5 && hour < 12) return "Breakfast";
  if (hour >= 12 && hour < 15) return "Lunch";
  if (hour >= 15 && hour < 18) return "Snack";
  if (hour >= 18 && hour < 22) return "Dinner";
  return "Snack"; // Late night craving
}

