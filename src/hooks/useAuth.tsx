
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
    }

    return { error };
  };

  const signUp = async (email: string, password: string, username?: string) => {
    // Use window.location.origin para garantir que funcione em qualquer ambiente
    const redirectUrl = window.location.origin;
    
    console.log('Signing up with redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: username ? { username } : undefined
      }
    });

    if (error) {
      console.error('Signup error:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      });
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    }
  };

  const resetPassword = async (email: string) => {
    // Use window.location.origin para garantir que funcione em qualquer ambiente
    const redirectUrl = window.location.origin;
    
    console.log('Resetting password with redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Erro ao redefinir senha",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    }

    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
