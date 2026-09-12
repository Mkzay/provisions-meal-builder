import {
  Ingredient,
  IngredientRole,
  MealLogEntry,
  MealProfile,
  MealType,
  NutrientTag,
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

    // Nutrient Tags
    const rawNutrients = props["Nutrient Tags"]?.multi_select || props.NutrientTags?.multi_select || [];
    const nutrientTags: NutrientTag[] = rawNutrients.map((n: any) => n.name).filter(Boolean);

    return {
      id: page.id,
      name,
      mealTypes,
      role,
      available,
      owner,
      ...(nutrientTags.length > 0 ? { nutrientTags } : {}),
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

    // Nutrient Tags
    const rawNutrients = props["Nutrient Tags"]?.multi_select || props.NutrientTags?.multi_select || [];
    const nutrientTags: NutrientTag[] = rawNutrients.map((n: any) => n.name).filter(Boolean);

    return {
      id: page.id,
      name,
      mealTypes,
      available,
      owner,
      ...(nutrientTags.length > 0 ? { nutrientTags } : {}),
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
        name: entry.owner || "User",
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

  if (entry.supplementaryIds && entry.supplementaryIds.length > 0) {
    properties.Supplementary = {
      relation: entry.supplementaryIds.map((id) => ({ id })),
    };
  } else if (entry.supplementaryId) {
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
    Name: { title: [{ text: { content: name } }] },
    "Meal Type": { multi_select: [{ name: mealType }] },
    Available: { checkbox: true },
    Owner: { select: { name: owner } },
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

    const owner = props.Owner?.select?.name || props.Owner?.rich_text?.[0]?.plain_text || "Esther";
    const goalName = props.Goal?.select?.name || props.goal?.select?.name;
    const goal: UserGoal =
      goalName === "Lose weight" || goalName === "Eat healthier" || goalName === "Eat more food generally"
        ? goalName
        : "Gain weight";

    const heightVal = props.Height?.number ?? props.height?.number;
    const height = typeof heightVal === "number" && !isNaN(heightVal) && heightVal > 0 ? heightVal : undefined;
    const weightVal = props.Weight?.number ?? props.weight?.number;
    const weight = typeof weightVal === "number" && !isNaN(weightVal) && weightVal > 0 ? weightVal : undefined;
    const rawPriorities = props["Nutrient Priorities"]?.multi_select || props.NutrientPriorities?.multi_select || [];
    const nutrientPriorities: NutrientTag[] = rawPriorities.map((p: any) => p.name).filter(Boolean);
    const mealsVal = props["Meals Per Day"]?.number ?? props.MealsPerDay?.number;
    const mealsPerDay = typeof mealsVal === "number" && !isNaN(mealsVal) && mealsVal > 0 ? mealsVal : undefined;

    return {
      id: page.id,
      owner,
      goal,
      height,
      weight,
      ...(nutrientPriorities.length > 0 ? { nutrientPriorities } : {}),
      ...(mealsPerDay ? { mealsPerDay } : {}),
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
  weight?: number;
  nutrientPriorities?: NutrientTag[];
  mealsPerDay?: number;
}): Record<string, any> {
  const properties: Record<string, any> = {
    Name: { title: [{ text: { content: `${profile.owner}'s Meal Profile` } }] },
    Owner: { select: { name: profile.owner } },
    Goal: { select: { name: profile.goal } },
  };

  if (typeof profile.height === "number" && !isNaN(profile.height) && profile.height > 0) {
    properties.Height = { number: profile.height };
  } else {
    properties.Height = { number: null };
  }

  if (typeof profile.weight === "number" && !isNaN(profile.weight) && profile.weight > 0) {
    properties.Weight = { number: profile.weight };
  }

  if (profile.nutrientPriorities && profile.nutrientPriorities.length > 0) {
    properties["Nutrient Priorities"] = {
      multi_select: profile.nutrientPriorities.map((name) => ({ name })),
    };
  }

  if (typeof profile.mealsPerDay === "number" && profile.mealsPerDay > 0) {
    properties["Meals Per Day"] = { number: profile.mealsPerDay };
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

    const owner = props.Owner?.select?.name || props.Owner?.rich_text?.[0]?.plain_text || "Esther";
    const date = props.Date?.date?.start || page.created_time?.slice(0, 10) || new Date().toISOString().slice(0, 10);
    const weightVal = props.Weight?.number ?? props.weight?.number;
    if (typeof weightVal !== "number" || isNaN(weightVal)) return null;

    const titleText = props.Name?.title?.[0]?.plain_text || props.Name?.title?.[0]?.text?.content || "";
    const unit: "kg" | "lbs" = titleText.toLowerCase().includes("lbs") ? "lbs" : "kg";

    return {
      id: page.id,
      owner,
      date,
      weight: Math.round(weightVal * 100) / 100,
      unit,
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
  unit?: "kg" | "lbs";
}): Record<string, any> {
  const roundedWeight = Math.round(entry.weight * 100) / 100;
  const unitLabel = entry.unit === "lbs" ? "lbs" : "kg";
  return {
    Name: { title: [{ text: { content: `${roundedWeight} ${unitLabel} - ${entry.date}` } }] },
    Owner: { select: { name: entry.owner } },
    Date: { date: { start: entry.date } },
    Weight: { number: roundedWeight },
  };
}
