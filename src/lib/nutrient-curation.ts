import { findBestPairings } from "./pairings";
import { Ingredient, MealType, NutrientTag, PairingResult, ReadyMeal } from "./types";

export interface SuggestNutrientComboInput {
  availableMains: Ingredient[];
  allIngredients: Ingredient[];
  mealType: MealType;
  nutrientPriorities?: NutrientTag[];
}

export interface SuggestedNutrientComboResult {
  main: Ingredient;
  protein?: Ingredient;
  supplementary?: Ingredient;
  pairings: PairingResult;
  matchedPriorities: NutrientTag[];
  comboNutrientTags: NutrientTag[];
}

/**
 * Collects distinct qualitative nutrient tags across an assembled meal combo.
 */
export function getComboNutrientTags(
  main?: Ingredient,
  protein?: Ingredient,
  supplementary?: Ingredient,
  readyMeal?: ReadyMeal
): NutrientTag[] {
  const set = new Set<NutrientTag>();
  (main?.nutrientTags || []).forEach((t) => set.add(t));
  (protein?.nutrientTags || []).forEach((t) => set.add(t));
  (supplementary?.nutrientTags || []).forEach((t) => set.add(t));
  (readyMeal?.nutrientTags || []).forEach((t) => set.add(t));
  return Array.from(set);
}

/**
 * Lightweight suggestion weighting:
 * If nutrient priorities are set, prefers combos covering as many priorities as possible.
 * Soft preference: if no priorities match or priorities are empty, falls back to standard affinity pairing.
 */
export function suggestNutrientAwareCombo(
  input: SuggestNutrientComboInput
): SuggestedNutrientComboResult | null {
  const { availableMains, allIngredients, mealType, nutrientPriorities } = input;

  if (!availableMains || availableMains.length === 0) {
    return null;
  }

  // Fallback: If no priorities are set, use standard random main + affinity pairings
  if (!nutrientPriorities || nutrientPriorities.length === 0) {
    const randomMain = availableMains[Math.floor(Math.random() * availableMains.length)];
    const pairings = findBestPairings(randomMain, allIngredients, mealType);
    const comboNutrientTags = getComboNutrientTags(
      randomMain,
      pairings.recommendedProtein,
      pairings.recommendedSupplementary
    );
    return {
      main: randomMain,
      protein: pairings.recommendedProtein,
      supplementary: pairings.recommendedSupplementary,
      pairings,
      matchedPriorities: [],
      comboNutrientTags,
    };
  }

  const availableProteins = allIngredients.filter(
    (i) => i.role === "Protein" && i.available && i.mealTypes.includes(mealType)
  );
  const availableSupplementary = allIngredients.filter(
    (i) => i.role === "Supplementary" && i.available && i.mealTypes.includes(mealType)
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
  }

  const candidates: Candidate[] = [];

  for (const main of availableMains) {
    const standardPairing = findBestPairings(main, allIngredients, mealType);

    // Build protein options: test recommended first, plus other available proteins
    const proteinOptions: (Ingredient | undefined)[] =
      availableProteins.length > 0 ? availableProteins : [undefined];

    // Build supplementary options: test recommended first, plus others
    const suppOptions: (Ingredient | undefined)[] =
      availableSupplementary.length > 0 ? availableSupplementary : [undefined];

    for (const prot of proteinOptions) {
      for (const supp of suppOptions) {
        const tags = getComboNutrientTags(main, prot, supp);
        const matched = nutrientPriorities.filter((p) => tags.includes(p));

        let affinityScore = 0;
        if (prot && prot.id === standardPairing.recommendedProtein?.id) {
          affinityScore += 4;
        }
        if (supp && supp.id === standardPairing.recommendedSupplementary?.id) {
          affinityScore += 3;
        }

        candidates.push({
          main,
          protein: prot,
          supplementary: supp,
          pairings: standardPairing,
          matchedPriorities: matched,
          comboNutrientTags: tags,
          priorityCount: matched.length,
          affinityScore,
        });
      }
    }
  }

  const maxPriorityCount = Math.max(0, ...candidates.map((c) => c.priorityCount));

  // If nothing available covers any priority, fall back to existing pairing logic
  if (maxPriorityCount === 0) {
    const randomMain = availableMains[Math.floor(Math.random() * availableMains.length)];
    const pairings = findBestPairings(randomMain, allIngredients, mealType);
    const comboNutrientTags = getComboNutrientTags(
      randomMain,
      pairings.recommendedProtein,
      pairings.recommendedSupplementary
    );
    return {
      main: randomMain,
      protein: pairings.recommendedProtein,
      supplementary: pairings.recommendedSupplementary,
      pairings,
      matchedPriorities: [],
      comboNutrientTags,
    };
  }

  // Filter candidates matching the highest priority coverage
  const topCandidates = candidates.filter((c) => c.priorityCount === maxPriorityCount);

  // Sort by affinityScore descending
  topCandidates.sort((a, b) => b.affinityScore - a.affinityScore);

  // Pick among the top-tied affinity candidates for delightful variety
  const topScore = topCandidates[0].affinityScore;
  const bestTies = topCandidates.filter((c) => c.affinityScore === topScore);
  const chosen = bestTies[Math.floor(Math.random() * bestTies.length)];

  // Order available list in pairings so the selected ones appear first
  const customizedPairings: PairingResult = {
    ...chosen.pairings,
    recommendedProtein: chosen.protein,
    recommendedSupplementary: chosen.supplementary,
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
