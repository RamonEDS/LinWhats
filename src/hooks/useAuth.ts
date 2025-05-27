import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any, user: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const useProvideAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (profile) {
        return {
          id: userId,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar_url,
          isAdmin: false,
          plan: profile.plan || 'free',
          settings: profile.settings || {},
          createdAt: profile.created_at,
        };
      }

      return null;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const session = supabase.auth.getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    // Check initial session
    session.then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(profile);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide more specific error messages based on the error code
        if (error.message === 'Invalid login credentials') {
          return { error: { 
            message: 'Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.',
            code: 'invalid_credentials'
          }};
        }
        
        if (error.message.includes('Email not confirmed')) {
          return { error: {
            message: 'Por favor, confirme seu email antes de fazer login.',
            code: 'email_not_confirmed'
          }};
        }

        throw error;
      }

      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        setUser(profile);
      }

      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        error: {
          message: 'Ocorreu um erro ao fazer login. Por favor, tente novamente.',
          code: 'unknown_error'
        }
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (!data.user) {
        throw new Error('No user returned from signUp');
      }

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: data.user.id,
        email,
        name,
        avatar_url: null,
        plan: 'free',
        settings: {},
      });

      if (profileError) throw profileError;

      const profile = await fetchProfile(data.user.id);
      setUser(profile);

      return { error: null, user: data.user };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        error,
        user: null 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          avatar_url: data.avatar,
          plan: data.plan,
          settings: data.settings,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
};