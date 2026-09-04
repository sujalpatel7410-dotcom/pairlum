import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppView,
  UserRole,
  CoupleProfile,
  Memory,
  Chapter,
  DrawerItem,
  ParallelMoment,
  ReunionStop,
  SharedGoal,
  PromiseItem,
  ActivityEvent,
  MemoryKind,
  DailyPrompt
} from '../types';
import confetti from 'canvas-confetti';
import { sendN8nEvent } from '../lib/n8n';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { getTodayDateKey, pickQuestionForDate } from '../lib/dailyPrompts';

// ---------------------------------------------------------------------------
// Row <-> app-type mapping. The DB uses snake_case columns; jsonb columns
// (reactions, replies, moment_a/b, streak_days, door_state, memory_ids) store
// their content in the same camelCase shape the app already uses, so those
// pass through unchanged.
// ---------------------------------------------------------------------------

const whenLabel = (iso: string): string => {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface DoorState {
  isPrepared: boolean;
  isOpened: boolean;
  musicTrack: string;
  finalMessage: string;
  coverMemoryId: string;
  selectedMemoryIds: string[];
  reaction?: {
    feeling: string;
    message: string;
    voiceDuration?: string;
    privateNote?: string;
  };
}

const DEFAULT_DOOR_STATE: DoorState = {
  isPrepared: false,
  isOpened: false,
  musicTrack: '',
  finalMessage: '',
  coverMemoryId: '',
  selectedMemoryIds: []
};

const mapCouple = (row: any): { couple: CoupleProfile; doorState: DoorState } => ({
  couple: {
    id: row.id,
    nameA: row.name_a ?? '',
    nameB: row.name_b ?? '',
    initials: row.initials ?? '',
    emailA: row.email_a ?? '',
    emailB: row.email_b ?? '',
    avatarA: row.avatar_a ?? '',
    avatarB: row.avatar_b ?? '',
    togetherSince: row.together_since ?? '',
    startDate: row.start_date ?? undefined,
    cityA: row.city_a ?? undefined,
    cityB: row.city_b ?? undefined,
    distance: row.distance ?? undefined,
    flightDuration: row.flight_duration ?? undefined,
    timezoneDiff: row.timezone_diff ?? undefined,
    reunionDistance: row.reunion_distance ?? undefined,
    reunionDate: row.reunion_date ?? '',
    reunionLocation: row.reunion_location ?? '',
    reunionTitle: row.reunion_title ?? '',
    inviteCode: row.invite_code,
    isPartnerJoined: row.is_partner_joined,
    theme: row.theme,
    fontStyle: row.font_style,
    streakCount: row.streak_count,
    streakDays: row.streak_days ?? [false, false, false, false, false, false, false],
    lastActiveNote: row.last_active_note ?? '',
    lastActiveTime: row.last_active_time ?? '',
    pin: row.pin ?? '',
    drawerPin: row.drawer_pin ?? undefined,
    isDrawerUnlocked: row.is_drawer_unlocked,
    plan: row.plan,
    wallpaper: row.wallpaper ?? undefined,
    coverPhoto: row.cover_photo ?? ''
  },
  doorState: { ...DEFAULT_DOOR_STATE, ...(row.door_state ?? {}) }
});

const COUPLE_FIELD_MAP: Record<string, string> = {
  nameA: 'name_a', nameB: 'name_b', initials: 'initials', emailA: 'email_a', emailB: 'email_b',
  avatarA: 'avatar_a', avatarB: 'avatar_b', togetherSince: 'together_since', startDate: 'start_date',
  cityA: 'city_a', cityB: 'city_b', distance: 'distance', flightDuration: 'flight_duration',
  timezoneDiff: 'timezone_diff', reunionDistance: 'reunion_distance', reunionDate: 'reunion_date',
  reunionLocation: 'reunion_location', reunionTitle: 'reunion_title', theme: 'theme',
  fontStyle: 'font_style', streakCount: 'streak_count', streakDays: 'streak_days',
  lastActiveNote: 'last_active_note', lastActiveTime: 'last_active_time', pin: 'pin',
  drawerPin: 'drawer_pin', isDrawerUnlocked: 'is_drawer_unlocked', plan: 'plan',
  wallpaper: 'wallpaper', coverPhoto: 'cover_photo'
};

const coupleUpdatesToRow = (updates: Partial<CoupleProfile>) => {
  const row: Record<string, any> = {};
  for (const [key, value] of Object.entries(updates)) {
    const column = COUPLE_FIELD_MAP[key];
    if (column) row[column] = value;
  }
  return row;
};

const mapMemory = (row: any): Memory => ({
  id: row.id,
  title: row.title,
  caption: row.caption ?? '',
  author: row.author,
  authorName: row.author_name ?? '',
  kind: row.kind,
  imageUrl: row.image_url ?? undefined,
  videoUrl: row.video_url ?? undefined,
  audioDuration: row.audio_duration ?? undefined,
  videoDuration: row.video_duration ?? undefined,
  date: row.date ?? '',
  time: row.time ?? '',
  location: row.location ?? undefined,
  chapterId: row.chapter_id ?? undefined,
  isFavorite: row.is_favorite ?? false,
  isPrivate: row.is_private ?? false,
  reactions: row.reactions ?? [],
  replies: row.replies ?? [],
  rotationDeg: row.rotation_deg ?? undefined
});

const mapChapter = (row: any): Chapter => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle ?? '',
  coverImage: row.cover_image ?? '',
  startDate: row.start_date ?? '',
  endDate: row.end_date ?? '',
  theme: row.theme ?? '',
  spineColor: row.spine_color ?? '#8E1B1B',
  memoryIds: row.memory_ids ?? []
});

const mapDrawerItem = (row: any): DrawerItem => ({
  id: row.id,
  category: row.category,
  title: row.title,
  body: row.body ?? '',
  author: row.author,
  authorName: row.author_name ?? '',
  condition: row.condition ?? undefined,
  unlockDate: row.unlock_date ?? undefined,
  isLocked: row.is_locked,
  createdAt: whenLabel(row.created_at),
  audioDuration: row.audio_duration ?? undefined,
  photoUrl: row.photo_url ?? undefined,
  sealedMemoriesCount: row.sealed_memories_count ?? undefined,
  openedAt: row.opened_at ?? undefined
});

const mapParallelMoment = (row: any): ParallelMoment => ({
  id: row.id,
  date: row.date ?? '',
  time: row.time ?? '',
  timeAgo: whenLabel(row.created_at),
  momentA: row.moment_a ?? {},
  momentB: row.moment_b ?? {}
});

const mapReunionStop = (row: any): ReunionStop => ({
  id: row.id,
  time: row.time ?? '',
  title: row.title,
  description: row.description ?? '',
  iconName: row.icon_name ?? '',
  completed: row.completed,
  daysToGo: row.days_to_go ?? undefined,
  category: row.category ?? undefined,
  assignedTo: row.assigned_to ?? undefined,
  dueDate: row.due_date ?? undefined
});

const mapGoal = (row: any): SharedGoal => ({
  id: row.id,
  title: row.title,
  description: row.description ?? '',
  current: row.current,
  target: row.target,
  unit: row.unit ?? '',
  cover: row.cover ?? ''
});

const mapPromise = (row: any): PromiseItem => ({
  id: row.id,
  author: row.author,
  text: row.text,
  madeOn: row.made_on ?? ''
});

const mapActivity = (row: any): ActivityEvent => ({
  id: row.id,
  timeAgo: row.time_ago || whenLabel(row.created_at),
  dateGroup: row.date_group ?? 'Today',
  actor: row.actor,
  actorName: row.actor_name ?? '',
  type: row.type,
  title: row.title,
  subtitle: row.subtitle ?? undefined,
  thumbnail: row.thumbnail ?? undefined,
  badge: row.badge ?? undefined,
  actionText: row.action_text ?? undefined,
  actionTarget: row.action_target ?? undefined
});

const mapDailyPrompt = (row: any): DailyPrompt => ({
  id: row.id,
  date: row.date ?? '',
  question: row.question,
  answerA: row.answer_a ?? '',
  answerB: row.answer_b ?? ''
});

// Upsert-by-id: replaces an existing row with the same id, or prepends a new one.
const upsertById = <T extends { id: string }>(list: T[], item: T): T[] => {
  const exists = list.some((x) => x.id === item.id);
  return exists ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];
};

interface PairlumContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: UserRole;
  setCurrentUser: (user: UserRole) => void;
  couple: CoupleProfile;
  updateCouple: (updates: Partial<CoupleProfile>) => void;
  updateCoupleProfile: (updates: Partial<CoupleProfile>) => void;

  isCandlelit: boolean;
  toggleCandlelight: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeMode: 'light' | 'dark' | 'candlelight';
  setThemeMode: (mode: 'light' | 'dark' | 'candlelight') => void;

  memories: Memory[];
  addMemory: (memory: Omit<Memory, 'id' | 'reactions' | 'replies'>) => void;
  deleteMemory: (id: string) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  toggleReaction: (memoryId: string, reactionId: string) => void;
  addReply: (memoryId: string, text: string, voiceDuration?: string) => void;

  chapters: Chapter[];
  addChapter: (chapter: Omit<Chapter, 'id'>) => void;

  drawerItems: DrawerItem[];
  addDrawerItem: (item: Omit<DrawerItem, 'id' | 'createdAt'>) => void;
  unlockDrawerWithPin: (pin: string) => boolean;
  lockDrawer: () => void;

  reunionPlan: ReunionStop[];
  toggleReunionStop: (id: string) => void;
  addReunionStop: (stop: Omit<ReunionStop, 'id' | 'completed'>) => void;
  doorState: DoorState;
  updateDoorState: (updates: Partial<DoorState>) => void;
  openTheDoor: () => void;

  parallelMoments: ParallelMoment[];
  addParallelMoment: (momentA: any, momentB: any) => void;

  dailyPrompts: DailyPrompt[];
  todayPrompt: DailyPrompt | null;
  answerDailyPrompt: (promptId: string, role: UserRole, answer: string) => void;

  goals: SharedGoal[];
  promises: PromiseItem[];
  addGoal: (goal: Omit<SharedGoal, 'id'>) => void;
  addPromise: (text: string) => void;

  activityFeed: ActivityEvent[];

  isAddMemoryModalOpen: boolean;
  openAddMemoryModal: (defaultKind?: MemoryKind) => void;
  closeAddMemoryModal: () => void;
  addMemoryModalInitialKind: MemoryKind;

  activeLightboxMemory: Memory | null;
  setActiveLightboxMemory: (memory: Memory | null) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  windowOpened: boolean;
  setWindowOpened: (open: boolean) => void;

  dataLoading: boolean;
}

const PairlumContext = createContext<PairlumContextType | undefined>(undefined);

export const PairlumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { membership } = useAuth();
  const coupleId = membership?.coupleId ?? null;
  const currentUser: UserRole = membership?.role ?? 'A';
  // Who "you" are is fixed by which account you logged in as; kept as a no-op
  // for interface compatibility with the old single-device demo toggle.
  const setCurrentUser = (_user: UserRole) => {};

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isCandlelit, setIsCandlelit] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'candlelight'>(() => {
    const saved = localStorage.getItem('pairlum_theme_mode');
    return (saved === 'dark' || saved === 'candlelight' || saved === 'light') ? saved : 'light';
  });
  const isDarkMode = themeMode === 'dark';

  const setThemeMode = (mode: 'light' | 'dark' | 'candlelight') => {
    setThemeModeState(mode);
    localStorage.setItem('pairlum_theme_mode', mode);
    setIsCandlelit(mode === 'candlelight');
  };

  const toggleDarkMode = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
    showToast(nextMode === 'dark' ? '🌙 Midnight sanctuary mode enabled' : '☀️ Parchment light mode restored');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [themeMode]);

  const [couple, setCouple] = useState<CoupleProfile | null>(null);
  const [doorState, setDoorStateInternal] = useState<DoorState>(DEFAULT_DOOR_STATE);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [drawerItems, setDrawerItems] = useState<DrawerItem[]>([]);
  const [reunionPlan, setReunionPlan] = useState<ReunionStop[]>([]);
  const [parallelMoments, setParallelMoments] = useState<ParallelMoment[]>([]);
  const [dailyPrompts, setDailyPrompts] = useState<DailyPrompt[]>([]);
  const [goals, setGoals] = useState<SharedGoal[]>([]);
  const [promises, setPromises] = useState<PromiseItem[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([]);

  const [isAddMemoryModalOpen, setIsAddMemoryModalOpen] = useState(false);
  const [addMemoryModalInitialKind, setAddMemoryModalInitialKind] = useState<MemoryKind>('photo');
  const [activeLightboxMemory, setActiveLightboxMemory] = useState<Memory | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [windowOpened, setWindowOpened] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  }, []);

  // ---- Initial load + realtime subscriptions, keyed on the couple space ----
  useEffect(() => {
    if (!coupleId) {
      setDataLoading(false);
      return;
    }
    let cancelled = false;
    setDataLoading(true);

    const loadAll = async () => {
      const [
        coupleRes, memoriesRes, chaptersRes, drawerRes, parallelRes,
        reunionRes, goalsRes, promisesRes, activityRes, promptsRes
      ] = await Promise.all([
        supabase.from('couples').select('*').eq('id', coupleId).single(),
        supabase.from('memories').select('*').eq('couple_id', coupleId).order('created_at', { ascending: false }),
        supabase.from('chapters').select('*').eq('couple_id', coupleId).order('created_at', { ascending: true }),
        supabase.from('drawer_items').select('*').eq('couple_id', coupleId).order('created_at', { ascending: false }),
        supabase.from('parallel_moments').select('*').eq('couple_id', coupleId).order('created_at', { ascending: false }),
        supabase.from('reunion_stops').select('*').eq('couple_id', coupleId).order('created_at', { ascending: true }),
        supabase.from('shared_goals').select('*').eq('couple_id', coupleId).order('created_at', { ascending: true }),
        supabase.from('promises').select('*').eq('couple_id', coupleId).order('created_at', { ascending: false }),
        supabase.from('activity_events').select('*').eq('couple_id', coupleId).order('created_at', { ascending: false }),
        supabase.from('daily_prompts').select('*').eq('couple_id', coupleId).order('created_at', { ascending: false }),
      ]);

      if (cancelled) return;

      if (coupleRes.data) {
        const { couple: c, doorState: d } = mapCouple(coupleRes.data);
        setCouple(c);
        setDoorStateInternal(d);
      }
      setMemories((memoriesRes.data ?? []).map(mapMemory));
      setChapters((chaptersRes.data ?? []).map(mapChapter));
      setDrawerItems((drawerRes.data ?? []).map(mapDrawerItem));
      setParallelMoments((parallelRes.data ?? []).map(mapParallelMoment));
      setReunionPlan((reunionRes.data ?? []).map(mapReunionStop));
      setGoals((goalsRes.data ?? []).map(mapGoal));
      setPromises((promisesRes.data ?? []).map(mapPromise));
      setActivityFeed((activityRes.data ?? []).map(mapActivity));
      setDailyPrompts((promptsRes.data ?? []).map(mapDailyPrompt));
      setDataLoading(false);

      // Seed today's daily prompt if nobody has asked it yet. Keyed by UTC date
      // with a unique (couple_id, date) constraint, so if both partners' clients
      // race to do this, the loser's insert just fails and its realtime INSERT
      // event (fired for the winner) fills in the row locally instead.
      const today = getTodayDateKey();
      const hasToday = (promptsRes.data ?? []).some((row: any) => row.date === today);
      if (!hasToday) {
        supabase.from('daily_prompts').insert({
          couple_id: coupleId,
          date: today,
          question: pickQuestionForDate(today)
        }).select().single().then(({ data }) => {
          if (!cancelled && data) {
            setDailyPrompts((prev) => upsertById(prev, mapDailyPrompt(data)));
          }
        });
      }
    };

    loadAll();

    const channel = supabase.channel(`couple-${coupleId}`);

    channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'couples', filter: `id=eq.${coupleId}` },
      (payload) => {
        const { couple: c, doorState: d } = mapCouple(payload.new);
        setCouple(c);
        setDoorStateInternal(d);
      });

    const bindTable = <T extends { id: string }>(
      table: string,
      mapRow: (row: any) => T,
      setList: React.Dispatch<React.SetStateAction<T[]>>
    ) => {
      channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table, filter: `couple_id=eq.${coupleId}` },
        (payload) => setList((prev) => upsertById(prev, mapRow(payload.new))));
      channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table, filter: `couple_id=eq.${coupleId}` },
        (payload) => setList((prev) => upsertById(prev, mapRow(payload.new))));
      channel.on('postgres_changes', { event: 'DELETE', schema: 'public', table, filter: `couple_id=eq.${coupleId}` },
        (payload) => setList((prev) => prev.filter((x) => x.id !== payload.old.id)));
    };

    bindTable('memories', mapMemory, setMemories);
    bindTable('chapters', mapChapter, setChapters);
    bindTable('drawer_items', mapDrawerItem, setDrawerItems);
    bindTable('parallel_moments', mapParallelMoment, setParallelMoments);
    bindTable('reunion_stops', mapReunionStop, setReunionPlan);
    bindTable('shared_goals', mapGoal, setGoals);
    bindTable('promises', mapPromise, setPromises);
    bindTable('activity_events', mapActivity, setActivityFeed);
    bindTable('daily_prompts', mapDailyPrompt, setDailyPrompts);

    channel.subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [coupleId]);

  const todayPrompt = dailyPrompts.find((p) => p.date === getTodayDateKey()) ?? null;

  const partnerEmail = couple ? (currentUser === 'A' ? couple.emailB : couple.emailA) : '';
  const actorName = couple ? (currentUser === 'A' ? couple.nameA : couple.nameB) : '';

  const logActivity = useCallback(async (event: Omit<ActivityEvent, 'id' | 'timeAgo'>) => {
    if (!coupleId) return;
    await supabase.from('activity_events').insert({
      couple_id: coupleId,
      date_group: event.dateGroup,
      actor: event.actor,
      actor_name: event.actorName,
      type: event.type,
      title: event.title,
      subtitle: event.subtitle,
      thumbnail: event.thumbnail,
      badge: event.badge,
      action_text: event.actionText,
      action_target: event.actionTarget
    });
  }, [coupleId]);

  const updateCouple = useCallback((updates: Partial<CoupleProfile>) => {
    if (!coupleId) return;
    setCouple((prev) => (prev ? { ...prev, ...updates } : prev));
    supabase.from('couples').update(coupleUpdatesToRow(updates)).eq('id', coupleId).then(({ error }) => {
      if (error) console.error('Failed to save couple update', error);
    });
    showToast('Changes saved to your space');
  }, [coupleId, showToast]);

  const updateCoupleProfile = updateCouple;

  const answerDailyPrompt = useCallback((promptId: string, role: UserRole, answer: string) => {
    setDailyPrompts((prev) => prev.map((p) =>
      p.id === promptId ? { ...p, answerA: role === 'A' ? answer : p.answerA, answerB: role === 'B' ? answer : p.answerB } : p
    ));
    const column = role === 'A' ? 'answer_a' : 'answer_b';
    supabase.from('daily_prompts').update({ [column]: answer }).eq('id', promptId).then(({ error }) => {
      if (error) console.error('Failed to save prompt answer', error);
    });
  }, []);

  const addMemory = useCallback(async (newMemData: Omit<Memory, 'id' | 'reactions' | 'replies'>) => {
    if (!coupleId || !couple) return;
    const { data, error } = await supabase.from('memories').insert({
      couple_id: coupleId,
      title: newMemData.title,
      caption: newMemData.caption,
      author: newMemData.author,
      author_name: newMemData.authorName,
      kind: newMemData.kind,
      image_url: newMemData.imageUrl,
      video_url: newMemData.videoUrl,
      audio_duration: newMemData.audioDuration,
      video_duration: newMemData.videoDuration,
      date: newMemData.date,
      time: newMemData.time,
      location: newMemData.location,
      chapter_id: newMemData.chapterId,
      is_favorite: newMemData.isFavorite ?? false,
      is_private: newMemData.isPrivate ?? false,
      reactions: [
        { id: 'r1', label: 'Loved it', emoji: '❤️', count: 0, reactedByMe: false },
        { id: 'r2', label: 'Melted', emoji: '🥺', count: 0, reactedByMe: false },
        { id: 'r3', label: 'Miss you', emoji: '🕯️', count: 0, reactedByMe: false },
        { id: 'r4', label: 'Beautiful', emoji: '✨', count: 0, reactedByMe: false }
      ],
      replies: [],
      rotation_deg: Math.random() * 4 - 2
    }).select().single();

    if (error || !data) {
      console.error('Failed to add memory', error);
      return;
    }
    setMemories((prev) => upsertById(prev, mapMemory(data)));

    logActivity({
      dateGroup: 'Today', actor: currentUser, actorName,
      type: 'memory', title: `${actorName} added a new memory`,
      subtitle: `${newMemData.title} • ${newMemData.location || 'Home'}`,
      thumbnail: newMemData.imageUrl, actionText: 'View', actionTarget: 'wall'
    });

    updateCouple({ lastActiveNote: `${currentUser === 'A' ? 'She' : 'He'} added a memory just now`, lastActiveTime: 'Just now' });
    showToast(`Saved to your story — ${currentUser === 'A' ? couple.nameB : couple.nameA} will see it in The Window.`);

    sendN8nEvent({
      eventType: 'memory_added', coupleId: couple.id, actorName, partnerEmail,
      title: newMemData.title, subtitle: newMemData.location,
    });
  }, [coupleId, couple, currentUser, actorName, partnerEmail, logActivity, updateCouple, showToast]);

  const deleteMemory = useCallback((id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setActiveLightboxMemory((prev) => (prev?.id === id ? null : prev));
    supabase.from('memories').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Failed to delete memory', error);
    });
    showToast('Memory removed from your story');
  }, [showToast]);

  const updateMemory = useCallback((id: string, updates: Partial<Memory>) => {
    setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    setActiveLightboxMemory((prev) => (prev?.id === id ? { ...prev, ...updates } : prev));

    const row: Record<string, any> = {};
    if ('title' in updates) row.title = updates.title;
    if ('caption' in updates) row.caption = updates.caption;
    if ('location' in updates) row.location = updates.location;
    if ('isFavorite' in updates) row.is_favorite = updates.isFavorite;
    if ('isPrivate' in updates) row.is_private = updates.isPrivate;
    if ('chapterId' in updates) row.chapter_id = updates.chapterId;

    supabase.from('memories').update(row).eq('id', id).then(({ error }) => {
      if (error) console.error('Failed to update memory', error);
    });
    showToast('Memory updated');
  }, [showToast]);

  const toggleReaction = useCallback((memoryId: string, reactionId: string) => {
    let nextReactions: Memory['reactions'] | null = null;
    setMemories((prev) => prev.map((mem) => {
      if (mem.id !== memoryId) return mem;
      const reactions = mem.reactions.map((r) => {
        if (r.id !== reactionId) return r;
        const willBeReacted = !r.reactedByMe;
        return { ...r, reactedByMe: willBeReacted, count: willBeReacted ? r.count + 1 : Math.max(0, r.count - 1) };
      });
      nextReactions = reactions;
      return { ...mem, reactions };
    }));

    if (nextReactions) {
      supabase.from('memories').update({ reactions: nextReactions }).eq('id', memoryId).then(({ error }) => {
        if (error) console.error('Failed to save reaction', error);
      });
    }

    confetti({ particleCount: 25, spread: 60, origin: { y: 0.8 }, colors: ['#8E1B1B', '#C63A2E', '#E8A33D'] });
  }, []);

  const addReply = useCallback((memoryId: string, text: string, voiceDuration?: string) => {
    const newReply = { id: `rep-${Date.now()}`, author: currentUser, authorName: actorName, text, time: 'Just now', voiceDuration };
    let nextReplies: Memory['replies'] | null = null;
    setMemories((prev) => prev.map((m) => {
      if (m.id !== memoryId) return m;
      nextReplies = [...m.replies, newReply];
      return { ...m, replies: nextReplies };
    }));

    if (nextReplies) {
      supabase.from('memories').update({ replies: nextReplies }).eq('id', memoryId).then(({ error }) => {
        if (error) console.error('Failed to save reply', error);
      });
    }
    showToast('Reaction & reply sent');
  }, [currentUser, actorName, showToast]);

  const addChapter = useCallback(async (chapterData: Omit<Chapter, 'id'>) => {
    if (!coupleId) return;
    const { data, error } = await supabase.from('chapters').insert({
      couple_id: coupleId,
      title: chapterData.title,
      subtitle: chapterData.subtitle,
      cover_image: chapterData.coverImage,
      start_date: chapterData.startDate,
      end_date: chapterData.endDate,
      theme: chapterData.theme,
      spine_color: chapterData.spineColor,
      memory_ids: chapterData.memoryIds
    }).select().single();

    if (error || !data) {
      console.error('Failed to add chapter', error);
      return;
    }
    setChapters((prev) => upsertById(prev, mapChapter(data)));
    showToast('Chapter created on Our Shelf');
  }, [coupleId, showToast]);

  const addDrawerItem = useCallback(async (itemData: Omit<DrawerItem, 'id' | 'createdAt'>) => {
    if (!coupleId || !couple) return;
    const { data, error } = await supabase.from('drawer_items').insert({
      couple_id: coupleId,
      category: itemData.category,
      title: itemData.title,
      body: itemData.body,
      author: itemData.author,
      author_name: itemData.authorName,
      condition: itemData.condition,
      unlock_date: itemData.unlockDate,
      is_locked: itemData.isLocked,
      audio_duration: itemData.audioDuration,
      photo_url: itemData.photoUrl,
      sealed_memories_count: itemData.sealedMemoriesCount,
      opened_at: itemData.openedAt
    }).select().single();

    if (error || !data) {
      console.error('Failed to add drawer item', error);
      return;
    }
    setDrawerItems((prev) => upsertById(prev, mapDrawerItem(data)));
    showToast(itemData.isLocked ? 'Sealed in The Drawer until unlock date' : 'Added to The Drawer');

    sendN8nEvent({
      eventType: 'drawer_item_added', coupleId: couple.id, actorName, partnerEmail,
      title: itemData.title,
      subtitle: itemData.isLocked ? `Sealed until ${itemData.unlockDate || 'a future date'}` : undefined,
    });
  }, [coupleId, couple, actorName, partnerEmail, showToast]);

  const unlockDrawerWithPin = useCallback((enteredPin: string) => {
    if (!couple) return false;
    if (enteredPin === couple.pin || enteredPin === couple.drawerPin) {
      updateCouple({ isDrawerUnlocked: true });
      return true;
    }
    return false;
  }, [couple, updateCouple]);

  const lockDrawer = useCallback(() => {
    updateCouple({ isDrawerUnlocked: false });
  }, [updateCouple]);

  const toggleReunionStop = useCallback((id: string) => {
    let nextCompleted: boolean | null = null;
    setReunionPlan((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      nextCompleted = !item.completed;
      return { ...item, completed: nextCompleted };
    }));
    if (nextCompleted !== null) {
      supabase.from('reunion_stops').update({ completed: nextCompleted }).eq('id', id).then(({ error }) => {
        if (error) console.error('Failed to update reunion stop', error);
      });
    }
  }, []);

  const addReunionStop = useCallback(async (stopData: Omit<ReunionStop, 'id' | 'completed'>) => {
    if (!coupleId) return;
    const { data, error } = await supabase.from('reunion_stops').insert({
      couple_id: coupleId,
      time: stopData.time,
      title: stopData.title,
      description: stopData.description,
      icon_name: stopData.iconName,
      days_to_go: stopData.daysToGo,
      category: stopData.category,
      assigned_to: stopData.assignedTo,
      due_date: stopData.dueDate,
      completed: false
    }).select().single();

    if (error || !data) {
      console.error('Failed to add reunion stop', error);
      return;
    }
    setReunionPlan((prev) => upsertById(prev, mapReunionStop(data)));
    showToast('Added to your reunion roadmap');
  }, [coupleId, showToast]);

  const updateDoorState = useCallback((updates: Partial<DoorState>) => {
    if (!coupleId) return;
    setDoorStateInternal((prev) => {
      const next = { ...prev, ...updates };
      supabase.from('couples').update({ door_state: next }).eq('id', coupleId).then(({ error }) => {
        if (error) console.error('Failed to save door state', error);
      });
      return next;
    });
  }, [coupleId]);

  const openTheDoor = useCallback(() => {
    if (!couple) return;
    updateDoorState({ isOpened: true });
    setCurrentView('door_opened');
    confetti({ particleCount: 100, spread: 120, origin: { y: 0.6 }, colors: ['#E8A33D', '#8E1B1B', '#C63A2E', '#FFFBF5'] });

    sendN8nEvent({
      eventType: 'door_opened', coupleId: couple.id, actorName, partnerEmail,
      title: couple.reunionTitle, subtitle: doorState.finalMessage,
    });
  }, [couple, updateDoorState, actorName, partnerEmail, doorState.finalMessage]);

  const addParallelMoment = useCallback(async (momentA: any, momentB: any) => {
    if (!coupleId) return;
    const { data, error } = await supabase.from('parallel_moments').insert({
      couple_id: coupleId,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      moment_a: momentA,
      moment_b: momentB
    }).select().single();

    if (error || !data) {
      console.error('Failed to add parallel moment', error);
      return;
    }
    setParallelMoments((prev) => upsertById(prev, mapParallelMoment(data)));
    showToast('Parallel moment captured together!');
  }, [coupleId, showToast]);

  const addGoal = useCallback(async (goalData: Omit<SharedGoal, 'id'>) => {
    if (!coupleId) return;
    const { data, error } = await supabase.from('shared_goals').insert({
      couple_id: coupleId,
      title: goalData.title, description: goalData.description,
      current: goalData.current, target: goalData.target, unit: goalData.unit, cover: goalData.cover
    }).select().single();

    if (error || !data) {
      console.error('Failed to add goal', error);
      return;
    }
    setGoals((prev) => upsertById(prev, mapGoal(data)));
    showToast('Shared goal added');
  }, [coupleId, showToast]);

  const addPromise = useCallback(async (text: string) => {
    if (!coupleId) return;
    const madeOn = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const { data, error } = await supabase.from('promises').insert({
      couple_id: coupleId, author: currentUser, text, made_on: madeOn
    }).select().single();

    if (error || !data) {
      console.error('Failed to add promise', error);
      return;
    }
    setPromises((prev) => upsertById(prev, mapPromise(data)));
    showToast('Promise sealed');
  }, [coupleId, currentUser, showToast]);

  const openAddMemoryModal = useCallback((defaultKind: MemoryKind = 'photo') => {
    setAddMemoryModalInitialKind(defaultKind);
    setIsAddMemoryModalOpen(true);
  }, []);

  const closeAddMemoryModal = useCallback(() => setIsAddMemoryModalOpen(false), []);

  const toggleCandlelight = useCallback(() => setIsCandlelit((prev) => !prev), []);

  if (!couple) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FFFBF5]">
        <p className="text-sm text-[#6E5B52]">{dataLoading ? 'Opening your space…' : 'No shared space found.'}</p>
      </div>
    );
  }

  return (
    <PairlumContext.Provider
      value={{
        currentView, setCurrentView, currentUser, setCurrentUser,
        couple, updateCouple, updateCoupleProfile,
        isCandlelit, toggleCandlelight, isDarkMode, toggleDarkMode, themeMode, setThemeMode,
        memories, addMemory, deleteMemory, updateMemory, toggleReaction, addReply,
        chapters, addChapter,
        drawerItems, addDrawerItem, unlockDrawerWithPin, lockDrawer,
        reunionPlan, toggleReunionStop, addReunionStop,
        doorState, updateDoorState, openTheDoor,
        parallelMoments, addParallelMoment,
        dailyPrompts, todayPrompt, answerDailyPrompt,
        goals, promises, addGoal, addPromise,
        activityFeed,
        isAddMemoryModalOpen, openAddMemoryModal, closeAddMemoryModal, addMemoryModalInitialKind,
        activeLightboxMemory, setActiveLightboxMemory,
        toastMessage, showToast,
        windowOpened, setWindowOpened,
        dataLoading
      }}
    >
      {children}
    </PairlumContext.Provider>
  );
};

export const usePairlum = () => {
  const context = useContext(PairlumContext);
  if (!context) {
    throw new Error('usePairlum must be used within a PairlumProvider');
  }
  return context;
};
