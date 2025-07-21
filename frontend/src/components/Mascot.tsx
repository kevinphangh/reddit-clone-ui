import React from 'react';
import { brandConfig } from '../config/branding';

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'waving';
  size?: 'small' | 'medium' | 'large';
}

export const Mascot: React.FC<MascotProps> = ({ mood = 'happy', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-28 h-28'
  };

  // Minimalistisk dansk design - enkel og clean
  return (
    <div className={`${sizeClasses[size]} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Minimalistisk cirkel base */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke={brandConfig.mascot.bodyColor} 
          strokeWidth="3"
          opacity="0.8"
        />
        
        {/* Simpel ansigt - dansk hygge stil */}
        <g>
          {/* Øjne - simple prikker */}
          <circle cx="38" cy="45" r="2" fill={brandConfig.mascot.eyeColor} />
          <circle cx="62" cy="45" r="2" fill={brandConfig.mascot.eyeColor} />
          
          {/* Minimalistisk mund */}
          {mood === 'happy' && (
            <path 
              d="M 40 58 Q 50 62 60 58" 
              stroke={brandConfig.mascot.eyeColor} 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
            />
          )}
          {mood === 'thinking' && (
            <line 
              x1="45" y1="60" 
              x2="55" y2="60" 
              stroke={brandConfig.mascot.eyeColor} 
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
          {mood === 'celebrating' && (
            <path 
              d="M 38 56 Q 50 64 62 56" 
              stroke={brandConfig.mascot.eyeColor} 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
            />
          )}
        </g>
        
        {/* Minimalistisk pædagog symbol - bog */}
        <g opacity="0.6">
          <rect 
            x="44" y="72" 
            width="12" height="8" 
            fill="none" 
            stroke={brandConfig.mascot.capColor} 
            strokeWidth="1.5"
            rx="1"
          />
          <line 
            x1="50" y1="72" 
            x2="50" y2="80" 
            stroke={brandConfig.mascot.capColor} 
            strokeWidth="1"
          />
        </g>
        
        {/* Vink gestus - meget simpel */}
        {mood === 'waving' && (
          <path 
            d="M 75 40 Q 85 35 82 45" 
            stroke={brandConfig.mascot.bodyColor} 
            strokeWidth="2.5" 
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        )}
      </svg>
      
      {/* Danske stjerner for celebrating - mere subtilt */}
      {mood === 'celebrating' && (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-1 left-1 text-primary-500 text-xs opacity-60 animate-pulse">•</span>
          <span className="absolute top-1 right-1 text-primary-500 text-xs opacity-60 animate-pulse" style={{ animationDelay: '0.3s' }}>•</span>
          <span className="absolute bottom-1 left-1/2 text-primary-500 text-xs opacity-60 animate-pulse" style={{ animationDelay: '0.6s' }}>•</span>
        </div>
      )}
    </div>
  );
};