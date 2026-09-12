import { NextResponse } from "next/server";

export async function GET() {
  const isNotionConfigured = Boolean(
    process.env.NOTION_API_KEY &&
      process.env.NOTION_INGREDIENTS_DB_ID &&
      process.env.NOTION_READY_MEALS_DB_ID
  );

  return NextResponse.json({
    status: "ok",
    appName: "Meal Builder",
    notionConfigured: isNotionConfigured,
    databases: {
      ingredients: Boolean(process.env.NOTION_INGREDIENTS_DB_ID),
      readyMeals: Boolean(process.env.NOTION_READY_MEALS_DB_ID),
      mealLog: Boolean(process.env.NOTION_MEAL_LOG_DB_ID),
      profile: Boolean(process.env.NOTION_PROFILE_DB_ID),
      progressLog: Boolean(process.env.NOTION_PROGRESS_LOG_DB_ID),
    },
    timestamp: new Date().toISOString(),
  });
}
