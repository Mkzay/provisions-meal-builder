import { auth } from "@/auth";
import { getSessionOwner } from "@/lib/owner-authorization";
import {
  addDbSupply,
  deleteDbSupply,
  updateDbSupplyAvailability,
} from "@/lib/db-supplies";
import { AddSupplyInput } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as AddSupplyInput;
    if (!body || !body.name || !body.kind) {
      return NextResponse.json(
        { error: "Invalid payload: name and kind are required" },
        { status: 400 }
      );
    }

    body.owner = owner;

    const result = await addDbSupply(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST /api/notion/supplies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const owner = getSessionOwner(await auth());
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as { id: string; available: boolean };
    if (!body || !body.id || typeof body.available !== "boolean") {
      return NextResponse.json(
        { error: "Invalid payload: id and boolean available are required" },
        { status: 400 }
      );
    }

    const result = await updateDbSupplyAvailability(body.id, body.available, owner);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in PATCH /api/notion/supplies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  try {
    const owner = getSessionOwner(await auth());
    if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    let name = searchParams.get("name") || undefined;

    if (!id && !name) {
      try {
        const body = (await request.json()) as { id?: string; name?: string };
        id = body?.id || null;
        if (!name && body?.name) name = body.name;
      } catch {
        // no body
      }
    }

    if (!id && !name) {
      return NextResponse.json(
        { error: "Missing required id or name parameter" },
        { status: 400 }
      );
    }

    const result = await deleteDbSupply(id || "", owner, name);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in DELETE /api/notion/supplies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
