import { getSql } from "./db";
import { initDatabaseSchema } from "./db-schema";
import { MealProfile, NutrientTag, UserGoal, WeightLogEntry } from "./types";

let schemaInitialized = false;

async function ensureSchema() {
  if (!schemaInitialized) {
    await initDatabaseSchema();
    schemaInitialized = true;
  }
}

/**
 * Fetches the user's meal profile from Neon Postgres.
 */
export async function fetchDbMealProfile(owner: string): Promise<MealProfile | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    await ensureSchema();
    const targetOwner = owner.trim().toLowerCase();

    const rows = await sql`
      SELECT owner, goal, height, weight, nutrient_priorities, meals_per_day, updated_at
      FROM meal_profiles
      WHERE LOWER(owner) = ${targetOwner}
      LIMIT 1;
    `;

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      owner: row.owner,
      goal: row.goal as UserGoal,
      height: row.height ? Number(row.height) : undefined,
      weight: row.weight ? Number(row.weight) : undefined,
      nutrientPriorities: (row.nutrient_priorities || []) as NutrientTag[],
      mealsPerDay: row.meals_per_day ? Number(row.meals_per_day) : 4,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching meal profile from Postgres:", error);
    return null;
  }
}

/**
 * Saves or updates the user's meal profile in Neon Postgres.
 */
export async function saveDbMealProfile(profile: {
  owner: string;
  goal: UserGoal;
  height?: number;
  weight?: number;
  nutrientPriorities?: NutrientTag[];
  mealsPerDay?: number;
}): Promise<{ success: boolean; profile: MealProfile }> {
  const sql = getSql();
  const owner = profile.owner.trim();
  const now = new Date().toISOString();

  const optimisticProfile: MealProfile = {
    owner,
    goal: profile.goal,
    height: profile.height,
    weight: profile.weight,
    nutrientPriorities: profile.nutrientPriorities || [],
    mealsPerDay: profile.mealsPerDay || 4,
    updatedAt: now,
  };

  if (!sql) {
    return { success: true, profile: optimisticProfile };
  }

  try {
    await ensureSchema();

    await sql`
      INSERT INTO meal_profiles (
        owner,
        goal,
        height,
        weight,
        nutrient_priorities,
        meals_per_day,
        updated_at
      )
      VALUES (
        ${owner},
        ${profile.goal},
        ${profile.height ?? null},
        ${profile.weight ?? null},
        ${profile.nutrientPriorities || []},
        ${profile.mealsPerDay ?? 4},
        NOW()
      )
      ON CONFLICT (owner) DO UPDATE
      SET goal = EXCLUDED.goal,
          height = EXCLUDED.height,
          weight = EXCLUDED.weight,
          nutrient_priorities = EXCLUDED.nutrient_priorities,
          meals_per_day = EXCLUDED.meals_per_day,
          updated_at = NOW();
    `;

    return { success: true, profile: optimisticProfile };
  } catch (error) {
    console.error("Error saving meal profile to Postgres:", error);
    return { success: true, profile: optimisticProfile };
  }
}

/**
 * Fetches historical weight log entries for an owner from Neon Postgres.
 */
export async function fetchDbWeightLogs(owner: string): Promise<WeightLogEntry[]> {
  const sql = getSql();
  if (!sql) return [];

  try {
    await ensureSchema();
    const targetOwner = owner.trim().toLowerCase();

    const rows = await sql`
      SELECT id, owner, weight, date, unit, created_at
      FROM weight_logs
      WHERE LOWER(owner) = ${targetOwner}
      ORDER BY date DESC, id DESC;
    `;

    return rows.map((r: any) => ({
      id: String(r.id),
      owner: r.owner,
      weight: Number(r.weight),
      date: typeof r.date === "string" ? r.date.split("T")[0] : new Date(r.date).toISOString().split("T")[0],
      unit: r.unit || "kg",
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
    }));
  } catch (error) {
    console.error("Error fetching weight logs from Postgres:", error);
    return [];
  }
}

/**
 * Adds a new weight log entry to Neon Postgres.
 */
export async function addDbWeightLogEntry(
  owner: string,
  weight: number,
  date?: string
): Promise<{ success: boolean; entry?: WeightLogEntry }> {
  const sql = getSql();
  const entryDate = date || new Date().toISOString().split("T")[0];
  const targetOwner = owner.trim();

  if (!sql) {
    return {
      success: true,
      entry: {
        id: `local-${Date.now()}`,
        owner: targetOwner,
        weight,
        date: entryDate,
        unit: "kg",
      },
    };
  }

  try {
    await ensureSchema();

    const rows = await sql`
      INSERT INTO weight_logs (owner, weight, date, unit, created_at)
      VALUES (${targetOwner}, ${weight}, ${entryDate}, 'kg', NOW())
      RETURNING id, owner, weight, date, unit, created_at;
    `;

    const r = rows[0];
    return {
      success: true,
      entry: {
        id: String(r.id),
        owner: r.owner,
        weight: Number(r.weight),
        date: typeof r.date === "string" ? r.date.split("T")[0] : new Date(r.date).toISOString().split("T")[0],
        unit: r.unit || "kg",
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : undefined,
      },
    };
  } catch (error) {
    console.error("Error adding weight log to Postgres:", error);
    return { success: false };
  }
}

/**
 * Deletes a weight log entry from Neon Postgres.
 */
export async function deleteDbWeightLogEntry(
  id: string,
  owner: string
): Promise<{ success: boolean }> {
  const sql = getSql();
  if (!sql) return { success: true };

  try {
    await ensureSchema();
    const targetOwner = owner.trim().toLowerCase();

    await sql`
      DELETE FROM weight_logs
      WHERE id = ${Number(id) || 0} AND LOWER(owner) = ${targetOwner};
    `;

    return { success: true };
  } catch (error) {
    console.error("Error deleting weight log from Postgres:", error);
    return { success: false };
  }
}
