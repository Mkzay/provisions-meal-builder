import {
  Ingredient,
  IngredientRole,
  MealLogEntry,
  MealProfile,
  MealType,
  ReadyMeal,
  UserGoal,
  WeightLogEntry,
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

  // Relations to Ingredients Catalogue
  if (entry.mainIngredientId) {
    properties["Main Ingredient"] = {
      relation: [{ id: entry.mainIngredientId }],
    };
  }

  if (entry.proteinId) {
    properties.Protein = {
      relation: [{ id: entry.proteinId }],
    };
  }

  if (entry.supplementaryId) {
    properties.Supplementary = {
      relation: [{ id: entry.supplementaryId }],
    };
  }

  // Relation to Ready Meals
  if (entry.readyMealId) {
    properties["Ready Meal"] = {
      relation: [{ id: entry.readyMealId }],
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

/**
 * Database 4: Meal Profile
 * - Owner (Select)
 * - Goal (Select: Lose weight, Gain weight, Eat healthier, Eat more food generally)
 * - Height (Number, optional)
 */
export function parseNotionMealProfile(page: any): MealProfile | null {
  try {
    const props = page.properties;
    if (!props) return null;

    const owner =
      props.Owner?.select?.name ||
      props.Owner?.rich_text?.[0]?.plain_text ||
      "Esther";

    const goalName = props.Goal?.select?.name || props.goal?.select?.name;
    const goal: UserGoal =
      goalName === "Lose weight" ||
      goalName === "Eat healthier" ||
      goalName === "Eat more food generally"
        ? goalName
        : "Gain weight";

    const heightVal = props.Height?.number ?? props.height?.number;
    const height =
      typeof heightVal === "number" && !isNaN(heightVal) && heightVal > 0
        ? heightVal
        : undefined;

    return {
      id: page.id,
      owner,
      goal,
      height,
      updatedAt: page.last_edited_time || new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error parsing Notion meal profile:", err);
    return null;
  }
}

export function buildMealProfileProperties(profile: {
  owner: string;
  goal: UserGoal;
  height?: number;
}): Record<string, any> {
  const properties: Record<string, any> = {
    Name: {
      title: [
        {
          text: {
            content: `${profile.owner}'s Meal Profile`,
          },
        },
      ],
    },
    Owner: {
      select: {
        name: profile.owner,
      },
    },
    Goal: {
      select: {
        name: profile.goal,
      },
    },
  };

  if (typeof profile.height === "number" && !isNaN(profile.height) && profile.height > 0) {
    properties.Height = {
      number: profile.height,
    };
  } else {
    properties.Height = {
      number: null,
    };
  }

  return properties;
}

/**
 * Database 5: Progress Log
 * - Owner (Select)
 * - Date (Date)
 * - Weight (Number)
 */
export function parseNotionWeightLog(page: any): WeightLogEntry | null {
  try {
    const props = page.properties;
    if (!props) return null;

    const owner =
      props.Owner?.select?.name ||
      props.Owner?.rich_text?.[0]?.plain_text ||
      "Esther";

    const date =
      props.Date?.date?.start ||
      page.created_time?.slice(0, 10) ||
      new Date().toISOString().slice(0, 10);

    const weightVal = props.Weight?.number ?? props.weight?.number;
    if (typeof weightVal !== "number" || isNaN(weightVal)) return null;

    return {
      id: page.id,
      owner,
      date,
      weight: Math.round(weightVal * 10) / 10,
      unit: "kg",
      createdAt: page.created_time || new Date().toISOString(),
    };
  } catch (err) {
    console.error("Error parsing Notion weight log:", err);
    return null;
  }
}

export function buildWeightLogProperties(entry: {
  owner: string;
  date: string;
  weight: number;
}): Record<string, any> {
  const roundedWeight = Math.round(entry.weight * 10) / 10;
  return {
    Name: {
      title: [
        {
          text: {
            content: `${roundedWeight} kg - ${entry.date}`,
          },
        },
      ],
    },
    Owner: {
      select: {
        name: entry.owner,
      },
    },
    Date: {
      date: {
        start: entry.date,
      },
    },
    Weight: {
      number: roundedWeight,
    },
  };
}
