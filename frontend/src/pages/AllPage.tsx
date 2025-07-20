import React from 'react';
import { PostCard } from '../components/PostCard';
import { useData } from '../contexts/DataContext';

export const AllPage: React.FC = () => {
  const { posts } = useData();
  
  // Show all posts chronologically
  const allPosts = [...posts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h1 className="text-heading-2 text-gray-900">Alle indlæg</h1>
        <p className="text-body text-gray-600">Fra alle fællesskaber</p>
      </div>
      
      <div className="space-y-4">
        {allPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};