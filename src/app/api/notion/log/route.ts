import { auth } from "@/auth";
import { getSessionOwner } from "@/lib/owner-authorization";
import { fetchOwnerMealRatings, logMeal, updateMealRating } from "@/lib/notion";
import { MealLogEntry, MealRating } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await req.json()) as MealLogEntry;

    if (!body || !body.mealType || !body.source) {
      return NextResponse.json(
        { error: "Missing required meal fields (mealType, source)" },
        { status: 400 }
      );
    }

    body.owner = owner;

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

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, rating } = body as { id: string; rating: MealRating };

    if (!id || !rating || !["Liked", "Neutral", "Disliked"].includes(rating)) {
      return NextResponse.json(
        { error: "Invalid payload: id and valid rating (Liked, Neutral, Disliked) required" },
        { status: 400 }
      );
    }

    const result = await updateMealRating(id, rating, owner);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error updating meal rating:", error);
    return NextResponse.json(
      { error: "Internal server error updating rating" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const targetOwner = searchParams.get("owner") || owner;

    const ratings = await fetchOwnerMealRatings(targetOwner);
    return NextResponse.json({ ratings });
  } catch (error) {
    console.error("API error fetching meal ratings:", error);
    return NextResponse.json(
      { error: "Internal server error fetching ratings" },
      { status: 500 }
    );
  }
}
