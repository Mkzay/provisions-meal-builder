import { auth } from "@/auth";
import { fetchMealProfile, saveMealProfile } from "@/lib/notion-profile";
import { UserGoal } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const owner = session?.user?.ownerName || searchParams.get("owner") || "Esther";

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
    const owner = session?.user?.ownerName || body.owner || "Esther";
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
