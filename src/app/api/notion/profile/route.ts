import { auth } from "@/auth";
import { getSessionOwner } from "@/lib/owner-authorization";
import { fetchMealProfile, saveMealProfile } from "@/lib/notion-profile";
import { UserGoal } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await fetchMealProfile(owner);
    return NextResponse.json(
      { profile },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("API error fetching meal profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const goal = body.goal as UserGoal;
    const height =
      typeof body.height === "number" && !isNaN(body.height) && body.height > 0
        ? body.height
        : undefined;
    const weight =
      typeof body.weight === "number" && !isNaN(body.weight) && body.weight > 0
        ? body.weight
        : undefined;
    const nutrientPriorities = Array.isArray(body.nutrientPriorities)
      ? body.nutrientPriorities
      : undefined;
    const mealsPerDay =
      typeof body.mealsPerDay === "number" && body.mealsPerDay > 0
        ? body.mealsPerDay
        : undefined;

    if (!goal) {
      return NextResponse.json(
        { error: "Goal is required" },
        { status: 400 }
      );
    }

    const result = await saveMealProfile({
      owner,
      goal,
      height,
      weight,
      nutrientPriorities,
      mealsPerDay,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error saving meal profile:", error);
    return NextResponse.json(
      { error: "Failed to save meal profile" },
      { status: 500 }
    );
  }
}
