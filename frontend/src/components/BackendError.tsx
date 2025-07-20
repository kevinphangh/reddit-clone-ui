import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const BackendError: React.FC = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-red-200 rounded-lg p-8 text-center shadow-lg">
        <AlertTriangle className="mx-auto mb-4 text-red-500" size={64} />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Systemfejl
        </h1>
        <p className="text-gray-600 mb-6">
          Vi kan ikke oprette forbindelse til serveren. Forummet er midlertidigt utilgængeligt.
        </p>
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-700">
              Backend og database er nede. Kontakt administrator hvis problemet fortsætter.
            </p>
          </div>
          <button
            onClick={handleReload}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            Prøv igen
          </button>
        </div>
      </div>
    </div>
  );
};