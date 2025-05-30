
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Instagram, Mail, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

interface AuthProvider {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  type: 'oauth' | 'email';
  handler: () => Promise<void>;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'select' | 'email'>('select');
  const { toast } = useToast();

  const handleInstagramAuth = async () => {
    setIsLoading(true);
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
      onClose();
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Não foi possível conectar com o Instagram. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulação - Em produção, conecte ao Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Link mágico enviado!",
        description: "Verifique seu email para fazer login.",
      });
      
      // Simular recebimento do link
      setTimeout(() => {
        const mockUser = {
          id: 'email_user_456',
          email: email,
          username: email.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${email}&background=6366f1&color=fff`,
          provider: 'email'
        };
        
        onSuccess(mockUser);
        onClose();
      }, 3000);
      
    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o email. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailStep = async () => {
    setAuthStep('email');
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bem-vindo ao FastQuest
          </DialogTitle>
        </DialogHeader>

        {authStep === 'select' && (
          <div className="space-y-4">
            <div className="grid gap-3">
              {providers.map((provider) => (
                <Button
                  key={provider.id}
                  onClick={provider.handler}
                  disabled={isLoading}
                  className={`h-12 flex items-center gap-3 ${
                    provider.id === 'instagram' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <provider.icon className="w-5 h-5" />
                  )}
                  Continuar com {provider.name}
                </Button>
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
        )}

        {authStep === 'email' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setAuthStep('select')}
                disabled={isLoading}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleEmailAuth}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Enviar Link
              </Button>
            </div>

            <div className="text-xs text-center text-gray-500">
              Enviaremos um link mágico para seu email
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
