import { fetchMealProfile, saveMealProfile } from "@/lib/notion-profile";
import { getCurrentOwner } from "@/lib/profile-storage";
import { UserGoal } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner") || getCurrentOwner();

    const profile = await fetchMealProfile(owner);
    return NextResponse.json({ profile });
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
    const body = await req.json();
    const owner = body.owner || getCurrentOwner();
    const goal = body.goal as UserGoal;
    const height =
      typeof body.height === "number" && !isNaN(body.height) && body.height > 0
        ? body.height
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
