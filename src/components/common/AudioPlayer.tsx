import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  durationLabel?: string;
  className?: string;
  compact?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  durationLabel,
  className = '',
  compact = false
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);       // 0–1
  const [currentTime, setCurrentTime] = useState(0); // seconds
  const [duration, setDuration] = useState(0);        // seconds

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [src]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  return (
    <div className={`p-3 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] flex items-center gap-3 ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); setProgress(0); setCurrentTime(0); }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onTimeUpdate={() => {
          const audio = audioRef.current;
          if (!audio) return;
          setCurrentTime(audio.currentTime);
          setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
        }}
        className="hidden"
      />

      {/* Play / Pause button */}
      <button
        type="button"
        onClick={toggle}
        className="w-9 h-9 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-[#751515] transition-colors shadow-sm"
      >
        {isPlaying
          ? <Pause className="w-4 h-4" />
          : <Play className="w-4 h-4 fill-white ml-0.5" />}
      </button>

      {/* Waveform bars + scrubber */}
      <div className="flex-1 flex flex-col gap-1.5">
        {/* Animated waveform (click to seek) */}
        <div
          className="flex items-center gap-[2px] h-7 cursor-pointer"
          onClick={handleSeek}
          title="Click to seek"
        >
          {Array.from({ length: 32 }).map((_, i) => {
            const barHeight = Math.abs(Math.sin(i * 0.45)) * 20 + 5;
            const filled = i / 32 <= progress;
            return (
              <div
                key={i}
                style={{ height: `${barHeight}px` }}
                className={`flex-1 rounded-full transition-colors ${filled
                    ? 'bg-[#8E1B1B]'
                    : isPlaying
                      ? 'bg-[#C63A2E]/40 animate-pulse'
                      : 'bg-[#C63A2E]/30'
                  }`}
              />
            );
          })}
        </div>

        {/* Progress scrubber line */}
        <div
          className="relative h-1 bg-[#E7D9C9] rounded-full cursor-pointer overflow-hidden"
          onClick={handleSeek}
        >
          <div
            className="absolute left-0 top-0 h-full bg-[#8E1B1B] rounded-full transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Time display */}
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        {isPlaying || currentTime > 0 ? (
          <>
            <span className="text-[11px] text-[#8E1B1B] font-mono font-semibold">{fmt(currentTime)}</span>
            {duration > 0 && (
              <span className="text-[10px] text-[#6E5B52] font-mono">{fmt(duration)}</span>
            )}
          </>
        ) : (
          <span className="text-xs text-[#6E5B52] font-mono">
            {durationLabel ?? (duration > 0 ? fmt(duration) : '—')}
          </span>
        )}
      </div>
    </div>
  );
};
