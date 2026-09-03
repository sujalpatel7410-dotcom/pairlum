import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Flame, Heart, LogOut } from 'lucide-react';

export const CoupleOnboardingView: React.FC = () => {
  const { createCoupleSpace, joinCoupleSpace, signOut } = useAuth();
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const { error } = await createCoupleSpace(name);
    setIsSubmitting(false);
    if (error) setError(error);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const { error } = await joinCoupleSpace(inviteCode, name);
    setIsSubmitting(false);
    if (error) setError(error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5] px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-full bg-[#8E1B1B]/10 flex items-center justify-center">
            <Flame className="w-4 h-4 text-[#8E1B1B]" />
          </div>
          <span className="font-display text-2xl font-semibold text-[#1C110E]">Pairlum</span>
        </div>

        <div className="bg-white border border-[#E7D9C9] rounded-2xl p-6 space-y-4 warm-shadow-lg">
          {mode === 'choose' && (
            <>
              <div className="text-center space-y-1 mb-2">
                <Heart className="w-6 h-6 text-[#8E1B1B] mx-auto" />
                <h1 className="text-lg font-semibold text-[#1C110E]">Your Couple Space</h1>
                <p className="text-xs text-[#6E5B52]">Start a new sanctuary, or join your partner's.</p>
              </div>

              <button
                onClick={() => setMode('create')}
                className="w-full py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-medium transition-colors"
              >
                Create a Couple Space
              </button>
              <button
                onClick={() => setMode('join')}
                className="w-full py-2.5 rounded-full border border-[#8E1B1B] text-[#8E1B1B] hover:bg-[#8E1B1B]/5 text-sm font-medium transition-colors"
              >
                Join with an invite code
              </button>

              <button
                onClick={signOut}
                className="w-full pt-2 text-xs text-[#6E5B52] hover:text-[#8E1B1B] flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </>
          )}

          {mode === 'create' && (
            <form onSubmit={handleCreate} className="space-y-4">
              <h1 className="text-lg font-semibold text-[#1C110E]">Create your space</h1>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#6E5B52]">Your name (as your partner will see it)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E7D9C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#8E1B1B]/30"
                  placeholder="Emma"
                />
              </div>
              {error && <p className="text-xs text-[#8E1B1B]">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-medium transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'Creating…' : 'Create Couple Space'}
              </button>
              <button type="button" onClick={() => setMode('choose')} className="w-full text-xs text-[#6E5B52] underline">
                Back
              </button>
            </form>
          )}

          {mode === 'join' && (
            <form onSubmit={handleJoin} className="space-y-4">
              <h1 className="text-lg font-semibold text-[#1C110E]">Join your partner</h1>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#6E5B52]">Your name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E7D9C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#8E1B1B]/30"
                  placeholder="Liam"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#6E5B52]">Invite code</label>
                <input
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-lg border border-[#E7D9C9] text-sm tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-[#8E1B1B]/30"
                  placeholder="K3F9QZ"
                  maxLength={6}
                />
              </div>
              {error && <p className="text-xs text-[#8E1B1B]">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-medium transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'Joining…' : 'Join Couple Space'}
              </button>
              <button type="button" onClick={() => setMode('choose')} className="w-full text-xs text-[#6E5B52] underline">
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
