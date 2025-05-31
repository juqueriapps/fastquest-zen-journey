
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Share2, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url?: string;
  level: number;
  fastPoints: number;
  totalFasts: number;
  currentStreak: number;
  shareCount: number;
  isCurrentUser?: boolean;
}

const SocialLeaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [viewMode, setViewMode] = useState<'points' | 'shares'>('points');

  useEffect(() => {
    // Função para obter dados de usuários do localStorage
    const getAllUsersData = () => {
      const users: LeaderboardEntry[] = [];
      
      // Percorrer todos os itens do localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('userData_')) {
          try {
            const userData = JSON.parse(localStorage.getItem(key)!);
            const userId = key.replace('userData_', '');
            
            // Obter dados de compartilhamento (simulado por enquanto)
            const shareCount = Math.floor(Math.random() * 50) + 1;
            
            users.push({
              user_id: userId,
              username: userData.name || 'Usuário',
              level: userData.level || 1,
              fastPoints: userData.fastPoints || 0,
              totalFasts: userData.totalFasts || 0,
              currentStreak: userData.currentStreak || 0,
              shareCount: shareCount,
              isCurrentUser: userId === user?.id
            });
          } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
          }
        }
      }

      // Se não houver usuários suficientes, adicionar alguns exemplos
      if (users.length < 5) {
        const mockUsers = [
          {
            user_id: 'mock_1',
            username: 'jejummaster',
            level: 25,
            fastPoints: 5200,
            totalFasts: 45,
            currentStreak: 18,
            shareCount: 47
          },
          {
            user_id: 'mock_2',
            username: 'healthwarrior',
            level: 18,
            fastPoints: 3600,
            totalFasts: 32,
            currentStreak: 12,
            shareCount: 35
          },
          {
            user_id: 'mock_3',
            username: 'fastingpro',
            level: 22,
            fastPoints: 4400,
            totalFasts: 38,
            currentStreak: 15,
            shareCount: 28
          },
          {
            user_id: 'mock_4',
            username: 'zenmaster',
            level: 15,
            fastPoints: 3000,
            totalFasts: 28,
            currentStreak: 8,
            shareCount: 22
          },
          {
            user_id: 'mock_5',
            username: 'wellness_life',
            level: 12,
            fastPoints: 2400,
            totalFasts: 22,
            currentStreak: 5,
            shareCount: 19
          }
        ];

        // Adicionar usuários mock que não conflitem com usuários reais
        const existingUserIds = users.map(u => u.user_id);
        const newMockUsers = mockUsers.filter(mu => !existingUserIds.includes(mu.user_id));
        users.push(...newMockUsers);
      }

      return users;
    };

    const usersData = getAllUsersData();
    setLeaderboard(usersData);
  }, [user]);

  const getSortedLeaderboard = () => {
    return [...leaderboard].sort((a, b) => {
      if (viewMode === 'points') {
        return b.fastPoints - a.fastPoints;
      } else {
        return b.shareCount - a.shareCount;
      }
    });
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{position}</span>;
    }
  };

  const getPositionBadge = (position: number, mode: string) => {
    if (mode === 'shares') {
      switch (position) {
        case 1:
          return 'Compartilhador Lendário';
        case 2:
          return 'Inspirador Social';
        case 3:
          return 'Motivador';
        default:
          return position <= 10 ? 'Top 10' : 'Ativo';
      }
    } else {
      switch (position) {
        case 1:
          return 'Mestre Supremo';
        case 2:
          return 'Grande Mestre';
        case 3:
          return 'Mestre';
        default:
          return position <= 10 ? 'Top 10' : 'Jejuador';
      }
    }
  };

  const sortedLeaderboard = getSortedLeaderboard();

  return (
    <div className="space-y-6">
      {/* Seletor de modo */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('points')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'points'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              : 'bg-white/70 text-gray-600 hover:bg-white'
          }`}
        >
          🏆 FastPoints
        </button>
        <button
          onClick={() => setViewMode('shares')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            viewMode === 'shares'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              : 'bg-white/70 text-gray-600 hover:bg-white'
          }`}
        >
          📱 Compartilhamentos
        </button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            {viewMode === 'points' ? <Users className="w-5 h-5 text-white" /> : <Share2 className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {viewMode === 'points' ? '🏆 Ranking de FastPoints' : '📱 Top Compartilhadores'}
            </h3>
            <p className="text-sm text-gray-600">
              {viewMode === 'points' 
                ? 'Os jejuadores mais dedicados da comunidade' 
                : 'Usuários que mais inspiram a comunidade'
              }
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {sortedLeaderboard.map((entry, index) => {
            const position = index + 1;
            return (
              <div
                key={entry.user_id}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  entry.isCurrentUser
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200'
                    : position <= 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center w-8">
                  {getPositionIcon(position)}
                </div>

                <Avatar className="w-12 h-12">
                  <AvatarImage src={entry.avatar_url} alt={entry.username} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {entry.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm truncate ${
                      entry.isCurrentUser ? 'text-blue-800' : 'text-gray-800'
                    }`}>
                      {entry.username} {entry.isCurrentUser && '(Você)'}
                    </p>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      LV{entry.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {getPositionBadge(position, viewMode)}
                    </Badge>
                    {viewMode === 'points' && (
                      <span className="text-xs text-gray-500">
                        {entry.totalFasts} jejuns • {entry.currentStreak} dias streak
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-purple-600">
                    {viewMode === 'points' ? entry.fastPoints : entry.shareCount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {viewMode === 'points' ? 'pontos' : 'shares'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-800 font-medium">
            {viewMode === 'points' 
              ? '🌟 Continue jejuando e acumule mais FastPoints!'
              : '🌟 Compartilhe suas conquistas e entre no ranking!'
            }
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {viewMode === 'points'
              ? 'Cada jejum completado vale pontos e melhora seu ranking'
              : 'Cada compartilhamento vale pontos e inspira outros jejuadores'
            }
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SocialLeaderboard;
