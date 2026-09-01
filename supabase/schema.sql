-- Pairlum shared database schema
--
-- Run this once in your Supabase project's SQL editor (Dashboard -> SQL Editor -> New query).
-- It creates the tables that back the shared "couple space" (memories, chapters,
-- letters, reunion plan, etc.), locks every table down with row-level security so
-- only the two paired partners can ever read or write their own space, and adds
-- two RPCs used by the sign-up flow to create/join a couple atomically.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- couples: one row per couple space
-- ---------------------------------------------------------------------------
create table if not exists couples (
  id uuid primary key default gen_random_uuid(),
  name_a text not null default '',
  name_b text not null default '',
  initials text not null default '',
  email_a text not null default '',
  email_b text not null default '',
  avatar_a text default '',
  avatar_b text default '',
  together_since text default '',
  start_date text default '',
  city_a text default '',
  city_b text default '',
  distance text default '',
  flight_duration text default '',
  timezone_diff text default '',
  reunion_distance text default '',
  reunion_date text default '',
  reunion_location text default '',
  reunion_title text default '',
  invite_code text not null unique,
  is_partner_joined boolean not null default false,
  theme text not null default 'rose',
  font_style text not null default 'elegant',
  streak_count int not null default 0,
  streak_days jsonb not null default '[false,false,false,false,false,false,false]',
  last_active_note text default '',
  last_active_time text default '',
  pin text default '',
  drawer_pin text default '',
  is_drawer_unlocked boolean not null default false,
  plan text not null default 'essential',
  wallpaper text,
  cover_photo text default '',
  door_state jsonb not null default '{"isPrepared":false,"isOpened":false,"musicTrack":"","finalMessage":"","coverMemoryId":"","selectedMemoryIds":[]}',
  created_at timestamptz not null default now()
);

-- couple_members: links an auth user to a couple space with a role (A/B).
-- A user can belong to at most one couple; a couple has at most one A and one B.
create table if not exists couple_members (
  couple_id uuid not null references couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('A', 'B')),
  created_at timestamptz not null default now(),
  primary key (couple_id, user_id),
  unique (user_id),
  unique (couple_id, role)
);

create or replace function is_couple_member(p_couple_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from couple_members
    where couple_id = p_couple_id and user_id = auth.uid()
  );
$$;

alter table couples enable row level security;
alter table couple_members enable row level security;

create policy "members can read their couple" on couples
  for select using (is_couple_member(id));

create policy "members can update their couple" on couples
  for update using (is_couple_member(id)) with check (is_couple_member(id));

create policy "members can read their membership rows" on couple_members
  for select using (is_couple_member(couple_id));

-- No direct insert policy on couples/couple_members: pairing goes through the
-- create_couple/join_couple RPCs below so the two rows are created atomically.

-- ---------------------------------------------------------------------------
-- Shared, per-couple content tables. Every one follows the same RLS shape:
-- a member of the couple can select/insert/update/delete rows for that couple.
-- ---------------------------------------------------------------------------

create table if not exists memories (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  title text not null default '',
  caption text default '',
  author text not null check (author in ('A', 'B')),
  author_name text default '',
  kind text not null,
  image_url text,
  video_url text,
  audio_duration text,
  video_duration text,
  date text default '',
  time text default '',
  location text,
  chapter_id uuid,
  is_favorite boolean default false,
  is_private boolean default false,
  reactions jsonb not null default '[]',
  replies jsonb not null default '[]',
  rotation_deg numeric,
  created_at timestamptz not null default now()
);

create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  title text not null default '',
  subtitle text default '',
  cover_image text default '',
  start_date text default '',
  end_date text default '',
  theme text default '',
  spine_color text default '#8E1B1B',
  memory_ids jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists drawer_items (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  category text not null,
  title text not null default '',
  body text default '',
  author text not null check (author in ('A', 'B')),
  author_name text default '',
  condition text,
  unlock_date text,
  is_locked boolean not null default false,
  audio_duration text,
  photo_url text,
  sealed_memories_count int,
  opened_at text,
  created_at timestamptz not null default now()
);

create table if not exists parallel_moments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  date text default '',
  time text default '',
  moment_a jsonb not null default '{}',
  moment_b jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists reunion_stops (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  time text default '',
  title text not null default '',
  description text default '',
  icon_name text default '',
  completed boolean not null default false,
  days_to_go text,
  category text,
  assigned_to text,
  due_date text,
  created_at timestamptz not null default now()
);

create table if not exists shared_goals (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  title text not null default '',
  description text default '',
  current int not null default 0,
  target int not null default 0,
  unit text default '',
  cover text default '',
  created_at timestamptz not null default now()
);

create table if not exists promises (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  author text not null check (author in ('A', 'B')),
  text text not null default '',
  made_on text default '',
  created_at timestamptz not null default now()
);

create table if not exists activity_events (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  time_ago text default '',
  date_group text default 'Today',
  actor text not null check (actor in ('A', 'B')),
  actor_name text default '',
  type text not null,
  title text not null default '',
  subtitle text,
  thumbnail text,
  badge text,
  action_text text,
  action_target text,
  created_at timestamptz not null default now()
);

create table if not exists daily_prompts (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  date text default '',
  question text not null default '',
  answer_a text default '',
  answer_b text default '',
  created_at timestamptz not null default now()
);

do $$
declare
  t text;
begin
  foreach t in array array[
    'memories', 'chapters', 'drawer_items', 'parallel_moments', 'reunion_stops',
    'shared_goals', 'promises', 'activity_events', 'daily_prompts'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format(
      'create policy "couple members can select" on %I for select using (is_couple_member(couple_id));',
      t
    );
    execute format(
      'create policy "couple members can insert" on %I for insert with check (is_couple_member(couple_id));',
      t
    );
    execute format(
      'create policy "couple members can update" on %I for update using (is_couple_member(couple_id)) with check (is_couple_member(couple_id));',
      t
    );
    execute format(
      'create policy "couple members can delete" on %I for delete using (is_couple_member(couple_id));',
      t
    );
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Pairing RPCs: create a couple space (role A) or join one via invite code
-- (role B). SECURITY DEFINER so they can insert into couples/couple_members,
-- which have no direct insert policy for plain clients.
-- ---------------------------------------------------------------------------

create or replace function create_couple(p_name_a text, p_email_a text)
returns couples
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
  v_couple couples;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated.';
  end if;
  if exists (select 1 from couple_members where user_id = auth.uid()) then
    raise exception 'You already belong to a couple space.';
  end if;

  v_code := substr(md5(random()::text || clock_timestamp()::text), 1, 8);

  insert into couples (name_a, email_a, invite_code, initials)
  values (p_name_a, p_email_a, v_code, upper(left(p_name_a, 1)))
  returning * into v_couple;

  insert into couple_members (couple_id, user_id, role)
  values (v_couple.id, auth.uid(), 'A');

  return v_couple;
end;
$$;

create or replace function join_couple(p_invite_code text, p_name_b text, p_email_b text)
returns couples
language plpgsql
security definer
set search_path = public
as $$
declare
  v_couple couples;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated.';
  end if;
  if exists (select 1 from couple_members where user_id = auth.uid()) then
    raise exception 'You already belong to a couple space.';
  end if;

  select * into v_couple from couples where invite_code = p_invite_code;
  if v_couple.id is null then
    raise exception 'Invalid invite code.';
  end if;
  if exists (select 1 from couple_members where couple_id = v_couple.id and role = 'B') then
    raise exception 'This space already has two partners.';
  end if;

  insert into couple_members (couple_id, user_id, role)
  values (v_couple.id, auth.uid(), 'B');

  update couples
  set name_b = p_name_b,
      email_b = p_email_b,
      is_partner_joined = true,
      initials = left(v_couple.name_a, 1) || ' & ' || left(p_name_b, 1)
  where id = v_couple.id
  returning * into v_couple;

  return v_couple;
end;
$$;

grant execute on function create_couple(text, text) to authenticated;
grant execute on function join_couple(text, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Realtime: broadcast row changes so both partners' clients update live.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table
  couples, memories, chapters, drawer_items, parallel_moments,
  reunion_stops, shared_goals, promises, activity_events, daily_prompts;
