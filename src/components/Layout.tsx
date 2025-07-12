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
            
            {/* Sidebar - Positioned absolute to right */}
            <aside className="fixed right-4 top-20 w-80 hidden xl:block">
              <Sidebar 
                subreddit={subreddit} 
                showSubredditInfo={!!subreddit}
              />
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