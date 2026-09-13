import { Ingredient, MealType } from "./types";

export type BaseCategory = "swallow" | "breakfast_grain" | "savory_starch" | "snack";

export type SideCategory =
  | "cooking_oil"
  | "raw_fruit"
  | "leafy_soup"
  | "breakfast_sweet_topping"
  | "savory_side"
  | "raw_condiment_aromatic";

export function isCookingOil(ingredient: Ingredient | { name: string }): boolean {
  const name = ingredient.name.toLowerCase();
  return (
    name.includes("oil") ||
    name.includes("butter") ||
    name.includes("margarine") ||
    name.includes("lard")
  );
}

export function isFruit(ingredient: Ingredient | { name: string }): boolean {
  return /watermelon|grape|apple|banana|orange|berry|berries|fruit|pawpaw|papaya|mango|pineapple|pear|strawberry|blueberry|citrus/i.test(
    ingredient.name
  );
}

export function classifyBaseCategory(ingredient: Ingredient | { name: string }): BaseCategory {
  const name = ingredient.name.toLowerCase();
  if (/amala|elubo|yam flour|fufu|akpu|semo|semovita|tuwo|wheat meal|wheat flour|garri|eba/i.test(name)) {
    return "swallow";
  }
  if (/oat|custard|akamu|ogi|pancake|toast|bread|cereal|cornflakes|granola|yogurt/i.test(name)) {
    return "breakfast_grain";
  }
  if (/snack|biscuit|puff puff|chin chin|meatpie|doughnut|peanut|groundnut/i.test(name)) {
    return "snack";
  }
  return "savory_starch";
}

export function classifySideCategory(ingredient: Ingredient | { name: string }): SideCategory {
  const name = ingredient.name.toLowerCase();
  if (isCookingOil(ingredient)) {
    return "cooking_oil";
  }
  if (isFruit(ingredient)) {
    return "raw_fruit";
  }
  if (/ewedu|okra|efo|bitterleaf|waterleaf|spinach|gbegiri|ogbono|afang|edikaikong|soup/i.test(name)) {
    return "leafy_soup";
  }
  if (/chia|flax|milk|honey|syrup|peanut butter|almond butter|jam|sugar|agave/i.test(name)) {
    return "breakfast_sweet_topping";
  }
  if (/sliced tomatoes & onions|tomato|onion|pepper|garlic|ginger/i.test(name)) {
    return "raw_condiment_aromatic";
  }
  return "savory_side";
}

export function isSideCompatibleWithBase(
  side: Ingredient | { name: string },
  base: Ingredient | { name: string },
  mealType?: MealType
): boolean {
  const sideCat = classifySideCategory(side);
  const baseCat = classifyBaseCategory(base);

  // 1. Cooking oils are never plate sides
  if (sideCat === "cooking_oil") {
    return false;
  }

  // 2. Raw fruit: strictly excluded from swallow and savory starches
  if (sideCat === "raw_fruit") {
    if (baseCat === "swallow" || baseCat === "savory_starch") {
      return false;
    }
    return baseCat === "breakfast_grain" || baseCat === "snack" || mealType === "Breakfast" || mealType === "Snack";
  }

  // 3. Leafy soups: compatible with swallow and savory starch; never on breakfast grains or snacks
  if (sideCat === "leafy_soup") {
    return baseCat === "swallow" || baseCat === "savory_starch";
  }

  // 4. Breakfast sweet toppings: compatible with breakfast grains & snacks; never on swallow or savory starch
  if (sideCat === "breakfast_sweet_topping") {
    if (baseCat === "swallow" || baseCat === "savory_starch") {
      return false;
    }
    return baseCat === "breakfast_grain" || baseCat === "snack" || mealType === "Breakfast";
  }

  // 5. Raw condiments/aromatics (e.g. sliced tomatoes & onions for egg sauce/stew):
  // Never on swallow or breakfast grain
  if (sideCat === "raw_condiment_aromatic") {
    if (baseCat === "swallow" || baseCat === "breakfast_grain") {
      return false;
    }
    return true;
  }

  // 6. Savory sides (dodo, coleslaw, avocado, etc.):
  if (sideCat === "savory_side") {
    if (baseCat === "breakfast_grain") {
      return false;
    }
    return true;
  }

  return true;
}
