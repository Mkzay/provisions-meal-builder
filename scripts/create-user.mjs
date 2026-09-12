import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

// Load .env if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

function getDatabaseUrl() {
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.POSTGRES_PRISMA_URL) return process.env.POSTGRES_PRISMA_URL;
  if (process.env.POSTGRES_URL_NON_POOLING) return process.env.POSTGRES_URL_NON_POOLING;
  if (process.env.DATABASE_URL_UNPOOLED) return process.env.DATABASE_URL_UNPOOLED;

  for (const [key, value] of Object.entries(process.env)) {
    if (!value) continue;
    if (key.endsWith("_POSTGRES_URL") || key.endsWith("_DATABASE_URL")) {
      return value;
    }
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (!value) continue;
    if (value.startsWith("postgres://") || value.startsWith("postgresql://")) {
      return value;
    }
  }

  return null;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log("Usage: node scripts/create-user.mjs <username> <password> <owner_name>");
    console.log("Example: node scripts/create-user.mjs esther mysecretpassword Esther");
    console.log("Example: node scripts/create-user.mjs mkzay mysecretpassword Mkzay");
    process.exit(1);
  }

  const [username, password, ownerName] = args;

  const url = getDatabaseUrl();
  if (!url) {
    console.error("Error: No Postgres connection URL found in environment or .env file.");
    process.exit(1);
  }

  console.log(`Hashing password with bcrypt for username '${username}'...`);
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  console.log("Connecting to Postgres...");
  const sql = neon(url);

  // Ensure table exists
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  // Upsert user
  const rows = await sql`
    INSERT INTO users (username, password_hash, owner_name)
    VALUES (${username.trim()}, ${passwordHash}, ${ownerName.trim()})
    ON CONFLICT (username) DO UPDATE
    SET password_hash = EXCLUDED.password_hash,
        owner_name = EXCLUDED.owner_name
    RETURNING id, username, owner_name, created_at;
  `;

  console.log("✓ User created/updated successfully:");
  console.log(rows[0]);
}

main().catch((err) => {
  console.error("Failed to create user:", err);
  process.exit(1);
});
