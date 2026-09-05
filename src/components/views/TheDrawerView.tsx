import React, { useState } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { PageRail } from '../common/PageRail';
import { PaperCard } from '../common/PaperCard';
import { DrawerCategory, DrawerItem } from '../../types';
import {
  Lock,
  Unlock,
  Mail,
  Clock,
  FileText,
  Ticket,
  ShieldCheck,
  Plus,
  Sparkles,
  KeyRound,
  Play,
  Pause,
  Eye,
  CheckCircle2,
  Calendar,
  X,
  Heart,
  UploadCloud
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCloudinaryUpload } from '../../lib/useCloudinaryUpload';

export const TheDrawerView: React.FC = () => {
  const {
    drawerItems,
    addDrawerItem,
    currentUser,
    couple,
    unlockDrawerWithPin,
    lockDrawer,
    showToast,
    memories
  } = usePairlum();

  const [activeCategory, setActiveCategory] = useState<DrawerCategory>('love_letters');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Modals & Wizards
  const [isNewLetterOpen, setIsNewLetterOpen] = useState(false);
  const [isTimeCapsuleWizardOpen, setIsTimeCapsuleWizardOpen] = useState(false);
  const [selectedLockedEnvelope, setSelectedLockedEnvelope] = useState<DrawerItem | null>(null);
  const [capsuleOpenedItem, setCapsuleOpenedItem] = useState<DrawerItem | null>(null);

  // New Letter / Open When form state (Screenshot 39)
  const [letterType, setLetterType] = useState<'love_letter' | 'open_when'>('open_when');
  const [openWhenCondition, setOpenWhenCondition] = useState('When you miss me');
  const [letterBody, setLetterBody] = useState('I know some days get heavy. When that happens, I just want you to know that I am here, always. You are stronger than you think. I love you. ♡');
  const [customCondition, setCustomCondition] = useState('');

  // Time Capsule Wizard State (Screenshot 42)
  const [capsuleTitle, setCapsuleTitle] = useState('Our Year Together');
  const [capsuleMessage, setCapsuleMessage] = useState('For the us who made it through everything.');
  const [capsuleUnlockDate, setCapsuleUnlockDate] = useState('25 December 2027 • 10:00 AM');
  const [selectedCapsuleMemories, setSelectedCapsuleMemories] = useState<string[]>(['mem-1', 'mem-2', 'mem-3', 'mem-4']);

  // Attached photo (optional) for letters / capsules
  const [letterPhotoUrl, setLetterPhotoUrl] = useState<string | undefined>(undefined);
  const [capsulePhotoUrl, setCapsulePhotoUrl] = useState<string | undefined>(undefined);
  const { upload: uploadLetterPhoto, isUploading: isUploadingLetterPhoto, progress: letterPhotoProgress } = useCloudinaryUpload();
  const { upload: uploadCapsulePhoto, isUploading: isUploadingCapsulePhoto, progress: capsulePhotoProgress } = useCloudinaryUpload();

  const handleLetterPhotoSelected = async (file: File | undefined) => {
    if (!file) return;
    const result = await uploadLetterPhoto(file);
    if (result) setLetterPhotoUrl(result.secureUrl);
  };

  const handleCapsulePhotoSelected = async (file: File | undefined) => {
    if (!file) return;
    const result = await uploadCapsulePhoto(file);
    if (result) setCapsulePhotoUrl(result.secureUrl);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockDrawerWithPin(pinInput)) {
      setPinError(false);
      setPinInput('');
      showToast('The Drawer unlocked');
    } else {
      setPinError(true);
    }
  };

  const handleSaveLetter = () => {
    addDrawerItem({
      category: letterType === 'open_when' ? 'open_when' : 'love_letters',
      title: letterType === 'open_when' ? (openWhenCondition === 'Custom' ? customCondition : openWhenCondition) : 'A Letter for you',
      body: letterBody,
      author: currentUser,
      authorName: currentUser === 'A' ? (couple?.nameA || 'A') : (couple?.nameB || 'B'),
      condition: letterType === 'open_when' ? openWhenCondition : undefined,
      isLocked: false,
      unlockDate: '25 Dec 2026 • 08:00 PM',
      photoUrl: letterPhotoUrl
    });
    setIsNewLetterOpen(false);
    setLetterPhotoUrl(undefined);
  };

  const handleSaveCapsule = () => {
    addDrawerItem({
      category: 'time_capsule',
      title: capsuleTitle || 'Time Capsule',
      body: capsuleMessage,
      author: currentUser,
      authorName: currentUser === 'A' ? (couple?.nameA || 'A') : (couple?.nameB || 'B'),
      unlockDate: capsuleUnlockDate,
      isLocked: true,
      sealedMemoriesCount: selectedCapsuleMemories.length,
      photoUrl: capsulePhotoUrl
    });
    setIsTimeCapsuleWizardOpen(false);
    setCapsulePhotoUrl(undefined);
    confetti({
      particleCount: 50,
      colors: ['#8E1B1B', '#C63A2E', '#E8A33D']
    });
  };

  const filteredItems = drawerItems.filter(item => {
    if (activeCategory === 'love_letters') return item.category === 'love_letters';
    if (activeCategory === 'open_when') return item.category === 'open_when';
    if (activeCategory === 'promises') return item.category === 'promises';
    if (activeCategory === 'time_capsule') return item.category === 'time_capsule';
    if (activeCategory === 'tickets') return item.category === 'tickets';
    if (activeCategory === 'secrets') return item.category === 'secrets';
    return true;
  });

  const isUnlocked = couple?.isDrawerUnlocked || false;

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto pb-20">

      {/* Left PageRail */}
      <PageRail
        step="04 / 06"
        categoryLabel="PRIVATE ARCHIVE"
        title="The Drawer"
        subtitle="Private things only you two share. Time capsules, sealed Open When letters, and secret vows."
        quote="Some things are meant to be felt, not rushed."
        quoteAuthor={couple ? `${couple.nameA} & ${couple.nameB}` : "A & B"}
        illustrationSrc="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80"
        illustrationCaption="Locked with love in The Drawer ♡"
      >
        <div className="space-y-1 pt-2">
          <button
            onClick={() => setActiveCategory('love_letters')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${activeCategory === 'love_letters' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
              }`}
          >
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Love Letters</span>
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
              {drawerItems.filter(i => i.category === 'love_letters').length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('open_when')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${activeCategory === 'open_when' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
              }`}
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Open When...</span>
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              {drawerItems.filter(i => i.category === 'open_when').length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('time_capsule')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${activeCategory === 'time_capsule' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
              }`}
          >
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Time Capsule</span>
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
              {drawerItems.filter(i => i.category === 'time_capsule').length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('promises')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${activeCategory === 'promises' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
              }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Promises</span>
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
              {drawerItems.filter(i => i.category === 'promises').length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('tickets')}
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${activeCategory === 'tickets' ? 'bg-[#8E1B1B] text-white' : 'text-[#6E5B52] hover:bg-[#F7EFE4]'
              }`}
          >
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              <span>Tickets & Passes</span>
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
              {drawerItems.filter(i => i.category === 'tickets').length}
            </span>
          </button>
        </div>

        {/* PIN Security Status */}
        <div className="pt-4 border-t border-[#E7D9C9]">
          <div className="p-3.5 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1C110E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8E1B1B]" />
                <span>PIN Security</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {isUnlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            <p className="text-[11px] text-[#6E5B52]">
              {isUnlocked ? 'Session active. Tap to lock before leaving.' : 'PIN protected. Only you two know the code.'}
            </p>
            {isUnlocked ? (
              <button
                onClick={lockDrawer}
                className="w-full py-1.5 rounded-lg bg-[#FFFBF5] border border-[#E7D9C9] text-[11px] font-medium text-[#8E1B1B] hover:bg-white cursor-pointer"
              >
                Lock Drawer Now
              </button>
            ) : null}
          </div>
        </div>
      </PageRail>

      {/* Main Content Area */}
      <main className="flex-1 space-y-8">

        {/* IF LOCKED: SHOW PIN GATE */}
        {!isUnlocked ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow-lg text-center max-w-md mx-auto my-12 space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-display text-3xl font-medium text-[#1C110E]">Enter 6-digit PIN</h3>
              <p className="text-xs text-[#6E5B52] mt-1.5">
                The Drawer contains your secret letters and time-locked memories.
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 rounded-2xl bg-white border border-[#E7D9C9] text-[#1C110E] focus:outline-hidden focus:border-[#8E1B1B]"
              />

              {pinError && (
                <p className="text-xs text-[#8E1B1B] font-medium animate-shake">
                  Incorrect PIN. Try 140224 or 123456.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wider uppercase cursor-pointer"
              >
                Unlock The Drawer
              </button>
            </form>

            <p className="text-[11px] text-[#6E5B52]">
              Demo PIN: <strong>140224</strong> (Anniversary date)
            </p>
          </div>
        ) : (
          /* DRAWER UNLOCKED INTERFACE */
          <div className="space-y-8 animate-in fade-in duration-200">

            {/* Top Action Bar (Screenshot 43) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E7D9C9]">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-[#1C110E] capitalize font-medium">
                  {activeCategory.replace('_', ' ')}
                </h2>
                <p className="text-xs text-[#6E5B52] mt-0.5">
                  Words from the heart, kept somewhere safe.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {activeCategory === 'time_capsule' ? (
                  <button
                    onClick={() => setIsTimeCapsuleWizardOpen(true)}
                    className="px-5 py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Time Capsule</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLetterType(activeCategory === 'open_when' ? 'open_when' : 'love_letter');
                      setIsNewLetterOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New Letter</span>
                  </button>
                )}
              </div>
            </div>

            {/* OPEN WHEN... / TIME CAPSULE SECTIONS */}
            {activeCategory === 'time_capsule' ? (
              /* TIME CAPSULE LOCKED CARD (Screenshot 26) */
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow-lg">
                  <div className="flex flex-col lg:flex-row gap-8 justify-between">

                    <div className="space-y-4 max-w-md">
                      <div className="flex items-center gap-2 text-xs text-[#8E1B1B] font-semibold">
                        <Lock className="w-4 h-4" />
                        <span>TIME CAPSULE LOCKED</span>
                      </div>

                      <h3 className="font-display text-4xl text-[#1C110E] font-medium">
                        Our Year Together ♡
                      </h3>

                      <div>
                        <span className="text-[11px] text-[#6E5B52] uppercase tracking-wider block font-semibold">
                          UNLOCK ON
                        </span>
                        <p className="text-sm text-[#1C110E] font-medium mt-0.5">
                          📅 25 December 2027 • 10:00 AM
                        </p>
                      </div>

                      <div className="py-2">
                        <div className="font-display text-5xl font-bold text-[#8E1B1B]">
                          18 <span className="text-2xl font-normal text-[#1C110E]">days</span>
                        </div>
                        <p className="text-xs text-[#6E5B52] mt-1">until unlock</p>
                      </div>

                      <p className="text-xs text-[#6E5B52] leading-relaxed">
                        This capsule is sealed and locked until 25 December 2027. You won't be able to open it until then.
                      </p>

                      <div className="pt-2 flex gap-3">
                        <button
                          onClick={() => {
                            setCapsuleOpenedItem(drawerItems[4]);
                            confetti({ particleCount: 60 });
                          }}
                          className="px-5 py-2.5 rounded-full bg-[#8E1B1B] text-white text-xs font-medium cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Simulate Reveal ("It's Time")</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Peek Inside */}
                    <div className="w-full lg:w-80 space-y-4">
                      <span className="text-xs font-bold text-[#1C110E] uppercase tracking-wider block">
                        A PEEK INSIDE
                      </span>
                      <p className="text-xs text-[#6E5B52]">4 memories • 2 notes • 1 promise</p>

                      <div className="flex gap-2">
                        {['https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=300&q=80',
                          'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80',
                          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80'].map((img, idx) => (
                            <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-[#E7D9C9] relative bg-black">
                              <img src={img} alt="Peek" className="w-full h-full object-cover opacity-60 blur-xs" />
                              <Lock className="w-4 h-4 text-white absolute inset-0 m-auto" />
                            </div>
                          ))}
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white border border-[#E7D9C9] text-xs">
                        <p className="text-[#1C110E] font-script text-base italic leading-snug">
                          "For the us who made it through everything." ♡
                        </p>
                        <p className="text-[10px] text-[#8E1B1B] text-right mt-1">— Emma & Liam</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              /* LETTERS / OPEN WHEN LIST (Screenshots 39, 43) */
              <div className="space-y-4">

                {/* Banner message */}
                <div className="p-6 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-16 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center text-xs font-serif">
                      ♡
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[#1C110E]">Some things deserve more than a message.</h3>
                    <p className="text-xs text-[#6E5B52] mt-1">
                      Write a love letter, leave an Open When note, or save words for a day that hasn't happened yet.
                    </p>
                  </div>
                </div>

                {/* Letters List */}
                {filteredItems.length === 0 ? (
                  <div className="py-16 text-center rounded-3xl border border-dashed border-[#E7D9C9] bg-[#F7EFE4]/50 flex flex-col items-center justify-center">
                    <Mail className="w-10 h-10 text-[#8E1B1B]/30 mb-4" />
                    <p className="text-base text-[#1C110E] font-medium font-display mb-1">
                      It's quiet in here
                    </p>
                    <p className="text-xs text-[#6E5B52]">Click the button above to add your first item.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedLockedEnvelope(item)}
                        className="p-5 rounded-2xl bg-white border border-[#E7D9C9] warm-shadow transition-all hover:scale-[1.01] hover:border-[#8E1B1B]/40 cursor-pointer flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.isLocked ? 'bg-amber-100 text-amber-900' : 'bg-[#8E1B1B]/10 text-[#8E1B1B]'
                            }`}>
                            {item.isLocked ? <Lock className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                          </div>

                          <div>
                            <h4 className="font-display text-base font-semibold text-[#1C110E]">
                              {item.title}
                            </h4>
                            <p className="font-script text-base text-[#6E5B52] line-clamp-1">
                              {item.isLocked ? 'Sealed with love until the right moment.' : `"${item.body}"`}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.isLocked ? 'bg-amber-100 text-amber-800' : 'text-[#6E5B52]'
                            }`}>
                            {item.isLocked ? `Locked (${item.unlockDate})` : item.createdAt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* TIME CAPSULE REVEAL MODAL: "IT'S TIME" (Screenshot 24) */}
        {capsuleOpenedItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#1C110E]/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl rounded-3xl bg-[#FFFBF5] border border-[#E7D9C9] p-8 warm-shadow-lg text-center space-y-6">
              <button
                onClick={() => setCapsuleOpenedItem(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7EFE4] flex items-center justify-center text-[#6E5B52] hover:text-[#1C110E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] mx-auto flex items-center justify-center">
                <Heart className="w-6 h-6 fill-[#8E1B1B]" />
              </div>

              <div>
                <h2 className="font-display text-5xl font-medium text-[#1C110E]">It's time.</h2>
                <p className="text-sm text-[#6E5B52] mt-1.5 font-script text-2xl">
                  Your time capsule is open. These are the memories you chose to keep, forever.
                </p>
                <span className="text-xs text-[#8E1B1B] font-semibold mt-2 inline-block">
                  Opened on 25 December 2027 ♡
                </span>
              </div>

              {/* Memories grid & voice note */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {memories.slice(0, 3).map((m) => (
                  <div key={m.id} className="p-2.5 bg-white rounded-2xl border border-[#E7D9C9] warm-shadow">
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-[#F7EFE4] mb-2">
                      <img src={m.imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80'} alt="Capsule mem" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-display text-xs font-semibold text-[#1C110E] truncate">{m.title}</p>
                    <p className="font-script text-xs text-[#6E5B52] truncate">"{m.caption}"</p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] max-w-md mx-auto flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center flex-shrink-0">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-[#1C110E]">A message for you</h4>
                  <p className="text-xs text-[#6E5B52]">Voice note • 0:48</p>
                </div>
              </div>

              <button
                onClick={() => setCapsuleOpenedItem(null)}
                className="px-8 py-3 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide cursor-pointer"
              >
                Close & Keep Forever in Our Story ♡
              </button>
            </div>
          </div>
        )}

        {/* OPEN WHEN / ENVELOPE MODAL (Screenshot 41) */}
        {selectedLockedEnvelope && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C110E]/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-3xl bg-[#FFFBF5] border border-[#E7D9C9] p-8 text-center space-y-6 warm-shadow-lg">
              <button
                onClick={() => setSelectedLockedEnvelope(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7EFE4] flex items-center justify-center text-[#6E5B52] hover:text-[#1C110E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-bold text-[#8E1B1B] uppercase tracking-wider">
                OPEN WHEN
              </span>

              <h2 className="font-display text-4xl text-[#1C110E] font-medium">
                {selectedLockedEnvelope.title}
              </h2>

              {/* Envelope visual (Screenshot 41) */}
              <div className="relative w-64 h-44 mx-auto rounded-2xl bg-[#FFF5E9] border-2 border-[#E7D9C9] warm-shadow-lg flex items-center justify-center">
                {/* Envelope fold diagonal lines */}
                <div className="absolute inset-0 border-t-2 border-r-2 border-[#E7D9C9] rotate-45 scale-75 opacity-30 pointer-events-none" />

                {/* Wax Seal */}
                <div className="w-12 h-12 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center font-serif text-lg shadow-md z-10 border border-[#A31D1D]">
                  ♡
                </div>
              </div>

              {selectedLockedEnvelope.isLocked ? (
                <div className="p-4 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] space-y-1">
                  <h4 className="font-display text-lg font-semibold text-[#1C110E]">This letter is locked</h4>
                  <p className="text-xs text-[#6E5B52]">
                    It will open when the right moment arrives: {selectedLockedEnvelope.unlockDate}
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-[#FFFBF5] border border-[#E7D9C9] stationery-lines text-left">
                  {selectedLockedEnvelope.photoUrl && (
                    <img
                      src={selectedLockedEnvelope.photoUrl}
                      alt="Attached"
                      className="w-full h-40 object-cover rounded-xl mb-4 border border-[#E7D9C9]"
                    />
                  )}
                  <p className="font-script text-2xl text-[#1C110E] leading-[28px]">
                    "{selectedLockedEnvelope.body}"
                  </p>
                  <p className="text-xs text-[#8E1B1B] text-right font-script text-base mt-4">
                    — with love, {selectedLockedEnvelope.authorName} ♡
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedLockedEnvelope(null)}
                className="px-6 py-2.5 rounded-full bg-[#FFFBF5] border border-[#E7D9C9] text-xs font-medium text-[#1C110E] hover:border-[#8E1B1B] cursor-pointer"
              >
                Back to The Drawer
              </button>
            </div>
          </div>
        )}

        {/* WRITE LETTER / OPEN WHEN COMPOSER (Screenshot 39) */}
        {isNewLetterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C110E]/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-3xl bg-[#FFFBF5] border border-[#E7D9C9] p-6 sm:p-8 warm-shadow-lg space-y-6">
              <button
                onClick={() => { setIsNewLetterOpen(false); setLetterPhotoUrl(undefined); }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7EFE4] flex items-center justify-center text-[#6E5B52] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h2 className="font-display text-3xl font-medium text-[#1C110E]">Open When...</h2>
                <p className="text-xs text-[#6E5B52] mt-0.5">Write something now for a moment they'll need later.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

                {/* Condition radio choices */}
                <div className="md:col-span-5 space-y-2">
                  <label className="block text-xs font-semibold text-[#1C110E] mb-2">When should this open?</label>
                  {['When you miss me', 'When you feel sad', 'When you need motivation', 'On a special date', 'Custom'].map((cond) => (
                    <label
                      key={cond}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${openWhenCondition === cond ? 'bg-[#8E1B1B] text-white border-[#8E1B1B]' : 'bg-[#F7EFE4] text-[#1C110E] border-[#E7D9C9]'
                        }`}
                    >
                      <input
                        type="radio"
                        name="cond"
                        checked={openWhenCondition === cond}
                        onChange={() => setOpenWhenCondition(cond)}
                        className="hidden"
                      />
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${openWhenCondition === cond ? 'border-white' : 'border-[#6E5B52]'}`}>
                        {openWhenCondition === cond && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span>{cond}</span>
                    </label>
                  ))}

                  {openWhenCondition === 'Custom' && (
                    <input
                      type="text"
                      value={customCondition}
                      onChange={(e) => setCustomCondition(e.target.value)}
                      placeholder="e.g. When it rains in Mumbai"
                      className="w-full p-2 rounded-xl bg-white border border-[#E7D9C9] text-xs mt-2"
                    />
                  )}
                </div>

                {/* Stationery Textarea */}
                <div className="md:col-span-7 space-y-4">
                  <label className="block text-xs font-semibold text-[#1C110E]">Write your letter</label>
                  <div className="p-4 rounded-2xl bg-[#FFFBF5] border border-[#E7D9C9] stationery-lines warm-shadow">
                    <textarea
                      value={letterBody}
                      onChange={(e) => setLetterBody(e.target.value)}
                      rows={6}
                      className="w-full bg-transparent font-script text-2xl text-[#1C110E] focus:outline-hidden resize-none leading-[28px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C110E] mb-2">Attach a photo (optional)</label>
                    {letterPhotoUrl && (
                      <img src={letterPhotoUrl} alt="Attached" className="w-full h-28 object-cover rounded-xl mb-2 border border-[#E7D9C9]" />
                    )}
                    <label className="w-full py-2.5 rounded-full bg-[#F7EFE4] border border-[#E7D9C9] text-xs font-medium text-[#1C110E] cursor-pointer flex items-center justify-center gap-1.5 hover:border-[#8E1B1B]">
                      <UploadCloud className="w-3.5 h-3.5 text-[#8E1B1B]" />
                      <span>{isUploadingLetterPhoto ? `Uploading... ${letterPhotoProgress}%` : (letterPhotoUrl ? 'Change photo' : 'Upload a photo')}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingLetterPhoto}
                        onChange={(e) => handleLetterPhotoSelected(e.target.files?.[0])}
                      />
                    </label>
                  </div>

                  <button
                    onClick={handleSaveLetter}
                    className="w-full py-3 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide shadow-sm cursor-pointer"
                  >
                    Save & Lock ♡
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* CREATE TIME CAPSULE WIZARD (Screenshot 42) */}
        {isTimeCapsuleWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C110E]/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl rounded-3xl bg-[#FFFBF5] border border-[#E7D9C9] p-6 sm:p-8 warm-shadow-lg space-y-6">
              <button
                onClick={() => { setIsTimeCapsuleWizardOpen(false); setCapsulePhotoUrl(undefined); }}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7EFE4] flex items-center justify-center text-[#6E5B52] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <h2 className="font-display text-3xl font-medium text-[#1C110E]">Create a Time Capsule</h2>
                <p className="text-xs text-[#6E5B52] mt-0.5">Seal today's memories and open them together in the future.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C110E] mb-1">Capsule Title</label>
                    <input
                      type="text"
                      value={capsuleTitle}
                      onChange={(e) => setCapsuleTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C110E] mb-1">Unlock Date & Time</label>
                    <input
                      type="text"
                      value={capsuleUnlockDate}
                      onChange={(e) => setCapsuleUnlockDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1">Message for the Future</label>
                  <input
                    type="text"
                    value={capsuleMessage}
                    onChange={(e) => setCapsuleMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-2">Memories to Seal Inside</label>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {memories.slice(0, 4).map((m) => (
                      <div key={m.id} className="w-24 p-2 bg-white rounded-xl border border-[#8E1B1B] text-center flex-shrink-0">
                        <img src={m.imageUrl || 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=300&q=80'} alt={m.title} className="w-full h-16 object-cover rounded-lg mb-1" />
                        <p className="text-[10px] font-semibold truncate">{m.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-2">Attach a photo (optional)</label>
                  {capsulePhotoUrl && (
                    <img src={capsulePhotoUrl} alt="Attached" className="w-full h-28 object-cover rounded-xl mb-2 border border-[#E7D9C9]" />
                  )}
                  <label className="w-full py-2.5 rounded-full bg-[#F7EFE4] border border-[#E7D9C9] text-xs font-medium text-[#1C110E] cursor-pointer flex items-center justify-center gap-1.5 hover:border-[#8E1B1B]">
                    <UploadCloud className="w-3.5 h-3.5 text-[#8E1B1B]" />
                    <span>{isUploadingCapsulePhoto ? `Uploading... ${capsulePhotoProgress}%` : (capsulePhotoUrl ? 'Change photo' : 'Upload a photo')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingCapsulePhoto}
                      onChange={(e) => handleCapsulePhotoSelected(e.target.files?.[0])}
                    />
                  </label>
                </div>

                <button
                  onClick={handleSaveCapsule}
                  className="w-full py-3.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide shadow-md cursor-pointer"
                >
                  Seal Time Capsule Until {capsuleUnlockDate} ♡
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
