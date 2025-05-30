
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AuthProvidersList from './AuthProvidersList';
import EmailAuthForm from './EmailAuthForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'select' | 'email'>('select');

  const handleEmailStep = async () => {
    setAuthStep('email');
  };

  const handleSuccess = (user: any) => {
    onSuccess(user);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bem-vindo ao FastQuest
          </DialogTitle>
        </DialogHeader>

        {authStep === 'select' && (
          <AuthProvidersList
            isLoading={isLoading}
            onEmailStep={handleEmailStep}
            onSuccess={handleSuccess}
          />
        )}

        {authStep === 'email' && (
          <EmailAuthForm
            onBack={() => setAuthStep('select')}
            onSuccess={handleSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
