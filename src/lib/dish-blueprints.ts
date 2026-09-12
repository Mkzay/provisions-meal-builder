import { Ingredient, MealType } from "./types";

export interface DishBlueprint {
  id: string;
  name: string;
  basePattern: RegExp;
  requiredPatterns?: RegExp[];
  preferredProteinPatterns: RegExp[];
  preferredSidePatterns?: RegExp[];
  culinaryNote: string;
  suitableMeals: MealType[];
  generateTitle: (base: Ingredient, protein?: Ingredient, sides?: Ingredient[]) => string;
}

export function isCookingOil(ingredient: Ingredient | { name: string }): boolean {
  const name = ingredient.name.toLowerCase();
  return (
    name.includes("olive oil") ||
    name.includes("palm oil") ||
    name.includes("vegetable oil") ||
    name.includes("groundnut oil") ||
    name.includes("cooking oil")
  );
}

export const DISH_BLUEPRINTS: DishBlueprint[] = [
  {
    id: "jollof-spaghetti",
    name: "Jollof Spaghetti",
    basePattern: /spaghetti|pasta/i,
    requiredPatterns: [/tomato|pepper|onion|stew/i],
    preferredProteinPatterns: [/egg/i, /fish|croaker|titus|mackerel/i, /beef/i, /chicken/i, /turkey/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot|green bean/i],
    culinaryNote: "Simmered pasta in rich, seasoned tomato and aromatic pepper reduction.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (_base, protein, sides) => {
      let t = "Jollof Spaghetti";
      if (protein) t += ` with ${protein.name.replace(/\(.*?\)/g, "").trim()}`;
      const validSides = (sides || []).filter((s) => !isCookingOil(s) && !/tomato|onion/i.test(s.name));
      if (validSides.length > 0) t += ` & ${validSides[0].name.replace(/\(.*?\)/g, "").trim()}`;
      return t;
    },
  },
  {
    id: "white-spag-stew",
    name: "Spaghetti & Savory Stew",
    basePattern: /spaghetti|pasta/i,
    preferredProteinPatterns: [/beef/i, /fish|croaker|titus/i, /chicken/i, /egg/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot/i],
    culinaryNote: "Steamed pasta paired with savory tomato stew and wholesome protein.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (_base, protein, sides) => {
      let t = "Spaghetti & Savory Stew";
      if (protein) t += ` with ${protein.name.replace(/\(.*?\)/g, "").trim()}`;
      const validSides = (sides || []).filter((s) => !isCookingOil(s));
      if (validSides.length > 0) t += ` & ${validSides[0].name.replace(/\(.*?\)/g, "").trim()}`;
      return t;
    },
  },
  {
    id: "boiled-yam-egg-sauce",
    name: "Boiled Yam & Fresh Egg Sauce",
    basePattern: /yam/i,
    requiredPatterns: [/egg/i],
    preferredProteinPatterns: [/egg/i, /fish|sardine/i],
    preferredSidePatterns: [/plantain/i, /tomato/i],
    culinaryNote: "Steamed tender yam paired with a spiced scrambled egg and tomato sauce.",
    suitableMeals: ["Breakfast", "Lunch"],
    generateTitle: (_base, protein, sides) => {
      let t = protein?.name.toLowerCase().includes("egg") ? "Boiled Yam & Fresh Egg Sauce" : `Boiled Yam with ${protein?.name || "Sauce"}`;
      const validSides = (sides || []).filter((s) => !isCookingOil(s) && !/tomato|onion/i.test(s.name));
      if (validSides.length > 0) t += ` with ${validSides[0].name.replace(/\(.*?\)/g, "").trim()}`;
      return t;
    },
  },
  {
    id: "yam-fish-stew",
    name: "Yam with Savory Fish Stew",
    basePattern: /yam/i,
    preferredProteinPatterns: [/fish|croaker|titus|mackerel|panla/i, /beef/i, /egg/i],
    preferredSidePatterns: [/plantain/i, /spinach|efo/i],
    culinaryNote: "Steamed yam paired with savory stew for grounding, sustained energy.",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    generateTitle: (_base, protein, sides) => {
      let t = `Boiled Yam & ${protein?.name.replace(/\(.*?\)/g, "").trim() || "Stew"}`;
      const validSides = (sides || []).filter((s) => !isCookingOil(s));
      if (validSides.length > 0) t += ` with ${validSides[0].name.replace(/\(.*?\)/g, "").trim()}`;
      return t;
    },
  },
  {
    id: "ijebu-garri-groundnut",
    name: "Ijebu Garri & Groundnuts",
    basePattern: /garri/i,
    suitableMeals: ["Breakfast", "Lunch", "Snack"],
    preferredProteinPatterns: [/groundnut|peanut/i, /fish|panla|kuli/i],
    preferredSidePatterns: [/milk/i, /coconut/i, /banana/i],
    culinaryNote: "Refreshing ice-cold drinking garri paired with crunchy roasted groundnuts and milk.",
    generateTitle: (_base, protein, sides) => {
      let t = "Ijebu Garri with Cold Water";
      if (protein) t += ` & ${protein.name.replace(/\(.*?\)/g, "").trim()}`;
      const validSides = (sides || []).filter((s) => !isCookingOil(s));
      if (validSides.length > 0) t += ` with ${validSides.map((s) => s.name.replace(/\(.*?\)/g, "").trim()).join(" & ")}`;
      return t;
    },
  },
  {
    id: "eba-soup-stew",
    name: "Eba with Hearty Soup & Protein",
    basePattern: /garri/i,
    suitableMeals: ["Lunch", "Dinner"],
    preferredProteinPatterns: [/beef/i, /fish|croaker|catfish/i, /goat|turkey|chicken/i],
    preferredSidePatterns: [/ewedu|okra|efo|bitterleaf|waterleaf/i],
    culinaryNote: "Warm, smooth eba swallow paired with seasoned greens and protein.",
    generateTitle: (_base, protein, sides) => {
      const greens = (sides || []).filter((s) => /ewedu|okra|efo|bitterleaf|waterleaf/i.test(s.name));
      let soupName = greens.length > 0 ? greens[0].name.replace(/\(.*?\)/g, "").trim() : "Stew";
      let t = `Eba with ${soupName}`;
      if (protein) t += ` & ${protein.name.replace(/\(.*?\)/g, "").trim()}`;
      return t;
    },
  },
  {
    id: "creamy-oatmeal-fruit",
    name: "Creamy Oatmeal with Fruit",
    basePattern: /oat/i,
    suitableMeals: ["Breakfast", "Snack"],
    preferredProteinPatterns: [/egg/i, /yogurt/i, /chia/i],
    preferredSidePatterns: [/banana|apple|grape|berry|fruit/i, /milk/i],
    culinaryNote: "Warm wholesome oats topped with sliced fruit and a protein booster.",
    generateTitle: (_base, protein, sides) => {
      const fruits = (sides || []).filter((s) => !isCookingOil(s) && !/egg/i.test(s.name));
      let t = "Creamy Oatmeal";
      if (fruits.length > 0) t += ` with ${fruits.map((f) => f.name.replace(/\(.*?\)/g, "").trim()).join(" & ")}`;
      if (protein) t += ` (${protein.name.replace(/\(.*?\)/g, "").trim()} on side)`;
      return t;
    },
  },
  {
    id: "toast-eggs",
    name: "Toasted Bread & Eggs",
    basePattern: /bread|toast/i,
    suitableMeals: ["Breakfast", "Lunch", "Snack"],
    preferredProteinPatterns: [/egg/i, /sardine|tuna/i, /peanut/i],
    preferredSidePatterns: [/tea/i, /tomato/i, /fruit/i],
    culinaryNote: "Crisp toasted bread paired with fluffy eggs or savory fish.",
    generateTitle: (_base, protein, sides) => {
      let t = `Toasted Bread & ${protein?.name.replace(/\(.*?\)/g, "").trim() || "Eggs"}`;
      const validSides = (sides || []).filter((s) => !isCookingOil(s));
      if (validSides.length > 0) t += ` with ${validSides[0].name.replace(/\(.*?\)/g, "").trim()}`;
      return t;
    },
  },
  {
    id: "beans-porridge-dodo",
    name: "Beans Porridge & Dodo",
    basePattern: /bean/i,
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    preferredProteinPatterns: [/fish|croaker|titus/i, /egg/i],
    preferredSidePatterns: [/plantain|dodo/i, /garri/i, /sweet potato/i],
    culinaryNote: "Tender honey beans stewed with sweet golden fried plantains.",
    generateTitle: (_base, protein, sides) => {
      let t = "Beans Porridge";
      const hasDodo = (sides || []).some((s) => /plantain|dodo/i.test(s.name));
      if (hasDodo) t += " & Dodo";
      if (protein) t += ` with ${protein.name.replace(/\(.*?\)/g, "").trim()}`;
      return t;
    },
  },
  {
    id: "rice-savory-stew",
    name: "White Rice & Savory Stew",
    basePattern: /rice/i,
    suitableMeals: ["Lunch", "Dinner"],
    preferredProteinPatterns: [/beef/i, /chicken/i, /fish|croaker/i, /egg/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot/i],
    culinaryNote: "Steamed fragrant rice bathed in savory spiced stew with cooked protein.",
    generateTitle: (_base, protein, sides) => {
      let t = "White Rice & Tomato Stew";
      if (protein) t += ` with ${protein.name.replace(/\(.*?\)/g, "").trim()}`;
      const validSides = (sides || []).filter((s) => !isCookingOil(s) && !/tomato|onion/i.test(s.name));
      if (validSides.length > 0) t += ` & ${validSides[0].name.replace(/\(.*?\)/g, "").trim()}`;
      return t;
    },
  },
  {
    id: "amala-ewedu-stew",
    name: "Amala with Ewedu & Savory Stew",
    basePattern: /amala|fufu|semo|tuwo|wheat/i,
    suitableMeals: ["Lunch", "Dinner"],
    preferredProteinPatterns: [/fish|croaker|catfish/i, /beef|goat|shaki/i, /chicken/i],
    preferredSidePatterns: [/ewedu/i, /okra/i, /efo/i],
    culinaryNote: "Warm velvety swallow paired with traditional soup and seasoned protein.",
    generateTitle: (base, protein, sides) => {
      const soup = (sides || []).find((s) => /ewedu|okra|efo/i.test(s.name));
      let t = `${base.name.replace(/\(.*?\)/g, "").trim()} with ${soup ? soup.name.replace(/\(.*?\)/g, "").trim() : "Stew"}`;
      if (protein) t += ` & ${protein.name.replace(/\(.*?\)/g, "").trim()}`;
      return t;
    },
  },
  {
    id: "sweet-potatoes-egg-sauce",
    name: "Sweet Potatoes & Egg Sauce",
    basePattern: /sweet potato|potato/i,
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    preferredProteinPatterns: [/egg/i, /fish/i],
    preferredSidePatterns: [/tomato/i, /spinach/i],
    culinaryNote: "Naturally sweet potatoes paired with a savory scrambled egg sauce.",
    generateTitle: (_base, protein) => `Boiled Sweet Potatoes & ${protein?.name.replace(/\(.*?\)/g, "").trim() || "Egg Sauce"}`,
  },
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
