import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFlowingIcons } from "@/components/landing/LandingFlowingIcons";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingInteractiveDemo } from "@/components/landing/LandingInteractiveDemo";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Provisions — Authentic Nigerian Kitchen Intelligence",
  description:
    "Zero-friction pantry pairings and ready-meal decider to beat meal fatigue. Cook what you have with authentic Nigerian culinary blueprints.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 selection:bg-amber-300 selection:text-stone-900">
      <LandingHeader />
      <main className="flex-1 relative overflow-hidden">
        <LandingFlowingIcons />
        <LandingHero />
        <LandingInteractiveDemo />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  );
}
