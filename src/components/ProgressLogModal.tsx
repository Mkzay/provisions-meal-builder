"use client";

import { PersonalHubModal } from "./PersonalHubModal";
import React from "react";

interface ProgressLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile?: () => void;
}

export const ProgressLogModal: React.FC<ProgressLogModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <PersonalHubModal
      isOpen={isOpen}
      initialTab="progress"
      onClose={onClose}
    />
  );
};
