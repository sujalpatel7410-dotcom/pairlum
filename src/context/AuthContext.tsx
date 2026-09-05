import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserRole } from '../types';

export interface CoupleMembership {
  coupleId: string;
  role: UserRole;
}

interface AuthContextType {
  configured: boolean;
  session: Session | null;
  authLoading: boolean;
  membership: CoupleMembership | null;
  membershipLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  createCouple: (name: string) => Promise<void>;
  joinCouple: (inviteCode: string, name: string) => Promise<void>;
  refreshMembership: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const configured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [membership, setMembership] = useState<CoupleMembership | null>(null);
  const [membershipLoading, setMembershipLoading] = useState(true);

  const loadMembership = useCallback(async (userId: string) => {
    setMembershipLoading(true);
    const { data, error } = await supabase
      .from('couple_members')
      .select('couple_id, role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Failed to load couple membership', error);
      setMembership(null);
    } else if (data) {
      setMembership({ coupleId: data.couple_id, role: data.role as UserRole });
    } else {
      setMembership(null);
    }
    setMembershipLoading(false);
  }, []);

  const refreshMembership = useCallback(async () => {
    if (session?.user) {
      await loadMembership(session.user.id);
    }
  }, [session, loadMembership]);

  useEffect(() => {
    if (!configured) {
      setAuthLoading(false);
      setMembershipLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
      if (data.session?.user) {
        loadMembership(data.session.user.id);
      } else {
        setMembershipLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        loadMembership(newSession.user.id);
      } else {
        setMembership(null);
        setMembershipLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [configured, loadMembership]);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMembership(null);
  };

  const createCouple = async (name: string) => {
    if (!session?.user) throw new Error('Not signed in.');
    const { error } = await supabase.rpc('create_couple', {
      p_name_a: name,
      p_email_a: session.user.email ?? '',
    });
    if (error) throw error;
    await loadMembership(session.user.id);
  };

  const joinCouple = async (inviteCode: string, name: string) => {
    if (!session?.user) throw new Error('Not signed in.');
    const { error } = await supabase.rpc('join_couple', {
      p_invite_code: inviteCode.trim(),
      p_name_b: name,
      p_email_b: session.user.email ?? '',
    });
    if (error) throw error;
    await loadMembership(session.user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        configured,
        session,
        authLoading,
        membership,
        membershipLoading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        createCouple,
        joinCouple,
        refreshMembership,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
