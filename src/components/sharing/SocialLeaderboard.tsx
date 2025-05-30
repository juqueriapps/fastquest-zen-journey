
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Share2 } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  shareCount: number;
  profiles: {
    username: string;
    avatar_url?: string;
    level: number;
  };
}

const SocialLeaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Simulação de dados do leaderboard
    const mockData: LeaderboardEntry[] = [
      {
        user_id: '1',
        shareCount: 47,
        profiles: {
          username: 'jejummaster',
          avatar_url: 'https://picsum.photos/100/100?random=1',
          level: 25
        }
      },
      {
        user_id: '2',
        shareCount: 35,
        profiles: {
          username: 'healthwarrior',
          avatar_url: 'https://picsum.photos/100/100?random=2',
          level: 18
        }
      },
      {
        user_id: '3',
        shareCount: 28,
        profiles: {
          username: 'fastingpro',
          avatar_url: 'https://picsum.photos/100/100?random=3',
          level: 22
        }
      },
      {
        user_id: '4',
        shareCount: 22,
        profiles: {
          username: 'zenmaster',
          level: 15
        }
      },
      {
        user_id: '5',
        shareCount: 19,
        profiles: {
          username: 'wellness_life',
          level: 12
        }
      }
    ];

    setLeaderboard(mockData);
  }, []);

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

  const getPositionBadge = (position: number) => {
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
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Share2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold">🏆 Top Compartilhadores</h3>
          <p className="text-sm text-gray-600">Usuários que mais inspiram a comunidade</p>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry, index) => {
          const position = index + 1;
          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                position <= 3 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {getPositionIcon(position)}
              </div>

              <Avatar className="w-12 h-12">
                <AvatarImage src={entry.profiles.avatar_url} alt={entry.profiles.username} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {entry.profiles.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">
                    {entry.profiles.username}
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    LV{entry.profiles.level}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {getPositionBadge(position)}
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-purple-600">
                  {entry.shareCount}
                </p>
                <p className="text-xs text-gray-500">compartilhamentos</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
        <p className="text-sm text-blue-800 font-medium">
          🌟 Compartilhe suas conquistas e entre no ranking!
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Cada compartilhamento vale pontos e inspira outros jejuadores
        </p>
      </div>
    </Card>
  );
};

export default SocialLeaderboard;
