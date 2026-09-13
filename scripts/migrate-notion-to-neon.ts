import { Client } from "@notionhq/client";
import { getSql } from "../src/lib/db";
import { initDatabaseSchema } from "../src/lib/db-schema";
import {
  parseNotionIngredient,
  parseNotionMealProfile,
  parseNotionReadyMeal,
  parseNotionWeightLog,
} from "../src/lib/notion-parser";
import { SEED_CATALOGUE } from "../src/lib/seed-data";

async function main() {
  console.log("🚀 Starting Notion to Neon Serverless Postgres Migration...");

  const sql = getSql();
  if (!sql) {
    console.error("❌ Error: No DATABASE_URL or POSTGRES_URL found in environment.");
    process.exit(1);
  }

  // 1. Initialize schema
  console.log("📦 Initializing database schema...");
  await initDatabaseSchema();
  console.log("✅ Schema initialized.");

  const apiKey = process.env.NOTION_API_KEY;
  const hasNotion = Boolean(apiKey && apiKey !== "your_notion_api_key_here");
  const notion = hasNotion ? new Client({ auth: apiKey }) : null;

  let migratedIngredients = 0;
  let migratedReadyMeals = 0;
  let migratedProfiles = 0;
  let migratedWeightLogs = 0;
  let migratedRecipes = 0;

  if (notion) {
    console.log("🔗 Notion credentials found. Pulling cloud databases...");

    // A. Migrate Ingredients
    const ingDb = process.env.NOTION_INGREDIENTS_DB_ID;
    if (ingDb) {
      try {
        console.log("  Fetching ingredients from Notion...");
        const res = await notion.databases.query({ database_id: ingDb });
        for (const page of res.results) {
          const ing = parseNotionIngredient(page);
          if (ing) {
            await sql`
              INSERT INTO pantry_ingredients (id, owner, name, category, available, meal_types, nutrient_tags)
              VALUES (
                ${ing.id},
                ${ing.owner || "Esther"},
                ${ing.name},
                ${ing.role},
                ${ing.available ?? true},
                ${ing.mealTypes || []},
                ${ing.nutrientTags || []}
              )
              ON CONFLICT (id) DO UPDATE
              SET name = EXCLUDED.name,
                  category = EXCLUDED.category,
                  available = EXCLUDED.available,
                  meal_types = EXCLUDED.meal_types,
                  nutrient_tags = EXCLUDED.nutrient_tags,
                  updated_at = NOW();
            `;
            migratedIngredients++;
          }
        }
        console.log(`  ✅ Migrated ${migratedIngredients} ingredients.`);
      } catch (err: any) {
        console.warn(`  ⚠️ Ingredients migration skipped: ${err.message}`);
      }
    }

    // B. Migrate Ready Meals
    const readyDb = process.env.NOTION_READY_MEALS_DB_ID;
    if (readyDb) {
      try {
        console.log("  Fetching ready meals from Notion...");
        const res = await notion.databases.query({ database_id: readyDb });
        for (const page of res.results) {
          const rm = parseNotionReadyMeal(page);
          if (rm) {
            await sql`
              INSERT INTO ready_meals (id, owner, name, available, meal_types, nutrient_tags)
              VALUES (
                ${rm.id},
                ${rm.owner || "Esther"},
                ${rm.name},
                ${rm.available ?? true},
                ${rm.mealTypes || []},
                ${rm.nutrientTags || []}
              )
              ON CONFLICT (id) DO UPDATE
              SET name = EXCLUDED.name,
                  available = EXCLUDED.available,
                  meal_types = EXCLUDED.meal_types,
                  nutrient_tags = EXCLUDED.nutrient_tags,
                  updated_at = NOW();
            `;
            migratedReadyMeals++;
          }
        }
        console.log(`  ✅ Migrated ${migratedReadyMeals} ready meals.`);
      } catch (err: any) {
        console.warn(`  ⚠️ Ready meals migration skipped: ${err.message}`);
      }
    }

    // C. Migrate Profiles
    const profileDb = process.env.NOTION_PROFILE_DB_ID;
    if (profileDb) {
      try {
        console.log("  Fetching profiles from Notion...");
        const res = await notion.databases.query({ database_id: profileDb });
        for (const page of res.results) {
          const prof = parseNotionMealProfile(page);
          if (prof && prof.owner) {
            await sql`
              INSERT INTO meal_profiles (owner, goal, height, weight, nutrient_priorities, meals_per_day, updated_at)
              VALUES (
                ${prof.owner},
                ${prof.goal || "Eat healthier"},
                ${prof.height ?? null},
                ${prof.weight ?? null},
                ${prof.nutrientPriorities || []},
                ${prof.mealsPerDay || 3},
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
            migratedProfiles++;
          }
        }
        console.log(`  ✅ Migrated ${migratedProfiles} profiles.`);
      } catch (err: any) {
        console.warn(`  ⚠️ Profile migration skipped: ${err.message}`);
      }
    }

    // D. Migrate Weight Logs
    const logDb = process.env.NOTION_PROGRESS_LOG_DB_ID;
    if (logDb) {
      try {
        console.log("  Fetching weight logs from Notion...");
        const res = await notion.databases.query({ database_id: logDb });
        for (const page of res.results) {
          const entry = parseNotionWeightLog(page);
          if (entry && entry.owner && entry.weight) {
            await sql`
              INSERT INTO weight_logs (owner, weight, date, unit, created_at)
              VALUES (${entry.owner}, ${entry.weight}, ${entry.date}, ${entry.unit || "kg"}, NOW());
            `;
            migratedWeightLogs++;
          }
        }
        console.log(`  ✅ Migrated ${migratedWeightLogs} weight logs.`);
      } catch (err: any) {
        console.warn(`  ⚠️ Weight log migration skipped: ${err.message}`);
      }
    }
  }

  // 2. Ensure default Nigerian seed catalogue exists if no ingredients were imported
  if (migratedIngredients === 0) {
    console.log("🌾 Seeding starter Nigerian ingredients & ready meals into Postgres for Esther and Mkzay...");
    for (const owner of ["Esther", "Mkzay"]) {
      for (const ing of SEED_CATALOGUE.ingredients) {
        const id = `seed-${owner.toLowerCase()}-${ing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        await sql`
          INSERT INTO pantry_ingredients (id, owner, name, category, available, meal_types, nutrient_tags)
          VALUES (
            ${id},
            ${owner},
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
        const id = `seed-ready-${owner.toLowerCase()}-${rm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        await sql`
          INSERT INTO ready_meals (id, owner, name, available, meal_types, nutrient_tags)
          VALUES (
            ${id},
            ${owner},
            ${rm.name},
            ${rm.available ?? true},
            ${rm.mealTypes || []},
            ${rm.nutrientTags || []}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }
    console.log("  ✅ Seeded starter Nigerian pantry catalogue.");
  }

  console.log("\n🎉 Migration completed successfully!");
  console.log("📊 Summary of rows in Neon Serverless Postgres:");
  const ingCount = await sql`SELECT count(*) FROM pantry_ingredients;`;
  const mealCount = await sql`SELECT count(*) FROM ready_meals;`;
  const profCount = await sql`SELECT count(*) FROM meal_profiles;`;
  const logCount = await sql`SELECT count(*) FROM weight_logs;`;
  const recipeCount = await sql`SELECT count(*) FROM saved_recipes;`;
  console.log(`   - pantry_ingredients: ${ingCount[0].count}`);
  console.log(`   - ready_meals:        ${mealCount[0].count}`);
  console.log(`   - meal_profiles:      ${profCount[0].count}`);
  console.log(`   - weight_logs:        ${logCount[0].count}`);
  console.log(`   - saved_recipes:      ${recipeCount[0].count}`);
}

main().catch((err) => {
  console.error("❌ Migration failed with error:", err);
  process.exit(1);
});
