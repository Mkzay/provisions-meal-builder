import { getDefaultMealTypeByHour, getAvailableMains, getAvailableReadyMeals } from "./flow-logic";
import { applyOptimisticLeftover, getOfflineOutbox, loadCachedCatalogue, queueOfflineMutation, replayOfflineMutations, saveCachedCatalogue, saveOfflineOutbox } from "./offline-storage";
import { findBestPairings } from "./pairings";
import { suggestNutrientAwareCombo } from "./nutrient-curation";
import { getClientProfileCached } from "./profile-storage";
import { SEED_CATALOGUE } from "./seed-data";
import { AddSupplyInput, EMPTY_CATALOGUE, Ingredient, KitchenCatalogue, LeftoverDecision, MealLogEntry, MealRating, MealSource, MealType, NutrientTag, PairingResult, RatedMealRecord, ReadyMeal, SavedRecipe } from "./types";
import { useEffect, useState } from "react";

export type FlowStep = "meal_type" | "ready_meal" | "mode_select" | "manual_pick" | "pairing" | "confirm";

export function useMealBuilder(owner: string = "User", nutrientPriorities?: NutrientTag[], savedRecipes?: SavedRecipe[]) {
  const [catalogue, setCatalogue] = useState<KitchenCatalogue>(EMPTY_CATALOGUE);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAddSupplyOpen, setIsAddSupplyOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>(() => getDefaultMealTypeByHour(new Date().getHours(), getClientProfileCached(owner)?.mealsPerDay));
  const [currentStep, setCurrentStep] = useState<FlowStep>("meal_type");
  const [selectedSource, setSelectedSource] = useState<MealSource>("Built");
  const [selectedReadyMeal, setSelectedReadyMeal] = useState<ReadyMeal | undefined>();
  const [selectedMain, setSelectedMain] = useState<Ingredient | undefined>();
  const [selectedProtein, setSelectedProtein] = useState<Ingredient | undefined>();
  const [selectedSupplementary, setSelectedSupplementary] = useState<Ingredient | undefined>();
  const [selectedSupplementaries, setSelectedSupplementaries] = useState<Ingredient[]>([]);
  const [pairingResult, setPairingResult] = useState<PairingResult | null>(null);
  const [isLeftoverModalOpen, setIsLeftoverModalOpen] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [ratedHistory, setRatedHistory] = useState<RatedMealRecord[]>([]);
  const [activeLogId, setActiveLogId] = useState<string | undefined>();
  const [isRatingCardOpen, setIsRatingCardOpen] = useState(false);

  useEffect(() => {
    const cached = loadCachedCatalogue(owner);
    setCatalogue(cached);
    setIsClientReady(true);

    fetch(`/api/notion/catalogue?owner=${encodeURIComponent(owner)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((fresh) => { if (fresh) { setCatalogue(fresh); saveCachedCatalogue(fresh, owner); } })
      .catch((err) => console.log("Using cached catalogue snapshot:", err));

    fetch(`/api/notion/log?owner=${encodeURIComponent(owner)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.ratings && setRatedHistory(data.ratings))
      .catch(() => {});
  }, [owner]);

  useEffect(() => {
    const replay = async () => {
      const remaining = await replayOfflineMutations(getOfflineOutbox(), async (entry) => {
        const endpoint = entry.type === "log" ? "/api/notion/log" : entry.type === "leftovers" ? "/api/notion/leftovers" : "/api/notion/supplies";
        try {
          const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(entry.payload) });
          return response.ok;
        } catch { return false; }
      });
      saveOfflineOutbox(remaining);
    };
    void replay();
    window.addEventListener("online", replay);
    return () => window.removeEventListener("online", replay);
  }, []);

  const availableReadyMeals = getAvailableReadyMeals(catalogue.readyMeals, mealType);
  const availableMains = getAvailableMains(catalogue.ingredients, mealType);
  const totalAvailableInMealType =
    availableReadyMeals.length +
    catalogue.ingredients.filter((i) => i.available && i.mealTypes.includes(mealType)).length;

  const handleRefreshCatalogue = async () => {
    try {
      const res = await fetch(`/api/notion/catalogue?owner=${encodeURIComponent(owner)}`);
      if (res.ok) {
        const fresh: KitchenCatalogue = await res.json();
        setCatalogue(fresh);
        saveCachedCatalogue(fresh, owner);
      }
    } catch (e) { console.error("Refresh failed:", e); }
  };

  const handleSeedStarterIngredients = async () => {
    try {
      const res = await fetch("/api/notion/catalogue", { method: "POST" });
      if (res.ok) {
        const fresh: KitchenCatalogue = await res.json();
        setCatalogue(fresh);
        saveCachedCatalogue(fresh, owner);
        return;
      }
    } catch {}
    const fallback: KitchenCatalogue = { ...EMPTY_CATALOGUE, ingredients: SEED_CATALOGUE.ingredients.map((i) => ({ ...i, owner })), readyMeals: [] };
    setCatalogue(fallback);
    saveCachedCatalogue(fallback, owner);
  };

  const handleResetToHome = () => {
    setCurrentStep("meal_type");
    setSelectedReadyMeal(undefined); setSelectedMain(undefined);
    setSelectedProtein(undefined); setSelectedSupplementary(undefined);
    setSelectedSupplementaries([]); setPairingResult(null);
  };

  const handleSelectMealType = (type: MealType) => {
    setMealType(type);
    const readyMeals = getAvailableReadyMeals(catalogue.readyMeals, type);
    setCurrentStep(readyMeals.length > 0 ? "ready_meal" : "mode_select");
  };

  const handleSelectReadyMeal = (readyMeal: ReadyMeal) => {
    setSelectedSource("Ready Meal");
    setSelectedReadyMeal(readyMeal);
    setSelectedMain(undefined);
    setSelectedProtein(undefined);
    setSelectedSupplementary(undefined);
    setCurrentStep("confirm");
  };

  const handleBypassReadyMeal = () => setCurrentStep("mode_select");

  const handleSuggestForMe = () => {
    if (availableMains.length === 0) return;
    const activePriorities = nutrientPriorities || getClientProfileCached(owner)?.nutrientPriorities;
    const combo = suggestNutrientAwareCombo({
      availableMains,
      allIngredients: catalogue.ingredients,
      mealType,
      nutrientPriorities: activePriorities,
      ratedHistory,
      savedRecipes,
    });
    if (!combo) return;

    setSelectedMain(combo.main);
    setPairingResult(combo.pairings);
    setSelectedProtein(combo.protein);
    setSelectedSupplementary(combo.supplementary);
    setSelectedSupplementaries(combo.supplementary ? [combo.supplementary] : []);
    setSelectedSource("Built");
    setSelectedReadyMeal(undefined);
    setCurrentStep("pairing");
  };

  const handleCookSavedRecipe = (recipe: SavedRecipe) => {
    const main = catalogue.ingredients.find((i) => i.id === recipe.mainIngredientId);
    if (!main) return;
    const proteinId = recipe.proteinIds?.length ? recipe.proteinIds[0] : recipe.proteinId;
    const prot = proteinId ? catalogue.ingredients.find((i) => i.id === proteinId) : undefined;
    const suppIds = recipe.supplementaryIds?.length ? recipe.supplementaryIds : (recipe.supplementaryId ? [recipe.supplementaryId] : []);
    const supps = suppIds.map((id) => catalogue.ingredients.find((i) => i.id === id)).filter((i): i is Ingredient => !!i);
    const supp = supps[0];
    const basePairings = findBestPairings(main, catalogue.ingredients, mealType);
    setSelectedMain(main);
    setSelectedProtein(prot);
    setSelectedSupplementary(supp);
    setSelectedSupplementaries(supps);
    setPairingResult({
      ...basePairings,
      dishName: recipe.name,
      recommendedProtein: prot,
      recommendedSupplementary: supp,
      recommendedSupplementaries: supps,
    });
    setSelectedSource("Built");
    setSelectedReadyMeal(undefined);
    setCurrentStep("pairing");
  };

  const handleManualPickMode = () => {
    setCurrentStep("manual_pick");
  };

  const handleSelectMain = (main: Ingredient) => {
    setSelectedMain(main);
    const pairings = findBestPairings(main, catalogue.ingredients, mealType);
    setPairingResult(pairings);
    setSelectedProtein(pairings.recommendedProtein);
    setSelectedSupplementary(pairings.recommendedSupplementary);
    setSelectedSupplementaries(pairings.recommendedSupplementary ? [pairings.recommendedSupplementary] : []);
    setSelectedSource("Built");
    setSelectedReadyMeal(undefined);
    setCurrentStep("pairing");
  };

  const handleConfirmCombo = (
    main: Ingredient,
    protein?: Ingredient,
    supplementary?: Ingredient | Ingredient[]
  ) => {
    setSelectedMain(main);
    setSelectedProtein(protein);
    if (Array.isArray(supplementary)) {
      setSelectedSupplementaries(supplementary);
      setSelectedSupplementary(supplementary[0]);
    } else {
      setSelectedSupplementary(supplementary);
      setSelectedSupplementaries(supplementary ? [supplementary] : []);
    }
    setCurrentStep("confirm");
  };

  const handleConfirmAndLog = async () => {
    setIsLogging(true);

    const primarySupp = selectedSupplementaries[0] || selectedSupplementary;
    const allSuppNames = selectedSupplementaries.length > 0
      ? selectedSupplementaries.map((s) => s.name).join(", ")
      : selectedSupplementary?.name;

    const entry: MealLogEntry = {
      date: new Date().toISOString(),
      mealType,
      source: selectedSource,
      mainIngredientId: selectedMain?.id,
      mainIngredient: selectedMain?.name,
      proteinId: selectedProtein?.id,
      protein: selectedProtein?.name,
      supplementaryId: primarySupp?.id,
      supplementary: allSuppNames,
      supplementaryIds: selectedSupplementaries.map((s) => s.id),
      supplementaries: selectedSupplementaries,
      readyMealId: selectedReadyMeal?.id,
      readyMeal: selectedReadyMeal?.name,
      hadLeftovers: false,
      owner,
    };

    try {
      const res = await fetch("/api/notion/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.id) setActiveLogId(data.id);
      }
    } catch {
      queueOfflineMutation("log", entry);
    } finally {
      setIsLogging(false);
      setIsLeftoverModalOpen(true);
    }
  };

  const handleSubmitLeftoverDecision = async (decision: LeftoverDecision) => {
    const payload = { ...decision, owner: decision.owner || owner };
    const updated = applyOptimisticLeftover(catalogue, payload);
    setCatalogue(updated);

    try {
      await fetch("/api/notion/leftovers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      queueOfflineMutation("leftovers", payload);
    }
  };

  const handleQuickAddStaples = (staples: Ingredient[]) => {
    const nextIngredients = [...catalogue.ingredients];
    for (const staple of staples) {
      const idx = nextIngredients.findIndex((i) => i.name.toLowerCase() === staple.name.toLowerCase());
      if (idx >= 0) {
        nextIngredients[idx] = { ...nextIngredients[idx], available: true };
      } else {
        nextIngredients.push({ ...staple, owner: staple.owner || owner });
      }
    }
    const nextCatalogue = { ...catalogue, ingredients: nextIngredients };
    setCatalogue(nextCatalogue);
    saveCachedCatalogue(nextCatalogue, owner);
    setCurrentStep("meal_type");
  };

  const handleAddBulkSupplies = async (inputs: AddSupplyInput[]): Promise<Array<{ success: boolean; id?: string }>> => {
    if (!inputs.length) return [];
    let nextCatalogue = { ...catalogue };
    const now = Date.now();
    const newIngredients: Ingredient[] = [];
    const newReadyMeals: ReadyMeal[] = [];

    inputs.forEach((inp, idx) => {
      const sOwner = inp.owner || owner;
      const isAvail = inp.available !== undefined ? inp.available : true;
      if (inp.kind === "ingredient") {
        newIngredients.push({ id: `ing-${now}-${idx}`, name: inp.name, mealTypes: inp.mealTypes, role: inp.role || "Main", owner: sOwner, available: isAvail });
      } else {
        newReadyMeals.push({ id: `ready-${now}-${idx}`, name: inp.name, mealTypes: inp.mealTypes, owner: sOwner, available: isAvail });
      }
    });

    if (newIngredients.length) nextCatalogue = { ...nextCatalogue, ingredients: [...newIngredients, ...nextCatalogue.ingredients] };
    if (newReadyMeals.length) nextCatalogue = { ...nextCatalogue, readyMeals: [...newReadyMeals, ...nextCatalogue.readyMeals] };
    setCatalogue(nextCatalogue);
    saveCachedCatalogue(nextCatalogue, owner);

    const outcomes = await Promise.allSettled(
      inputs.map(async (inp, idx) => {
        const supplyInput = { ...inp, owner: inp.owner || owner };
        try {
          const res = await fetch("/api/notion/supplies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(supplyInput) });
          if (res.ok) {
            const data = await res.json();
            if (data?.id) {
              const tempId = inp.kind === "ingredient" ? `ing-${now}-${idx}` : `ready-${now}-${idx}`;
              setCatalogue((prev) => {
                const updated = {
                  ...prev,
                  ingredients: prev.ingredients.map((i) => (i.id === tempId ? { ...i, id: data.id } : i)),
                  readyMeals: prev.readyMeals.map((m) => (m.id === tempId ? { ...m, id: data.id } : m)),
                };
                saveCachedCatalogue(updated, owner);
                return updated;
              });
              return { success: true, id: data.id as string };
            }
          }
        } catch { queueOfflineMutation("supplies", supplyInput); }
        return { success: false };
      })
    );
    return outcomes.map((o) => (o.status === "fulfilled" ? o.value : { success: false }));
  };

  const handleAddSupply = async (input: AddSupplyInput): Promise<{ success: boolean; id?: string }> => {
    const results = await handleAddBulkSupplies([input]);
    return results[0] || { success: false };
  };

  const handleRateMeal = async (rating: MealRating) => {
    setIsRatingCardOpen(false);
    handleResetToHome();

    if (!activeLogId) return;

    if (selectedMain && selectedSource === "Built") {
      setRatedHistory((prev) => [
        ...prev,
        { baseName: selectedMain.name, proteinName: selectedProtein?.name || "", rating, owner },
      ]);
    }

    try {
      await fetch("/api/notion/log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeLogId, rating }),
      });
    } catch {}
  };

  const handleSkipRating = () => {
    setIsRatingCardOpen(false);
    handleResetToHome();
  };

  const handleToggleAvailability = async (id: string, kind: "ingredient" | "ready_meal", available: boolean) => {
    const nextCatalogue = {
      ...catalogue,
      ingredients: kind === "ingredient" ? catalogue.ingredients.map((i) => (i.id === id ? { ...i, available } : i)) : catalogue.ingredients,
      readyMeals: kind === "ready_meal" ? catalogue.readyMeals.map((m) => (m.id === id ? { ...m, available } : m)) : catalogue.readyMeals,
    };
    setCatalogue(nextCatalogue);
    saveCachedCatalogue(nextCatalogue, owner);
    try { await fetch("/api/notion/supplies", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, available }) }); } catch {}
  };

  const handleDeleteSupply = async (id: string, kind: "ingredient" | "ready_meal", name?: string) => {
    const nextCatalogue = {
      ...catalogue,
      ingredients: kind === "ingredient" ? catalogue.ingredients.filter((i) => i.id !== id && (!name || i.name !== name)) : catalogue.ingredients,
      readyMeals: kind === "ready_meal" ? catalogue.readyMeals.filter((m) => m.id !== id && (!name || m.name !== name)) : catalogue.readyMeals,
    };
    setCatalogue(nextCatalogue);
    saveCachedCatalogue(nextCatalogue, owner);
    const q = new URLSearchParams({ id });
    if (name) q.set("name", name);
    try { await fetch(`/api/notion/supplies?${q.toString()}`, { method: "DELETE" }); } catch {}
  };

  return {
    catalogue, isClientReady, isSettingsOpen, setIsSettingsOpen, isNotificationOpen, setIsNotificationOpen, isAddSupplyOpen, setIsAddSupplyOpen,
    mealType, currentStep, setCurrentStep, selectedSource, selectedReadyMeal, selectedMain, selectedProtein, selectedSupplementary,
    selectedSupplementaries, setSelectedSupplementaries, pairingResult, isLeftoverModalOpen, setIsLeftoverModalOpen, isLogging,
    availableReadyMeals, availableMains, totalAvailableInMealType, handleRefreshCatalogue, handleSeedStarterIngredients,
    handleResetSeedData: handleSeedStarterIngredients, handleResetToHome,
    handleSelectMealType, handleSelectReadyMeal, handleBypassReadyMeal, handleSuggestForMe, handleManualPickMode, handleSelectMain,
    handleConfirmCombo, handleConfirmAndLog, handleSubmitLeftoverDecision, handleQuickAddStaples, handleAddSupply, handleAddBulkSupplies,
    handleToggleAvailability, handleDeleteSupply, handleCookSavedRecipe, isRatingCardOpen, setIsRatingCardOpen, activeLogId, handleRateMeal, handleSkipRating, ratedHistory,
  };
}
