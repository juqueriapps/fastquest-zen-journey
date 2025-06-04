
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface UserData {
  name: string;
  level: number;
  fastPoints: number;
  currentStreak: number;
  totalFasts: number;
}

interface FastTimerProps {
  userData: UserData;
  updateUserData: (newData: Partial<UserData>) => void;
}

const FastTimer: React.FC<FastTimerProps> = ({ userData, updateUserData }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // em segundos
  const [targetHours, setTargetHours] = useState(16);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const targetSeconds = targetHours * 3600;
    return Math.min((timeElapsed / targetSeconds) * 100, 100);
  };

  const getFastingPhase = () => {
    const hours = Math.floor(timeElapsed / 3600);
    if (hours < 4) return { phase: 'Digestão', color: 'bg-blue-500', description: 'Seu corpo está processando os alimentos' };
    if (hours < 8) return { phase: 'Início do Jejum', color: 'bg-green-500', description: 'Glicose sendo utilizada como energia' };
    if (hours < 12) return { phase: 'Queima de Gordura', color: 'bg-yellow-500', description: 'Corpo começando a usar gordura como combustível' };
    if (hours < 16) return { phase: 'Cetose Leve', color: 'bg-orange-500', description: 'Produção de cetonas aumentando' };
    return { phase: 'Cetose Profunda', color: 'bg-purple-500', description: 'Máxima queima de gordura e clareza mental' };
  };

  const startFast = () => {
    setIsActive(true);
    toast({
      title: "Jejum iniciado! 🚀",
      description: "Que sua jornada seja cheia de conquistas!",
    });
  };

  const pauseFast = () => {
    setIsActive(false);
    toast({
      title: "Jejum pausado ⏸️",
      description: "Retome quando estiver pronto!",
    });
  };

  const completeFast = () => {
    if (timeElapsed >= targetHours * 3600) {
      const pointsEarned = Math.floor(timeElapsed / 3600) * 10;
      
      updateUserData({
        fastPoints: userData.fastPoints + pointsEarned,
        currentStreak: userData.currentStreak + 1,
        totalFasts: userData.totalFasts + 1
      });
      
      toast({
        title: "Parabéns! 🎉",
        description: `Jejum completado! +${pointsEarned} FastPoints`,
      });
      
      setIsActive(false);
      setTimeElapsed(0);
    } else {
      toast({
        title: "Jejum interrompido 😢",
        description: "Não desista! Tente novamente quando estiver pronto.",
      });
      
      // Quebra a sequência se o jejum foi interrompido antes do tempo
      updateUserData({
        currentStreak: 0
      });
      
      setIsActive(false);
      setTimeElapsed(0);
    }
  };

  const currentPhase = getFastingPhase();
  const progress = getProgress();

  return (
    <div className="space-y-6">
      {/* Timer Principal */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <div className="text-center space-y-4">
          {/* Círculo de Progresso */}
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgb(229 231 235)"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${progress * 2.827} 282.7`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-800">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-gray-500">
                Meta: {targetHours}h
              </div>
            </div>
          </div>

          {/* Fase Atual */}
          <div className="space-y-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm ${currentPhase.color}`}>
              <Clock className="w-4 h-4" />
              {currentPhase.phase}
            </div>
            <p className="text-xs text-gray-600 max-w-sm mx-auto">
              {currentPhase.description}
            </p>
          </div>

          {/* Controles */}
          <div className="flex gap-3 justify-center">
            {!isActive ? (
              <Button onClick={startFast} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Play className="w-4 h-4 mr-2" />
                Iniciar Jejum
              </Button>
            ) : (
              <>
                <Button onClick={pauseFast} variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-50">
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </Button>
                <Button onClick={completeFast} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                  <Square className="w-4 h-4 mr-2" />
                  Finalizar
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center bg-white/70 backdrop-blur-sm border-0">
          <div className="text-lg font-bold text-blue-600">{userData.currentStreak}</div>
          <div className="text-xs text-gray-500">Sequência</div>
        </Card>
        <Card className="p-3 text-center bg-white/70 backdrop-blur-sm border-0">
          <div className="text-lg font-bold text-green-600">{userData.totalFasts}</div>
          <div className="text-xs text-gray-500">Jejuns</div>
        </Card>
        <Card className="p-3 text-center bg-white/70 backdrop-blur-sm border-0">
          <div className="text-lg font-bold text-purple-600">LV{userData.level}</div>
          <div className="text-xs text-gray-500">Nível</div>
        </Card>
      </div>

      {/* Seletor de Meta */}
      <Card className="p-4 bg-white/70 backdrop-blur-sm border-0">
        <h3 className="font-semibold text-gray-800 mb-3">Meta de Jejum</h3>
        <div className="flex gap-2">
          {[12, 14, 16, 18, 20, 24].map(hours => (
            <Button
              key={hours}
              onClick={() => setTargetHours(hours)}
              variant={targetHours === hours ? "default" : "outline"}
              size="sm"
              className={targetHours === hours ? "bg-gradient-to-r from-blue-500 to-purple-500" : ""}
            >
              {hours}h
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FastTimer;
