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

export type { BaseCategory, SideCategory } from "./ingredient-categories";
export {
  classifyBaseCategory,
  classifySideCategory,
  isCookingOil,
  isFruit,
  isSideCompatibleWithBase,
} from "./ingredient-categories";
import { isCookingOil, isFruit } from "./ingredient-categories";

function clean(name?: string): string {
  if (!name) return "";
  return name.replace(/\(.*?\)/g, "").trim();
}

export function cleanBase(name?: string): string {
  if (!name) return "";
  let text = clean(name);
  if (text.toLowerCase().includes("bread")) return "Bread";
  if (text.toLowerCase().includes("spaghetti")) return "Spaghetti";
  if (text.toLowerCase().includes("custard")) return "Custard";
  if (text.toLowerCase().includes("oat")) return "Oatmeal";
  if (text.toLowerCase().includes("plantain")) return "Plantains";
  if (text.includes("/")) {
    text = text.split("/")[0].trim();
  }
  return text;
}

export const DISH_BLUEPRINTS: DishBlueprint[] = [
  // 1. Swallows (Amala, Fufu, Semo, Tuwo, Wheat, Eba) - must precede tuber yam
  {
    id: "amala-ewedu-stew",
    name: "Swallow with Soup & Stew",
    basePattern: /amala|elubo|yam flour|fufu|akpu|semo|semovita|tuwo|wheat meal/i,
    suitableMeals: ["Lunch", "Dinner"],
    preferredProteinPatterns: [/croaker|fish|catfish|titus/i, /beef|goat|shaki/i, /chicken|turkey/i],
    preferredSidePatterns: [/ewedu/i, /okra/i, /efo|spinach|bitterleaf/i],
    culinaryNote: "Warm velvety swallow paired with traditional soup and seasoned protein.",
    generateTitle: (base, protein, sides) => {
      const soup = (sides || []).find((s) => /ewedu|okra|efo|spinach|bitterleaf/i.test(s.name));
      let t = `${cleanBase(base.name)} with ${soup ? clean(soup.name) : "Savory Stew"}`;
      if (protein) t += ` & ${clean(protein.name)}`;
      return t;
    },
  },
  // 2. Rice & Beans (Iconic Nigerian duo)
  {
    id: "rice-and-beans",
    name: "Rice & Beans Combo",
    basePattern: /^(?!.*(?:swallow|tuwo))\b.*rice.*/i,
    requiredPatterns: [/bean/i],
    preferredProteinPatterns: [/croaker|fish|titus/i, /beef/i, /chicken/i, /egg/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot|salad|coleslaw/i],
    culinaryNote: "Classic tender rice and honey beans paired with rich savory stew.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `${cleanBase(base.name)} & Beans with Stew`;
      if (protein && !clean(protein.name).toLowerCase().includes("bean")) {
        t += ` & ${clean(protein.name)}`;
      }
      const dodo = (sides || []).find((s) => /plantain|dodo/i.test(s.name));
      if (dodo) t += ` + ${clean(dodo.name)}`;
      return t;
    },
  },
  // 3. Jollof Spaghetti / Pasta
  {
    id: "jollof-spaghetti",
    name: "Jollof Spaghetti",
    basePattern: /spaghetti|pasta/i,
    requiredPatterns: [/tomato|pepper|onion|stew/i],
    preferredProteinPatterns: [/egg/i, /croaker|fish|titus|mackerel/i, /beef/i, /chicken/i, /turkey/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot|green bean/i],
    culinaryNote: "Simmered pasta in rich, seasoned tomato and aromatic pepper reduction.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `Jollof ${cleanBase(base.name)}`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const valid = (sides || []).filter((s) => !isCookingOil(s) && !/tomato|onion/i.test(s.name));
      if (valid.length > 0) t += ` & ${clean(valid[0].name)}`;
      return t;
    },
  },
  // 4. White Spaghetti & Stew
  {
    id: "white-spag-stew",
    name: "Spaghetti & Savory Stew",
    basePattern: /spaghetti|pasta/i,
    preferredProteinPatterns: [/beef/i, /croaker|fish|titus/i, /chicken/i, /egg/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot/i],
    culinaryNote: "Steamed pasta paired with savory tomato stew and wholesome protein.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `${cleanBase(base.name)} & Savory Stew`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const valid = (sides || []).filter((s) => !isCookingOil(s) && !/tomato|onion/i.test(s.name));
      if (valid.length > 0) t += ` & ${clean(valid[0].name)}`;
      return t;
    },
  },
  // 5. Boiled Yam & Fresh Egg Sauce
  {
    id: "boiled-yam-egg-sauce",
    name: "Boiled Yam & Fresh Egg Sauce",
    basePattern: /^(?!.*(?:flour|elubo|amala))\b.*yam.*/i,
    requiredPatterns: [/egg/i],
    preferredProteinPatterns: [/egg/i, /fish|sardine/i],
    preferredSidePatterns: [/plantain/i],
    culinaryNote: "Steamed tender yam paired with spiced scrambled egg sauce.",
    suitableMeals: ["Breakfast", "Lunch"],
    generateTitle: (base, protein, sides) => {
      const baseLabel = `Boiled ${cleanBase(base.name)}`;
      let t = clean(protein?.name).toLowerCase().includes("egg") ? `${baseLabel} & Fresh Egg Sauce` : `${baseLabel} with ${clean(protein?.name) || "Sauce"}`;
      const valid = (sides || []).filter((s) => !isCookingOil(s) && !/tomato|onion/i.test(s.name));
      if (valid.length > 0) t += ` with ${clean(valid[0].name)}`;
      return t;
    },
  },
  // 6. Boiled Yam & Stew / Fish
  {
    id: "yam-fish-stew",
    name: "Yam with Savory Fish Stew",
    basePattern: /^(?!.*(?:flour|elubo|amala))\b.*yam.*/i,
    preferredProteinPatterns: [/croaker|fish|titus|mackerel|panla/i, /beef/i, /egg/i],
    preferredSidePatterns: [/plantain/i, /spinach|efo/i],
    culinaryNote: "Steamed yam paired with savory stew for grounding, sustained energy.",
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `Boiled ${cleanBase(base.name)} & ${clean(protein?.name) || "Stew"}`;
      const valid = (sides || []).filter((s) => !isCookingOil(s) && !isFruit(s));
      if (valid.length > 0) t += ` with ${clean(valid[0].name)}`;
      return t;
    },
  },
  // 7. Creamy Oatmeal with Multi-Sides (Fruit, Seeds, Milk)
  {
    id: "creamy-oatmeal-fruit",
    name: "Creamy Oatmeal Bowl",
    basePattern: /oat/i,
    suitableMeals: ["Breakfast", "Snack"],
    preferredProteinPatterns: [/egg/i, /yogurt/i],
    preferredSidePatterns: [/chia/i, /watermelon|grape|apple|banana|berry|fruit/i, /milk/i],
    culinaryNote: "Warm wholesome oats topped with sliced fruit, seeds, and protein on the side.",
    generateTitle: (base, protein, sides) => {
      const valid = (sides || []).filter((s) => isFruit(s) || /chia|milk/i.test(s.name));
      let t = `Creamy ${cleanBase(base.name)}`;
      if (valid.length > 0) t += ` with ${valid.map((s) => clean(s.name)).join(" & ")}`;
      if (protein) t += ` (${clean(protein.name)} on side)`;
      return t;
    },
  },
  // 8. Custard / Akamu / Ogi (Warm breakfast/dinner bowl)
  {
    id: "custard-breakfast",
    name: "Creamy Custard / Ogi Bowl",
    basePattern: /custard|akamu|ogi/i,
    suitableMeals: ["Breakfast", "Dinner", "Snack"],
    preferredProteinPatterns: [/egg/i, /bean|akara|moi moi/i, /yogurt/i],
    preferredSidePatterns: [/milk/i, /banana|grape|watermelon|fruit/i, /bread/i],
    culinaryNote: "Smooth comforting hot custard enriched with milk and wholesome sides.",
    generateTitle: (base, protein, sides) => {
      const valid = (sides || []).filter((s) => isFruit(s) || /milk|bread/i.test(s.name));
      let t = `Creamy ${cleanBase(base.name)}`;
      if (valid.length > 0) t += ` with ${valid.map((s) => clean(s.name)).join(" & ")}`;
      if (protein) t += ` & ${clean(protein.name)}`;
      return t;
    },
  },
  // 9. Beans Porridge & Dodo (Can standalone or pair)
  {
    id: "beans-porridge-dodo",
    name: "Beans Porridge & Dodo",
    basePattern: /(?:^|\b)beans?\b/i,
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    preferredProteinPatterns: [/croaker|fish|titus/i, /egg/i, /beef/i],
    preferredSidePatterns: [/plantain|dodo/i, /garri/i, /bread/i],
    culinaryNote: "Tender honey beans stewed with sweet golden fried plantains.",
    generateTitle: (base, protein, sides) => {
      let t = `${cleanBase(base.name)} Porridge`;
      const hasDodo = (sides || []).some((s) => /plantain|dodo/i.test(s.name));
      if (hasDodo) t += " & Dodo";
      if (protein && !clean(protein.name).toLowerCase().includes("bean")) {
        t += ` with ${clean(protein.name)}`;
      }
      return t;
    },
  },
  // 10. Plantain as Standalone Main
  {
    id: "plantain-dish",
    name: "Plantain & Protein",
    basePattern: /plantain/i,
    suitableMeals: ["Breakfast", "Lunch", "Dinner", "Snack"],
    preferredProteinPatterns: [/egg/i, /croaker|fish|titus/i, /bean/i],
    preferredSidePatterns: [/cabbage|salad/i],
    culinaryNote: "Sweet fried dodo or tender boiled plantains paired with savory protein.",
    generateTitle: (base, protein) => `${cleanBase(base.name)} & ${clean(protein?.name) || "Egg Sauce"}`,
  },
  // 11. Rice & Savory Stew (Supports Ofada, Basmati, White Rice dynamically)
  {
    id: "rice-savory-stew",
    name: "Rice & Savory Stew",
    basePattern: /^(?!.*(?:swallow|tuwo))\b.*rice.*/i,
    suitableMeals: ["Lunch", "Dinner"],
    preferredProteinPatterns: [/beef/i, /chicken/i, /croaker|fish/i, /egg/i],
    preferredSidePatterns: [/plantain|dodo/i, /cabbage|carrot|salad/i],
    culinaryNote: "Steamed fragrant rice bathed in savory spiced stew with cooked protein.",
    generateTitle: (base, protein, sides) => {
      let t = `${cleanBase(base.name)} & Tomato Stew`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const valid = (sides || []).filter((s) => /plantain|dodo|cabbage|carrot|salad/i.test(s.name));
      if (valid.length > 0) t += ` & ${clean(valid[0].name)}`;
      return t;
    },
  },
  // 12. Ijebu Garri & Groundnuts
  {
    id: "ijebu-garri-groundnut",
    name: "Ijebu Garri & Groundnuts",
    basePattern: /garri/i,
    suitableMeals: ["Breakfast", "Lunch", "Snack"],
    preferredProteinPatterns: [/groundnut|peanut/i, /fish|panla|kuli/i],
    preferredSidePatterns: [/milk/i, /coconut/i],
    culinaryNote: "Refreshing ice-cold drinking garri paired with crunchy roasted groundnuts and milk.",
    generateTitle: (base, protein, sides) => {
      let t = `${cleanBase(base.name)} with Cold Water`;
      if (protein) t += ` & ${clean(protein.name)}`;
      const valid = (sides || []).filter((s) => /milk|coconut/i.test(s.name));
      if (valid.length > 0) t += ` with ${valid.map((s) => clean(s.name)).join(" & ")}`;
      return t;
    },
  },
  // 13. Eba with Soup & Stew
  {
    id: "eba-soup-stew",
    name: "Eba with Hearty Soup & Protein",
    basePattern: /garri|eba/i,
    suitableMeals: ["Lunch", "Dinner"],
    preferredProteinPatterns: [/beef/i, /croaker|fish|catfish/i, /goat|turkey|chicken/i],
    preferredSidePatterns: [/ewedu|okra|efo|bitterleaf|waterleaf/i],
    culinaryNote: "Warm, smooth eba swallow paired with seasoned greens and protein.",
    generateTitle: (base, protein, sides) => {
      const soup = (sides || []).find((s) => /ewedu|okra|efo|bitterleaf|waterleaf/i.test(s.name));
      let t = `${cleanBase(base.name)} with ${soup ? clean(soup.name) : "Stew"}`;
      if (protein) t += ` & ${clean(protein.name)}`;
      return t;
    },
  },
  // 14. Toasted Bread & Eggs
  {
    id: "toast-eggs",
    name: "Toasted Bread & Eggs",
    basePattern: /bread|toast/i,
    suitableMeals: ["Breakfast", "Lunch", "Snack"],
    preferredProteinPatterns: [/egg/i, /sardine|tuna/i, /peanut/i],
    preferredSidePatterns: [/tea/i, /fruit/i],
    culinaryNote: "Crisp toasted bread paired with fluffy eggs or savory fish.",
    generateTitle: (base, protein, sides) => {
      let t = `Toasted ${cleanBase(base.name)} & ${clean(protein?.name) || "Eggs"}`;
      const valid = (sides || []).filter((s) => !isCookingOil(s));
      if (valid.length > 0) t += ` with ${clean(valid[0].name)}`;
      return t;
    },
  },
  // 15. Sweet Potatoes & Egg Sauce
  {
    id: "sweet-potatoes-egg-sauce",
    name: "Sweet Potatoes & Egg Sauce",
    basePattern: /sweet potato|potato/i,
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    preferredProteinPatterns: [/egg/i, /fish/i],
    preferredSidePatterns: [/spinach|cabbage/i],
    culinaryNote: "Naturally sweet potatoes paired with a savory scrambled egg sauce.",
    generateTitle: (base, protein) => `Boiled ${cleanBase(base.name)} & ${clean(protein?.name) || "Egg Sauce"}`,
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

