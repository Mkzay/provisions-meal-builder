import { auth } from "@/auth";
import {
  addSupplyToNotion,
  deleteSupplyFromNotion,
  updateSupplyAvailability,
} from "@/lib/notion";
import { AddSupplyInput } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = (await request.json()) as AddSupplyInput;
    if (!body || !body.name || !body.kind) {
      return NextResponse.json(
        { error: "Invalid payload: name and kind are required" },
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

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { id: string; available: boolean };
    if (!body || !body.id || typeof body.available !== "boolean") {
      return NextResponse.json(
        { error: "Invalid payload: id and boolean available are required" },
        { status: 400 }
      );
    }

    const result = await updateSupplyAvailability(body.id, body.available);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in PATCH /api/notion/supplies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = (await request.json()) as { id?: string };
        id = body?.id || null;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "Missing required id parameter" },
        { status: 400 }
      );
    }

    const result = await deleteSupplyFromNotion(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in DELETE /api/notion/supplies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
