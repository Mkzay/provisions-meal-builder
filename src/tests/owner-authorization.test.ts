import { describe, expect, it } from "vitest";
import { getSessionOwner, pageBelongsToOwner } from "@/lib/owner-authorization";

describe("owner authorization", () => {
  it("accepts only a non-empty owner from the authenticated session", () => {
    expect(getSessionOwner({ user: { ownerName: "Esther" } })).toBe("Esther");
    expect(getSessionOwner({ user: { name: "Fallback Name" } })).toBe("Fallback Name");
    expect(getSessionOwner(null)).toBeNull();
    expect(getSessionOwner({ user: { ownerName: "   " } })).toBeNull();
  });

  it("requires a Notion page owner to exactly match the session owner", () => {
    expect(pageBelongsToOwner("Esther", "Esther")).toBe(true);
    expect(pageBelongsToOwner("Esther", "Mkzay")).toBe(false);
    expect(pageBelongsToOwner("", "Esther")).toBe(false);
  });
});
