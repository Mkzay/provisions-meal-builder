import {
  findMatchingDishBlueprint,
  gatherMatchingSides,
  isCookingOil,
  isSideCompatibleWithBase,
} from "./dish-blueprints";
import { Ingredient, MealType, PairingResult } from "./types";

interface AffinityRule {
  mainPattern: RegExp;
  preferredProteins: string[];
  preferredSupplementary: string[];
}

const AFFINITY_RULES: AffinityRule[] = [
  { mainPattern: /rice|jollof|basmati/i, preferredProteins: ["beef stew", "stew", "fried / grilled chicken", "chicken", "fresh eggs", "fried egg", "canned sardines"], preferredSupplementary: ["dodo", "fried plantain", "steamed spinach", "sliced avocado", "gravy"] },
  { mainPattern: /yam/i, preferredProteins: ["fresh eggs", "fried egg", "beef stew", "canned sardines", "croaker"], preferredSupplementary: ["sliced tomatoes & onions", "dodo", "fried plantain", "steamed spinach", "sliced avocado"] },
  { mainPattern: /bread|toast/i, preferredProteins: ["fresh eggs", "fried egg", "canned sardines", "baked beans"], preferredSupplementary: ["hot tea", "hot tea / cocoa", "sliced avocado", "butter"] },
  { mainPattern: /pasta|spaghetti|noodles/i, preferredProteins: ["beef stew", "canned sardines", "fresh eggs", "chicken"], preferredSupplementary: ["sliced avocado", "steamed spinach", "dodo"] },
  { mainPattern: /potato|sweet potato/i, preferredProteins: ["fresh eggs", "beef stew", "chicken"], preferredSupplementary: ["sliced tomatoes & onions", "sliced avocado"] },
  { mainPattern: /oats|oatmeal/i, preferredProteins: ["fresh eggs"], preferredSupplementary: ["hot tea", "hot tea / cocoa", "sliced avocado"] },
  { mainPattern: /plantain/i, preferredProteins: ["fresh eggs", "fried egg", "beef stew", "chicken"], preferredSupplementary: ["sliced tomatoes & onions", "sliced avocado"] },
  { mainPattern: /cracker|biscuit|snack|cookie|wafer/i, preferredProteins: ["peanut butter", "canned sardines", "fresh eggs", "cheese"], preferredSupplementary: ["hot tea", "sliced avocado", "apple slices"] },
  { mainPattern: /amala|fufu|tuwo|garri|eba|semovita|wheat/i, preferredProteins: ["goat meat", "beef stew", "catfish", "croaker", "smoked fish", "stockfish", "panla"], preferredSupplementary: ["ewedu", "okra", "ugu", "bitterleaf", "efo shoko", "waterleaf", "iru"] },
];

interface MissingUpgradeKnowledge {
  mainPattern: RegExp;
  itemPattern: RegExp;
  suggestedName: string;
  role: "Protein" | "Supplementary";
  reason: string;
}

const UPGRADE_KNOWLEDGE: MissingUpgradeKnowledge[] = [
  { mainPattern: /oats|oatmeal|custard/i, itemPattern: /apple|banana|berry|fruit/i, suggestedName: "Fresh Fruit (Banana / Apple)", role: "Supplementary", reason: "Fresh apple slices add crisp texture, natural sweetness, and dietary fiber." },
  { mainPattern: /oats|oatmeal|custard/i, itemPattern: /chia|flax/i, suggestedName: "Chia Seeds", role: "Supplementary", reason: "Adds healthy omega-3 fats and steady digestion to warm morning grains." },
  { mainPattern: /rice|jollof|basmati/i, itemPattern: /plantain|dodo/i, suggestedName: "Ripe Plantains (Dodo)", role: "Supplementary", reason: "Sweet golden dodo provides the classic pairing with rice and savory stew." },
  { mainPattern: /rice|jollof|basmati/i, itemPattern: /spinach|greens|cabbage|salad/i, suggestedName: "Fresh Greens / Spinach", role: "Supplementary", reason: "Leafy greens provide essential micronutrients and clean contrast to rich stew." },
  { mainPattern: /yam|plantain|potato/i, itemPattern: /egg/i, suggestedName: "Fresh Eggs", role: "Protein", reason: "Pair with tomatoes and onions to make authentic, savory egg sauce." },
  { mainPattern: /yam|plantain|potato/i, itemPattern: /tomato|pepper|onion/i, suggestedName: "Sliced Tomatoes & Onions", role: "Supplementary", reason: "Simmer with your fresh eggs to make authentic, spiced egg sauce." },
  { mainPattern: /bread|toast/i, itemPattern: /egg/i, suggestedName: "Fresh Eggs", role: "Protein", reason: "Fluffy scrambled or fried eggs turn toasted bread into a complete meal." },
  { mainPattern: /bread|toast/i, itemPattern: /avocado/i, suggestedName: "Sliced Avocado", role: "Supplementary", reason: "Healthy fats from avocado provide sustained mental clarity and fuel." },
  { mainPattern: /pasta|spaghetti|noodle/i, itemPattern: /egg/i, suggestedName: "Fresh Eggs", role: "Protein", reason: "Boiled or fried eggs add quick, high-quality protein to your pasta." },
  { mainPattern: /pasta|spaghetti|noodle/i, itemPattern: /tomato|onion/i, suggestedName: "Sliced Tomatoes & Onions", role: "Supplementary", reason: "Aromatic reduction transforms plain pasta into savory Jollof." },
];

export function findBestPairings(
  main: Ingredient,
  allIngredients: Ingredient[],
  mealType: MealType
): PairingResult {
  // Available proteins for this meal type
  const availableProteins = allIngredients.filter(
    (ing) =>
      ing.role === "Protein" &&
      ing.available &&
      ing.mealTypes.includes(mealType)
  );

  // Available supplementary for this meal type (excluding raw cooking oils and incompatible sides)
  const availableSupplementary = allIngredients.filter(
    (ing) =>
      ing.role === "Supplementary" &&
      ing.available &&
      ing.mealTypes.includes(mealType) &&
      !isCookingOil(ing) &&
      isSideCompatibleWithBase(ing, main, mealType)
  );

  let recommendedProtein: Ingredient | undefined;
  let recommendedSupplementary: Ingredient | undefined;
  let recommendedSides: Ingredient[] = [];

  // 1. Try matching authentic culinary dish blueprint from available stock
  const inStock = allIngredients.filter((i) => i.available);
  const blueprint = findMatchingDishBlueprint(main, inStock, mealType);

  if (blueprint) {
    for (const pat of blueprint.preferredProteinPatterns) {
      const match = availableProteins.find((p) => pat.test(p.name));
      if (match) {
        recommendedProtein = match;
        break;
      }
    }
    recommendedSides = gatherMatchingSides(blueprint, availableSupplementary);
    if (recommendedSides.length > 0) {
      recommendedSupplementary = recommendedSides[0];
    }
  }

  // 2. Fallback to general affinity rule if protein/side not yet picked
  const rule = AFFINITY_RULES.find((r) => r.mainPattern.test(main.name));
  if (rule) {
    if (!recommendedProtein) {
      for (const pref of rule.preferredProteins) {
        const match = availableProteins.find((p) =>
          p.name.toLowerCase().includes(pref.toLowerCase())
        );
        if (match) {
          recommendedProtein = match;
          break;
        }
      }
    }

    if (!recommendedSupplementary) {
      for (const pref of rule.preferredSupplementary) {
        const match = availableSupplementary.find((s) =>
          s.name.toLowerCase().includes(pref.toLowerCase())
        );
        if (match) {
          recommendedSupplementary = match;
          recommendedSides = [match];
          break;
        }
      }
    }
  }

  // 3. Fallback for protein only if preferred was unavailable (proteins ground the dish)
  if (!recommendedProtein && availableProteins.length > 0) {
    recommendedProtein = availableProteins[0];
  }

  // NOTE: No forced fallback for sides! A dish like Boiled Yam & Fish or Amala & Stew is complete with 0 sides.

  // Sort available proteins so the recommended one comes first
  const sortedProteins = [...availableProteins].sort((a, b) => {
    if (a.id === recommendedProtein?.id) return -1;
    if (b.id === recommendedProtein?.id) return 1;
    return 0;
  });

  const sortedSupplementary = [...availableSupplementary].sort((a, b) => {
    if (a.id === recommendedSupplementary?.id) return -1;
    if (b.id === recommendedSupplementary?.id) return 1;
    return 0;
  });

  // Calculate missing upgrade suggestions based on what isn't available
  const missingUpgrades: import("./types").MissingUpgradeSuggestion[] = [];

  const matchingUpgrades = UPGRADE_KNOWLEDGE.filter((uk) => uk.mainPattern.test(main.name));
  for (const up of matchingUpgrades) {
    // Never suggest an upgrade if that item category is already selected or in kitchen stock
    const isCovered =
      (recommendedProtein && up.itemPattern.test(recommendedProtein.name)) ||
      recommendedSides.some((s) => up.itemPattern.test(s.name)) ||
      allIngredients.some((ing) => ing.available && up.itemPattern.test(ing.name));

    if (!isCovered) {
      const existingOutOfStock = allIngredients.find(
        (ing) => !ing.available && up.itemPattern.test(ing.name)
      );

      missingUpgrades.push({
        id: existingOutOfStock ? existingOutOfStock.id : `upgrade-${up.suggestedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: existingOutOfStock ? existingOutOfStock.name : up.suggestedName,
        role: up.role,
        reason: up.reason,
        suggestedForMain: main.name,
        alreadyInCatalogue: Boolean(existingOutOfStock),
      });
    }
  }

  // Also check if any preferred item from affinity rules is marked available: false
  if (rule) {
    const unavailableInCatalogue = allIngredients.filter(
      (ing) => !ing.available && ing.mealTypes.includes(mealType)
    );
    for (const unav of unavailableInCatalogue) {
      const isSelected =
        (recommendedProtein && recommendedProtein.name.toLowerCase() === unav.name.toLowerCase()) ||
        recommendedSides.some((s) => s.name.toLowerCase() === unav.name.toLowerCase());
      if (isSelected) continue;

      const isPrefProtein = rule.preferredProteins.some((p) =>
        unav.name.toLowerCase().includes(p.toLowerCase())
      );
      const isPrefSupp = rule.preferredSupplementary.some((s) =>
        unav.name.toLowerCase().includes(s.toLowerCase())
      );

      if ((isPrefProtein || isPrefSupp) && !missingUpgrades.some((mu) => mu.name === unav.name)) {
        missingUpgrades.push({
          id: unav.id,
          name: unav.name,
          role: unav.role,
          reason: `Currently out of stock in your kitchen. Adding this gives your ${main.name} meal optimal balance.`,
          suggestedForMain: main.name,
          alreadyInCatalogue: true,
        });
      }
    }
  }

  const dishName = blueprint
    ? blueprint.generateTitle(main, recommendedProtein, recommendedSides)
    : getSuggestedComboName(main, recommendedProtein, recommendedSides);

  return {
    dishName,
    culinaryNote: blueprint?.culinaryNote,
    recommendedProtein,
    availableProteins: sortedProteins,
    recommendedSupplementary,
    recommendedSupplementaries: recommendedSides,
    availableSupplementary: sortedSupplementary,
    missingUpgrades: missingUpgrades.slice(0, 2),
  };
}

export function getSuggestedComboName(
  main: string | { name: string },
  protein?: string | { name: string },
  supplementary?: string | { name: string } | (string | { name: string })[]
): string {
  const mainName = typeof main === "string" ? main : main?.name || "";
  const proteinName = typeof protein === "string" ? protein : protein?.name;
  if (!proteinName && !supplementary) {
    return mainName;
  }

  let base = mainName;
  if (proteinName) {
    base = `${mainName} & ${proteinName}`;
  }

  if (Array.isArray(supplementary)) {
    const valid = supplementary
      .map((s) => (typeof s === "string" ? s : s?.name || ""))
      .filter(Boolean)
      .map((n) => n.split("(")[0].trim());
    if (valid.length === 0) return base;
    if (valid.length === 1) return `${base} with ${valid[0]}`;
    if (valid.length === 2) return `${base} with ${valid[0]} & ${valid[1]}`;
    return `${base} with ${valid.slice(0, -1).join(", ")} & ${valid[valid.length - 1]}`;
  }

  if (supplementary) {
    const suppName = typeof supplementary === "string" ? supplementary : supplementary.name;
    const cleanSupp = suppName.split("(")[0].trim();
    return `${base} with ${cleanSupp}`;
  }

  return base;
}

/**
 * Deterministic prep time estimate for built meals to eliminate effort uncertainty.
 */
export function getPrepTimeEstimate(
  main?: Ingredient,
  protein?: Ingredient,
  supplementary?: Ingredient | Ingredient[]
): string {
  if (!main) return "⚡ 2–3 min assembly";

  const suppStr = Array.isArray(supplementary)
    ? supplementary.map((s) => s.name).join(" ")
    : supplementary?.name || "";

  const allNames = [main.name, protein?.name, suppStr]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const isColdAssembly =
    /bread|toast|cracker|biscuit|cookie|yogurt|fruit|cereal|granola/.test(main.name.toLowerCase()) &&
    !/fresh eggs|fried egg|egg sauce|stew|chicken|beef/.test(allNames);

  if (isColdAssembly) {
    return "⚡ 2–3 min assembly";
  }

  const isQuick = /oats|oatmeal|noodle|noodles|sardines|baked beans|tea|cocoa/.test(allNames);
  const isHearty = /yam|potato|plantain|rice|jollof|pasta|spaghetti|stew|dodo/.test(allNames);

  if (isHearty) {
    return "🍲 12–15 min warm cook";
  }

  if (isQuick || /egg|eggs/.test(allNames)) {
    return "🍳 5–8 min quick cook";
  }

  return "🍳 7–10 min cook";
}

/**
 * Clean-up footprint indicator to eliminate sink and dishes dread.
 */
export function getCleanUpFootprint(
  main?: Ingredient,
  protein?: Ingredient,
  supplementary?: Ingredient | Ingredient[]
): string {
  if (!main) return "🥣 No Pots (Assemble & Eat)";

  const suppStr = Array.isArray(supplementary)
    ? supplementary.map((s) => s.name).join(" ")
    : supplementary?.name || "";

  const allNames = [main.name, protein?.name, suppStr]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const isNoCook =
    /bread|toast|cracker|biscuit|yogurt|fruit/.test(main.name.toLowerCase()) &&
    !/fresh eggs|egg sauce|stew|chicken|dodo/.test(allNames);

  if (isNoCook) {
    return "🥣 No Pots (Plate & Eat)";
  }

  const hasCookedSupp = Array.isArray(supplementary)
    ? supplementary.some((s) => /dodo|egg sauce|gravy/.test(s.name.toLowerCase()))
    : supplementary && /dodo|egg sauce|gravy/.test(supplementary.name.toLowerCase());

  const cookedCount = [
    /yam|potato|plantain|rice|pasta|oats|noodles/.test(main.name.toLowerCase()),
    protein && /fresh eggs|fried egg|egg sauce|chicken|beef stew/.test(protein.name.toLowerCase()),
    hasCookedSupp,
  ].filter(Boolean).length;

  if (cookedCount >= 2) {
    return "🍳 2 Pans";
  }

  return "🍲 1 Pot";
}

/**
 * Concrete physical kickoff prompt to overcome post-decisional inertia.
 */
export function getFirstStepKickoff(
  main?: Ingredient,
  protein?: Ingredient,
  supplementary?: Ingredient | Ingredient[]
): string {
  if (!main) return "Grab a plate and head to the counter.";

  const mainLower = main.name.toLowerCase();

  if (/oats|oatmeal/.test(mainLower)) {
    return "Measure 1 cup of oats into your small pot or bowl.";
  }
  if (/yam|potato/.test(mainLower)) {
    return "Fill a medium pot with water, add a pinch of salt, and set to high heat.";
  }
  if (/plantain/.test(mainLower)) {
    return "Peel your plantain and slice into golden rounds.";
  }
  if (/bread|toast|cracker|biscuit/.test(mainLower)) {
    return "Set your plate on the counter and grab a butter knife.";
  }
  if (/rice|pasta|spaghetti/.test(mainLower)) {
    return "Put your water to boil on the stove.";
  }
  if (/yogurt|fruit/.test(mainLower)) {
    return "Grab a fresh cereal bowl and spoon from the cupboard.";
  }

  return "Set a small pot or pan on the stove and turn heat to medium.";
}
