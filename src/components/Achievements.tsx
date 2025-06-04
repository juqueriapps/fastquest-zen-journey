
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Award, Star, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: string;
  points: number;
  progress?: number;
  total?: number;
  requirement?: {
    type: 'fasts' | 'streak' | 'points' | 'duration';
    value: number;
  };
}

interface AchievementsProps {
  userData: {
    name: string;
    level: number;
    fastPoints: number;
    currentStreak: number;
    totalFasts: number;
  };
  updateUserData: (newData: any) => void;
}

const Achievements: React.FC<AchievementsProps> = ({ userData, updateUserData }) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const baseAchievements: Achievement[] = [
    {
      id: 1,
      title: "Primeiro Jejum",
      description: "Complete seu primeiro jejum de 12 horas",
      icon: "🌟",
      unlocked: false,
      category: "Iniciante",
      points: 50,
      requirement: { type: 'fasts', value: 1 }
    },
    {
      id: 2,
      title: "Guerreiro da Madrugada",
      description: "Complete 3 jejuns no total",
      icon: "🌙",
      unlocked: false,
      category: "Dedicação",
      points: 100,
      requirement: { type: 'fasts', value: 3 }
    },
    {
      id: 3,
      title: "Streak de Ferro",
      description: "Mantenha uma sequência de 7 dias",
      icon: "🔥",
      unlocked: false,
      category: "Consistência",
      points: 200,
      requirement: { type: 'streak', value: 7 }
    },
    {
      id: 4,
      title: "Mestre do 16:8",
      description: "Complete 10 jejuns no total",
      icon: "⚡",
      unlocked: false,
      category: "Especialista",
      points: 300,
      requirement: { type: 'fasts', value: 10 }
    },
    {
      id: 5,
      title: "Colecionador de Pontos",
      description: "Acumule 1000 FastPoints",
      icon: "💎",
      unlocked: false,
      category: "Especialista",
      points: 400,
      requirement: { type: 'points', value: 1000 }
    },
    {
      id: 6,
      title: "Zen Master",
      description: "Complete 25 jejuns no total",
      icon: "🧘",
      unlocked: false,
      category: "Mestre",
      points: 500,
      requirement: { type: 'fasts', value: 25 }
    },
    {
      id: 7,
      title: "Streak Lendário",
      description: "Mantenha uma sequência de 30 dias",
      icon: "🏆",
      unlocked: false,
      category: "Épico",
      points: 750,
      requirement: { type: 'streak', value: 30 }
    },
    {
      id: 8,
      title: "Mestre dos Pontos",
      description: "Acumule 5000 FastPoints",
      icon: "👑",
      unlocked: false,
      category: "Épico",
      points: 1000,
      requirement: { type: 'points', value: 5000 }
    }
  ];

  // Carregar conquistas do localStorage
  useEffect(() => {
    if (user) {
      const savedAchievements = localStorage.getItem(`achievements_${user.id}`);
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      } else {
        setAchievements(baseAchievements);
        localStorage.setItem(`achievements_${user.id}`, JSON.stringify(baseAchievements));
      }
    }
  }, [user]);

  // Verificar e desbloquear conquistas
  useEffect(() => {
    if (achievements.length > 0) {
      let hasNewAchievements = false;
      let newPointsToAdd = 0;
      
      const updatedAchievements = achievements.map(achievement => {
        if (!achievement.unlocked && achievement.requirement) {
          let shouldUnlock = false;
          let currentProgress = 0;

          switch (achievement.requirement.type) {
            case 'fasts':
              currentProgress = userData.totalFasts;
              shouldUnlock = userData.totalFasts >= achievement.requirement.value;
              break;
            case 'streak':
              currentProgress = userData.currentStreak;
              shouldUnlock = userData.currentStreak >= achievement.requirement.value;
              break;
            case 'points':
              currentProgress = userData.fastPoints;
              shouldUnlock = userData.fastPoints >= achievement.requirement.value;
              break;
          }

          if (shouldUnlock) {
            hasNewAchievements = true;
            newPointsToAdd += achievement.points;
            return { 
              ...achievement, 
              unlocked: true,
              progress: achievement.requirement.value,
              total: achievement.requirement.value
            };
          } else {
            return { 
              ...achievement, 
              progress: currentProgress,
              total: achievement.requirement.value
            };
          }
        }
        return achievement;
      });

      if (hasNewAchievements) {
        setAchievements(updatedAchievements);
        localStorage.setItem(`achievements_${user.id}`, JSON.stringify(updatedAchievements));
        
        // Adicionar pontos das conquistas desbloqueadas
        updateUserData({ fastPoints: userData.fastPoints + newPointsToAdd });
      } else if (JSON.stringify(updatedAchievements) !== JSON.stringify(achievements)) {
        setAchievements(updatedAchievements);
      }
    }
  }, [userData, achievements, user, updateUserData]);

  const categories = ["Todos", "Iniciante", "Dedicação", "Consistência", "Especialista", "Mestre", "Épico"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredAchievements = selectedCategory === "Todos" 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <Card className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-0">
        <div className="text-center space-y-2">
          <Trophy className="w-12 h-12 text-yellow-600 mx-auto" />
          <h2 className="text-xl font-bold text-gray-800">Suas Conquistas</h2>
          <p className="text-gray-600">
            {unlockedCount} de {achievements.length} conquistas desbloqueadas
          </p>
          <div className="w-full bg-yellow-200 rounded-full h-2 mt-3">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* Filtros de categoria */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-white/70 text-gray-600 hover:bg-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Lista de conquistas */}
      <div className="space-y-3">
        {filteredAchievements.map(achievement => (
          <Card 
            key={achievement.id} 
            className={`p-4 border-0 transition-all ${
              achievement.unlocked 
                ? 'bg-white/70 backdrop-blur-sm shadow-lg' 
                : 'bg-gray-100/70 backdrop-blur-sm'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                  : 'bg-gray-300'
              }`}>
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold ${
                    achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    achievement.unlocked 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {achievement.category}
                  </span>
                </div>
                
                <p className={`text-sm ${
                  achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                
                {achievement.progress !== undefined && achievement.total !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progresso</span>
                      <span className="text-purple-600">{achievement.progress}/{achievement.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-purple-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((achievement.progress / achievement.total) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                }`}>
                  +{achievement.points}
                </div>
                <div className="text-xs text-gray-500">FP</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Próximas conquistas destacadas */}
      <Card className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 border-0">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Quase lá!
        </h3>
        <div className="space-y-2">
          {achievements
            .filter(a => !a.unlocked && a.progress !== undefined && a.total !== undefined)
            .sort((a, b) => ((b.progress! / b.total!) - (a.progress! / a.total!)))
            .slice(0, 2)
            .map(achievement => (
              <div key={achievement.id} className="flex items-center gap-3">
                <span className="text-lg">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{achievement.title}</p>
                  <div className="w-full bg-white/50 rounded-full h-1 mt-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full"
                      style={{ width: `${Math.min((achievement.progress! / achievement.total!) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs text-gray-600">
                  {achievement.progress}/{achievement.total}
                </span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default Achievements;
