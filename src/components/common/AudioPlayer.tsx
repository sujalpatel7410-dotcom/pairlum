import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  durationLabel?: string;
  className?: string;
}

// A real <audio>-backed player styled as the app's waveform card. Used
// anywhere a recorded voice note needs to actually play back.
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, durationLabel, className = '' }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
  };

  return (
    <div className={`p-3 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] flex items-center gap-3 ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      <button
        type="button"
        onClick={toggle}
        className="w-9 h-9 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center flex-shrink-0 cursor-pointer"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
      </button>
      <div className="flex-1 flex items-center gap-1 h-6">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            style={{ height: `${Math.abs(Math.sin(i * 0.4)) * 18 + 6}px` }}
            className={`flex-1 rounded-full ${isPlaying ? 'bg-[#8E1B1B]' : 'bg-[#C63A2E]/60'}`}
          />
        ))}
      </div>
      {durationLabel && <span className="text-xs text-[#6E5B52] font-mono">{durationLabel}</span>}
    </div>
  );
};
