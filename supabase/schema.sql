-- Steady: tables + row-level security for readings, targets, and recipes.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query).

create extension if not exists pgcrypto;

-- Readings ------------------------------------------------------------

create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  value integer not null check (value >= 20 and value <= 600),
  meal_type text not null check (meal_type in ('fasting', 'breakfast', 'lunch', 'dinner')),
  taken_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.readings enable row level security;

create policy "readings_select_own" on public.readings
  for select using (auth.uid() = user_id);

create policy "readings_insert_own" on public.readings
  for insert with check (auth.uid() = user_id);

create policy "readings_delete_own" on public.readings
  for delete using (auth.uid() = user_id);

-- Targets, one row per user -------------------------------------------

create table if not exists public.targets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  low integer not null default 70,
  high integer not null default 140,
  updated_at timestamptz not null default now()
);

alter table public.targets enable row level security;

create policy "targets_select_own" on public.targets
  for select using (auth.uid() = user_id);

create policy "targets_insert_own" on public.targets
  for insert with check (auth.uid() = user_id);

create policy "targets_update_own" on public.targets
  for update using (auth.uid() = user_id);

-- Recipes ---------------------------------------------------------------

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  notes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy "recipes_select_own" on public.recipes
  for select using (auth.uid() = user_id);

create policy "recipes_insert_own" on public.recipes
  for insert with check (auth.uid() = user_id);

create policy "recipes_delete_own" on public.recipes
  for delete using (auth.uid() = user_id);
