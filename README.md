# Provisions 🥣

> A zero-friction meal decision tool that eliminates decision fatigue around food by working with what's actually in your kitchen.

---

## The Problem

Deciding what to cook when tired or hungry feels like a mountain. When that friction hits, it's easy to default to instant noodles or skip meals altogether.

**Provisions** removes the cognitive wall. Instead of a rigid diet plan, it works with whatever ingredients and ready-cooked meals you actually have available. It prioritizes ready food, supports both auto-suggestions and manual selection, handles natural culinary pairings, and feeds leftovers back into the ready-meal pool automatically.

---

## Features

- **Meal Type Selection** — Breakfast, Lunch, or Dinner with smart time-of-day awareness
- **Ready Meal Priority** — Pre-cooked food is offered first for zero-effort meals
- **Dual Decision Modes** — Auto-suggest a balanced combination, or manually pick from a thumb-friendly grid
- **Smart Culinary Pairing** — Pre-selects natural pairings (e.g. Rice → Stew, Bread → Egg + Tea) with one-tap swaps
- **Post-Meal Leftover Loop** — Leftovers auto-create ready meal entries; finished meals get cleared automatically
- **Pantry Dashboard** — Real-time kitchen inventory stats synced from Notion
- **Personal Hub** — Set an eating goal and track weight progress over time
- **Configurable Reminders** — Meal notifications, pantry audit reminders, and grocery shopping nudges
- **Gentle Safety Net** — Warm, zero-judgment empty state with quick comfort suggestions when the kitchen is bare
- **PWA & Mobile-First** — Installable on home screens, standalone display, safe-area compliance, offline resilience

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Authentication | [Auth.js (NextAuth v5)](https://authjs.dev/) with bcrypt |
| Database (Auth) | [Neon Postgres](https://neon.tech/) (`users` table) |
| Database (Meals) | [Notion API](https://developers.notion.com/) (5 databases as backend) |
| Animation | Framer Motion |
| Icons | Phosphor Icons |
| Testing | Vitest |
| Deployment | Vercel |

---

## Notion Database Schema

The app uses three Notion databases as its backend:

### 1. Ingredients Catalogue
| Property | Type | Notes |
|----------|------|-------|
| `Name` | Title | Ingredient name |
| `Meal Type` | Multi-select | `Breakfast`, `Lunch`, `Dinner`, `Snack` |
| `Role` | Select | `Main`, `Protein`, `Supplementary` |
| `Available` | Checkbox | Whether currently in stock |
| `Owner` | Select | Instance owner name |

### 2. Ready Meals
| Property | Type | Notes |
|----------|------|-------|
| `Name` | Title | Meal name |
| `Meal Type` | Multi-select | `Breakfast`, `Lunch`, `Dinner`, `Snack` |
| `Available` | Checkbox | Whether ready to eat |
| `Owner` | Select | Instance owner name |

### 3. Meal Log
| Property | Type | Notes |
|----------|------|-------|
| `Date` | Date | When the meal was eaten |
| `Meal Type` | Select | `Breakfast`, `Lunch`, `Dinner` |
| `Source` | Select | `Ready Meal`, `Built` |
| `Main Ingredient` | Relation | Linked to **Ingredients Catalogue** |
| `Protein` | Relation | Linked to **Ingredients Catalogue** |
| `Supplementary` | Relation | Linked to **Ingredients Catalogue** |
| `Ready Meal` | Relation | Linked to **Ready Meals** |
| `Had Leftovers` | Checkbox | Triggers leftover flow |
| `Owner` | Select | Instance owner name |

### 4. Meal Profile
| Property | Type | Notes |
|----------|------|-------|
| `Name` | Title | e.g. "Esther's Meal Profile" |
| `Owner` | Select | Instance owner name |
| `Goal` | Select | `Lose weight`, `Gain weight`, `Eat healthier`, `Eat more food generally` |
| `Height` | Number | Optional height record in cm (e.g. `168`) |

### 5. Progress Log
| Property | Type | Notes |
|----------|------|-------|
| `Name` | Title | e.g. "58.5 kg - 2026-09-12" |
| `Owner` | Select | Instance owner name |
| `Date` | Date | Date of weigh-in |
| `Weight` | Number | Weight recorded (e.g. `58.5`) |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x
- A [Notion integration](https://www.notion.so/profile/integrations) (optional — app runs on demo data without it)

### Installation

```bash
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Notion Databases
NOTION_API_KEY=secret_your_integration_token
NOTION_INGREDIENTS_DB_ID=your_32_char_database_id
NOTION_READY_MEALS_DB_ID=your_32_char_database_id
NOTION_MEAL_LOG_DB_ID=your_32_char_database_id
NOTION_PROFILE_DB_ID=your_32_char_database_id
NOTION_PROGRESS_LOG_DB_ID=your_32_char_database_id

# Neon Postgres (Auth)
POSTGRES_URL=postgresql://user:pass@ep-example.neon.tech/neondb?sslmode=require

# NextAuth / Auth.js
AUTH_SECRET=your_generated_32_char_secret_key

# Optional AI meal curation (requests send selected ingredient names and meal type)
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

> If omitted, the app runs in offline demo mode with realistic seed data.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Testing

```bash
npm test
```

### Production Build

```bash
npm run build
npm start
```

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel project settings
4. Deploy

Every push to `main` triggers automatic production deployments.

Set `AUTH_SECRET` in every deployed environment; the app intentionally has no fallback. OpenRouter is optional: without its key, meal curation and companion notes use local fallbacks. The built-in curator limiter is per running instance; use a shared rate-limit store before horizontally scaling a production deployment.

### User Management & Multi-Owner Access

Accounts are managed directly by the administrator via the CLI script against Neon Postgres:

```bash
# Initialize users table (idempotent)
node scripts/init-db.mjs

# Create or update an authorized user account:
node scripts/create-user.mjs <username> <password> <owner_name>

# Example:
node scripts/create-user.mjs esther secret123 Esther
node scripts/create-user.mjs mkzay secret456 Mkzay
```

When a user logs in, their authenticated session automatically scopes all meal queries, catalogue items, goals, weight logs, and leftovers to their designated owner identity.

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check with Notion connection status |
| `/api/notion/catalogue` | GET | Fetch ingredients and ready meals |
| `/api/notion/log` | POST | Log a meal decision with linked Relations |
| `/api/notion/leftovers` | POST | Handle post-meal leftover decisions |
| `/api/notion/supplies` | POST | Add new ingredient or ready meal |
| `/api/notion/profile` | GET, POST | Fetch or save eating goal and height in Notion |
| `/api/notion/progress-log` | GET, POST, DELETE | Track, log, or archive weigh-in entries in Notion |
| `/api/curate` | POST | Validate and optionally refine a selected meal with OpenRouter |

---

## License

Private. Not licensed for redistribution.
