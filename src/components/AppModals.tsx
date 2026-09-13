"use client";

import { AddSupplyModal } from "@/components/AddSupplyModal";
import { AppWalkthroughModal } from "@/components/AppWalkthroughModal";
import { FoodIdeasModal } from "@/components/FoodIdeasModal";
import { KitchenInventoryModal } from "@/components/KitchenInventoryModal";
import { PersonalHubModal, PersonalHubTab } from "@/components/PersonalHubModal";
import { SavedRecipesModal } from "@/components/SavedRecipesModal";
import { AddSupplyInput, CreateSavedRecipeInput, KitchenCatalogue, SavedRecipe } from "@/lib/types";
import React from "react";

interface AppModalsProps {
  owner: string;
  catalogue: KitchenCatalogue;
  isAddSupplyOpen: boolean;
  onCloseAddSupply: () => void;
  onAddSupply: (input: AddSupplyInput) => Promise<{ success: boolean; id?: string } | void>;
  onAddBulkSupplies: (inputs: AddSupplyInput[]) => Promise<any>;
  isFoodIdeasOpen: boolean;
  onCloseFoodIdeas: () => void;
  onOpenFoodIdeas: () => void;
  isInventoryOpen: boolean;
  onCloseInventory: () => void;
  onOpenAddSupply: () => void;
  onSeedStarterIngredients?: () => Promise<void> | void;
  onToggleAvailability: (id: string, kind: "ingredient" | "ready_meal", available: boolean) => void;
  onDeleteSupply: (id: string, kind: "ingredient" | "ready_meal", name?: string) => void;
  isPersonalHubOpen: boolean;
  personalHubTab: PersonalHubTab;
  onClosePersonalHub: () => void;
  onProfileSaved: () => void;
  isWalkthroughOpen: boolean;
  onCloseWalkthrough: () => void;
  isSavedRecipesOpen: boolean;
  onCloseSavedRecipes: () => void;
  savedRecipes: SavedRecipe[];
  onCreateRecipe: (input: CreateSavedRecipeInput) => Promise<{ success: boolean; id?: string }>;
  onDeleteRecipe: (id: string) => Promise<{ success: boolean }>;
  onCookRecipe: (recipe: SavedRecipe) => void;
}

export const AppModals: React.FC<AppModalsProps> = ({
  owner,
  catalogue,
  isAddSupplyOpen,
  onCloseAddSupply,
  onAddSupply,
  onAddBulkSupplies,
  isFoodIdeasOpen,
  onCloseFoodIdeas,
  onOpenFoodIdeas,
  isInventoryOpen,
  onCloseInventory,
  onOpenAddSupply,
  onSeedStarterIngredients,
  onToggleAvailability,
  onDeleteSupply,
  isPersonalHubOpen,
  personalHubTab,
  onClosePersonalHub,
  onProfileSaved,
  isWalkthroughOpen,
  onCloseWalkthrough,
  isSavedRecipesOpen,
  onCloseSavedRecipes,
  savedRecipes,
  onCreateRecipe,
  onDeleteRecipe,
  onCookRecipe,
}) => {
  return (
    <>
      <AddSupplyModal
        isOpen={isAddSupplyOpen}
        onClose={onCloseAddSupply}
        onAddSupply={async (input) => { await onAddSupply(input); }}
        onAddBulkSupplies={onAddBulkSupplies}
        onOpenFoodIdeas={onOpenFoodIdeas}
        owner={owner}
      />

      <FoodIdeasModal
        isOpen={isFoodIdeasOpen}
        onClose={onCloseFoodIdeas}
        onAddSupply={async (input) => { await onAddSupply(input); }}
        ingredients={catalogue.ingredients}
        readyMeals={catalogue.readyMeals}
        owner={owner}
      />

      <KitchenInventoryModal
        isOpen={isInventoryOpen}
        onClose={onCloseInventory}
        ingredients={catalogue.ingredients}
        readyMeals={catalogue.readyMeals}
        onToggleAvailability={onToggleAvailability}
        onDeleteSupply={onDeleteSupply}
        onOpenAddSupply={onOpenAddSupply}
        onOpenFoodIdeas={onOpenFoodIdeas}
        onSeedStarterIngredients={onSeedStarterIngredients}
        owner={owner}
      />

      <PersonalHubModal
        isOpen={isPersonalHubOpen}
        initialTab={personalHubTab}
        owner={owner}
        onClose={onClosePersonalHub}
        onProfileSaved={onProfileSaved}
      />

      <AppWalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={onCloseWalkthrough}
        owner={owner}
      />

      <SavedRecipesModal
        isOpen={isSavedRecipesOpen}
        onClose={onCloseSavedRecipes}
        savedRecipes={savedRecipes}
        ingredients={catalogue.ingredients}
        onAddSupply={onAddSupply}
        onCreateRecipe={onCreateRecipe}
        onDeleteRecipe={onDeleteRecipe}
        onCookRecipe={onCookRecipe}
        owner={owner}
      />
    </>
  );
};
