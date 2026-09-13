import { sanitizeMealWithAI } from "@/lib/meal-sanitizer";
import { auth } from "@/auth";
import { getSessionOwner } from "@/lib/owner-authorization";
import { validateCurateRequest } from "@/lib/curate-validation";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    if (!getSessionOwner(await auth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const validated = validateCurateRequest(await req.json());
    if (!validated.ok) {
      return NextResponse.json(
        { success: false, error: "Invalid meal curation payload" },
        { status: 400 }
      );
    }
    const { main, protein, supplementary, mealType, dishName, culinaryNote } = validated.value;

    const sanitized = await sanitizeMealWithAI({
      main,
      protein,
      supplementary,
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
