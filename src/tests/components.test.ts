import { describe, it } from "vitest";

describe("Component import integrity", () => {
  it("imports AppHeader", async () => {
    await import("../components/AppHeader");
  });

  it("imports ProvisionsLogo", async () => {
    await import("../components/ProvisionsLogo");
  });

  it("imports KitchenSidebar", async () => {
    await import("../components/KitchenSidebar");
  });

  it("imports PantryStatCard", async () => {
    await import("../components/PantryStatCard");
  });

  it("imports CulinaryCompanion", async () => {
    await import("../components/CulinaryCompanion");
  });

  it("imports MealTypeSelector", async () => {
    await import("../components/MealTypeSelector");
  });

  it("imports ReadyMealHero", async () => {
    await import("../components/ReadyMealHero");
  });

  it("imports ModeSelect", async () => {
    await import("../components/ModeSelect");
  });

  it("imports MainIngredientGrid", async () => {
    await import("../components/MainIngredientGrid");
  });

  it("imports PairingCustomizer", async () => {
    await import("../components/PairingCustomizer");
  });

  it("imports MealConfirmation", async () => {
    await import("../components/MealConfirmation");
  });

  it("imports LeftoverModal", async () => {
    await import("../components/LeftoverModal");
  });

  it("imports GentleSafetyNet", async () => {
    await import("../components/GentleSafetyNet");
  });

  it("imports NotionSettingsModal", async () => {
    await import("../components/NotionSettingsModal");
  });

  it("imports NotificationModal", async () => {
    await import("../components/NotificationModal");
  });

  it("imports ReminderPickers", async () => {
    await import("../components/ReminderPickers");
  });

  it("imports AddSupplyModal", async () => {
    await import("../components/AddSupplyModal");
  });

  it("imports AddSupplySingleTab", async () => {
    await import("../components/AddSupplySingleTab");
  });

  it("imports AddSupplyBulkTab", async () => {
    await import("../components/AddSupplyBulkTab");
  });

  it("imports AddSupplyFooter", async () => {
    await import("../components/AddSupplyFooter");
  });

  it("imports CompanionNoteCard", async () => {
    await import("../components/CompanionNoteCard");
  });

  it("imports FoodIdeasModal", async () => {
    await import("../components/FoodIdeasModal");
  });

  it("imports KitchenInventoryModal", async () => {
    await import("../components/KitchenInventoryModal");
  });

  it("imports AppWalkthroughModal", async () => {
    await import("../components/AppWalkthroughModal");
  });

  it("imports MealRatingCard", async () => {
    await import("../components/MealRatingCard");
  });

  it("imports MealProfileModal", async () => {
    await import("../components/MealProfileModal");
  });

  it("imports ProgressLogModal", async () => {
    await import("../components/ProgressLogModal");
  });

  it("imports PersonalHubModal", async () => {
    await import("../components/PersonalHubModal");
  });

  it("imports MealProfileSection", async () => {
    await import("../components/MealProfileSection");
  });

  it("imports ProgressLogSection", async () => {
    await import("../components/ProgressLogSection");
  });

  it("imports ProfileOnboardingBanner", async () => {
    await import("../components/ProfileOnboardingBanner");
  });

  it("imports BottomNavBar", async () => {
    await import("../components/BottomNavBar");
  });

  it("imports MobileHeader", async () => {
    await import("../components/MobileHeader");
  });

  it("imports LandingHeader", async () => {
    await import("../components/landing/LandingHeader");
  });

  it("imports LandingHero", async () => {
    await import("../components/landing/LandingHero");
  });

  it("imports LandingHeroIllustration", async () => {
    await import("../components/landing/LandingHeroIllustration");
  });

  it("imports LandingInteractiveDemo", async () => {
    await import("../components/landing/LandingInteractiveDemo");
  });

  it("imports LandingFeatures", async () => {
    await import("../components/landing/LandingFeatures");
  });

  it("imports LandingFooter", async () => {
    await import("../components/landing/LandingFooter");
  });

  it("imports LandingFlowingIcons", async () => {
    await import("../components/landing/LandingFlowingIcons");
  });

  it("imports LandingPage", async () => {
    await import("../app/page");
  });

  it("imports MealBuilderAppPage", async () => {
    await import("../app/app/page");
  });
});
