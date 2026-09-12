import { auth } from "@/auth";
import { logMeal } from "@/lib/notion";
import { MealLogEntry } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = (await req.json()) as MealLogEntry;

    if (!body || !body.mealType || !body.source) {
      return NextResponse.json(
        { error: "Missing required meal fields (mealType, source)" },
        { status: 400 }
      );
    }

    if (session?.user?.ownerName) {
      body.owner = session.user.ownerName;
    } else if (session?.user?.name) {
      body.owner = session.user.name;
    } else if (!body.owner) {
      body.owner = "User";
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
