import { useEffect, useRef, useState } from 'react';

// Drives a real <audio> element for a shared "soundtrack" URL (as opposed to
// useAudioRecorder, which captures new audio). Spread `bind` onto an <audio>
// element and call `toggle` from a play/pause button.
export function useAudioPlayback(src?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (isPlaying) audio.pause();
    else audio.play();
  };

  const bind = {
    ref: audioRef,
    src,
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    onEnded: () => setIsPlaying(false),
    onTimeUpdate: () => setCurrentTime(audioRef.current?.currentTime ?? 0),
    onLoadedMetadata: () => setDuration(audioRef.current?.duration ?? 0)
  };

  return { isPlaying, toggle, currentTime, duration, bind };
}
