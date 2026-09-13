import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  DEFAULT_NOTIFICATION_CONFIG,
  getNotificationKey,
  getReminderMessage,
  getStoredNotificationConfig,
  saveNotificationConfig,
  sendTestNudge,
  checkAndDispatchScheduledReminders,
} from "../lib/notifications";

function createStorageMock() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
}

describe("Notifications System & Scheduler", () => {
  const localMock = createStorageMock();
  const sessionMock = createStorageMock();

  beforeEach(() => {
    localMock.clear();
    sessionMock.clear();
    vi.stubGlobal("localStorage", localMock);
    vi.stubGlobal("sessionStorage", sessionMock);
    vi.stubGlobal("window", globalThis);
    vi.restoreAllMocks();
  });

  describe("Keys and Storage", () => {
    it("generates correct storage key based on owner", () => {
      expect(getNotificationKey()).toBe("meal_notifications_v1");
      expect(getNotificationKey("Esther")).toBe("meal_notifications_esther_v1");
      expect(getNotificationKey("  John  ")).toBe("meal_notifications_john_v1");
    });

    it("returns default config when storage is empty", () => {
      const config = getStoredNotificationConfig("Esther");
      expect(config.enabled).toBe(false);
      expect(config.breakfastTime).toBe("08:30");
      expect(config.lunchTime).toBe("13:00");
      expect(config.snackTime).toBe("16:30");
      expect(config.dinnerTime).toBe("19:30");
    });

    it("persists and reloads modified config", () => {
      const custom = {
        ...DEFAULT_NOTIFICATION_CONFIG,
        enabled: true,
        lunchTime: "12:15",
        dinnerTime: "20:00",
      };
      saveNotificationConfig(custom, "Esther");

      const loaded = getStoredNotificationConfig("Esther");
      expect(loaded.enabled).toBe(true);
      expect(loaded.lunchTime).toBe("12:15");
      expect(loaded.dinnerTime).toBe("20:00");
    });
  });

  describe("Reminder Messages", () => {
    it("generates appropriate messages for all meal types", () => {
      const b = getReminderMessage("Breakfast", undefined, "Esther");
      expect(b.title).toContain("Good Morning, Esther");
      expect(b.body).toContain("warm");

      const l = getReminderMessage("Lunch", undefined, "Esther");
      expect(l.title).toContain("Lunchtime, Esther");
      expect(l.body).toContain("10 minutes");

      const s = getReminderMessage("Snack");
      expect(s.title).toContain("Craving");

      const d = getReminderMessage("Dinner", undefined, "Esther");
      expect(d.title).toContain("Dinner Comfort, Esther");
    });

    it("attaches smart missing item nudge when ingredients are out of stock", () => {
      const msg = getReminderMessage("Lunch", ["Fresh Tomatoes", "Scotch Bonnet"], "Esther");
      expect(msg.body).toContain("Restock note: Pick up Fresh Tomatoes");
    });
  });

  describe("Runtime Scheduler Guard Rails", () => {
    it("safely handles environments without browser Notification API", () => {
      const result = checkAndDispatchScheduledReminders("Esther");
      expect(result.dispatched).toBe(false);
    });

    it("safely returns false for sendTestNudge when Notification API is absent", () => {
      const result = sendTestNudge(true, "Apples", "Esther");
      expect(result).toBe(false);
    });

    it("prevents duplicate notifications within the same day", () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hh}:${mm}`;

      // Mock Notification with granted permission
      class MockNotification {
        static permission = "granted";
        constructor(public title: string, public options?: NotificationOptions) {}
      }
      vi.stubGlobal("Notification", MockNotification);

      // Configure a matching time
      saveNotificationConfig(
        {
          ...DEFAULT_NOTIFICATION_CONFIG,
          enabled: true,
          lunchTime: currentTime,
        },
        "Esther"
      );

      // First dispatch should succeed
      const first = checkAndDispatchScheduledReminders("Esther");
      expect(first.dispatched).toBe(true);
      expect(first.window).toBe("lunch");

      // Second check in the same day window must not dispatch again
      const second = checkAndDispatchScheduledReminders("Esther");
      expect(second.dispatched).toBe(false);
    });
  });
});
