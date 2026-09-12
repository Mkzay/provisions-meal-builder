import { IngredientRole } from "./types";

export interface ClassifiedBulkItem {
  id: string;
  name: string;
  role: IngredientRole;
}

const PROTEIN_KEYWORDS = new Set([
  "chicken",
  "turkey",
  "beef",
  "steak",
  "pork",
  "bacon",
  "sausage",
  "ham",
  "lamb",
  "mutton",
  "goat",
  "fish",
  "salmon",
  "tuna",
  "tilapia",
  "cod",
  "mackerel",
  "sardine",
  "sardines",
  "shrimp",
  "prawn",
  "prawns",
  "crab",
  "lobster",
  "egg",
  "eggs",
  "tofu",
  "tempeh",
  "seitan",
  "beans",
  "lentil",
  "lentils",
  "chickpea",
  "chickpeas",
  "edamame",
  "yogurt",
  "whey",
  "casein",
  "anchovy",
  "prosciutto",
  "meat",
  "akara",
  "crayfish",
]);

const MAIN_KEYWORDS = new Set([
  "rice",
  "pasta",
  "spaghetti",
  "penne",
  "fettuccine",
  "macaroni",
  "noodle",
  "noodles",
  "indomie",
  "ramen",
  "bread",
  "bagel",
  "toast",
  "pita",
  "tortilla",
  "wrap",
  "oat",
  "oats",
  "oatmeal",
  "porridge",
  "potato",
  "potatoes",
  "yam",
  "yams",
  "plantain",
  "plantains",
  "couscous",
  "quinoa",
  "bulgur",
  "corn",
  "maize",
  "golden",
  "morn",
  "custard",
  "ogi",
  "akamu",
  "garri",
  "gari",
  "fufu",
  "semo",
  "semovita",
  "cassava",
  "dumpling",
  "dumplings",
  "gnocchi",
  "pancake",
  "pancakes",
  "waffle",
  "waffles",
  "roti",
  "naan",
  "cereal",
  "granola",
]);

/**
 * Clean and match ingredient words against culinary categories.
 */
export function inferIngredientRole(rawName: string): IngredientRole {
  const normalized = rawName.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
  const tokens = normalized.split(/\s+/).filter(Boolean);

  // 1. First check if any token matches Protein keywords
  for (const token of tokens) {
    if (PROTEIN_KEYWORDS.has(token)) return "Protein";
  }

  // 2. Then check if any token matches Main/Carb keywords
  for (const token of tokens) {
    if (MAIN_KEYWORDS.has(token)) return "Main";
  }

  // 3. Fallback check for partial substring matches
  for (const p of PROTEIN_KEYWORDS) {
    if (p.length > 3 && normalized.includes(p)) return "Protein";
  }
  for (const m of MAIN_KEYWORDS) {
    if (m.length > 3 && normalized.includes(m)) return "Main";
  }

  // 4. Default to Supplementary (sides, veggies, sauces, spices, toppings)
  return "Supplementary";
}

/**
 * Parses user multiline or comma-delimited text and auto-assigns culinary roles.
 */
export function parseAndClassifyBulkItems(rawText: string): ClassifiedBulkItem[] {
  const rawItems = rawText
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return rawItems.map((name, index) => ({
    id: `item-${index}-${Date.now()}`,
    name,
    role: inferIngredientRole(name),
  }));
}
