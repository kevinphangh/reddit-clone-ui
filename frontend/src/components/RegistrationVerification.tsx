import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { api } from '../lib/api';

interface RegistrationVerificationProps {
  username: string;
  onVerified: () => void;
  onError: (error: string) => void;
}

export const RegistrationVerification: React.FC<RegistrationVerificationProps> = ({
  username,
  onVerified,
  onError
}) => {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    verifyUser();
  }, [username]);

  const verifyUser = async () => {
    try {
      // Step 1: Verify token is valid
      const userData = await api.getMe();
      
      // Step 2: Verify username matches
      if (userData.username !== username) {
        throw new Error('Brugernavne matcher ikke');
      }
      
      // Step 3: Verify user is active
      if (!userData.is_active) {
        throw new Error('Din konto er ikke aktiv. Kontakt support.');
      }
      
      // Step 4: Success
      setStatus('success');
      setTimeout(() => {
        onVerified();
      }, 1500);
      
    } catch (error) {
      setStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Kunne ikke verificere bruger';
      setErrorMessage(errorMsg);
      onError(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        {status === 'checking' && (
          <div className="text-center">
            <Loader className="animate-spin mx-auto mb-4" size={48} />
            <h3 className="text-heading-3 mb-2">Verificerer din konto...</h3>
            <p className="text-body-small text-gray-600">
              Tjekker at alt er klar til dig
            </p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
            <h3 className="text-heading-3 mb-2">Konto verificeret!</h3>
            <p className="text-body-small text-gray-600">
              Du bliver sendt videre om et øjeblik...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-heading-3 mb-2">Verificering fejlede</h3>
            <p className="text-body-small text-red-600 mb-4">
              {errorMessage}
            </p>
            <p className="text-body-small text-gray-600">
              Prøv at <a href="/login" className="text-primary-600 hover:underline">logge ind manuelt</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};