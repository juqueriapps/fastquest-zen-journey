
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

interface FastingSession {
  isActive: boolean;
  timeElapsed: number;
  targetHours: number;
  startTime?: number;
}

const FastTimer: React.FC<FastTimerProps> = ({ userData, updateUserData }) => {
  const [fastingSession, setFastingSession] = useState<FastingSession>({
    isActive: false,
    timeElapsed: 0,
    targetHours: 16
  });

  // Carregar sessão salva ao montar o componente
  useEffect(() => {
    const savedSession = localStorage.getItem('fastingSession');
    if (savedSession) {
      const session: FastingSession = JSON.parse(savedSession);
      if (session.isActive && session.startTime) {
        // Calcular tempo decorrido baseado no tempo de início
        const now = Date.now();
        const elapsed = Math.floor((now - session.startTime) / 1000);
        setFastingSession({
          ...session,
          timeElapsed: elapsed
        });
      } else {
        setFastingSession(session);
      }
    }
  }, []);

  // Salvar sessão no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('fastingSession', JSON.stringify(fastingSession));
  }, [fastingSession]);

  // Timer que roda continuamente quando ativo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (fastingSession.isActive) {
      interval = setInterval(() => {
        setFastingSession(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [fastingSession.isActive]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const targetSeconds = fastingSession.targetHours * 3600;
    return Math.min((fastingSession.timeElapsed / targetSeconds) * 100, 100);
  };

  const getFastingPhase = () => {
    const hours = Math.floor(fastingSession.timeElapsed / 3600);
    if (hours < 4) return { phase: 'Digestão', color: 'bg-blue-500', description: 'Seu corpo está processando os alimentos' };
    if (hours < 8) return { phase: 'Início do Jejum', color: 'bg-green-500', description: 'Glicose sendo utilizada como energia' };
    if (hours < 12) return { phase: 'Queima de Gordura', color: 'bg-yellow-500', description: 'Corpo começando a usar gordura como combustível' };
    if (hours < 16) return { phase: 'Cetose Leve', color: 'bg-orange-500', description: 'Produção de cetonas aumentando' };
    if (hours < 24) return { phase: 'Cetose Profunda', color: 'bg-purple-500', description: 'Máxima queima de gordura e clareza mental' };
    if (hours < 48) return { phase: 'Autofagia', color: 'bg-indigo-500', description: 'Renovação celular intensificada' };
    return { phase: 'Jejum Estendido', color: 'bg-red-500', description: 'Benefícios metabólicos profundos' };
  };

  const startFast = () => {
    setFastingSession(prev => ({
      ...prev,
      isActive: true,
      startTime: Date.now() - (prev.timeElapsed * 1000)
    }));
    toast({
      title: "Jejum iniciado! 🚀",
      description: "Que sua jornada seja cheia de conquistas!",
    });
  };

  const pauseFast = () => {
    setFastingSession(prev => ({
      ...prev,
      isActive: false,
      startTime: undefined
    }));
    toast({
      title: "Jejum pausado ⏸️",
      description: "Retome quando estiver pronto!",
    });
  };

  const completeFast = () => {
    if (fastingSession.timeElapsed >= fastingSession.targetHours * 3600) {
      const pointsEarned = Math.floor(fastingSession.timeElapsed / 3600) * 10;
      
      updateUserData({
        fastPoints: userData.fastPoints + pointsEarned,
        currentStreak: userData.currentStreak + 1,
        totalFasts: userData.totalFasts + 1
      });
      
      toast({
        title: "Parabéns! 🎉",
        description: `Jejum completado! +${pointsEarned} FastPoints`,
      });
      
      setFastingSession({
        isActive: false,
        timeElapsed: 0,
        targetHours: fastingSession.targetHours,
        startTime: undefined
      });
    } else {
      toast({
        title: "Jejum interrompido 😢",
        description: "Não desista! Tente novamente quando estiver pronto.",
      });
      
      updateUserData({
        currentStreak: 0
      });
      
      setFastingSession({
        isActive: false,
        timeElapsed: 0,
        targetHours: fastingSession.targetHours,
        startTime: undefined
      });
    }
  };

  const updateTargetHours = (hours: number) => {
    if (!fastingSession.isActive) {
      setFastingSession(prev => ({
        ...prev,
        targetHours: hours
      }));
    }
  };

  const currentPhase = getFastingPhase();
  const progress = getProgress();

  const fastingOptions = [
    { hours: 12, label: '12h', description: 'Iniciante' },
    { hours: 16, label: '16h', description: 'Clássico' },
    { hours: 24, label: '24h', description: 'OMAD' },
    { hours: 32, label: '32h', description: 'Avançado' },
    { hours: 48, label: '48h', description: 'Extremo' }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Timer Principal */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <div className="text-center space-y-6">
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
                {formatTime(fastingSession.timeElapsed)}
              </div>
              <div className="text-sm text-gray-500">
                Meta: {fastingSession.targetHours}h
              </div>
            </div>
          </div>

          {/* Fase Atual */}
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium ${currentPhase.color}`}>
              <Clock className="w-4 h-4" />
              {currentPhase.phase}
            </div>
            <div className="px-4">
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                {currentPhase.description}
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex gap-3 justify-center pt-2">
            {!fastingSession.isActive ? (
              <Button onClick={startFast} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Play className="w-4 h-4 mr-2" />
                {fastingSession.timeElapsed > 0 ? 'Retomar' : 'Iniciar'} Jejum
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
        <Card className="p-4 text-center bg-white/70 backdrop-blur-sm border-0">
          <div className="text-xl font-bold text-blue-600">{userData.currentStreak}</div>
          <div className="text-xs text-gray-500 mt-1">Sequência</div>
        </Card>
        <Card className="p-4 text-center bg-white/70 backdrop-blur-sm border-0">
          <div className="text-xl font-bold text-green-600">{userData.totalFasts}</div>
          <div className="text-xs text-gray-500 mt-1">Jejuns</div>
        </Card>
        <Card className="p-4 text-center bg-white/70 backdrop-blur-sm border-0">
          <div className="text-xl font-bold text-purple-600">LV{userData.level}</div>
          <div className="text-xs text-gray-500 mt-1">Nível</div>
        </Card>
      </div>

      {/* Seletor de Tipo de Jejum */}
      <Card className="p-5 bg-white/70 backdrop-blur-sm border-0">
        <h3 className="font-semibold text-gray-800 mb-4">Tipo de Jejum</h3>
        <div className="grid grid-cols-2 gap-3">
          {fastingOptions.map(option => (
            <Button
              key={option.hours}
              onClick={() => updateTargetHours(option.hours)}
              variant={fastingSession.targetHours === option.hours ? "default" : "outline"}
              size="sm"
              disabled={fastingSession.isActive}
              className={`flex flex-col h-auto py-4 ${
                fastingSession.targetHours === option.hours 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                  : ""
              }`}
            >
              <span className="font-bold text-base">{option.label}</span>
              <span className="text-xs opacity-75 mt-1">{option.description}</span>
            </Button>
          ))}
        </div>
        {fastingSession.isActive && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-amber-700 text-center">
              ⚠️ Não é possível alterar a meta durante o jejum
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FastTimer;
