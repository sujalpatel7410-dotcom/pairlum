import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaperCard } from '../common/PaperCard';
import { Landing } from './Landing';

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
