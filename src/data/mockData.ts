import { CoupleProfile, Memory, Chapter, DrawerItem, ParallelMoment, ReunionStop, SharedGoal, PromiseItem, ActivityEvent, DailyPrompt } from '../types';

export const INITIAL_COUPLE: CoupleProfile = {
  id: 'couple-1402',
  nameA: 'Emma',
  nameB: 'Liam',
  initials: 'E & L',
  emailA: 'emma@email.com',
  emailB: 'liam@email.com',
  avatarA: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  avatarB: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  togetherSince: '2024-05-16',
  startDate: '2024-05-16',
  cityA: 'Mumbai, India',
  cityB: 'London, UK',
  distance: '7,192 km (4,469 mi)',
  flightDuration: '9 hrs 15 min flight',
  timezoneDiff: '4.5 hrs time difference',
  reunionDistance: 'Closing 7,192 km to meet in Ahmedabad',
  reunionDate: '2026-12-25T20:00:00',
  reunionLocation: 'Ahmedabad, India',
  reunionTitle: 'Home is wherever we\'re together',
  inviteCode: 'ab12cd34ef',
  isPartnerJoined: true,
  theme: 'rose',
  fontStyle: 'elegant',
  streakCount: 42,
  streakDays: [true, true, true, true, true, true, false], // Mon-Sun
  lastActiveNote: 'She left this here 24 min ago',
  lastActiveTime: '24 min ago',
  pin: '140224',
  drawerPin: '140224',
  isDrawerUnlocked: true,
  plan: 'premium',
  coverPhoto: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80'
};

export const INITIAL_DAILY_PROMPTS: DailyPrompt[] = [
  {
    id: 'dp-1',
    date: '20 Aug 2026',
    question: 'What is one tiny thing about us that you felt grateful for today?',
    answerA: 'The voice note you sent while making your morning coffee. Your sleepy laugh made my whole day start right.',
    answerB: 'How we always look at the sky at the exact same hour even with 4 time zones between us.'
  },
  {
    id: 'dp-2',
    date: '19 Aug 2026',
    question: 'What song immediately takes you back to our favorite memory?',
    answerA: 'Yellow by Coldplay. Always and forever.',
    answerB: 'Whenever I hear acoustic guitar playing softly in any café.'
  }
];

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-1',
    title: 'Sunset date by the beach',
    caption: 'Missing you a little extra today.',
    author: 'A',
    authorName: 'Emma',
    kind: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80',
    date: '20 Aug 2026',
    time: '7:45 PM',
    location: 'Goa, India',
    chapterId: 'chap-1',
    isFavorite: true,
    rotationDeg: -1.5,
    reactions: [
      { id: 'r1', label: 'Loved it', emoji: '❤️', count: 1, reactedByMe: true },
      { id: 'r2', label: 'Melted', emoji: '🥺', count: 1, reactedByMe: true },
      { id: 'r3', label: 'Miss you', emoji: '🕯️', count: 0, reactedByMe: false },
      { id: 'r4', label: 'Beautiful', emoji: '✨', count: 1, reactedByMe: false }
    ],
    replies: [
      {
        id: 'rep-1',
        author: 'B',
        authorName: 'Liam',
        text: 'This made my whole evening. Thank you for thinking of me. ♡',
        time: '20 min ago',
        voiceDuration: '0:15'
      }
    ]
  },
  {
    id: 'mem-2',
    title: 'A little sunset for you',
    caption: 'The sky looked like this and I thought of you.',
    author: 'A',
    authorName: 'Emma',
    kind: 'voice',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    audioDuration: '0:28',
    date: '20 Aug 2026',
    time: '8:14 PM',
    location: 'The Window',
    chapterId: 'chap-1',
    isFavorite: true,
    rotationDeg: 1.2,
    reactions: [
      { id: 'r1', label: 'Loved it', emoji: '❤️', count: 2, reactedByMe: true }
    ],
    replies: []
  },
  {
    id: 'mem-3',
    title: 'A note for you',
    caption: 'You don\'t have to say anything. Just being here is enough. ♡',
    author: 'B',
    authorName: 'Liam',
    kind: 'note',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    date: '18 Aug 2026',
    time: '11:20 PM',
    location: 'Cozy Corner',
    chapterId: 'chap-1',
    isFavorite: false,
    rotationDeg: -2,
    reactions: [
      { id: 'r1', label: 'Loved it', emoji: '❤️', count: 1, reactedByMe: true }
    ],
    replies: []
  },
  {
    id: 'mem-4',
    title: 'Thursday evenings',
    caption: 'Quiet coffee and our favorite playlist playing in the background.',
    author: 'A',
    authorName: 'Emma',
    kind: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    date: '14 Aug 2026',
    time: '6:30 PM',
    location: 'Our Café',
    chapterId: 'chap-1',
    isFavorite: true,
    rotationDeg: 0.8,
    reactions: [
      { id: 'r1', label: 'Loved it', emoji: '❤️', count: 2, reactedByMe: true }
    ],
    replies: []
  },
  {
    id: 'mem-5',
    title: 'Long walks',
    caption: 'Chasing the golden horizon until stars took over.',
    author: 'B',
    authorName: 'Liam',
    kind: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    date: '10 Aug 2026',
    time: '7:15 PM',
    location: 'Marine Drive, Mumbai',
    chapterId: 'chap-2',
    isFavorite: false,
    rotationDeg: -1,
    reactions: [],
    replies: []
  },
  {
    id: 'mem-6',
    title: 'Morning talks',
    caption: 'Warm mugs, sleepy smiles, and zero rush.',
    author: 'A',
    authorName: 'Emma',
    kind: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    date: '5 Aug 2026',
    time: '8:45 AM',
    location: 'Kitchen Island',
    chapterId: 'chap-1',
    isFavorite: false,
    rotationDeg: 1.5,
    reactions: [],
    replies: []
  },
  {
    id: 'mem-7',
    title: 'Dancing in the rain',
    caption: 'Completely drenched and laughing our hearts out.',
    author: 'B',
    authorName: 'Liam',
    kind: 'video',
    videoDuration: '0:24',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    date: '28 Jul 2026',
    time: '5:10 PM',
    location: 'Old Town Square',
    chapterId: 'chap-2',
    isFavorite: true,
    rotationDeg: -0.5,
    reactions: [
      { id: 'r1', label: 'Loved it', emoji: '❤️', count: 1, reactedByMe: true }
    ],
    replies: []
  },
  {
    id: 'mem-8',
    title: 'Little us',
    caption: 'Photo booth strips we promised to keep forever in our wallet.',
    author: 'A',
    authorName: 'Emma',
    kind: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    date: '15 Jul 2026',
    time: '9:00 PM',
    location: 'Arcade Booth',
    chapterId: 'chap-3',
    isFavorite: true,
    rotationDeg: 2,
    reactions: [],
    replies: []
  }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: 'chap-1',
    title: 'The Window',
    subtitle: 'The little moments that felt like home. The talks, the sunsets, the quiet.',
    coverImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    startDate: 'May 2024',
    endDate: 'Aug 2026',
    theme: 'Home & Everyday',
    spineColor: '#8E1B1B',
    memoryIds: ['mem-1', 'mem-2', 'mem-3', 'mem-4', 'mem-6']
  },
  {
    id: 'chap-2',
    title: 'Little Escapes',
    subtitle: 'Unplanned drives, salt in our hair, and sunset walks.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    startDate: 'Nov 2024',
    endDate: 'Feb 2025',
    theme: 'Travel & Trips',
    spineColor: '#C63A2E',
    memoryIds: ['mem-5', 'mem-7']
  },
  {
    id: 'chap-3',
    title: 'Firsts',
    subtitle: 'The first coffee, the awkward shy smiles, the exact second everything changed.',
    coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    startDate: 'May 2024',
    endDate: 'Jun 2024',
    theme: 'Beginnings',
    spineColor: '#6E5B52',
    memoryIds: ['mem-8']
  }
];

export const INITIAL_DRAWER_ITEMS: DrawerItem[] = [
  {
    id: 'draw-1',
    category: 'open_when',
    title: 'When you miss me',
    body: 'I know some days get heavy. When that happens, I just want you to know that I am here, always. You are stronger than you think. I love you. ♡',
    author: 'B',
    authorName: 'Liam',
    condition: 'When you miss me',
    unlockDate: '25 Dec 2026 • 08:00 PM',
    isLocked: false,
    createdAt: '2 days ago',
    audioDuration: '0:35'
  },
  {
    id: 'draw-2',
    category: 'love_letters',
    title: 'For the days you feel low',
    body: 'Whenever you need me, I\'m here. Close your eyes, take three deep breaths, and remember our sunset by the sea.',
    author: 'A',
    authorName: 'Emma',
    isLocked: false,
    createdAt: '2 days ago'
  },
  {
    id: 'draw-3',
    category: 'love_letters',
    title: 'Reasons I\'m proud of you',
    body: 'The things I never want you to forget: your kindness to strangers, how passionately you work, and how safe you make me feel.',
    author: 'A',
    authorName: 'Emma',
    isLocked: false,
    createdAt: 'May 18'
  },
  {
    id: 'draw-4',
    category: 'love_letters',
    title: 'A letter for our anniversary',
    body: 'For the day we look back at everything we built through the distance and smile knowing we made it.',
    author: 'B',
    authorName: 'Liam',
    isLocked: true,
    unlockDate: '16 May 2027',
    createdAt: 'Locked'
  },
  {
    id: 'draw-5',
    category: 'time_capsule',
    title: 'Our Year Together',
    body: 'For the us who made it through everything. Sealed with 4 photos, 2 voice notes, and 1 promise.',
    author: 'A',
    authorName: 'Emma',
    isLocked: true,
    unlockDate: '25 Dec 2027 • 10:00 AM',
    createdAt: '7 May 2025',
    sealedMemoriesCount: 4
  }
];

export const INITIAL_PARALLEL_MOMENTS: ParallelMoment[] = [
  {
    id: 'par-1',
    date: 'August 20, 2026',
    time: '8:14 PM',
    timeAgo: '24 min ago',
    momentA: {
      location: 'The Window',
      title: 'A little sunset for you ♡',
      description: 'The sky looked like this and I thought of you.',
      photo: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      audioDuration: '0:28',
      timeAgo: 'She was here 24 min ago'
    },
    momentB: {
      location: 'Beach Walk',
      title: 'The ocean was golden ♡',
      description: 'Waves, wind, and a thought of you.',
      photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      audioDuration: '0:31',
      timeAgo: 'He was here 24 min ago'
    }
  }
];

export const INITIAL_REUNION_PLAN: ReunionStop[] = [
  {
    id: 'reu-prep-1',
    time: 'D-18',
    daysToGo: '18 days to go',
    title: 'Book reunion dinner rooftop table',
    description: 'Reserve sunset table by the waterfront with cozy lights.',
    iconName: 'Utensils',
    category: 'prep',
    assignedTo: 'both',
    dueDate: '7 Dec 2026',
    completed: true
  },
  {
    id: 'reu-prep-2',
    time: 'D-10',
    daysToGo: '10 days to go',
    title: 'Pack handwritten letters & surprises',
    description: 'Keep the golden envelope sealed until we sit together.',
    iconName: 'Gift',
    category: 'pack',
    assignedTo: 'A',
    dueDate: '15 Dec 2026',
    completed: true
  },
  {
    id: 'reu-prep-3',
    time: 'D-2',
    daysToGo: '2 days to go',
    title: 'Confirm flight tickets & boarding pass',
    description: 'Download offline playlist & coordinate airport pickup.',
    iconName: 'Plane',
    category: 'flight',
    assignedTo: 'B',
    dueDate: '23 Dec 2026',
    completed: false
  },
  {
    id: 'reu-1',
    time: '08:00 PM (D-Day)',
    daysToGo: 'Reunion Day',
    title: 'Airport Arrival & The Big Hug',
    description: 'The moment it all begins. Running across the terminal into your arms.',
    iconName: 'Plane',
    category: 'date',
    assignedTo: 'both',
    dueDate: '25 Dec 2026',
    completed: false
  },
  {
    id: 'reu-2',
    time: '09:15 PM',
    daysToGo: 'Reunion Day',
    title: 'Our Late Night Café',
    description: 'Coffee, hot chocolate, stories, and hugs that don\'t let go.',
    iconName: 'Coffee',
    category: 'date',
    assignedTo: 'both',
    dueDate: '25 Dec 2026',
    completed: false
  },
  {
    id: 'reu-3',
    time: '10:30 PM',
    daysToGo: 'Reunion Day',
    title: 'Sanctuary Suite Check-in',
    description: 'Freshen up, unpack gifts, and take a peaceful breath together.',
    iconName: 'Hotel',
    category: 'stay',
    assignedTo: 'both',
    dueDate: '25 Dec 2026',
    completed: false
  },
  {
    id: 'reu-4',
    time: 'Day 2 • 08:00 AM',
    daysToGo: 'Day +1',
    title: 'Sunrise Walk & Breakfast',
    description: 'Holding hands in the morning warmth with nowhere else to rush to.',
    iconName: 'Heart',
    category: 'activity',
    assignedTo: 'both',
    dueDate: '26 Dec 2026',
    completed: false
  },
  {
    id: 'reu-5',
    time: 'Day 2 • 07:30 PM',
    daysToGo: 'Day +1',
    title: 'Candlelight Dinner & Letter Exchange',
    description: 'Exchange our Open When sealed envelopes and celebrate closing the distance.',
    iconName: 'Gift',
    category: 'surprise',
    assignedTo: 'both',
    dueDate: '26 Dec 2026',
    completed: false
  }
];

export const INITIAL_GOALS: SharedGoal[] = [
  {
    id: 'g-1',
    title: 'Visit 12 dream cities together',
    description: 'Exploring cobblestone streets and midnight bakeries',
    current: 7,
    target: 12,
    unit: 'cities',
    cover: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g-2',
    title: 'Write 100 love notes',
    description: 'One little surprise note whenever heart speaks',
    current: 64,
    target: 100,
    unit: 'notes',
    cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'g-3',
    title: 'Complete our 365-day streak',
    description: 'Leaving a voice note or memory every day',
    current: 242,
    target: 365,
    unit: 'days',
    cover: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_PROMISES: PromiseItem[] = [
  {
    id: 'p-1',
    author: 'B',
    text: 'To always listen before I speak, and hold your hand when the storm gets loud.',
    madeOn: 'May 16, 2024'
  },
  {
    id: 'p-2',
    author: 'A',
    text: 'To celebrate your smallest wins as if they conquered the world.',
    madeOn: 'June 20, 2024'
  },
  {
    id: 'p-3',
    author: 'B',
    text: 'To never go to bed angry without saying "I love you" first.',
    madeOn: 'Oct 04, 2024'
  }
];

export const INITIAL_ACTIVITY: ActivityEvent[] = [
  {
    id: 'act-1',
    timeAgo: '10 min ago',
    dateGroup: 'Today',
    actor: 'A',
    actorName: 'Emma',
    type: 'memory',
    title: 'Emma added a new memory',
    subtitle: 'Sunset date by the beach ❤️ Goa, India',
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=200&q=80',
    actionText: 'View',
    actionTarget: 'memories'
  },
  {
    id: 'act-2',
    timeAgo: '42 min ago',
    dateGroup: 'Today',
    actor: 'A',
    actorName: 'Emma',
    type: 'reaction',
    title: 'Emma reacted to your memory',
    subtitle: '"Morning coffee & your sleepy smile" ☕',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=200&q=80',
    actionText: 'View',
    actionTarget: 'wall'
  },
  {
    id: 'act-3',
    timeAgo: '2 hrs ago',
    dateGroup: 'Today',
    actor: 'A',
    actorName: 'Emma',
    type: 'letter',
    title: 'Emma opened your letter',
    subtitle: '"A little note for a tough day"',
    actionText: 'View Letter',
    actionTarget: 'drawer'
  },
  {
    id: 'act-4',
    timeAgo: '3 days to unlock',
    dateGroup: 'Yesterday',
    actor: 'B',
    actorName: 'Liam',
    type: 'capsule',
    title: 'Time Capsule unlock is approaching',
    subtitle: '"Open when we\'re in a new city together"',
    badge: '3 days',
    actionText: 'View',
    actionTarget: 'drawer'
  },
  {
    id: 'act-5',
    timeAgo: '24 min ago',
    dateGroup: 'Yesterday',
    actor: 'A',
    actorName: 'Emma',
    type: 'presence',
    title: 'Your partner was here',
    subtitle: 'Last seen 24 min ago near Bandra, Mumbai'
  },
  {
    id: 'act-6',
    timeAgo: '41 days to go',
    dateGroup: '15 Aug',
    actor: 'B',
    actorName: 'Liam',
    type: 'reunion',
    title: 'Reunion countdown updated',
    subtitle: 'Mumbai Reunion • 27 Sep 2026',
    actionText: 'View Plan',
    actionTarget: 'reunion'
  }
];
