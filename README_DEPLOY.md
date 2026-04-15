# RUST — Deployment Guide

## Local Development

```bash
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

## Supabase Setup

1. Create a new Supabase project at https://app.supabase.com
2. Run SQL files in order in the SQL editor:
   - `supabase/schema.sql` — tables and indexes
   - `supabase/rls.sql` — row level security policies
   - `supabase/storage.sql` — storage buckets
3. Copy Project URL and Anon Key to your .env

## GitHub

```bash
git remote add origin https://github.com/Florisvdo1/rust.git
git push -u origin main
```

## Vercel Deployment

1. Connect GitHub repo at https://vercel.com
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Or deploy via CLI:

```bash
vercel --prod
```

Production domains: rust.mobi / www.rust.mobi

## Netlify Deployment

```bash
npm run build
# Deploy dist/ folder to Netlify
# Or link repo at https://netlify.com
```

Set same environment variables in Netlify dashboard.

## Environment Variables (Vercel/Netlify)

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Never commit real values. Use .env locally.
