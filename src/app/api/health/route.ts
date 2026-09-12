import { NextResponse } from "next/server";

export async function GET() {
  const isNotionConfigured = Boolean(
    process.env.NOTION_API_KEY &&
      process.env.NOTION_INGREDIENTS_DB_ID &&
      process.env.NOTION_READY_MEALS_DB_ID
  );

  return NextResponse.json({
    status: "ok",
    appName: "Meal Builder for Esther",
    notionConfigured: isNotionConfigured,
    timestamp: new Date().toISOString(),
  });
}
