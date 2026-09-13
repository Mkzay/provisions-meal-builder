import { getSql } from "./db";
import { initDatabaseSchema } from "./db-schema";
import { CreateSavedRecipeInput, MealType, SavedRecipe } from "./types";

let schemaInitialized = false;

async function ensureSchema() {
  if (!schemaInitialized) {
    await initDatabaseSchema();
    schemaInitialized = true;
  }
}

/**
 * Fetches all saved recipes for an owner from Neon Postgres.
 */
export async function fetchDbSavedRecipes(owner: string): Promise<SavedRecipe[]> {
  const sql = getSql();
  if (!sql) return [];

  try {
    await ensureSchema();
    const targetOwner = owner.trim().toLowerCase();

    const rows = await sql`
      SELECT
        id,
        owner,
        name,
        meal_types,
        main_ingredient_id,
        main_ingredient_name,
        protein_ids,
        protein_names,
        supplementary_ids,
        supplementary_names,
        source_url,
        created_at
      FROM saved_recipes
      WHERE LOWER(owner) = ${targetOwner}
      ORDER BY created_at DESC;
    `;

    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      mealTypes: (r.meal_types || []) as MealType[],
      owner: r.owner,
      mainIngredientId: r.main_ingredient_id || undefined,
      mainIngredientName: r.main_ingredient_name || undefined,
      proteinId: r.protein_ids?.[0] || undefined,
      proteinIds: r.protein_ids || [],
      proteinName: r.protein_names?.[0] || undefined,
      proteinNames: r.protein_names || [],
      supplementaryId: r.supplementary_ids?.[0] || undefined,
      supplementaryIds: r.supplementary_ids || [],
      supplementaryName: r.supplementary_names?.[0] || undefined,
      supplementaryNames: r.supplementary_names || [],
      sourceUrl: r.source_url || undefined,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
    }));
  } catch (error) {
    console.error("Error fetching saved recipes from Postgres:", error);
    return [];
  }
}

/**
 * Creates a new saved recipe in Neon Postgres.
 */
export async function createDbSavedRecipe(
  input: CreateSavedRecipeInput
): Promise<{ success: boolean; recipe?: SavedRecipe }> {
  const sql = getSql();
  const owner = input.owner.trim();
  const id = `recipe-${owner.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const proteinIds = (input.proteinIds && input.proteinIds.length > 0)
    ? input.proteinIds
    : (input.proteinId ? [input.proteinId] : []);

  const supplementaryIds = (input.supplementaryIds && input.supplementaryIds.length > 0)
    ? input.supplementaryIds
    : (input.supplementaryId ? [input.supplementaryId] : []);

  if (!sql) {
    const fallbackRecipe: SavedRecipe = {
      id,
      name: input.name,
      mealTypes: input.mealTypes,
      owner,
      mainIngredientId: input.mainIngredientId,
      proteinIds,
      supplementaryIds,
      sourceUrl: input.sourceUrl,
      createdAt: now,
    };
    return { success: true, recipe: fallbackRecipe };
  }

  try {
    await ensureSchema();

    // Look up ingredient names from pantry_ingredients for cached display
    let mainName: string | null = null;
    let proteinNames: string[] = [];
    let suppNames: string[] = [];

    if (input.mainIngredientId) {
      const rows = await sql`
        SELECT name FROM pantry_ingredients WHERE id = ${input.mainIngredientId} LIMIT 1;
      `;
      if (rows.length > 0) mainName = rows[0].name;
    }

    if (proteinIds.length > 0) {
      const rows = await sql`
        SELECT name FROM pantry_ingredients WHERE id = ANY(${proteinIds});
      `;
      proteinNames = rows.map((r: any) => r.name);
    }

    if (supplementaryIds.length > 0) {
      const rows = await sql`
        SELECT name FROM pantry_ingredients WHERE id = ANY(${supplementaryIds});
      `;
      suppNames = rows.map((r: any) => r.name);
    }

    await sql`
      INSERT INTO saved_recipes (
        id,
        owner,
        name,
        meal_types,
        main_ingredient_id,
        main_ingredient_name,
        protein_ids,
        protein_names,
        supplementary_ids,
        supplementary_names,
        source_url,
        created_at
      )
      VALUES (
        ${id},
        ${owner},
        ${input.name.trim()},
        ${input.mealTypes || []},
        ${input.mainIngredientId || null},
        ${mainName},
        ${proteinIds},
        ${proteinNames},
        ${supplementaryIds},
        ${suppNames},
        ${input.sourceUrl || null},
        NOW()
      );
    `;

    const newRecipe: SavedRecipe = {
      id,
      name: input.name.trim(),
      mealTypes: input.mealTypes,
      owner,
      mainIngredientId: input.mainIngredientId,
      mainIngredientName: mainName || undefined,
      proteinId: proteinIds[0],
      proteinIds,
      proteinName: proteinNames[0],
      proteinNames,
      supplementaryId: supplementaryIds[0],
      supplementaryIds,
      supplementaryName: suppNames[0],
      supplementaryNames: suppNames,
      sourceUrl: input.sourceUrl,
      createdAt: now,
    };

    return { success: true, recipe: newRecipe };
  } catch (error) {
    console.error("Error creating saved recipe in Postgres:", error);
    return { success: false };
  }
}

/**
 * Deletes a saved recipe from Neon Postgres.
 */
export async function deleteDbSavedRecipe(
  id: string,
  owner: string
): Promise<{ success: boolean }> {
  const sql = getSql();
  if (!sql) return { success: true };

  try {
    await ensureSchema();
    const targetOwner = owner.trim().toLowerCase();

    await sql`
      DELETE FROM saved_recipes
      WHERE id = ${id} AND LOWER(owner) = ${targetOwner};
    `;

    return { success: true };
  } catch (error) {
    console.error("Error deleting saved recipe from Postgres:", error);
    return { success: false };
  }
}
