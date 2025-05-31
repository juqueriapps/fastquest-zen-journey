import React, { useState, useEffect } from 'react';
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

// Interface para os dados do usuário
interface UserData {
  name: string;
  level: number;
  fastPoints: number;
  currentStreak: number;
  totalFasts: number;
}

const Index = () => {
  const [currentView, setCurrentView] = useState('timer');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { user, loading } = useAuth();

  // Estado para os dados do usuário
  const [userData, setUserData] = useState<UserData>({
    name: 'Usuário',
    level: 1,
    fastPoints: 0,
    currentStreak: 0,
    totalFasts: 0
  });

  // Carregar dados do usuário do localStorage quando o componente monta
  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem(`userData_${user.id}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setUserData(parsedData);
      } else {
        // Dados iniciais para novo usuário
        const initialData = {
          name: user.user_metadata?.username || user.email?.split('@')[0] || 'Usuário',
          level: 1,
          fastPoints: 0,
          currentStreak: 0,
          totalFasts: 0
        };
        setUserData(initialData);
        localStorage.setItem(`userData_${user.id}`, JSON.stringify(initialData));
      }
    }
  }, [user]);

  // Função para atualizar dados do usuário
  const updateUserData = (newData: Partial<UserData>) => {
    const updatedData = { ...userData, ...newData };
    // Sistema de níveis progressivo - cada nível requer mais pontos
    let newLevel = 1;
    let pointsNeeded = 200; // Primeiro nível
    let totalPointsForLevel = 0;
    
    while (totalPointsForLevel + pointsNeeded <= updatedData.fastPoints) {
      totalPointsForLevel += pointsNeeded;
      newLevel++;
      pointsNeeded = Math.floor(pointsNeeded * 1.5); // Aumenta 50% a cada nível
    }
    
    updatedData.level = newLevel;
    
    setUserData(updatedData);
    if (user) {
      localStorage.setItem(`userData_${user.id}`, JSON.stringify(updatedData));
    }
  };

  // Dados para compartilhamento
  const fastingData = {
    duration: '16h',
    streak: userData.currentStreak,
    level: userData.level,
    achievement: userData.level >= 5 ? 'Guerreiro da Madrugada' : 'Jejuador Iniciante'
  };

  const handleOpenShare = () => {
    setIsShareModalOpen(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'timer':
        return <FastTimer userData={userData} updateUserData={updateUserData} />;
      case 'profile':
        return user ? <UserProfile user={userData} /> : null;
      case 'achievements':
        return user ? <Achievements userData={userData} updateUserData={updateUserData} /> : null;
      case 'progress':
        return user ? <SocialLeaderboard /> : null;
      default:
        return <FastTimer userData={userData} updateUserData={updateUserData} />;
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
          <UserAvatar onOpenShare={handleOpenShare} userData={userData} />
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
