import { describe, expect, it } from "vitest";

describe("UpdateNotification component & auto-update lifecycle", () => {
  it("imports UpdateNotification component without errors", async () => {
    const mod = await import("../components/UpdateNotification");
    expect(mod.UpdateNotification).toBeDefined();
  });
});
