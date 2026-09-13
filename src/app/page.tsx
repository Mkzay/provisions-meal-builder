"use client";

import { AddSupplyModal } from "@/components/AddSupplyModal";
import { AppHeader } from "@/components/AppHeader";
import {
  AppWalkthroughModal,
  WALKTHROUGH_STORAGE_KEY,
} from "@/components/AppWalkthroughModal";
import { CompanionNoteCard } from "@/components/CompanionNoteCard";
import { CulinaryCompanion } from "@/components/CulinaryCompanion";
import { FoodIdeasModal } from "@/components/FoodIdeasModal";
import { GentleSafetyNet } from "@/components/GentleSafetyNet";
import { ArrowLeft } from "@/components/icons";
import { KitchenInventoryModal } from "@/components/KitchenInventoryModal";
import { KitchenSidebar } from "@/components/KitchenSidebar";
import { LeftoverModal } from "@/components/LeftoverModal";
import { MainIngredientGrid } from "@/components/MainIngredientGrid";
import { MealConfirmation } from "@/components/MealConfirmation";
import { MealTypeSelector } from "@/components/MealTypeSelector";
import { ModeSelect } from "@/components/ModeSelect";
import { NotificationModal } from "@/components/NotificationModal";
import { PairingCustomizer } from "@/components/PairingCustomizer";
import { PantryStatCard } from "@/components/PantryStatCard";
import {
  PersonalHubModal,
  PersonalHubTab,
} from "@/components/PersonalHubModal";
import { ProfileOnboardingBanner } from "@/components/ProfileOnboardingBanner";
import { PulsingLogoLoader } from "@/components/PulsingLogoLoader";
import { ReadyMealHero } from "@/components/ReadyMealHero";
import {
  fetchClientProfile,
  hasProfilePromptBeenDismissed,
} from "@/lib/profile-storage";
import { useMealBuilder } from "@/lib/useMealBuilder";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function MealBuilderPage() {
  const { data: session, status } = useSession();
  const owner = session?.user?.ownerName || session?.user?.name || "Esther";

  const [isPersonalHubOpen, setIsPersonalHubOpen] = useState(false);
  const [personalHubTab, setPersonalHubTab] = useState<PersonalHubTab>("profile");
  const [isFoodIdeasOpen, setIsFoodIdeasOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isPromptDismissed, setIsPromptDismissed] = useState<boolean>(() =>
    hasProfilePromptBeenDismissed()
  );
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(WALKTHROUGH_STORAGE_KEY);
      if (!seen) {
        setIsWalkthroughOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchClientProfile(owner).then((p) => {
      setHasProfile(!!p);
    });
  }, [owner]);

  const handleOpenPersonalHub = (tab: PersonalHubTab = "profile") => {
    setPersonalHubTab(tab);
    setIsPersonalHubOpen(true);
  };
  const {
    catalogue, isClientReady, isNotificationOpen, setIsNotificationOpen,
    isAddSupplyOpen, setIsAddSupplyOpen, mealType, currentStep, setCurrentStep,
    selectedSource, selectedReadyMeal, selectedMain, selectedProtein,
    selectedSupplementary, selectedSupplementaries, pairingResult,
    isLeftoverModalOpen, setIsLeftoverModalOpen, isLogging,
    availableReadyMeals, availableMains, totalAvailableInMealType,
    handleRefreshCatalogue, handleResetSeedData, handleResetToHome,
    handleSelectMealType, handleSelectReadyMeal, handleBypassReadyMeal,
    handleSuggestForMe, handleManualPickMode, handleSelectMain,
    handleConfirmCombo, handleConfirmAndLog, handleSubmitLeftoverDecision,
    handleQuickAddStaples, handleAddSupply, handleAddBulkSupplies,
    handleToggleAvailability, handleDeleteSupply,
  } = useMealBuilder(owner);

  const [isStaplesDrawerOpen, setIsStaplesDrawerOpen] = useState(false);

  if (!isClientReady || status === "loading") {
    return (
      <PulsingLogoLoader
        label="Opening your kitchen..."
        sublabel="Checking in-stock ingredients & pantry staples"
      />
    );
  }

  return (
    <div className="min-h-full flex flex-col justify-between">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Top Header */}
        <AppHeader
          owner={owner}
          isCachedFallback={catalogue.isCachedFallback}
          onResetToHome={handleResetToHome}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenAddSupply={() => setIsAddSupplyOpen(true)}
          onOpenPersonalHub={handleOpenPersonalHub}
          onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        />

        {/* Soft, non-blocking onboarding banner when no profile has been saved yet */}
        {currentStep === "meal_type" && !hasProfile && !isPromptDismissed && (
          <ProfileOnboardingBanner
            owner={owner}
            onOpenProfile={() => handleOpenPersonalHub("profile")}
          />
        )}

        {/* Mobile & iPad Pantry Stat Card (Only shown during initial Meal Selection) */}
        {currentStep === "meal_type" && (
          <div className="lg:hidden mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-stone-900/10">
            <PantryStatCard
              readyMealsCount={availableReadyMeals.length}
              ingredientsCount={catalogue.ingredients.filter((i) => i.available).length}
              isCachedFallback={catalogue.isCachedFallback}
              onOpenAddSupply={() => setIsAddSupplyOpen(true)}
              onOpenInventory={() => setIsInventoryOpen(true)}
            />
          </div>
        )}

        {/* Desktop Responsive Workspace: Sidebar + Center Builder + Right Companion */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mt-2">
          {/* Left Desktop Sidebar: Pantry & Fridge Reserves */}
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
            />
          </div>

          {/* Main Stage: Interactive Decision Orchestrator (Expansive Breathing Room) */}
          <main className="flex-1 w-full min-w-0 max-w-3xl lg:max-w-4xl mx-auto">
            {/* Mobile / Tablet Cozy Companion Note */}
            <div className="block xl:hidden mb-4">
              <CompanionNoteCard
                mealType={mealType}
                owner={owner}
                isDismissible={true}
              />
            </div>

            {/* Global Step Back Navigation (Always available after selecting a meal type) */}
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
                <motion.div
                  key="empty-safety"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <GentleSafetyNet
                    owner={owner}
                    onQuickAddStaples={handleQuickAddStaples}
                  />
                </motion.div>
              ) : currentStep === "meal_type" ? (
                <motion.div
                  key="step-meal-type"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <MealTypeSelector
                    selectedType={mealType}
                    onSelect={handleSelectMealType}
                  />
                </motion.div>
              ) : currentStep === "ready_meal" ? (
                <motion.div
                  key="step-ready-meal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ReadyMealHero
                    readyMeals={availableReadyMeals}
                    mealType={mealType}
                    onSelectReadyMeal={handleSelectReadyMeal}
                    onBypassToBuild={handleBypassReadyMeal}
                  />
                </motion.div>
              ) : currentStep === "mode_select" ? (
                <motion.div
                  key="step-mode-select"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
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
        onSubmitDecision={handleSubmitLeftoverDecision}
        onClose={() => {
          setIsLeftoverModalOpen(false);
          handleResetToHome();
        }}
      />

      {/* Meal Notification Reminders Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        owner={owner}
      />

      {/* In-App Supplies Restock Modal */}
      <AddSupplyModal
        isOpen={isAddSupplyOpen}
        onClose={() => setIsAddSupplyOpen(false)}
        onAddSupply={handleAddSupply}
        onAddBulkSupplies={handleAddBulkSupplies}
        onOpenFoodIdeas={() => setIsFoodIdeasOpen(true)}
        owner={owner}
      />

      {/* Food Ideas & Inspiration Catalogue Modal */}
      <FoodIdeasModal
        isOpen={isFoodIdeasOpen}
        onClose={() => setIsFoodIdeasOpen(false)}
        onAddSupply={handleAddSupply}
        ingredients={catalogue.ingredients}
        readyMeals={catalogue.readyMeals}
        owner={owner}
      />

      {/* Kitchen Stock & Inventory Modal */}
      <KitchenInventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        ingredients={catalogue.ingredients}
        readyMeals={catalogue.readyMeals}
        onToggleAvailability={handleToggleAvailability}
        onDeleteSupply={handleDeleteSupply}
        onOpenAddSupply={() => setIsAddSupplyOpen(true)}
        onOpenFoodIdeas={() => setIsFoodIdeasOpen(true)}
        owner={owner}
      />

      {/* Personal Hub: Eating Goal & Weight Progress Log */}
      <PersonalHubModal
        isOpen={isPersonalHubOpen}
        initialTab={personalHubTab}
        owner={owner}
        onClose={() => setIsPersonalHubOpen(false)}
        onProfileSaved={() => setHasProfile(true)}
      />

      {/* First-Time User Onboarding Walkthrough */}
      <AppWalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        owner={owner}
      />
    </div>
  );
}

