import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { PageRail } from '../common/PageRail';
import { PaperCard, HandNote } from '../common/PaperCard';
import {
  Sparkles,
  Heart,
  Music,
  Play,
  Pause,
  Flame,
  Moon,
  Send,
  Headphones,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudioPlayback } from '../../lib/useAudioPlayback';
import { getTodayDateKey } from '../../lib/dailyPrompts';

const MOODS: Array<'Warm' | 'Cozy' | 'Missing you' | 'In love' | 'Tired'> = ['Warm', 'Cozy', 'Missing you', 'In love', 'Tired'];
const RITUAL_LABELS = [
  'Send a good morning voice note',
  'Share sunset photo from your window',
  'Light our digital sanctuary candle at 9 PM'
];

export const TogetherView: React.FC = () => {
  const {
    currentUser,
    couple,
    doorState,
    updateCouple,
    showToast,
    todayPrompt,
    answerDailyPrompt,
    sendHeartbeat,
    goals,
    promises,
    addGoal,
    updateGoal,
    addPromise
  } = usePairlum();

  const [dailyAnswerInput, setDailyAnswerInput] = useState('');
  const musicPlayer = useAudioPlayback(doorState.musicUrl);

  const storedMood = currentUser === 'A' ? couple.moodA : couple.moodB;
  const myMood = MOODS.includes(storedMood as any) ? (storedMood as typeof MOODS[number]) : 'Cozy';
  const partnerMood = currentUser === 'A' ? couple.moodB : couple.moodA;
  const otherPartnerName = currentUser === 'A' ? couple.nameB : couple.nameA;

  const handleSetMood = (m: typeof MOODS[number]) => {
    updateCouple(currentUser === 'A' ? { moodA: m } : { moodB: m });
    showToast(`Mood updated to "${m}"`);
  };

  const today = getTodayDateKey();
  const ritualsRaw = couple.ritualsToday;
  const todaysRituals = ritualsRaw && ritualsRaw.date === today
    ? ritualsRaw
    : { date: today, A: [false, false, false], B: [false, false, false] };
  const myRituals = todaysRituals[currentUser];

  const toggleRitual = (idx: number) => {
    const mine = [...myRituals];
    mine[idx] = !mine[idx];
    updateCouple({
      ritualsToday: {
        date: today,
        A: currentUser === 'A' ? mine : todaysRituals.A,
        B: currentUser === 'B' ? mine : todaysRituals.B
      }
    });
  };

  const handleSaveAnswer = () => {
    if (!dailyAnswerInput.trim() || !todayPrompt) return;
    answerDailyPrompt(todayPrompt.id, currentUser, dailyAnswerInput);
    setDailyAnswerInput('');
    confetti({ particleCount: 30 });
    showToast('Your answer was added to today’s parchment ♡');
  };

  const handleSendHeartPulse = () => {
    sendHeartbeat();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#8E1B1B', '#C63A2E', '#E8A33D']
    });
    showToast(`Sent a real-time heartbeat tap to ${otherPartnerName} ♡`);
  };

  // Shared Goals
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalUnit, setNewGoalUnit] = useState('');

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !newGoalTarget.trim()) return;
    const saved = await addGoal({
      title: newGoalTitle.trim(),
      description: '',
      current: 0,
      target: Number(newGoalTarget) || 0,
      unit: newGoalUnit.trim(),
      cover: ''
    });
    if (!saved) return;
    setNewGoalTitle('');
    setNewGoalTarget('');
    setNewGoalUnit('');
    setIsAddingGoal(false);
  };

  // Promises
  const [newPromiseText, setNewPromiseText] = useState('');
  const handleAddPromise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromiseText.trim()) return;
    const saved = await addPromise(newPromiseText.trim());
    if (!saved) return;
    setNewPromiseText('');
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
        quoteAuthor={otherPartnerName}
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
            <span className="text-[10px] text-[#6E5B52]">{couple.lastActiveTime || 'Active now'}</span>
          </div>

          <p className="text-xs text-[#1C110E] font-medium bg-white p-2.5 rounded-xl border border-[#E7D9C9]">
            "{couple.lastActiveNote || 'Listening to our playlist & thinking of you'}"
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
            <audio {...musicPlayer.bind} className="hidden" />
            <span className="text-[10px] font-bold text-[#8E1B1B] uppercase tracking-wider flex items-center gap-1">
              <Headphones className="w-3.5 h-3.5" />
              <span>Sync Audio Room</span>
            </span>
            <p className="text-[#1C110E] font-medium flex items-center gap-1.5">
              <Music className="w-3 h-3 text-[#8E1B1B]" />
              <span>{doorState.musicTrack || 'No track chosen yet'}</span>
            </p>
            <button
              onClick={musicPlayer.toggle}
              disabled={!doorState.musicUrl}
              className="w-full py-1.5 rounded-lg bg-[#F7EFE4] text-[#8E1B1B] font-semibold text-[11px] flex items-center justify-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {musicPlayer.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-[#8E1B1B]" />}
              <span>{musicPlayer.isPlaying ? 'Listening together' : doorState.musicUrl ? 'Play in Sync' : 'Add a track from The Door'}</span>
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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-display text-xl font-semibold text-[#1C110E]">
              How are you feeling right now?
            </h3>
            <span className="text-xs text-[#8E1B1B] font-medium font-script text-base">
              {partnerMood ? `${otherPartnerName} feels "${partnerMood}"` : 'updates for both of you'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => handleSetMood(m)}
                className={`py-3 px-4 rounded-2xl text-xs font-medium transition-all text-center cursor-pointer ${myMood === m
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

                {/* Partner A's Answer */}
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

                {/* Partner B's Answer */}
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
              {RITUAL_LABELS.map((label, idx) => (
                <label key={label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-[#E7D9C9] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={myRituals[idx]}
                    onChange={() => toggleRitual(idx)}
                    className="accent-[#8E1B1B]"
                  />
                  <span className="text-[#1C110E]">{label}</span>
                </label>
              ))}
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

        {/* Shared Goals & Promises */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg font-semibold text-[#1C110E] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#8E1B1B]" />
                <span>Shared Goals</span>
              </h4>
              <button
                onClick={() => setIsAddingGoal(!isAddingGoal)}
                className="text-xs text-[#8E1B1B] font-medium cursor-pointer hover:underline"
              >
                {isAddingGoal ? 'Cancel' : '+ Add'}
              </button>
            </div>

            {isAddingGoal && (
              <form onSubmit={handleAddGoal} className="space-y-2 pb-3 border-b border-[#E7D9C9]">
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g. Read 12 books together"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#E7D9C9] text-xs"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    placeholder="Target"
                    className="w-1/2 px-3 py-2 rounded-lg bg-white border border-[#E7D9C9] text-xs"
                  />
                  <input
                    type="text"
                    value={newGoalUnit}
                    onChange={(e) => setNewGoalUnit(e.target.value)}
                    placeholder="Unit (books, km...)"
                    className="w-1/2 px-3 py-2 rounded-lg bg-white border border-[#E7D9C9] text-xs"
                  />
                </div>
                <button type="submit" className="w-full py-2 rounded-lg bg-[#8E1B1B] text-white text-xs font-semibold cursor-pointer">
                  Add Goal
                </button>
              </form>
            )}

            {goals.length === 0 ? (
              <p className="text-xs text-[#6E5B52] italic">No shared goals yet — add something you're working toward together.</p>
            ) : (
              <div className="space-y-3">
                {goals.map((g) => {
                  const pct = g.target > 0 ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
                  return (
                    <div key={g.id} className="text-xs">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <span className="font-medium text-[#1C110E] truncate">{g.title}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[#6E5B52]">{g.current}/{g.target} {g.unit}</span>
                          <button
                            onClick={() => updateGoal(g.id, { current: g.current + 1 })}
                            title="Log one"
                            className="w-5 h-5 rounded-full bg-[#8E1B1B] text-white text-[11px] font-bold flex items-center justify-center cursor-pointer hover:bg-[#751515]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-[#E7D9C9]">
                        <div className="bg-[#8E1B1B] h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-3">
            <h4 className="font-display text-lg font-semibold text-[#1C110E] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#8E1B1B]" />
              <span>Promises</span>
            </h4>
            {promises.length === 0 ? (
              <p className="text-xs text-[#6E5B52] italic">No promises sealed yet.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {promises.map((p) => (
                  <div key={p.id} className="p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs">
                    <p className="text-[#1C110E] font-script text-base leading-snug">"{p.text}"</p>
                    <p className="text-[10px] text-[#6E5B52] mt-1">
                      — {p.author === 'A' ? couple.nameA : couple.nameB}, {p.madeOn}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleAddPromise} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newPromiseText}
                onChange={(e) => setNewPromiseText(e.target.value)}
                placeholder="I promise to..."
                className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#E7D9C9] text-xs"
              />
              <button type="submit" className="px-3 py-2 rounded-lg bg-[#8E1B1B] text-white text-xs font-semibold cursor-pointer">
                Seal
              </button>
            </form>
          </div>

        </div>

      </main>

    </div>
  );
};
