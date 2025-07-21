import React, { useState } from 'react';
import { X, User, AlertCircle, Clock } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface ChangeUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUsername: string;
}

export const ChangeUsernameModal: React.FC<ChangeUsernameModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentUsername
}) => {
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshUser } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newUsername === currentUsername) {
      setError('Det nye brugernavn må ikke være det samme som det nuværende');
      return;
    }

    if (newUsername.length < 3 || newUsername.length > 20) {
      setError('Brugernavn skal være mellem 3 og 20 tegn');
      return;
    }

    if (!/^[a-zA-Z0-9_æøåÆØÅ]+$/.test(newUsername)) {
      setError('Brugernavn må kun indeholde bogstaver, tal og underscore');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.request('/api/auth/change-username', {
        method: 'PUT',
        body: JSON.stringify({ new_username: newUsername })
      });
      
      await refreshUser();
      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.status === 429) {
        setError(err.detail || 'Du kan kun ændre brugernavn én gang om dagen');
      } else if (err.status === 400) {
        setError(err.detail || 'Dette brugernavn er allerede taget');
      } else {
        setError('Der opstod en fejl. Prøv igen senere.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-heading-2 flex items-center gap-2">
            <User size={24} />
            Skift brugernavn
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="text-blue-600 mt-0.5" size={16} />
            <div>
              <p className="text-sm text-blue-800">
                Du kan kun ændre dit brugernavn én gang hver 24. time
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Vælg derfor dit nye brugernavn med omhu
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-body-small font-medium text-gray-700 mb-1">
              Nuværende brugernavn
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
              {currentUsername}
            </div>
          </div>

          <div>
            <label className="block text-body-small font-medium text-gray-700 mb-1">
              Nyt brugernavn
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
              placeholder="Vælg et nyt brugernavn"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-body-small text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Annuller
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-gray-900 rounded-md hover:bg-primary-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Gemmer...' : 'Gem nyt brugernavn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};