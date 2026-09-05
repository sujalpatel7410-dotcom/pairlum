import React, { useState } from 'react';
import { Flame, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaperCard } from '../common/PaperCard';

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen w-full flex items-center justify-center bg-[#FFFBF5] px-4 py-10">
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-center gap-2 mb-8">
        <Flame className="w-6 h-6 text-[#8E1B1B]" />
        <span className="font-serif text-2xl text-[#1C110E]">Pairlum</span>
      </div>
      {children}
    </div>
  </div>
);

const Field: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}> = ({ label, type = 'text', value, onChange, placeholder, autoComplete }) => (
  <label className="block mb-4">
    <span className="block text-xs font-medium text-[#6E5B52] mb-1.5">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
      className="w-full rounded-xl border border-[#E7D9C9] bg-white px-4 py-2.5 text-sm text-[#1C110E] outline-none focus:border-[#8E1B1B]/50 focus:ring-2 focus:ring-[#8E1B1B]/10 transition-all"
    />
  </label>
);

const SubmitButton: React.FC<{ label: string; loading: boolean }> = ({ label, loading }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full rounded-xl bg-[#8E1B1B] text-white py-2.5 text-sm font-medium warm-shadow hover:bg-[#7A1717] disabled:opacity-60 transition-all"
  >
    {loading ? 'Please wait…' : label}
  </button>
);

const ErrorNote: React.FC<{ message: string | null }> = ({ message }) =>
  message ? (
    <p className="mb-4 text-xs text-[#8E1B1B] bg-[#8E1B1B]/8 border border-[#8E1B1B]/15 rounded-lg px-3 py-2">
      {message}
    </p>
  ) : null;

const LoginOrSignup: React.FC = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedUp, setSignedUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setSignedUp(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  if (signedUp) {
    return (
      <PaperCard className="p-6 text-center">
        <Heart className="w-8 h-8 text-[#8E1B1B] mx-auto mb-3" />
        <p className="font-serif text-lg text-[#1C110E] mb-2">Check your inbox</p>
        <p className="text-sm text-[#6E5B52]">
          We sent a confirmation link to <strong>{email}</strong>. Confirm it, then come back and log in.
        </p>
        <button
          className="mt-5 text-sm text-[#8E1B1B] font-medium"
          onClick={() => { setSignedUp(false); setMode('login'); }}
        >
          Back to login
        </button>
      </PaperCard>
    );
  }

  return (
    <PaperCard className="p-6">
      <p className="font-serif text-lg text-[#1C110E] mb-1">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </p>
      <p className="text-xs text-[#6E5B52] mb-5">
        {mode === 'login'
          ? 'Log in to open your shared space.'
          : 'One account per partner — you\'ll pair up with an invite code next.'}
      </p>
      <ErrorNote message={error} />
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full rounded-xl border border-[#E7D9C9] bg-white text-[#1C110E] py-2.5 text-sm font-medium hover:bg-[#F7EFE4] disabled:opacity-60 transition-all flex items-center justify-center gap-2 mb-4"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {googleLoading ? 'Please wait…' : `Continue with Google`}
      </button>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-[#E7D9C9]" />
        <span className="text-[10px] text-[#6E5B52] uppercase tracking-wider">or with email</span>
        <div className="flex-1 h-px bg-[#E7D9C9]" />
      </div>
      <form onSubmit={handleSubmit}>
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        <SubmitButton label={mode === 'login' ? 'Log in' : 'Sign up'} loading={loading} />
      </form>
      <button
        className="mt-4 w-full text-center text-xs text-[#6E5B52]"
        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
      >
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <span className="text-[#8E1B1B] font-medium">{mode === 'login' ? 'Sign up' : 'Log in'}</span>
      </button>
    </PaperCard>
  );
};

const Pairing: React.FC = () => {
  const { createCouple, joinCouple, signOut, session } = useAuth();
  const [mode, setMode] = useState<'choose' | 'create' | 'join' | 'created'>('choose');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createCouple(name);
      // Membership refresh happens inside createCouple; AuthGate re-renders
      // straight to the app once it lands, so this is just a brief heads-up.
      setMode('created');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your space.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await joinCouple(inviteCode, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join that space.');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'choose') {
    return (
      <PaperCard className="p-6">
        <p className="font-serif text-lg text-[#1C110E] mb-1">One more step</p>
        <p className="text-xs text-[#6E5B52] mb-5">
          Signed in as {session?.user.email}. Create your shared space, or join your partner's.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setMode('create')}
            className="w-full rounded-xl bg-[#8E1B1B] text-white py-2.5 text-sm font-medium warm-shadow hover:bg-[#7A1717] transition-all"
          >
            Create a new space
          </button>
          <button
            onClick={() => setMode('join')}
            className="w-full rounded-xl border border-[#E7D9C9] text-[#1C110E] py-2.5 text-sm font-medium hover:bg-[#F7EFE4] transition-all"
          >
            Join with an invite code
          </button>
        </div>
        <button className="mt-5 w-full text-center text-xs text-[#6E5B52]" onClick={() => signOut()}>
          Sign out
        </button>
      </PaperCard>
    );
  }

  if (mode === 'create') {
    return (
      <PaperCard className="p-6">
        <p className="font-serif text-lg text-[#1C110E] mb-1">Create your space</p>
        <p className="text-xs text-[#6E5B52] mb-5">You'll get an invite code to share with your partner.</p>
        <ErrorNote message={error} />
        <form onSubmit={handleCreate}>
          <Field label="Your name" value={name} onChange={setName} placeholder="Emma" autoComplete="given-name" />
          <SubmitButton label="Create space" loading={loading} />
        </form>
        <button className="mt-4 w-full text-center text-xs text-[#6E5B52]" onClick={() => setMode('choose')}>
          Back
        </button>
      </PaperCard>
    );
  }

  if (mode === 'created') {
    return (
      <PaperCard className="p-6 text-center">
        <Heart className="w-8 h-8 text-[#8E1B1B] mx-auto mb-3" />
        <p className="font-serif text-lg text-[#1C110E] mb-4">Your space is ready</p>
        <p className="text-xs text-[#6E5B52] mb-4">
          Loading your invite code… if this doesn't move on its own, open Settings once you're in
          and share the invite code from there.
        </p>
      </PaperCard>
    );
  }

  return (
    <PaperCard className="p-6">
      <p className="font-serif text-lg text-[#1C110E] mb-1">Join your partner</p>
      <p className="text-xs text-[#6E5B52] mb-5">Enter the invite code they shared with you.</p>
      <ErrorNote message={error} />
      <form onSubmit={handleJoin}>
        <Field label="Your name" value={name} onChange={setName} placeholder="Liam" autoComplete="given-name" />
        <Field label="Invite code" value={inviteCode} onChange={setInviteCode} placeholder="ab12cd34" />
        <SubmitButton label="Join space" loading={loading} />
      </form>
      <button className="mt-4 w-full text-center text-xs text-[#6E5B52]" onClick={() => setMode('choose')}>
        Back
      </button>
    </PaperCard>
  );
};

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { configured, session, authLoading, membership, membershipLoading } = useAuth();

  if (!configured) {
    return (
      <Shell>
        <PaperCard className="p-6 text-center">
          <p className="font-serif text-lg text-[#1C110E] mb-2">Backend not configured</p>
          <p className="text-sm text-[#6E5B52]">
            Set <code className="text-xs">VITE_SUPABASE_URL</code> and{' '}
            <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> in your environment (see{' '}
            <code className="text-xs">.env.example</code>) to enable accounts and shared data.
          </p>
        </PaperCard>
      </Shell>
    );
  }

  if (authLoading || (session && membershipLoading)) {
    return (
      <Shell>
        <div className="text-center text-sm text-[#6E5B52]">Loading your space…</div>
      </Shell>
    );
  }

  if (!session) {
    return (
      <Shell>
        <LoginOrSignup />
      </Shell>
    );
  }

  if (!membership) {
    return (
      <Shell>
        <Pairing />
      </Shell>
    );
  }

  return <>{children}</>;
};
