import { isCookingOil, isFruit } from "./ingredient-categories";
import { clean, cleanBase, DishBlueprint } from "./dish-blueprints-types";

export const EXTENDED_DISH_BLUEPRINTS: DishBlueprint[] = [
  // 14. Sweet Potatoes & Egg Sauce
  {
    id: "sweet-potatoes-egg-sauce",
    name: "Sweet Potatoes & Egg Sauce",
    basePattern: /sweet potato/i,
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    preferredProteinPatterns: [/egg/i, /fish/i],
    preferredSidePatterns: [/spinach|cabbage/i],
    culinaryNote: "Naturally sweet potatoes paired with a savory scrambled egg sauce.",
    generateTitle: (base, protein) => `Boiled ${cleanBase(base.name)} & ${clean(protein?.name) || "Egg Sauce"}`,
  },
  // 15. Irish Potatoes with Savory Sauce / Stew
  {
    id: "irish-potatoes-savory",
    name: "Irish Potatoes with Savory Sauce",
    basePattern: /irish potato|potato(?!.*sweet)/i,
    suitableMeals: ["Breakfast", "Lunch", "Dinner"],
    preferredProteinPatterns: [/egg/i, /beef/i, /fish/i, /chicken/i],
    preferredSidePatterns: [/spinach|cabbage/i, /plantain|dodo/i],
    culinaryNote: "Tender boiled Irish potatoes paired with seasoned scrambled egg sauce or savory tomato stew.",
    generateTitle: (base, protein) => `Boiled ${cleanBase(base.name)} & ${clean(protein?.name) || "Savory Sauce"}`,
  },
  // 16. Plantain Porridge / Pottage
  {
    id: "plantain-porridge",
    name: "Savory Plantain Porridge",
    basePattern: /plantain/i,
    requiredPatterns: [/palm oil|crayfish|pepper/i],
    preferredProteinPatterns: [/croaker|fish|titus|smoked/i, /beef|ponmo/i, /chicken/i],
    preferredSidePatterns: [/ugwu|scent leaf|efirin|spinach/i],
    culinaryNote: "Tender plantains simmered in palm oil, pepper reduction, dried fish, and aromatic greens.",
    suitableMeals: ["Lunch", "Dinner"],
    generateTitle: (base, protein, sides) => {
      let t = `Savory ${cleanBase(base.name)} Porridge`;
      if (protein) t += ` with ${clean(protein.name)}`;
      const green = (sides || []).find((s) => /ugwu|scent leaf|efirin|spinach/i.test(s.name));
      if (green) t += ` & ${clean(green.name)}`;
      return t;
    },
  },
  // 17. Boli (Roasted Plantain Combo)
  {
    id: "boli-plantain-groundnut",
    name: "Boli (Roasted Plantains)",
    basePattern: /boli|roasted plantain/i,
    preferredProteinPatterns: [/groundnut|peanut/i, /croaker|fish|titus|mackerel/i],
    preferredSidePatterns: [/pepper|stew|ata din din/i],
    culinaryNote: "Caramelized roasted plantain paired with crunchy roasted groundnuts or grilled spiced fish.",
    suitableMeals: ["Lunch", "Dinner", "Snack"],
    generateTitle: (base, protein) => `Boli (Roasted ${cleanBase(base.name)}) with ${clean(protein?.name) || "Groundnuts"}`,
  },
  // 18. Plantain as Standalone Main (Plantain fallback)
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
  // 19. Ewa Aganyin with Bread or Dodo
  {
    id: "ewa-aganyin-bread",
    name: "Ewa Aganyin & Bread / Dodo",
    basePattern: /(?:^|\b)beans?\b|ewa/i,
    requiredPatterns: [/bread|toast|agege|plantain|dodo/i],
    preferredProteinPatterns: [/egg/i, /croaker|fish|panla/i, /beef|ponmo/i],
    preferredSidePatterns: [/bread|agege/i, /plantain|dodo/i],
    culinaryNote: "Mashed soft beans paired with dark caramelized chili-onion Aganyin palm oil sauce and soft bread or dodo.",
    suitableMeals: ["Breakfast", "Lunch"],
    generateTitle: (base, protein, sides) => {
      const companion = (sides || []).find((s) => /bread|agege|plantain|dodo/i.test(s.name));
      let t = `Ewa Aganyin with ${companion ? clean(companion.name) : "Aganyin Sauce"}`;
      if (protein && !clean(protein.name).toLowerCase().includes("bean")) t += ` & ${clean(protein.name)}`;
      return t;
    },
  },
  // 20. Beans Porridge & Dodo (Beans fallback)
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
      if (protein && !clean(protein.name).toLowerCase().includes("bean")) t += ` with ${clean(protein.name)}`;
      return t;
    },
  },
  // 21. Creamy Oatmeal Bowl
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
  // 22. Custard / Akamu / Ogi (Warm breakfast/dinner bowl)
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
  // 23. Ijebu Garri & Groundnuts
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
  // 24. Eba with Soup & Stew
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
  // 25. Toasted Bread & Eggs
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
];
