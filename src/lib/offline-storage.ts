import {
  AddSupplyInput,
  EMPTY_CATALOGUE,
  KitchenCatalogue,
  LeftoverDecision,
  MealLogEntry,
  ReadyMeal,
} from "./types";

function getCatalogueKey(owner?: string): string {
  const o = (owner || "default").trim().toLowerCase();
  return `provisions_catalogue_cache_${o}_v1`;
}

const OFFLINE_OUTBOX_KEY = "provisions_offline_outbox_v1";

export function loadCachedCatalogue(owner?: string): KitchenCatalogue {
  if (typeof window === "undefined") {
    return EMPTY_CATALOGUE;
  }

  try {
    const item = localStorage.getItem(getCatalogueKey(owner));
    if (!item) return EMPTY_CATALOGUE;
    const parsed = JSON.parse(item);
    return parsed;
  } catch (e) {
    console.error("Failed to load catalogue from localStorage:", e);
    return EMPTY_CATALOGUE;
  }
}

export function saveCachedCatalogue(catalogue: KitchenCatalogue, owner?: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getCatalogueKey(owner), JSON.stringify(catalogue));
  } catch (e) {
    console.error("Failed to save catalogue to localStorage:", e);
  }
}

export function queueOfflineMutation(
  type: "log" | "leftovers" | "supplies",
  payload: MealLogEntry | LeftoverDecision | AddSupplyInput
): void {
  if (typeof window === "undefined") return;
  try {
    const outboxRaw = localStorage.getItem(OFFLINE_OUTBOX_KEY);
    const outbox = outboxRaw ? JSON.parse(outboxRaw) : [];
    outbox.push({ type, payload, timestamp: Date.now() });
    localStorage.setItem(OFFLINE_OUTBOX_KEY, JSON.stringify(outbox));
  } catch (e) {
    console.error("Failed to queue offline mutation:", e);
  }
}

export function getOfflineOutbox(): Array<{ type: string; payload: any; timestamp: number }> {
  if (typeof window === "undefined") return [];
  try {
    const outboxRaw = localStorage.getItem(OFFLINE_OUTBOX_KEY);
    return outboxRaw ? JSON.parse(outboxRaw) : [];
  } catch {
    return [];
  }
}

export function clearOfflineOutbox(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OFFLINE_OUTBOX_KEY);
}

// Optimistic updates for local instant UI feedback
export function applyOptimisticLeftover(
  catalogue: KitchenCatalogue,
  decision: LeftoverDecision
): KitchenCatalogue {
  const nextCatalogue = { ...catalogue };

  if (decision.source === "Ready Meal" && !decision.hadLeftovers && decision.readyMealId) {
    // Mark ready meal as unavailable locally
    nextCatalogue.readyMeals = nextCatalogue.readyMeals.map((rm) =>
      rm.id === decision.readyMealId ? { ...rm, available: false } : rm
    );
  } else if (decision.source === "Built" && decision.hadLeftovers) {
    const newName =
      decision.customName ||
      (decision.protein
        ? `${decision.mainIngredient} + ${decision.protein}`
        : decision.mainIngredient || "Leftover Meal");

    const newReadyMeal: ReadyMeal = {
      id: `local-ready-${Date.now()}`,
      name: newName,
      mealTypes: [decision.mealType],
      owner: decision.owner || "User",
      available: true,
    };

    nextCatalogue.readyMeals = [newReadyMeal, ...nextCatalogue.readyMeals];
  }

  saveCachedCatalogue(nextCatalogue, decision.owner);
  return nextCatalogue;
}
