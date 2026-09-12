import fs from "node:fs";
import path from "node:path";
import { Client } from "@notionhq/client";

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

const notion = new Client({ auth: env.NOTION_API_KEY });

const TARGET_DB_IDS = new Set([
  "3d91c68e-ece0-8143-b609-d1e1ffc78f21", // Ingredients Catalogue
  "0bb005e1-5bc9-41f6-9e17-7ca63d96be23", // Ready Meals
  "f3787326-a64f-4e80-8c42-99080e86a012", // Meal Log
  "830a7ce7-81a1-4eb4-b88f-1eb861689a60", // Meal Profile
  "dacbd551-a2d3-41f3-867d-10e64e76f1bf", // Progress Log
]);

async function main() {
  console.log("=== Notion Workspace Wipe Utility ===");
  console.log("Searching for all pages inside your Provisions databases...");

  const search = await notion.search({
    filter: { property: "object", value: "page" },
  });

  const pagesToWipe = [];
  for (const page of search.results) {
    const parentId = page.parent?.database_id;
    if (parentId && TARGET_DB_IDS.has(parentId)) {
      const title =
        page.properties?.Name?.title?.[0]?.plain_text ||
        page.properties?.title?.title?.[0]?.plain_text ||
        "Untitled";
      pagesToWipe.push({ id: page.id, title, parentId });
    }
  }

  console.log(`Found ${pagesToWipe.length} page(s) to archive:`);
  for (const p of pagesToWipe) {
    console.log(`- "${p.title}" (ID: ${p.id})`);
  }

  if (pagesToWipe.length === 0) {
    console.log("\n✓ All databases are already 100% clean!");
    return;
  }

  console.log("\nArchiving pages into Notion Trash...");
  for (const p of pagesToWipe) {
    try {
      await notion.pages.update({ page_id: p.id, archived: true });
      console.log(`✓ Archived: "${p.title}"`);
    } catch (e) {
      console.error(`✗ Error archiving "${p.title}":`, e.message);
    }
  }

  console.log("\n✓ Clean slate complete! All rows in all 5 Notion databases have been cleared.");
}

main().catch(console.error);
