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

export function clean(name?: string): string {
  return (name || "").replace(/\(.*?\)/g, "").trim();
}

export function cleanBase(name?: string): string {
  if (!name) return "";
  let text = clean(name);
  const lower = text.toLowerCase();
  if (lower.includes("bread")) return "Bread";
  if (lower.includes("spaghetti")) return "Spaghetti";
  if (lower.includes("noodle") || lower.includes("indomie")) return "Noodles";
  if (lower.includes("custard")) return "Custard";
  if (lower.includes("oat")) return "Oatmeal";
  if (lower.includes("plantain")) return "Plantains";
  if (lower.includes("sweet potato")) return "Sweet Potatoes";
  if (lower.includes("irish potato") || lower === "potato" || lower === "potatoes") return "Irish Potatoes";
  if (lower.includes("yam") && !lower.includes("flour") && !lower.includes("elubo") && !lower.includes("amala")) return "Yam";
  if (text.includes("/")) text = text.split("/")[0].trim();
  return text;
}
