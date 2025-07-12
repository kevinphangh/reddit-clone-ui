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
  username,
  karma
}) => {
  return (
    <div className="min-h-screen bg-reddit-bg-light">
      <Header isLoggedIn={isLoggedIn} username={username} karma={karma} />
      
      <div className="pt-[48px]">
        <div className="max-w-[1280px] mx-auto px-4 py-5">
          <div className="flex gap-6">
            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
            
            {/* Sidebar */}
            {showSidebar && (
              <Sidebar 
                subreddit={subreddit} 
                showSubredditInfo={!!subreddit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};