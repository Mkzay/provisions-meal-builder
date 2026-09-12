import { auth } from "@/auth";
import { fetchCatalogue } from "@/lib/notion";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const owner = session?.user?.ownerName || searchParams.get("owner") || undefined;
    const catalogue = await fetchCatalogue(owner);
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
