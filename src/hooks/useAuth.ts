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
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 5; // Increased from 3 to 5
  const INITIAL_RETRY_DELAY = 1000; // Start with 1 second
  const MAX_RETRY_DELAY = 10000; // Max delay of 10 seconds
  const TIMEOUT_DURATION = 60000; // Increased to 60 seconds

  // Calculate exponential backoff with jitter
  const getRetryDelay = (retryCount: number) => {
    const baseDelay = Math.min(
      MAX_RETRY_DELAY,
      INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
    );
    // Add random jitter of ±30%
    const jitter = baseDelay * 0.3 * (Math.random() * 2 - 1);
    return baseDelay + jitter;
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error.message);
        throw error;
      }
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let timeoutId: number;
    let mounted = true;

    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session fetch error:', error.message);
          throw error;
        }

        if (!mounted) return;

        if (session?.user) {
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
            setLoading(false);
            setRetryCount(0); // Reset retry count on success
          } else if (mounted && retryCount < MAX_RETRIES) {
            const delay = getRetryDelay(retryCount);
            console.log(`Retrying profile fetch in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
            setRetryCount(prev => prev + 1);
            setTimeout(getSession, delay);
          } else if (mounted) {
            console.error('Failed to fetch profile after maximum retries');
            setLoading(false);
            setUser(null);
          }
        } else {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Session error:', error);
        if (mounted && retryCount < MAX_RETRIES) {
          const delay = getRetryDelay(retryCount);
          console.log(`Retrying session fetch in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
          setRetryCount(prev => prev + 1);
          setTimeout(getSession, delay);
        } else if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Set a timeout to show error if loading takes too long
    timeoutId = window.setTimeout(() => {
      if (mounted && loading) {
        console.error('Session loading timeout after', TIMEOUT_DURATION, 'ms');
        setLoading(false);
        setUser(null);
      }
    }, TIMEOUT_DURATION);

    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
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
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [retryCount]);

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

      // Create auth user
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

      // Create profile
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