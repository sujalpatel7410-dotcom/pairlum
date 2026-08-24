import React, { useState, useEffect } from 'react';
import { usePairlum } from '../../context/PairlumContext';
import { MemoryKind } from '../../types';
import { 
  X, 
  Camera, 
  Video, 
  Mic, 
  FileText, 
  Sparkles, 
  UploadCloud, 
  Image as ImageIcon, 
  Play, 
  Pause, 
  Trash2, 
  Check, 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  Lock,
  Heart,
  RotateCcw
} from 'lucide-react';
import { PaperCard } from '../common/PaperCard';

export const AddMemoryModal: React.FC = () => {
  const { 
    isAddMemoryModalOpen, 
    closeAddMemoryModal, 
    addMemoryModalInitialKind, 
    addMemory, 
    currentUser, 
    couple,
    chapters,
    setActiveLightboxMemory,
    memories
  } = usePairlum();

  const [step, setStep] = useState<'format' | 'media' | 'details' | 'uploading' | 'success'>('media');
  const [selectedKind, setSelectedKind] = useState<MemoryKind>(addMemoryModalInitialKind);
  
  // Memory fields
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('20 Aug 2026');
  const [time, setTime] = useState('7:45 PM');
  const [location, setLocation] = useState('Goa, India');
  const [chapterId, setChapterId] = useState(chapters[0]?.id || '');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80');
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedDuration, setRecordedDuration] = useState('0:28');
  
  // Upload Progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastCreatedId, setLastCreatedId] = useState<string>('');

  useEffect(() => {
    if (isAddMemoryModalOpen) {
      setSelectedKind(addMemoryModalInitialKind);
      setStep('media');
      setUploadProgress(0);
      setIsRecording(false);
      setRecordingSeconds(0);
    }
  }, [isAddMemoryModalOpen, addMemoryModalInitialKind]);

  // Voice recording timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => {
          const next = prev + 1;
          const mins = Math.floor(next / 60);
          const secs = next % 60;
          setRecordedDuration(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isAddMemoryModalOpen) return null;

  const partnerName = currentUser === 'A' ? couple.nameB : couple.nameA;
  const authorName = currentUser === 'A' ? couple.nameA : couple.nameB;

  const handleSaveMemory = () => {
    setStep('uploading');
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      if (progress >= 100) {
        progress = 100;
        setUploadProgress(100);
        clearInterval(interval);

        setTimeout(() => {
          addMemory({
            title: title || (selectedKind === 'voice' ? `Voice note for ${partnerName}` : 'A special moment'),
            caption: caption || 'A little moment worth keeping.',
            author: currentUser,
            authorName,
            kind: selectedKind,
            imageUrl: (selectedKind === 'note' ? undefined : imageUrl),
            audioDuration: selectedKind === 'voice' ? recordedDuration : undefined,
            videoDuration: selectedKind === 'video' ? '0:24' : undefined,
            date,
            time,
            location: location || 'The Window',
            chapterId: chapterId || undefined,
            isFavorite: true,
            isPrivate: false
          });
          setStep('success');
        }, 400);
      } else {
        setUploadProgress(progress);
      }
    }, 150);
  };

  const samplePhotos = [
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C110E]/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FFFBF5] border border-[#E7D9C9] warm-shadow-lg p-6 sm:p-8">
        
        {/* Close Button */}
        {step !== 'uploading' && (
          <button
            onClick={closeAddMemoryModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7EFE4] hover:bg-[#E7D9C9] flex items-center justify-center text-[#6E5B52] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* STEP: FORMAT SELECTION */}
        {step === 'format' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-medium text-[#1C110E]">Choose a format</h2>
              <p className="text-sm text-[#6E5B52] mt-1">Everything becomes part of your story.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
              <button
                onClick={() => { setSelectedKind('photo'); setStep('media'); }}
                className="p-5 rounded-2xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] text-left transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#8E1B1B]/10 flex items-center justify-center text-[#8E1B1B] mb-3 group-hover:scale-110 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-[#8E1B1B] uppercase tracking-wider mb-1">PHOTO</div>
                <h4 className="font-display text-base font-semibold text-[#1C110E]">Capture a moment</h4>
                <p className="text-xs text-[#6E5B52] mt-0.5">Private by default</p>
              </button>

              <button
                onClick={() => { setSelectedKind('video'); setStep('media'); }}
                className="p-5 rounded-2xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] text-left transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#8E1B1B]/10 flex items-center justify-center text-[#8E1B1B] mb-3 group-hover:scale-110 transition-transform">
                  <Video className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-[#8E1B1B] uppercase tracking-wider mb-1">VIDEO</div>
                <h4 className="font-display text-base font-semibold text-[#1C110E]">Record or upload</h4>
                <p className="text-xs text-[#6E5B52] mt-0.5">Private by default</p>
              </button>

              <button
                onClick={() => { setSelectedKind('voice'); setStep('media'); }}
                className="p-5 rounded-2xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] text-left transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#8E1B1B]/10 flex items-center justify-center text-[#8E1B1B] mb-3 group-hover:scale-110 transition-transform">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-[#8E1B1B] uppercase tracking-wider mb-1">VOICE</div>
                <h4 className="font-display text-base font-semibold text-[#1C110E]">Say it in your voice</h4>
                <p className="text-xs text-[#6E5B52] mt-0.5">Private by default</p>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                onClick={() => { setSelectedKind('note'); setStep('media'); }}
                className="p-5 rounded-2xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] text-left transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#8E1B1B]/10 flex items-center justify-center text-[#8E1B1B] mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-[#8E1B1B] uppercase tracking-wider mb-1">NOTE</div>
                <h4 className="font-display text-base font-semibold text-[#1C110E]">Write from the heart</h4>
                <p className="text-xs text-[#6E5B52] mt-0.5">Private by default</p>
              </button>

              <button
                onClick={() => { setSelectedKind('moment'); setStep('media'); }}
                className="p-5 rounded-2xl bg-[#F7EFE4] hover:bg-[#EFE4D6] border border-[#E7D9C9] text-left transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#8E1B1B]/10 flex items-center justify-center text-[#8E1B1B] mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-[11px] font-bold text-[#8E1B1B] uppercase tracking-wider mb-1">MOMENT</div>
                <h4 className="font-display text-base font-semibold text-[#1C110E]">Quick everyday memory</h4>
                <p className="text-xs text-[#6E5B52] mt-0.5">Private by default</p>
              </button>
            </div>
          </div>
        )}

        {/* STEP: MEDIA CAPTURE / PICKER */}
        {step === 'media' && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E7D9C9]">
              <button
                onClick={() => setStep('format')}
                className="text-xs text-[#8E1B1B] hover:underline font-medium cursor-pointer"
              >
                ← Change format ({selectedKind})
              </button>
              <span className="text-xs text-[#6E5B52]">Step 1 of 2</span>
            </div>

            {/* PHOTO OPTION */}
            {selectedKind === 'photo' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7">
                    <div className="relative rounded-2xl overflow-hidden border border-[#E7D9C9] warm-shadow aspect-4/3 bg-[#F7EFE4]">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-4">
                    <h3 className="font-display text-2xl text-[#1C110E]">Photo options</h3>
                    
                    <button
                      onClick={() => setStep('details')}
                      className="w-full py-3 px-4 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-medium transition-all shadow-sm cursor-pointer"
                    >
                      Use This Photo
                    </button>

                    <div className="pt-2">
                      <label className="text-xs font-semibold text-[#6E5B52] block mb-2">Or choose a cozy photo:</label>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {samplePhotos.map((url, idx) => (
                          <button
                            key={idx}
                            onClick={() => setImageUrl(url)}
                            className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-transform ${
                              imageUrl === url ? 'border-[#8E1B1B] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt="Option" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VOICE RECORDING OPTION */}
            {selectedKind === 'voice' && (
              <div className="py-4">
                <div className="text-center mb-6">
                  <span className="text-[11px] font-bold text-[#8E1B1B] tracking-wider uppercase">STEP 03 / VOICE</span>
                  <h3 className="font-display text-3xl text-[#1C110E] mt-1">Record a voice note</h3>
                  <p className="text-sm text-[#6E5B52] mt-1">Sometimes hearing you says more than typing ever could.</p>
                </div>

                <div className="p-8 rounded-3xl bg-[#F7EFE4] border border-[#E7D9C9] warm-shadow text-center">
                  <h4 className="font-display text-xl text-[#1C110E] mb-6">
                    Say something for {partnerName}
                  </h4>

                  {/* Audio Waveform visual */}
                  <div className="h-20 flex items-center justify-center gap-1 sm:gap-1.5 px-4 mb-6">
                    {Array.from({ length: 28 }).map((_, i) => {
                      const height = isRecording 
                        ? Math.sin(i * 0.4 + recordingSeconds) * 28 + 36 
                        : Math.abs(Math.sin(i * 0.3)) * 40 + 15;
                      return (
                        <div
                          key={i}
                          style={{ height: `${height}px` }}
                          className={`w-1.5 sm:w-2 rounded-full transition-all duration-150 ${
                            isRecording ? 'bg-[#8E1B1B]' : 'bg-[#C63A2E]/70'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="font-display text-2xl text-[#1C110E] mb-1 font-semibold">
                    {recordedDuration}
                  </div>
                  <p className="text-xs text-[#6E5B52] mb-6">
                    {isRecording ? 'Listening to your voice...' : 'Tap record to speak or done to save'}
                  </p>

                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => {
                        setIsRecording(false);
                        setRecordingSeconds(0);
                        setRecordedDuration('0:00');
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#FFFBF5] border border-[#E7D9C9] text-xs font-medium text-[#6E5B52] hover:text-[#1C110E] cursor-pointer"
                    >
                      Delete
                    </button>

                    {/* Record / Pause Toggle */}
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-md transition-transform hover:scale-105 cursor-pointer ${
                        isRecording ? 'bg-[#8E1B1B] animate-pulse ring-4 ring-[#8E1B1B]/20' : 'bg-[#8E1B1B]'
                      }`}
                    >
                      {isRecording ? <Pause className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                    </button>

                    <button
                      onClick={() => {
                        setIsRecording(false);
                        setStep('details');
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#FFFBF5] border border-[#E7D9C9] text-xs font-medium text-[#1C110E] hover:border-[#8E1B1B] cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NOTE WRITING OPTION */}
            {selectedKind === 'note' && (
              <div className="py-2">
                <div className="mb-4">
                  <h3 className="font-display text-2xl text-[#1C110E]">Write from your heart</h3>
                  <p className="text-xs text-[#6E5B52]">Leave warm stationery words for {partnerName}.</p>
                </div>

                <div className="p-6 rounded-2xl bg-[#FFFBF5] border border-[#E7D9C9] stationery-lines warm-shadow mb-6">
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Just wanted to remind you how amazing you are. Missing you a little extra today. Can't wait to see you soon. ♡"
                    rows={6}
                    className="w-full bg-transparent font-script text-2xl text-[#1C110E] placeholder:text-[#6E5B52]/50 focus:outline-hidden resize-none leading-[28px]"
                  />
                  <div className="text-right text-xs text-[#6E5B52] pt-2">
                    {caption.length} / 1000
                  </div>
                </div>

                <button
                  onClick={() => setStep('details')}
                  className="w-full py-3.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-medium shadow-sm cursor-pointer"
                >
                  Next: Add Details
                </button>
              </div>
            )}

            {/* VIDEO OPTION */}
            {selectedKind === 'video' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7">
                    <div className="relative rounded-2xl overflow-hidden border border-[#E7D9C9] warm-shadow aspect-4/3 bg-black">
                      <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" alt="Video" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                        <span>00:00</span>
                        <div className="flex-1 mx-3 h-1 bg-white/30 rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-[#8E1B1B]" />
                        </div>
                        <span>00:24</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-4">
                    <h3 className="font-display text-2xl text-[#1C110E]">Video options</h3>
                    <button
                      onClick={() => setStep('details')}
                      className="w-full py-3 px-4 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-medium transition-all shadow-sm cursor-pointer"
                    >
                      Use This Video (0:24)
                    </button>
                    <div className="text-xs text-[#6E5B52] space-y-2 pt-2 border-t border-[#E7D9C9]">
                      <p className="flex items-center gap-2">✓ Trim start / end</p>
                      <p className="flex items-center gap-2">✓ Choose cover frame</p>
                      <p className="flex items-center gap-2">✓ High quality audio</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MOMENT OPTION */}
            {selectedKind === 'moment' && (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="font-display text-2xl text-[#1C110E]">Everyday Moment</h3>
                  <p className="text-xs text-[#6E5B52] mt-1">A quick thought, feeling, or micro-memory from right now.</p>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Thinking about our walk yesterday. The sky was so calm."
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-[#F7EFE4] border border-[#E7D9C9] text-[#1C110E] text-base focus:outline-hidden focus:border-[#8E1B1B]"
                />
                <button
                  onClick={() => setStep('details')}
                  className="w-full py-3.5 rounded-full bg-[#8E1B1B] text-white text-sm font-medium cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP: DETAILS (Caption, Date, Location, Chapter, Visibility) */}
        {step === 'details' && (
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E7D9C9]">
              <button
                onClick={() => setStep('media')}
                className="text-xs text-[#8E1B1B] hover:underline font-medium cursor-pointer"
              >
                ← Back to media
              </button>
              <span className="text-xs text-[#6E5B52]">Step 2 of 2</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left preview polaroid */}
              <div className="md:col-span-5">
                <div className="p-3 bg-white rounded-2xl border border-[#E7D9C9] warm-shadow rotate-[-1deg]">
                  {selectedKind !== 'note' ? (
                    <img src={imageUrl} alt="Selected" className="w-full h-44 object-cover rounded-xl" />
                  ) : (
                    <div className="h-44 bg-[#F7EFE4] p-3 rounded-xl flex items-center justify-center text-center">
                      <p className="font-script text-lg text-[#1C110E]">"{caption || 'A handwritten note'}"</p>
                    </div>
                  )}
                  <p className="font-script text-base text-[#1C110E] mt-2.5 text-center truncate">
                    {title || 'Sunset date by the beach'} ♡
                  </p>
                  <p className="text-[11px] text-[#6E5B52] text-center">{date} • {location}</p>
                </div>
              </div>

              {/* Right form inputs */}
              <div className="md:col-span-7 space-y-4">
                
                {/* Caption */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Caption / Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Sunset date by the beach"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-sm text-[#1C110E] focus:outline-hidden focus:border-[#8E1B1B]"
                  />
                </div>

                {/* Subtitle / note */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5">Heart Note (optional)</label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Missing you a little extra today."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-sm text-[#1C110E] focus:outline-hidden focus:border-[#8E1B1B]"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C110E] mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#8E1B1B]" />
                      <span>Date</span>
                    </label>
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs text-[#1C110E] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C110E] mb-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8E1B1B]" />
                      <span>Time</span>
                    </label>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs text-[#1C110E] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-[#1C110E] mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#8E1B1B]" />
                    <span>Location (optional)</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Goa, India"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs text-[#1C110E] focus:outline-hidden"
                  />
                </div>

                {/* Chapter & Visibility */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C110E] mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#8E1B1B]" />
                      <span>Add to chapter</span>
                    </label>
                    <select
                      value={chapterId}
                      onChange={(e) => setChapterId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs text-[#1C110E] focus:outline-hidden"
                    >
                      {chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>{ch.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1C110E] mb-1.5 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#8E1B1B]" />
                      <span>Who can see this?</span>
                    </label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-[#F7EFE4] border border-[#E7D9C9] text-xs text-[#1C110E] font-medium flex items-center gap-1.5">
                      <span>Only us (Private)</span>
                    </div>
                  </div>
                </div>

                {/* Save Memory Button */}
                <button
                  id="save-memory-button"
                  onClick={handleSaveMemory}
                  className="w-full mt-4 py-3.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-semibold tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Save Memory</span>
                </button>

              </div>
            </div>
          </div>
        )}

        {/* STEP: UPLOADING PROGRESS RING (Screenshot 40) */}
        {step === 'uploading' && (
          <div className="py-12 text-center">
            <h3 className="font-display text-3xl text-[#1C110E] font-medium">Saving your memory</h3>
            <p className="text-sm text-[#6E5B52] mt-1">Keep this window open for just a moment.</p>

            <div className="my-10 flex justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG circular progress */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#F7EFE4"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#8E1B1B"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * uploadProgress) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-200"
                  />
                </svg>
                <div className="absolute font-display text-3xl font-bold text-[#1C110E]">
                  {uploadProgress}%
                </div>
              </div>
            </div>

            <h4 className="font-display text-xl font-semibold text-[#1C110E]">Uploading your memory...</h4>
            <p className="text-xs text-[#6E5B52] mt-1">Please don't close this page.</p>

            <button
              onClick={closeAddMemoryModal}
              className="mt-6 px-6 py-2 rounded-full border border-[#E7D9C9] text-xs text-[#6E5B52] hover:text-[#1C110E]"
            >
              Cancel
            </button>
          </div>
        )}

        {/* STEP: SUCCESS CONFIRMATION (Screenshot 36) */}
        {step === 'success' && (
          <div className="py-10 text-center">
            <div className="w-20 h-20 rounded-full bg-[#8E1B1B]/10 text-[#8E1B1B] mx-auto flex items-center justify-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#8E1B1B] text-white flex items-center justify-center shadow-md">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
            </div>

            <h3 className="font-display text-3xl font-semibold text-[#1C110E]">Saved to your story ♡</h3>
            <p className="text-sm text-[#6E5B52] mt-2 font-script text-xl">
              {partnerName} will see it in The Window.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  closeAddMemoryModal();
                  if (memories.length > 0) {
                    setActiveLightboxMemory(memories[0]);
                  }
                }}
                className="px-6 py-3 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-xs font-semibold tracking-wide cursor-pointer"
              >
                View Memory
              </button>
              
              <button
                onClick={() => {
                  setStep('format');
                  setTitle('');
                  setCaption('');
                }}
                className="px-6 py-3 rounded-full bg-[#FFFBF5] border border-[#E7D9C9] text-xs font-medium text-[#1C110E] hover:border-[#8E1B1B] cursor-pointer"
              >
                Add Another
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
