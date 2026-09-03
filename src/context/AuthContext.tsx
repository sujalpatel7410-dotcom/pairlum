// Owns the Supabase auth session and, once signed in, which Couple Space
// (if any) the account belongs to. PairlumProvider consumes this to know
// what couple_id to scope all its data queries to, and what role ('A' | 'B')
// the signed-in account plays in that couple.
//
// Status machine: 'loading' -> 'signed_out' | ('signed_in' + no couple ->
// needsCouple=true) | ('signed_in' + couple -> needsCouple=false).

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserRole } from '../types';

export type AuthStatus = 'loading' | 'signed_out' | 'signed_in';

interface AuthContextType {
  status: AuthStatus;
  user: User | null;
  session: Session | null;
  coupleId: string | null;
  role: UserRole | null;
  needsCouple: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  createCoupleSpace: (yourName: string) => Promise<{ error: string | null }>;
  joinCoupleSpace: (inviteCode: string, yourName: string) => Promise<{ error: string | null }>;
  refreshMembership: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const loadMembership = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('couple_members')
      .select('couple_id, role')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      setCoupleId(data.couple_id);
      setRole(data.role as UserRole);
    } else {
      setCoupleId(null);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatus('signed_out');
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await loadMembership(session.user.id);
      }
      setStatus(session ? 'signed_in' : 'signed_out');
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await loadMembership(newSession.user.id);
        setStatus('signed_in');
      } else {
        setCoupleId(null);
        setRole(null);
        setStatus('signed_out');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [loadMembership]);

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Sign up did not return a user — check your inbox to confirm your email, then sign in.' };

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: data.user.id, name, email });
    if (profileError) return { error: profileError.message };

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const createCoupleSpace = async (yourName: string) => {
    const { error } = await supabase.rpc('create_couple', { p_name_a: yourName });
    if (error) return { error: error.message };
    if (session?.user) await loadMembership(session.user.id);
    return { error: null };
  };

  const joinCoupleSpace = async (inviteCode: string, yourName: string) => {
    const { error } = await supabase.rpc('join_couple', {
      p_invite_code: inviteCode.trim().toUpperCase(),
      p_name_b: yourName,
    });
    if (error) return { error: error.message };
    if (session?.user) await loadMembership(session.user.id);
    return { error: null };
  };

  const refreshMembership = async () => {
    if (session?.user) await loadMembership(session.user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        user: session?.user || null,
        session,
        coupleId,
        role,
        needsCouple: status === 'signed_in' && !coupleId,
        signUp,
        signIn,
        signOut,
        createCoupleSpace,
        joinCoupleSpace,
        refreshMembership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
