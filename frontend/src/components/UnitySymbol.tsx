import React from 'react';

interface UnitySymbolProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const UnitySymbol: React.FC<UnitySymbolProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  // Simpelt sammenhold symbol - to cirkler der overlapper
  // Symboliserer fællesskab og sammenhold
  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* To overlappende cirkler - symbol for sammenhold */}
        <circle 
          cx="40" 
          cy="50" 
          r="25" 
          fill="none" 
          stroke="#ffb69e" 
          strokeWidth="3"
          opacity="0.8"
        />
        <circle 
          cx="60" 
          cy="50" 
          r="25" 
          fill="none" 
          stroke="#ffd0b8" 
          strokeWidth="3"
          opacity="0.8"
        />
        
        {/* Overlappende område - fælles grund */}
        <path 
          d="M 50 27 A 25 25 0 0 1 50 73 A 25 25 0 0 1 50 27"
          fill="#ffe3d8"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};