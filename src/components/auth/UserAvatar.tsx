
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, Share } from 'lucide-react';

interface UserAvatarProps {
  user: {
    username: string;
    avatar?: string;
    level: number;
    fastPoints: number;
  };
  onLogout: () => void;
  onOpenShare: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, onLogout, onOpenShare }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right">
            <p className="text-xs text-gray-500">FastPoints</p>
            <p className="text-sm font-bold text-purple-600">{user.fastPoints} FP</p>
          </div>
          <Avatar className="w-8 h-8 border-2 border-purple-200">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">LV{user.level}</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{user.username}</p>
          <p className="text-xs text-gray-500">Nível {user.level}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onOpenShare}>
          <Share className="w-4 h-4 mr-2" />
          Compartilhar Progresso
        </DropdownMenuItem>
        <DropdownMenuItem>
          <User className="w-4 h-4 mr-2" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
