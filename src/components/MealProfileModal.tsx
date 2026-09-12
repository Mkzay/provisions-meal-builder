"use client";

import { PersonalHubModal } from "./PersonalHubModal";
import { MealProfile } from "@/lib/types";
import React from "react";

interface MealProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProgressLog?: () => void;
  onProfileSaved?: (profile: MealProfile) => void;
}

export const MealProfileModal: React.FC<MealProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileSaved,
}) => {
  return (
    <PersonalHubModal
      isOpen={isOpen}
      initialTab="profile"
      onClose={onClose}
      onProfileSaved={onProfileSaved}
    />
  );
};
