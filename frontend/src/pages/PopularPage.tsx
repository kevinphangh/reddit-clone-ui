import React from 'react';
import { PostCard } from '../components/PostCard';
import { useData } from '../contexts/DataContext';

export const PopularPage: React.FC = () => {
  const { posts } = useData();
  
  // Show most popular posts (sorted by score)
  const popularPosts = [...posts].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h1 className="text-heading-2 text-gray-900">Populære indlæg</h1>
        <p className="text-body text-gray-600">De mest populære fra alle fællesskaber</p>
      </div>
      
      <div className="space-y-4">
        {popularPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};