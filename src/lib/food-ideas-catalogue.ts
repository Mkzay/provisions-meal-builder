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

export const FOOD_IDEAS_CATALOGUE: FoodIdea[] = [
  // Bases & Carbs (Staples)
  {
    id: "idea-base-1", name: "Basmati Rice",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"], origin: "Global",
    nutrientTags: ["High Carb"],
    description: "Light, aromatic, and easy on the stomach. Cooks in 15 minutes.",
    combos: "Best with Grilled Chicken, Salmon, or Savory Tomato Stew.",
  },
  {
    id: "idea-base-2", name: "Yam (Tuber / Raw Slices)",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"], origin: "African",
    nutrientTags: ["High Carb", "High Fiber"],
    description: "Versatile starchy tuber staple to boil soft, fry golden, or stew into porridge.",
    combos: "Boil or fry; unbeatable with Scrambled Egg Sauce, Garden Egg Sauce, or Fish Stew.",
  },
  {
    id: "idea-base-3", name: "Plantains (Ripe / Green)",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"], origin: "African",
    nutrientTags: ["High Carb", "High Fiber"],
    description: "Sweet or savory raw plantains ready to fry as dodo, roast as boli, or boil.",
    combos: "Fry with Eggs, pair with Honey Beans, or roast beside Roasted Groundnuts.",
  },
  {
    id: "idea-base-4", name: "Golden Morn",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Breakfast", "Snack"], origin: "African",
    nutrientTags: ["High Carb", "High Protein"],
    description: "Whole maize and soya cereal; comforting 2-minute Nigerian breakfast staple.",
    combos: "Mix with warm water, creamy evaporated milk, and optional sugar.",
  },
  {
    id: "idea-base-5", name: "Pancake Mix / Flour",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Breakfast", "Snack"], origin: "Global",
    nutrientTags: ["High Carb"],
    description: "Quick pantry flour blend for golden breakfast pancakes or light savory crepes.",
    combos: "Whisk with eggs and milk; serve with syrup, honey, or fried eggs.",
  },
  {
    id: "idea-base-6", name: "Instant Noodles (Indomie)",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"], origin: "African",
    nutrientTags: ["High Carb", "High Fat"],
    description: "Fast 5-minute staple for quick satisfying hunger relief.",
    combos: "Stir-fry with diced carrots, peppers, and fried or boiled eggs.",
  },
  {
    id: "idea-base-7", name: "Custard Powder / Ogi (Akamu)",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Breakfast", "Dinner"], origin: "African",
    nutrientTags: ["High Carb"],
    description: "Smooth, velvety corn porridge cooked smooth in 3 minutes.",
    combos: "Stir with Peak evaporated milk; pair with hot Akara or fried eggs.",
  },
  {
    id: "idea-base-8", name: "Garri (White / Yellow / Ijebu)",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"], origin: "African",
    nutrientTags: ["High Carb", "High Fiber"],
    description: "Crisp cassava flakes for drinking ice-cold with groundnuts or making warm eba swallow.",
    combos: "Drink with milk and groundnuts, or make eba for Egusi and Okra soup.",
  },
  {
    id: "idea-base-9", name: "Semovita / Semolina Flour",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"], origin: "African",
    nutrientTags: ["High Carb", "High Protein"],
    description: "Smooth durum wheat swallow staple for hearty soups.",
    combos: "Whisk in boiling water to soft swallow; serve with Egusi, Efo Riro, or Stew.",
  },
  {
    id: "idea-base-10", name: "Rolled Oats / Oatmeal",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Breakfast", "Snack"], origin: "Global",
    nutrientTags: ["High Fiber", "High Carb"],
    description: "High-fiber whole grain that keeps morning blood sugar steady.",
    combos: "Top with Evaporated Milk, Greek Yogurt, Honey, or Groundnuts.",
  },
  {
    id: "idea-base-11", name: "Sweet Potatoes",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"], origin: "Global",
    nutrientTags: ["High Fiber", "High Carb"],
    description: "Rich in Vitamin A, slow-digesting, and naturally satisfying.",
    combos: "Boil or roast; pairs with Mackerel, Fried Eggs, or Pepper Stew.",
  },
  {
    id: "idea-base-12", name: "Spaghetti / Pasta",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"], origin: "Global",
    nutrientTags: ["High Carb"],
    description: "The ultimate 10-minute fallback base for quick savory dinners.",
    combos: "Toss with Tomato Sauce, ground beef, sardines, or stir-fried veggies.",
  },
  {
    id: "idea-base-13", name: "Couscous / Quinoa",
    category: "Base", role: "Main", kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"], origin: "Global",
    nutrientTags: ["High Carb", "High Protein", "High Fiber"],
    description: "Near-instant prep requiring just steeping in boiled broth.",
    combos: "Fluff with Steamed Veggies and Grilled Chicken or Fish.",
  },

  // Proteins (Staples)
  {
    id: "idea-prot-1", name: "Fresh Eggs",
    category: "Protein", role: "Protein", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"], origin: "Global",
    nutrientTags: ["High Protein", "High Fat"],
    description: "Complete bioavailable protein with zero prep time.",
    combos: "Scramble with Tomatoes & Peppers; enjoy with Bread or Yam.",
  },
  {
    id: "idea-prot-2", name: "Honey Beans (Ewa Oloyin)",
    category: "Protein", role: "Protein", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"], origin: "African",
    nutrientTags: ["High Protein", "High Fiber", "High Carb"],
    description: "Naturally sweet Nigerian brown beans high in slow-digesting protein and gut fiber.",
    combos: "Stew tender with palm oil and crayfish; enjoy with Fried Plantains or Bread.",
  },
  {
    id: "idea-prot-3", name: "Akara Mix (Peeled Bean Flour)",
    category: "Protein", role: "Protein", kind: "ingredient",
    suitableMeals: ["Breakfast", "Dinner"], origin: "African",
    nutrientTags: ["High Protein", "High Fiber"],
    description: "Peeled bean flour blend for instant crispy fried akara or steamed moi moi.",
    combos: "Whisk with chopped onions and peppers; fry hot and serve with Bread or Custard.",
  },
  {
    id: "idea-prot-4", name: "Smoked / Grilled Mackerel (Titus)",
    category: "Protein", role: "Protein", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"], origin: "African",
    nutrientTags: ["High Protein", "High Fat"],
    description: "Deep savory flavor and rich in Omega-3 healthy fats.",
    combos: "Flake into warm Yam Porridge or eat beside Plantains and Rice.",
  },
  {
    id: "idea-prot-5", name: "Chicken Breast / Cuts",
    category: "Protein", role: "Protein", kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"], origin: "Global",
    nutrientTags: ["High Protein"],
    description: "Versatile lean staple that marinates deeply and stores well in batches.",
    combos: "Grill with Suya spice or stew in rich tomato pepper sauce with Rice.",
  },
  {
    id: "idea-prot-6", name: "Salmon Fillet",
    category: "Protein", role: "Protein", kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"], origin: "Global",
    nutrientTags: ["High Protein", "High Fat"],
    description: "Rich in Omega-3 fatty acids for brain vitality and anti-inflammation.",
    combos: "Pan-sear with garlic & peppers; serve alongside Rice or Sweet Potato.",
  },
  {
    id: "idea-prot-7", name: "Canned Tuna / Sardines",
    category: "Protein", role: "Protein", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"], origin: "Global",
    nutrientTags: ["High Protein", "High Fat"],
    description: "Pantry superhero requiring zero thawing. Pop the lid and eat.",
    combos: "Mash with warm toast, or stir into spicy tomato pasta.",
  },
  {
    id: "idea-prot-8", name: "Lean Beef / Stew Beef",
    category: "Protein", role: "Protein", kind: "ingredient",
    suitableMeals: ["Lunch", "Dinner"], origin: "Global",
    nutrientTags: ["High Protein"],
    description: "High in heme iron and zinc for sustained strength and recovery.",
    combos: "Simmer in traditional pepper stew over White Rice or Yam.",
  },
  {
    id: "idea-prot-9", name: "Greek Yogurt",
    category: "Protein", role: "Protein", kind: "ingredient",
    suitableMeals: ["Breakfast", "Snack"], origin: "Global",
    nutrientTags: ["High Protein"],
    description: "Dense probiotics and high protein without any cooking required.",
    combos: "Layer with Honey, Berries, Chia Seeds, and Roasted Groundnuts.",
  },

  // Sides & Produce (Staples)
  {
    id: "idea-side-1", name: "Fresh Veggies (Carrots, Cucumbers, Cabbage)",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"], origin: "African",
    nutrientTags: ["High Fiber"],
    description: "Crisp salad vegetables for nourishing crunch, vitamins, and gut health.",
    combos: "Shred into fresh Nigerian salad with cream, or stir-fry into rice and noodles.",
  },
  {
    id: "idea-side-2", name: "Sliced Tomatoes & Scotch Bonnet (Rodo)",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"], origin: "African",
    nutrientTags: ["High Fiber"],
    description: "Fresh aromatic peppers and tomatoes; essential base for sauces and stews.",
    combos: "Blend and fry with onions into rich savory stew for Rice, Yam, or Pasta.",
  },
  {
    id: "idea-side-3", name: "Roasted Groundnuts (Peanuts)",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Snack"], origin: "African",
    nutrientTags: ["High Fat", "High Protein"],
    description: "Crunchy roasted groundnuts rich in healthy plant fats and protein.",
    combos: "Add to ice-cold drinking Garri, or eat with roasted ripe plantains (Boli).",
  },
  {
    id: "idea-side-4", name: "Evaporated Milk (Peak / Cream)",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Snack"], origin: "African",
    nutrientTags: ["High Fat", "High Protein"],
    description: "Creamy evaporated milk that turns quick cereals into comforting rich meals.",
    combos: "Pour over warm Golden Morn, Oats, Custard, or hot breakfast tea.",
  },
  {
    id: "idea-side-5", name: "Hass Avocado",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"], origin: "Global",
    nutrientTags: ["High Fat", "High Fiber"],
    description: "Monounsaturated healthy fats that slow digestion and prevent cravings.",
    combos: "Slice over Toast, Rice Bowls, Salads, or alongside Boiled Plantains.",
  },
  {
    id: "idea-side-6", name: "Baby Spinach / Steamed Greens (Ugwu / Efo)",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"], origin: "African",
    nutrientTags: ["High Fiber"],
    description: "Quick wilted greens rich in folate, iron, and vitality.",
    combos: "Fold into morning scrambled eggs or stir into hot soup and pasta.",
  },
  {
    id: "idea-side-7", name: "Extra Virgin Olive Oil / Vegetable Oil",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"], origin: "Global",
    nutrientTags: ["High Fat"],
    description: "Clean cooking oils for sauteing, dressing, and frying plantains or eggs.",
    combos: "Use for light frying of dodo or drizzle generously over warm veggies.",
  },
  {
    id: "idea-side-8", name: "Cheddar / Parmesan Cheese",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"], origin: "Global",
    nutrientTags: ["High Fat", "High Protein"],
    description: "Instant savory umami richness and extra calcium.",
    combos: "Melt inside Omelettes, toasties, or shave over Pasta.",
  },
  {
    id: "idea-side-9", name: "Chia Seeds",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Snack"], origin: "Global",
    nutrientTags: ["High Fiber", "High Fat", "High Protein"],
    description: "Omega-3 and soluble fiber powerhouse that swells into a soothing pudding or oatmeal booster.",
    combos: "Stir into Oats, Greek Yogurt, warm Custard, or water with lemon.",
  },
  {
    id: "idea-side-10", name: "Fennel Seeds",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"], origin: "Global",
    nutrientTags: ["High Fiber"],
    description: "Aromatic carminative seeds providing soothing digestive comfort and gentle sweetness.",
    combos: "Steep in hot water as a post-meal digestif tea, or toast lightly into warm grains.",
  },
  {
    id: "idea-side-11", name: "Whole Milk (Liquid / Sachet Powder)",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Snack"], origin: "African",
    nutrientTags: ["High Protein", "High Fat"],
    description: "Versatile daily dairy staple providing bioavailable protein, calcium, and richness.",
    combos: "Pour cold into cereals or whisk into warm tea and morning porridge.",
  },
  {
    id: "idea-side-12", name: "Tiger Nuts (Ofio / Aya)",
    category: "Side", role: "Supplementary", kind: "ingredient",
    suitableMeals: ["Breakfast", "Lunch", "Snack"], origin: "African",
    nutrientTags: ["High Fiber", "High Fat"],
    description: "Naturally sweet tubers rich in prebiotic resistant starch and clean oleic fats.",
    combos: "Chew fresh as a snack, blend into tiger nut milk (Kunu Aya), or eat with dates.",
  },

  // Ready Meals (Preserved exact set; zero additions)
  {
    id: "idea-ready-1", name: "Smoky Jollof & Grilled Chicken",
    category: "ReadyMeal", role: "Main", kind: "ready_meal",
    suitableMeals: ["Lunch", "Dinner"], origin: "African",
    nutrientTags: ["High Carb", "High Protein"],
    description: "Firewood-infused seasoned party rice with spiced tender chicken.",
    combos: "Reheat in 3 minutes. Complete full comfort in a container.",
  },
  {
    id: "idea-ready-2", name: "Egusi Soup & Pounded Yam",
    category: "ReadyMeal", role: "Main", kind: "ready_meal",
    suitableMeals: ["Lunch", "Dinner"], origin: "African",
    nutrientTags: ["High Fat", "High Protein", "High Carb"],
    description: "Melon seed soup with leafy greens, savory fish, and soft swallow.",
    combos: "Warm gently in a pot for a deeply restorative evening feast.",
  },
  {
    id: "idea-ready-3", name: "Hearty Beef Bolognese Pasta",
    category: "ReadyMeal", role: "Main", kind: "ready_meal",
    suitableMeals: ["Lunch", "Dinner"], origin: "Global",
    nutrientTags: ["High Carb", "High Protein"],
    description: "Slow-cooked minced beef in aromatic herbed Italian tomato sauce.",
    combos: "Top with grated cheese and eat warm with garlic toast.",
  },
  {
    id: "idea-ready-4", name: "Coconut Curry with Chicken & Veggies",
    category: "ReadyMeal", role: "Main", kind: "ready_meal",
    suitableMeals: ["Lunch", "Dinner"], origin: "Fusion",
    nutrientTags: ["High Fat", "High Protein"],
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
