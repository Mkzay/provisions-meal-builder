import { getSql } from "./db";
import { initDatabaseSchema } from "./db-schema";
import { MealLogEntry, MealRating, RatedMealRecord } from "./types";

let schemaInitialized = false;

async function ensureSchema() {
  if (!schemaInitialized) {
    await initDatabaseSchema();
    schemaInitialized = true;
  }
}

/**
 * Logs a built or ready meal to Neon Postgres.
 */
export async function logDbMeal(
  entry: MealLogEntry
): Promise<{ success: boolean; id?: string }> {
  const sql = getSql();
  const owner = (entry.owner || "Esther").trim();

  const mealName =
    entry.source === "Ready Meal"
      ? entry.readyMeal || "Ready Meal"
      : [entry.mainIngredient, entry.protein].filter(Boolean).join(" + ") || "Built Meal";

  if (!sql) {
    return { success: true, id: `local-log-${Date.now()}` };
  }

  try {
    await ensureSchema();

    const dateVal = entry.date || new Date().toISOString().split("T")[0];

    const rows = await sql`
      INSERT INTO meal_logs (
        owner,
        meal_name,
        meal_type,
        source,
        main_ingredient,
        protein,
        supplementary,
        ready_meal,
        date,
        had_leftovers,
        rating,
        logged_at
      )
      VALUES (
        ${owner},
        ${mealName},
        ${entry.mealType},
        ${entry.source},
        ${entry.mainIngredient || null},
        ${entry.protein || null},
        ${entry.supplementary || null},
        ${entry.readyMeal || null},
        ${dateVal},
        ${Boolean(entry.hadLeftovers)},
        ${entry.rating || null},
        NOW()
      )
      RETURNING id;
    `;

    return { success: true, id: String(rows[0].id) };
  } catch (error) {
    console.error("Error logging meal to Postgres:", error);
    return { success: false };
  }
}

/**
 * Updates the user's rating on a logged meal in Neon Postgres.
 */
export async function updateDbMealRating(
  logId: string,
  rating: MealRating,
  owner?: string
): Promise<{ success: boolean }> {
  const sql = getSql();
  if (!sql) return { success: true };

  const numericId = parseInt(logId, 10);
  if (isNaN(numericId)) {
    return { success: true };
  }

  try {
    await ensureSchema();

    if (owner) {
      const targetOwner = owner.trim().toLowerCase();
      await sql`
        UPDATE meal_logs
        SET rating = ${rating}
        WHERE id = ${numericId} AND LOWER(owner) = ${targetOwner};
      `;
    } else {
      await sql`
        UPDATE meal_logs
        SET rating = ${rating}
        WHERE id = ${numericId};
      `;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating meal rating in Postgres:", error);
    return { success: false };
  }
}

/**
 * Fetches all rated meal records for an owner from Neon Postgres.
 */
export async function fetchDbOwnerMealRatings(owner: string): Promise<RatedMealRecord[]> {
  const sql = getSql();
  if (!sql) return [];

  try {
    await ensureSchema();
    const targetOwner = owner.trim().toLowerCase();

    const rows = await sql`
      SELECT id, owner, main_ingredient, protein, rating
      FROM meal_logs
      WHERE LOWER(owner) = ${targetOwner}
        AND rating IS NOT NULL
        AND main_ingredient IS NOT NULL
        AND protein IS NOT NULL
      ORDER BY logged_at DESC;
    `;

    return rows.map((r: any) => ({
      id: String(r.id),
      baseName: r.main_ingredient,
      proteinName: r.protein,
      rating: r.rating as MealRating,
      owner: r.owner,
    }));
  } catch (error) {
    console.error("Error fetching meal ratings from Postgres:", error);
    return [];
  }
}
