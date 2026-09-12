import fs from "node:fs";
import path from "node:path";
import { Client } from "@notionhq/client";

// 1. Load .env
const envPath = path.resolve(".env");
const lines = fs.readFileSync(envPath, "utf-8").split("\n");
const env = {};
for (const line of lines) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const idx = t.indexOf("=");
  if (idx > 0) {
    env[t.slice(0, idx).trim()] = t.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  }
}

const apiKey = env.NOTION_API_KEY;
if (!apiKey || apiKey === "your_notion_api_key_here") {
  console.error("NOTION_API_KEY is not configured in .env");
  process.exit(1);
}

const notion = new Client({ auth: apiKey });

const dbs = [
  { name: "Ingredients Catalogue", id: env.NOTION_INGREDIENTS_DB_ID },
  { name: "Ready Meals", id: env.NOTION_READY_MEALS_DB_ID },
  { name: "Meal Log", id: env.NOTION_MEAL_LOG_DB_ID },
  { name: "Meal Profile", id: env.NOTION_PROFILE_DB_ID },
  { name: "Progress Log", id: env.NOTION_PROGRESS_LOG_DB_ID },
];

async function main() {
  const args = process.argv.slice(2);
  const isConfirmed = args.includes("--confirm");

  console.log("=== Notion Database Wipe Utility ===");

  if (!isConfirmed) {
    console.log("\n⚠️  SAFETY CHECK: You are about to wipe pages across all 5 Notion databases.");
    console.log("To execute this action, you must pass the --confirm flag:");
    console.log("  node scripts/wipe-notion.mjs --confirm\n");
    console.log("Checking current database accessibility...");
  }

  let totalFound = 0;

  for (const db of dbs) {
    if (!db.id) {
      console.log(`- ${db.name}: ID not configured, skipping.`);
      continue;
    }

    try {
      const query = await notion.databases.query({ database_id: db.id });
      const count = query.results.length;
      totalFound += count;
      console.log(`- ${db.name}: ${count} page(s) found`);

      if (isConfirmed && count > 0) {
        console.log(`  Archiving ${count} page(s) in ${db.name}...`);
        for (const page of query.results) {
          await notion.pages.update({
            page_id: page.id,
            archived: true,
          });
        }
        console.log(`  ✓ Cleared ${db.name}`);
      }
    } catch (err) {
      console.error(`- ${db.name}: Error querying database (${err.message})`);
    }
  }

  if (!isConfirmed) {
    console.log(`\nFound ${totalFound} total item(s) across accessible databases.`);
    console.log("Run with --confirm to archive them to trash.");
  } else {
    console.log("\n✓ Clean slate complete! All accessible databases are now clean.");
  }
}

main().catch(console.error);
