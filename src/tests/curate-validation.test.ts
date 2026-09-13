import { describe, expect, it } from "vitest";
import { validateCurateRequest } from "@/lib/curate-validation";

describe("curate request validation", () => {
  it("accepts a bounded valid meal request", () => {
    expect(validateCurateRequest({ main: "Rice", mealType: "Lunch", supplementary: ["Dodo"] }).ok).toBe(true);
  });

  it("rejects unknown meal types and oversized values before they reach AI", () => {
    expect(validateCurateRequest({ main: "Rice", mealType: "Brunch" }).ok).toBe(false);
    expect(validateCurateRequest({ main: "x".repeat(201), mealType: "Lunch" }).ok).toBe(false);
  });
});
