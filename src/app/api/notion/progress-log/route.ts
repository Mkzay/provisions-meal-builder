import { auth } from "@/auth";
import { getSessionOwner } from "@/lib/owner-authorization";
import {
  addWeightLogEntry,
  deleteWeightLogEntry,
  fetchWeightLogs,
} from "@/lib/notion-profile";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const logs = await fetchWeightLogs(owner);
    return NextResponse.json(
      { logs },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("API error fetching weight logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch weight logs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const date = body.date || new Date().toISOString().slice(0, 10);
    const weight = typeof body.weight === "number" ? body.weight : parseFloat(body.weight);

    if (isNaN(weight) || weight <= 0) {
      return NextResponse.json(
        { error: "Valid weight number is required" },
        { status: 400 }
      );
    }

    const unit = body.unit === "lbs" ? "lbs" : "kg";

    const result = await addWeightLogEntry({
      owner,
      date,
      weight,
      unit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error adding weight log:", error);
    return NextResponse.json(
      { error: "Failed to add weight log" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const owner = getSessionOwner(await auth());
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteWeightLogEntry(id, owner);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error deleting weight log:", error);
    return NextResponse.json(
      { error: "Failed to delete weight log" },
      { status: 500 }
    );
  }
}
