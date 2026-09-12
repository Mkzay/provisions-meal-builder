import { MealType, NotificationConfig } from "./types";

export const NOTIFICATION_CONFIG_KEY = "esther_meal_notifications_v1";

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

export function getStoredNotificationConfig(): NotificationConfig {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_CONFIG;
  try {
    const raw = localStorage.getItem(NOTIFICATION_CONFIG_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_CONFIG;
    return { ...DEFAULT_NOTIFICATION_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_CONFIG;
  }
}

export function saveNotificationConfig(config: NotificationConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATION_CONFIG_KEY, JSON.stringify(config));
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
  missingItems?: string[]
): { title: string; body: string } {
  let baseMsg = { title: "", body: "" };

  switch (mealType) {
    case "Breakfast":
      baseMsg = {
        title: "☀️ Good Morning, Esther!",
        body: "Start your day with something easy and warm. A quick bite makes all the difference.",
      };
      break;
    case "Lunch":
      baseMsg = {
        title: "🌿 Lunchtime, Esther!",
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
        title: "🌙 Dinner Comfort, Esther",
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

export function sendTestNudge(includeGroceryNote: boolean = true, sampleItem: string = "Crisp Apples"): boolean {
  const note = includeGroceryNote ? ` 🛒 Restock note: Pick up ${sampleItem} to elevate your next meal!` : "";
  return sendBrowserNotification(
    "🥣 Time to Nourish, Esther!",
    `Take 10 minutes to step away from your desk. Your kitchen has good things waiting for you.${note}`,
    "Lunch"
  );
}
