export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

export type IngredientRole = "Main" | "Protein" | "Supplementary";

export interface Ingredient {
  id: string;
  name: string;
  mealTypes: MealType[];
  role: IngredientRole;
  owner: string;
  available: boolean;
}

export interface ReadyMeal {
  id: string;
  name: string;
  mealTypes: MealType[];
  owner: string;
  available: boolean;
}

export type MealSource = "Ready Meal" | "Built";

export interface MealLogEntry {
  id?: string;
  mealType: MealType;
  source: MealSource;
  mainIngredient?: string;
  protein?: string;
  supplementary?: string;
  readyMeal?: string;
  date: string;
  hadLeftovers: boolean;
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
  recommendedProtein?: Ingredient;
  availableProteins: Ingredient[];
  recommendedSupplementary?: Ingredient;
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
}

export type UserGoal =
  | "Lose weight"
  | "Gain weight"
  | "Eat healthier"
  | "Eat more food generally";

export interface MealProfile {
  owner: string;
  goal: UserGoal;
  height?: string; // Optional static height, e.g. "5'6\"" or "168 cm"
  updatedAt: string;
}

export interface WeightLogEntry {
  id: string;
  owner: string;
  date: string; // "YYYY-MM-DD"
  weight: number; // e.g. 58.5
  unit: "kg" | "lbs";
  createdAt: string;
}

