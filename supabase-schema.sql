-- ============================================================
--  Anadameth Astronomical Society — Supabase schema
-- ============================================================
--  How to use:
--  1. Open your Supabase project → SQL Editor → "New query"
--  2. Paste the whole contents of this file
--  3. Click "Run"
--  4. Then go to Storage → create a new PUBLIC bucket named "images"
--     (or just run the commented CREATE BUCKET section below from SQL too)
-- ============================================================

-- Single key/value table: one row per collection (events, news, gallery, ...)
create table if not exists public.kv_store (
  key          text primary key,
  value        jsonb not null default '[]'::jsonb,
  updated_at   timestamptz not null default now()
);

-- Trigger to keep updated_at fresh
create or replace function public.kv_store_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists kv_store_updated_at on public.kv_store;
create trigger kv_store_updated_at
before update on public.kv_store
for each row execute function public.kv_store_touch_updated_at();

-- Enable realtime
alter publication supabase_realtime add table public.kv_store;

-- Row Level Security: open read + write for anon (this is a public site with
-- no server-side auth). Upgrade to proper auth later by tightening these
-- policies to `to authenticated` and requiring a logged-in admin role.
alter table public.kv_store enable row level security;

drop policy if exists "kv_store read"   on public.kv_store;
drop policy if exists "kv_store insert" on public.kv_store;
drop policy if exists "kv_store update" on public.kv_store;
drop policy if exists "kv_store delete" on public.kv_store;

create policy "kv_store read"   on public.kv_store for select using (true);
create policy "kv_store insert" on public.kv_store for insert with check (true);
create policy "kv_store update" on public.kv_store for update using (true) with check (true);
create policy "kv_store delete" on public.kv_store for delete using (true);

-- ============================================================
--  Storage bucket for uploaded images
-- ============================================================
-- Easiest path: Supabase dashboard → Storage → New bucket → name "images" → PUBLIC.
-- Or uncomment the block below and run it:
--
-- insert into storage.buckets (id, name, public)
-- values ('images', 'images', true)
-- on conflict (id) do nothing;
--
-- -- Allow anon uploads + reads
-- drop policy if exists "images read"   on storage.objects;
-- drop policy if exists "images insert" on storage.objects;
-- drop policy if exists "images update" on storage.objects;
-- drop policy if exists "images delete" on storage.objects;
--
-- create policy "images read"   on storage.objects for select
--   using (bucket_id = 'images');
-- create policy "images insert" on storage.objects for insert
--   with check (bucket_id = 'images');
-- create policy "images update" on storage.objects for update
--   using (bucket_id = 'images') with check (bucket_id = 'images');
-- create policy "images delete" on storage.objects for delete
--   using (bucket_id = 'images');
