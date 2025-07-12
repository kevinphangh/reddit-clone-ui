import React, { useState } from 'react';
import { PostCard } from '../components/PostCard';
import { SortBar } from '../components/SortBar';
import { mockPosts } from '../data/mockData';
import { SORT_OPTIONS } from '../utils/constants';

export const PopularPage: React.FC = () => {
  const [currentSort] = useState(SORT_OPTIONS.HOT);
  const [currentView, setCurrentView] = useState<'card' | 'classic' | 'compact'>('card');

  // Show most popular posts (sorted by score)
  const popularPosts = [...mockPosts].sort((a, b) => b.score - a.score);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Populært</h1>
        <p className="text-sm text-reddit-gray">De mest populære indlæg fra alle fællesskaber</p>
      </div>
      
      <SortBar 
        currentSort={currentSort}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="space-y-3">
        {popularPosts.map(post => (
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