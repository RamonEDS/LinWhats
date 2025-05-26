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
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setUser(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.email!.split('@')[0],
          avatar: profile?.avatar_url || null,
          isAdmin: profile?.is_admin || false,
          plan: profile?.plan || 'free',
          settings: profile?.settings || {},
          createdAt: session.user.created_at,
        });
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.email!.split('@')[0],
          avatar: profile?.avatar_url || null,
          isAdmin: profile?.is_admin || false,
          plan: profile?.plan || 'free',
          settings: profile?.settings || {},
          createdAt: session.user.created_at,
        });
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const profile = await fetchProfile(data.user.id);
      setUser({
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.email!.split('@')[0],
        avatar: profile?.avatar_url || null,
        isAdmin: profile?.is_admin || false,
        plan: profile?.plan || 'free',
        settings: profile?.settings || {},
        createdAt: data.user.created_at,
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            name,
            plan: 'free',
            settings: {},
            is_admin: false,
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
      return { error, user: null };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        name: data.name,
        avatar_url: data.avatar,
        plan: data.plan,
        settings: data.settings,
        is_admin: data.isAdmin,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    setUser(prev => prev ? { ...prev, ...data } : null);
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