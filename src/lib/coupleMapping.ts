// Maps between the `couples` row (+ its two member profiles) that Supabase
// returns and the CoupleProfile shape the UI already expects (src/types.ts).
// A handful of CoupleProfile fields are purely cosmetic/demo (avatars,
// streaks, distance strings) and have no backing column yet — those get a
// stable, deterministic default here rather than a table of their own,
// since nothing reads/writes them from the backend in phase 1.

import { CoupleProfile } from '../types';

export interface CoupleRow {
  id: string;
  name_a: string;
  name_b: string | null;
  invite_code: string;
  together_since: string | null;
  start_date: string | null;
  city_a: string | null;
  city_b: string | null;
  reunion_date: string | null;
  reunion_location: string | null;
  reunion_title: string | null;
  theme: string;
  font_style: string;
  pin: string | null;
  drawer_pin: string | null;
  is_drawer_unlocked: boolean;
  plan: string;
  wallpaper: string | null;
  cover_photo: string | null;
  is_partner_joined: boolean;
}

export interface MemberProfileRow {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/notionists/svg?seed=';
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80';

function initialsOf(nameA: string, nameB: string): string {
  const a = nameA.trim().charAt(0).toUpperCase() || 'A';
  const b = nameB.trim().charAt(0).toUpperCase() || 'B';
  return `${a}${b}`;
}

export function coupleRowToProfile(
  row: CoupleRow,
  memberA: MemberProfileRow | null,
  memberB: MemberProfileRow | null
): CoupleProfile {
  const nameA = memberA?.name || row.name_a || 'Partner A';
  const nameB = memberB?.name || row.name_b || 'Partner B';

  return {
    id: row.id,
    nameA,
    nameB,
    initials: initialsOf(nameA, nameB),
    emailA: memberA?.email || '',
    emailB: memberB?.email || '',
    avatarA: memberA?.avatar_url || `${DEFAULT_AVATAR}${encodeURIComponent(nameA)}`,
    avatarB: memberB?.avatar_url || `${DEFAULT_AVATAR}${encodeURIComponent(nameB)}`,
    togetherSince: row.together_since || '',
    startDate: row.start_date || undefined,
    cityA: row.city_a || undefined,
    cityB: row.city_b || undefined,
    reunionDate: row.reunion_date || '',
    reunionLocation: row.reunion_location || '',
    reunionTitle: row.reunion_title || '',
    inviteCode: row.invite_code,
    isPartnerJoined: row.is_partner_joined,
    theme: (row.theme as CoupleProfile['theme']) || 'rose',
    fontStyle: (row.font_style as CoupleProfile['fontStyle']) || 'elegant',
    streakCount: 0,
    streakDays: [false, false, false, false, false, false, false],
    lastActiveNote: '',
    lastActiveTime: '',
    pin: row.pin || '',
    drawerPin: row.drawer_pin || undefined,
    isDrawerUnlocked: row.is_drawer_unlocked,
    plan: (row.plan as CoupleProfile['plan']) || 'essential',
    wallpaper: row.wallpaper || undefined,
    coverPhoto: row.cover_photo || DEFAULT_COVER,
  };
}

// Inverse-ish: picks the subset of CoupleProfile fields that map to real
// `couples` columns, for use in an `update()` call. Cosmetic-only fields
// (avatars, streaks, initials/emails which live on `profiles`) are dropped.
export function coupleProfileToRowUpdate(updates: Partial<CoupleProfile>) {
  const row: Record<string, unknown> = {};
  if (updates.nameA !== undefined) row.name_a = updates.nameA;
  if (updates.nameB !== undefined) row.name_b = updates.nameB;
  if (updates.togetherSince !== undefined) row.together_since = updates.togetherSince;
  if (updates.startDate !== undefined) row.start_date = updates.startDate;
  if (updates.cityA !== undefined) row.city_a = updates.cityA;
  if (updates.cityB !== undefined) row.city_b = updates.cityB;
  if (updates.reunionDate !== undefined) row.reunion_date = updates.reunionDate;
  if (updates.reunionLocation !== undefined) row.reunion_location = updates.reunionLocation;
  if (updates.reunionTitle !== undefined) row.reunion_title = updates.reunionTitle;
  if (updates.theme !== undefined) row.theme = updates.theme;
  if (updates.fontStyle !== undefined) row.font_style = updates.fontStyle;
  if (updates.pin !== undefined) row.pin = updates.pin;
  if (updates.drawerPin !== undefined) row.drawer_pin = updates.drawerPin;
  if (updates.isDrawerUnlocked !== undefined) row.is_drawer_unlocked = updates.isDrawerUnlocked;
  if (updates.plan !== undefined) row.plan = updates.plan;
  if (updates.wallpaper !== undefined) row.wallpaper = updates.wallpaper;
  if (updates.coverPhoto !== undefined) row.cover_photo = updates.coverPhoto;
  return row;
}
