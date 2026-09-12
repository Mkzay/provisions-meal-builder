import { auth } from "@/auth";
import { fetchMealProfile } from "@/lib/notion-profile";
import { fetchOpenRouterNote } from "@/lib/openrouter";
import { MealType } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);

    const owner = searchParams.get("owner") || session?.user?.ownerName || session?.user?.name || "User";
    const mealType = (searchParams.get("mealType") as MealType) || "Lunch";

    // Fetch user goal to tailor the note
    let goal = undefined;
    try {
      const profile = await fetchMealProfile(owner);
      goal = profile?.goal;
    } catch {
      // Ignore if profile lookup fails
    }

    const note = await fetchOpenRouterNote({
      owner,
      goal,
      mealType,
    });

    return NextResponse.json(
      { note, mealType, owner },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("API error in companion route:", error);
    return NextResponse.json(
      {
        note: "Take 10 minutes to feed yourself. A warm, comforting plate powers your mind and body.",
      },
      { status: 200 }
    );
  }
}
