
-- RUST v7 Supabase baseline
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  display_name text,
  app_version text default 'v7'
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

do $$
declare t text;
begin
  for t in select unnest(array[
    'profiles','settings','planner_items','quick_notes','journal_entries',
    'medication_items','medication_logs','location_entries','location_photos'
  ])
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

drop policy if exists "profiles own row" on public.profiles;
create policy "profiles own row" on public.profiles
for all to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "settings own rows" on public.settings;
create policy "settings own rows" on public.settings
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "planner own rows" on public.planner_items;
create policy "planner own rows" on public.planner_items
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "notes own rows" on public.quick_notes;
create policy "notes own rows" on public.quick_notes
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "journal own rows" on public.journal_entries;
create policy "journal own rows" on public.journal_entries
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "med items own rows" on public.medication_items;
create policy "med items own rows" on public.medication_items
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "med logs own rows" on public.medication_logs;
create policy "med logs own rows" on public.medication_logs
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "location entries own rows" on public.location_entries;
create policy "location entries own rows" on public.location_entries
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "location photos own rows" on public.location_photos;
create policy "location photos own rows" on public.location_photos
for all to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('rust-photos', 'rust-photos', false)
on conflict (id) do nothing;

drop policy if exists "storage read own photos" on storage.objects;
create policy "storage read own photos" on storage.objects
for select to authenticated
using (bucket_id = 'rust-photos' and owner = auth.uid());

drop policy if exists "storage upload own photos" on storage.objects;
create policy "storage upload own photos" on storage.objects
for insert to authenticated
with check (bucket_id = 'rust-photos' and owner = auth.uid());

drop policy if exists "storage update own photos" on storage.objects;
create policy "storage update own photos" on storage.objects
for update to authenticated
using (bucket_id = 'rust-photos' and owner = auth.uid())
with check (bucket_id = 'rust-photos' and owner = auth.uid());

drop policy if exists "storage delete own photos" on storage.objects;
create policy "storage delete own photos" on storage.objects
for delete to authenticated
using (bucket_id = 'rust-photos' and owner = auth.uid());

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at before update on public.settings
for each row execute function public.set_updated_at();

drop trigger if exists set_planner_items_updated_at on public.planner_items;
create trigger set_planner_items_updated_at before update on public.planner_items
for each row execute function public.set_updated_at();

drop trigger if exists set_quick_notes_updated_at on public.quick_notes;
create trigger set_quick_notes_updated_at before update on public.quick_notes
for each row execute function public.set_updated_at();

drop trigger if exists set_journal_entries_updated_at on public.journal_entries;
create trigger set_journal_entries_updated_at before update on public.journal_entries
for each row execute function public.set_updated_at();

drop trigger if exists set_medication_items_updated_at on public.medication_items;
create trigger set_medication_items_updated_at before update on public.medication_items
for each row execute function public.set_updated_at();

drop trigger if exists set_location_entries_updated_at on public.location_entries;
create trigger set_location_entries_updated_at before update on public.location_entries
for each row execute function public.set_updated_at();
