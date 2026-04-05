-- RUST v4 baseline Supabase setup
-- Run in Supabase SQL Editor after reviewing.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  display_name text,
  app_version text default 'v4'
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.planner_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  day_key text not null,
  slot_key text not null,
  title text,
  icon_key text,
  duration_minutes integer,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.quick_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text,
  body text,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  entry_date date,
  mood text,
  energy text,
  stress text,
  body text,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.medication_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  dosage text,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.medication_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  medication_item_id uuid references public.medication_items(id) on delete cascade,
  taken_at timestamptz,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.location_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  room text not null,
  subzone text,
  label text,
  notes text,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.location_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  location_entry_id uuid references public.location_entries(id) on delete cascade,
  storage_path text not null,
  payload jsonb not null default '{}'::jsonb
);

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.planner_items enable row level security;
alter table public.quick_notes enable row level security;
alter table public.journal_entries enable row level security;
alter table public.medication_items enable row level security;
alter table public.medication_logs enable row level security;
alter table public.location_entries enable row level security;
alter table public.location_photos enable row level security;

-- Drop/recreate policies safely for repeatable runs.
drop policy if exists "profiles own row" on public.profiles;
drop policy if exists "settings own rows" on public.settings;
drop policy if exists "planner own rows" on public.planner_items;
drop policy if exists "notes own rows" on public.quick_notes;
drop policy if exists "journal own rows" on public.journal_entries;
drop policy if exists "med items own rows" on public.medication_items;
drop policy if exists "med logs own rows" on public.medication_logs;
drop policy if exists "location entries own rows" on public.location_entries;
drop policy if exists "location photos own rows" on public.location_photos;

create policy "profiles own row"
on public.profiles for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "settings own rows"
on public.settings for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "planner own rows"
on public.planner_items for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "notes own rows"
on public.quick_notes for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "journal own rows"
on public.journal_entries for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "med items own rows"
on public.medication_items for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "med logs own rows"
on public.medication_logs for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "location entries own rows"
on public.location_entries for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "location photos own rows"
on public.location_photos for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('rust-photos', 'rust-photos', false)
on conflict (id) do nothing;

drop policy if exists "storage read own photos" on storage.objects;
drop policy if exists "storage upload own photos" on storage.objects;
drop policy if exists "storage update own photos" on storage.objects;
drop policy if exists "storage delete own photos" on storage.objects;

create policy "storage read own photos"
on storage.objects for select
to authenticated
using (bucket_id = 'rust-photos' and owner = auth.uid());

create policy "storage upload own photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'rust-photos' and owner = auth.uid());

create policy "storage update own photos"
on storage.objects for update
to authenticated
using (bucket_id = 'rust-photos' and owner = auth.uid())
with check (bucket_id = 'rust-photos' and owner = auth.uid());

create policy "storage delete own photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'rust-photos' and owner = auth.uid());
