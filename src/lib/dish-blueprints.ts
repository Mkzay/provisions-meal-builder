import { Ingredient, MealType } from "./types";
import { CORE_DISH_BLUEPRINTS } from "./dish-blueprints-core";
import { EXTENDED_DISH_BLUEPRINTS } from "./dish-blueprints-extended";
import { DishBlueprint } from "./dish-blueprints-types";

export type { DishBlueprint } from "./dish-blueprints-types";
export { cleanBase } from "./dish-blueprints-types";

export type { BaseCategory, SideCategory } from "./ingredient-categories";
export {
  classifyBaseCategory,
  classifySideCategory,
  isCookingOil,
  isFruit,
  isSideCompatibleWithBase,
} from "./ingredient-categories";

export const DISH_BLUEPRINTS: DishBlueprint[] = [
  ...CORE_DISH_BLUEPRINTS,
  ...EXTENDED_DISH_BLUEPRINTS,
];

export function findMatchingDishBlueprint(
  main: Ingredient,
  inStockIngredients: Ingredient[],
  mealType: MealType
): DishBlueprint | null {
  const matchingBlueprints = DISH_BLUEPRINTS.filter(
    (bp) => bp.basePattern.test(main.name) && bp.suitableMeals.includes(mealType)
  );

  for (const bp of matchingBlueprints) {
    if (bp.requiredPatterns && bp.requiredPatterns.length > 0) {
      const satisfiesAllRequired = bp.requiredPatterns.every((req) =>
        inStockIngredients.some((ing) => ing.available && req.test(ing.name))
      );
      if (satisfiesAllRequired) return bp;
    } else {
      return bp;
    }
  }

  // Fallback to any blueprint matching base regardless of mealType
  const baseOnly = DISH_BLUEPRINTS.find((bp) => bp.basePattern.test(main.name));
  return baseOnly || null;
}

export function gatherMatchingSides(
  blueprint: DishBlueprint,
  availableSupplementary: Ingredient[]
): Ingredient[] {
  if (!blueprint.preferredSidePatterns || blueprint.preferredSidePatterns.length === 0) {
    return [];
  }
  const selected: Ingredient[] = [];
  for (const pat of blueprint.preferredSidePatterns) {
    const match = availableSupplementary.find(
      (s) => pat.test(s.name) && !selected.some((sel) => sel.id === s.id)
    );
    if (match) {
      selected.push(match);
    }
  }
  return selected;
}
