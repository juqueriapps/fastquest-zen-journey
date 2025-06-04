
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AuthProviderButtonProps {
  provider: {
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    type: 'oauth' | 'email';
  };
  isLoading: boolean;
  onClick: () => Promise<void>;
}

const AuthProviderButton: React.FC<AuthProviderButtonProps> = ({ 
  provider, 
  isLoading, 
  onClick 
}) => {
  return (
    <Button
      onClick={onClick}
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
  );
};

export default AuthProviderButton;
