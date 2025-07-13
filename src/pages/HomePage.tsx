import React from 'react';
import { PostCard } from '../components/PostCard';
import { useData } from '../contexts/DataContext';

export const HomePage: React.FC = () => {
  const { posts, loading } = useData();
  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">Indlæser...</p>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Ingen indlæg endnu</h2>
        <p className="text-gray-500">Vær den første til at oprette et indlæg!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};