import { getSql } from "./db";
import { initDatabaseSchema } from "./db-schema";
import { resolveLeftoverAction } from "./flow-logic";
import { SEED_CATALOGUE } from "./seed-data";
import {
  AddSupplyInput,
  Ingredient,
  KitchenCatalogue,
  LeftoverDecision,
  MealType,
  NutrientTag,
  ReadyMeal,
} from "./types";

let schemaInitialized = false;

async function ensureSchema() {
  if (!schemaInitialized) {
    await initDatabaseSchema();
    schemaInitialized = true;
  }
}

/**
 * Fetches ingredients and ready meals for an owner from Neon Postgres.
 * For new owners, returns an empty pantry (seeding starter staples is opt-in).
 */
export async function fetchDbCatalogue(owner?: string): Promise<KitchenCatalogue> {
  const sql = getSql();
  if (!sql) {
    return {
      ingredients: SEED_CATALOGUE.ingredients.map((i) => ({ ...i, owner: owner || "Esther" })),
      readyMeals: [],
      lastSynced: new Date().toISOString(),
      isCachedFallback: true,
    };
  }

  try {
    await ensureSchema();
    const targetOwner = (owner || "Esther").trim().toLowerCase();

    // 1. Fetch pantry ingredients
    const ingRows = await sql`
      SELECT id, owner, name, category, available, meal_types, nutrient_tags
      FROM pantry_ingredients
      WHERE LOWER(owner) = ${targetOwner}
      ORDER BY name ASC;
    `;

    // 2. Fetch ready meals
    const mealRows = await sql`
      SELECT id, owner, name, available, meal_types, nutrient_tags
      FROM ready_meals
      WHERE LOWER(owner) = ${targetOwner}
      ORDER BY name ASC;
    `;

    // Note: Automatic seeding is disabled (Option B) so new accounts start with an empty pantry.
    // Starter staples can be loaded opt-in by the user via the UI.

    const ingredients: Ingredient[] = ingRows.map((r: any) => ({
      id: r.id, name: r.name, role: r.category as any, owner: r.owner,
      available: Boolean(r.available), mealTypes: (r.meal_types || []) as MealType[],
      nutrientTags: (r.nutrient_tags || []) as NutrientTag[],
    }));

    const readyMeals: ReadyMeal[] = mealRows.map((r: any) => ({
      id: r.id, name: r.name, owner: r.owner, available: Boolean(r.available),
      mealTypes: (r.meal_types || []) as MealType[],
      nutrientTags: (r.nutrient_tags || []) as NutrientTag[],
    }));

    return {
      ingredients,
      readyMeals,
      lastSynced: new Date().toISOString(),
      isCachedFallback: false,
    };
  } catch (error) {
    console.error("Error fetching catalogue from Neon DB:", error);
    return {
      ingredients: [],
      readyMeals: [],
      lastSynced: new Date().toISOString(),
      isCachedFallback: true,
    };
  }
}

/**
 * Seeds starting verified Nigerian ingredients into Postgres for an owner (opt-in; ingredients only, never ready meals).
 */
export async function seedStarterPantryForOwner(owner: string): Promise<void> {
  const sql = getSql();
  if (!sql) return;

  await ensureSchema();
  const targetOwner = owner.trim();

  for (const ing of SEED_CATALOGUE.ingredients) {
    const id = `ing-${targetOwner.toLowerCase()}-${ing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    await sql`
      INSERT INTO pantry_ingredients (id, owner, name, category, available, meal_types, nutrient_tags)
      VALUES (
        ${id},
        ${targetOwner},
        ${ing.name},
        ${ing.role},
        ${ing.available ?? true},
        ${ing.mealTypes || []},
        ${ing.nutrientTags || []}
      )
      ON CONFLICT (id) DO NOTHING;
    `;
  }

  await sql`
    INSERT INTO user_pantry_settings (owner, seeded)
    VALUES (${targetOwner.toLowerCase()}, TRUE)
    ON CONFLICT (owner) DO UPDATE SET updated_at = NOW();
  `;
}

/**
 * Adds an ingredient or ready meal to Postgres.
 */
export async function addDbSupply(
  input: AddSupplyInput
): Promise<{ success: boolean; id?: string }> {
  const sql = getSql();
  if (!sql) {
    return { success: true, id: `local-${Date.now()}` };
  }

  try {
    await ensureSchema();
    const owner = (input.owner || "Esther").trim();
    const cleanName = input.name.trim();

    if (input.kind === "ingredient") {
      const id = `ing-${owner.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await sql`
        INSERT INTO pantry_ingredients (id, owner, name, category, available, meal_types, nutrient_tags)
        VALUES (
          ${id},
          ${owner},
          ${cleanName},
          ${input.role || "Main"},
          ${input.available !== undefined ? input.available : true},
          ${input.mealTypes || []},
          ${[]}
        );
      `;
      return { success: true, id };
    }

    if (input.kind === "ready_meal") {
      const id = `ready-${owner.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      await sql`
        INSERT INTO ready_meals (id, owner, name, available, meal_types, nutrient_tags)
        VALUES (
          ${id},
          ${owner},
          ${cleanName},
          ${input.available !== undefined ? input.available : true},
          ${input.mealTypes || []},
          ${[]}
        );
      `;
      return { success: true, id };
    }

    return { success: true, id: `local-${Date.now()}` };
  } catch (error) {
    console.error("Failed to add supply to Postgres:", error);
    return { success: false };
  }
}

/**
 * Toggles availability of an ingredient or ready meal in Postgres.
 */
export async function updateDbSupplyAvailability(
  id: string,
  available: boolean,
  owner: string
): Promise<{ success: boolean }> {
  const sql = getSql();
  if (!sql) return { success: true };

  try {
    await ensureSchema();
    const targetOwner = owner.trim().toLowerCase();

    // Check pantry ingredients
    await sql`
      UPDATE pantry_ingredients
      SET available = ${available}, updated_at = NOW()
      WHERE id = ${id} AND LOWER(owner) = ${targetOwner};
    `;

    // Check ready meals
    await sql`
      UPDATE ready_meals
      SET available = ${available}, updated_at = NOW()
      WHERE id = ${id} AND LOWER(owner) = ${targetOwner};
    `;

    return { success: true };
  } catch (error) {
    console.error("Failed to update supply availability in Postgres:", error);
    return { success: false };
  }
}

/**
 * Updates properties (name, role, mealTypes, available) of an ingredient or ready meal in Postgres.
 */
export async function updateDbSupply(
  id: string,
  updates: {
    name?: string;
    role?: string;
    mealTypes?: MealType[];
    available?: boolean;
  },
  owner: string
): Promise<{ success: boolean }> {
  const sql = getSql();
  if (!sql) return { success: true };

  try {
    await ensureSchema();
    const targetOwner = owner.trim().toLowerCase();

    // Check pantry ingredients first
    const ingCheck = await sql`
      SELECT id, name, category, meal_types, available FROM pantry_ingredients
      WHERE id = ${id} AND LOWER(owner) = ${targetOwner}
      LIMIT 1;
    `;

    if (ingCheck.length > 0) {
      const cur = ingCheck[0];
      const newName = updates.name !== undefined ? updates.name.trim() : cur.name;
      const newRole = updates.role !== undefined ? updates.role : cur.category;
      const newMealTypes = updates.mealTypes !== undefined ? updates.mealTypes : cur.meal_types;
      const newAvail = updates.available !== undefined ? updates.available : cur.available;

      await sql`
        UPDATE pantry_ingredients
        SET
          name = ${newName},
          category = ${newRole},
          meal_types = ${newMealTypes},
          available = ${newAvail},
          updated_at = NOW()
        WHERE id = ${id} AND LOWER(owner) = ${targetOwner};
      `;
      return { success: true };
    }

    // Check ready meals
    const mealCheck = await sql`
      SELECT id, name, meal_types, available FROM ready_meals
      WHERE id = ${id} AND LOWER(owner) = ${targetOwner}
      LIMIT 1;
    `;

    if (mealCheck.length > 0) {
      const cur = mealCheck[0];
      const newName = updates.name !== undefined ? updates.name.trim() : cur.name;
      const newMealTypes = updates.mealTypes !== undefined ? updates.mealTypes : cur.meal_types;
      const newAvail = updates.available !== undefined ? updates.available : cur.available;

      await sql`
        UPDATE ready_meals
        SET
          name = ${newName},
          meal_types = ${newMealTypes},
          available = ${newAvail},
          updated_at = NOW()
        WHERE id = ${id} AND LOWER(owner) = ${targetOwner};
      `;
      return { success: true };
    }

    return { success: false };
  } catch (error) {
    console.error("Failed to update supply in Postgres:", error);
    return { success: false };
  }
}

/**
 * Deletes a supply from Postgres.
 */
export async function deleteDbSupply(
  id: string,
  owner: string,
  name?: string
): Promise<{ success: boolean }> {
  const sql = getSql();
  if (!sql) return { success: true };

  try {
    await ensureSchema();
    const targetOwner = owner.trim().toLowerCase();
    const cleanName = name?.trim().toLowerCase();

    if (cleanName) {
      await sql`DELETE FROM pantry_ingredients WHERE (id = ${id} OR LOWER(id) = ${id.toLowerCase()} OR LOWER(name) = ${cleanName}) AND LOWER(owner) = ${targetOwner};`;
      await sql`DELETE FROM ready_meals WHERE (id = ${id} OR LOWER(id) = ${id.toLowerCase()} OR LOWER(name) = ${cleanName}) AND LOWER(owner) = ${targetOwner};`;
    } else {
      await sql`DELETE FROM pantry_ingredients WHERE (id = ${id} OR LOWER(id) = ${id.toLowerCase()}) AND LOWER(owner) = ${targetOwner};`;
      await sql`DELETE FROM ready_meals WHERE (id = ${id} OR LOWER(id) = ${id.toLowerCase()}) AND LOWER(owner) = ${targetOwner};`;
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to delete supply from Postgres:", error);
    return { success: false };
  }
}

/**
 * Handles leftovers decision using Postgres ready meals.
 */
export async function handleDbLeftoverDecision(decision: LeftoverDecision): Promise<{
  success: boolean;
  action: string;
  readyMealId?: string;
  newMealId?: string;
}> {
  const result = resolveLeftoverAction(decision);
  const sql = getSql();

  if (result.action === "none" || result.action === "keep_ready") {
    return { success: true, action: result.action, readyMealId: result.readyMealId };
  }

  if (!sql) {
    return {
      success: true,
      action: result.action,
      readyMealId: result.readyMealId,
      newMealId: result.newReadyMeal ? `local-ready-${Date.now()}` : undefined,
    };
  }

  try {
    await ensureSchema();
    const owner = (decision.owner || "Esther").trim();

    if (result.action === "uncheck_ready" && result.readyMealId) {
      await updateDbSupplyAvailability(result.readyMealId, false, owner);
      return { success: true, action: "uncheck_ready", readyMealId: result.readyMealId };
    }

    if (result.action === "create_ready" && result.newReadyMeal) {
      const addRes = await addDbSupply({
        kind: "ready_meal",
        name: result.newReadyMeal.name,
        mealTypes: [result.newReadyMeal.mealType],
        owner: result.newReadyMeal.owner,
        available: true,
      });

      return { success: true, action: "create_ready", newMealId: addRes.id };
    }

    return { success: true, action: result.action };
  } catch (error) {
    console.error("Failed to process leftovers in Postgres:", error);
    return { success: false, action: result.action };
  }
}
