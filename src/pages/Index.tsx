
import React, { useState, useEffect } from 'react';
import { Timer, User, Award, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FastTimer from '@/components/FastTimer';
import ZenMascot from '@/components/ZenMascot';
import UserProfile from '@/components/UserProfile';
import Achievements from '@/components/Achievements';
import Navigation from '@/components/Navigation';

const Index = () => {
  const [currentView, setCurrentView] = useState('timer');
  const [user, setUser] = useState({
    name: 'Usuário',
    level: 5,
    fastPoints: 1250,
    currentStreak: 12,
    totalFasts: 48
  });

  const renderView = () => {
    switch (currentView) {
      case 'timer':
        return <FastTimer user={user} setUser={setUser} />;
      case 'profile':
        return <UserProfile user={user} />;
      case 'achievements':
        return <Achievements user={user} />;
      default:
        return <FastTimer user={user} setUser={setUser} />;
    }
  };

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
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-gray-500">FastPoints</p>
              <p className="text-sm font-bold text-purple-600">{user.fastPoints} FP</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">LV{user.level}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        <ZenMascot />
        {renderView()}
      </main>

      {/* Navigation */}
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  );
};

export default Index;
