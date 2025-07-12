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
      {/* Velkomstbesked - Minimalistisk Design */}
      <div className="bg-white border border-via-light rounded-2xl p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-via-primary rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🎓</span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-via-darkest mb-2">Velkommen til VIA Pædagoger</h1>
            <p className="text-lg text-via-medium mb-4">Dit faglige fællesskab venter</p>
            <p className="text-via-dark leading-relaxed max-w-2xl mb-6">
              Bliv en del af Danmarks største online fællesskab for pædagogstuderende og erfarne pædagoger. 
              Her kan du dele erfaringer, få hjælp til dit studie, finde praktikpladser og netværke med kolleger fra hele landet.
            </p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-via-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-via-primary rounded-full"></div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-via-darkest">2.847</div>
                  <div className="text-sm text-via-medium">aktive pædagoger</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-via-green/10 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-via-green rounded-full"></div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-via-darkest">156</div>
                  <div className="text-sm text-via-medium">nye indlæg i dag</div>
                </div>
              </div>
            </div>
          </div>
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