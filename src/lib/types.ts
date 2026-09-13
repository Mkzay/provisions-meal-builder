export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type IngredientRole = "Main" | "Protein" | "Supplementary";

export type NutrientTag = "High Fiber" | "High Protein" | "High Carb" | "High Fat";

export interface Ingredient {
  id: string;
  name: string;
  mealTypes: MealType[];
  role: IngredientRole;
  owner: string;
  available: boolean;
  nutrientTags?: NutrientTag[];
}

export interface ReadyMeal {
  id: string;
  name: string;
  mealTypes: MealType[];
  owner: string;
  available: boolean;
  nutrientTags?: NutrientTag[];
}

export type MealSource = "Ready Meal" | "Built";

export type MealRating = "Liked" | "Neutral" | "Disliked";

export interface MealLogEntry {
  id?: string;
  mealType: MealType;
  source: MealSource;
  mainIngredientId?: string;
  mainIngredient?: string;
  proteinId?: string;
  protein?: string;
  supplementaryId?: string;
  supplementary?: string;
  supplementaryIds?: string[];
  supplementaries?: Ingredient[];
  readyMealId?: string;
  readyMeal?: string;
  date: string;
  hadLeftovers: boolean;
  owner: string;
  rating?: MealRating;
}

export interface RatedMealRecord {
  id?: string;
  baseName: string;
  proteinName: string;
  rating: MealRating;
  owner: string;
}

export interface MissingUpgradeSuggestion {
  id: string;
  name: string;
  role: IngredientRole;
  reason: string;
  category?: string;
  suggestedForMain: string;
  alreadyInCatalogue?: boolean;
}

export interface PairingResult {
  dishName?: string;
  culinaryNote?: string;
  recommendedProtein?: Ingredient;
  availableProteins: Ingredient[];
  recommendedSupplementary?: Ingredient;
  recommendedSupplementaries?: Ingredient[];
  availableSupplementary: Ingredient[];
  missingUpgrades?: MissingUpgradeSuggestion[];
}

export interface LeftoverDecision {
  hadLeftovers: boolean;
  source: MealSource;
  readyMealId?: string;
  customName?: string;
  mainIngredient?: string;
  protein?: string;
  supplementary?: string;
  mealType: MealType;
  owner?: string;
}

export interface LeftoverActionResult {
  action: "keep_ready" | "uncheck_ready" | "create_ready" | "none";
  readyMealId?: string;
  newReadyMeal?: {
    name: string;
    mealType: MealType;
    owner: string;
    available: boolean;
  };
}

export interface KitchenCatalogue {
  ingredients: Ingredient[];
  readyMeals: ReadyMeal[];
  lastSynced: string;
  isCachedFallback?: boolean;
}

export const EMPTY_CATALOGUE: KitchenCatalogue = {
  ingredients: [],
  readyMeals: [],
  lastSynced: "",
  isCachedFallback: false,
};

export type ReminderFrequency = "every_3_days" | "weekly" | "biweekly";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface NotificationConfig {
  enabled: boolean;
  breakfastTime: string; // "08:30"
  lunchTime: string;     // "13:00"
  snackTime: string;     // "16:30"
  dinnerTime: string;    // "19:30"
  includeGroceryNudges: boolean;
  groceryReminderTime?: string; // "10:00"
  lastTriggeredDate?: string;
  pantryAuditReminder: boolean;
  pantryAuditFrequency: ReminderFrequency;
  pantryAuditDay?: DayOfWeek;
  groceryShoppingReminder: boolean;
  groceryShoppingFrequency: ReminderFrequency;
  groceryShoppingDay?: DayOfWeek;
}

export interface AddSupplyInput {
  kind: "ingredient" | "ready_meal";
  name: string;
  role?: IngredientRole;
  mealTypes: MealType[];
  notes?: string;
  owner?: string;
  available?: boolean;
}

export type UserGoal =
  | "Lose weight"
  | "Gain weight"
  | "Eat healthier"
  | "Eat more food generally";

export interface MealProfile {
  id?: string;
  owner: string;
  targetWeight?: number;
  currentWeight?: number;
  weight?: number;
  height?: number;
  unit?: "kg" | "lbs";
  mealsPerDay?: number;
  goal?: UserGoal;
  nutrientPriorities?: NutrientTag[];
  updatedAt: string;
}

export interface WeightLogEntry {
  id: string;
  owner: string;
  date: string; // "YYYY-MM-DD"
  weight: number; // Number in Notion Database 5
  unit?: "kg" | "lbs";
  createdAt?: string;
}

export interface SavedRecipe {
  id: string;
  name: string;
  mealTypes: MealType[];
  mainIngredientId?: string;
  mainIngredientName?: string;
  proteinId?: string;
  proteinIds?: string[];
  proteinName?: string;
  proteinNames?: string[];
  supplementaryId?: string;
  supplementaryIds?: string[];
  supplementaryName?: string;
  supplementaryNames?: string[];
  owner: string;
  sourceUrl?: string;
  createdAt?: string;
}

export interface CreateSavedRecipeInput {
  name: string;
  mealTypes: MealType[];
  mainIngredientId?: string;
  proteinId?: string;
  proteinIds?: string[];
  supplementaryId?: string;
  supplementaryIds?: string[];
  owner: string;
  sourceUrl?: string;
}
