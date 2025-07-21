import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChangeUsernameModal } from '../components/ChangeUsernameModal';
import { Settings, User, Shield, ArrowLeft } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUsernameChangeSuccess = () => {
    setSuccessMessage('Dit brugernavn er blevet opdateret!');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <Settings size={24} />
          <h1 className="text-heading-1">Indstillinger</h1>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            ✓ {successMessage}
          </div>
        )}

        <div className="space-y-6">
          {/* Account section */}
          <div>
            <h2 className="text-heading-3 mb-4 flex items-center gap-2">
              <User size={20} />
              Konto
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-body-small font-medium text-gray-700">Brugernavn</p>
                  <p className="text-body text-gray-900">{user.username}</p>
                </div>
                <button
                  onClick={() => setShowUsernameModal(true)}
                  className="px-4 py-2 bg-primary-600 text-gray-900 rounded-md hover:bg-primary-700 text-sm"
                >
                  Skift brugernavn
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-body-small font-medium text-gray-700">Email</p>
                <p className="text-body text-gray-900">{user.email}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-body-small font-medium text-gray-700">Medlem siden</p>
                <p className="text-body text-gray-900">
                  {new Date(user.cakeDay).toLocaleDateString('da-DK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy section */}
          <div>
            <h2 className="text-heading-3 mb-4 flex items-center gap-2">
              <Shield size={20} />
              Privatliv
            </h2>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Om anonymitet på VIA Pædagoger
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Dit rigtige navn vises aldrig på forummet - kun dit brugernavn er synligt for andre.
                Du kan ændre dit brugernavn én gang hver 24. time hvis du ønsker mere anonymitet.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                💡 Tip: Vælg et brugernavn der ikke afslører din identitet
              </p>
            </div>
          </div>
        </div>
      </div>

      <ChangeUsernameModal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onSuccess={handleUsernameChangeSuccess}
        currentUsername={user.username}
      />
    </div>
  );
};