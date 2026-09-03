import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Flame } from 'lucide-react';

export const LoginView: React.FC<{ onSwitchToSignup: () => void }> = ({ onSwitchToSignup }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const { error } = await signIn(email, password);
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

        <form onSubmit={handleSubmit} className="bg-white border border-[#E7D9C9] rounded-2xl p-6 space-y-4 warm-shadow-lg">
          <h1 className="text-lg font-semibold text-[#1C110E]">Welcome back</h1>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#6E5B52]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E7D9C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#8E1B1B]/30"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[#6E5B52]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E7D9C9] text-sm focus:outline-none focus:ring-2 focus:ring-[#8E1B1B]/30"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-[#8E1B1B]">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-full bg-[#8E1B1B] hover:bg-[#751515] text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-xs text-[#6E5B52] text-center">
            New to Pairlum?{' '}
            <button type="button" onClick={onSwitchToSignup} className="text-[#8E1B1B] font-medium underline">
              Create an account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
