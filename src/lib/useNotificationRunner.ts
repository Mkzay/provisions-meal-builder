"use client";

import { useEffect, useRef } from "react";
import { checkAndDispatchScheduledReminders } from "./notifications";

/**
 * Background notification runner for active web sessions.
 * Checks meal window schedules every 30 seconds and when the tab regains visibility.
 */
export function useNotificationRunner(owner?: string, missingItems?: string[]) {
  const missingItemsRef = useRef(missingItems);
  missingItemsRef.current = missingItems;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check immediately on mount
    checkAndDispatchScheduledReminders(owner, missingItemsRef.current);

    // Periodically evaluate scheduled windows
    const timer = setInterval(() => {
      checkAndDispatchScheduledReminders(owner, missingItemsRef.current);
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAndDispatchScheduledReminders(owner, missingItemsRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [owner]);
}
