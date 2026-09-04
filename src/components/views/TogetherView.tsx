import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { PageRail } from '../common/PageRail';
import { PaperCard, HandNote } from '../common/PaperCard';
import { 
  Sparkles, 
  Heart, 
  Smile, 
  Coffee, 
  Music, 
  Play, 
  Pause, 
  MessageCircle, 
  CheckCircle2, 
  Flame, 
  Moon, 
  Sun, 
  Send,
  Headphones
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TogetherView: React.FC = () => {
  const {
    currentUser,
    couple,
    showToast,
    todayPrompt,
    answerDailyPrompt
  } = usePairlum();

  const [partnerStatus, setPartnerStatus] = useState('Listening to our playlist & thinking of you');
  const [myMood, setMyMood] = useState<'Warm' | 'Cozy' | 'Missing you' | 'In love' | 'Tired'>('Missing you');
  const [isPlayingSyncAudio, setIsPlayingSyncAudio] = useState(false);
  const [dailyAnswerInput, setDailyAnswerInput] = useState('');

  const moods: Array<'Warm' | 'Cozy' | 'Missing you' | 'In love' | 'Tired'> = ['Warm', 'Cozy', 'Missing you', 'In love', 'Tired'];

  const handleSaveAnswer = () => {
    if (!dailyAnswerInput.trim() || !todayPrompt) return;
    answerDailyPrompt(todayPrompt.id, currentUser, dailyAnswerInput);
    setDailyAnswerInput('');
    confetti({ particleCount: 30 });
    showToast('Your answer was added to today’s parchment ♡');
  };

  const handleSendHeartPulse = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#8E1B1B', '#C63A2E', '#E8A33D']
    });
    showToast(`Sent a real-time heartbeat tap to ${currentUser === 'A' ? couple.nameB : couple.nameA} ♡`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20">
      
      {/* Left PageRail */}
      <PageRail
        step="06 / 06"
        categoryLabel="DAILY INTIMACY"
        title="Together"
        subtitle="Stay close every single day with shared music, daily questions, and gentle heartbeat pulses."
        quote="Even in silence, you are my favorite company."
        quoteAuthor="Emma & Liam"
        illustrationSrc="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80"
        illustrationCaption="Connected in real time ♡"
      >
        {/* Real-time Status Card */}
        <div className="p-4 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#1C110E] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Partner Live</span>
            </span>
            <span className="text-[10px] text-[#6E5B52]">Active now</span>
          </div>

          <p className="text-xs text-[#1C110E] font-medium bg-white p-2.5 rounded-xl border border-[#E7D9C9]">
            "{partnerStatus}"
          </p>

          <button
            onClick={handleSendHeartPulse}
            className="w-full py-2 rounded-xl bg-[#8E1B1B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#751515]"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Send Heartbeat Pulse</span>
          </button>
        </div>

        {/* Sync Audio Mini */}
        <div className="pt-2">
          <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#E7D9C9] space-y-2 text-xs">
            <span className="text-[10px] font-bold text-[#8E1B1B] uppercase tracking-wider flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" />
              <span>Sync Audio Room</span>
            </span>
            <p className="text-[#1C110E] font-medium">Yellow — Coldplay</p>
            <button
              onClick={() => setIsPlayingSyncAudio(!isPlayingSyncAudio)}
              className="w-full py-1.5 rounded-lg bg-[#F7EFE4] text-[#8E1B1B] font-semibold text-[11px] flex items-center justify-center gap-1 cursor-pointer"
            >
              {isPlayingSyncAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-[#8E1B1B]" />}
              <span>{isPlayingSyncAudio ? 'Listening together' : 'Play in Sync'}</span>
            </button>
          </div>
        </div>
      </PageRail>

      {/* Main Area */}
      <main className="flex-1 space-y-8">
        
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-[#8E1B1B] uppercase tracking-wider">DAILY RITUALS</span>
          <h2 className="font-display text-4xl sm:text-5xl text-[#1C110E] font-medium mt-1">
            Together, today.
          </h2>
          <p className="text-sm text-[#6E5B52] mt-1">
            Small questions, synchronized listening, and quiet check-ins.
          </p>
        </div>

        {/* Mood Check-In Bar (Screenshot 20) */}
        <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-[#1C110E]">
              How are you feeling right now?
            </h3>
            <span className="text-xs text-[#8E1B1B] font-medium font-script text-base">updates for both of you</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMyMood(m);
                  showToast(`Mood updated to "${m}"`);
                }}
                className={`py-3 px-4 rounded-2xl text-xs font-medium transition-all text-center cursor-pointer ${
                  myMood === m
                    ? 'bg-[#8E1B1B] text-white shadow-sm ring-2 ring-[#8E1B1B]/30'
                    : 'bg-white border border-[#E7D9C9] text-[#1C110E] hover:border-[#8E1B1B]'
                }`}
              >
                <span className="block text-base mb-1">
                  {m === 'Warm' ? '☀️' : m === 'Cozy' ? '☕' : m === 'Missing you' ? '🕊️' : m === 'In love' ? '❤️' : '🌙'}
                </span>
                <span>{m}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Question of the Day (Screenshot 21) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFBF5] border border-[#E7D9C9] warm-shadow-lg stationery-lines space-y-6">
          {!todayPrompt ? (
            <p className="text-xs text-[#6E5B52]">Preparing today's question…</p>
          ) : (
          <>
          <div className="flex items-center justify-between border-b border-[#E7D9C9] pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E1B1B] font-bold">
                DAILY QUESTION • {todayPrompt.date}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-[#1C110E] font-medium mt-1">
                "{todayPrompt.question}"
              </h3>
            </div>
            <Sparkles className="w-5 h-5 text-[#8E1B1B]" />
          </div>

          {/* Answers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Emma's Answer */}
            <div className="p-5 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-2 relative">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#8E1B1B] font-sans">{couple.nameA}'s answer</span>
                <span className="text-[10px] text-[#6E5B52]">Today</span>
              </div>
              <p className="font-script text-xl text-[#1C110E] leading-snug">
                {todayPrompt.answerA ? `"${todayPrompt.answerA}"` : 'Not answered yet.'}
              </p>
              <div className="w-5 h-5 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center text-[10px] absolute bottom-3 right-3 font-serif">
                ♡
              </div>
            </div>

            {/* Liam's Answer */}
            <div className="p-5 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-2 relative">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#8E1B1B] font-sans">{couple.nameB}'s answer</span>
                <span className="text-[10px] text-[#6E5B52]">Today</span>
              </div>
              <p className="font-script text-xl text-[#1C110E] leading-snug">
                {todayPrompt.answerB ? `"${todayPrompt.answerB}"` : 'Not answered yet.'}
              </p>
              <div className="w-5 h-5 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center text-[10px] absolute bottom-3 right-3 font-serif">
                ♡
              </div>
            </div>

          </div>

          {/* Answer input for current user */}
          <div className="pt-2 flex gap-3">
            <input
              type="text"
              value={dailyAnswerInput}
              onChange={(e) => setDailyAnswerInput(e.target.value)}
              placeholder={`Add or update your thoughts, ${currentUser === 'A' ? couple.nameA : couple.nameB}...`}
              className="flex-1 px-4 py-3 rounded-2xl bg-white border border-[#E7D9C9] text-xs"
            />
            <button
              onClick={handleSaveAnswer}
              className="px-6 py-3 rounded-2xl bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Add</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          </>
          )}
        </div>

        {/* Micro-Rituals & Nightly Check-in */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-3">
            <h4 className="font-display text-lg font-semibold text-[#1C110E] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#8E1B1B]" />
              <span>Today's Micro-Rituals</span>
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E7D9C9] cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#8E1B1B]" />
                <span className="text-[#1C110E]">Send a good morning voice note</span>
              </label>
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E7D9C9] cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#8E1B1B]" />
                <span className="text-[#1C110E]">Share sunset photo from your window</span>
              </label>
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E7D9C9] cursor-pointer">
                <input type="checkbox" className="accent-[#8E1B1B]" />
                <span className="text-[#1C110E]">Light our digital sanctuary candle at 9 PM</span>
              </label>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#1C110E] text-white space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-300" />
                <span>Goodnight Note</span>
              </h4>
              <span className="text-[10px] text-amber-300 font-mono">11:00 PM</span>
            </div>
            <p className="text-xs text-white/80 font-script text-lg">
              "Sleep well my love. One day closer to holding you again."
            </p>
            <div className="pt-2 flex justify-between items-center text-xs text-white/60">
              <span>Sealed for tonight</span>
              <span className="text-[#E8A33D]">♡</span>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
};
