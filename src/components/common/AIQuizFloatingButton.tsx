'use client';

import { useState } from 'react';

interface AIQuizFloatingButtonProps {
  isAdmin?: boolean;
}

export default function AIQuizFloatingButton({ isAdmin = false }: AIQuizFloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isAdmin) {
      window.location.href = '/admin/ai-quiz';
    } else {
      window.location.href = '/create-quiz';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-300"
      >
        {/* AI Icon */}
        <div className="flex items-center justify-center w-full h-full">
          <svg 
            className={`w-8 h-8 transition-transform duration-300 ${isHovered ? 'animate-pulse scale-110' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            />
          </svg>
        </div>

        {/* Tooltip */}
        <div className={`absolute right-full mr-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}>
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
            {isAdmin ? 'Tạo Quiz AI (Admin)' : 'Tạo Quiz AI'}
            <div className="absolute top-1/2 left-full transform -translate-y-1/2">
              <div className="w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </div>
        </div>

        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-purple-400 opacity-75 animate-ping"></div>
      </button>
    </div>
  );
}