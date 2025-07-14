import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Adgangskoderne matcher ikke');
      return;
    }

    if (password.length < 6) {
      setError('Adgangskoden skal være mindst 6 tegn');
      return;
    }

    setLoading(true);

    try {
      const result = await register(username, email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Kunne ikke oprette konto. Prøv igen.');
      }
    } catch (err) {
      setError('Der skete en fejl. Prøv igen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm sm:max-w-md lg:max-w-lg mx-auto px-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Opret konto</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brugernavn
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
              placeholder="din@email.dk"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adgangskode
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
              placeholder="Mindst 6 tegn"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bekræft adgangskode
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Opretter konto...' : 'Opret konto'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Har du allerede en konto?{' '}
          <Link to="/login" className="text-primary-600 hover:underline">
            Log ind
          </Link>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Ved at oprette en konto accepterer du vores brugsbetingelser
      </div>
    </div>
  );
};