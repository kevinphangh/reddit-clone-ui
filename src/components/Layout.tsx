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
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {showSidebar ? (
          <div className="flex">
            {/* Main Content - Centered */}
            <main className="flex-1 max-w-3xl mx-auto">
              {children}
            </main>
            
            {/* Sidebar - Fixed to right */}
            <aside className="w-80 hidden lg:block ml-8">
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