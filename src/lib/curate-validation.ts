import { MealType } from "./types";

const MEAL_TYPES = new Set<MealType>(["Breakfast", "Lunch", "Dinner", "Snack"]);
const MAX_TEXT_LENGTH = 200;
const MAX_SIDES = 6;

export type CurateInput = {
  main: string;
  protein?: string;
  supplementary?: string[];
  mealType: MealType;
  dishName?: string;
  culinaryNote?: string;
};

export function validateCurateRequest(value: unknown): { ok: true; value: CurateInput } | { ok: false } {
  if (!value || typeof value !== "object") return { ok: false };
  const input = value as Record<string, unknown>;
  const text = (field: unknown, required = false): string | undefined => {
    if (field === undefined && !required) return undefined;
    if (typeof field !== "string") return undefined;
    const trimmed = field.trim();
    return trimmed && trimmed.length <= MAX_TEXT_LENGTH ? trimmed : undefined;
  };
  const main = text(input.main, true);
  const mealType = text(input.mealType, true) as MealType | undefined;
  if (!main || !mealType || !MEAL_TYPES.has(mealType)) return { ok: false };
  if (input.supplementary !== undefined && (!Array.isArray(input.supplementary) || input.supplementary.length > MAX_SIDES)) return { ok: false };
  const supplementary = (input.supplementary || []).map((side) => text(side, true));
  if (supplementary.some((side) => !side)) return { ok: false };
  return { ok: true, value: { main, mealType, protein: text(input.protein), dishName: text(input.dishName), culinaryNote: text(input.culinaryNote), supplementary: supplementary as string[] } };
}
