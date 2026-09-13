import { describe, expect, it } from "vitest";
import { replayOfflineMutations } from "@/lib/offline-storage";

describe("offline mutation replay", () => {
  it("keeps the first failed mutation and later mutations queued in order", async () => {
    const entries = [
      { type: "log", payload: { id: 1 }, timestamp: 1 },
      { type: "supplies", payload: { id: 2 }, timestamp: 2 },
    ];
    const remaining = await replayOfflineMutations(entries, async (entry) => entry.timestamp === 1);
    expect(remaining).toEqual([{ type: "supplies", payload: { id: 2 }, timestamp: 2 }]);
  });
});
