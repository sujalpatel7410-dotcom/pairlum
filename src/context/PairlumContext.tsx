import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppView,
  UserRole,
  CoupleProfile,
  Memory,
  MemoryReply,
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
import {
  INITIAL_CHAPTERS,
  INITIAL_DRAWER_ITEMS,
  INITIAL_PARALLEL_MOMENTS,
  INITIAL_REUNION_PLAN,
  INITIAL_GOALS,
  INITIAL_PROMISES,
  INITIAL_ACTIVITY,
  INITIAL_DAILY_PROMPTS
} from '../data/mockData';
import confetti from 'canvas-confetti';
import { sendN8nEvent } from '../lib/n8n';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { coupleRowToProfile, coupleProfileToRowUpdate, CoupleRow, MemberProfileRow } from '../lib/coupleMapping';

interface PairlumContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: UserRole;
  couple: CoupleProfile;
  updateCouple: (updates: Partial<CoupleProfile>) => void;
  updateCoupleProfile: (updates: Partial<CoupleProfile>) => void;

  // Ambient & Theme Modes
  isCandlelit: boolean;
  toggleCandlelight: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  themeMode: 'light' | 'dark' | 'candlelight';
  setThemeMode: (mode: 'light' | 'dark' | 'candlelight') => void;

  // Memories (synced with Supabase — shared, real-time between partners)
  memories: Memory[];
  addMemory: (memory: Omit<Memory, 'id' | 'reactions' | 'replies'>) => void;
  deleteMemory: (id: string) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  toggleReaction: (memoryId: string, reactionId: string) => void;
  addReply: (memoryId: string, text: string, voiceDuration?: string) => void;

  // Chapters
  chapters: Chapter[];
  addChapter: (chapter: Omit<Chapter, 'id'>) => void;

  // Drawer
  drawerItems: DrawerItem[];
  addDrawerItem: (item: Omit<DrawerItem, 'id' | 'createdAt'>) => void;
  unlockDrawerWithPin: (pin: string) => boolean;
  lockDrawer: () => void;

  // Door / Reunion
  reunionPlan: ReunionStop[];
  toggleReunionStop: (id: string) => void;
  addReunionStop: (stop: Omit<ReunionStop, 'id' | 'completed'>) => void;
  doorState: {
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
  };
  updateDoorState: (updates: Partial<PairlumContextType['doorState']>) => void;
  openTheDoor: () => void;

  // Parallel Moments
  parallelMoments: ParallelMoment[];
  addParallelMoment: (momentA: any, momentB: any) => void;

  // Daily Prompts & Together
  dailyPrompts: DailyPrompt[];
  answerDailyPrompt: (promptId: string, role: UserRole, answer: string) => void;

  // Goals & Promises
  goals: SharedGoal[];
  promises: PromiseItem[];
  addGoal: (goal: Omit<SharedGoal, 'id'>) => void;
  addPromise: (text: string) => void;

  // Activity
  activityFeed: ActivityEvent[];

  // Modals & UI helpers
  isAddMemoryModalOpen: boolean;
  openAddMemoryModal: (defaultKind?: MemoryKind) => void;
  closeAddMemoryModal: () => void;
  addMemoryModalInitialKind: MemoryKind;

  activeLightboxMemory: Memory | null;
  setActiveLightboxMemory: (memory: Memory | null) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Window seen
  windowOpened: boolean;
  setWindowOpened: (open: boolean) => void;
}

const PairlumContext = createContext<PairlumContextType | undefined>(undefined);

// PairlumProvider is only ever mounted once AuthProvider has resolved a
// signed-in user with a couple_id (see App.tsx's auth gate), so coupleId/
// role/user below are always non-null in practice.
export const PairlumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { coupleId, role, user } = useAuth();
  const currentUser: UserRole = role || 'A';

  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isCandlelit, setIsCandlelit] = useState(false);

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
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // --------------------------------------------------------------------
  // Couple profile — backed by Supabase (`couples` + `couple_members` +
  // `profiles`), shared and kept in sync between both partners' accounts.
  // --------------------------------------------------------------------
  const [couple, setCouple] = useState<CoupleProfile>(() => coupleRowToProfile(
    { id: coupleId || '', name_a: '', name_b: null, invite_code: '', together_since: null, start_date: null,
      city_a: null, city_b: null, reunion_date: null, reunion_location: null, reunion_title: null,
      theme: 'rose', font_style: 'elegant', pin: null, drawer_pin: null, is_drawer_unlocked: false,
      plan: 'essential', wallpaper: null, cover_photo: null, is_partner_joined: false },
    null,
    null
  ));

  const refreshCouple = useCallback(async () => {
    if (!coupleId) return;
    const { data: coupleRow } = await supabase.from('couples').select('*').eq('id', coupleId).single();
    if (!coupleRow) return;

    const { data: memberRows } = await supabase
      .from('couple_members')
      .select('role, profiles(id, name, email, avatar_url)')
      .eq('couple_id', coupleId);

    const memberA = (memberRows?.find((m: any) => m.role === 'A')?.profiles || null) as unknown as MemberProfileRow | null;
    const memberB = (memberRows?.find((m: any) => m.role === 'B')?.profiles || null) as unknown as MemberProfileRow | null;

    setCouple(coupleRowToProfile(coupleRow as CoupleRow, memberA, memberB));
  }, [coupleId]);

  useEffect(() => {
    refreshCouple();
  }, [refreshCouple]);

  useEffect(() => {
    if (!coupleId) return;
    const channel = supabase
      .channel(`couple-${coupleId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'couples', filter: `id=eq.${coupleId}` }, () => refreshCouple())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'couple_members', filter: `couple_id=eq.${coupleId}` }, () => refreshCouple())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [coupleId, refreshCouple]);

  const updateCouple = (updates: Partial<CoupleProfile>) => {
    setCouple(prev => ({ ...prev, ...updates }));
    showToast('Changes saved to your space');
    if (!coupleId) return;
    const rowUpdate = coupleProfileToRowUpdate(updates);
    if (Object.keys(rowUpdate).length === 0) return;
    supabase.from('couples').update(rowUpdate).eq('id', coupleId).then(({ error }) => {
      if (error) showToast(`Could not save: ${error.message}`);
    });
  };

  const updateCoupleProfile = (updates: Partial<CoupleProfile>) => {
    updateCouple(updates);
  };

  // --------------------------------------------------------------------
  // Memories — backed by Supabase (`memories` + `memory_replies`), the
  // flagship proof that two accounts in a Couple Space see the same data.
  // --------------------------------------------------------------------
  const [memories, setMemories] = useState<Memory[]>([]);

  const refreshMemories = useCallback(async () => {
    if (!coupleId || !user) return;
    const [{ data: memRows }, { data: replyRows }] = await Promise.all([
      supabase.from('memories').select('*').eq('couple_id', coupleId).order('created_at', { ascending: false }),
      supabase.from('memory_replies').select('*').eq('couple_id', coupleId).order('created_at', { ascending: true }),
    ]);

    const repliesByMemory = new Map<string, MemoryReply[]>();
    (replyRows || []).forEach((r: any) => {
      const list = repliesByMemory.get(r.memory_id) || [];
      list.push({
        id: r.id,
        author: r.author_role,
        authorName: r.author_role === 'A' ? couple.nameA : couple.nameB,
        text: r.text,
        time: new Date(r.created_at).toLocaleString(),
        voiceDuration: r.voice_duration || undefined,
      });
      repliesByMemory.set(r.memory_id, list);
    });

    const mapped: Memory[] = (memRows || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      caption: row.caption,
      author: row.author_role,
      authorName: row.author_role === 'A' ? couple.nameA : couple.nameB,
      kind: row.kind,
      imageUrl: row.image_url || undefined,
      videoUrl: row.video_url || undefined,
      audioDuration: row.audio_duration || undefined,
      videoDuration: row.video_duration || undefined,
      date: row.memory_date || '',
      time: row.memory_time || '',
      location: row.location || undefined,
      chapterId: row.chapter_id || undefined,
      isFavorite: row.is_favorite,
      isPrivate: row.is_private,
      reactions: (row.reactions || []).map((r: any) => ({
        ...r,
        reactedByMe: Boolean((row.reacted_by || {})[r.id]?.includes(user.id)),
      })),
      replies: repliesByMemory.get(row.id) || [],
      rotationDeg: row.rotation_deg ?? undefined,
    }));

    setMemories(mapped);
  }, [coupleId, user, couple.nameA, couple.nameB]);

  useEffect(() => {
    refreshMemories();
  }, [refreshMemories]);

  useEffect(() => {
    if (!coupleId) return;
    const channel = supabase
      .channel(`memories-${coupleId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'memories', filter: `couple_id=eq.${coupleId}` }, () => refreshMemories())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'memory_replies', filter: `couple_id=eq.${coupleId}` }, () => refreshMemories())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [coupleId, refreshMemories]);

  // --------------------------------------------------------------------
  // Everything below this line (chapters, drawer, reunion plan, goals,
  // promises, daily prompts, parallel moments, activity feed) is still
  // localStorage-backed, namespaced per couple so switching accounts on a
  // shared device can't leak one couple's data into another's view.
  // supabase/schema.sql already has tables + RLS for all of these — wiring
  // them up follows the exact same read/subscribe/write pattern used above
  // for `couple` and `memories`.
  // --------------------------------------------------------------------
  const storageKey = (name: string) => `pairlum_${name}_${coupleId || 'local'}`;

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem(storageKey('chapters'));
    return saved ? JSON.parse(saved) : INITIAL_CHAPTERS;
  });

  const [drawerItems, setDrawerItems] = useState<DrawerItem[]>(() => {
    const saved = localStorage.getItem(storageKey('drawer'));
    return saved ? JSON.parse(saved) : INITIAL_DRAWER_ITEMS;
  });

  const [reunionPlan, setReunionPlan] = useState<ReunionStop[]>(() => {
    const saved = localStorage.getItem(storageKey('reunion'));
    return saved ? JSON.parse(saved) : INITIAL_REUNION_PLAN;
  });

  const [parallelMoments, setParallelMoments] = useState<ParallelMoment[]>(INITIAL_PARALLEL_MOMENTS);
  const [dailyPrompts, setDailyPrompts] = useState<DailyPrompt[]>(() => {
    const saved = localStorage.getItem(storageKey('daily_prompts'));
    return saved ? JSON.parse(saved) : INITIAL_DAILY_PROMPTS;
  });
  const [goals, setGoals] = useState<SharedGoal[]>(INITIAL_GOALS);
  const [promises, setPromises] = useState<PromiseItem[]>(INITIAL_PROMISES);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>(INITIAL_ACTIVITY);

  const [doorState, setDoorState] = useState({
    isPrepared: true,
    isOpened: false,
    musicTrack: 'Yellow - Coldplay',
    finalMessage: 'Every mile, every note, every little moment brought you here. The rest is still unwritten.',
    coverMemoryId: 'mem-2',
    selectedMemoryIds: ['mem-1', 'mem-2', 'mem-3', 'mem-4'],
    reaction: undefined as any
  });

  const [isAddMemoryModalOpen, setIsAddMemoryModalOpen] = useState(false);
  const [addMemoryModalInitialKind, setAddMemoryModalInitialKind] = useState<MemoryKind>('photo');
  const [activeLightboxMemory, setActiveLightboxMemory] = useState<Memory | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [windowOpened, setWindowOpened] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey('chapters'), JSON.stringify(chapters));
  }, [chapters, coupleId]);

  useEffect(() => {
    localStorage.setItem(storageKey('drawer'), JSON.stringify(drawerItems));
  }, [drawerItems, coupleId]);

  useEffect(() => {
    localStorage.setItem(storageKey('daily_prompts'), JSON.stringify(dailyPrompts));
  }, [dailyPrompts, coupleId]);

  useEffect(() => {
    localStorage.setItem(storageKey('reunion'), JSON.stringify(reunionPlan));
  }, [reunionPlan, coupleId]);

  const toggleCandlelight = () => {
    setIsCandlelit(prev => !prev);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const answerDailyPrompt = (promptId: string, role: UserRole, answer: string) => {
    let question = '';
    setDailyPrompts(prev => prev.map(p => {
      if (p.id !== promptId) return p;
      question = p.question;
      return {
        ...p,
        answerA: role === 'A' ? answer : p.answerA,
        answerB: role === 'B' ? answer : p.answerB
      };
    }));

    sendN8nEvent({
      eventType: 'daily_prompt_answered',
      coupleId: couple.id,
      actorName: role === 'A' ? couple.nameA : couple.nameB,
      partnerEmail: role === 'A' ? couple.emailB : couple.emailA,
      title: question || "Today's question",
      subtitle: 'Answer yours to reveal both sides',
    });
  };

  const addMemory = async (newMemData: Omit<Memory, 'id' | 'reactions' | 'replies'>) => {
    if (!coupleId || !user) return;

    const { error } = await supabase.from('memories').insert({
      couple_id: coupleId,
      author: user.id,
      author_role: currentUser,
      kind: newMemData.kind,
      title: newMemData.title,
      caption: newMemData.caption,
      image_url: newMemData.imageUrl || null,
      video_url: newMemData.videoUrl || null,
      audio_duration: newMemData.audioDuration || null,
      video_duration: newMemData.videoDuration || null,
      memory_date: newMemData.date || null,
      memory_time: newMemData.time || null,
      location: newMemData.location || null,
      chapter_id: newMemData.chapterId || null,
      is_favorite: newMemData.isFavorite || false,
      is_private: newMemData.isPrivate || false,
      rotation_deg: Math.random() * 4 - 2,
    });

    if (error) {
      showToast(`Could not save memory: ${error.message}`);
      return;
    }

    await refreshMemories();

    const newAct: ActivityEvent = {
      id: `act-${Date.now()}`,
      timeAgo: 'Just now',
      dateGroup: 'Today',
      actor: currentUser,
      actorName: currentUser === 'A' ? couple.nameA : couple.nameB,
      type: 'memory',
      title: `${currentUser === 'A' ? couple.nameA : couple.nameB} added a new memory`,
      subtitle: `${newMemData.title} • ${newMemData.location || 'Home'}`,
      thumbnail: newMemData.imageUrl,
      actionText: 'View',
      actionTarget: 'wall'
    };
    setActivityFeed(prev => [newAct, ...prev]);

    showToast(`Saved to your story — ${currentUser === 'A' ? couple.nameB : couple.nameA} will see it in The Window.`);

    sendN8nEvent({
      eventType: 'memory_added',
      coupleId: couple.id,
      actorName: currentUser === 'A' ? couple.nameA : couple.nameB,
      partnerEmail: currentUser === 'A' ? couple.emailB : couple.emailA,
      title: newMemData.title,
      subtitle: newMemData.location,
    });
  };

  const deleteMemory = async (id: string) => {
    const { error } = await supabase.from('memories').delete().eq('id', id);
    if (error) {
      showToast(`Could not delete memory: ${error.message}`);
      return;
    }
    if (activeLightboxMemory?.id === id) {
      setActiveLightboxMemory(null);
    }
    await refreshMemories();
    showToast('Memory removed from your story');
  };

  const updateMemory = async (id: string, updates: Partial<Memory>) => {
    const rowUpdate: Record<string, unknown> = {};
    if (updates.title !== undefined) rowUpdate.title = updates.title;
    if (updates.caption !== undefined) rowUpdate.caption = updates.caption;
    if (updates.imageUrl !== undefined) rowUpdate.image_url = updates.imageUrl;
    if (updates.videoUrl !== undefined) rowUpdate.video_url = updates.videoUrl;
    if (updates.location !== undefined) rowUpdate.location = updates.location;
    if (updates.isFavorite !== undefined) rowUpdate.is_favorite = updates.isFavorite;
    if (updates.isPrivate !== undefined) rowUpdate.is_private = updates.isPrivate;
    if (updates.chapterId !== undefined) rowUpdate.chapter_id = updates.chapterId;

    const { error } = await supabase.from('memories').update(rowUpdate).eq('id', id);
    if (error) {
      showToast(`Could not update memory: ${error.message}`);
      return;
    }
    await refreshMemories();
    if (activeLightboxMemory?.id === id) {
      setActiveLightboxMemory(prev => prev ? { ...prev, ...updates } : null);
    }
    showToast('Memory updated');
  };

  const toggleReaction = async (memoryId: string, reactionId: string) => {
    if (!user) return;
    const { data: row } = await supabase.from('memories').select('reactions, reacted_by').eq('id', memoryId).single();
    if (!row) return;

    const reactions = (row.reactions || []) as { id: string; label: string; emoji: string; count: number }[];
    const reactedBy = (row.reacted_by || {}) as Record<string, string[]>;
    const already = (reactedBy[reactionId] || []).includes(user.id);

    const nextReactedBy = {
      ...reactedBy,
      [reactionId]: already
        ? (reactedBy[reactionId] || []).filter((id) => id !== user.id)
        : [...(reactedBy[reactionId] || []), user.id],
    };
    const nextReactions = reactions.map((r) =>
      r.id === reactionId ? { ...r, count: already ? Math.max(0, r.count - 1) : r.count + 1 } : r
    );

    await supabase.from('memories').update({ reactions: nextReactions, reacted_by: nextReactedBy }).eq('id', memoryId);
    await refreshMemories();

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#8E1B1B', '#C63A2E', '#E8A33D']
    });
  };

  const addReply = async (memoryId: string, text: string, voiceDuration?: string) => {
    if (!coupleId || !user) return;
    const { error } = await supabase.from('memory_replies').insert({
      memory_id: memoryId,
      couple_id: coupleId,
      author: user.id,
      author_role: currentUser,
      text,
      voice_duration: voiceDuration || null,
    });
    if (error) {
      showToast(`Could not send reply: ${error.message}`);
      return;
    }
    await refreshMemories();
    showToast('Reaction & reply sent');
  };

  const addChapter = (chapterData: Omit<Chapter, 'id'>) => {
    const newChapter: Chapter = {
      ...chapterData,
      id: `chap-${Date.now()}`
    };
    setChapters(prev => [...prev, newChapter]);
    showToast('Chapter created on Our Shelf');

    sendN8nEvent({
      eventType: 'chapter_added',
      coupleId: couple.id,
      actorName: currentUser === 'A' ? couple.nameA : couple.nameB,
      partnerEmail: currentUser === 'A' ? couple.emailB : couple.emailA,
      title: chapterData.title,
      subtitle: chapterData.subtitle,
    });
  };

  const addDrawerItem = (itemData: Omit<DrawerItem, 'id' | 'createdAt'>) => {
    const newItem: DrawerItem = {
      ...itemData,
      id: `draw-${Date.now()}`,
      createdAt: 'Just now'
    };
    setDrawerItems(prev => [newItem, ...prev]);
    showToast(itemData.isLocked ? 'Sealed in The Drawer until unlock date' : 'Added to The Drawer');

    sendN8nEvent({
      eventType: 'drawer_item_added',
      coupleId: couple.id,
      actorName: currentUser === 'A' ? couple.nameA : couple.nameB,
      partnerEmail: currentUser === 'A' ? couple.emailB : couple.emailA,
      title: itemData.title,
      subtitle: itemData.isLocked ? `Sealed until ${itemData.unlockDate || 'a future date'}` : undefined,
    });
  };

  const unlockDrawerWithPin = (enteredPin: string) => {
    if (enteredPin && (enteredPin === couple.pin || enteredPin === couple.drawerPin)) {
      updateCouple({ isDrawerUnlocked: true });
      return true;
    }
    return false;
  };

  const lockDrawer = () => {
    updateCouple({ isDrawerUnlocked: false });
  };

  const toggleReunionStop = (id: string) => {
    let justCompleted: ReunionStop | undefined;
    setReunionPlan(prev => prev.map(item => {
      if (item.id !== id) return item;
      const completed = !item.completed;
      if (completed) justCompleted = item;
      return { ...item, completed };
    }));

    if (justCompleted) {
      sendN8nEvent({
        eventType: 'reunion_stop_completed',
        coupleId: couple.id,
        actorName: currentUser === 'A' ? couple.nameA : couple.nameB,
        partnerEmail: currentUser === 'A' ? couple.emailB : couple.emailA,
        title: justCompleted.title,
        subtitle: 'One step closer to your reunion',
      });
    }
  };

  const addReunionStop = (stopData: Omit<ReunionStop, 'id' | 'completed'>) => {
    setReunionPlan(prev => [...prev, { ...stopData, id: `reu-${Date.now()}`, completed: false }]);
    showToast('Added to your reunion roadmap');
  };

  const updateDoorState = (updates: Partial<typeof doorState>) => {
    setDoorState(prev => ({ ...prev, ...updates }));
  };

  const openTheDoor = () => {
    setDoorState(prev => ({ ...prev, isOpened: true }));
    setCurrentView('door_opened');
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.6 },
      colors: ['#E8A33D', '#8E1B1B', '#C63A2E', '#FFFBF5']
    });

    sendN8nEvent({
      eventType: 'door_opened',
      coupleId: couple.id,
      actorName: currentUser === 'A' ? couple.nameA : couple.nameB,
      partnerEmail: currentUser === 'A' ? couple.emailB : couple.emailA,
      title: couple.reunionTitle,
      subtitle: doorState.finalMessage,
    });
  };

  const addParallelMoment = (momentA: any, momentB: any) => {
    const newMoment: ParallelMoment = {
      id: `par-${Date.now()}`,
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeAgo: 'Just now',
      momentA,
      momentB
    };
    setParallelMoments(prev => [newMoment, ...prev]);
    showToast('Parallel moment captured together!');

    sendN8nEvent({
      eventType: 'parallel_moment_added',
      coupleId: couple.id,
      actorName: currentUser === 'A' ? couple.nameA : couple.nameB,
      partnerEmail: currentUser === 'A' ? couple.emailB : couple.emailA,
      title: `${momentA?.title || 'A moment'} & ${momentB?.title || 'a moment'}`,
      subtitle: 'A parallel moment was captured across the distance',
    });
  };

  const addGoal = (goalData: Omit<SharedGoal, 'id'>) => {
    setGoals(prev => [...prev, { ...goalData, id: `g-${Date.now()}` }]);
    showToast('Shared goal added');

    sendN8nEvent({
      eventType: 'goal_added',
      coupleId: couple.id,
      actorName: currentUser === 'A' ? couple.nameA : couple.nameB,
      partnerEmail: currentUser === 'A' ? couple.emailB : couple.emailA,
      title: goalData.title,
      subtitle: goalData.description,
    });
  };

  const addPromise = (text: string) => {
    const newPromise: PromiseItem = {
      id: `p-${Date.now()}`,
      author: currentUser,
      text,
      madeOn: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setPromises(prev => [newPromise, ...prev]);
    showToast('Promise sealed');

    sendN8nEvent({
      eventType: 'promise_added',
      coupleId: couple.id,
      actorName: currentUser === 'A' ? couple.nameA : couple.nameB,
      partnerEmail: currentUser === 'A' ? couple.emailB : couple.emailA,
      title: text,
    });
  };

  const openAddMemoryModal = (defaultKind: MemoryKind = 'photo') => {
    setAddMemoryModalInitialKind(defaultKind);
    setIsAddMemoryModalOpen(true);
  };

  const closeAddMemoryModal = () => {
    setIsAddMemoryModalOpen(false);
  };

  return (
    <PairlumContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        couple,
        updateCouple,
        updateCoupleProfile,
        isCandlelit,
        toggleCandlelight,
        isDarkMode,
        toggleDarkMode,
        themeMode,
        setThemeMode,
        memories,
        addMemory,
        deleteMemory,
        updateMemory,
        toggleReaction,
        addReply,
        chapters,
        addChapter,
        drawerItems,
        addDrawerItem,
        unlockDrawerWithPin,
        lockDrawer,
        reunionPlan,
        toggleReunionStop,
        addReunionStop,
        doorState,
        updateDoorState,
        openTheDoor,
        parallelMoments,
        addParallelMoment,
        dailyPrompts,
        answerDailyPrompt,
        goals,
        promises,
        addGoal,
        addPromise,
        activityFeed,
        isAddMemoryModalOpen,
        openAddMemoryModal,
        closeAddMemoryModal,
        addMemoryModalInitialKind,
        activeLightboxMemory,
        setActiveLightboxMemory,
        toastMessage,
        showToast,
        windowOpened,
        setWindowOpened
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
