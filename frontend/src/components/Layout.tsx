import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children
}) => {
  return (
    <div className="min-h-screen bg-orange-50">
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white rounded-full"></div>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Vores fællesskab</h2>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Velkommen til VIA Pædagoger - hvor vi støtter hinanden gennem studietiden! 🌟
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Her kan du dele dine oplevelser, få svar på spørgsmål, og finde inspiration til både praksis og teori. Vi hjælper hinanden med alt fra opgaver til hverdagsudfordringer.
                </p>
                <p className="text-primary-600 text-sm font-medium mb-4">
                  "Sammen skaber vi de bedste pædagoger" ✨
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Medlemmer</span>
                    <span className="font-semibold text-gray-900">347</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Online nu</span>
                    <span className="font-semibold text-green-600">23</span>
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