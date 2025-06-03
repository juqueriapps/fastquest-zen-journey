import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Target, Flame, Calendar } from 'lucide-react';

interface UserProfileProps {
  user: {
    name: string;
    level: number;
    fastPoints: number;
    currentStreak: number;
    totalFasts: number;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const nextLevelPoints = (user.level + 1) * 200;
  const progressToNextLevel = ((user.fastPoints % 200) / 200) * 100;

  return (
    <div className="space-y-6">
      {/* Perfil Principal */}
      <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white text-3xl">👤</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">Jejuador Nível {user.level}</p>
          </div>
          
          {/* Progresso para próximo nível */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progresso</span>
              <span className="text-purple-600 font-medium">{Math.round(progressToNextLevel)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {nextLevelPoints - (user.fastPoints % 200)} FP para o próximo nível
            </p>
          </div>
        </div>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">{user.currentStreak}</div>
          <div className="text-xs text-gray-500">Dias consecutivos</div>
        </Card>

        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">{user.totalFasts}</div>
          <div className="text-xs text-gray-500">Jejuns completados</div>
        </Card>

        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">{user.fastPoints}</div>
          <div className="text-xs text-gray-500">FastPoints totais</div>
        </Card>

        <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
          <div className="text-xs text-gray-500">Dias no app</div>
        </Card>
      </div>

      {/* Título atual */}
      <Card className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100 border-0">
        <div className="text-center">
          <div className="text-2xl mb-2">🏆</div>
          <h3 className="font-semibold text-gray-800">Jejuador Dedicado</h3>
          <p className="text-sm text-gray-600">Completou 10+ jejuns consecutivos</p>
        </div>
      </Card>

      {/* Próximas metas */}
      <Card className="p-4 bg-white/70 backdrop-blur-sm border-0">
        <h3 className="font-semibold text-gray-800 mb-3">Próximas Conquistas</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-500 text-sm">🔥</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Streak de 30 dias</p>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div className="bg-blue-500 h-1 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>
            <span className="text-xs text-gray-500">12/30</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-500 text-sm">⭐</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">100 Jejuns Totais</p>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div className="bg-purple-500 h-1 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
            <span className="text-xs text-gray-500">48/100</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
