import { NutrientTag, UserGoal } from "./types";

export const NUTRIENT_OPTIONS: { tag: NutrientTag; label: string; icon: string; desc: string }[] = [
  { tag: "High Fiber", label: "High Fiber", icon: "🌾", desc: "Digestion & steady blood sugar" },
  { tag: "High Protein", label: "High Protein", icon: "🍗", desc: "Strength & long-lasting satiety" },
  { tag: "High Carb", label: "High Carb", icon: "⚡", desc: "Immediate fuel & stamina" },
  { tag: "High Fat", label: "High Fat", icon: "🥑", desc: "Clean cell energy & calm focus" },
];

export const GOAL_OPTIONS: { goal: UserGoal; label: string; badge: string; description: string }[] = [
  { goal: "Gain weight", label: "Gain weight", badge: "Default", description: "Hearty, nourishing meals to steadily increase intake and energy." },
  { goal: "Eat healthier", label: "Eat healthier", badge: "Balanced", description: "Wholesome foods, vibrant proteins, and consistent daily fuel." },
  { goal: "Eat more food generally", label: "Eat more food generally", badge: "Regular Intake", description: "Overcoming meal skipping with low-friction, appetizing plates." },
  { goal: "Lose weight", label: "Lose weight", badge: "Paced", description: "Satisfying, mindful meals that leave you light and refreshed." },
];
