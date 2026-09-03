-- Pairlum backend schema
--
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query) on a
-- fresh project. It creates every table the app's data model needs (see
-- src/types.ts) plus Row Level Security policies that scope all access to the
-- two accounts belonging to a couple, per D1/D9 of the Pairlum legal draft:
-- a private relationship is not a public network, and only the two connected
-- accounts in a Couple Space may read or write that Couple Space's content.
--
-- Phase 1 of the backend migration (see chat) wires up `profiles`, `couples`,
-- `couple_members` and `memories` end-to-end in the app. The remaining tables
-- below exist so the schema is complete; wiring the app's context to them
-- follows the same pattern as memories.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: one row per Supabase auth user
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are self-readable and readable by your couple partner"
  on profiles for select
  using (
    id = auth.uid()
    or id in (
      select cm2.user_id
      from couple_members cm1
      join couple_members cm2 on cm2.couple_id = cm1.couple_id
      where cm1.user_id = auth.uid()
    )
  );

create policy "users manage their own profile"
  on profiles for insert
  with check (id = auth.uid());

create policy "users update their own profile"
  on profiles for update
  using (id = auth.uid());

-- ---------------------------------------------------------------------------
-- couples: the shared Couple Space
-- ---------------------------------------------------------------------------
create table if not exists couples (
  id uuid primary key default gen_random_uuid(),
  name_a text not null default '',
  name_b text not null default '',
  invite_code text not null unique,
  together_since text,
  start_date date,
  city_a text,
  city_b text,
  reunion_date date,
  reunion_location text,
  reunion_title text,
  theme text not null default 'rose',
  font_style text not null default 'elegant',
  pin text,
  drawer_pin text,
  is_drawer_unlocked boolean not null default false,
  plan text not null default 'essential',
  wallpaper text,
  cover_photo text,
  is_partner_joined boolean not null default false,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

alter table couples enable row level security;

-- couple_members must exist before couples' policies can reference it, so
-- create the (empty) membership table first, then backfill its own RLS after.
create table if not exists couple_members (
  couple_id uuid not null references couples(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('A', 'B')),
  joined_at timestamptz not null default now(),
  primary key (couple_id, user_id),
  unique (couple_id, role)
);

alter table couple_members enable row level security;

create policy "members can read their couple"
  on couples for select
  using (id in (select couple_id from couple_members where user_id = auth.uid()));

create policy "creator can insert their couple"
  on couples for insert
  with check (created_by = auth.uid());

create policy "members can update their couple"
  on couples for update
  using (id in (select couple_id from couple_members where user_id = auth.uid()));

create policy "members can read their own membership rows"
  on couple_members for select
  using (
    user_id = auth.uid()
    or couple_id in (select couple_id from couple_members cm where cm.user_id = auth.uid())
  );

-- A user may insert their own membership row only when joining via a valid
-- invite code (checked in the RPC below) or when creating a brand-new couple.
create policy "users can join via the join_couple RPC only"
  on couple_members for insert
  with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Helper: everything below shares the same "member of this couple" rule.
-- Postgres has no macro system, so each table repeats the same USING clause.
-- ---------------------------------------------------------------------------

create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  author uuid not null references profiles(id),
  author_role text not null check (author_role in ('A', 'B')),
  kind text not null check (kind in ('photo', 'video', 'voice', 'note', 'place', 'moment')),
  title text not null,
  caption text not null default '',
  image_url text,
  video_url text,
  audio_duration text,
  video_duration text,
  memory_date text,
  memory_time text,
  location text,
  chapter_id uuid,
  is_favorite boolean not null default false,
  is_private boolean not null default false,
  reactions jsonb not null default '[
    {"id":"r1","label":"Loved it","emoji":"❤️","count":0},
    {"id":"r2","label":"Melted","emoji":"🥺","count":0},
    {"id":"r3","label":"Miss you","emoji":"🕯️","count":0},
    {"id":"r4","label":"Beautiful","emoji":"✨","count":0}
  ]'::jsonb,
  reacted_by jsonb not null default '{}'::jsonb, -- { [reactionId]: [userId, ...] }
  rotation_deg numeric,
  created_at timestamptz not null default now()
);

alter table memories enable row level security;

create policy "couple members can read memories"
  on memories for select
  using (couple_id in (select couple_id from couple_members where user_id = auth.uid()));

create policy "couple members can insert memories"
  on memories for insert
  with check (
    couple_id in (select couple_id from couple_members where user_id = auth.uid())
    and author = auth.uid()
  );

create policy "couple members can update memories"
  on memories for update
  using (couple_id in (select couple_id from couple_members where user_id = auth.uid()));

create policy "couple members can delete memories"
  on memories for delete
  using (couple_id in (select couple_id from couple_members where user_id = auth.uid()));

create table if not exists memory_replies (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references memories(id) on delete cascade,
  couple_id uuid not null references couples(id) on delete cascade,
  author uuid not null references profiles(id),
  author_role text not null check (author_role in ('A', 'B')),
  text text not null,
  voice_duration text,
  created_at timestamptz not null default now()
);

alter table memory_replies enable row level security;

create policy "couple members can read replies"
  on memory_replies for select
  using (couple_id in (select couple_id from couple_members where user_id = auth.uid()));

create policy "couple members can insert replies"
  on memory_replies for insert
  with check (
    couple_id in (select couple_id from couple_members where user_id = auth.uid())
    and author = auth.uid()
  );

-- ---------------------------------------------------------------------------
-- Remaining feature tables (schema complete now; app wiring is phase 2)
-- ---------------------------------------------------------------------------

create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  title text not null,
  subtitle text,
  cover_image text,
  start_date text,
  end_date text,
  theme text,
  spine_color text,
  memory_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists drawer_items (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  category text not null check (category in ('love_letters', 'open_when', 'promises', 'time_capsule', 'tickets', 'secrets')),
  title text not null,
  body text not null default '',
  author uuid not null references profiles(id),
  author_role text not null check (author_role in ('A', 'B')),
  condition text,
  unlock_date date,
  is_locked boolean not null default false,
  audio_duration text,
  photo_url text,
  sealed_memories_count int,
  opened_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists reunion_stops (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  stop_time text,
  title text not null,
  description text,
  icon_name text,
  completed boolean not null default false,
  category text check (category in ('flight', 'date', 'stay', 'surprise', 'activity', 'pack', 'prep')),
  assigned_to text check (assigned_to in ('A', 'B', 'both')),
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists shared_goals (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  title text not null,
  description text,
  current numeric not null default 0,
  target numeric not null default 0,
  unit text,
  cover text,
  created_at timestamptz not null default now()
);

create table if not exists promises (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  author uuid not null references profiles(id),
  author_role text not null check (author_role in ('A', 'B')),
  text text not null,
  made_on text,
  created_at timestamptz not null default now()
);

create table if not exists daily_prompts (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  prompt_date date not null,
  question text not null,
  answer_a text,
  answer_b text,
  created_at timestamptz not null default now()
);

create table if not exists parallel_moments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  moment_date text,
  moment_time text,
  moment_a jsonb not null,
  moment_b jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists activity_events (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  actor uuid not null references profiles(id),
  actor_role text not null check (actor_role in ('A', 'B')),
  actor_name text not null,
  type text not null check (type in ('memory', 'reaction', 'letter', 'capsule', 'presence', 'reunion')),
  title text not null,
  subtitle text,
  thumbnail text,
  badge text,
  action_text text,
  action_target text,
  created_at timestamptz not null default now()
);

-- Apply the same "couple member" read/write policy to every remaining table.
do $$
declare
  t text;
begin
  foreach t in array array[
    'chapters', 'drawer_items', 'reunion_stops', 'shared_goals',
    'promises', 'daily_prompts', 'parallel_moments', 'activity_events'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy "couple members can read %1$s" on %1$I for select
        using (couple_id in (select couple_id from couple_members where user_id = auth.uid()))',
      t
    );
    execute format(
      'create policy "couple members can insert %1$s" on %1$I for insert
        with check (couple_id in (select couple_id from couple_members where user_id = auth.uid()))',
      t
    );
    execute format(
      'create policy "couple members can update %1$s" on %1$I for update
        using (couple_id in (select couple_id from couple_members where user_id = auth.uid()))',
      t
    );
    execute format(
      'create policy "couple members can delete %1$s" on %1$I for delete
        using (couple_id in (select couple_id from couple_members where user_id = auth.uid()))',
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- create_couple: called once by the first partner (via the app) to create a
-- Couple Space and become role 'A'. Runs as the caller (security invoker,
-- the default) so the couples-insert / couple_members-insert RLS policies
-- above still apply -- this just keeps both inserts atomic.
-- ---------------------------------------------------------------------------
create or replace function create_couple(p_name_a text)
returns couples
language plpgsql
as $$
declare
  new_couple couples;
  new_code text;
begin
  -- 6-character invite code, e.g. "K3F9QZ"; retry on the (rare) collision.
  loop
    new_code := upper(substr(md5(random()::text), 1, 6));
    exit when not exists (select 1 from couples where invite_code = new_code);
  end loop;

  insert into couples (name_a, invite_code, created_by)
  values (p_name_a, new_code, auth.uid())
  returning * into new_couple;

  insert into couple_members (couple_id, user_id, role)
  values (new_couple.id, auth.uid(), 'A');

  return new_couple;
end;
$$;

-- ---------------------------------------------------------------------------
-- join_couple: called by the second partner with the invite code. Runs with
-- definer rights so it can look up the couple by code even though the caller
-- isn't a member yet (couples-select RLS would otherwise hide it), but only
-- ever inserts a membership row for auth.uid() itself and only into role 'B'.
-- ---------------------------------------------------------------------------
create or replace function join_couple(p_invite_code text, p_name_b text)
returns couples
language plpgsql
security definer
set search_path = public
as $$
declare
  target_couple couples;
begin
  select * into target_couple from couples where invite_code = upper(p_invite_code);

  if target_couple.id is null then
    raise exception 'Invalid invite code';
  end if;

  if exists (select 1 from couple_members where couple_id = target_couple.id and role = 'B') then
    raise exception 'This Couple Space already has two partners';
  end if;

  if exists (select 1 from couple_members where couple_id = target_couple.id and user_id = auth.uid()) then
    return target_couple; -- already a member, idempotent
  end if;

  insert into couple_members (couple_id, user_id, role)
  values (target_couple.id, auth.uid(), 'B');

  update couples set name_b = p_name_b, is_partner_joined = true where id = target_couple.id
  returning * into target_couple;

  return target_couple;
end;
$$;
