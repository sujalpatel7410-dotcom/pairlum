import React, { createContext, useContext, useState, useEffect } from 'react';
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
import {
  INITIAL_COUPLE,
  INITIAL_MEMORIES,
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

interface PairlumContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: UserRole;
  setCurrentUser: (user: UserRole) => void;
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

  // Memories
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

export const PairlumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentUser, setCurrentUser] = useState<UserRole>('A'); // A = Emma, B = Liam
  const [isCandlelit, setIsCandlelit] = useState(false);
  
  const [themeMode, setThemeModeState] = useState<'light' | 'dark' | 'candlelight'>(() => {
    const saved = localStorage.getItem('pairlum_theme_mode');
    return (saved === 'dark' || saved === 'candlelight' || saved === 'light') ? saved : 'light';
  });

  const isDarkMode = themeMode === 'dark';

  const setThemeMode = (mode: 'light' | 'dark' | 'candlelight') => {
    setThemeModeState(mode);
    localStorage.setItem('pairlum_theme_mode', mode);
    if (mode === 'candlelight') {
      setIsCandlelit(true);
    } else {
      setIsCandlelit(false);
    }
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
  
  const [couple, setCouple] = useState<CoupleProfile>(() => {
    const saved = localStorage.getItem('pairlum_couple');
    return saved ? JSON.parse(saved) : INITIAL_COUPLE;
  });
  
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem('pairlum_memories');
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('pairlum_chapters');
    return saved ? JSON.parse(saved) : INITIAL_CHAPTERS;
  });

  const [drawerItems, setDrawerItems] = useState<DrawerItem[]>(() => {
    const saved = localStorage.getItem('pairlum_drawer');
    return saved ? JSON.parse(saved) : INITIAL_DRAWER_ITEMS;
  });

  const [reunionPlan, setReunionPlan] = useState<ReunionStop[]>(() => {
    const saved = localStorage.getItem('pairlum_reunion');
    return saved ? JSON.parse(saved) : INITIAL_REUNION_PLAN;
  });

  const [parallelMoments, setParallelMoments] = useState<ParallelMoment[]>(INITIAL_PARALLEL_MOMENTS);
  const [dailyPrompts, setDailyPrompts] = useState<DailyPrompt[]>(() => {
    const saved = localStorage.getItem('pairlum_daily_prompts');
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

  // Persistence
  useEffect(() => {
    localStorage.setItem('pairlum_couple', JSON.stringify(couple));
  }, [couple]);

  useEffect(() => {
    localStorage.setItem('pairlum_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('pairlum_chapters', JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    localStorage.setItem('pairlum_drawer', JSON.stringify(drawerItems));
  }, [drawerItems]);

  useEffect(() => {
    localStorage.setItem('pairlum_daily_prompts', JSON.stringify(dailyPrompts));
  }, [dailyPrompts]);

  const toggleCandlelight = () => {
    setIsCandlelit(prev => !prev);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const updateCouple = (updates: Partial<CoupleProfile>) => {
    setCouple(prev => ({ ...prev, ...updates }));
    showToast('Changes saved to your space');
  };

  const updateCoupleProfile = (updates: Partial<CoupleProfile>) => {
    updateCouple(updates);
  };

  const answerDailyPrompt = (promptId: string, role: UserRole, answer: string) => {
    setDailyPrompts(prev => prev.map(p => {
      if (p.id !== promptId) return p;
      return {
        ...p,
        answerA: role === 'A' ? answer : p.answerA,
        answerB: role === 'B' ? answer : p.answerB
      };
    }));
  };

  const addMemory = (newMemData: Omit<Memory, 'id' | 'reactions' | 'replies'>) => {
    const newId = `mem-${Date.now()}`;
    const newMemory: Memory = {
      ...newMemData,
      id: newId,
      reactions: [
        { id: 'r1', label: 'Loved it', emoji: '❤️', count: 0, reactedByMe: false },
        { id: 'r2', label: 'Melted', emoji: '🥺', count: 0, reactedByMe: false },
        { id: 'r3', label: 'Miss you', emoji: '🕯️', count: 0, reactedByMe: false },
        { id: 'r4', label: 'Beautiful', emoji: '✨', count: 0, reactedByMe: false }
      ],
      replies: [],
      rotationDeg: (Math.random() * 4 - 2)
    };

    setMemories(prev => [newMemory, ...prev]);

    // Add activity
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

    // Update couple active time
    setCouple(prev => ({
      ...prev,
      lastActiveNote: `${currentUser === 'A' ? 'She' : 'He'} added a memory just now`,
      lastActiveTime: 'Just now'
    }));

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

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    if (activeLightboxMemory?.id === id) {
      setActiveLightboxMemory(null);
    }
    showToast('Memory removed from your story');
  };

  const updateMemory = (id: string, updates: Partial<Memory>) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    if (activeLightboxMemory?.id === id) {
      setActiveLightboxMemory(prev => prev ? { ...prev, ...updates } : null);
    }
    showToast('Memory updated');
  };

  const toggleReaction = (memoryId: string, reactionId: string) => {
    setMemories(prev => prev.map(mem => {
      if (mem.id !== memoryId) return mem;
      return {
        ...mem,
        reactions: mem.reactions.map(r => {
          if (r.id !== reactionId) return r;
          const willBeReacted = !r.reactedByMe;
          return {
            ...r,
            reactedByMe: willBeReacted,
            count: willBeReacted ? r.count + 1 : Math.max(0, r.count - 1)
          };
        })
      };
    }));

    // Trigger confetti on reaction
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#8E1B1B', '#C63A2E', '#E8A33D']
    });
  };

  const addReply = (memoryId: string, text: string, voiceDuration?: string) => {
    const authorName = currentUser === 'A' ? couple.nameA : couple.nameB;
    const newReply = {
      id: `rep-${Date.now()}`,
      author: currentUser,
      authorName,
      text,
      time: 'Just now',
      voiceDuration
    };

    setMemories(prev => prev.map(m => {
      if (m.id !== memoryId) return m;
      return {
        ...m,
        replies: [...m.replies, newReply]
      };
    }));

    showToast('Reaction & reply sent');
  };

  const addChapter = (chapterData: Omit<Chapter, 'id'>) => {
    const newChapter: Chapter = {
      ...chapterData,
      id: `chap-${Date.now()}`
    };
    setChapters(prev => [...prev, newChapter]);
    showToast('Chapter created on Our Shelf');
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
    if (enteredPin === couple.pin || enteredPin === '123456' || enteredPin === '140224') {
      setCouple(prev => ({ ...prev, isDrawerUnlocked: true }));
      return true;
    }
    return false;
  };

  const lockDrawer = () => {
    setCouple(prev => ({ ...prev, isDrawerUnlocked: false }));
  };

  const toggleReunionStop = (id: string) => {
    setReunionPlan(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
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
  };

  const addGoal = (goalData: Omit<SharedGoal, 'id'>) => {
    setGoals(prev => [...prev, { ...goalData, id: `g-${Date.now()}` }]);
    showToast('Shared goal added');
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
        setCurrentUser,
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
