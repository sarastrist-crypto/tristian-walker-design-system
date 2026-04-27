-- The Quiet Line — reader portal schema
-- Apply: supabase db push (or in SQL editor)

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.readers (
  id                uuid primary key default gen_random_uuid(),
  email             text not null unique,
  city              text,
  source            text not null default 'portal',
  bookfunnel_id     text,
  consent_marketing boolean not null default false,
  created_at        timestamptz not null default now()
);

create table if not exists public.responses (
  id                uuid primary key default gen_random_uuid(),
  reader_email      text references public.readers(email) on delete set null,
  first_name        text not null,
  city              text,
  role_context      text,
  reading_status    text check (reading_status in ('just_started','mid_book','finished','came_back')),
  question_id       text not null,
  response_text     text not null check (length(response_text) between 1 and 4000),
  consent_publish   boolean not null default false,
  approved_for_site boolean not null default false,
  source            text not null default 'portal',
  ip_hash           text,
  created_at        timestamptz not null default now()
);

create index if not exists responses_created_at_idx on public.responses (created_at desc);
create index if not exists responses_approved_idx   on public.responses (approved_for_site) where approved_for_site = true;

create table if not exists public.chapter_reads (
  id                   uuid primary key default gen_random_uuid(),
  session_id           text not null,
  scroll_depth_percent int check (scroll_depth_percent between 0 and 100),
  finished_chapter     boolean not null default false,
  source               text not null default 'portal',
  created_at           timestamptz not null default now()
);

create index if not exists chapter_reads_session_idx on public.chapter_reads (session_id, created_at desc);

-- ─────────────────────────────────────────────────────────────────
-- RLS
-- Anon can INSERT into responses + chapter_reads via Edge Functions
-- using the anon key. Reads are admin-only, gated by JWT email match.
-- The admin email is held in the database setting app.admin_email,
-- set per-environment with:
--   alter database postgres set app.admin_email = 'tristian@example.com';
-- ─────────────────────────────────────────────────────────────────

alter table public.readers       enable row level security;
alter table public.responses     enable row level security;
alter table public.chapter_reads enable row level security;

drop policy if exists "anon insert response" on public.responses;
drop policy if exists "anon insert read"     on public.chapter_reads;
drop policy if exists "admin all readers"    on public.readers;
drop policy if exists "admin all responses"  on public.responses;
drop policy if exists "admin all reads"      on public.chapter_reads;

create policy "anon insert response"
  on public.responses for insert to anon
  with check (true);

create policy "anon insert read"
  on public.chapter_reads for insert to anon
  with check (true);

create policy "admin all readers"
  on public.readers for all to authenticated
  using ((auth.jwt() ->> 'email') = current_setting('app.admin_email', true))
  with check ((auth.jwt() ->> 'email') = current_setting('app.admin_email', true));

create policy "admin all responses"
  on public.responses for all to authenticated
  using ((auth.jwt() ->> 'email') = current_setting('app.admin_email', true))
  with check ((auth.jwt() ->> 'email') = current_setting('app.admin_email', true));

create policy "admin all reads"
  on public.chapter_reads for all to authenticated
  using ((auth.jwt() ->> 'email') = current_setting('app.admin_email', true))
  with check ((auth.jwt() ->> 'email') = current_setting('app.admin_email', true));

-- ─────────────────────────────────────────────────────────────────
-- PUBLIC TESTIMONIALS VIEW
-- Only approved + consented rows. Selectable by anon (read-only).
-- ─────────────────────────────────────────────────────────────────

create or replace view public.public_testimonials as
  select first_name, city, role_context, response_text, created_at
  from public.responses
  where approved_for_site = true and consent_publish = true
  order by created_at desc;

grant select on public.public_testimonials to anon;
