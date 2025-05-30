
import React from 'react';
import { Instagram, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AuthProviderButton from './AuthProviderButton';

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

  const handleInstagramAuth = async () => {
    try {
      // Simulação - Em produção, conecte ao Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUser = {
        id: 'ig_user_123',
        username: 'jejummaster',
        avatar: 'https://picsum.photos/100/100?random=1',
        provider: 'instagram'
      };
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${mockUser.username}!`,
      });
      
      onSuccess(mockUser);
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Não foi possível conectar com o Instagram. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEmailStep = async () => {
    onEmailStep();
  };

  const providers: AuthProvider[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      type: 'oauth',
      handler: handleInstagramAuth
    },
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
