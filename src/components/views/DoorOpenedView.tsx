import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { LightRays } from '../common/LightRays';
import { 
  Heart, 
  Sparkles, 
  Play, 
  Pause, 
  ArrowRight, 
  Music, 
  Ticket, 
  X,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DoorOpenedView: React.FC = () => {
  const { setCurrentView, doorState, couple, memories } = usePairlum();
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative min-h-[90vh] rounded-3xl overflow-hidden bg-[#1C110E] text-white p-6 sm:p-12 border-2 border-amber-300/40 candle-glow warm-shadow-lg flex flex-col justify-between max-w-6xl mx-auto my-6">
      
      {/* Background WebGL Light Rays streaming from the top */}
      <div className="absolute inset-0 pointer-events-none opacity-60 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#FCD34D"
          raysSpeed={1.2}
          lightSpread={0.8}
          rayLength={2.0}
          pulsating={true}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.05}
          distortion={0.03}
        />
      </div>

      {/* Background magical arched doorway & golden particles */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300/40 via-amber-900/30 to-black pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
            THE REUNION REVEAL
          </span>
          <h1 className="font-display text-4xl sm:text-6xl text-white font-medium mt-1">
            The Door <span className="text-amber-300 italic">opened.</span> ♡
          </h1>
          <p className="text-sm text-white/80 font-script text-2xl mt-1">
            Every mile, every note, every little moment brought you here.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('door')}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer"
        >
          Exit View ✕
        </button>
      </div>

      {/* Center Grand Arched Portal Visual (Screenshot 15) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-8">
        
        {/* Left Floating Polaroids & Notes */}
        <div className="lg:col-span-3 space-y-4 hidden sm:block">
          <div className="p-3 bg-white text-[#1C110E] rounded-2xl warm-shadow rotate-[-4deg] scale-95 hover:rotate-0 transition-transform">
            <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=300&q=80" alt="Mem" className="w-full h-28 object-cover rounded-xl mb-1.5" />
            <p className="font-script text-base text-center leading-tight">"The wait is over. You're home. ♡"</p>
          </div>

          <div className="p-3 bg-[#FFF5E9] text-[#1C110E] rounded-2xl border border-amber-200 rotate-[3deg]">
            <p className="font-script text-lg leading-snug">"Every plan, every moment brought us closer."</p>
            <span className="text-xs text-[#8E1B1B] font-bold block text-right mt-1">♡</span>
          </div>
        </div>

        {/* Center Illuminated Archway */}
        <div className="lg:col-span-6 flex flex-col items-center text-center">
          <div className="relative w-72 sm:w-84 h-[420px] rounded-t-full border-4 border-amber-300 shadow-2xl bg-gradient-to-b from-amber-100 via-amber-400 to-amber-950 p-6 flex flex-col items-center justify-between text-center overflow-hidden">
            
            {/* Pulsing light */}
            <div className="absolute inset-0 bg-white/25 animate-pulse pointer-events-none" />

            <div className="relative z-10 pt-8">
              <span className="text-xs uppercase font-mono tracking-widest text-[#8E1B1B] font-bold">
                Countdown Complete
              </span>
              <span className="text-xs text-[#8E1B1B] block">♡</span>
            </div>

            <div className="relative z-10 space-y-3">
              <h3 className="font-display text-4xl font-bold text-[#1C110E]">You made it.</h3>
              <p className="font-script text-2xl text-[#1C110E]">
                The rest is still unwritten.
              </p>
            </div>

            <div className="relative z-10 pb-6 w-full">
              <button
                id="step-into-our-story-btn"
                onClick={() => setCurrentView('door_reaction')}
                className="w-full py-3.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-bold tracking-wider uppercase shadow-xl hover:scale-105 transition-transform cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Step into our story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-[#1C110E]/80 mt-1 font-mono">This moment is all for you two.</p>
            </div>

          </div>
        </div>

        {/* Right Floating Ticket Stub & Polaroids */}
        <div className="lg:col-span-3 space-y-4 hidden sm:block">
          <div className="p-3.5 bg-amber-50 text-[#1C110E] rounded-2xl border-2 border-dashed border-amber-300 rotate-[3deg]">
            <div className="flex items-center justify-between text-[10px] uppercase font-mono font-bold text-[#8E1B1B]">
              <span>MUSEUM OF ICE CREAM</span>
              <span>ADMIT ONE</span>
            </div>
            <p className="font-display text-base font-bold text-center my-1.5">{couple.initials}</p>
            <p className="text-[10px] text-center text-[#6E5B52]">MAY 16, 2024</p>
          </div>

          <div className="p-3 bg-white text-[#1C110E] rounded-2xl warm-shadow rotate-[-2deg]">
            <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80" alt="Mem" className="w-full h-28 object-cover rounded-xl mb-1.5" />
            <p className="font-script text-base text-center">"Home is wherever we're together. ♡"</p>
          </div>
        </div>

      </div>

      {/* Bottom Music Player Bar (Screenshot 15) */}
      <div className="relative z-10 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=100&q=80" alt="Track" className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <h4 className="font-display text-sm font-semibold text-white">{doorState.musicTrack}</h4>
            <p className="text-[11px] text-amber-300">Playing in celebration</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-full bg-amber-400 text-[#1C110E] flex items-center justify-center cursor-pointer shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-[#1C110E] ml-0.5" />}
          </button>
          <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className={`h-full bg-amber-400 ${isPlaying ? 'w-2/3 animate-pulse' : 'w-1/3'}`} />
          </div>
          <span className="text-xs font-mono text-white/80">0:45 / 4:26</span>
        </div>
      </div>

    </div>
  );
};
