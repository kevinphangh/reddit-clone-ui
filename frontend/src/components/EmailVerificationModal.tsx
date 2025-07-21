import React from 'react';
import { Mail, X } from 'lucide-react';
import { UnitySymbol } from './UnitySymbol';

interface EmailVerificationModalProps {
  email: string;
  onClose?: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  email,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
        
        <div className="flex justify-center mb-4">
          <UnitySymbol size="large" />
        </div>
        
        <div className="text-center">
          <Mail className="mx-auto mb-4 text-primary-600" size={48} />
          
          <h2 className="text-heading-1 mb-3">Tjek din email! 📧</h2>
          
          <p className="text-body text-gray-700 mb-4">
            Vi har sendt en bekræftelses-email til:
          </p>
          
          <p className="text-body font-medium text-gray-900 mb-6">
            {email}
          </p>
          
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <p className="text-body-small text-gray-700">
              Klik på linket i emailen for at aktivere din konto. 
              Linket udløber om 24 timer.
            </p>
          </div>
          
          <div className="space-y-3 text-body-small text-gray-600">
            <p>
              <strong>Kan du ikke finde emailen?</strong>
            </p>
            <ul className="text-left space-y-2 ml-4">
              <li>• Tjek din spam/junk mappe</li>
              <li>• Kontroller at email-adressen er korrekt</li>
              <li>• Vent et par minutter og tjek igen</li>
            </ul>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="mt-6 w-full bg-primary-600 text-gray-900 py-2 rounded hover:bg-primary-700 transition-colors text-button"
            >
              OK, forstået!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};