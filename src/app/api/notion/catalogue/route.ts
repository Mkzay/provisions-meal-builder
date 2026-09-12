import { fetchCatalogue } from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const catalogue = await fetchCatalogue();
    return NextResponse.json(catalogue, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
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
