import { getNotionClient } from "./notion";
import { parseNotionRatedMealRecord } from "./notion-parser";
import { MealRating, RatedMealRecord } from "./types";

/**
 * Updates the Rating select property on a logged meal in Notion DB3.
 */
export async function updateMealRating(
  logId: string,
  rating: MealRating,
  owner?: string
): Promise<{ success: boolean }> {
  if (
    !logId ||
    logId.startsWith("local-") ||
    logId.startsWith("mock-")
  ) {
    return { success: true };
  }

  const notion = getNotionClient();
  if (!notion) {
    return { success: true };
  }

  try {
    await notion.pages.update({
      page_id: logId,
      properties: {
        Rating: {
          select: {
            name: rating,
          },
        },
      },
    });
    return { success: true };
  } catch (err) {
    console.error("Error updating meal rating in Notion:", err);
    return { success: false };
  }
}

/**
 * Fetches all rated meal records for a specific owner from Notion DB3.
 */
export async function fetchOwnerMealRatings(owner: string): Promise<RatedMealRecord[]> {
  const notion = getNotionClient();
  const dbId = process.env.NOTION_MEAL_LOG_DB_ID;

  if (!notion || !dbId) {
    return [];
  }

  try {
    const filter: any = {
      and: [
        {
          property: "Owner",
          select: {
            equals: owner,
          },
        },
        {
          property: "Rating",
          select: {
            is_not_empty: true,
          },
        },
      ],
    };

    const response = await notion.databases.query({
      database_id: dbId,
      filter,
      page_size: 100,
    });

    const records: RatedMealRecord[] = [];
    for (const page of response.results) {
      const record = parseNotionRatedMealRecord(page);
      if (record) {
        records.push(record);
      }
    }
    return records;
  } catch (err) {
    console.error("Error fetching owner meal ratings from Notion:", err);
    return [];
  }
}
