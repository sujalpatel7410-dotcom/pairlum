import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { 
  Heart, 
  Mic, 
  Play, 
  Pause, 
  Send, 
  Sparkles, 
  Check, 
  ArrowRight,
  MapPin,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DoorReactionView: React.FC = () => {
  const { setCurrentView, couple, currentUser, updateDoorState, showToast } = usePairlum();

  const [selectedFeeling, setSelectedFeeling] = useState('Loved it');
  const [reactionText, setReactionText] = useState('I don\'t even know where to start. This was more beautiful than I imagined. You remembered the little things I didn\'t say out loud. I felt so seen, so loved, so home. My heart is so full right now. Thank you for creating this for me. I\'ll never forget it. ♡');
  const [privateNote, setPrivateNote] = useState('P.S. I\'ve replayed the music you added like five times already.');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  const otherPartner = currentUser === 'A' ? couple.nameB : couple.nameA;

  const feelings = [
    { label: 'Loved it', emoji: '❤️' },
    { label: 'Cried', emoji: '🥺' },
    { label: 'Felt home', emoji: '🕯️' },
    { label: 'Missed you more', emoji: '🕊️' },
    { label: 'Beautiful', emoji: '✨' }
  ];

  const handleSubmitReaction = () => {
    updateDoorState({
      reaction: {
        feeling: selectedFeeling,
        message: reactionText,
        privateNote,
        voiceDuration: '0:24'
      }
    });

    confetti({
      particleCount: 80,
      spread: 90,
      colors: ['#8E1B1B', '#C63A2E', '#E8A33D']
    });

    showToast(`Reaction sent with love to ${otherPartner} ♡`);
    setCurrentView('together');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 pb-20 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb Header */}
      <div>
        <span className="text-[11px] font-bold text-[#8E1B1B] uppercase tracking-widest block">
          THE REACTION
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#1C110E] font-medium mt-1">
          How did it feel? <span className="text-[#8E1B1B]">♡</span>
        </h1>
        <p className="text-sm text-[#6E5B52] mt-1">
          You just experienced the moment {otherPartner} created for you. We'd love to hear your reaction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Door Vignette & Note (Screenshot 12) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="relative rounded-3xl overflow-hidden border border-[#E7D9C9] warm-shadow-lg aspect-3/4 bg-[#1C110E]">
            <img 
              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80" 
              alt="The Door" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Note overlay */}
            <div className="absolute top-6 left-6 right-6 p-4 rounded-2xl bg-[#FFF5E9]/95 text-[#1C110E] warm-shadow rotate-[-2deg] border border-amber-200">
              <p className="font-script text-xl leading-snug">
                "When we meet again, I'll choose you again. ♡"
              </p>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase">The Door ♡</span>
              <p className="text-xs text-white/80 font-script text-lg">
                The moment they revealed everything they wanted you to feel.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs text-[#6E5B52] flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#1C110E]">Made for you by</p>
              <p className="text-sm font-display text-[#8E1B1B]">{couple.initials}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#1C110E]">Opened on</p>
              <p className="text-[11px] text-[#6E5B52]">25 Dec 2026 • 08:15 PM</p>
            </div>
          </div>

        </div>

        {/* Right Side: Reaction Form (Screenshot 12) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow-lg space-y-6">
          
          {/* Feeling Buttons */}
          <div>
            <label className="block text-xs font-semibold text-[#1C110E] mb-2.5">
              Your reaction — Choose how this moment made you feel
            </label>
            <div className="flex flex-wrap gap-2">
              {feelings.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setSelectedFeeling(f.label)}
                  className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedFeeling === f.label 
                      ? 'bg-[#8E1B1B] text-white shadow-xs' 
                      : 'bg-white border border-[#E7D9C9] text-[#1C110E] hover:border-[#8E1B1B]'
                  }`}
                >
                  <span>{f.emoji}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reaction Textarea */}
          <div>
            <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">
              Tell them what this moment meant to you
            </label>
            <div className="p-4 rounded-2xl bg-white border border-[#E7D9C9] stationery-lines warm-shadow">
              <textarea
                value={reactionText}
                onChange={(e) => setReactionText(e.target.value)}
                rows={5}
                className="w-full bg-transparent font-script text-2xl text-[#1C110E] focus:outline-hidden resize-none leading-[28px]"
              />
            </div>
          </div>

          {/* Voice Reply */}
          <div>
            <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">
              Send a voice reply (optional)
            </label>
            <div className="p-3 rounded-2xl bg-white border border-[#E7D9C9] flex items-center gap-3">
              <button
                onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white cursor-pointer ${
                  isRecordingVoice ? 'bg-[#8E1B1B] animate-pulse' : 'bg-[#8E1B1B]'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <div className="flex-1 flex items-center gap-1 h-5">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ height: `${Math.sin(i * 0.4) * 10 + 12}px` }}
                    className={`flex-1 rounded-full ${isRecordingVoice ? 'bg-[#8E1B1B]' : 'bg-[#C63A2E]/60'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-[#6E5B52]">0:24</span>
            </div>
          </div>

          {/* Private Note */}
          <div>
            <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">
              Private postscript note
            </label>
            <input
              type="text"
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs"
            />
          </div>

          {/* Submit Button (Screenshot 12) */}
          <button
            onClick={handleSubmitReaction}
            className="w-full py-4 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-bold tracking-wider uppercase shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Add To Our Story</span>
            <Heart className="w-4 h-4 fill-white" />
          </button>

        </div>

      </div>

    </div>
  );
};
