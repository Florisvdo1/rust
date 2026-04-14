# RUST

**Jouw rust, structuur en balans.**

A premium mobile-first wellness app built with React, TypeScript, and Vite.

## Modules

- **Vandaag** — Daily overview with time-aware greeting and quick actions
- **Planner** — Premium agenda with visual timeline and 60+ activities
- **Onthouden** — Notes with pinning, urgency, categories, and archive
- **Plaatsen** — Object location memory with room categories
- **Dagboek** — Guided journaling with mood/energy/stress tracking
- **Gezondheid** — Supplement/medication tracking, hydration, sleep
- **Ademhaling** — 6 breathing exercises with guided sessions
- **Meer** — Settings, account, accessibility

## Quick Start

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Setup

Run in Supabase SQL editor in order:
1. `supabase/schema.sql`
2. `supabase/rls.sql`
3. `supabase/storage.sql`

## Deploy

Vercel: `vercel --prod`
Netlify: `netlify deploy --prod`

Set env vars in your deployment dashboard.
