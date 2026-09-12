import { sanitizeMealWithAI } from "@/lib/meal-sanitizer";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { main, protein, supplementary, mealType, dishName, culinaryNote } = body;

    if (!main || !mealType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sanitized = await sanitizeMealWithAI({
      main,
      protein,
      supplementary: Array.isArray(supplementary) ? supplementary : supplementary ? [supplementary] : [],
      mealType,
      dishName,
      culinaryNote,
    });

    if (!sanitized) {
      return NextResponse.json({ success: false, fallback: true });
    }

    return NextResponse.json({
      success: true,
      dishName: sanitized.dishName,
      culinaryNote: sanitized.culinaryNote,
      validSides: sanitized.validSides,
    });
  } catch (error) {
    console.warn("Silent fallback in /api/curate:", error);
    return NextResponse.json({ success: false, fallback: true });
  }
}
