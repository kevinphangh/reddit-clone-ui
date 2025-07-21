import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { UnitySymbol } from '../components/UnitySymbol';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setErrorMessage('Verifikationstoken mangler');
      return;
    }
    
    const verifyEmail = async () => {
      try {
        await api.verifyEmail(token);
        setStatus('success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        if (error.message.includes('Invalid or expired')) {
          setErrorMessage('Verifikationslinket er ugyldigt eller udløbet. Prøv at registrere dig igen.');
        } else {
          setErrorMessage('Der opstod en fejl under verifikationen. Prøv igen senere.');
        }
      }
    };
    
    verifyEmail();
  }, [searchParams, navigate]);
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader className="mx-auto mb-4 text-gray-600 animate-spin" size={48} />
            <h1 className="text-heading-1 mb-2">Verificerer din email...</h1>
            <p className="text-body text-gray-600">Vent venligst mens vi bekræfter din email-adresse.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="flex justify-center mb-4">
              <UnitySymbol size="large" />
            </div>
            <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
            <h1 className="text-heading-1 mb-2">Email verificeret!</h1>
            <p className="text-body text-gray-600 mb-4">
              Din email er nu bekræftet. Du kan nu logge ind og blive en del af fællesskabet.
            </p>
            <p className="text-body-small text-gray-500">
              Du bliver automatisk sendt til login-siden...
            </p>
            <Link 
              to="/login" 
              className="inline-block mt-4 text-gray-900 hover:underline font-medium"
            >
              Gå til login nu
            </Link>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="flex justify-center mb-4">
              <UnitySymbol size="large" />
            </div>
            <XCircle className="mx-auto mb-4 text-red-600" size={48} />
            <h1 className="text-heading-1 mb-2">Verifikation fejlede</h1>
            <p className="text-body text-red-600 mb-4">{errorMessage}</p>
            <div className="space-y-3">
              <Link 
                to="/register" 
                className="block w-full bg-primary-600 text-gray-900 text-button py-2 rounded hover:bg-primary-700 transition-colors"
              >
                Prøv at registrere igen
              </Link>
              <Link 
                to="/" 
                className="block text-gray-700 hover:underline"
              >
                Tilbage til forsiden
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};