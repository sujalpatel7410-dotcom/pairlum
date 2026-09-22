import React, { useRef, useState } from 'react';
import { Flame, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PaperCard } from '../common/PaperCard';

const Field: React.FC<{
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}> = ({ label, type = 'text', value, onChange, placeholder, autoComplete }) => (
  <label className="block mb-4">
    <span className="block text-xs font-medium text-[#8A4058] mb-1.5">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required
      className="w-full rounded-xl border border-[#F4A9BF] bg-white px-4 py-2.5 text-sm text-[#4A0420] outline-none focus:border-[#E11D48]/50 focus:ring-2 focus:ring-[#E11D48]/10 transition-all"
    />
  </label>
);

const SubmitButton: React.FC<{ label: string; loading: boolean }> = ({ label, loading }) => (
  <button
    type="submit"
    disabled={loading}
    className="w-full rounded-xl bg-[#E11D48] text-white py-2.5 text-sm font-medium warm-shadow hover:bg-[#C81E45] disabled:opacity-60 transition-all"
  >
    {loading ? 'Please wait…' : label}
  </button>
);

const ErrorNote: React.FC<{ message: string | null }> = ({ message }) =>
  message ? (
    <p className="mb-4 text-xs text-[#E11D48] bg-[#E11D48]/8 border border-[#E11D48]/15 rounded-lg px-3 py-2">
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
        <Heart className="w-8 h-8 text-[#E11D48] mx-auto mb-3" />
        <p className="font-display text-lg text-[#4A0420] mb-2">Check your inbox</p>
        <p className="text-sm text-[#8A4058]">
          We sent a confirmation link to <strong>{email}</strong>. Confirm it, then come back and log in.
        </p>
        <button
          className="mt-5 text-sm text-[#E11D48] font-medium"
          onClick={() => { setSignedUp(false); setMode('login'); }}
        >
          Back to login
        </button>
      </PaperCard>
    );
  }

  return (
    <PaperCard className="p-6">
      <p className="font-display text-lg text-[#4A0420] mb-1">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </p>
      <p className="text-xs text-[#8A4058] mb-5">
        {mode === 'login'
          ? 'Log in to open your shared space.'
          : "One account per partner — you'll pair up with an invite code next."}
      </p>
      <ErrorNote message={error} />
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full rounded-xl border border-[#F4A9BF] bg-white text-[#4A0420] py-2.5 text-sm font-medium hover:bg-[#FFF1F4] disabled:opacity-60 transition-all flex items-center justify-center gap-2 mb-4"
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
        <div className="flex-1 h-px bg-[#F4A9BF]" />
        <span className="text-[10px] text-[#8A4058] uppercase tracking-wider">or with email</span>
        <div className="flex-1 h-px bg-[#F4A9BF]" />
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
        className="mt-4 w-full text-center text-xs text-[#8A4058]"
        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
      >
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <span className="text-[#E11D48] font-medium">{mode === 'login' ? 'Sign up' : 'Log in'}</span>
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
        <p className="font-display text-lg text-[#4A0420] mb-1">One more step</p>
        <p className="text-xs text-[#8A4058] mb-5">
          Signed in as {session?.user.email}. Create your shared space, or join your partner's.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setMode('create')}
            className="w-full rounded-xl bg-[#E11D48] text-white py-2.5 text-sm font-medium warm-shadow hover:bg-[#C81E45] transition-all"
          >
            Create a new space
          </button>
          <button
            onClick={() => setMode('join')}
            className="w-full rounded-xl border border-[#F4A9BF] text-[#4A0420] py-2.5 text-sm font-medium hover:bg-[#FFF1F4] transition-all"
          >
            Join with an invite code
          </button>
        </div>
        <button className="mt-5 w-full text-center text-xs text-[#8A4058]" onClick={() => signOut()}>
          Sign out
        </button>
      </PaperCard>
    );
  }

  if (mode === 'create') {
    return (
      <PaperCard className="p-6">
        <p className="font-display text-lg text-[#4A0420] mb-1">Create your space</p>
        <p className="text-xs text-[#8A4058] mb-5">You'll get an invite code to share with your partner.</p>
        <ErrorNote message={error} />
        <form onSubmit={handleCreate}>
          <Field label="Your name" value={name} onChange={setName} placeholder="Emma" autoComplete="given-name" />
          <SubmitButton label="Create space" loading={loading} />
        </form>
        <button className="mt-4 w-full text-center text-xs text-[#8A4058]" onClick={() => setMode('choose')}>
          Back
        </button>
      </PaperCard>
    );
  }

  if (mode === 'created') {
    return (
      <PaperCard className="p-6 text-center">
        <Heart className="w-8 h-8 text-[#E11D48] mx-auto mb-3" />
        <p className="font-display text-lg text-[#4A0420] mb-4">Your space is ready</p>
        <p className="text-xs text-[#8A4058] mb-4">
          Loading your invite code… if this doesn't move on its own, open Settings once you're in
          and share the invite code from there.
        </p>
      </PaperCard>
    );
  }

  return (
    <PaperCard className="p-6">
      <p className="font-display text-lg text-[#4A0420] mb-1">Join your partner</p>
      <p className="text-xs text-[#8A4058] mb-5">Enter the invite code they shared with you.</p>
      <ErrorNote message={error} />
      <form onSubmit={handleJoin}>
        <Field label="Your name" value={name} onChange={setName} placeholder="Liam" autoComplete="given-name" />
        <Field label="Invite code" value={inviteCode} onChange={setInviteCode} placeholder="ab12cd34" />
        <SubmitButton label="Join space" loading={loading} />
      </form>
      <button className="mt-4 w-full text-center text-xs text-[#8A4058]" onClick={() => setMode('choose')}>
        Back
      </button>
    </PaperCard>
  );
};

const FEATURES = [
  { label: 'Together', title: 'Every couple has a story', body: 'Pairlum gives yours a place to live, grow and be revisited.' },
  { label: 'Moments', title: 'Small days become memories', body: 'Save the detour, the dinner, the inside joke: the moments that never make it into a photo album.' },
  { label: 'Shared', title: 'Built for two', body: 'One space, two people. Add together, look back together.' },
  { label: 'Private', title: 'Just yours', body: 'Kept between the two of you, so you can be as honest and as silly as you like.' },
];

const SERVICES = [
  'Shared Timeline', 'Photo & Video Albums', 'Voice Notes', 'Anniversary Reminders',
  'Date Night Ideas', 'Shared Bucket List', 'Love Letters', 'Milestone Cards',
  'Travel Journals', 'Playlists for Two', 'Memory Capsules', 'Yearly Recap Books',
];

const Landing: React.FC = () => {
  const authRef = useRef<HTMLDivElement>(null);
  const scrollToAuth = () => authRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const { session, membership } = useAuth();

  return (
    <div className="min-h-screen w-full bg-[#FFD3DE]">
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-10 py-5 bg-[#FFD3DE]/85 backdrop-blur-sm border-b border-[#F4A9BF]/60">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#E11D48]" />
          <span className="font-display font-bold text-xl text-[#4A0420]">Pairlum</span>
        </div>
        <nav className="hidden sm:flex items-center gap-8 text-sm text-[#4A0420]">
          <a href="#about" className="hover:text-[#E11D48] transition-colors">About</a>
          <a href="#services" className="hover:text-[#E11D48] transition-colors">Memories</a>
        </nav>
        <button
          onClick={scrollToAuth}
          className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#E11D48] text-white text-sm font-semibold hover:-translate-y-0.5 transition-transform warm-shadow"
        >
          Start together
        </button>
      </header>

      <main>
        {/* Hero */}
        <section className="relative px-5 sm:px-10 pt-20 pb-10 overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#E11D48]/20 blur-3xl" />
          <div className="pointer-events-none absolute top-40 -left-20 w-72 h-72 rounded-full bg-[#F59E0B]/20 blur-3xl" />
          <p className="relative max-w-[30ch] text-lg text-[#8A4058] mb-4">
            A private space for two, made to keep what matters
          </p>
          <h1 className="relative font-display font-semibold text-[clamp(2.6rem,9vw,7rem)] leading-[0.92] tracking-[-0.045em] text-[#4A0420]">
            Where two people
            <br />make memories
            <br />worth keeping
          </h1>
          <div className="relative mt-10 -mx-5 sm:-mx-10 px-5 sm:px-10 py-8 bg-[#9F1239] text-[#FFF1F4] flex flex-wrap gap-6 items-center justify-between">
            <p className="max-w-[36ch] text-lg">Scroll to see how Pairlum works, then sign up in a minute</p>
            <button
              onClick={scrollToAuth}
              className="inline-flex items-center px-6 py-3 rounded-full bg-[#FFF1F4] text-[#9F1239] text-sm font-semibold hover:-translate-y-0.5 transition-transform"
            >
              Enter your world
            </button>
          </div>
        </section>

        {/* Feature blocks */}
        <section id="about" className="px-5 sm:px-10 py-16 grid gap-10 md:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.label} className="rounded-3xl bg-[#FFB8CB]/60 border border-[#F4A9BF] p-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#4A0420]/30 text-xs mb-5 text-[#4A0420]">
                <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
                {f.label}
              </span>
              <h2 className="font-display font-semibold text-[clamp(1.8rem,4vw,2.6rem)] leading-[0.95] tracking-[-0.03em] text-[#4A0420] mb-4 max-w-[11ch]">
                {f.title}
              </h2>
              <p className="max-w-[34ch] text-[#8A4058]">{f.body}</p>
            </div>
          ))}
        </section>

        {/* Services / what Pairlum includes */}
        <section id="services" className="px-5 sm:px-10 py-16 border-t border-[#4A0420]/15">
          <p className="max-w-[30ch] font-display font-medium text-[clamp(1.5rem,3.4vw,3rem)] leading-[1.15] tracking-[-0.025em] text-[#4A0420] mb-8">
            Pairlum turns everyday moments into a shared timeline, from first dates to whole decades.
          </p>
          <ol className="list-none p-0 m-0">
            {SERVICES.map((s, i) => (
              <li
                key={s}
                className="flex gap-6 items-baseline py-4 border-t last:border-b border-[#4A0420]/15 font-display font-medium text-[clamp(1.2rem,3vw,2rem)] tracking-[-0.02em] text-[#4A0420] hover:pl-4 transition-[padding]"
              >
                <span className="min-w-[3.5rem] text-sm font-sans text-[#8A4058]">({String(i + 1).padStart(3, '0')})</span>
                {s}
              </li>
            ))}
          </ol>
        </section>

        {/* Auth section */}
        <section ref={authRef} className="px-5 sm:px-10 py-20 flex flex-col items-center gap-6 border-t border-[#4A0420]/15">
          <div className="flex items-center gap-2 text-[#8A4058] text-sm">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>{!session ? 'Sign in or create an account to begin' : 'Almost there'}</span>
          </div>
          <div className="w-full max-w-sm">
            {!session ? <LoginOrSignup /> : !membership ? <Pairing /> : null}
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-[#8A4058]">
        <div className="flex items-center justify-center gap-2">
          <Flame className="w-3.5 h-3.5 text-[#E11D48]" />
          <span className="font-display font-medium text-[#4A0420]">Pairlum</span>
          <span>•</span>
          <span className="font-script text-base text-[#E11D48]">a private space for two</span>
        </div>
      </footer>
    </div>
  );
};

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { configured, session, authLoading, membership, membershipLoading } = useAuth();

  if (!configured) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FFD3DE] px-4 py-10">
        <div className="w-full max-w-sm">
          <PaperCard className="p-6 text-center">
            <p className="font-display text-lg text-[#4A0420] mb-2">Backend not configured</p>
            <p className="text-sm text-[#8A4058]">
              Set <code className="text-xs">VITE_SUPABASE_URL</code> and{' '}
              <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> in your environment (see{' '}
              <code className="text-xs">.env.example</code>) to enable accounts and shared data.
            </p>
          </PaperCard>
        </div>
      </div>
    );
  }

  if (authLoading || (session && membershipLoading)) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FFD3DE] px-4 py-10">
        <div className="text-center text-sm text-[#8A4058]">Loading your space…</div>
      </div>
    );
  }

  if (!session || !membership) {
    return <Landing />;
  }

  return <>{children}</>;
};
