import React from 'react';
import { MessageSquare, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const EmptyForum: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Velkommen til VIA Pædagoger! 🎉
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Et helt nyt forum for pædagogstuderende - vær med fra starten!
        </p>
        
        {isLoggedIn ? (
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-gray-900 rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium"
          >
            <MessageSquare size={20} />
            Opret det første indlæg
          </Link>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600">Tilmeld dig for at være med fra begyndelsen</p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/register"
                className="px-6 py-3 bg-primary-600 text-gray-900 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Opret konto
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Log ind
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Del dine tanker</h3>
          <p className="text-gray-600 text-sm">
            Stil spørgsmål, del erfaringer og få hjælp fra medstuderende
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Byg fællesskab</h3>
          <p className="text-gray-600 text-sm">
            Mød andre VIA-studerende på tværs af campusser og semestre
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Støt hinanden</h3>
          <p className="text-gray-600 text-sm">
            Få og giv støtte gennem studietidens op- og nedture
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-700 mb-4">
          🌟 <strong>Du kan være med til at forme dette forum!</strong>
        </p>
        <p className="text-gray-600 text-sm">
          Hvad vil du gerne diskutere? Praktik, eksamen, studieliv eller noget helt andet?
        </p>
      </div>
    </div>
  );
};