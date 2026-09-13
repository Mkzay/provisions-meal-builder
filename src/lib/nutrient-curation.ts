import { cleanBase, findMatchingDishBlueprint, isCookingOil, isSideCompatibleWithBase } from "./dish-blueprints";
import { findBestPairings, getSuggestedComboName } from "./pairings";
import { Ingredient, MealType, NutrientTag, PairingResult, RatedMealRecord, ReadyMeal } from "./types";

export interface SuggestNutrientComboInput {
  availableMains: Ingredient[];
  allIngredients: Ingredient[];
  mealType: MealType;
  nutrientPriorities?: NutrientTag[];
  ratedHistory?: RatedMealRecord[];
}

export interface SuggestedNutrientComboResult {
  main: Ingredient;
  protein?: Ingredient;
  supplementary?: Ingredient;
  pairings: PairingResult;
  matchedPriorities: NutrientTag[];
  comboNutrientTags: NutrientTag[];
}

function normalizeFoodName(name?: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .trim();
}

/**
 * Calculates a bounded feedback score (-3.0 to +2.0) based on user's rating history.
 * Cold start: returns 0 if no rating history exists.
 */
export function calculateFeedbackScore(
  main: Ingredient,
  protein?: Ingredient,
  history?: RatedMealRecord[]
): number {
  if (!history || history.length === 0) {
    return 0;
  }

  const normMain = normalizeFoodName(main.name);
  const cleanMain = cleanBase(main.name).toLowerCase();
  const normProt = protein ? normalizeFoodName(protein.name) : "";

  let liked = 0;
  let disliked = 0;
  let neutral = 0;

  for (const r of history) {
    const rBase = normalizeFoodName(r.baseName);
    const rCleanBase = cleanBase(r.baseName).toLowerCase();
    const baseMatches =
      normMain === rBase ||
      cleanMain === rCleanBase ||
      normMain.includes(rBase) ||
      rBase.includes(normMain) ||
      (cleanMain.length > 2 && rCleanBase.length > 2 && (cleanMain.includes(rCleanBase) || rCleanBase.includes(cleanMain)));

    if (!baseMatches) continue;

    const rProt = r.proteinName ? normalizeFoodName(r.proteinName) : "";

    let protMatches = false;
    if (!normProt && !rProt) {
      protMatches = true;
    } else if (normProt && rProt) {
      protMatches =
        normProt === rProt ||
        normProt.includes(rProt) ||
        rProt.includes(normProt) ||
        (normProt.includes("egg") && rProt.includes("egg")) ||
        (normProt.includes("beef") && rProt.includes("beef")) ||
        (normProt.includes("fish") && rProt.includes("fish")) ||
        (normProt.includes("chicken") && rProt.includes("chicken")) ||
        (normProt.includes("turkey") && rProt.includes("turkey")) ||
        (normProt.includes("bean") && rProt.includes("bean")) ||
        (normProt.includes("sardine") && rProt.includes("sardine"));
    }

    if (!protMatches) continue;

    if (r.rating === "Liked") liked++;
    else if (r.rating === "Disliked") disliked++;
    else if (r.rating === "Neutral") neutral++;
  }

  if (liked === 0 && disliked === 0) return 0;
  if (liked > disliked) {
    return Math.min(2.0, 1.5 + (liked - disliked - 1) * 0.25);
  }
  if (disliked > liked) {
    return Math.max(-3.0, -2.0 - (disliked - liked - 1) * 0.5);
  }
  return 0;
}

/**
 * Collects distinct qualitative nutrient tags across an assembled meal combo.
 */
export function getComboNutrientTags(
  main?: Ingredient,
  protein?: Ingredient,
  supplementary?: Ingredient | Ingredient[],
  readyMeal?: ReadyMeal
): NutrientTag[] {
  const set = new Set<NutrientTag>();
  (main?.nutrientTags || []).forEach((t) => set.add(t));
  (protein?.nutrientTags || []).forEach((t) => set.add(t));
  if (Array.isArray(supplementary)) {
    supplementary.forEach((s) => (s?.nutrientTags || []).forEach((t) => set.add(t)));
  } else if (supplementary) {
    (supplementary.nutrientTags || []).forEach((t) => set.add(t));
  }
  (readyMeal?.nutrientTags || []).forEach((t) => set.add(t));
  return Array.from(set);
}

/**
 * Suggestion weighting factoring nutrient priorities, affinity, and historical feedback.
 * Disliked dishes are bounded-penalized but NEVER hard excluded when options are limited.
 */
export function suggestNutrientAwareCombo(
  input: SuggestNutrientComboInput
): SuggestedNutrientComboResult | null {
  const { availableMains, allIngredients, mealType, nutrientPriorities, ratedHistory } = input;

  if (!availableMains || availableMains.length === 0) {
    return null;
  }

  const availableProteins = allIngredients.filter(
    (i) => i.role === "Protein" && i.available && i.mealTypes.includes(mealType)
  );
  const availableSupplementary = allIngredients.filter(
    (i) => i.role === "Supplementary" && i.available && i.mealTypes.includes(mealType) && !isCookingOil(i)
  );

  interface Candidate {
    main: Ingredient;
    protein?: Ingredient;
    supplementary?: Ingredient;
    pairings: PairingResult;
    matchedPriorities: NutrientTag[];
    comboNutrientTags: NutrientTag[];
    priorityCount: number;
    affinityScore: number;
    feedbackScore: number;
    totalScore: number;
  }

  const candidates: Candidate[] = [];

  for (const main of availableMains) {
    const standardPairing = findBestPairings(main, allIngredients, mealType);

    // Build protein options: test recommended first, plus other available proteins
    const proteinOptions: (Ingredient | undefined)[] =
      availableProteins.length > 0 ? availableProteins : [undefined];

    // Build supplementary options: test compatible sides only, plus undefined (no side)
    const compatibleSupp = availableSupplementary.filter((s) =>
      isSideCompatibleWithBase(s, main, mealType)
    );
    const suppOptions: (Ingredient | undefined)[] = [undefined, ...compatibleSupp];

    for (const prot of proteinOptions) {
      for (const supp of suppOptions) {
        const tags = getComboNutrientTags(main, prot, supp);
        const matched = (nutrientPriorities || []).filter((p) => tags.includes(p));

        let affinityScore = 0;
        if (prot && prot.id === standardPairing.recommendedProtein?.id) {
          affinityScore += 4;
        }
        if (supp && supp.id === standardPairing.recommendedSupplementary?.id) {
          affinityScore += 3;
        }

        const feedbackScore = calculateFeedbackScore(main, prot, ratedHistory);
        const totalScore = matched.length * 10 + affinityScore + feedbackScore;

        candidates.push({
          main,
          protein: prot,
          supplementary: supp,
          pairings: standardPairing,
          matchedPriorities: matched,
          comboNutrientTags: tags,
          priorityCount: matched.length,
          affinityScore,
          feedbackScore,
          totalScore,
        });
      }
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  // Find maximum score across candidates
  const maxScore = Math.max(...candidates.map((c) => c.totalScore));

  // Top candidates band (within 0.5 of max score to preserve variety and tie breaking)
  const topCandidates = candidates.filter((c) => c.totalScore >= maxScore - 0.5);

  // Pick among the top band randomly for variety
  const chosen = topCandidates[Math.floor(Math.random() * topCandidates.length)];

  // Order available list in pairings so the selected ones appear first
  const inStock = allIngredients.filter((i) => i.available);
  const bp = findMatchingDishBlueprint(chosen.main, inStock, mealType);
  const chosenSides = chosen.supplementary
    ? (chosen.pairings.recommendedSupplementaries && chosen.pairings.recommendedSupplementaries.some((s) => s.id === chosen.supplementary?.id)
        ? chosen.pairings.recommendedSupplementaries
        : [chosen.supplementary])
    : [];
  const dishName = bp
    ? bp.generateTitle(chosen.main, chosen.protein, chosenSides)
    : getSuggestedComboName(chosen.main, chosen.protein, chosenSides);

  const customizedPairings: PairingResult = {
    ...chosen.pairings,
    dishName,
    culinaryNote: bp?.culinaryNote || chosen.pairings.culinaryNote,
    recommendedProtein: chosen.protein,
    recommendedSupplementary: chosen.supplementary,
    recommendedSupplementaries: chosenSides,
    availableProteins: chosen.protein
      ? [
          chosen.protein,
          ...chosen.pairings.availableProteins.filter((p) => p.id !== chosen.protein?.id),
        ]
      : chosen.pairings.availableProteins,
    availableSupplementary: chosen.supplementary
      ? [
          chosen.supplementary,
          ...chosen.pairings.availableSupplementary.filter((s) => s.id !== chosen.supplementary?.id),
        ]
      : chosen.pairings.availableSupplementary,
  };

  return {
    main: chosen.main,
    protein: chosen.protein,
    supplementary: chosen.supplementary,
    pairings: customizedPairings,
    matchedPriorities: chosen.matchedPriorities,
    comboNutrientTags: chosen.comboNutrientTags,
  };
}
