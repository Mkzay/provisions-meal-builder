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
| Animation | Framer Motion |
| Icons | Phosphor Icons |
| Database | [Notion API](https://developers.notion.com/) (3 databases as backend) |
| Local Storage | Profile, weight log, and notification preferences |
| Testing | Vitest |
| Deployment | Vercel (recommended) |

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
| `Main Ingredient` | Rich text | For built meals |
| `Protein` | Rich text | For built meals |
| `Supplementary` | Rich text | For built meals |
| `Ready Meal` | Rich text | For ready meals |
| `Had Leftovers` | Checkbox | Triggers leftover flow |
| `Owner` | Select | Instance owner name |

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

Fill in your Notion credentials:

```env
NOTION_API_KEY=secret_your_integration_token
NOTION_INGREDIENTS_DB_ID=your_32_char_database_id
NOTION_READY_MEALS_DB_ID=your_32_char_database_id
NOTION_MEAL_LOG_DB_ID=your_32_char_database_id
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

### Multi-Instance Support

Each deployment is a single-owner instance. Set `NEXT_PUBLIC_APP_OWNER` to customize the owner name. Different instances can share the same Notion databases (filtered by the `Owner` property) or use completely separate workspaces.

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check with Notion connection status |
| `/api/notion/catalogue` | GET | Fetch ingredients and ready meals |
| `/api/notion/log` | POST | Log a meal decision |
| `/api/notion/leftovers` | POST | Handle post-meal leftover decisions |
| `/api/notion/supplies` | POST | Add new ingredient or ready meal |

---

## License

Private. Not licensed for redistribution.
