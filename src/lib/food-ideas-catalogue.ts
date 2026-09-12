import { BASE_IDEAS } from "./catalogue-bases";
import { PROTEIN_IDEAS } from "./catalogue-proteins";
import { SIDE_IDEAS } from "./catalogue-sides";
import { IngredientRole, MealType, NutrientTag } from "./types";

export type FoodCategory = "Base" | "Protein" | "Side" | "ReadyMeal";

export interface FoodIdea {
  id: string;
  name: string;
  category: FoodCategory;
  role: IngredientRole;
  kind: "ingredient" | "ready_meal";
  suitableMeals: MealType[];
  origin: "African" | "Global" | "Fusion";
  nutrientTags: NutrientTag[];
  description: string;
  combos: string;
}

export const READY_MEAL_IDEAS: FoodIdea[] = [
  {
    id: "idea-ready-1",
    name: "Smoky Jollof & Grilled Chicken",
    category: "ReadyMeal",
    role: "Main",
    kind: "ready_meal",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "African",
    nutrientTags: ["High Carb", "High Protein"],
    description: "Firewood-infused seasoned party rice with spiced tender chicken.",
    combos: "Reheat in 3 minutes. Complete full comfort in a container.",
  },
  {
    id: "idea-ready-2",
    name: "Egusi Soup & Pounded Yam",
    category: "ReadyMeal",
    role: "Main",
    kind: "ready_meal",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "African",
    nutrientTags: ["High Fat", "High Protein", "High Carb"],
    description: "Melon seed soup with leafy greens, savory fish, and soft swallow.",
    combos: "Warm gently in a pot for a deeply restorative evening feast.",
  },
  {
    id: "idea-ready-3",
    name: "Hearty Beef Bolognese Pasta",
    category: "ReadyMeal",
    role: "Main",
    kind: "ready_meal",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "Global",
    nutrientTags: ["High Carb", "High Protein"],
    description: "Slow-cooked minced beef in aromatic herbed Italian tomato sauce.",
    combos: "Top with grated cheese and eat warm with garlic toast.",
  },
  {
    id: "idea-ready-4",
    name: "Coconut Curry with Chicken & Veggies",
    category: "ReadyMeal",
    role: "Main",
    kind: "ready_meal",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "Fusion",
    nutrientTags: ["High Fat", "High Protein"],
    description: "Creamy coconut milk stew with bell peppers, ginger, and turmeric.",
    combos: "Reheats smoothly; soak up every drop with Basmati Rice.",
  },
];

export const FOOD_IDEAS_CATALOGUE: FoodIdea[] = [
  ...BASE_IDEAS,
  ...PROTEIN_IDEAS,
  ...SIDE_IDEAS,
  ...READY_MEAL_IDEAS,
];

export function filterFoodIdeas(
  ideas: FoodIdea[],
  filters: {
    query?: string;
    category?: FoodCategory | "All";
    mealType?: MealType;
  }
): FoodIdea[] {
  return ideas.filter((item) => {
    // 1. Category filter
    if (filters.category && filters.category !== "All") {
      if (item.category !== filters.category) return false;
    }

    // 2. Meal Type filter
    if (filters.mealType) {
      if (!item.suitableMeals.includes(filters.mealType)) return false;
    }

    // 3. Search query filter
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCombos = item.combos.toLowerCase().includes(q);
      const matchOrigin = item.origin.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCombos && !matchOrigin) {
        return false;
      }
    }

    return true;
  });
}
