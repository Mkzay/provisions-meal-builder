import { MealType, NotificationConfig } from "./types";

export const NOTIFICATION_CONFIG_KEY = "meal_notifications_v1";

export function getNotificationKey(owner?: string): string {
  if (!owner) return NOTIFICATION_CONFIG_KEY;
  return `meal_notifications_${owner.toLowerCase().trim()}_v1`;
}

export const DEFAULT_NOTIFICATION_CONFIG: NotificationConfig = {
  enabled: false,
  breakfastTime: "08:30",
  lunchTime: "13:00",
  snackTime: "16:30",
  dinnerTime: "19:30",
  includeGroceryNudges: true,
  groceryReminderTime: "10:30",
  pantryAuditReminder: false,
  pantryAuditFrequency: "weekly",
  pantryAuditDay: "sunday",
  groceryShoppingReminder: false,
  groceryShoppingFrequency: "weekly",
  groceryShoppingDay: "saturday",
};

export function getStoredNotificationConfig(owner?: string): NotificationConfig {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_CONFIG;
  try {
    const key = getNotificationKey(owner);
    let raw = localStorage.getItem(key);
    if (!raw && (!owner || owner.toLowerCase() === "esther")) {
      raw = localStorage.getItem("esther_meal_notifications_v1");
    }
    if (!raw) return DEFAULT_NOTIFICATION_CONFIG;
    return { ...DEFAULT_NOTIFICATION_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_CONFIG;
  }
}

export function saveNotificationConfig(config: NotificationConfig, owner?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = getNotificationKey(owner);
    localStorage.setItem(key, JSON.stringify(config));
  } catch (err) {
    console.error("Failed to persist notification preferences", err);
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (err) {
    console.error("Error requesting notification permission", err);
    return "denied";
  }
}

export function sendBrowserNotification(title: string, body: string, mealType?: MealType | "Grocery"): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  try {
    new Notification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: mealType ? `meal-${mealType.toLowerCase()}` : "meal-reminder",
    });
    return true;
  } catch (err) {
    console.error("Failed to dispatch notification", err);
    return false;
  }
}

export function getReminderMessage(
  mealType: MealType,
  missingItems?: string[],
  owner?: string
): { title: string; body: string } {
  let baseMsg = { title: "", body: "" };
  const ownerSuffix = owner ? `, ${owner}` : "";

  switch (mealType) {
    case "Breakfast":
      baseMsg = {
        title: `☀️ Good Morning${ownerSuffix}!`,
        body: "Start your day with something easy and warm. A quick bite makes all the difference.",
      };
      break;
    case "Lunch":
      baseMsg = {
        title: `🌿 Lunchtime${ownerSuffix}!`,
        body: "Step away from the screen for 10 minutes. Nourish your brain with what's in the kitchen.",
      };
      break;
    case "Snack":
      baseMsg = {
        title: "✨ Craving / Quick Nibble?",
        body: "Feeling a low dip? Grab a fruit bowl, toast with spread, or a quick snack bite.",
      };
      break;
    case "Dinner":
      baseMsg = {
        title: `🌙 Dinner Comfort${ownerSuffix}`,
        body: "Unwind from today. You deserve a comforting, satisfying home-cooked dinner.",
      };
      break;
  }

  if (missingItems && missingItems.length > 0) {
    const topItem = missingItems[0];
    baseMsg.body += ` 🛒 Restock note: Pick up ${topItem} to elevate your next meal!`;
  }

  return baseMsg;
}

export function sendTestNudge(
  includeGroceryNote: boolean = true,
  sampleItem: string = "Crisp Apples",
  owner?: string
): boolean {
  const note = includeGroceryNote ? ` 🛒 Restock note: Pick up ${sampleItem} to elevate your next meal!` : "";
  const ownerSuffix = owner ? `, ${owner}` : "";
  return sendBrowserNotification(
    `🥣 Time to Nourish${ownerSuffix}!`,
    `Take 10 minutes to step away from your desk. Your kitchen has good things waiting for you.${note}`,
    "Lunch"
  );
}

export interface ReminderDispatchResult {
  dispatched: boolean;
  window?: "breakfast" | "lunch" | "snack" | "dinner" | "grocery";
  reason?: string;
}

export function checkAndDispatchScheduledReminders(
  owner?: string,
  missingItems?: string[]
): ReminderDispatchResult {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { dispatched: false, reason: "notifications-unsupported" };
  }
  if (Notification.permission !== "granted") {
    return { dispatched: false, reason: "permission-not-granted" };
  }

  const config = getStoredNotificationConfig(owner);
  if (!config.enabled) {
    return { dispatched: false, reason: "notifications-disabled" };
  }

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const currentTime = `${hh}:${mm}`;
  const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const windows: { key: "breakfast" | "lunch" | "snack" | "dinner"; time: string; mealType: MealType }[] = [
    { key: "breakfast", time: config.breakfastTime, mealType: "Breakfast" },
    { key: "lunch", time: config.lunchTime, mealType: "Lunch" },
    { key: "snack", time: config.snackTime, mealType: "Snack" },
    { key: "dinner", time: config.dinnerTime, mealType: "Dinner" },
  ];

  for (const w of windows) {
    if (currentTime === w.time) {
      const storageKey = `meal_notif_sent_${owner || "default"}_${todayDateStr}_${w.key}`;
      if (!sessionStorage.getItem(storageKey)) {
        const msg = getReminderMessage(w.mealType, missingItems, owner);
        const sent = sendBrowserNotification(msg.title, msg.body, w.mealType);
        if (sent) {
          sessionStorage.setItem(storageKey, "1");
          return { dispatched: true, window: w.key };
        }
      }
    }
  }

  if (config.includeGroceryNudges && config.groceryReminderTime && currentTime === config.groceryReminderTime) {
    const storageKey = `meal_notif_sent_${owner || "default"}_${todayDateStr}_grocery`;
    if (!sessionStorage.getItem(storageKey)) {
      const sampleItem = missingItems && missingItems.length > 0 ? missingItems[0] : "Pantry Staples";
      const sent = sendBrowserNotification(
        `🛒 Restock Note${owner ? `, ${owner}` : ""}!`,
        `Quick check before heading out: check in on ${sampleItem} and update your pantry list!`,
        "Grocery"
      );
      if (sent) {
        sessionStorage.setItem(storageKey, "1");
        return { dispatched: true, window: "grocery" };
      }
    }
  }

  return { dispatched: false, reason: "no-matching-window" };
}
