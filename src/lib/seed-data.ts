import { Ingredient, KitchenCatalogue, ReadyMeal } from "./types";

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // Mains
  {
    id: "ing-1", name: "Basmati Rice",
    mealTypes: ["Lunch", "Dinner"], role: "Main", owner: "Esther", available: true,
    nutrientTags: ["High Carb"],
  },
  {
    id: "ing-2", name: "Yam",
    mealTypes: ["Breakfast", "Lunch", "Dinner"], role: "Main", owner: "Esther", available: true,
    nutrientTags: ["High Carb", "High Fiber"],
  },
  {
    id: "ing-3", name: "Sliced Bread",
    mealTypes: ["Breakfast", "Snack"], role: "Main", owner: "Esther", available: true,
    nutrientTags: ["High Carb"],
  },
  {
    id: "ing-3b", name: "Cream Crackers / Toast",
    mealTypes: ["Snack"], role: "Main", owner: "Esther", available: true,
    nutrientTags: ["High Carb"],
  },
  {
    id: "ing-3c", name: "Greek Yogurt Bowl",
    mealTypes: ["Breakfast", "Snack"], role: "Main", owner: "Esther", available: true,
    nutrientTags: ["High Protein"],
  },
  {
    id: "ing-4", name: "Pasta / Spaghetti",
    mealTypes: ["Lunch", "Dinner"], role: "Main", owner: "Esther", available: true,
    nutrientTags: ["High Carb"],
  },
  {
    id: "ing-5", name: "Sweet Potato",
    mealTypes: ["Breakfast", "Lunch", "Dinner"], role: "Main", owner: "Esther", available: true,
    nutrientTags: ["High Fiber", "High Carb"],
  },
  {
    id: "ing-6", name: "Rolled Oats",
    mealTypes: ["Breakfast"], role: "Main", owner: "Esther", available: true,
    nutrientTags: ["High Fiber", "High Carb"],
  },
  {
    id: "ing-7", name: "Ripe Plantain",
    mealTypes: ["Breakfast", "Lunch", "Dinner"], role: "Main", owner: "Esther", available: true,
    nutrientTags: ["High Carb", "High Fiber"],
  },

  // Proteins
  {
    id: "ing-8", name: "Beef Stew",
    mealTypes: ["Lunch", "Dinner"], role: "Protein", owner: "Esther", available: true,
    nutrientTags: ["High Protein"],
  },
  {
    id: "ing-9", name: "Fresh Eggs (Fried/Boiled)",
    mealTypes: ["Breakfast", "Lunch", "Dinner"], role: "Protein", owner: "Esther", available: true,
    nutrientTags: ["High Protein", "High Fat"],
  },
  {
    id: "ing-10", name: "Canned Sardines",
    mealTypes: ["Breakfast", "Lunch"], role: "Protein", owner: "Esther", available: true,
    nutrientTags: ["High Protein", "High Fat"],
  },
  {
    id: "ing-11", name: "Fried / Grilled Chicken",
    mealTypes: ["Lunch", "Dinner"], role: "Protein", owner: "Esther", available: true,
    nutrientTags: ["High Protein"],
  },
  {
    id: "ing-12", name: "Baked Beans",
    mealTypes: ["Breakfast", "Lunch"], role: "Protein", owner: "Esther", available: true,
    nutrientTags: ["High Protein", "High Fiber", "High Carb"],
  },
  {
    id: "ing-12b", name: "Peanut Butter / Nut Spread",
    mealTypes: ["Breakfast", "Snack"], role: "Protein", owner: "Esther", available: true,
    nutrientTags: ["High Fat", "High Protein"],
  },
  {
    id: "ing-13", name: "Smoked Fish",
    mealTypes: ["Lunch", "Dinner"], role: "Protein", owner: "Esther", available: false,
    nutrientTags: ["High Protein", "High Fat"],
  },

  // Supplementary
  {
    id: "ing-14", name: "Dodo (Fried Plantain)",
    mealTypes: ["Breakfast", "Lunch", "Dinner"], role: "Supplementary", owner: "Esther", available: true,
    nutrientTags: ["High Carb", "High Fat"],
  },
  {
    id: "ing-15", name: "Egg Sauce / Tomato Gravy",
    mealTypes: ["Breakfast", "Lunch", "Dinner"], role: "Supplementary", owner: "Esther", available: true,
    nutrientTags: ["High Fat", "High Protein"],
  },
  {
    id: "ing-16", name: "Hot Tea / Cocoa",
    mealTypes: ["Breakfast", "Snack"], role: "Supplementary", owner: "Esther", available: true,
    nutrientTags: [],
  },
  {
    id: "ing-17", name: "Sliced Avocado",
    mealTypes: ["Breakfast", "Lunch", "Snack"], role: "Supplementary", owner: "Esther", available: true,
    nutrientTags: ["High Fat", "High Fiber"],
  },
  {
    id: "ing-18", name: "Steamed Spinach / Greens",
    mealTypes: ["Lunch", "Dinner"], role: "Supplementary", owner: "Esther", available: true,
    nutrientTags: ["High Fiber"],
  },
  {
    id: "ing-19", name: "Crisp Red / Green Apple",
    mealTypes: ["Breakfast", "Snack"], role: "Supplementary", owner: "Esther", available: false,
    nutrientTags: ["High Fiber"],
  },
  {
    id: "ing-20", name: "Fresh Baby Spinach / Greens",
    mealTypes: ["Lunch", "Dinner"], role: "Supplementary", owner: "Esther", available: false,
    nutrientTags: ["High Fiber"],
  },
];

export const INITIAL_READY_MEALS: ReadyMeal[] = [
  {
    id: "ready-1", name: "Leftover Beef Stew & Rice",
    mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true,
    nutrientTags: ["High Carb", "High Protein"],
  },
  {
    id: "ready-2", name: "Smoky Jollof Rice (Party style)",
    mealTypes: ["Lunch", "Dinner"], owner: "Esther", available: true,
    nutrientTags: ["High Carb"],
  },
  {
    id: "ready-3", name: "Chilled Fruit & Berry Bowl",
    mealTypes: ["Breakfast", "Snack"], owner: "Esther", available: true,
    nutrientTags: ["High Fiber", "High Carb"],
  },
];

export const SEED_CATALOGUE: KitchenCatalogue = {
  ingredients: INITIAL_INGREDIENTS,
  readyMeals: INITIAL_READY_MEALS,
  lastSynced: new Date().toISOString(),
  isCachedFallback: true,
};
