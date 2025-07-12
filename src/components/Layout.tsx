import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Subreddit } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  subreddit?: Subreddit;
  isLoggedIn?: boolean;
  username?: string;
  karma?: number;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSidebar = true,
  subreddit,
  isLoggedIn = false,
  username
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} username={username} />
      
      <div className="px-4 py-6">
        {showSidebar ? (
          <div className="flex justify-center">
            {/* Main Content - Centered in viewport */}
            <main className="max-w-3xl w-full">
              {children}
            </main>
            
            {/* Info Panel - Positioned absolute to right */}
            <aside className="fixed right-4 top-20 w-80 hidden xl:block">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">VIA Pædagoger</h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Fællesskab for pædagogstuderende og erfarne pædagoger
                </p>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Del dine erfaringer, stil spørgsmål, og hjælp hinanden med at navigere i hverdagens udfordringer.
                </p>
                <p className="text-gray-600 text-xs">
                  Sammen er vi stærkere 💙
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <main className="max-w-4xl mx-auto">
            {children}
          </main>
        )}
      </div>
    </div>
  );
};