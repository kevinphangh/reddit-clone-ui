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
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* Sidebar */}
          {showSidebar && (
            <aside className="w-80 hidden lg:block">
              <Sidebar 
                subreddit={subreddit} 
                showSubredditInfo={!!subreddit}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};