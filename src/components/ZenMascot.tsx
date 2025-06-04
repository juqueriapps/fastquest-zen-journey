import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

const ZenMascot: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const messages = [
    "Olá! Sou o Zen, seu companheiro de jejum! 🧘‍♂️",
    "Respire fundo e confie no processo! 💙",
    "Cada hora é uma vitória! Continue firme! 🌟",
    "Lembre-se: você é mais forte do que imagina! 💪",
    "A jornada de mil quilômetros começa com um passo! 🚀"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <Card className="p-4 mb-6 bg-gradient-to-r from-blue-100 to-purple-100 border-0 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl">🧘‍♂️</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 leading-relaxed">
            {messages[currentMessage]}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ZenMascot;
