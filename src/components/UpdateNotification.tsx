"use client";

import React, { useEffect, useState } from "react";

export const UpdateNotification: React.FC = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let refreshing = false;
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    navigator.serviceWorker.ready
      .then((registration) => {
        // If there is already a waiting worker
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setUpdateAvailable(true);
        }

        // Listen for new updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setUpdateAvailable(true);
            }
          });
        });

        // Periodic check every 15 minutes
        const intervalId = setInterval(() => {
          registration.update().catch(() => {});
        }, 15 * 60 * 1000);

        // Check whenever user focuses the app or switches back to it
        const handleFocus = () => {
          registration.update().catch(() => {});
        };
        window.addEventListener("focus", handleFocus);

        return () => {
          clearInterval(intervalId);
          window.removeEventListener("focus", handleFocus);
        };
      })
      .catch(() => {});

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  if (!updateAvailable || dismissed) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center justify-between gap-3 p-3 bg-stone-900 text-amber-200 border-2 border-stone-900 rounded-2xl shadow-brutal-md"
    >
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-xs font-black tracking-tight text-white">
          New update live!
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleUpdate}
          disabled={isUpdating}
          className="px-3 py-1.5 rounded-xl text-xs font-black bg-amber-300 text-stone-900 border border-stone-900 hover:bg-amber-200 active:scale-95 transition-all shadow-xs"
        >
          {isUpdating ? "Updating..." : "Update Now"}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-white rounded-lg transition-colors text-xs font-bold"
          aria-label="Dismiss update notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
