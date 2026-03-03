-- ============================================================
-- Agility Assessment – initial schema
-- Run this in your Supabase SQL Editor (or via supabase db push)
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── assessments ─────────────────────────────────────────────
create table public.assessments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  org_name    text not null,
  assessor    text not null,
  created_at  timestamptz not null default now()
);

-- ── responses ────────────────────────────────────────────────
create table public.responses (
  id             uuid primary key default gen_random_uuid(),
  assessment_id  uuid not null references public.assessments(id) on delete cascade,
  question_id    text not null,  -- matches the static questions.ts id (e.g. 't1', 'a3')
  score          smallint not null check (score between 1 and 5)
);

-- ── problem_register ─────────────────────────────────────────
create table public.problem_register (
  id               uuid primary key default gen_random_uuid(),
  assessment_id    uuid not null references public.assessments(id) on delete cascade,
  category         text not null,
  gap_description  text not null,
  owner            text,
  target_date      date,
  status           text not null default 'Open' check (status in ('Open', 'In Progress', 'Resolved'))
);

-- ── Row Level Security ────────────────────────────────────────
alter table public.assessments     enable row level security;
alter table public.responses       enable row level security;
alter table public.problem_register enable row level security;

-- Users can only see/modify their own assessments
create policy "owner_select" on public.assessments
  for select using (auth.uid() = user_id);
create policy "owner_insert" on public.assessments
  for insert with check (auth.uid() = user_id);
create policy "owner_update" on public.assessments
  for update using (auth.uid() = user_id);
create policy "owner_delete" on public.assessments
  for delete using (auth.uid() = user_id);

-- Responses are visible if the parent assessment belongs to the user
create policy "owner_select" on public.responses
  for select using (
    exists (select 1 from public.assessments a
            where a.id = responses.assessment_id and a.user_id = auth.uid())
  );
create policy "owner_insert" on public.responses
  for insert with check (
    exists (select 1 from public.assessments a
            where a.id = responses.assessment_id and a.user_id = auth.uid())
  );
create policy "owner_delete" on public.responses
  for delete using (
    exists (select 1 from public.assessments a
            where a.id = responses.assessment_id and a.user_id = auth.uid())
  );

-- Same pattern for problem_register
create policy "owner_select" on public.problem_register
  for select using (
    exists (select 1 from public.assessments a
            where a.id = problem_register.assessment_id and a.user_id = auth.uid())
  );
create policy "owner_insert" on public.problem_register
  for insert with check (
    exists (select 1 from public.assessments a
            where a.id = problem_register.assessment_id and a.user_id = auth.uid())
  );
create policy "owner_update" on public.problem_register
  for update using (
    exists (select 1 from public.assessments a
            where a.id = problem_register.assessment_id and a.user_id = auth.uid())
  );
create policy "owner_delete" on public.problem_register
  for delete using (
    exists (select 1 from public.assessments a
            where a.id = problem_register.assessment_id and a.user_id = auth.uid())
  );

-- ── Helpful view (optional) ───────────────────────────────────
-- Returns assessment + flat JSON responses for easy querying
create or replace view public.assessment_with_responses as
  select
    a.id,
    a.user_id,
    a.org_name,
    a.assessor,
    a.created_at,
    json_agg(json_build_object('questionId', r.question_id, 'score', r.score)) as responses
  from public.assessments a
  left join public.responses r on r.assessment_id = a.id
  group by a.id;
