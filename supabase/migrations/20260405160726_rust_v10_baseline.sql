begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  display_name text,
  app_version text not null default 'v10'
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

create index if not exists idx_settings_user_id on public.settings(user_id);
create index if not exists idx_planner_items_user_id on public.planner_items(user_id);
create index if not exists idx_planner_items_day_key on public.planner_items(day_key);
create index if not exists idx_quick_notes_user_id on public.quick_notes(user_id);
create index if not exists idx_journal_entries_user_id on public.journal_entries(user_id);
create index if not exists idx_medication_items_user_id on public.medication_items(user_id);
create index if not exists idx_medication_logs_user_id on public.medication_logs(user_id);
create index if not exists idx_location_entries_user_id on public.location_entries(user_id);
create index if not exists idx_location_photos_user_id on public.location_photos(user_id);

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.planner_items enable row level security;
alter table public.quick_notes enable row level security;
alter table public.journal_entries enable row level security;
alter table public.medication_items enable row level security;
alter table public.medication_logs enable row level security;
alter table public.location_entries enable row level security;
alter table public.location_photos enable row level security;

drop policy if exists "profiles own row" on public.profiles;
create policy "profiles own row" on public.profiles for all to authenticated
using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "settings own rows" on public.settings;
create policy "settings own rows" on public.settings for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "planner own rows" on public.planner_items;
create policy "planner own rows" on public.planner_items for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "notes own rows" on public.quick_notes;
create policy "notes own rows" on public.quick_notes for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "journal own rows" on public.journal_entries;
create policy "journal own rows" on public.journal_entries for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "med items own rows" on public.medication_items;
create policy "med items own rows" on public.medication_items for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "med logs own rows" on public.medication_logs;
create policy "med logs own rows" on public.medication_logs for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "location entries own rows" on public.location_entries;
create policy "location entries own rows" on public.location_entries for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "location photos own rows" on public.location_photos;
create policy "location photos own rows" on public.location_photos for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_settings on public.settings;
create trigger set_updated_at_settings before update on public.settings for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_planner_items on public.planner_items;
create trigger set_updated_at_planner_items before update on public.planner_items for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_quick_notes on public.quick_notes;
create trigger set_updated_at_quick_notes before update on public.quick_notes for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_journal_entries on public.journal_entries;
create trigger set_updated_at_journal_entries before update on public.journal_entries for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_medication_items on public.medication_items;
create trigger set_updated_at_medication_items before update on public.medication_items for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_location_entries on public.location_entries;
create trigger set_updated_at_location_entries before update on public.location_entries for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('rust-photos', 'rust-photos', false)
on conflict (id) do nothing;

drop policy if exists "storage read own photos" on storage.objects;
create policy "storage read own photos" on storage.objects for select to authenticated
using (bucket_id = 'rust-photos' and owner = auth.uid());

drop policy if exists "storage upload own photos" on storage.objects;
create policy "storage upload own photos" on storage.objects for insert to authenticated
with check (bucket_id = 'rust-photos' and owner = auth.uid());

drop policy if exists "storage update own photos" on storage.objects;
create policy "storage update own photos" on storage.objects for update to authenticated
using (bucket_id = 'rust-photos' and owner = auth.uid())
with check (bucket_id = 'rust-photos' and owner = auth.uid());

drop policy if exists "storage delete own photos" on storage.objects;
create policy "storage delete own photos" on storage.objects for delete to authenticated
using (bucket_id = 'rust-photos' and owner = auth.uid());

commit;
