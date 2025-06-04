import React from 'react';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import AuthProviderButton from './AuthProviderButton';
import GoogleAuthButton from './GoogleAuthButton';

interface AuthProvider {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  type: 'oauth' | 'email';
  handler: () => Promise<void>;
}

interface AuthProvidersListProps {
  isLoading: boolean;
  onEmailStep: () => void;
  onSuccess: (user: any) => void;
}

const AuthProvidersList: React.FC<AuthProvidersListProps> = ({ 
  isLoading, 
  onEmailStep, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();

  const handleGoogleAuth = async () => {
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao FastQuest!",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Não foi possível conectar com o Google. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEmailStep = async () => {
    onEmailStep();
  };

  const providers: AuthProvider[] = [
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      type: 'email',
      handler: handleEmailStep
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <GoogleAuthButton
          isLoading={isLoading}
          onClick={handleGoogleAuth}
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">ou</span>
          </div>
        </div>

        {providers.map((provider) => (
          <AuthProviderButton
            key={provider.id}
            provider={provider}
            isLoading={isLoading}
            onClick={provider.handler}
          />
        ))}
      </div>

      <div className="text-xs text-center text-gray-500 leading-relaxed">
        Ao continuar, você concorda com nossos{' '}
        <span className="text-blue-600 hover:underline cursor-pointer">
          Termos de Serviço
        </span>{' '}
        e{' '}
        <span className="text-blue-600 hover:underline cursor-pointer">
          Política de Privacidade
        </span>
      </div>
    </div>
  );
};

export default AuthProvidersList;
