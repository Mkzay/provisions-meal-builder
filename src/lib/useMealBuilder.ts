import { getDefaultMealTypeByHour, getAvailableMains, getAvailableReadyMeals } from "./flow-logic";
import {
  applyOptimisticLeftover,
  loadCachedCatalogue,
  queueOfflineMutation,
  saveCachedCatalogue,
} from "./offline-storage";
import { findBestPairings } from "./pairings";
import { SEED_CATALOGUE } from "./seed-data";
import {
  AddSupplyInput,
  EMPTY_CATALOGUE,
  Ingredient,
  KitchenCatalogue,
  LeftoverDecision,
  MealLogEntry,
  MealSource,
  MealType,
  PairingResult,
  ReadyMeal,
} from "./types";
import { useEffect, useState } from "react";

export type FlowStep =
  | "meal_type"
  | "ready_meal"
  | "mode_select"
  | "manual_pick"
  | "pairing"
  | "confirm";

export function useMealBuilder(owner: string = "User") {
  const [catalogue, setCatalogue] = useState<KitchenCatalogue>(EMPTY_CATALOGUE);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAddSupplyOpen, setIsAddSupplyOpen] = useState(false);

  const [mealType, setMealType] = useState<MealType>(
    getDefaultMealTypeByHour(new Date().getHours())
  );
  const [currentStep, setCurrentStep] = useState<FlowStep>("meal_type");

  const [selectedSource, setSelectedSource] = useState<MealSource>("Built");
  const [selectedReadyMeal, setSelectedReadyMeal] = useState<ReadyMeal | undefined>();
  const [selectedMain, setSelectedMain] = useState<Ingredient | undefined>();
  const [selectedProtein, setSelectedProtein] = useState<Ingredient | undefined>();
  const [selectedSupplementary, setSelectedSupplementary] = useState<Ingredient | undefined>();
  const [pairingResult, setPairingResult] = useState<PairingResult | null>(null);

  const [isLeftoverModalOpen, setIsLeftoverModalOpen] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    const cached = loadCachedCatalogue(owner);
    setCatalogue(cached);
    setIsClientReady(true);

    fetch(`/api/notion/catalogue?owner=${encodeURIComponent(owner)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((freshCatalogue: KitchenCatalogue | null) => {
        if (freshCatalogue) {
          setCatalogue(freshCatalogue);
          saveCachedCatalogue(freshCatalogue, owner);
        }
      })
      .catch((err) => {
        console.log("Using cached catalogue snapshot:", err);
      });
  }, [owner]);

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
    } catch (e) {
      console.error("Refresh failed:", e);
    }
  };

  const handleResetSeedData = () => {
    const ownerSeed: KitchenCatalogue = {
      ...SEED_CATALOGUE,
      ingredients: SEED_CATALOGUE.ingredients.map((i) => ({ ...i, owner })),
      readyMeals: SEED_CATALOGUE.readyMeals.map((m) => ({ ...m, owner })),
    };
    setCatalogue(ownerSeed);
    saveCachedCatalogue(ownerSeed, owner);
    setIsSettingsOpen(false);
  };

  const handleResetToHome = () => {
    setCurrentStep("meal_type");
    setSelectedReadyMeal(undefined);
    setSelectedMain(undefined);
    setSelectedProtein(undefined);
    setSelectedSupplementary(undefined);
    setPairingResult(null);
  };

  const handleSelectMealType = (type: MealType) => {
    setMealType(type);
    const readyMeals = getAvailableReadyMeals(catalogue.readyMeals, type);
    if (readyMeals.length > 0) {
      setCurrentStep("ready_meal");
    } else {
      setCurrentStep("mode_select");
    }
  };

  const handleSelectReadyMeal = (readyMeal: ReadyMeal) => {
    setSelectedSource("Ready Meal");
    setSelectedReadyMeal(readyMeal);
    setSelectedMain(undefined);
    setSelectedProtein(undefined);
    setSelectedSupplementary(undefined);
    setCurrentStep("confirm");
  };

  const handleBypassReadyMeal = () => {
    setCurrentStep("mode_select");
  };

  const handleSuggestForMe = () => {
    if (availableMains.length === 0) return;
    const randomMain =
      availableMains[Math.floor(Math.random() * availableMains.length)];
    setSelectedMain(randomMain);

    const pairings = findBestPairings(randomMain, catalogue.ingredients, mealType);
    setPairingResult(pairings);
    setSelectedProtein(pairings.recommendedProtein);
    setSelectedSupplementary(pairings.recommendedSupplementary);
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
    setSelectedSource("Built");
    setSelectedReadyMeal(undefined);
    setCurrentStep("pairing");
  };

  const handleConfirmCombo = (
    main: Ingredient,
    protein?: Ingredient,
    supplementary?: Ingredient
  ) => {
    setSelectedMain(main);
    setSelectedProtein(protein);
    setSelectedSupplementary(supplementary);
    setCurrentStep("confirm");
  };

  const handleConfirmAndLog = async () => {
    setIsLogging(true);

    const entry: MealLogEntry = {
      date: new Date().toISOString(),
      mealType,
      source: selectedSource,
      mainIngredientId: selectedMain?.id,
      mainIngredient: selectedMain?.name,
      proteinId: selectedProtein?.id,
      protein: selectedProtein?.name,
      supplementaryId: selectedSupplementary?.id,
      supplementary: selectedSupplementary?.name,
      readyMealId: selectedReadyMeal?.id,
      readyMeal: selectedReadyMeal?.name,
      hadLeftovers: false,
      owner,
    };

    try {
      await fetch("/api/notion/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
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

  const handleAddBulkSupplies = async (inputs: AddSupplyInput[]) => {
    if (!inputs.length) return;
    let nextCatalogue = { ...catalogue };
    const now = Date.now();
    const newIngredients: Ingredient[] = [];
    const newReadyMeals: ReadyMeal[] = [];

    inputs.forEach((input, index) => {
      const supplyOwner = input.owner || owner;
      if (input.kind === "ingredient") {
        newIngredients.push({
          id: `ing-${now}-${index}`,
          name: input.name,
          mealTypes: input.mealTypes,
          role: input.role || "Main",
          owner: supplyOwner,
          available: true,
        });
      } else {
        newReadyMeals.push({
          id: `ready-${now}-${index}`,
          name: input.name,
          mealTypes: input.mealTypes,
          owner: supplyOwner,
          available: true,
        });
      }
    });

    if (newIngredients.length) {
      nextCatalogue = { ...nextCatalogue, ingredients: [...newIngredients, ...nextCatalogue.ingredients] };
    }
    if (newReadyMeals.length) {
      nextCatalogue = { ...nextCatalogue, readyMeals: [...newReadyMeals, ...nextCatalogue.readyMeals] };
    }

    setCatalogue(nextCatalogue);
    saveCachedCatalogue(nextCatalogue, owner);

    await Promise.allSettled(
      inputs.map((inp) => {
        const supplyInput = { ...inp, owner: inp.owner || owner };
        return fetch("/api/notion/supplies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(supplyInput),
        }).catch(() => {
          queueOfflineMutation("supplies", supplyInput);
        });
      })
    );
  };

  const handleAddSupply = async (input: AddSupplyInput) => {
    return handleAddBulkSupplies([input]);
  };

  const handleToggleAvailability = async (
    id: string,
    kind: "ingredient" | "ready_meal",
    available: boolean
  ) => {
    const nextCatalogue = {
      ...catalogue,
      ingredients:
        kind === "ingredient"
          ? catalogue.ingredients.map((i) => (i.id === id ? { ...i, available } : i))
          : catalogue.ingredients,
      readyMeals:
        kind === "ready_meal"
          ? catalogue.readyMeals.map((m) => (m.id === id ? { ...m, available } : m))
          : catalogue.readyMeals,
    };
    setCatalogue(nextCatalogue);
    saveCachedCatalogue(nextCatalogue, owner);

    try {
      await fetch("/api/notion/supplies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, available }),
      });
    } catch {
      // offline mutation recorded
    }
  };

  const handleDeleteSupply = async (
    id: string,
    kind: "ingredient" | "ready_meal"
  ) => {
    const nextCatalogue = {
      ...catalogue,
      ingredients:
        kind === "ingredient"
          ? catalogue.ingredients.filter((i) => i.id !== id)
          : catalogue.ingredients,
      readyMeals:
        kind === "ready_meal"
          ? catalogue.readyMeals.filter((m) => m.id !== id)
          : catalogue.readyMeals,
    };
    setCatalogue(nextCatalogue);
    saveCachedCatalogue(nextCatalogue, owner);

    try {
      await fetch(`/api/notion/supplies?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      // offline deletion recorded
    }
  };

  return {
    catalogue,
    isClientReady,
    isSettingsOpen,
    setIsSettingsOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    isAddSupplyOpen,
    setIsAddSupplyOpen,
    mealType,
    currentStep,
    setCurrentStep,
    selectedSource,
    selectedReadyMeal,
    selectedMain,
    selectedProtein,
    selectedSupplementary,
    pairingResult,
    isLeftoverModalOpen,
    setIsLeftoverModalOpen,
    isLogging,
    availableReadyMeals,
    availableMains,
    totalAvailableInMealType,
    handleRefreshCatalogue,
    handleResetSeedData,
    handleResetToHome,
    handleSelectMealType,
    handleSelectReadyMeal,
    handleBypassReadyMeal,
    handleSuggestForMe,
    handleManualPickMode,
    handleSelectMain,
    handleConfirmCombo,
    handleConfirmAndLog,
    handleSubmitLeftoverDecision,
    handleQuickAddStaples,
    handleAddSupply,
    handleAddBulkSupplies,
    handleToggleAvailability,
    handleDeleteSupply,
  };
}

