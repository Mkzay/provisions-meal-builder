"use client";

import { AddSupplyModal } from "@/components/AddSupplyModal";
import { AppHeader } from "@/components/AppHeader";
import { CompanionNoteCard } from "@/components/CompanionNoteCard";
import { CulinaryCompanion } from "@/components/CulinaryCompanion";
import { FoodIdeasModal } from "@/components/FoodIdeasModal";
import { GentleSafetyNet } from "@/components/GentleSafetyNet";
import { ArrowLeft } from "@/components/icons";
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
  const { data: session } = useSession();
  const owner = session?.user?.ownerName || "Esther";

  const [isPersonalHubOpen, setIsPersonalHubOpen] = useState(false);
  const [personalHubTab, setPersonalHubTab] = useState<PersonalHubTab>("profile");
  const [isFoodIdeasOpen, setIsFoodIdeasOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isPromptDismissed, setIsPromptDismissed] = useState<boolean>(() =>
    hasProfilePromptBeenDismissed()
  );

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
    catalogue,
    isClientReady,
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
  } = useMealBuilder(owner);

  const [isStaplesDrawerOpen, setIsStaplesDrawerOpen] = useState(false);

  if (!isClientReady) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-10 h-10 rounded-full border-3 border-basil-500 border-t-transparent animate-spin" />
      </div>
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
                    onConfirmAndLog={handleConfirmAndLog}
                    onBack={() => {
                      if (selectedSource === "Ready Meal") {
                        setCurrentStep("ready_meal");
                      } else {
                        setCurrentStep("pairing");
                      }
                    }}
                    isLogging={isLogging}
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

      {/* Personal Hub: Eating Goal & Weight Progress Log */}
      <PersonalHubModal
        isOpen={isPersonalHubOpen}
        initialTab={personalHubTab}
        owner={owner}
        onClose={() => setIsPersonalHubOpen(false)}
        onProfileSaved={() => {
          setHasProfile(true);
        }}
      />
    </div>
  );
}

