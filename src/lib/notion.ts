import { Client } from "@notionhq/client";
import { resolveLeftoverAction } from "./flow-logic";
import {
  buildMealLogProperties,
  buildMealProfileProperties,
  buildNewReadyMealProperties,
  buildWeightLogProperties,
  parseNotionIngredient,
  parseNotionMealProfile,
  parseNotionReadyMeal,
  parseNotionWeightLog,
} from "./notion-parser";
import { SEED_CATALOGUE } from "./seed-data";
import {
  AddSupplyInput,
  Ingredient,
  KitchenCatalogue,
  LeftoverDecision,
  MealLogEntry,
  MealProfile,
  ReadyMeal,
  UserGoal,
  WeightLogEntry,
} from "./types";

// Notion Client initialization (server-only)
export function getNotionClient(): Client | null {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey || apiKey === "your_notion_api_key_here") {
    return null;
  }
  return new Client({ auth: apiKey });
}

export async function fetchCatalogue(): Promise<KitchenCatalogue> {
  const notion = getNotionClient();
  const ingredientsDbId = process.env.NOTION_INGREDIENTS_DB_ID;
  const readyMealsDbId = process.env.NOTION_READY_MEALS_DB_ID;

  if (!notion || !ingredientsDbId || !readyMealsDbId) {
    console.log("Notion credentials not configured. Serving realistic starter kitchen seed.");
    return SEED_CATALOGUE;
  }

  try {
    // 1. Query Ingredients Catalogue
    const ingredientsResponse = await notion.databases.query({
      database_id: ingredientsDbId,
      filter: {
        property: "Available",
        checkbox: {
          equals: true,
        },
      },
    });

    const ingredients: Ingredient[] = ingredientsResponse.results
      .map((page) => parseNotionIngredient(page))
      .filter((item): item is Ingredient => item !== null);

    // 2. Query Ready Meals
    const readyMealsResponse = await notion.databases.query({
      database_id: readyMealsDbId,
      filter: {
        property: "Available",
        checkbox: {
          equals: true,
        },
      },
    });

    const readyMeals: ReadyMeal[] = readyMealsResponse.results
      .map((page) => parseNotionReadyMeal(page))
      .filter((meal): meal is ReadyMeal => meal !== null);

    return {
      ingredients: ingredients.length > 0 ? ingredients : SEED_CATALOGUE.ingredients,
      readyMeals: readyMeals.length > 0 ? readyMeals : SEED_CATALOGUE.readyMeals,
      lastSynced: new Date().toISOString(),
      isCachedFallback: false,
    };
  } catch (error) {
    console.error("Error connecting to Notion API, falling back to cached seed:", error);
    return {
      ...SEED_CATALOGUE,
      isCachedFallback: true,
    };
  }
}

export async function logMeal(entry: MealLogEntry): Promise<{ success: boolean; id?: string }> {
  const notion = getNotionClient();
  const mealLogDbId = process.env.NOTION_MEAL_LOG_DB_ID;

  if (!notion || !mealLogDbId) {
    console.log("Notion credentials not set for Meal Log. Simulating successful local log:", entry);
    return { success: true, id: `local-log-${Date.now()}` };
  }

  try {
    const properties = buildMealLogProperties(entry);
    const response = await notion.pages.create({
      parent: {
        database_id: mealLogDbId,
      },
      properties,
    });

    return { success: true, id: response.id };
  } catch (error) {
    console.error("Failed to log meal to Notion:", error);
    return { success: false };
  }
}

export async function handleLeftoverDecision(decision: LeftoverDecision): Promise<{
  success: boolean;
  action: string;
  readyMealId?: string;
  newMealId?: string;
}> {
  const result = resolveLeftoverAction(decision);
  const notion = getNotionClient();
  const readyMealsDbId = process.env.NOTION_READY_MEALS_DB_ID;

  if (result.action === "none" || result.action === "keep_ready") {
    return { success: true, action: result.action, readyMealId: result.readyMealId };
  }

  if (!notion || !readyMealsDbId) {
    console.log("Notion credentials not set for leftovers. Simulating leftover update:", result);
    return {
      success: true,
      action: result.action,
      readyMealId: result.readyMealId,
      newMealId: result.newReadyMeal ? `local-ready-${Date.now()}` : undefined,
    };
  }

  try {
    // If ready meal was eaten and no leftovers remained -> uncheck available
    if (result.action === "uncheck_ready" && result.readyMealId) {
      await notion.pages.update({
        page_id: result.readyMealId,
        properties: {
          Available: {
            checkbox: false,
          },
        },
      });
      return { success: true, action: "uncheck_ready", readyMealId: result.readyMealId };
    }

    // If built meal had leftovers -> create new entry in Ready Meals
    if (result.action === "create_ready" && result.newReadyMeal) {
      const properties = buildNewReadyMealProperties(
        result.newReadyMeal.name,
        result.newReadyMeal.mealType,
        result.newReadyMeal.owner
      );

      const page = await notion.pages.create({
        parent: {
          database_id: readyMealsDbId,
        },
        properties,
      });

      return { success: true, action: "create_ready", newMealId: page.id };
    }

    return { success: true, action: result.action };
  } catch (error) {
    console.error("Failed to update leftovers in Notion:", error);
    return { success: false, action: result.action };
  }
}

export async function addSupplyToNotion(
  input: AddSupplyInput
): Promise<{ success: boolean; id?: string }> {
  const notion = getNotionClient();
  const ingredientsDbId = process.env.NOTION_INGREDIENTS_DB_ID;
  const readyMealsDbId = process.env.NOTION_READY_MEALS_DB_ID;

  if (!notion) {
    return { success: true, id: `local-${Date.now()}` };
  }

  try {
    if (input.kind === "ingredient" && ingredientsDbId) {
      const page = await notion.pages.create({
        parent: { database_id: ingredientsDbId },
        properties: {
          Name: {
            title: [{ text: { content: input.name } }],
          },
          Role: {
            select: { name: input.role || "Main" },
          },
          "Meal Type": {
            multi_select: input.mealTypes.map((mt) => ({ name: mt })),
          },
          Available: {
            checkbox: true,
          },
          Owner: {
            select: { name: "Esther" },
          },
        },
      });
      return { success: true, id: page.id };
    }

    if (input.kind === "ready_meal" && readyMealsDbId) {
      const page = await notion.pages.create({
        parent: { database_id: readyMealsDbId },
        properties: {
          Name: {
            title: [{ text: { content: input.name } }],
          },
          "Meal Type": {
            multi_select: input.mealTypes.map((mt) => ({ name: mt })),
          },
          Available: {
            checkbox: true,
          },
          Owner: {
            select: { name: "Esther" },
          },
        },
      });
      return { success: true, id: page.id };
    }

    return { success: true, id: `local-${Date.now()}` };
  } catch (err) {
    console.error("Error creating supply in Notion:", err);
    return { success: false };
  }
}

// Re-export Database 4 (Meal Profile) and Database 5 (Progress Log) methods
export {
  fetchMealProfile,
  saveMealProfile,
  fetchWeightLogs,
  addWeightLogEntry,
  deleteWeightLogEntry,
} from "./notion-profile";



