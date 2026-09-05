import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import {
  Heart,
  Plus,
  Image as ImageIcon,
  BookOpen,
  MapPin,
  Lock,
  Calendar,
  Sparkles,
  Play,
  Pause,
  Eye,
  Mic,
  Video,
  FileText,
  ArrowRight,
  Flame,
  CheckCircle2,
  Camera
} from 'lucide-react';
import { PaperCard, HandNote } from '../common/PaperCard';

export const HomeView: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    couple,
    memories,
    openAddMemoryModal,
    setActiveLightboxMemory,
    windowOpened,
    setWindowOpened
  } = usePairlum();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentPartnerName = currentUser === 'A' ? couple.nameA : couple.nameB;
  const otherPartnerName = currentUser === 'A' ? couple.nameB : couple.nameA;
  const otherPronoun = currentUser === 'A' ? 'He' : 'She';

  const safeMemories = memories || [];
  const windowMemory = safeMemories.find(m => m.location === 'The Window') || safeMemories[0] || {
    id: 'mem-default',
    title: 'A little sunset for you',
    caption: 'The sky looked like this and I thought of you.',
    author: 'A' as const,
    authorName: 'Emma',
    kind: 'photo' as const,
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    date: '20 Aug 2026',
    time: '8:14 PM',
    location: 'The Window',
    reactions: [],
    replies: []
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20">

      {/* 1. HERO SECTION (Screenshot 20) */}
      <section className="relative pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C63A2E] animate-pulse" />
              <span>{otherPronoun} was here {couple.lastActiveTime}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl text-[#1C110E] font-medium leading-[1.15] tracking-tight">
              {couple.initials}, <br />
              <span className="text-[#8E1B1B] italic">you're home.</span> ♡
            </h1>

            <p className="text-base sm:text-lg text-[#6E5B52] leading-relaxed max-w-lg">
              This is where your story begins. Fill this space with little moments, big memories, and everything in between.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-add-memory-button"
                onClick={() => openAddMemoryModal('photo')}
                className="px-6 py-3.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Add Your First Memory</span>
                <Heart className="w-4 h-4 fill-white" />
              </button>

              <button
                id="hero-leave-note-button"
                onClick={() => openAddMemoryModal('note')}
                className="px-5 py-3.5 rounded-full bg-[#FFFBF5] border border-[#E7D9C9] text-xs font-medium text-[#1C110E] hover:border-[#8E1B1B] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Leave Something for {otherPartnerName}</span>
                <span className="text-[#8E1B1B]">✎</span>
              </button>
            </div>

            {/* Streak & Milestone pills */}
            <div className="flex flex-wrap items-center gap-3 pt-4 text-xs text-[#6E5B52]">
              <div className="flex items-center gap-1.5 bg-[#F7EFE4] px-3 py-1.5 rounded-full border border-[#E7D9C9]">
                <Flame className="w-4 h-4 text-[#E8A33D] fill-[#E8A33D]" />
                <span><strong className="text-[#1C110E]">{couple.streakCount} days</strong> streak</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F7EFE4] px-3 py-1.5 rounded-full border border-[#E7D9C9]">
                <Heart className="w-4 h-4 text-[#8E1B1B] fill-[#8E1B1B]" />
                <span>Together since <strong className="text-[#1C110E]">May 2024</strong></span>
              </div>
              <div
                onClick={() => setCurrentView('door')}
                className="flex items-center gap-1.5 bg-[#8E1B1B]/10 text-[#8E1B1B] px-3 py-1.5 rounded-full border border-[#8E1B1B]/20 cursor-pointer hover:bg-[#8E1B1B]/20 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span><strong>{couple.distance || '7,192 km'} apart</strong> • 18 days to reunion</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-6">
            <div className="relative p-3 bg-white rounded-3xl border border-[#E7D9C9] warm-shadow-lg rotate-[1deg] hover:rotate-0 transition-transform duration-300">
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-[#F7EFE4]">
                <img
                  src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=80"
                  alt="Couple by candle window"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-script text-2xl drop-shadow-sm">"So many moments, so many memories to come. ♡"</p>
                  <p className="text-xs text-white/80 mt-1">Our shared sanctuary • Always private</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE WINDOW INTERACTIVE WIDGET (Screenshot 16 & Prompt 3) */}
      <section className="pt-4">
        <PaperCard hasTape elevated className="p-6 sm:p-8 bg-gradient-to-br from-[#F7EFE4] to-[#FFFBF5]">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">

            {/* Left Notice */}
            <div className="space-y-3 max-w-md">
              <span className="text-[11px] font-bold text-[#8E1B1B] uppercase tracking-widest flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#8E1B1B]" />
                <span>The Window</span>
              </span>

              <h2 className="font-display text-3xl sm:text-4xl text-[#1C110E] font-medium leading-snug">
                Something changed here <br className="hidden sm:inline" />
                <span className="text-[#8E1B1B] italic">while you were away.</span>
              </h2>

              <p className="text-sm text-[#6E5B52] leading-relaxed">
                {otherPartnerName} left something for you at The Window.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={currentUser === 'A' ? (couple.avatarB || 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80') : (couple.avatarA || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80')}
                  alt={otherPartnerName}
                  className="w-9 h-9 rounded-full object-cover border border-[#E7D9C9]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#1C110E]">{otherPronoun} was here</p>
                  <p className="text-[11px] text-[#6E5B52]">{couple.lastActiveTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                {!windowOpened ? (
                  <button
                    id="open-window-button"
                    onClick={() => setWindowOpened(true)}
                    className="px-6 py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Open it</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveLightboxMemory(windowMemory)}
                    className="px-6 py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Memory Details</span>
                  </button>
                )}

                <button
                  onClick={() => openAddMemoryModal('note')}
                  className="px-4 py-2.5 rounded-full bg-[#FFFBF5] border border-[#E7D9C9] text-xs font-medium text-[#1C110E] hover:border-[#8E1B1B] cursor-pointer"
                >
                  Leave something back
                </button>
              </div>
            </div>

            {/* Right Window Memory Card Preview */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div
                onClick={() => {
                  if (windowOpened) setActiveLightboxMemory(windowMemory);
                  else setWindowOpened(true);
                }}
                className={`
                  p-3.5 bg-white rounded-2xl border border-[#E7D9C9] warm-shadow-lg transition-all duration-500 cursor-pointer
                  ${!windowOpened ? 'scale-[0.98]' : 'scale-100'}
                `}
              >
                <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#F7EFE4]">
                  <img
                    src={windowMemory.imageUrl || 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80'}
                    alt="Window memory"
                    className={`w-full h-full object-cover transition-all duration-700 ${!windowOpened ? 'blur-md brightness-90' : 'blur-none'}`}
                  />
                  {!windowOpened && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-xs text-white p-4 text-center">
                      <Lock className="w-8 h-8 mb-2 text-amber-300" />
                      <p className="font-display text-lg font-medium">Unopened Memory</p>
                      <p className="text-xs text-white/80 font-script text-base mt-1">Tap to unfold & see</p>
                    </div>
                  )}
                </div>

                <div className="pt-3 px-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8E1B1B] font-semibold">📍 The Window</span>
                    <span className="text-[10px] text-[#6E5B52]">August 20, 8:14 PM</span>
                  </div>
                  <h4 className="font-display text-base text-[#1C110E] mt-1 font-semibold">
                    {windowOpened ? windowMemory.title : '••••••••••••••••••••'}
                  </h4>
                  <p className="font-script text-base text-[#6E5B52] truncate mt-0.5">
                    {windowOpened ? windowMemory.caption : 'Waiting for you to open...'}
                  </p>

                  {/* Audio mini bar */}
                  {windowOpened && windowMemory.audioDuration && (
                    <div className="mt-2.5 p-2 rounded-xl bg-[#F7EFE4] flex items-center gap-2 text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlayingAudio(!isPlayingAudio);
                        }}
                        className="w-6 h-6 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center"
                      >
                        {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white ml-0.5" />}
                      </button>
                      <div className="flex-1 h-2 bg-[#E7D9C9] rounded-full overflow-hidden">
                        <div className={`h-full bg-[#8E1B1B] ${isPlayingAudio ? 'w-2/3 animate-pulse' : 'w-1/4'}`} />
                      </div>
                      <span className="text-[10px] text-[#6E5B52] font-mono">{windowMemory.audioDuration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </PaperCard>
      </section>

      {/* 3. TODAY QUICK-CAPTURE ROW (Prompt 3 & Screenshot 20) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-[#1C110E] flex items-center gap-2">
              <span>Today</span>
              <span className="text-[#8E1B1B] text-lg">♡</span>
            </h2>
            <p className="text-xs text-[#6E5B52]">Little notes for today, tomorrow, and always.</p>
          </div>

          <button
            onClick={() => openAddMemoryModal('note')}
            className="text-xs text-[#8E1B1B] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Leave something for {otherPartnerName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            id="today-quick-photo"
            onClick={() => openAddMemoryModal('photo')}
            className="p-4 rounded-2xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#1C110E]">Photo</span>
            <span className="text-[10px] text-[#6E5B52]">Capture visual</span>
          </button>

          <button
            id="today-quick-video"
            onClick={() => openAddMemoryModal('video')}
            className="p-4 rounded-2xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#1C110E]">Video</span>
            <span className="text-[10px] text-[#6E5B52]">Record moment</span>
          </button>

          <button
            id="today-quick-voice"
            onClick={() => openAddMemoryModal('voice')}
            className="p-4 rounded-2xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#1C110E]">Voice Note</span>
            <span className="text-[10px] text-[#6E5B52]">Say it warmly</span>
          </button>

          <button
            id="today-quick-note"
            onClick={() => openAddMemoryModal('note')}
            className="p-4 rounded-2xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#1C110E]">Heart Note</span>
            <span className="text-[10px] text-[#6E5B52]">Stationery words</span>
          </button>
        </div>
      </section>

      {/* 4. MAIN NAVIGATION CARDS BENTO (Screenshot 20) */}
      <section className="space-y-4 pt-4">
        <h2 className="font-display text-2xl text-[#1C110E] flex items-center gap-2">
          <span>Explore Your Space</span>
          <span className="text-[#8E1B1B] text-lg">♡</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Card: Our Wall */}
          <div
            id="card-our-wall"
            onClick={() => setCurrentView('wall')}
            className="p-6 rounded-3xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] warm-shadow transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-1.5">
                  <span>Our Wall</span>
                  <Heart className="w-3.5 h-3.5 text-[#8E1B1B]" />
                </span>
                <span className="w-8 h-8 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-[#6E5B52] leading-relaxed">
                Collect the moments that mean the most. Polaroid pins, photo strips, and handwritten notes.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#8E1B1B]">
              <ImageIcon className="w-4 h-4" />
              <span>{memories.length} pinned moments</span>
            </div>
          </div>

          {/* Card: Our Shelf */}
          <div
            id="card-our-shelf"
            onClick={() => setCurrentView('shelf')}
            className="p-6 rounded-3xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] warm-shadow transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-1.5">
                  <span>Our Shelf</span>
                  <Heart className="w-3.5 h-3.5 text-[#8E1B1B]" />
                </span>
                <span className="w-8 h-8 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-[#6E5B52] leading-relaxed">
                Chapters of your story, in the making. Bookshelves of memory albums, dates, and milestones.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#8E1B1B]">
              <BookOpen className="w-4 h-4" />
              <span>3 active chapters</span>
            </div>
          </div>

          {/* Card: Our Places */}
          <div
            id="card-our-places"
            onClick={() => setCurrentView('places')}
            className="p-6 rounded-3xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] warm-shadow transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-1.5">
                  <span>Our Places</span>
                  <Heart className="w-3.5 h-3.5 text-[#8E1B1B]" />
                </span>
                <span className="w-8 h-8 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-[#6E5B52] leading-relaxed">
                Every place, a memory waiting to happen. Paper maps, coordinates, and parallel moments.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#8E1B1B]">
              <MapPin className="w-4 h-4" />
              <span>Goa, Mumbai, Ahmedabad</span>
            </div>
          </div>

          {/* Card: The Drawer */}
          <div
            id="card-the-drawer"
            onClick={() => setCurrentView('drawer')}
            className="p-6 rounded-3xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] warm-shadow transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-1.5">
                  <span>The Drawer</span>
                  <Lock className="w-3.5 h-3.5 text-[#8E1B1B]" />
                </span>
                <span className="w-8 h-8 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-[#6E5B52] leading-relaxed">
                Private little things only you two share. Time capsules, Open When envelopes, and secret vows.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#8E1B1B]">
              <Lock className="w-4 h-4" />
              <span>PIN protected & encrypted</span>
            </div>
          </div>

          {/* Card: The Door / Reunion */}
          <div
            id="card-the-door"
            onClick={() => setCurrentView('door')}
            className="p-6 rounded-3xl bg-gradient-to-br from-[#F7EFE4] to-[#EFE4D6] border border-[#E8A33D]/50 candle-glow transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-1.5">
                  <span>The Door</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
                </span>
                <span className="w-8 h-8 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-[#6E5B52] leading-relaxed">
                Bridging {couple.distance || '7,192 km'} to our next reunion in {couple.reunionLocation || 'Ahmedabad'}. Curate songs, letters, and milestones.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs font-semibold text-[#8E1B1B]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#E8A33D]" />
                <span>18 days to reunion</span>
              </div>
              <span className="text-[11px] font-mono bg-[#8E1B1B]/10 px-2.5 py-0.5 rounded-full">
                {couple.distance || '7,192 km'} apart
              </span>
            </div>
          </div>

          {/* Card: Together Dashboard */}
          <div
            id="card-together"
            onClick={() => setCurrentView('together')}
            className="p-6 rounded-3xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] warm-shadow transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-1.5">
                  <span>Together</span>
                  <Heart className="w-3.5 h-3.5 text-[#8E1B1B]" />
                </span>
                <span className="w-8 h-8 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-[#6E5B52] leading-relaxed">
                Relationship health, shared promises, love languages, and couple milestones.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-[#8E1B1B]">
              <Heart className="w-4 h-4" />
              <span>Love Level: ∞</span>
            </div>
          </div>

        </div>
      </section>



    </div>
  );
};
