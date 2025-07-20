import React from 'react';
import { brandConfig } from '../config/branding';

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'waving';
  size?: 'small' | 'medium' | 'large';
}

export const Mascot: React.FC<MascotProps> = ({ mood = 'happy', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Body */}
        <circle cx="50" cy="50" r="40" fill={brandConfig.mascot.bodyColor} />
        
        {/* Face */}
        <circle cx="50" cy="50" r="35" fill={brandConfig.mascot.faceColor} />
        
        {/* Eyes */}
        <circle cx="40" cy="45" r="3" fill={brandConfig.mascot.eyeColor} />
        <circle cx="60" cy="45" r="3" fill={brandConfig.mascot.eyeColor} />
        
        {/* Smile */}
        {mood === 'happy' && (
          <path d="M 35 55 Q 50 65 65 55" stroke={brandConfig.mascot.eyeColor} strokeWidth="2" fill="none" />
        )}
        {mood === 'thinking' && (
          <path d="M 35 60 L 65 60" stroke={brandConfig.mascot.eyeColor} strokeWidth="2" />
        )}
        {mood === 'celebrating' && (
          <path d="M 30 55 Q 50 70 70 55" stroke={brandConfig.mascot.eyeColor} strokeWidth="2" fill="none" />
        )}
        
        {/* Graduation cap */}
        <rect x="30" y="15" width="40" height="25" fill={brandConfig.mascot.capColor} />
        <polygon points="25,15 50,5 75,15" fill={brandConfig.mascot.capShadowColor} />
        
        {/* Arms */}
        {mood === 'waving' && (
          <>
            <ellipse cx="20" cy="50" rx="10" ry="5" fill={brandConfig.mascot.bodyColor} transform="rotate(-30 20 50)" />
            <ellipse cx="80" cy="40" rx="10" ry="5" fill={brandConfig.mascot.bodyColor} transform="rotate(45 80 40)" />
          </>
        )}
        {mood !== 'waving' && (
          <>
            <ellipse cx="20" cy="60" rx="10" ry="5" fill={brandConfig.mascot.bodyColor} transform="rotate(-45 20 60)" />
            <ellipse cx="80" cy="60" rx="10" ry="5" fill={brandConfig.mascot.bodyColor} transform="rotate(45 80 60)" />
          </>
        )}
        
        {/* Book (for pedagogue theme) */}
        <rect x="42" y="65" width="16" height="12" fill={brandConfig.mascot.capColor} rx="1" />
        <line x1="50" y1="65" x2="50" y2="77" stroke={brandConfig.mascot.capShadowColor} strokeWidth="1" />
      </svg>
      
      {/* Sparkles for celebrating mood */}
      {mood === 'celebrating' && (
        <>
          <span className="absolute top-0 left-0 text-yellow-400 animate-pulse">✨</span>
          <span className="absolute top-0 right-0 text-yellow-400 animate-pulse" style={{ animationDelay: '0.3s' }}>✨</span>
          <span className="absolute bottom-0 left-2 text-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }}>✨</span>
        </>
      )}
    </div>
  );
};