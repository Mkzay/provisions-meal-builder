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
 * Automatically seeds starter Nigerian staples if owner has 0 items.
 */
export async function fetchDbCatalogue(owner?: string): Promise<KitchenCatalogue> {
  const sql = getSql();
  if (!sql) {
    return {
      ingredients: SEED_CATALOGUE.ingredients.map((i) => ({ ...i, owner: owner || "Esther" })),
      readyMeals: SEED_CATALOGUE.readyMeals.map((r) => ({ ...r, owner: owner || "Esther" })),
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

    // If owner has 0 ingredients and 0 ready meals, check if they have ever been seeded before
    if (ingRows.length === 0 && mealRows.length === 0 && owner) {
      const settings = await sql`
        SELECT seeded FROM user_pantry_settings WHERE LOWER(owner) = ${targetOwner} LIMIT 1;
      `;
      if (settings.length === 0) {
        await seedStarterPantryForOwner(owner);
        return fetchDbCatalogue(owner);
      }
    }

    const ingredients: Ingredient[] = ingRows.map((r: any) => ({
      id: r.id,
      name: r.name,
      role: r.category as any,
      owner: r.owner,
      available: Boolean(r.available),
      mealTypes: (r.meal_types || []) as MealType[],
      nutrientTags: (r.nutrient_tags || []) as NutrientTag[],
    }));

    const readyMeals: ReadyMeal[] = mealRows.map((r: any) => ({
      id: r.id,
      name: r.name,
      owner: r.owner,
      available: Boolean(r.available),
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
    console.error("Error fetching catalogue from Neon DB, falling back to seed:", error);
    return {
      ingredients: SEED_CATALOGUE.ingredients.map((i) => ({ ...i, owner: owner || "Esther" })),
      readyMeals: SEED_CATALOGUE.readyMeals.map((r) => ({ ...r, owner: owner || "Esther" })),
      lastSynced: new Date().toISOString(),
      isCachedFallback: true,
    };
  }
}

/**
 * Seeds starting verified Nigerian ingredients & ready meals into Postgres for a new owner.
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

  for (const rm of SEED_CATALOGUE.readyMeals) {
    const id = `ready-${targetOwner.toLowerCase()}-${rm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    await sql`
      INSERT INTO ready_meals (id, owner, name, available, meal_types, nutrient_tags)
      VALUES (
        ${id},
        ${targetOwner},
        ${rm.name},
        ${rm.available ?? true},
        ${rm.mealTypes || []},
        ${rm.nutrientTags || []}
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
      await sql`
        DELETE FROM pantry_ingredients
        WHERE (id = ${id} OR LOWER(id) = ${id.toLowerCase()} OR LOWER(name) = ${cleanName})
          AND LOWER(owner) = ${targetOwner};
      `;

      await sql`
        DELETE FROM ready_meals
        WHERE (id = ${id} OR LOWER(id) = ${id.toLowerCase()} OR LOWER(name) = ${cleanName})
          AND LOWER(owner) = ${targetOwner};
      `;
    } else {
      await sql`
        DELETE FROM pantry_ingredients
        WHERE (id = ${id} OR LOWER(id) = ${id.toLowerCase()})
          AND LOWER(owner) = ${targetOwner};
      `;

      await sql`
        DELETE FROM ready_meals
        WHERE (id = ${id} OR LOWER(id) = ${id.toLowerCase()})
          AND LOWER(owner) = ${targetOwner};
      `;
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
