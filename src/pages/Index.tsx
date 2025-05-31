
import React, { useState } from 'react';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FastTimer from '@/components/FastTimer';
import ZenMascot from '@/components/ZenMascot';
import UserProfile from '@/components/UserProfile';
import Achievements from '@/components/Achievements';
import Navigation from '@/components/Navigation';
import AuthModal from '@/components/auth/AuthModal';
import UserAvatar from '@/components/auth/UserAvatar';
import ShareModal from '@/components/sharing/ShareModal';
import SocialLeaderboard from '@/components/sharing/SocialLeaderboard';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [currentView, setCurrentView] = useState('timer');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { user, loading } = useAuth();

  // Simulação de dados do usuário para compartilhamento
  const [fastingData, setFastingData] = useState({
    duration: '16h',
    streak: 12,
    level: 5,
    achievement: 'Guerreiro da Madrugada'
  });

  // Criar objeto de usuário para o UserProfile com dados simulados
  const userProfileData = user ? {
    name: user.user_metadata?.username || user.email?.split('@')[0] || 'Usuário',
    level: 5,
    fastPoints: 1250,
    currentStreak: 12,
    totalFasts: 48
  } : null;

  const handleOpenShare = () => {
    setIsShareModalOpen(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'timer':
        return <FastTimer user={user} setUser={() => {}} />;
      case 'profile':
        return user && userProfileData ? <UserProfile user={userProfileData} /> : null;
      case 'achievements':
        return user ? <Achievements user={user} /> : null;
      case 'progress':
        return user ? <SocialLeaderboard /> : null;
      default:
        return <FastTimer user={user} setUser={() => {}} />;
    }
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Timer className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário logado, mostrar tela de login
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Timer className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              FastQuest
            </h1>
            <p className="text-gray-600 text-lg">
              Sua jornada de jejum intermitente gamificada
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-semibold">Timer Inteligente</p>
                <p className="text-sm text-gray-600">Acompanhe seu jejum com fases metabólicas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-semibold">Sistema de Conquistas</p>
                <p className="text-sm text-gray-600">Ganhe pontos, badges e suba de nível</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/80 rounded-lg">
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-semibold">Comunidade Social</p>
                <p className="text-sm text-gray-600">Compartilhe conquistas e inspire outros</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg font-semibold"
          >
            Começar Jornada
          </Button>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Timer className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FastQuest
            </h1>
          </div>
          <UserAvatar onOpenShare={handleOpenShare} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        <ZenMascot />
        {renderView()}
      </main>

      {/* Navigation */}
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        fastingData={fastingData}
      />
    </div>
  );
};

export default Index;
