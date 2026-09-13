"use client";

import { AppHeader } from "@/components/AppHeader";
import { AppModals } from "@/components/AppModals";
import { WALKTHROUGH_STORAGE_KEY } from "@/components/AppWalkthroughModal";
import { BottomNavBar, NavTabId } from "@/components/BottomNavBar";
import { CompanionNoteCard } from "@/components/CompanionNoteCard";
import { CulinaryCompanion } from "@/components/CulinaryCompanion";
import { GentleSafetyNet } from "@/components/GentleSafetyNet";
import { ArrowLeft } from "@/components/icons";
import { KitchenSidebar } from "@/components/KitchenSidebar";
import { LeftoverModal } from "@/components/LeftoverModal";
import { MainIngredientGrid } from "@/components/MainIngredientGrid";
import { MealConfirmation } from "@/components/MealConfirmation";
import { MealRatingCard } from "@/components/MealRatingCard";
import { MealTypeSelector } from "@/components/MealTypeSelector";
import { MobileHeader } from "@/components/MobileHeader";
import { ModeSelect } from "@/components/ModeSelect";
import { NotificationModal } from "@/components/NotificationModal";
import { PairingCustomizer } from "@/components/PairingCustomizer";
import { PantryStatCard } from "@/components/PantryStatCard";
import { PersonalHubTab } from "@/components/PersonalHubModal";
import { ProfileOnboardingBanner } from "@/components/ProfileOnboardingBanner";
import { PulsingLogoLoader } from "@/components/PulsingLogoLoader";
import { ReadyMealHero } from "@/components/ReadyMealHero";
import { fetchClientProfile, getClientProfileCached, hasProfilePromptBeenDismissed } from "@/lib/profile-storage";
import { MealProfile } from "@/lib/types";
import { useMealBuilder } from "@/lib/useMealBuilder";
import { useSavedRecipes } from "@/lib/useSavedRecipes";
import { useNotificationRunner } from "@/lib/useNotificationRunner";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function MealBuilderAppPage() {
  const { data: session, status } = useSession();
  const owner = session?.user?.ownerName || session?.user?.name || "Esther";

  const [isPersonalHubOpen, setIsPersonalHubOpen] = useState(false);
  const [personalHubTab, setPersonalHubTab] = useState<PersonalHubTab>("profile");
  const [isFoodIdeasOpen, setIsFoodIdeasOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [clientProfile, setClientProfile] = useState<MealProfile | null>(() => getClientProfileCached(owner));
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isPromptDismissed] = useState<boolean>(() => hasProfilePromptBeenDismissed());
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<NavTabId>("builder");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(WALKTHROUGH_STORAGE_KEY);
      if (!seen) setIsWalkthroughOpen(true);
    }
  }, []);

  useEffect(() => {
    fetchClientProfile(owner).then((p) => {
      setClientProfile(p);
      setHasProfile(!!p);
    });
  }, [owner]);

  const handleOpenPersonalHub = (tab: PersonalHubTab = "profile") => {
    setPersonalHubTab(tab);
    setIsPersonalHubOpen(true);
  };

  const {
    savedRecipes, isOpen: isSavedRecipesOpen, openSavedRecipes, closeSavedRecipes,
    createRecipe, deleteRecipe,
  } = useSavedRecipes();

  const {
    catalogue, isClientReady, isNotificationOpen, setIsNotificationOpen,
    isAddSupplyOpen, setIsAddSupplyOpen, mealType, currentStep, setCurrentStep,
    selectedSource, selectedReadyMeal, selectedMain, selectedProtein,
    selectedSupplementary, selectedSupplementaries, pairingResult,
    isLeftoverModalOpen, setIsLeftoverModalOpen, isLogging,
    availableReadyMeals, availableMains, totalAvailableInMealType,
    handleRefreshCatalogue, handleSeedStarterIngredients, handleResetSeedData, handleResetToHome,
    handleSelectMealType, handleSelectReadyMeal, handleBypassReadyMeal,
    handleSuggestForMe, handleManualPickMode, handleSelectMain,
    handleConfirmCombo, handleConfirmAndLog, handleSubmitLeftoverDecision,
    handleQuickAddStaples, handleAddSupply, handleAddBulkSupplies,
    handleToggleAvailability, handleDeleteSupply, handleCookSavedRecipe,
    isRatingCardOpen, setIsRatingCardOpen, handleRateMeal, handleSkipRating,
  } = useMealBuilder(owner, undefined, savedRecipes);

  const missingIngredientNames = catalogue.ingredients.filter((i) => !i.available).map((i) => i.name);
  useNotificationRunner(owner, missingIngredientNames);

  const [isStaplesDrawerOpen, setIsStaplesDrawerOpen] = useState(false);

  const handleSelectNavTab = (tab: NavTabId) => {
    setActiveNavTab(tab);
    if (tab === "builder") {
      handleResetToHome();
    } else if (tab === "recipes") {
      openSavedRecipes();
    } else if (tab === "pantry") {
      setIsInventoryOpen(true);
    } else if (tab === "hub") {
      handleOpenPersonalHub("profile");
    }
  };

  if (!isClientReady || status === "loading") {
    return <PulsingLogoLoader label="Opening your kitchen..." sublabel="Checking in-stock ingredients & pantry staples" />;
  }

  return (
    <div className="min-h-full flex flex-col justify-between pb-24 sm:pb-0">
      {/* Contextual Mobile Header */}
      <MobileHeader
        owner={owner}
        mealType={mealType}
        onOpenNotification={() => setIsNotificationOpen(true)}
        onOpenProfile={() => handleOpenPersonalHub("profile")}
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6">
        {/* Desktop Header */}
        <div className="hidden sm:block">
          <AppHeader
            owner={owner}
            isCachedFallback={catalogue.isCachedFallback}
            onResetToHome={handleResetToHome}
            onOpenNotifications={() => setIsNotificationOpen(true)}
            onOpenAddSupply={() => setIsAddSupplyOpen(true)}
            onOpenSavedRecipes={openSavedRecipes}
            onOpenPersonalHub={handleOpenPersonalHub}
            onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
          />
        </div>

        {currentStep === "meal_type" && !hasProfile && !isPromptDismissed && (
          <ProfileOnboardingBanner owner={owner} onOpenProfile={() => handleOpenPersonalHub("profile")} />
        )}

        {currentStep === "meal_type" && (
          <div className="lg:hidden mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-stone-900/10">
            <PantryStatCard
              readyMealsCount={availableReadyMeals.length}
              ingredientsCount={catalogue.ingredients.filter((i) => i.available).length}
              isCachedFallback={catalogue.isCachedFallback}
              onOpenAddSupply={() => setIsAddSupplyOpen(true)}
              onOpenInventory={() => setIsInventoryOpen(true)}
              mealsPerDay={clientProfile?.mealsPerDay}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start mt-2">
          <div className="hidden lg:block">
            <KitchenSidebar
              readyMeals={catalogue.readyMeals}
              ingredients={catalogue.ingredients}
              currentMealType={mealType}
              isCachedFallback={catalogue.isCachedFallback}
              onSelectReadyMeal={handleSelectReadyMeal}
              onOpenStaples={() => setIsStaplesDrawerOpen(true)}
              onOpenFoodIdeas={() => setIsFoodIdeasOpen(true)}
              onOpenInventory={() => setIsInventoryOpen(true)}
              onOpenSavedRecipes={openSavedRecipes}
              savedRecipesCount={savedRecipes.length}
              mealsPerDay={clientProfile?.mealsPerDay}
            />
          </div>

          <main className="flex-1 w-full min-w-0 max-w-3xl lg:max-w-4xl mx-auto">
            <div className="block xl:hidden mb-4">
              <CompanionNoteCard mealType={mealType} owner={owner} isDismissible={true} />
            </div>

            {currentStep !== "meal_type" && (
              <div className="mb-4">
                <button
                  onClick={handleResetToHome}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-stone-900 bg-white border-2 border-stone-900 px-3.5 py-2 rounded-xl shadow-brutal-xs hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all"
                  aria-label="Back to meal selection"
                >
                  <ArrowLeft size={15} weight="bold" />
                  <span>Back to Meal Selection ({mealType})</span>
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {totalAvailableInMealType === 0 && currentStep !== "meal_type" ? (
                <motion.div key="empty-safety" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <GentleSafetyNet owner={owner} onQuickAddStaples={handleQuickAddStaples} />
                </motion.div>
              ) : currentStep === "meal_type" ? (
                <motion.div key="step-meal-type" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <MealTypeSelector selectedType={mealType} onSelect={handleSelectMealType} mealsPerDay={clientProfile?.mealsPerDay} />
                </motion.div>
              ) : currentStep === "ready_meal" ? (
                <motion.div key="step-ready-meal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <ReadyMealHero readyMeals={availableReadyMeals} mealType={mealType} onSelectReadyMeal={handleSelectReadyMeal} onBypassToBuild={handleBypassReadyMeal} />
                </motion.div>
              ) : currentStep === "mode_select" ? (
                <motion.div key="step-mode-select" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <ModeSelect
                    onSuggestForMe={handleSuggestForMe}
                    onManualPick={handleManualPickMode}
                    availableMainsCount={availableMains.length}
                  />
                </motion.div>
              ) : currentStep === "manual_pick" ? (
                <motion.div
                  key="step-manual-pick"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <MainIngredientGrid
                    mains={availableMains}
                    onSelectMain={handleSelectMain}
                    onBack={() => setCurrentStep("mode_select")}
                  />
                </motion.div>
              ) : currentStep === "pairing" && selectedMain && pairingResult ? (
                <motion.div
                  key="step-pairing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <PairingCustomizer
                    selectedMain={selectedMain}
                    mealType={mealType}
                    pairingResult={pairingResult}
                    onChangeMain={() => setCurrentStep("manual_pick")}
                    onConfirmCombo={handleConfirmCombo}
                    onQuickRestockUpgrade={(name, role) => {
                      handleAddSupply({
                        name,
                        kind: "ingredient",
                        role,
                        mealTypes: [mealType],
                      });
                    }}
                  />
                </motion.div>
              ) : currentStep === "confirm" ? (
                <motion.div
                  key="step-confirm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <MealConfirmation
                    mealType={mealType}
                    source={selectedSource}
                    readyMeal={selectedReadyMeal}
                    mainIngredient={selectedMain}
                    protein={selectedProtein}
                    supplementary={selectedSupplementary}
                    supplementaries={selectedSupplementaries}
                    onConfirmAndLog={handleConfirmAndLog}
                    onBack={() => {
                      if (selectedSource === "Ready Meal") {
                        setCurrentStep("ready_meal");
                      } else {
                        setCurrentStep("pairing");
                      }
                    }}
                    isLogging={isLogging}
                    owner={owner}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </main>

          {/* Right Desktop Companion: Live Plate & Culinary Notes */}
          <div className="hidden xl:block">
            <CulinaryCompanion
              mealType={mealType}
              source={selectedSource}
              readyMeal={selectedReadyMeal}
              mainIngredient={selectedMain}
              protein={selectedProtein}
              supplementary={selectedSupplementary}
              supplementaries={selectedSupplementaries}
              missingUpgrade={pairingResult?.missingUpgrades?.[0]}
              owner={owner}
            />
          </div>
        </div>
      </div>

      {/* Post-Meal Leftover Modal */}
      <LeftoverModal
        isOpen={isLeftoverModalOpen}
        mealType={mealType}
        source={selectedSource}
        readyMealId={selectedReadyMeal?.id}
        readyMealName={selectedReadyMeal?.name}
        mainIngredient={selectedMain?.name}
        protein={selectedProtein?.name}
        supplementary={selectedSupplementary?.name}
        owner={owner}
        onSubmitDecision={(decision) => {
          handleSubmitLeftoverDecision(decision);
          setIsLeftoverModalOpen(false);
          setIsRatingCardOpen(true);
        }}
        onClose={() => {
          setIsLeftoverModalOpen(false);
          setIsRatingCardOpen(true);
        }}
      />

      {/* Post-Meal 1-Tap Rating Card */}
      <MealRatingCard
        isOpen={isRatingCardOpen}
        mealName={
          selectedSource === "Ready Meal"
            ? selectedReadyMeal?.name
            : [selectedMain?.name, selectedProtein?.name].filter(Boolean).join(" + ")
        }
        onRate={handleRateMeal}
        onSkip={handleSkipRating}
      />

      <NotificationModal isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} owner={owner} />

      <AppModals
        owner={owner}
        catalogue={catalogue}
        isAddSupplyOpen={isAddSupplyOpen}
        onCloseAddSupply={() => setIsAddSupplyOpen(false)}
        onAddSupply={handleAddSupply}
        onAddBulkSupplies={handleAddBulkSupplies}
        isFoodIdeasOpen={isFoodIdeasOpen}
        onCloseFoodIdeas={() => setIsFoodIdeasOpen(false)}
        onOpenFoodIdeas={() => setIsFoodIdeasOpen(true)}
        isInventoryOpen={isInventoryOpen}
        onCloseInventory={() => {
          setIsInventoryOpen(false);
          setActiveNavTab("builder");
        }}
        onOpenAddSupply={() => setIsAddSupplyOpen(true)}
        onSeedStarterIngredients={handleSeedStarterIngredients}
        onToggleAvailability={handleToggleAvailability}
        onDeleteSupply={handleDeleteSupply}
        isPersonalHubOpen={isPersonalHubOpen}
        personalHubTab={personalHubTab}
        onClosePersonalHub={() => {
          setIsPersonalHubOpen(false);
          setActiveNavTab("builder");
        }}
        onProfileSaved={() => {
          setHasProfile(true);
          fetchClientProfile(owner).then((p) => setClientProfile(p));
        }}
        isWalkthroughOpen={isWalkthroughOpen}
        onCloseWalkthrough={() => setIsWalkthroughOpen(false)}
        isSavedRecipesOpen={isSavedRecipesOpen}
        onCloseSavedRecipes={() => {
          closeSavedRecipes();
          setActiveNavTab("builder");
        }}
        savedRecipes={savedRecipes}
        onCreateRecipe={createRecipe}
        onDeleteRecipe={deleteRecipe}
        onCookRecipe={handleCookSavedRecipe}
      />

      {/* Sticky Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeNavTab}
        onSelectTab={handleSelectNavTab}
        savedRecipesCount={savedRecipes.length}
      />
    </div>
  );
}
