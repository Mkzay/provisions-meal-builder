import { getNotionClient } from "./notion";
import { CreateSavedRecipeInput, MealType, SavedRecipe } from "./types";

export function isValidNotionId(id?: string): boolean {
  if (!id) return false;
  return (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ||
    /^[0-9a-f]{32}$/i.test(id)
  );
}

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

  if (input.mainIngredientId && isValidNotionId(input.mainIngredientId)) {
    properties["Main Ingredient"] = {
      relation: [{ id: input.mainIngredientId }],
    };
  }

  const proteinList = (input.proteinIds && input.proteinIds.length > 0)
    ? input.proteinIds
    : (input.proteinId ? [input.proteinId] : []);
  const validProteins = proteinList.filter(isValidNotionId);
  if (validProteins.length > 0) {
    properties.Protein = {
      relation: validProteins.map((id) => ({ id })),
    };
  }

  const suppList = (input.supplementaryIds && input.supplementaryIds.length > 0)
    ? input.supplementaryIds
    : (input.supplementaryId ? [input.supplementaryId] : []);
  const validSupps = suppList.filter(isValidNotionId);
  if (validSupps.length > 0) {
    properties.Supplementary = {
      relation: validSupps.map((id) => ({ id })),
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

    const mainRelations = props["Main Ingredient"]?.relation || [];
    const mainIngredientId = mainRelations[0]?.id;

    const proteinRelations = props.Protein?.relation || [];
    const proteinIds: string[] = proteinRelations.map((r: any) => r.id).filter(Boolean);
    const proteinNames: string[] = ingredientMap
      ? proteinIds.map((id) => ingredientMap.get(id) || "").filter(Boolean)
      : [];
    const proteinName = proteinNames.length > 0 ? proteinNames.join(" & ") : undefined;
    const proteinId = proteinIds[0];

    const suppRelations = props.Supplementary?.relation || [];
    const supplementaryIds: string[] = suppRelations.map((r: any) => r.id).filter(Boolean);
    const supplementaryNames: string[] = ingredientMap
      ? supplementaryIds.map((id) => ingredientMap.get(id) || "").filter(Boolean)
      : [];
    const supplementaryName = supplementaryNames.length > 0 ? supplementaryNames.join(" & ") : undefined;
    const supplementaryId = supplementaryIds[0];

    const mainIngredientName =
      (ingredientMap && mainIngredientId && ingredientMap.get(mainIngredientId)) || undefined;

    return {
      id: page.id,
      name,
      mealTypes: mealTypes.length > 0 ? mealTypes : ["Lunch", "Dinner"],
      mainIngredientId,
      mainIngredientName,
      proteinId,
      proteinIds: proteinIds.length > 0 ? proteinIds : undefined,
      proteinName,
      proteinNames: proteinNames.length > 0 ? proteinNames : undefined,
      supplementaryId,
      supplementaryIds: supplementaryIds.length > 0 ? supplementaryIds : undefined,
      supplementaryName,
      supplementaryNames: supplementaryNames.length > 0 ? supplementaryNames : undefined,
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
    let mainId = input.mainIngredientId;
    if (mainId && !isValidNotionId(mainId) && process.env.NOTION_INGREDIENTS_DB_ID) {
      try {
        const query = await notion.databases.query({
          database_id: process.env.NOTION_INGREDIENTS_DB_ID,
          sorts: [{ timestamp: "created_time", direction: "descending" }],
          page_size: 5,
        });
        if (query.results.length > 0) {
          mainId = query.results[0].id;
        }
      } catch (err) {
        console.warn("Could not resolve non-UUID ingredient ID:", err);
      }
    }

    const properties = buildSavedRecipeProperties({
      ...input,
      mainIngredientId: mainId,
    });
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
