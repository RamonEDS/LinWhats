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
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const useProvideAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          const profile = await fetchProfile(session.user.id);
          
          if (profile && mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name || session.user.email!.split('@')[0],
              avatar: profile.avatar_url,
              isAdmin: false,
              plan: profile.plan || 'free',
              settings: profile.settings || {},
              createdAt: session.user.created_at,
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && mounted) {
        const profile = await fetchProfile(session.user.id);
        
        if (profile && mounted) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile.name || session.user.email!.split('@')[0],
            avatar: profile.avatar_url,
            isAdmin: false,
            plan: profile.plan || 'free',
            settings: profile.settings || {},
            createdAt: session.user.created_at,
          });
        }
      } else if (mounted) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
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

      if (error) throw error;

      const profile = await fetchProfile(data.user.id);
      
      if (profile) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: profile.name || data.user.email!.split('@')[0],
          avatar: profile.avatar_url,
          isAdmin: false,
          plan: profile.plan || 'free',
          settings: profile.settings || {},
          createdAt: data.user.created_at,
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { error: new Error(error.message || 'Email ou senha incorretos') };
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
        options: {
          data: { name }
        }
      });

      if (signUpError) throw signUpError;

      if (!data.user) {
        throw new Error('Erro ao criar usuário');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: data.user.id,
          email,
          name,
          avatar_url: null,
          plan: 'free',
          settings: {},
        });

      if (profileError) throw profileError;

      setUser({
        id: data.user.id,
        email: data.user.email!,
        name,
        avatar: null,
        isAdmin: false,
        plan: 'free',
        settings: {},
        createdAt: data.user.created_at,
      });

      return { error: null, user: data.user };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.message.includes('already registered')) {
        return { 
          error: new Error('Este email já está cadastrado. Faça login ou use outro email.'), 
          user: null 
        };
      }
      
      return { 
        error: new Error('Erro ao criar conta. Por favor, tente novamente.'), 
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