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
      {/* Velkomstbesked */}
      <div className="via-card p-4 mb-4 bg-gradient-to-r from-via-blue to-via-secondary">
        <div className="text-white">
          <h1 className="text-xl font-bold mb-2">Velkommen til VIA Pædagoger Forum! 🎓</h1>
          <p className="text-sm opacity-90">
            Et fællesskab for pædagogstuderende og erfarne pædagoger. Del dine erfaringer, få hjælp til studiet, og netværk med kolleger.
          </p>
        </div>
      </div>
      
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