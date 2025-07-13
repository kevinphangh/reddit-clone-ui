import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="px-4 py-4 md:py-6 lg:py-8">
        <div className="flex justify-center relative">
            {/* Main Content - Responsive width for different screens */}
            <main className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl w-full mx-auto">
              {children}
            </main>
            
            {/* Info Panel - Shows earlier on large screens */}
            <aside className="fixed right-4 lg:right-8 xl:right-12 2xl:right-16 top-20 w-64 lg:w-72 xl:w-80 hidden lg:block">
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