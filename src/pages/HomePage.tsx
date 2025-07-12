import React from 'react';
import { PostCard } from '../components/PostCard';
import { mockPosts } from '../data/mockData';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-4">
      {mockPosts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};