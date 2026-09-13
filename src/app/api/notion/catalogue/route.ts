import { auth } from "@/auth";
import { getSessionOwner } from "@/lib/owner-authorization";
import { fetchDbCatalogue, seedStarterPantryForOwner } from "@/lib/db-supplies";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const catalogue = await fetchDbCatalogue(owner);
    return NextResponse.json(catalogue, {
      headers: {
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("API error fetching catalogue:", error);
    return NextResponse.json(
      { error: "Failed to fetch catalogue" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await seedStarterPantryForOwner(owner);
    const catalogue = await fetchDbCatalogue(owner);
    return NextResponse.json(catalogue);
  } catch (error) {
    console.error("API error seeding starter catalogue:", error);
    return NextResponse.json(
      { error: "Failed to seed starter catalogue" },
      { status: 500 }
    );
  }
}

