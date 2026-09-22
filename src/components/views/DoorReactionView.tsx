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
import { useAudioRecorder } from '../../lib/useAudioRecorder';
import { useCloudinaryUpload } from '../../lib/useCloudinaryUpload';
import { formatDuration } from '../../lib/format';

export const DoorReactionView: React.FC = () => {
  const { setCurrentView, couple, currentUser, updateDoorState, showToast } = usePairlum();

  const [selectedFeeling, setSelectedFeeling] = useState('Loved it');
  const [reactionText, setReactionText] = useState('I don\'t even know where to start. This was more beautiful than I imagined. You remembered the little things I didn\'t say out loud. I felt so seen, so loved, so home. My heart is so full right now. Thank you for creating this for me. I\'ll never forget it. ♡');
  const [privateNote, setPrivateNote] = useState('P.S. I\'ve replayed the music you added like five times already.');

  const voiceRecorder = useAudioRecorder();
  const { upload, isUploading: isUploadingVoice, error: voiceUploadError } = useCloudinaryUpload();
  const [voiceUrl, setVoiceUrl] = useState<string | undefined>(undefined);
  const [voiceDuration, setVoiceDuration] = useState<string | undefined>(undefined);

  const handleToggleVoiceReply = async () => {
    if (voiceRecorder.isRecording) {
      const file = await voiceRecorder.stop();
      if (file) {
        setVoiceDuration(formatDuration(voiceRecorder.seconds));
        const result = await upload(file);
        if (result) setVoiceUrl(result.secureUrl);
      }
    } else {
      setVoiceUrl(undefined);
      setVoiceDuration(undefined);
      voiceRecorder.start();
    }
  };

  const otherPartner = currentUser === 'A' ? couple.nameB : couple.nameA;

  const reunionDateObj = couple.reunionDate ? new Date(couple.reunionDate) : null;
  const openedOnLabel = reunionDateObj && !isNaN(reunionDateObj.getTime())
    ? `${reunionDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • ${reunionDateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    : '25 Dec 2026 • 08:15 PM';

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
        ...(voiceUrl ? { voiceUrl, voiceDuration } : {})
      }
    });

    confetti({
      particleCount: 80,
      spread: 90,
      colors: ['#E11D48', '#F59E0B', '#FFC145']
    });

    showToast(`Reaction sent with love to ${otherPartner} ♡`);
    setCurrentView('together');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8 pb-20 animate-in fade-in duration-200">
      
      {/* Top Breadcrumb Header */}
      <div>
        <span className="text-[11px] font-bold text-[#E11D48] uppercase tracking-widest block">
          THE REACTION
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#4A0420] font-medium mt-1">
          How did it feel? <span className="text-[#E11D48]">♡</span>
        </h1>
        <p className="text-sm text-[#8A4058] mt-1">
          You just experienced the moment {otherPartner} created for you. We'd love to hear your reaction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Door Vignette & Note (Screenshot 12) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="relative rounded-3xl overflow-hidden border border-[#F4A9BF] warm-shadow-lg aspect-3/4 bg-[#4A0420]">
            <img 
              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80" 
              alt="The Door" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

            {/* Note overlay */}
            <div className="absolute top-6 left-6 right-6 p-4 rounded-2xl bg-[#FFF5E9]/95 text-[#4A0420] warm-shadow rotate-[-2deg] border border-amber-200">
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

          <div className="p-4 rounded-2xl bg-[#FFB8CB] border border-[#F4A9BF] text-xs text-[#8A4058] flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#4A0420]">Made for you by</p>
              <p className="text-sm font-display text-[#E11D48]">{couple.initials}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[#4A0420]">Opened on</p>
              <p className="text-[11px] text-[#8A4058]">{openedOnLabel}</p>
            </div>
          </div>

        </div>

        {/* Right Side: Reaction Form (Screenshot 12) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#FFB8CB] border border-[#F4A9BF] warm-shadow-lg space-y-6">
          
          {/* Feeling Buttons */}
          <div>
            <label className="block text-xs font-semibold text-[#4A0420] mb-2.5">
              Your reaction — Choose how this moment made you feel
            </label>
            <div className="flex flex-wrap gap-2">
              {feelings.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setSelectedFeeling(f.label)}
                  className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedFeeling === f.label 
                      ? 'bg-[#E11D48] text-white shadow-xs' 
                      : 'bg-white border border-[#F4A9BF] text-[#4A0420] hover:border-[#E11D48]'
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
            <label className="block text-xs font-semibold text-[#4A0420] mb-1.5">
              Tell them what this moment meant to you
            </label>
            <div className="p-4 rounded-2xl bg-white border border-[#F4A9BF] stationery-lines warm-shadow">
              <textarea
                value={reactionText}
                onChange={(e) => setReactionText(e.target.value)}
                rows={5}
                className="w-full bg-transparent font-script text-2xl text-[#4A0420] focus:outline-hidden resize-none leading-[28px]"
              />
            </div>
          </div>

          {/* Voice Reply */}
          <div>
            <label className="block text-xs font-semibold text-[#4A0420] mb-1.5">
              Send a voice reply (optional)
            </label>
            <div className="p-3 rounded-2xl bg-white border border-[#F4A9BF] flex items-center gap-3">
              <button
                onClick={handleToggleVoiceReply}
                disabled={isUploadingVoice}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white cursor-pointer disabled:opacity-50 ${
                  voiceRecorder.isRecording ? 'bg-[#E11D48] animate-pulse' : 'bg-[#E11D48]'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <div className="flex-1 flex items-center gap-1 h-5">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ height: `${Math.sin(i * 0.4) * 10 + 12}px` }}
                    className={`flex-1 rounded-full ${voiceRecorder.isRecording ? 'bg-[#E11D48]' : 'bg-[#F59E0B]/60'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-[#8A4058]">
                {voiceRecorder.isRecording
                  ? formatDuration(voiceRecorder.seconds)
                  : isUploadingVoice
                    ? 'Uploading…'
                    : voiceDuration || '0:00'}
              </span>
            </div>
            {voiceRecorder.error && <p className="text-xs text-[#E11D48] mt-1.5">{voiceRecorder.error}</p>}
            {voiceUploadError && <p className="text-xs text-[#E11D48] mt-1.5">{voiceUploadError}</p>}
          </div>

          {/* Private Note */}
          <div>
            <label className="block text-xs font-semibold text-[#4A0420] mb-1.5">
              Private postscript note
            </label>
            <input
              type="text"
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#F4A9BF] text-xs"
            />
          </div>

          {/* Submit Button (Screenshot 12) */}
          <button
            onClick={handleSubmitReaction}
            className="w-full py-4 rounded-full bg-[#E11D48] hover:bg-[#C81E45] text-white text-xs font-bold tracking-wider uppercase shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Add To Our Story</span>
            <Heart className="w-4 h-4 fill-white" />
          </button>

        </div>

      </div>

    </div>
  );
};
