import { auth } from "@/auth";
import { handleLeftoverDecision } from "@/lib/notion";
import { LeftoverDecision } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = (await req.json()) as LeftoverDecision;

    if (!body || body.hadLeftovers === undefined || !body.source) {
      return NextResponse.json(
        { error: "Invalid leftover decision payload" },
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

    const result = await handleLeftoverDecision(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error handling leftovers:", error);
    return NextResponse.json(
      { error: "Internal server error handling leftovers" },
      { status: 500 }
    );
  }
}
