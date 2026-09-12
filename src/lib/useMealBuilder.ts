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

export function useMealBuilder() {
  const [catalogue, setCatalogue] = useState<KitchenCatalogue>(SEED_CATALOGUE);
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
    const cached = loadCachedCatalogue();
    setCatalogue(cached);
    setIsClientReady(true);

    fetch("/api/notion/catalogue")
      .then((res) => (res.ok ? res.json() : null))
      .then((freshCatalogue: KitchenCatalogue | null) => {
        if (freshCatalogue) {
          setCatalogue(freshCatalogue);
          saveCachedCatalogue(freshCatalogue);
        }
      })
      .catch((err) => {
        console.log("Using cached catalogue snapshot:", err);
      });
  }, []);

  const availableReadyMeals = getAvailableReadyMeals(catalogue.readyMeals, mealType);
  const availableMains = getAvailableMains(catalogue.ingredients, mealType);
  const totalAvailableInMealType =
    availableReadyMeals.length +
    catalogue.ingredients.filter((i) => i.available && i.mealTypes.includes(mealType)).length;

  const handleRefreshCatalogue = async () => {
    try {
      const res = await fetch("/api/notion/catalogue");
      if (res.ok) {
        const fresh: KitchenCatalogue = await res.json();
        setCatalogue(fresh);
        saveCachedCatalogue(fresh);
      }
    } catch (e) {
      console.error("Refresh failed:", e);
    }
  };

  const handleResetSeedData = () => {
    setCatalogue(SEED_CATALOGUE);
    saveCachedCatalogue(SEED_CATALOGUE);
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
      mainIngredient: selectedMain?.name,
      protein: selectedProtein?.name,
      supplementary: selectedSupplementary?.name,
      readyMeal: selectedReadyMeal?.name,
      hadLeftovers: false,
      owner: "Esther",
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
    const updated = applyOptimisticLeftover(catalogue, decision);
    setCatalogue(updated);

    try {
      await fetch("/api/notion/leftovers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(decision),
      });
    } catch {
      queueOfflineMutation("leftovers", decision);
    }
  };

  const handleQuickAddStaples = (staples: Ingredient[]) => {
    const nextIngredients = [...catalogue.ingredients];
    for (const staple of staples) {
      const idx = nextIngredients.findIndex(
        (i) => i.name.toLowerCase() === staple.name.toLowerCase()
      );
      if (idx >= 0) {
        nextIngredients[idx] = { ...nextIngredients[idx], available: true };
      } else {
        nextIngredients.push(staple);
      }
    }
    const nextCatalogue = { ...catalogue, ingredients: nextIngredients };
    setCatalogue(nextCatalogue);
    saveCachedCatalogue(nextCatalogue);
    setCurrentStep("meal_type");
  };

  const handleAddSupply = async (input: AddSupplyInput) => {
    let nextCatalogue = { ...catalogue };

    if (input.kind === "ingredient") {
      const newIng: Ingredient = {
        id: `ing-${Date.now()}`,
        name: input.name,
        mealTypes: input.mealTypes,
        role: input.role || "Main",
        owner: "Esther",
        available: true,
      };
      nextCatalogue = {
        ...nextCatalogue,
        ingredients: [newIng, ...nextCatalogue.ingredients],
      };
    } else {
      const newReady: ReadyMeal = {
        id: `ready-${Date.now()}`,
        name: input.name,
        mealTypes: input.mealTypes,
        owner: "Esther",
        available: true,
      };
      nextCatalogue = {
        ...nextCatalogue,
        readyMeals: [newReady, ...nextCatalogue.readyMeals],
      };
    }

    setCatalogue(nextCatalogue);
    saveCachedCatalogue(nextCatalogue);

    try {
      await fetch("/api/notion/supplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
    } catch {
      queueOfflineMutation("supplies", input);
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
  };
}

