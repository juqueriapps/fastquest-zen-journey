
import React from 'react';
import { Timer, User, Award, TrendingUp } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'timer', icon: Timer, label: 'Timer' },
    { id: 'profile', icon: User, label: 'Perfil' },
    { id: 'achievements', icon: Award, label: 'Conquistas' },
    { id: 'progress', icon: TrendingUp, label: 'Social' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-blue-100">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex-1 py-3 px-4 flex flex-col items-center gap-1 transition-all ${
                currentView === item.id
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                currentView === item.id ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className="text-xs font-medium">{item.label}</span>
              {currentView === item.id && (
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
