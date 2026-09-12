import { addSupplyToNotion } from "@/lib/notion";
import { AddSupplyInput } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AddSupplyInput;
    if (!body || !body.name || !body.kind) {
      return NextResponse.json(
        { error: "Invalid payload: name and kind are required" },
        { status: 400 }
      );
    }

    const result = await addSupplyToNotion(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST /api/notion/supplies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
