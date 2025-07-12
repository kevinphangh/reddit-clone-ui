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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-via-blue via-via-primary to-via-secondary p-8 mb-6 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-4 right-4 opacity-20">
          <div className="w-32 h-32 rounded-full bg-white/10"></div>
        </div>
        <div className="absolute bottom-4 left-4 opacity-10">
          <div className="w-24 h-24 rounded-full bg-white/10"></div>
        </div>
        <div className="relative text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🎓</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Velkommen til VIA Pædagoger!</h1>
              <p className="text-lg opacity-90">Dit faglige fællesskab venter</p>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed max-w-2xl">
            Bliv en del af Danmarks største online fællesskab for pædagogstuderende og erfarne pædagoger. 
            Her kan du dele erfaringer, få hjælp til dit studie, finde praktikpladser og netværke med kolleger fra hele landet.
          </p>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-via-orange rounded-full"></div>
              <span className="text-sm font-medium">2.847 aktive pædagoger</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-via-green rounded-full"></div>
              <span className="text-sm font-medium">156 nye indlæg i dag</span>
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