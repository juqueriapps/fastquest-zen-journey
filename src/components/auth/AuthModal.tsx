import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'login' | 'signup' | 'forgot-password';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [authStep, setAuthStep] = useState<AuthStep>('login');

  const handleClose = () => {
    onClose();
    // Reset to login step when modal closes
    setTimeout(() => setAuthStep('login'), 200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FastQuest
          </DialogTitle>
        </DialogHeader>

        {authStep === 'login' && (
          <LoginForm
            onSwitchToSignup={() => setAuthStep('signup')}
            onForgotPassword={() => setAuthStep('forgot-password')}
          />
        )}

        {authStep === 'signup' && (
          <SignupForm
            onSwitchToLogin={() => setAuthStep('login')}
          />
        )}

        {authStep === 'forgot-password' && (
          <ForgotPasswordForm
            onBack={() => setAuthStep('login')}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
