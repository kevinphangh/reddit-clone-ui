import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AnonymousToggleProps {
  isAnonymous: boolean;
  onChange: (anonymous: boolean) => void;
  disabled?: boolean;
}

export const AnonymousToggle: React.FC<AnonymousToggleProps> = ({
  isAnonymous,
  onChange,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(!isAnonymous)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors
          ${isAnonymous 
            ? 'bg-gray-100 border-gray-300 text-gray-900' 
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isAnonymous ? (
          <>
            <EyeOff size={16} />
            <span className="text-sm font-medium">Post anonymt</span>
          </>
        ) : (
          <>
            <Eye size={16} />
            <span className="text-sm font-medium">Post som {disabled ? 'dig' : 'mig'}</span>
          </>
        )}
      </button>
      {isAnonymous && (
        <span className="text-xs text-gray-500">
          Dit brugernavn vises som "Anonym"
        </span>
      )}
    </div>
  );
};