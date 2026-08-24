import React, { useState, useEffect } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { PageRail } from '../common/PageRail';
import { PaperCard } from '../common/PaperCard';
import { LightRays } from '../common/LightRays';
import { 
  Sparkles, 
  Heart, 
  Music, 
  Play, 
  Pause, 
  Clock, 
  MapPin, 
  Plane, 
  Coffee, 
  Hotel, 
  Gift, 
  Utensils, 
  CheckCircle2, 
  Circle, 
  Plus, 
  ArrowRight,
  Eye,
  Sliders,
  Compass,
  Calendar,
  Luggage,
  ListTodo,
  CheckSquare,
  Globe2,
  Navigation,
  Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReunionStop } from '../../types';

export const TheDoorView: React.FC = () => {
  const { 
    couple, 
    doorState, 
    updateDoorState, 
    openTheDoor, 
    reunionPlan, 
    toggleReunionStop, 
    addReunionStop,
    memories,
    currentUser,
    currentView,
    setCurrentView,
    showToast
  } = usePairlum();

  const [activeTab, setActiveTab] = useState<'door' | 'reunion_plan' | 'prepare'>('door');
  const [filterCategory, setFilterCategory] = useState<'all' | 'prep' | 'reunion_day' | 'completed'>('all');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');

  // Form states for new milestone / to-do
  const [newStopTitle, setNewStopTitle] = useState('');
  const [newStopTime, setNewStopTime] = useState('D-7');
  const [newStopDaysToGo, setNewStopDaysToGo] = useState('7 days to go');
  const [newStopDesc, setNewStopDesc] = useState('');
  const [newStopCategory, setNewStopCategory] = useState<ReunionStop['category']>('prep');
  const [newStopAssignee, setNewStopAssignee] = useState<'A' | 'B' | 'both'>('both');
  const [newStopDueDate, setNewStopDueDate] = useState('18 Dec 2026');

  // Live countdown calculation based on couple.reunionDate
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 6,
    minutes: 42,
    seconds: 15
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!couple.reunionDate) return;
      const target = new Date(couple.reunionDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Fallback default for romantic preview if date is in past or arbitrary
        setTimeLeft(prev => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
          return prev;
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [couple.reunionDate]);

  useEffect(() => {
    if (currentView === 'reunion') {
      setActiveTab('reunion_plan');
    } else if (currentView === 'door') {
      setActiveTab('door');
    } else if (currentView === 'prepare_door') {
      setActiveTab('prepare');
    }
  }, [currentView]);

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStopTitle.trim()) return;

    let icon = 'Heart';
    if (newStopCategory === 'flight') icon = 'Plane';
    else if (newStopCategory === 'pack') icon = 'Luggage';
    else if (newStopCategory === 'stay') icon = 'Hotel';
    else if (newStopCategory === 'surprise') icon = 'Gift';
    else if (newStopCategory === 'date') icon = 'Utensils';

    addReunionStop({
      title: newStopTitle,
      time: newStopTime || 'D-Day',
      daysToGo: newStopDaysToGo || `${timeLeft.days} days to go`,
      description: newStopDesc || 'A special moment planned for our reunion',
      iconName: icon,
      category: newStopCategory,
      assignedTo: newStopAssignee,
      dueDate: newStopDueDate
    });

    setNewStopTitle('');
    setNewStopDesc('');
    showToast('Reunion milestone added ♡');
  };

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    toggleReunionStop(id);
    if (!currentlyCompleted) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8E1B1B', '#E8A33D', '#F7EFE4']
      });
      showToast('Milestone checked off! One step closer ♡');
    }
  };

  const getStopIcon = (name: string) => {
    switch (name) {
      case 'Plane': return <Plane className="w-4 h-4 text-[#8E1B1B]" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-[#8E1B1B]" />;
      case 'Hotel': return <Hotel className="w-4 h-4 text-[#8E1B1B]" />;
      case 'Gift': return <Gift className="w-4 h-4 text-[#8E1B1B]" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-[#8E1B1B]" />;
      case 'Luggage': return <Luggage className="w-4 h-4 text-[#8E1B1B]" />;
      default: return <Heart className="w-4 h-4 text-[#8E1B1B]" />;
    }
  };

  const completedCount = reunionPlan.filter(s => s.completed).length;
  const totalStops = reunionPlan.length;
  const progressPercent = totalStops > 0 ? Math.round((completedCount / totalStops) * 100) : 0;

  // Filtered stops for "Days to Do" view
  const filteredPlan = reunionPlan.filter(stop => {
    if (filterCategory === 'completed') return stop.completed;
    if (filterCategory === 'prep') return stop.category === 'prep' || stop.category === 'pack' || stop.category === 'flight' || (stop.time && stop.time.startsWith('D-'));
    if (filterCategory === 'reunion_day') return stop.category === 'date' || stop.category === 'stay' || stop.category === 'surprise' || stop.category === 'activity' || (stop.time && !stop.time.startsWith('D-'));
    return true;
  });

  const cityA = couple.cityA || 'Mumbai, India';
  const cityB = couple.cityB || 'London, UK';
  const reunionLoc = couple.reunionLocation || 'Ahmedabad, India';
  const distanceKmText = couple.distance || '7,192 km (4,469 mi)';
  const flightDuration = couple.flightDuration || '9h 15m flight';
  const timezoneDiff = couple.timezoneDiff || '4.5 hrs time difference';

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20">
      
      {/* Left PageRail */}
      <PageRail
        step="05 / 06"
        categoryLabel="REUNION & THE DOOR"
        title="The Door"
        subtitle="The magical doorway that bridges every single mile between us. Every plan brings us closer."
        quote="Distance is just a test to see how far love can travel."
        quoteAuthor="Emma & Liam"
        illustrationSrc="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80"
        illustrationCaption="Waiting by The Door ♡"
      >
        <div className="space-y-1.5 pt-2">
          <button
            id="tab-door-experience"
            onClick={() => setActiveTab('door')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'door' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>The Door Experience</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'door' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900'}`}>
              {timeLeft.days}d to go
            </span>
          </button>

          <button
            id="tab-reunion-roadmap"
            onClick={() => setActiveTab('reunion_plan')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'reunion_plan' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              <span>Days to Do & Roadmap</span>
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
              {completedCount}/{totalStops}
            </span>
          </button>

          <button
            id="tab-prepare-door"
            onClick={() => setActiveTab('prepare')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'prepare' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>Prepare The Door</span>
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Curate</span>
          </button>
        </div>

        {/* Distance summary widget on rail */}
        <div className="p-3.5 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-2 mt-4 text-xs">
          <div className="flex items-center justify-between font-semibold text-[#1C110E]">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#8E1B1B]">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Distance Apart</span>
            </span>
            <span className="font-mono text-[11px] text-[#8E1B1B] font-bold">7,192 km</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#6E5B52]">
            <span>{cityA.split(',')[0]} ✈ {cityB.split(',')[0]}</span>
            <span>{flightDuration.split(' ')[0]} flight</span>
          </div>
          <div className="w-full bg-[#E7D9C9] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#8E1B1B] h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-[10px] text-[#6E5B52] text-center italic">
            {progressPercent}% of reunion preparation done
          </p>
        </div>

        {/* Big Reveal Simulator CTA */}
        <div className="pt-4 border-t border-[#E7D9C9]">
          <button
            id="open-the-door-cta"
            onClick={openTheDoor}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#8E1B1B] to-[#C63A2E] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#8E1B1B]/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Open The Door Now</span>
          </button>
          <p className="text-[10px] text-[#6E5B52] text-center mt-1.5 font-script text-sm">
            Simulate the final reunion reveal moment ♡
          </p>
        </div>
      </PageRail>

      {/* Main Content Area */}
      <main className="flex-1 space-y-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: THE DOOR EXPERIENCE */}
        {/* ========================================================================= */}
        {activeTab === 'door' && (
          <div className="space-y-8">
            
            {/* Header & Distance Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#8E1B1B] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8A33D]" />
                  <span>THE REUNION & DISTANCE</span>
                </span>
                <h2 className="font-display text-4xl sm:text-5xl text-[#1C110E] font-medium mt-1 leading-tight">
                  The day <br />
                  <span className="text-[#8E1B1B] italic">you meet again.</span>
                </h2>
                <p className="text-sm text-[#6E5B52] mt-1.5 max-w-lg">
                  Every mile is counting down to zero. The wait has been long, but we are turning it into something memorable.
                </p>
              </div>

              {/* Distance Apart Badge */}
              <div className="p-3.5 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] text-right flex-shrink-0">
                <div className="flex items-center gap-2 justify-end text-xs text-[#8E1B1B] font-bold uppercase tracking-wider">
                  <Plane className="w-3.5 h-3.5 rotate-45" />
                  <span>Distance Across Ocean</span>
                </div>
                <div className="font-display text-2xl font-bold text-[#1C110E] mt-0.5">
                  {distanceKmText}
                </div>
                <div className="text-[11px] text-[#6E5B52] flex items-center gap-2 justify-end mt-0.5">
                  <span>{timezoneDiff}</span>
                  <span>•</span>
                  <span>{flightDuration}</span>
                </div>
              </div>
            </div>

            {/* Glowing Golden Arched Doorway Card with Distance & Countdown */}
            <div className="relative rounded-3xl overflow-hidden border border-[#E8A33D]/50 candle-glow bg-[#1C110E] text-white p-8 sm:p-12 warm-shadow-lg">
              
              {/* Arched Doorway Background Artwork */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/40 via-amber-950/40 to-black pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Countdown & Info */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Next Reunion: 25 Dec 2026 • 08:00 PM</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#E8A33D]" />
                      <span>Meeting in {reunionLoc}</span>
                    </div>
                  </div>

                  {/* 4-Unit Countdown Timer with "Days to Do" Focus */}
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-mono text-amber-300/80 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Countdown to Closing the Distance</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2.5 text-center max-w-md">
                      <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-amber-400/30">
                        <div className="font-display text-3xl sm:text-4xl font-bold text-amber-300">{timeLeft.days}</div>
                        <div className="text-[10px] uppercase font-mono tracking-wider text-white/70">Days to Do</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
                        <div className="font-display text-3xl sm:text-4xl font-bold text-white">{timeLeft.hours}</div>
                        <div className="text-[10px] uppercase font-mono tracking-wider text-white/70">Hours</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
                        <div className="font-display text-3xl sm:text-4xl font-bold text-white">{timeLeft.minutes}</div>
                        <div className="text-[10px] uppercase font-mono tracking-wider text-white/70">Mins</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
                        <div className="font-display text-3xl sm:text-4xl font-bold text-[#E8A33D]">{timeLeft.seconds}</div>
                        <div className="text-[10px] uppercase font-mono tracking-wider text-white/70">Secs</div>
                      </div>
                    </div>
                  </div>

                  {/* Connected Long-Distance Cities Graphic */}
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2.5 max-w-lg">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img src={couple.avatarA} alt={couple.nameA} className="w-6 h-6 rounded-full object-cover border border-amber-400" />
                        <div>
                          <p className="font-semibold text-white">{couple.nameA}</p>
                          <p className="text-[10px] text-white/60">{cityA}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] font-mono text-amber-300 font-bold tracking-wider">{distanceKmText}</span>
                        <div className="flex items-center gap-1.5 my-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="w-12 h-0.5 border-t border-dashed border-amber-300/80" />
                          <Plane className="w-3.5 h-3.5 text-amber-300" />
                          <span className="w-12 h-0.5 border-t border-dashed border-amber-300/80" />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        </div>
                        <span className="text-[9px] text-white/60">Flight: {flightDuration}</span>
                      </div>

                      <div className="flex items-center gap-2 text-right">
                        <div>
                          <p className="font-semibold text-white">{couple.nameB}</p>
                          <p className="text-[10px] text-white/60">{cityB}</p>
                        </div>
                        <img src={couple.avatarB} alt={couple.nameB} className="w-6 h-6 rounded-full object-cover border border-amber-400" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/80">
                      <span className="flex items-center gap-1 text-amber-300">
                        <MapPin className="w-3 h-3" />
                        <span>Reunion Destination: <strong>{reunionLoc}</strong></span>
                      </span>
                      <span>Target: 0 km between us</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-semibold text-white">
                      "{couple.reunionTitle}"
                    </h3>
                    <p className="font-script text-xl text-white/80">
                      Counting every single second until our next forever.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={openTheDoor}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-[#8E1B1B] hover:brightness-110 text-white text-xs font-bold tracking-wider uppercase shadow-md cursor-pointer flex items-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>Step Into The Door</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('reunion_plan')}
                      className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white cursor-pointer flex items-center gap-1.5"
                    >
                      <ListTodo className="w-3.5 h-3.5 text-amber-300" />
                      <span>View {totalStops} Days to Do Tasks ✎</span>
                    </button>
                  </div>

                </div>

                {/* Right Arched Door Portal Visual */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-64 sm:w-72 h-96 rounded-t-full border-4 border-amber-300/60 shadow-2xl overflow-hidden bg-gradient-to-b from-amber-200 via-amber-500 to-amber-900 flex flex-col items-center justify-center p-6 text-center">
                    
                    {/* WebGL Light Rays inside the arched doorway */}
                    <div className="absolute inset-0 pointer-events-none opacity-70 z-0">
                      <LightRays
                        raysOrigin="top-center"
                        raysColor="#FCD34D"
                        raysSpeed={1.5}
                        lightSpread={0.9}
                        rayLength={1.8}
                        pulsating={true}
                        followMouse={true}
                        mouseInfluence={0.2}
                      />
                    </div>

                    {/* Glowing golden light animation */}
                    <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />

                    <div className="relative z-10 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-black/40 text-amber-300 mx-auto flex items-center justify-center shadow-lg border border-amber-300/40">
                        <Sparkles className="w-8 h-8 animate-spin-slow" />
                      </div>
                      <h4 className="font-display text-2xl font-bold text-[#1C110E]">The Door is Ready</h4>
                      <p className="text-xs text-[#1C110E]/80 font-script text-base">
                        Bridging {distanceKmText} with 4 memories, soundtrack & final letter.
                      </p>
                      <span className="text-[11px] font-mono font-bold text-[#8E1B1B] bg-white/80 px-3 py-1 rounded-full inline-block">
                        Yellow — Coldplay
                      </span>
                    </div>

                    <button
                      onClick={openTheDoor}
                      className="mt-6 relative z-10 px-5 py-2.5 rounded-full bg-[#8E1B1B] text-white text-xs font-bold shadow-md hover:scale-105 transition-transform cursor-pointer"
                    >
                      Reveal Scene →
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick "Days to Do" Preview & Soundtrack Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Days to Do Prep Overview */}
              <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-2">
                    <ListTodo className="w-5 h-5 text-[#8E1B1B]" />
                    <span>Immediate Days to Do</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('reunion_plan')}
                    className="text-xs text-[#8E1B1B] font-semibold hover:underline cursor-pointer"
                  >
                    View All ({totalStops}) →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {reunionPlan.slice(0, 4).map((stop) => (
                    <div 
                      key={stop.id}
                      onClick={() => handleToggle(stop.id, stop.completed)}
                      className="p-3 rounded-2xl bg-white border border-[#E7D9C9] flex items-center justify-between gap-3 cursor-pointer hover:border-[#8E1B1B] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8E1B1B]/10 flex items-center justify-center flex-shrink-0">
                          {getStopIcon(stop.iconName)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${stop.completed ? 'line-through text-[#6E5B52]' : 'text-[#1C110E]'}`}>
                              {stop.title}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F7EFE4] text-[#8E1B1B] font-bold">
                              {stop.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6E5B52] truncate max-w-xs">{stop.description}</p>
                        </div>
                      </div>

                      <div className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0">
                        {stop.completed ? <CheckCircle2 className="w-5 h-5 text-[#8E1B1B] fill-[#8E1B1B]/20" /> : <Circle className="w-4 h-4 text-[#6E5B52]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soundtrack Card */}
              <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-[#1C110E] flex items-center gap-2">
                    <Music className="w-5 h-5 text-[#8E1B1B]" />
                    <span>Our Reunion Soundtrack</span>
                  </h3>
                  <span className="text-xs text-[#8E1B1B]">Playing at 0 km</span>
                </div>
                
                <div className="p-4 rounded-2xl bg-white border border-[#E7D9C9] flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                    className="w-11 h-11 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center flex-shrink-0 cursor-pointer shadow-md hover:scale-105 transition-transform"
                  >
                    {isPlayingMusic ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                  </button>
                  <div className="flex-1">
                    <h4 className="font-display text-base font-semibold text-[#1C110E]">{doorState.musicTrack}</h4>
                    <p className="text-xs text-[#6E5B52]">Will autoplay during the door reveal at the airport</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/60 border border-[#E7D9C9] text-xs text-[#6E5B52] space-y-1">
                  <p className="font-script text-base text-[#1C110E]">
                    "Look at the stars, look how they shine for you..."
                  </p>
                  <p className="text-[11px] text-[#6E5B52]">
                    Dedicated from {currentUser === 'A' ? couple.nameA : couple.nameB} to {currentUser === 'A' ? couple.nameB : couple.nameA}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DAYS TO DO & REUNION ROADMAP */}
        {/* ========================================================================= */}
        {activeTab === 'reunion_plan' && (
          <div className="space-y-6">
            
            {/* Header & Stats Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#8E1B1B] uppercase tracking-wider flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5" />
                  <span>PREPARATION & ITINERARY</span>
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-[#1C110E] font-medium mt-0.5">
                  Days to Do & Reunion Roadmap ♡
                </h2>
                <p className="text-xs text-[#6E5B52] mt-1">
                  Checklist of everything to pack, prepare, and celebrate as we bridge {distanceKmText}.
                </p>
              </div>

              {/* Progress metric */}
              <div className="p-3.5 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-[#6E5B52]">Progress</p>
                  <p className="font-display text-xl font-bold text-[#8E1B1B]">{completedCount} of {totalStops} Done</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#8E1B1B] flex items-center justify-center font-bold text-xs text-[#1C110E]">
                  {progressPercent}%
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-[#E7D9C9] pb-3">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  filterCategory === 'all' ? 'bg-[#8E1B1B] text-white font-semibold' : 'bg-[#F7EFE4] text-[#6E5B52] hover:text-[#1C110E]'
                }`}
              >
                All Milestones ({totalStops})
              </button>
              <button
                onClick={() => setFilterCategory('prep')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  filterCategory === 'prep' ? 'bg-[#8E1B1B] text-white font-semibold' : 'bg-[#F7EFE4] text-[#6E5B52] hover:text-[#1C110E]'
                }`}
              >
                Before We Meet (Prep & Packing)
              </button>
              <button
                onClick={() => setFilterCategory('reunion_day')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  filterCategory === 'reunion_day' ? 'bg-[#8E1B1B] text-white font-semibold' : 'bg-[#F7EFE4] text-[#6E5B52] hover:text-[#1C110E]'
                }`}
              >
                Reunion Days (Itinerary)
              </button>
              <button
                onClick={() => setFilterCategory('completed')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  filterCategory === 'completed' ? 'bg-[#8E1B1B] text-white font-semibold' : 'bg-[#F7EFE4] text-[#6E5B52] hover:text-[#1C110E]'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>

            {/* Timeline / Days-to-Do Items List */}
            <div className="space-y-3">
              {filteredPlan.map((stop) => (
                <div
                  key={stop.id}
                  onClick={() => handleToggle(stop.id, stop.completed)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    stop.completed 
                      ? 'bg-[#F7EFE4]/60 border-[#E7D9C9] opacity-75' 
                      : 'bg-white border-[#E7D9C9] warm-shadow hover:border-[#8E1B1B]'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#8E1B1B]/10 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                      {getStopIcon(stop.iconName)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`font-display text-base font-semibold ${stop.completed ? 'line-through text-[#6E5B52]' : 'text-[#1C110E]'}`}>
                          {stop.title}
                        </h4>
                        <span className="text-xs font-mono text-[#8E1B1B] font-bold bg-[#F7EFE4] px-2.5 py-0.5 rounded-full">
                          {stop.time}
                        </span>
                        {stop.daysToGo && (
                          <span className="text-[10px] font-mono text-[#6E5B52] bg-white border border-[#E7D9C9] px-2 py-0.5 rounded-full">
                            {stop.daysToGo}
                          </span>
                        )}
                        {stop.category && (
                          <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            {stop.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6E5B52] mt-1">{stop.description}</p>
                      {stop.dueDate && (
                        <p className="text-[11px] text-[#8E1B1B] mt-0.5 flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" />
                          <span>Target: {stop.dueDate}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {stop.assignedTo && (
                      <span className="text-[10px] text-[#6E5B52] bg-[#F7EFE4] px-2 py-1 rounded-md">
                        For: {stop.assignedTo === 'both' ? 'Both of Us' : stop.assignedTo === 'A' ? couple.nameA : couple.nameB}
                      </span>
                    )}
                    <div className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0">
                      {stop.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-[#8E1B1B] fill-[#8E1B1B]/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#6E5B52]" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Milestone / Days to Do Task Form */}
            <form onSubmit={handleAddStop} className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C110E] uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#8E1B1B]" />
                  <span>Add New Days-to-Do / Reunion Milestone</span>
                </span>
                <span className="text-[11px] text-[#6E5B52]">Counts toward your reunion roadmap</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className="block text-[11px] font-semibold text-[#1C110E] mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Midnight Rooftop Gelato or Pack Polaroid camera"
                    value={newStopTitle}
                    onChange={(e) => setNewStopTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs focus:outline-[#8E1B1B]"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-[#1C110E] mb-1">Timing / Countdown Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. D-7, D-2, Day 1 • 9:00 PM"
                    value={newStopTime}
                    onChange={(e) => setNewStopTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs focus:outline-[#8E1B1B]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-[#1C110E] mb-1">Category</label>
                  <select
                    value={newStopCategory}
                    onChange={(e) => setNewStopCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs focus:outline-[#8E1B1B]"
                  >
                    <option value="prep">Prep / Checklist</option>
                    <option value="pack">Packing</option>
                    <option value="flight">Flight / Travel</option>
                    <option value="date">Date / Dinner</option>
                    <option value="stay">Hotel / Stay</option>
                    <option value="surprise">Surprise / Gift</option>
                    <option value="activity">Activity</option>
                  </select>
                </div>

                <div className="sm:col-span-7">
                  <label className="block text-[11px] font-semibold text-[#1C110E] mb-1">Notes / Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Don't forget the secret love letter"
                    value={newStopDesc}
                    onChange={(e) => setNewStopDesc(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs focus:outline-[#8E1B1B]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-[#1C110E] mb-1">Assigned Partner</label>
                  <select
                    value={newStopAssignee}
                    onChange={(e) => setNewStopAssignee(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E7D9C9] text-xs focus:outline-[#8E1B1B]"
                  >
                    <option value="both">Both of Us</option>
                    <option value="A">{couple.nameA}</option>
                    <option value="B">{couple.nameB}</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            </form>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PREPARE THE DOOR WIZARD */}
        {/* ========================================================================= */}
        {activeTab === 'prepare' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#8E1B1B] uppercase tracking-wider">THE DOOR CURATION</span>
              <h2 className="font-display text-4xl text-[#1C110E] font-medium mt-1">Prepare The Door.</h2>
              <p className="text-xs text-[#6E5B52]">Curate the final moment when the distance turns to zero. Every detail, every memory, every lyric they will hear.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Settings Form */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Reveal Title</label>
                  <input
                    type="text"
                    value={couple.reunionTitle}
                    onChange={(e) => couple.reunionTitle = e.target.value}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Your Final Love Message</label>
                  <textarea
                    value={doorState.finalMessage}
                    onChange={(e) => updateDoorState({ finalMessage: e.target.value })}
                    rows={3}
                    className="w-full p-3 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs leading-relaxed resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Music for the Moment</label>
                  <input
                    type="text"
                    value={doorState.musicTrack}
                    onChange={(e) => updateDoorState({ musicTrack: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-2">Memories in The Door Reveal</label>
                  <div className="grid grid-cols-4 gap-2">
                    {memories.slice(0, 4).map((m) => (
                      <div key={m.id} className="p-1.5 bg-[#F7EFE4] rounded-xl border border-[#8E1B1B] text-center">
                        <img src={m.imageUrl} alt={m.title} className="w-full h-14 object-cover rounded-lg mb-1" />
                        <span className="text-[9px] font-bold block truncate">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    showToast('Door configuration saved');
                    openTheDoor();
                  }}
                  className="w-full py-3.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Preview The Door Reveal →</span>
                </button>
              </div>

              {/* Right Live Preview Visual */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#1C110E] text-white space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-300">Live Preview</span>
                
                <div className="relative rounded-2xl overflow-hidden aspect-3/4 border-2 border-amber-300/40 bg-gradient-to-b from-amber-200 via-amber-600 to-black p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-white/80 text-[#8E1B1B] flex items-center justify-center mb-3 shadow-lg">
                    <Play className="w-5 h-5 fill-[#8E1B1B] ml-0.5" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-[#1C110E]">The Door to Forever</h4>
                  <p className="text-xs text-[#1C110E] font-script text-base">"Bridging {distanceKmText} forever."</p>
                </div>

                <div className="text-xs text-white/70 space-y-1.5 pt-2 border-t border-white/20">
                  <p className="flex items-center justify-between">
                    <span>Autoplay music</span>
                    <span className="text-emerald-400 font-semibold">Enabled</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>Quality</span>
                    <span className="text-amber-300 font-semibold">High 1080p</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
};
