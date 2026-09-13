import { getNotionClient } from "./notion";
import { CreateSavedRecipeInput, MealType, SavedRecipe } from "./types";

export function buildSavedRecipeProperties(
  input: CreateSavedRecipeInput
): Record<string, any> {
  const properties: Record<string, any> = {
    Name: {
      title: [{ text: { content: input.name } }],
    },
    "Meal Type": {
      multi_select: input.mealTypes.map((m) => ({ name: m })),
    },
    Owner: {
      select: { name: input.owner },
    },
  };

  if (input.mainIngredientId) {
    properties["Main Ingredient"] = {
      relation: [{ id: input.mainIngredientId }],
    };
  }

  if (input.proteinId) {
    properties.Protein = {
      relation: [{ id: input.proteinId }],
    };
  }

  if (input.supplementaryId) {
    properties.Supplementary = {
      relation: [{ id: input.supplementaryId }],
    };
  }

  if (input.sourceUrl && input.sourceUrl.trim()) {
    properties["Source URL"] = {
      url: input.sourceUrl.trim(),
    };
  }

  return properties;
}

export function parseNotionSavedRecipe(
  page: any,
  ingredientMap?: Map<string, string>
): SavedRecipe | null {
  try {
    const props = page.properties;
    if (!props) return null;

    const titleArray = props.Name?.title || [];
    const name = titleArray.map((t: any) => t.plain_text).join("").trim();
    if (!name) return null;

    const rawMealTypes = props["Meal Type"]?.multi_select || [];
    const mealTypes: MealType[] = rawMealTypes.map((m: any) => m.name).filter(Boolean);

    const owner = props.Owner?.select?.name || "User";
    const sourceUrl = props["Source URL"]?.url || undefined;

    const mainIngredientId = props["Main Ingredient"]?.relation?.[0]?.id;
    const proteinId = props.Protein?.relation?.[0]?.id;
    const supplementaryId = props.Supplementary?.relation?.[0]?.id;

    const mainIngredientName =
      (ingredientMap && mainIngredientId && ingredientMap.get(mainIngredientId)) || undefined;
    const proteinName =
      (ingredientMap && proteinId && ingredientMap.get(proteinId)) || undefined;
    const supplementaryName =
      (ingredientMap && supplementaryId && ingredientMap.get(supplementaryId)) || undefined;

    return {
      id: page.id,
      name,
      mealTypes: mealTypes.length > 0 ? mealTypes : ["Lunch", "Dinner"],
      mainIngredientId,
      mainIngredientName,
      proteinId,
      proteinName,
      supplementaryId,
      supplementaryName,
      owner,
      sourceUrl,
      createdAt: page.created_time || new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error parsing Notion saved recipe:", err);
    return null;
  }
}

export async function fetchSavedRecipes(
  owner: string,
  ingredientMap?: Map<string, string>
): Promise<SavedRecipe[]> {
  const notion = getNotionClient();
  const dbId = process.env.NOTION_SAVED_RECIPES_DB_ID;

  if (!notion || !dbId) {
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: dbId,
      filter: {
        property: "Owner",
        select: {
          equals: owner,
        },
      },
      page_size: 100,
    });

    const recipes: SavedRecipe[] = [];
    for (const page of response.results) {
      const parsed = parseNotionSavedRecipe(page, ingredientMap);
      if (parsed) {
        recipes.push(parsed);
      }
    }
    return recipes;
  } catch (err) {
    console.error("Error fetching saved recipes from Notion:", err);
    return [];
  }
}

export async function createSavedRecipe(
  input: CreateSavedRecipeInput
): Promise<{ success: boolean; id?: string }> {
  const notion = getNotionClient();
  const dbId = process.env.NOTION_SAVED_RECIPES_DB_ID;

  if (!notion || !dbId) {
    return { success: true, id: `local-recipe-${Date.now()}` };
  }

  try {
    const properties = buildSavedRecipeProperties(input);
    const page = await notion.pages.create({
      parent: { database_id: dbId },
      properties,
    });
    return { success: true, id: page.id };
  } catch (err) {
    console.error("Error creating saved recipe in Notion:", err);
    return { success: false };
  }
}

export async function deleteSavedRecipe(
  id: string,
  owner: string
): Promise<{ success: boolean }> {
  const notion = getNotionClient();
  if (!notion || id.startsWith("local-") || id.startsWith("mock-")) {
    return { success: true };
  }

  try {
    await notion.pages.update({
      page_id: id,
      archived: true,
    });
    return { success: true };
  } catch (err) {
    console.error("Error archiving saved recipe in Notion:", err);
    return { success: false };
  }
}
