import { describe, expect, it } from "vitest";
import { saveDbMealProfile } from "../lib/db-profile";
import fs from "fs";
import path from "path";

describe("Meals Per Day Logic & Clean UI Verification", () => {
  it("defaults meal profile to 4 meals per day when not specified", async () => {
    const profile = await saveDbMealProfile({
      owner: "default_test_user",
      goal: "Eat healthier",
    });

    expect(profile.profile.mealsPerDay).toBe(4);
  });

  it("ensures no user-visible 'Notion' mentions remain in key UI files", () => {
    const loginPage = fs.readFileSync(
      path.join(__dirname, "../app/login/page.tsx"),
      "utf-8"
    );
    expect(loginPage.includes("Notion Synced")).toBe(false);

    const mealConfirmation = fs.readFileSync(
      path.join(__dirname, "../components/MealConfirmation.tsx"),
      "utf-8"
    );
    expect(mealConfirmation.includes("Logging to Notion")).toBe(false);
    expect(mealConfirmation.includes("Notion Meal Log")).toBe(false);

    const pantryStatCard = fs.readFileSync(
      path.join(__dirname, "../components/PantryStatCard.tsx"),
      "utf-8"
    );
    expect(pantryStatCard.includes("Notion Connection →")).toBe(false);
  });

  it("verifies EmptyKitchenStarterCard is exported and imports cleanly", async () => {
    const mod = await import("../components/EmptyKitchenStarterCard");
    expect(mod.EmptyKitchenStarterCard).toBeDefined();
  });

  it("verifies MealTypeSelector is exported and imports cleanly", async () => {
    const mod = await import("../components/MealTypeSelector");
    expect(mod.MealTypeSelector).toBeDefined();
  });

  it("verifies MealProfileSection restricts options to 2, 3, and 4 (removes 5)", () => {
    const profileSectionCode = fs.readFileSync(
      path.join(__dirname, "../components/MealProfileSection.tsx"),
      "utf-8"
    );
    // Ensure option 5 is completely removed
    expect(profileSectionCode.includes("{ count: 5")).toBe(false);
    expect(profileSectionCode.includes("count: 2")).toBe(true);
    expect(profileSectionCode.includes("count: 3")).toBe(true);
    expect(profileSectionCode.includes("count: 4")).toBe(true);
  });

  it("verifies 3rd card in 3-meal plan expands to full width on desktop view", () => {
    const selectorCode = fs.readFileSync(
      path.join(__dirname, "../components/MealTypeSelector.tsx"),
      "utf-8"
    );
    expect(selectorCode.includes('isThirdInThree ? "sm:col-span-2 w-full" : ""')).toBe(true);
    expect(selectorCode.includes("calc(50%-0.625rem)")).toBe(false);
  });

  it("ensures MealTypeSelector does NOT auto-call onSelect inside useEffect on mount", () => {
    const selectorCode = fs.readFileSync(
      path.join(__dirname, "../components/MealTypeSelector.tsx"),
      "utf-8"
    );
    // onSelect must only be invoked via user click, never in a useEffect
    expect(selectorCode.includes("onSelect(visibleOptions[0].type)")).toBe(false);
  });
});
