import {
  Ingredient,
  IngredientRole,
  MealLogEntry,
  MealType,
  ReadyMeal,
} from "./types";

export function parseNotionIngredient(page: any): Ingredient | null {
  try {
    const props = page.properties;
    if (!props) return null;

    // Title / Name
    const titleArray = props.Name?.title || props.name?.title || [];
    const name = titleArray.map((t: any) => t.plain_text).join("").trim();
    if (!name) return null;

    // Meal Type (can be multi_select or select)
    let mealTypes: MealType[] = [];
    if (props["Meal Type"]?.type === "multi_select") {
      mealTypes = (props["Meal Type"].multi_select || [])
        .map((m: any) => m.name as MealType)
        .filter(Boolean);
    } else if (props["Meal Type"]?.type === "select" && props["Meal Type"].select?.name) {
      mealTypes = [props["Meal Type"].select.name as MealType];
    } else if (props.MealType?.type === "multi_select") {
      mealTypes = (props.MealType.multi_select || [])
        .map((m: any) => m.name as MealType)
        .filter(Boolean);
    } else if (props.MealType?.type === "select" && props.MealType.select?.name) {
      mealTypes = [props.MealType.select.name as MealType];
    }

    if (mealTypes.length === 0) {
      mealTypes = ["Lunch", "Dinner"]; // Sensible fallback
    }

    // Role
    const roleName = props.Role?.select?.name || props.role?.select?.name || "Main";
    const role: IngredientRole =
      roleName === "Protein" || roleName === "Supplementary"
        ? roleName
        : "Main";

    // Available Checkbox
    const available =
      props.Available?.type === "checkbox"
        ? Boolean(props.Available.checkbox)
        : props.available?.type === "checkbox"
        ? Boolean(props.available.checkbox)
        : true;

    // Owner
    const owner =
      props.Owner?.select?.name ||
      props.Owner?.rich_text?.[0]?.plain_text ||
      "Esther";

    return {
      id: page.id,
      name,
      mealTypes,
      role,
      available,
      owner,
    };
  } catch (err) {
    console.error("Error parsing Notion ingredient:", err);
    return null;
  }
}

export function parseNotionReadyMeal(page: any): ReadyMeal | null {
  try {
    const props = page.properties;
    if (!props) return null;

    // Title / Name
    const titleArray = props.Name?.title || props.name?.title || [];
    const name = titleArray.map((t: any) => t.plain_text).join("").trim();
    if (!name) return null;

    // Meal Type
    let mealTypes: MealType[] = [];
    if (props["Meal Type"]?.type === "multi_select") {
      mealTypes = (props["Meal Type"].multi_select || [])
        .map((m: any) => m.name as MealType)
        .filter(Boolean);
    } else if (props["Meal Type"]?.type === "select" && props["Meal Type"].select?.name) {
      mealTypes = [props["Meal Type"].select.name as MealType];
    } else if (props.MealType?.type === "multi_select") {
      mealTypes = (props.MealType.multi_select || [])
        .map((m: any) => m.name as MealType)
        .filter(Boolean);
    }

    if (mealTypes.length === 0) {
      mealTypes = ["Lunch", "Dinner"];
    }

    // Available
    const available =
      props.Available?.type === "checkbox"
        ? Boolean(props.Available.checkbox)
        : true;

    // Owner
    const owner =
      props.Owner?.select?.name ||
      props.Owner?.rich_text?.[0]?.plain_text ||
      "Esther";

    return {
      id: page.id,
      name,
      mealTypes,
      available,
      owner,
    };
  } catch (err) {
    console.error("Error parsing Notion ready meal:", err);
    return null;
  }
}

export function buildMealLogProperties(entry: MealLogEntry): Record<string, any> {
  const properties: Record<string, any> = {
    Date: {
      date: {
        start: entry.date,
      },
    },
    "Meal Type": {
      select: {
        name: entry.mealType,
      },
    },
    Source: {
      select: {
        name: entry.source,
      },
    },
    "Had Leftovers": {
      checkbox: entry.hadLeftovers,
    },
    Owner: {
      select: {
        name: entry.owner || "Esther",
      },
    },
  };

  if (entry.mainIngredient) {
    properties["Main Ingredient"] = {
      rich_text: [
        {
          text: {
            content: entry.mainIngredient,
          },
        },
      ],
    };
  }

  if (entry.protein) {
    properties.Protein = {
      rich_text: [
        {
          text: {
            content: entry.protein,
          },
        },
      ],
    };
  }

  if (entry.supplementary) {
    properties.Supplementary = {
      rich_text: [
        {
          text: {
            content: entry.supplementary,
          },
        },
      ],
    };
  }

  if (entry.readyMeal) {
    properties["Ready Meal"] = {
      rich_text: [
        {
          text: {
            content: entry.readyMeal,
          },
        },
      ],
    };
  }

  return properties;
}

export function buildNewReadyMealProperties(
  name: string,
  mealType: MealType,
  owner: string = "Esther"
): Record<string, any> {
  return {
    Name: {
      title: [
        {
          text: {
            content: name,
          },
        },
      ],
    },
    "Meal Type": {
      multi_select: [
        {
          name: mealType,
        },
      ],
    },
    Available: {
      checkbox: true,
    },
    Owner: {
      select: {
        name: owner,
      },
    },
  };
}
