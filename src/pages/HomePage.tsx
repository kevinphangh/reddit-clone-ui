import React, { useState } from 'react';
import { PostCard } from '../components/PostCard';
import { SortBar } from '../components/SortBar';
import { mockPosts } from '../data/mockData';
import { SORT_OPTIONS } from '../utils/constants';

export const HomePage: React.FC = () => {
  const [currentSort] = useState(SORT_OPTIONS.HOT);
  const [currentView, setCurrentView] = useState<'card' | 'classic' | 'compact'>('card');

  return (
    <div>
      <SortBar 
        currentSort={currentSort}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="space-y-3">
        {mockPosts.map(post => (
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