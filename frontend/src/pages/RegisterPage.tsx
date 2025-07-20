import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { EmailVerificationModal } from '../components/EmailVerificationModal';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [showEmailVerification, setShowEmailVerification] = useState(false);

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Username validation
    if (username.length < 3) {
      errors.username = 'Brugernavn skal være mindst 3 tegn';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = 'Brugernavn må kun indeholde bogstaver, tal og underscore';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = 'Indtast en gyldig email-adresse';
    }
    
    // Password validation
    if (password.length < 6) {
      errors.password = 'Adgangskoden skal være mindst 6 tegn';
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Adgangskoderne matcher ikke';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Frontend validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register(username, email, password);
      if (result.success) {
        setSuccess(true);
        // Vis email verificering modal
        setShowEmailVerification(true);
      } else {
        setError(result.error || 'Kunne ikke oprette konto. Prøv igen.');
      }
    } catch (err) {
      // Registration error
      setError('Der skete en fejl med serveren. Prøv igen senere.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto px-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-heading-1 mb-2 sm:mb-3">Bliv en del af fællesskabet! 🌟</h1>
        <p className="text-body-small text-gray-600 mb-4 sm:mb-6">Opret din konto og kom med i vores hyggelige fællesskab af pædagogstuderende.</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-body-small text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        {success && !error && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-body-small text-green-700">
            ✓ Din konto blev oprettet succesfuldt! Logger dig ind...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-body-small font-medium text-gray-700 mb-1">
              Brugernavn
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (validationErrors.username) {
                  setValidationErrors({...validationErrors, username: ''});
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                validationErrors.username ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
              }`}
              placeholder="Mindst 3 tegn, kun bogstaver, tal og _"
              required
            />
            {validationErrors.username && (
              <p className="mt-1 text-caption text-red-600">{validationErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-body-small font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors({...validationErrors, email: ''});
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                validationErrors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
              }`}
              placeholder="din@email.dk"
              required
            />
            {validationErrors.email && (
              <p className="mt-1 text-caption text-red-600">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-body-small font-medium text-gray-700 mb-1">
              Adgangskode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationErrors.password) {
                  setValidationErrors({...validationErrors, password: ''});
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                validationErrors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
              }`}
              placeholder="Mindst 6 tegn"
              required
            />
            {validationErrors.password && (
              <p className="mt-1 text-caption text-red-600">{validationErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-body-small font-medium text-gray-700 mb-1">
              Bekræft adgangskode
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationErrors.confirmPassword) {
                  setValidationErrors({...validationErrors, confirmPassword: ''});
                }
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-primary-500'
              }`}
              required
            />
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-caption text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-gray-900 text-button py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Opretter din konto...' : 'Bliv medlem af fællesskabet ✨'}
          </button>
        </form>

        <div className="mt-6 text-center text-body-small text-gray-600">
          Har du allerede en konto?{' '}
          <Link to="/login" className="text-primary-800 hover:text-primary-900 hover:underline">
            Log ind her
          </Link>
        </div>
      </div>

      <div className="mt-4 text-caption text-gray-500 text-center">
        Ved at blive medlem accepterer du vores fællesskabsregler og hjælper med at skabe et trygt rum for alle 🤝
      </div>
      
      {showEmailVerification && (
        <EmailVerificationModal
          email={email}
          onClose={() => {
            setShowEmailVerification(false);
            // Clear form
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setSuccess(false);
          }}
        />
      )}
    </div>
  );
};