import { auth } from "@/auth";
import { getSessionOwner } from "@/lib/owner-authorization";
import { handleDbLeftoverDecision } from "@/lib/db-supplies";
import { LeftoverDecision } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await req.json()) as LeftoverDecision;

    if (!body || body.hadLeftovers === undefined || !body.source) {
      return NextResponse.json(
        { error: "Invalid leftover decision payload" },
        { status: 400 }
      );
    }

    body.owner = owner;

    const result = await handleDbLeftoverDecision(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error handling leftovers:", error);
    return NextResponse.json(
      { error: "Internal server error handling leftovers" },
      { status: 500 }
    );
  }
}
