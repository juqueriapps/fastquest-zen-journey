
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Award, Star, Target } from 'lucide-react';

interface AchievementsProps {
  user: any;
}

const Achievements: React.FC<AchievementsProps> = ({ user }) => {
  const achievements = [
    {
      id: 1,
      title: "Primeiro Jejum",
      description: "Complete seu primeiro jejum de 12 horas",
      icon: "🌟",
      unlocked: true,
      category: "Iniciante",
      points: 50
    },
    {
      id: 2,
      title: "Guerreiro da Madrugada",
      description: "Complete um jejum durante a madrugada",
      icon: "🌙",
      unlocked: true,
      category: "Dedicação",
      points: 100
    },
    {
      id: 3,
      title: "Streak de Ferro",
      description: "Mantenha uma sequência de 7 dias",
      icon: "🔥",
      unlocked: true,
      category: "Consistência",
      points: 200
    },
    {
      id: 4,
      title: "Mestre do 16:8",
      description: "Complete 10 jejuns de 16 horas",
      icon: "⚡",
      unlocked: false,
      category: "Especialista",
      points: 300,
      progress: 7,
      total: 10
    },
    {
      id: 5,
      title: "Zen Master",
      description: "Complete 50 jejuns no total",
      icon: "🧘",
      unlocked: false,
      category: "Mestre",
      points: 500,
      progress: 48,
      total: 50
    },
    {
      id: 6,
      title: "Jejum Épico",
      description: "Complete um jejum de 24 horas",
      icon: "🏆",
      unlocked: false,
      category: "Épico",
      points: 750
    }
  ];

  const categories = ["Todos", "Iniciante", "Dedicação", "Consistência", "Especialista", "Mestre", "Épico"];
  const [selectedCategory, setSelectedCategory] = React.useState("Todos");

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
                
                {achievement.progress !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progresso</span>
                      <span className="text-purple-600">{achievement.progress}/{achievement.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-purple-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress! / achievement.total!) * 100}%` }}
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
            .filter(a => !a.unlocked && a.progress !== undefined)
            .slice(0, 2)
            .map(achievement => (
              <div key={achievement.id} className="flex items-center gap-3">
                <span className="text-lg">{achievement.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{achievement.title}</p>
                  <div className="w-full bg-white/50 rounded-full h-1 mt-1">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full"
                      style={{ width: `${(achievement.progress! / achievement.total!) * 100}%` }}
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
