export type UserRole = 'A' | 'B';

export type AppView = 
  | 'home' 
  | 'wall' 
  | 'shelf' 
  | 'places' 
  | 'drawer' 
  | 'door' 
  | 'together' 
  | 'memories' 
  | 'activity' 
  | 'reunion' 
  | 'settings' 
  | 'pricing' 
  | 'legal'
  | 'onboarding'
  | 'invite'
  | 'login'
  | 'signup'
  | 'reset_password'
  | 'door_opened'
  | 'prepare_door'
  | 'door_reaction';

export interface CoupleProfile {
  id: string;
  nameA: string;
  nameB: string;
  initials: string;
  emailA: string;
  emailB: string;
  avatarA: string;
  avatarB: string;
  togetherSince: string;
  startDate?: string;
  cityA?: string;
  cityB?: string;
  distance?: string;
  flightDuration?: string;
  timezoneDiff?: string;
  reunionDistance?: string;
  reunionDate: string;
  reunionLocation: string;
  reunionTitle: string;
  inviteCode: string;
  isPartnerJoined: boolean;
  theme: 'rose' | 'lavender' | 'ocean' | 'ivory';
  fontStyle: 'elegant' | 'modern' | 'classic';
  streakCount: number;
  streakDays: boolean[]; // 7 days (Mon-Sun)
  lastActiveNote: string;
  lastActiveTime: string;
  pin: string;
  drawerPin?: string;
  isDrawerUnlocked: boolean;
  plan: 'essential' | 'premium' | 'signature' | 'concierge';
  wallpaper?: string;
  coverPhoto: string;
}

export interface DailyPrompt {
  id: string;
  date: string;
  question: string;
  answerA: string;
  answerB: string;
}

export type MemoryKind = 'photo' | 'video' | 'voice' | 'note' | 'place' | 'moment';

export interface MemoryReaction {
  id: string;
  label: string;
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export interface MemoryReply {
  id: string;
  author: UserRole;
  authorName: string;
  text: string;
  time: string;
  voiceDuration?: string;
}

export interface Memory {
  id: string;
  title: string;
  caption: string;
  author: UserRole;
  authorName: string;
  kind: MemoryKind;
  imageUrl?: string;
  videoUrl?: string;
  audioDuration?: string;
  videoDuration?: string;
  date: string;
  time: string;
  location?: string;
  chapterId?: string;
  isFavorite?: boolean;
  isPrivate?: boolean;
  reactions: MemoryReaction[];
  replies: MemoryReply[];
  rotationDeg?: number;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  theme: string;
  spineColor: string;
  memoryIds: string[];
}

export type DrawerCategory = 
  | 'love_letters' 
  | 'open_when' 
  | 'promises' 
  | 'time_capsule' 
  | 'tickets' 
  | 'secrets';

export interface DrawerItem {
  id: string;
  category: DrawerCategory;
  title: string;
  body: string;
  author: UserRole;
  authorName: string;
  condition?: string;
  unlockDate?: string;
  isLocked: boolean;
  createdAt: string;
  audioDuration?: string;
  photoUrl?: string;
  sealedMemoriesCount?: number;
  openedAt?: string;
}

export interface ParallelMoment {
  id: string;
  date: string;
  time: string;
  timeAgo: string;
  momentA: {
    title: string;
    description: string;
    location: string;
    photo: string;
    audioDuration?: string;
    timeAgo: string;
  };
  momentB: {
    title: string;
    description: string;
    location: string;
    photo: string;
    audioDuration?: string;
    timeAgo: string;
  };
}

export interface ReunionStop {
  id: string;
  time: string;
  title: string;
  description: string;
  iconName: string;
  completed: boolean;
  daysToGo?: string;
  category?: 'flight' | 'date' | 'stay' | 'surprise' | 'activity' | 'pack' | 'prep';
  assignedTo?: 'A' | 'B' | 'both';
  dueDate?: string;
}

export interface SharedGoal {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  unit: string;
  cover: string;
}

export interface PromiseItem {
  id: string;
  author: UserRole;
  text: string;
  madeOn: string;
}

export interface ActivityEvent {
  id: string;
  timeAgo: string;
  dateGroup: 'Today' | 'Yesterday' | '15 Aug';
  actor: UserRole;
  actorName: string;
  type: 'memory' | 'reaction' | 'letter' | 'capsule' | 'presence' | 'reunion';
  title: string;
  subtitle?: string;
  thumbnail?: string;
  badge?: string;
  actionText?: string;
  actionTarget?: AppView;
}
