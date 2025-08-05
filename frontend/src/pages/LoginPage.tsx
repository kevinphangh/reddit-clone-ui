import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Get redirect URL from query params
  const searchParams = new URLSearchParams(window.location.search);
  const from = searchParams.get('from') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate(from);
      } else {
        setError('Forkert brugernavn/email eller adgangskode');
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
        <h1 className="text-heading-1 mb-2 sm:mb-3">Velkommen tilbage! 👋</h1>
        <p className="text-body-small text-gray-600 mb-4 sm:mb-6">Så dejligt at se dig igen. Log ind og vær en del af vores hyggelige fællesskab.</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-body-small text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-body-small font-medium text-gray-700 mb-1">
              Brugernavn eller email
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Dit brugernavn eller email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-body-small font-medium text-gray-700 mb-1">
              Adgangskode
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-gray-900 text-button py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logger ind...' : 'Log ind'}
          </button>
        </form>

        <div className="mt-6 text-center text-body-small text-gray-600">
          Har du ikke en konto?{' '}
          <Link to="/register" className="text-primary-800 hover:text-primary-900 hover:underline">
            Opret konto
          </Link>
        </div>
      </div>

      <div className="mt-4 text-caption text-gray-500 text-center">
        Tip: Du kan logge ind med dit brugernavn eller din email
      </div>
    </div>
  );
};