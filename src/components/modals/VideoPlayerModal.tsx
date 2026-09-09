import React, { useRef, useState, useEffect } from 'react';
import {
    X,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2,
    SkipBack,
    SkipForward
} from 'lucide-react';
import { Memory } from '../../types';

interface VideoPlayerModalProps {
    memory: Memory;
    onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ memory, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const hideTimer = useRef<ReturnType<typeof setTimeout>>();

    const fmt = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    // Auto-hide controls after 3s of no activity
    const resetHideTimer = () => {
        setShowControls(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        if (isPlaying) {
            hideTimer.current = setTimeout(() => setShowControls(false), 3000);
        }
    };

    useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === ' ') { e.preventDefault(); togglePlay(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isPlaying]);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (isPlaying) v.pause();
        else v.play();
        resetHideTimer();
    };

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const v = videoRef.current;
        if (!v || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        v.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
        resetHideTimer();
    };

    const skip = (secs: number) => {
        const v = videoRef.current;
        if (!v) return;
        v.currentTime = Math.max(0, Math.min(v.currentTime + secs, duration));
        resetHideTimer();
    };

    const toggleFullscreen = () => {
        const el = videoRef.current?.parentElement;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen?.();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden bg-black shadow-2xl"
                onMouseMove={resetHideTimer}
                onMouseLeave={() => isPlaying && setShowControls(false)}
            >
                {/* ── VIDEO ELEMENT ── */}
                <video
                    ref={videoRef}
                    src={memory.videoUrl}
                    poster={memory.imageUrl}
                    className="w-full aspect-video bg-black cursor-pointer"
                    onClick={togglePlay}
                    onPlay={() => { setIsPlaying(true); resetHideTimer(); }}
                    onPause={() => { setIsPlaying(false); setShowControls(true); }}
                    onEnded={() => { setIsPlaying(false); setProgress(0); setCurrentTime(0); setShowControls(true); }}
                    onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
                    onTimeUpdate={() => {
                        const v = videoRef.current;
                        if (!v) return;
                        setCurrentTime(v.currentTime);
                        setProgress(v.duration ? v.currentTime / v.duration : 0);
                    }}
                    playsInline
                />

                {/* ── CENTRE PLAY OVERLAY (when paused) ── */}
                {!isPlaying && (
                    <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={togglePlay}
                    >
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30">
                            <Play className="w-9 h-9 text-white fill-white ml-1" />
                        </div>
                    </div>
                )}

                {/* ── CONTROLS OVERLAY ── */}
                <div
                    className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                    <div className="relative px-4 pb-4 pt-8 space-y-2">
                        {/* Memory title */}
                        <div className="flex items-center justify-between mb-1">
                            <div>
                                <p className="text-white font-semibold text-sm truncate">{memory.title}</p>
                                {memory.location && (
                                    <p className="text-white/60 text-xs">{memory.location} • {memory.date}</p>
                                )}
                            </div>
                            <p className="text-white/50 text-xs">Added by {memory.authorName}</p>
                        </div>

                        {/* Progress bar */}
                        <div
                            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group"
                            onClick={handleSeek}
                        >
                            <div
                                className="absolute left-0 top-0 h-full bg-[#C63A2E] rounded-full transition-none"
                                style={{ width: `${progress * 100}%` }}
                            />
                            {/* Scrubber thumb */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ left: `calc(${progress * 100}% - 7px)` }}
                            />
                        </div>

                        {/* Control buttons row */}
                        <div className="flex items-center gap-3">
                            {/* Skip back */}
                            <button
                                onClick={() => skip(-10)}
                                title="Back 10s"
                                className="text-white/70 hover:text-white transition-colors cursor-pointer"
                            >
                                <SkipBack className="w-5 h-5" />
                            </button>

                            {/* Play/Pause */}
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 rounded-full bg-[#8E1B1B] hover:bg-[#C63A2E] text-white flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors shadow-lg"
                            >
                                {isPlaying
                                    ? <Pause className="w-4 h-4" />
                                    : <Play className="w-4 h-4 fill-white ml-0.5" />}
                            </button>

                            {/* Skip forward */}
                            <button
                                onClick={() => skip(10)}
                                title="Forward 10s"
                                className="text-white/70 hover:text-white transition-colors cursor-pointer"
                            >
                                <SkipForward className="w-5 h-5" />
                            </button>

                            {/* Time */}
                            <span className="text-white/70 text-xs font-mono ml-1">
                                {fmt(currentTime)} / {fmt(duration)}
                            </span>

                            {/* Spacer */}
                            <div className="flex-1" />

                            {/* Mute */}
                            <button
                                onClick={toggleMute}
                                title={isMuted ? 'Unmute' : 'Mute'}
                                className="text-white/70 hover:text-white transition-colors cursor-pointer"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                            </button>

                            {/* Fullscreen */}
                            <button
                                onClick={toggleFullscreen}
                                title="Toggle fullscreen"
                                className="text-white/70 hover:text-white transition-colors cursor-pointer"
                            >
                                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── CLOSE BUTTON ── */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center cursor-pointer transition-colors border border-white/10 z-10"
                    title="Close (Esc)"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
