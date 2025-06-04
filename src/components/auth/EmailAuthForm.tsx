
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailAuthFormProps {
  onBack: () => void;
  onSuccess: (user: any) => void;
}

const EmailAuthForm: React.FC<EmailAuthFormProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  return (
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
          onClick={onBack}
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
  );
};

export default EmailAuthForm;
