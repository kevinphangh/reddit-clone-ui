import React, { useState } from 'react';
import { PostCard } from '../components/PostCard';
import { SortBar } from '../components/SortBar';
import { mockPosts } from '../data/mockData';
import { SORT_OPTIONS } from '../utils/constants';

export const AllPage: React.FC = () => {
  const [currentSort] = useState(SORT_OPTIONS.NEW);
  const [currentView, setCurrentView] = useState<'card' | 'classic' | 'compact'>('card');

  // Show all posts chronologically
  const allPosts = [...mockPosts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Alle</h1>
        <p className="text-sm text-via-gray">Alle indlæg fra alle fællesskaber</p>
      </div>
      
      <SortBar 
        currentSort={currentSort}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="space-y-3">
        {allPosts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            view={currentView}
          />
        ))}
      </div>
    </div>
  );
};