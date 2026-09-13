import bcrypt from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getDatabaseUrl } from "../lib/db";
import { resolveLeftoverAction } from "../lib/flow-logic";
import { getDefaultGoalForOwner } from "../lib/profile-storage";
import { LeftoverDecision } from "../lib/types";

describe("Authentication, Database & Multi-Owner Support", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Database Connection URL Resolution", () => {
    it("resolves direct standard DATABASE_URL", () => {
      delete process.env.POSTGRES_URL;
      process.env.DATABASE_URL = "postgres://default_user:pass@ep-test.neon.tech/neondb";
      expect(getDatabaseUrl()).toBe("postgres://default_user:pass@ep-test.neon.tech/neondb");
    });

    it("resolves custom prefixed Vercel Postgres URLs (e.g. MEAL_BUILDER_POSTGRES_URL)", () => {
      delete process.env.POSTGRES_URL;
      delete process.env.DATABASE_URL;
      delete process.env.POSTGRES_PRISMA_URL;
      delete process.env.POSTGRES_URL_NON_POOLING;
      delete process.env.DATABASE_URL_UNPOOLED;

      process.env.MEAL_BUILDER_POSTGRES_URL = "postgresql://custom_user:pass@ep-custom.neon.tech/db";
      expect(getDatabaseUrl()).toBe("postgresql://custom_user:pass@ep-custom.neon.tech/db");
    });

    it("resolves arbitrary environment variables starting with postgresql://", () => {
      delete process.env.POSTGRES_URL;
      delete process.env.DATABASE_URL;
      delete process.env.POSTGRES_PRISMA_URL;
      delete process.env.POSTGRES_URL_NON_POOLING;
      delete process.env.DATABASE_URL_UNPOOLED;

      process.env.SOME_RANDOM_SECRET_VAR = "postgresql://random_user:pass@neon.tech/randomdb";
      expect(getDatabaseUrl()).toBe("postgresql://random_user:pass@neon.tech/randomdb");
    });

    it("returns null when no connection string is found", () => {
      delete process.env.POSTGRES_URL;
      delete process.env.DATABASE_URL;
      delete process.env.POSTGRES_PRISMA_URL;
      delete process.env.POSTGRES_URL_NON_POOLING;
      delete process.env.DATABASE_URL_UNPOOLED;

      for (const key of Object.keys(process.env)) {
        if (
          key.endsWith("_POSTGRES_URL") ||
          key.endsWith("_DATABASE_URL") ||
          process.env[key]?.startsWith("postgres://") ||
          process.env[key]?.startsWith("postgresql://")
        ) {
          delete process.env[key];
        }
      }

      expect(getDatabaseUrl()).toBeNull();
    });
  });

  describe("Password Hashing & Verification (bcryptjs)", () => {
    it("hashes and verifies passwords correctly", async () => {
      const password = "mySecretPassword123!";
      const hash = await bcrypt.hash(password, 10);

      expect(hash).not.toBe(password);
      expect(await bcrypt.compare(password, hash)).toBe(true);
      expect(await bcrypt.compare("wrongpassword", hash)).toBe(false);
    });
  });

  describe("Owner-Aware Goal Defaults", () => {
    it("defaults to 'Gain weight' for Esther", () => {
      expect(getDefaultGoalForOwner("Esther")).toBe("Gain weight");
      expect(getDefaultGoalForOwner("esther")).toBe("Gain weight");
    });

    it("defaults to 'Eat healthier' for Mkzay and other owners", () => {
      expect(getDefaultGoalForOwner("Mkzay")).toBe("Eat healthier");
      expect(getDefaultGoalForOwner("mkzay")).toBe("Eat healthier");
    });
  });

  describe("Owner-Aware Leftovers Resolution", () => {
    it("attaches the authenticated owner to newly created ready meal leftovers", () => {
      const decision: LeftoverDecision = {
        hadLeftovers: true,
        source: "Built",
        mealType: "Dinner",
        mainIngredient: "Rice",
        protein: "Chicken",
        owner: "Mkzay",
      };

      const result = resolveLeftoverAction(decision);
      expect(result.action).toBe("create_ready");
      expect(result.newReadyMeal?.owner).toBe("Mkzay");
    });
  });

  describe("Auth Secret Fallback", () => {
    it("guarantees a valid secret string even when environment variables are unset", async () => {
      const { authConfig } = await import("../auth.config");
      expect(authConfig.secret).toBeTruthy();
      expect(typeof authConfig.secret).toBe("string");
      expect((authConfig.secret as string).length).toBeGreaterThanOrEqual(32);
    });
  });
});
