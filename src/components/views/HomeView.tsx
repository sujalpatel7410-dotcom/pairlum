import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import {
  Heart,
  Lock,
  Sparkles,
  Play,
  Pause,
  Eye,
  Mic,
  Video,
  FileText,
  ArrowRight,
  Flame,
  Camera
} from 'lucide-react';
import { PaperCard, HandNote } from '../common/PaperCard';
import { formatMonthYear } from '../../lib/format';

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
  const togetherSinceLabel = formatMonthYear(couple.startDate) || couple.togetherSince || 'day one';
  const reunionDate = couple.reunionDate ? new Date(couple.reunionDate) : null;
  const daysToReunion = reunionDate && !isNaN(reunionDate.getTime())
    ? Math.max(0, Math.ceil((reunionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;
  const reunionCountdownLabel = daysToReunion !== null
    ? `${daysToReunion} day${daysToReunion === 1 ? '' : 's'} to reunion`
    : 'reunion date not set';
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
        <div className="max-w-2xl">

          {/* Hero Content */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E11D48]/10 text-[#E11D48] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              <span>{otherPronoun} was here {couple.lastActiveTime}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl text-[#4A0420] font-medium leading-[1.15] tracking-tight">
              {couple.initials}, <br />
              <span className="text-[#E11D48] italic">you're home.</span> ♡
            </h1>

            <p className="text-base sm:text-lg text-[#8A4058] leading-relaxed max-w-lg">
              This is where your story begins. Fill this space with little moments, big memories, and everything in between.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-add-memory-button"
                onClick={() => openAddMemoryModal('photo')}
                className="px-6 py-3.5 rounded-full bg-[#E11D48] hover:bg-[#C81E45] text-white text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Add Your First Memory</span>
                <Heart className="w-4 h-4 fill-white" />
              </button>

              <button
                id="hero-leave-note-button"
                onClick={() => openAddMemoryModal('note')}
                className="px-5 py-3.5 rounded-full bg-[#FFD3DE] border border-[#F4A9BF] text-xs font-medium text-[#4A0420] hover:border-[#E11D48] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Leave Something for {otherPartnerName}</span>
                <span className="text-[#E11D48]">✎</span>
              </button>
            </div>

            {/* Streak & Milestone pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-4 text-xs text-[#8A4058]">
              <div className="flex items-center gap-1.5 bg-[#FFB8CB] px-3 py-1.5 rounded-full border border-[#F4A9BF]">
                <Flame className="w-4 h-4 text-[#FFC145] fill-[#FFC145]" />
                <span><strong className="text-[#4A0420]">{couple.streakCount} days</strong> streak</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#FFB8CB] px-3 py-1.5 rounded-full border border-[#F4A9BF]">
                <Heart className="w-4 h-4 text-[#E11D48] fill-[#E11D48]" />
                <span>Together since <strong className="text-[#4A0420]">{togetherSinceLabel}</strong></span>
              </div>
              <button
                onClick={() => setCurrentView('door')}
                className="flex items-center gap-1.5 bg-[#FFB8CB] px-3 py-1.5 rounded-full border border-[#F4A9BF] hover:border-[#E11D48]/40 hover:bg-[#F0E4D3] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
                <span className="text-[#E11D48]"><strong>{couple.distance || '7,192 km'} apart</strong> • {reunionCountdownLabel}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE WINDOW INTERACTIVE WIDGET (Screenshot 16 & Prompt 3) */}
      <section>
        <PaperCard hasTape elevated className="p-6 sm:p-8 bg-gradient-to-br from-[#FFB8CB] to-[#FFD3DE]">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">

            {/* Left Notice */}
            <div className="space-y-3 max-w-md">
              <span className="text-[11px] font-bold text-[#E11D48] uppercase tracking-widest flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#E11D48]" />
                <span>The Window</span>
              </span>

              <h2 className="font-display text-3xl sm:text-4xl text-[#4A0420] font-medium leading-snug">
                Something changed here <br className="hidden sm:inline" />
                <span className="text-[#E11D48] italic">while you were away.</span>
              </h2>

              <p className="text-sm text-[#8A4058] leading-relaxed">
                {otherPartnerName} left something for you at The Window.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={currentUser === 'A' ? (couple.avatarB || 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80') : (couple.avatarA || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80')}
                  alt={otherPartnerName}
                  className="w-9 h-9 rounded-full object-cover border border-[#F4A9BF]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#4A0420]">{otherPronoun} was here</p>
                  <p className="text-[11px] text-[#8A4058]">{couple.lastActiveTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                {!windowOpened ? (
                  <button
                    id="open-window-button"
                    onClick={() => setWindowOpened(true)}
                    className="px-6 py-2.5 rounded-full bg-[#E11D48] hover:bg-[#C81E45] text-white text-xs font-semibold tracking-wide shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Open it</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveLightboxMemory(windowMemory)}
                    className="px-6 py-2.5 rounded-full bg-[#E11D48] hover:bg-[#C81E45] text-white text-xs font-semibold tracking-wide shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Memory Details</span>
                  </button>
                )}

                <button
                  onClick={() => openAddMemoryModal('note')}
                  className="px-4 py-2.5 rounded-full bg-[#FFD3DE] border border-[#F4A9BF] text-xs font-medium text-[#4A0420] hover:border-[#E11D48] cursor-pointer"
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
                  p-3.5 bg-white rounded-2xl border border-[#F4A9BF] warm-shadow-lg transition-all duration-500 cursor-pointer
                  ${!windowOpened ? 'scale-[0.98]' : 'scale-100'}
                `}
              >
                <div className="relative rounded-xl overflow-hidden aspect-4/3 bg-[#FFB8CB]">
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
                    <span className="text-[11px] text-[#E11D48] font-semibold">📍 The Window</span>
                    <span className="text-[10px] text-[#8A4058]">August 20, 8:14 PM</span>
                  </div>
                  <h4 className="font-display text-base text-[#4A0420] mt-1 font-semibold">
                    {windowOpened ? windowMemory.title : '••••••••••••••••••••'}
                  </h4>
                  <p className="font-script text-base text-[#8A4058] truncate mt-0.5">
                    {windowOpened ? windowMemory.caption : 'Waiting for you to open...'}
                  </p>

                  {/* Audio mini bar */}
                  {windowOpened && windowMemory.audioDuration && (
                    <div className="mt-2.5 p-2 rounded-xl bg-[#FFB8CB] flex items-center gap-2 text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlayingAudio(!isPlayingAudio);
                        }}
                        className="w-6 h-6 rounded-full bg-[#E11D48] text-white flex items-center justify-center"
                      >
                        {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-white ml-0.5" />}
                      </button>
                      <div className="flex-1 h-2 bg-[#F4A9BF] rounded-full overflow-hidden">
                        <div className={`h-full bg-[#E11D48] ${isPlayingAudio ? 'w-2/3 animate-pulse' : 'w-1/4'}`} />
                      </div>
                      <span className="text-[10px] text-[#8A4058] font-mono">{windowMemory.audioDuration}</span>
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
            <h2 className="font-display text-2xl text-[#4A0420] flex items-center gap-2">
              <span>Today</span>
              <span className="text-[#E11D48] text-lg">♡</span>
            </h2>
            <p className="text-xs text-[#8A4058]">Little notes for today, tomorrow, and always.</p>
          </div>

          <button
            onClick={() => openAddMemoryModal('note')}
            className="text-xs text-[#E11D48] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Leave something for {otherPartnerName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            id="today-quick-photo"
            onClick={() => openAddMemoryModal('photo')}
            className="p-4 rounded-2xl bg-[#FFB8CB] hover:bg-[#FF9DB6] border border-[#F4A9BF] flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#4A0420]">Photo</span>
            <span className="text-[10px] text-[#8A4058]">Capture visual</span>
          </button>

          <button
            id="today-quick-video"
            onClick={() => openAddMemoryModal('video')}
            className="p-4 rounded-2xl bg-[#FFB8CB] hover:bg-[#FF9DB6] border border-[#F4A9BF] flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#4A0420]">Video</span>
            <span className="text-[10px] text-[#8A4058]">Record moment</span>
          </button>

          <button
            id="today-quick-voice"
            onClick={() => openAddMemoryModal('voice')}
            className="p-4 rounded-2xl bg-[#FFB8CB] hover:bg-[#FF9DB6] border border-[#F4A9BF] flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#4A0420]">Voice Note</span>
            <span className="text-[10px] text-[#8A4058]">Say it warmly</span>
          </button>

          <button
            id="today-quick-note"
            onClick={() => openAddMemoryModal('note')}
            className="p-4 rounded-2xl bg-[#FFB8CB] hover:bg-[#FF9DB6] border border-[#F4A9BF] flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-[#4A0420]">Heart Note</span>
            <span className="text-[10px] text-[#8A4058]">Stationery words</span>
          </button>
        </div>
      </section>

    </div>
  );
};
