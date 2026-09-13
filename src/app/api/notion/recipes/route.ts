import { auth } from "@/auth";
import {
  createDbSavedRecipe,
  deleteDbSavedRecipe,
  fetchDbSavedRecipes,
} from "@/lib/db-recipes";
import { getSessionOwner } from "@/lib/owner-authorization";
import { CreateSavedRecipeInput } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipes = await fetchDbSavedRecipes(owner);
    return NextResponse.json(
      { recipes },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("API error fetching saved recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved recipes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as CreateSavedRecipeInput;
    if (
      !body ||
      !body.name ||
      typeof body.name !== "string" ||
      !body.mainIngredientId ||
      !body.mealTypes ||
      !Array.isArray(body.mealTypes) ||
      body.mealTypes.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid recipe payload: name, mainIngredientId, and mealTypes are required" },
        { status: 400 }
      );
    }

    body.owner = owner;

    const result = await createDbSavedRecipe(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error creating saved recipe:", error);
    return NextResponse.json(
      { error: "Failed to create saved recipe" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const owner = getSessionOwner(session);
    if (!owner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = (await req.json()) as { id?: string };
        id = body?.id || null;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteDbSavedRecipe(id, owner);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error deleting saved recipe:", error);
    return NextResponse.json(
      { error: "Failed to delete saved recipe" },
      { status: 500 }
    );
  }
}
