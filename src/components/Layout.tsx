import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  username?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  isLoggedIn = false,
  username
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} username={username} />
      
      <div className="px-4 py-6">
        <div className="flex justify-center relative">
            {/* Main Content - Truly centered */}
            <main className="max-w-3xl w-full mx-auto">
              {children}
            </main>
            
            {/* Info Panel - Positioned absolute to right */}
            <aside className="fixed right-4 top-20 w-80 hidden xl:block">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Nuværende studerende</h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Et fællesskab for nuværende pædagogstuderende
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Del dine erfaringer, stil spørgsmål, og hjælp hinanden med at navigere i hverdagens udfordringer.
                </p>
                <p className="text-gray-600 text-xs mb-4">
                  Sammen er vi stærkere 💙
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Medlemmer</span>
                    <span className="font-semibold text-gray-900">12.387</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Online nu</span>
                    <span className="font-semibold text-green-600">423</span>
                  </div>
                </div>
              </div>
            </aside>
        </div>
      </div>
    </div>
  );
};