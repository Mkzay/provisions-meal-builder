"use client";

import { useSession } from "next-auth/react";

/**
 * Returns the currently authenticated owner's name ("Esther", "Mkzay", etc.)
 * Fallback is provided during loading or if session is absent.
 */
export function useCurrentOwner(fallback: string = "Esther"): string {
  const { data: session } = useSession();
  return session?.user?.ownerName || fallback;
}
