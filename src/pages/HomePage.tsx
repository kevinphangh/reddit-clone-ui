import React from 'react';
import { PostCard } from '../components/PostCard';
import { mockPosts } from '../data/mockData';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Simpel velkomst */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">VIA Pædagoger</h1>
        <p className="text-gray-600">
          Fællesskab for pædagogstuderende og erfarne pædagoger
        </p>
      </div>
      
      {/* Posts */}
      <div className="space-y-4">
        {mockPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};