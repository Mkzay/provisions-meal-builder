import { getSql } from "./db";

/**
 * Initializes all PostgreSQL tables in Neon if not already present.
 * Idempotent: safe to run on app startup or serverless invocation.
 */
export async function initDatabaseSchema(): Promise<void> {
  const sql = getSql();
  if (!sql) {
    console.warn("Postgres database URL not configured. Skipping schema initialization.");
    return;
  }

  // 1. Users table (authentication & multi-tenant instance ownership)
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // 2. Pantry ingredients (bases, proteins, supplementary/soups)
  await sql`
    CREATE TABLE IF NOT EXISTS pantry_ingredients (
      id TEXT PRIMARY KEY,
      owner TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      available BOOLEAN DEFAULT TRUE,
      meal_types TEXT[] DEFAULT '{}',
      nutrient_tags TEXT[] DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_pantry_owner ON pantry_ingredients(owner);`;

  // 3. Ready-to-eat meals
  await sql`
    CREATE TABLE IF NOT EXISTS ready_meals (
      id TEXT PRIMARY KEY,
      owner TEXT NOT NULL,
      name TEXT NOT NULL,
      available BOOLEAN DEFAULT TRUE,
      meal_types TEXT[] DEFAULT '{}',
      nutrient_tags TEXT[] DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_ready_meals_owner ON ready_meals(owner);`;

  // 4. Meal profiles (eating goals, body metrics & nutrient targets)
  await sql`
    CREATE TABLE IF NOT EXISTS meal_profiles (
      owner TEXT PRIMARY KEY,
      goal TEXT NOT NULL,
      height NUMERIC,
      weight NUMERIC,
      nutrient_priorities TEXT[] DEFAULT '{}',
      meals_per_day INT DEFAULT 3,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // 5. Weight progress history log
  await sql`
    CREATE TABLE IF NOT EXISTS weight_logs (
      id SERIAL PRIMARY KEY,
      owner TEXT NOT NULL,
      weight NUMERIC NOT NULL,
      date DATE NOT NULL,
      unit TEXT DEFAULT 'kg',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_weight_logs_owner ON weight_logs(owner);`;

  // 6. Saved custom recipes
  await sql`
    CREATE TABLE IF NOT EXISTS saved_recipes (
      id TEXT PRIMARY KEY,
      owner TEXT NOT NULL,
      name TEXT NOT NULL,
      meal_types TEXT[] DEFAULT '{}',
      main_ingredient_id TEXT,
      main_ingredient_name TEXT,
      protein_ids TEXT[] DEFAULT '{}',
      protein_names TEXT[] DEFAULT '{}',
      supplementary_ids TEXT[] DEFAULT '{}',
      supplementary_names TEXT[] DEFAULT '{}',
      source_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_saved_recipes_owner ON saved_recipes(owner);`;

  // 7. Meal builder daily history log
  await sql`
    CREATE TABLE IF NOT EXISTS meal_logs (
      id SERIAL PRIMARY KEY,
      owner TEXT NOT NULL,
      meal_name TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      source TEXT NOT NULL,
      main_ingredient TEXT,
      protein TEXT,
      supplementary TEXT,
      ready_meal TEXT,
      date DATE DEFAULT CURRENT_DATE,
      had_leftovers BOOLEAN DEFAULT FALSE,
      rating TEXT,
      logged_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_meal_logs_owner ON meal_logs(owner);`;

  // 8. User pantry settings (tracks whether starter inventory was seeded)
  await sql`
    CREATE TABLE IF NOT EXISTS user_pantry_settings (
      owner TEXT PRIMARY KEY,
      seeded BOOLEAN DEFAULT TRUE,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}
