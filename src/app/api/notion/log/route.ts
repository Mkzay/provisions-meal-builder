import { logMeal } from "@/lib/notion";
import { MealLogEntry } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as MealLogEntry;

    if (!body || !body.mealType || !body.source) {
      return NextResponse.json(
        { error: "Missing required meal fields (mealType, source)" },
        { status: 400 }
      );
    }

    const result = await logMeal(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error logging meal:", error);
    return NextResponse.json(
      { error: "Internal server error logging meal" },
      { status: 500 }
    );
  }
}
