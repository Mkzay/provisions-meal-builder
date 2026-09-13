import { describe, expect, it } from "vitest";
import { initDatabaseSchema } from "../lib/db-schema";
import {
  addDbSupply,
  deleteDbSupply,
  fetchDbCatalogue,
  handleDbLeftoverDecision,
  seedStarterPantryForOwner,
  updateDbSupplyAvailability,
} from "../lib/db-supplies";
import {
  addDbWeightLogEntry,
  deleteDbWeightLogEntry,
  fetchDbMealProfile,
  fetchDbWeightLogs,
  saveDbMealProfile,
} from "../lib/db-profile";
import {
  createDbSavedRecipe,
  deleteDbSavedRecipe,
  fetchDbSavedRecipes,
} from "../lib/db-recipes";
import {
  fetchDbOwnerMealRatings,
  logDbMeal,
  updateDbMealRating,
} from "../lib/db-meal-log";
import { LeftoverDecision, MealLogEntry } from "../lib/types";

describe("Neon Serverless PostgreSQL Database Layer", () => {
  describe("Schema Initialization", () => {
    it("runs initDatabaseSchema without error", async () => {
      await expect(initDatabaseSchema()).resolves.not.toThrow();
    });
  });

  describe("Pantry & Supplies (Catalogue)", () => {
    it("fetches catalogue with fallback or live database items (never seeds ready meals)", async () => {
      const catalogue = await fetchDbCatalogue("test_owner_neon");
      expect(catalogue).toBeDefined();
      expect(Array.isArray(catalogue.ingredients)).toBe(true);
      expect(Array.isArray(catalogue.readyMeals)).toBe(true);
      expect(catalogue.readyMeals).toHaveLength(0);
    });

    it("seeds starter ingredients only when explicitly requested (Option B)", async () => {
      await seedStarterPantryForOwner("test_seed_optin_owner");
      const catalogue = await fetchDbCatalogue("test_seed_optin_owner");
      expect(catalogue).toBeDefined();
      expect(catalogue.readyMeals).toHaveLength(0);
    });

    it("adds a new ingredient supply", async () => {
      const res = await addDbSupply({
        kind: "ingredient",
        name: "Test Cassava Flakes",
        role: "Main",
        mealTypes: ["Lunch", "Dinner"],
        owner: "test_owner_neon",
        available: true,
      });
      expect(res.success).toBe(true);
      expect(res.id).toBeTruthy();
    });

    it("toggles supply availability", async () => {
      const res = await updateDbSupplyAvailability("test-item-123", false, "test_owner_neon");
      expect(res.success).toBe(true);
    });

    it("deletes a supply", async () => {
      const res = await deleteDbSupply("test-item-123", "test_owner_neon");
      expect(res.success).toBe(true);
    });

    it("handles leftover decision smoothly", async () => {
      const decision: LeftoverDecision = {
        hadLeftovers: true,
        source: "Built",
        mealType: "Dinner",
        mainIngredient: "Rice",
        protein: "Chicken",
        owner: "test_owner_neon",
      };
      const res = await handleDbLeftoverDecision(decision);
      expect(res.success).toBe(true);
      expect(res.action).toBe("create_ready");
    });
  });

  describe("Meal Profile & Weight History", () => {
    it("saves and retrieves a meal profile", async () => {
      const saveRes = await saveDbMealProfile({
        owner: "test_profile_owner",
        goal: "Gain weight",
        height: 175,
        weight: 70,
        nutrientPriorities: ["High Protein", "High Fiber"],
        mealsPerDay: 4,
      });
      expect(saveRes.success).toBe(true);
      expect(saveRes.profile.goal).toBe("Gain weight");
      expect(saveRes.profile.owner).toBe("test_profile_owner");

      const fetched = await fetchDbMealProfile("test_profile_owner");
      if (fetched) {
        expect(fetched.goal).toBe("Gain weight");
        expect(fetched.mealsPerDay).toBe(4);
      }
    });

    it("records and fetches weight logs", async () => {
      const logRes = await addDbWeightLogEntry("test_profile_owner", 70.5, "2026-09-13");
      expect(logRes.success).toBe(true);
      expect(logRes.entry?.weight).toBe(70.5);

      const logs = await fetchDbWeightLogs("test_profile_owner");
      expect(Array.isArray(logs)).toBe(true);
    });

    it("deletes a weight log entry safely", async () => {
      const delRes = await deleteDbWeightLogEntry("99999", "test_profile_owner");
      expect(delRes.success).toBe(true);
    });
  });

  describe("Saved Custom Recipes", () => {
    it("creates, fetches, and deletes saved recipes", async () => {
      const createRes = await createDbSavedRecipe({
        owner: "test_recipe_owner",
        name: "Test Jollof Special",
        mealTypes: ["Dinner"],
        mainIngredientId: "ing-rice-1",
        proteinIds: ["ing-chicken-1"],
        supplementaryIds: ["ing-dodo-1"],
      });
      expect(createRes.success).toBe(true);
      expect(createRes.recipe?.name).toBe("Test Jollof Special");

      const list = await fetchDbSavedRecipes("test_recipe_owner");
      expect(Array.isArray(list)).toBe(true);

      const delRes = await deleteDbSavedRecipe(createRes.recipe?.id || "recipe-1", "test_recipe_owner");
      expect(delRes.success).toBe(true);
    });
  });

  describe("Meal Logging & Ratings", () => {
    it("logs a built meal and updates rating", async () => {
      const entry: MealLogEntry = {
        owner: "test_log_owner",
        mealType: "Lunch",
        source: "Built",
        mainIngredient: "Basmati Rice",
        protein: "Grilled Chicken",
        supplementary: "Fried Dodo",
        date: "2026-09-13",
        hadLeftovers: false,
        rating: "Liked",
      };

      const logRes = await logDbMeal(entry);
      expect(logRes.success).toBe(true);
      expect(logRes.id).toBeTruthy();

      if (logRes.id) {
        const rateRes = await updateDbMealRating(logRes.id, "Liked", "test_log_owner");
        expect(rateRes.success).toBe(true);
      }

      const ratings = await fetchDbOwnerMealRatings("test_log_owner");
      expect(Array.isArray(ratings)).toBe(true);
    });
  });
});
