import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, name: string) => Promise<{ error: any, user: any }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ error: null }),
  register: async () => ({ error: null, user: null }),
  logout: async () => {},
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

      return profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          
          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name || session.user.email!.split('@')[0],
              avatar: profile.avatar_url || null,
              isAdmin: false,
              plan: profile.plan || 'free',
              settings: profile.settings || {},
              createdAt: session.user.created_at,
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Session error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        
        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile.name || session.user.email!.split('@')[0],
            avatar: profile.avatar_url || null,
            isAdmin: false,
            plan: profile.plan || 'free',
            settings: profile.settings || {},
            createdAt: session.user.created_at,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          return { error: new Error('Email ou senha incorretos') };
        }
        throw error;
      }

      const profile = await fetchProfile(data.user.id);
      
      if (profile) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: profile.name || data.user.email!.split('@')[0],
          avatar: profile.avatar_url || null,
          isAdmin: false,
          plan: profile.plan || 'free',
          settings: profile.settings || {},
          createdAt: data.user.created_at,
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error: new Error('Erro ao fazer login. Tente novamente.') };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return { 
          error: new Error('Este email já está cadastrado. Faça login ou use outro email.'), 
          user: null 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { 
            error: new Error('Este email já está cadastrado. Faça login ou use outro email.'), 
            user: null 
          };
        }
        throw error;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            name,
            email,
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
      }

      return { error: null, user: data.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        error: new Error('Erro ao criar conta. Por favor, tente novamente.'), 
        user: null 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
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
        .upsert({
          user_id: user.id,
          name: data.name,
          avatar_url: data.avatar,
          plan: data.plan,
          settings: data.settings,
          updated_at: new Date().toISOString(),
        });

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
    login,
    register,
    logout,
    updateProfile,
  };
};