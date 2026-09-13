import {
  buildMealProfileProperties,
  buildWeightLogProperties,
  parseNotionMealProfile,
  parseNotionWeightLog,
} from "./notion-parser";
import { getNotionClient } from "./notion";
import { pageBelongsToOwner } from "./owner-authorization";
import { MealProfile, UserGoal, WeightLogEntry } from "./types";

/**
 * Database 4: Meal Profile CRUD
 */
export async function fetchMealProfile(owner: string): Promise<MealProfile | null> {
  const notion = getNotionClient();
  const profileDbId = process.env.NOTION_PROFILE_DB_ID;

  if (!notion || !profileDbId) {
    return null;
  }

  try {
    const response = await notion.databases.query({
      database_id: profileDbId,
      filter: {
        property: "Owner",
        select: {
          equals: owner,
        },
      },
      page_size: 1,
    });

    if (response.results.length === 0) {
      return null;
    }

    return parseNotionMealProfile(response.results[0]);
  } catch (error) {
    console.error("Error fetching meal profile from Notion:", error);
    return null;
  }
}

export async function saveMealProfile(profile: {
  owner: string;
  goal: UserGoal;
  height?: number;
  weight?: number;
  nutrientPriorities?: import("./types").NutrientTag[];
  mealsPerDay?: number;
}): Promise<{ success: boolean; profile: MealProfile }> {
  const notion = getNotionClient();
  const profileDbId = process.env.NOTION_PROFILE_DB_ID;

  if (!notion || !profileDbId) {
    return {
      success: true,
      profile: {
        owner: profile.owner,
        goal: profile.goal,
        height: profile.height,
        weight: profile.weight,
        nutrientPriorities: profile.nutrientPriorities,
        mealsPerDay: profile.mealsPerDay,
        updatedAt: new Date().toISOString(),
      },
    };
  }

  try {
    const existing = await notion.databases.query({
      database_id: profileDbId,
      filter: {
        property: "Owner",
        select: {
          equals: profile.owner,
        },
      },
      page_size: 1,
    });

    const properties = buildMealProfileProperties(profile);

    if (existing.results.length > 0) {
      const pageId = existing.results[0].id;
      await notion.pages.update({
        page_id: pageId,
        properties,
      });

      return {
        success: true,
        profile: {
          id: pageId,
          owner: profile.owner,
          goal: profile.goal,
          height: profile.height,
          weight: profile.weight,
          nutrientPriorities: profile.nutrientPriorities,
          mealsPerDay: profile.mealsPerDay,
          updatedAt: new Date().toISOString(),
        },
      };
    }

    const created = await notion.pages.create({
      parent: {
        database_id: profileDbId,
      },
      properties,
    });

    return {
      success: true,
      profile: {
        id: created.id,
        owner: profile.owner,
        goal: profile.goal,
        height: profile.height,
        weight: profile.weight,
        nutrientPriorities: profile.nutrientPriorities,
        mealsPerDay: profile.mealsPerDay,
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error saving meal profile to Notion:", error);
    return {
      success: false,
      profile: {
        owner: profile.owner,
        goal: profile.goal,
        height: profile.height,
        nutrientPriorities: profile.nutrientPriorities,
        mealsPerDay: profile.mealsPerDay,
        updatedAt: new Date().toISOString(),
      },
    };
  }
}

/**
 * Database 5: Progress Log CRUD
 */
export async function fetchWeightLogs(owner: string): Promise<WeightLogEntry[]> {
  const notion = getNotionClient();
  const progressDbId = process.env.NOTION_PROGRESS_LOG_DB_ID;

  if (!notion || !progressDbId) {
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: progressDbId,
      filter: {
        property: "Owner",
        select: {
          equals: owner,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
        {
          timestamp: "created_time",
          direction: "descending",
        },
      ],
    });

    return response.results
      .map((page) => parseNotionWeightLog(page))
      .filter((entry): entry is WeightLogEntry => entry !== null);
  } catch (error) {
    console.error("Error fetching weight logs from Notion:", error);
    return [];
  }
}

export async function addWeightLogEntry(input: {
  owner: string;
  date: string;
  weight: number;
  unit?: "kg" | "lbs";
}): Promise<{ success: boolean; entry: WeightLogEntry }> {
  const notion = getNotionClient();
  const progressDbId = process.env.NOTION_PROGRESS_LOG_DB_ID;
  const activeUnit = input.unit === "lbs" ? "lbs" : "kg";
  const roundedWeight = Math.round(input.weight * 100) / 100;

  if (!notion || !progressDbId) {
    return {
      success: true,
      entry: {
        id: `local-wt-${Date.now()}`,
        owner: input.owner,
        date: input.date,
        weight: roundedWeight,
        unit: activeUnit,
        createdAt: new Date().toISOString(),
      },
    };
  }

  try {
    const properties = buildWeightLogProperties({
      owner: input.owner,
      date: input.date,
      weight: roundedWeight,
      unit: activeUnit,
    });
    const created = await notion.pages.create({
      parent: {
        database_id: progressDbId,
      },
      properties,
    });

    // Also sync latest weight onto MealProfile in Database 4 if present
    const profileDbId = process.env.NOTION_PROFILE_DB_ID;
    if (profileDbId) {
      notion.databases.query({
        database_id: profileDbId,
        filter: { property: "Owner", select: { equals: input.owner } },
        page_size: 1,
      }).then((res) => {
        if (res.results.length > 0) {
          return notion.pages.update({
            page_id: res.results[0].id,
            properties: { Weight: { number: roundedWeight } },
          });
        }
      }).catch((err) => console.log("Profile weight sync background notice:", err));
    }

    return {
      success: true,
      entry: {
        id: created.id,
        owner: input.owner,
        date: input.date,
        weight: roundedWeight,
        unit: activeUnit,
        createdAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error("Error adding weight log to Notion:", error);
    return {
      success: false,
      entry: {
        id: `error-${Date.now()}`,
        owner: input.owner,
        date: input.date,
        weight: roundedWeight,
        unit: activeUnit,
      },
    };
  }
}

export async function deleteWeightLogEntry(id: string, owner: string): Promise<{ success: boolean }> {
  const notion = getNotionClient();

  if (!notion) {
    return { success: true };
  }

  try {
    const page = await notion.pages.retrieve({ page_id: id }) as any;
    if (!pageBelongsToOwner(page?.properties?.Owner?.select?.name, owner)) {
      return { success: false };
    }
    await notion.pages.update({
      page_id: id,
      archived: true,
    });
    return { success: true };
  } catch (error) {
    console.error("Error archiving weight log in Notion:", error);
    return { success: false };
  }
}
