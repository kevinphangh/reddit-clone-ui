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
        <div className="relative max-w-screen-2xl mx-auto">
          {/* Main Content - Always centered */}
          <main className="max-w-3xl mx-auto">
            {children}
          </main>
          
          {/* Info Panel - Better spacing on larger screens */}
          <aside className="hidden xl:block absolute left-[calc(50%+400px)] 2xl:left-[calc(50%+420px)] top-0 w-72 xl:w-80">
            <div className="sticky top-20">
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
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};