import { IngredientRole, MealType } from "./types";

export type FoodCategory = "Base" | "Protein" | "Side" | "ReadyMeal";

export interface FoodIdea {
  id: string;
  name: string;
  category: FoodCategory;
  role: IngredientRole;
  kind: "ingredient" | "ready_meal";
  suitableMeals: MealType[];
  origin: "African" | "Global" | "Fusion";
  description: string;
  combos: string;
}

export const FOOD_IDEAS_CATALOGUE: FoodIdea[] = [
  // Bases & Carbs
  {
    id: "idea-base-1",
    name: "Basmati Rice",
    category: "Base",
    role: "Main",
    kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "Global",
    description: "Light, aromatic, and easy on the stomach. Cooks in 15 minutes.",
    combos: "Best with Grilled Chicken, Salmon, or Savory Tomato Stew.",
  },
  {
    id: "idea-base-2",
    name: "Boiled White Yam",
    category: "Base",
    role: "Main",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    origin: "African",
    description: "Hearty, dense, grounding energy that sustains for hours.",
    combos: "Unbeatable with Scrambled Egg Sauce or Stewed Sardines.",
  },
  {
    id: "idea-base-3",
    name: "Fried / Grilled Plantains",
    category: "Base",
    role: "Main",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"],
    origin: "African",
    description: "Naturally sweet and caramelized with healthy complex carbohydrates.",
    combos: "Pairs with Eggs, Beans, or Stewed Chicken.",
  },
  {
    id: "idea-base-4",
    name: "Sourdough Bread",
    category: "Base",
    role: "Main",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Snack"],
    origin: "Global",
    description: "Fermented rustic bread that supports gut health and toasts crisp.",
    combos: "Perfect with Avocado, Poached Eggs, or Canned Tuna melt.",
  },
  {
    id: "idea-base-5",
    name: "Rolled Oats / Oatmeal",
    category: "Base",
    role: "Main",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Snack"],
    origin: "Global",
    description: "High-fiber whole grain that keeps morning blood sugar completely steady.",
    combos: "Top with Greek Yogurt, Honey, Berries, or Mixed Nuts.",
  },
  {
    id: "idea-base-6",
    name: "Sweet Potatoes",
    category: "Base",
    role: "Main",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    origin: "Global",
    description: "Rich in Vitamin A, slow-digesting, and naturally satisfying.",
    combos: "Bake or boil; pairs with Mackerel, Fried Eggs, or Veggie Stew.",
  },
  {
    id: "idea-base-7",
    name: "Spaghetti / Pasta",
    category: "Base",
    role: "Main",
    kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "Global",
    description: "The ultimate 10-minute fallback base for quick savory dinners.",
    combos: "Toss with Olive Oil, Garlic, Ground Beef, or Tomato Sauce.",
  },
  {
    id: "idea-base-8",
    name: "Garri / Eba",
    category: "Base",
    role: "Main",
    kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "African",
    description: "Comforting cassava staple prepared in under 3 minutes with hot water.",
    combos: "Serve warm with Egusi, Okra soup, or Fish Stew.",
  },
  {
    id: "idea-base-9",
    name: "Couscous / Quinoa",
    category: "Base",
    role: "Main",
    kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "Global",
    description: "Near-instant prep requiring just steeping in boiled broth.",
    combos: "Fluff with Roasted Vegetables and Grilled Chicken.",
  },

  // Proteins
  {
    id: "idea-prot-1",
    name: "Fresh Eggs",
    category: "Protein",
    role: "Protein",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"],
    origin: "Global",
    description: "Complete bioavailable protein with zero prep time.",
    combos: "Scramble with Tomatoes & Peppers; enjoy with Bread or Boiled Yam.",
  },
  {
    id: "idea-prot-2",
    name: "Salmon Fillet",
    category: "Protein",
    role: "Protein",
    kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "Global",
    description: "Rich in Omega-3 fatty acids for brain vitality and anti-inflammation.",
    combos: "Pan-sear with lemon & garlic; serve alongside Rice or Sweet Potato.",
  },
  {
    id: "idea-prot-3",
    name: "Chicken Breast / Thighs",
    category: "Protein",
    role: "Protein",
    kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "Global",
    description: "Versatile lean staple that marinates deeply and stores well in batches.",
    combos: "Grill with Suya spice or stew in rich tomato sauce with Rice.",
  },
  {
    id: "idea-prot-4",
    name: "Smoked / Grilled Mackerel",
    category: "Protein",
    role: "Protein",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    origin: "African",
    description: "Deep savory flavor and rich in healthy fats with zero dry texture.",
    combos: "Shred into Warm Yam Porridge or eat beside Fried Plantains.",
  },
  {
    id: "idea-prot-5",
    name: "Greek Yogurt",
    category: "Protein",
    role: "Protein",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Snack"],
    origin: "Global",
    description: "Dense probiotics and high protein without any cooking required.",
    combos: "Layer with Granola, Berries, and Chia Seeds.",
  },
  {
    id: "idea-prot-6",
    name: "Canned Tuna / Sardines",
    category: "Protein",
    role: "Protein",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"],
    origin: "Global",
    description: "Pantry superhero requiring zero thawing. Pop the lid and eat.",
    combos: "Mash with Sourdough toast, or stir into spicy tomato pasta.",
  },
  {
    id: "idea-prot-7",
    name: "Beans / Honey Beans / Moi Moi",
    category: "Protein",
    role: "Protein",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    origin: "African",
    description: "Complex fiber and plant protein that digests smoothly.",
    combos: "Pair with Fried Plantains or warm Bread.",
  },
  {
    id: "idea-prot-8",
    name: "Lean Beef / Stew Beef",
    category: "Protein",
    role: "Protein",
    kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "Global",
    description: "High in heme iron and zinc for sustained strength and recovery.",
    combos: "Simmer in traditional pepper stew over White Rice.",
  },

  // Sides & Extras
  {
    id: "idea-side-1",
    name: "Hass Avocado",
    category: "Side",
    role: "Supplementary",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"],
    origin: "Global",
    description: "Monounsaturated fats that slow digestion and prevent cravings.",
    combos: "Slice over Toast, Sourdough, Rice Bowls, or Salad.",
  },
  {
    id: "idea-side-2",
    name: "Baby Spinach / Steamed Greens",
    category: "Side",
    role: "Supplementary",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    origin: "Global",
    description: "Quick 2-minute wilt with folate, iron, and vibrant color.",
    combos: "Fold into morning scrambled eggs or stir into hot pasta.",
  },
  {
    id: "idea-side-3",
    name: "Sliced Tomatoes & Onions",
    category: "Side",
    role: "Supplementary",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    origin: "Global",
    description: "Bright acidity and sweetness that cuts through rich savory foods.",
    combos: "Sauté as a savory base for eggs, fish, and chicken.",
  },
  {
    id: "idea-side-4",
    name: "Extra Virgin Olive Oil",
    category: "Side",
    role: "Supplementary",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    origin: "Global",
    description: "Heart-healthy polyphenols that enhance nutrient absorption.",
    combos: "Drizzle generously over finished pasta, veggies, or toast.",
  },
  {
    id: "idea-side-5",
    name: "Mixed Roasted Nuts / Almonds",
    category: "Side",
    role: "Supplementary",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Snack"],
    origin: "Global",
    description: "Crunchy magnesium boost and satisfying clean fats.",
    combos: "Sprinkle over Oatmeal, Greek Yogurt, or eat by the handful.",
  },
  {
    id: "idea-side-6",
    name: "Cheddar / Parmesan Cheese",
    category: "Side",
    role: "Supplementary",
    kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"],
    origin: "Global",
    description: "Instant savory umami richness and extra calcium.",
    combos: "Melt inside Omelettes, toasties, or shave over Pasta.",
  },

  // Ready Meals
  {
    id: "idea-ready-1",
    name: "Smoky Jollof & Grilled Chicken",
    category: "ReadyMeal",
    role: "Main",
    kind: "ready_meal",
    suitableMeals: ["Lunch", "Dinner"],
    origin: "African",
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
    description: "Creamy coconut milk stew with bell peppers, ginger, and turmeric.",
    combos: "Reheats smoothly; soak up every drop with Basmati Rice.",
  },
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
