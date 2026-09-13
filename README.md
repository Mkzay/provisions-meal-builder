# Provisions 🥣

> A zero-friction, neo-brutalist meal decision tool that eliminates food fatigue by working directly with what's actually in your kitchen.

---

## The Problem

Deciding what to cook when tired or hungry creates overwhelming decision friction. When that friction hits, it's easy to default to low-nutrient fast foods or skip meals altogether.

**Provisions** removes the cognitive wall. Instead of imposing a rigid diet plan, it operates on whatever ingredients and ready-cooked meals you actually have in stock. It prioritizes ready food, supports both smart auto-suggestions and manual building, handles natural West African & continental culinary pairings, surfaces personal favorite recipes, and feeds leftovers back into the ready-meal pool automatically.

---

## Features

- **Meal Type Selection** — Breakfast, Lunch, Dinner, or Snack with time-of-day awareness and customizable daily meal counts (2, 3, or 4 meals).
- **Saved Recipes with Full CRUD** — Save family and online favorites with multiple proteins and sides. Easily edit recipe names, meal times, bases, and pairings at any time.
- **Dual In-Stock Matching Engine** — Sophisticated dual matching by both database ID and normalized food name (`normalizeFoodName`), ensuring re-stocked or re-added pantry staples immediately satisfy saved recipes without broken links.
- **Interactive Food Staples Catalogue** — Explore 60+ West African and continental pantry ideas categorized by Anchor Bases, Protein Sources, Greens/Sides/Fats, and Ready Meals. Customize recommended meal times (`Breakfast`, `Lunch`, `Dinner`, `Snack`) directly on the idea card before stocking.
- **Live Kitchen Inventory Management** — Full inventory modal with instant 1-tap in-stock/out-of-stock toggling, inline staple/meal editing (edit name, category role, suitable meal times), and one-click starter staples loading.
- **Smart Culinary Companion & Blueprint Pairings** — Automatic dish naming blueprints, nutrient tag curation, and natural pairing suggestions (e.g. Rice → Stew, Bread → Egg + Tea).
- **Rating Feedback Loop** — 1-tap post-meal rating card (Liked, Disliked, Neutral) that adjusts future combo scoring while preserving recipe variety.
- **Post-Meal Leftover Loop** — Cooked meals with leftovers automatically create ready-meal entries; consumed items update stock levels seamlessly.
- **Comprehensive Theme Engine** — Complete neo-brutalist design in **Dark Mode**, **Light Mode**, and **System Mode** with high-contrast borders, custom Phosphor SVG icons, and tactile brutalist shadows.
- **Personal Hub & Weight Tracking** — Set eating goals, height, and track weigh-in progress over time with trend indicators.
- **PWA Auto-Update Lifecycle** — Installable Progressive Web App with service worker caching and instant update banners when a new version is deployed.

---

## Architecture & Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 with custom neo-brutalist utilities |
| Database | [Neon Serverless Postgres](https://neon.tech/) via `@neondatabase/serverless` |
| Authentication | [Auth.js (NextAuth v5)](https://authjs.dev/) with bcrypt and session isolation |
| Fallback Data Layer | [Notion API](https://developers.notion.com/) (optional legacy fallback) |
| Motion | Framer Motion |
| Icons | Phosphor Icons direct SSR imports |
| Testing | Vitest (unit & integration tests) |
| Deployment | Vercel |

---

## Database Architecture (Neon Postgres)

Provisions stores all application state in Neon Serverless Postgres with automatic table provisioning and strict multi-tenant owner isolation:

### 1. `users`
- `id` (VARCHAR PRIMARY KEY), `username` (VARCHAR UNIQUE), `password_hash` (VARCHAR), `owner_name` (VARCHAR), `created_at` (TIMESTAMP)

### 2. `pantry_ingredients`
- `id` (VARCHAR PRIMARY KEY), `name` (VARCHAR), `role` (`Main` | `Protein` | `Supplementary`), `meal_types` (TEXT[]), `available` (BOOLEAN), `owner` (VARCHAR), `created_at` (TIMESTAMP)

### 3. `pantry_ready_meals`
- `id` (VARCHAR PRIMARY KEY), `name` (VARCHAR), `meal_types` (TEXT[]), `available` (BOOLEAN), `owner` (VARCHAR), `created_at` (TIMESTAMP)

### 4. `saved_recipes`
- `id` (VARCHAR PRIMARY KEY), `name` (VARCHAR), `meal_types` (TEXT[]), `main_ingredient_id` (VARCHAR), `main_ingredient_name` (VARCHAR), `protein_ids` (TEXT[]), `protein_names` (TEXT[]), `supplementary_ids` (TEXT[]), `supplementary_names` (TEXT[]), `source_url` (VARCHAR), `owner` (VARCHAR), `created_at` (TIMESTAMP)

### 5. `meal_logs`
- `id` (VARCHAR PRIMARY KEY), `meal_date` (TIMESTAMP), `meal_type` (VARCHAR), `source` (VARCHAR), `dish_name` (VARCHAR), `had_leftovers` (BOOLEAN), `owner` (VARCHAR), `created_at` (TIMESTAMP)

### 6. `meal_profiles` & `progress_logs`
- User eating goals (`Lose weight`, `Gain weight`, `Eat healthier`, `Eat more food generally`), height, and chronological weigh-in records scoped by owner.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x
- Neon Postgres database instance

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```env
# Neon Postgres Database URL (Required)
POSTGRES_URL=postgresql://user:pass@ep-example.neon.tech/neondb?sslmode=require

# NextAuth / Auth.js Secret (Required)
AUTH_SECRET=your_generated_32_char_secret_key

# Optional OpenRouter AI Integration
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free

# Optional Legacy Notion Fallback
NOTION_API_KEY=secret_token
NOTION_INGREDIENTS_DB_ID=...
```

### Database Setup & User Management

Provisions includes automated, idempotent management scripts:

```bash
# Provision all Neon Postgres tables
node scripts/init-db.mjs

# Create an authorized user account:
node scripts/create-user.mjs <username> <password> <owner_name>

# Example:
node scripts/create-user.mjs esther mysecurepassword Esther
```

### Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Running Tests

```bash
npm test
```

### Production Build

```bash
npm run build
npm start
```

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/notion/catalogue` | GET | Fetch pantry ingredients and ready meals for the authenticated user |
| `/api/notion/supplies` | POST, PATCH, DELETE | Add, update (name, role, meal times, availability), or delete pantry items |
| `/api/notion/recipes` | GET, POST, PATCH, DELETE | Full CRUD on personal saved recipes with dual in-stock recognition |
| `/api/notion/log` | POST | Record a completed meal decision |
| `/api/notion/leftovers` | POST | Create ready meals from leftovers and adjust pantry availability |
| `/api/notion/profile` | GET, POST | Retrieve or update user eating profile and goals |
| `/api/notion/progress-log` | GET, POST, DELETE | Fetch, record, or delete weight tracking weigh-ins |
| `/api/curate` | POST | Optional AI culinary notes and combo validation |
| `/api/health` | GET | Service health check |

---

## License

Private. All rights reserved.
