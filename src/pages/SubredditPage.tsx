import React from 'react';
import { useParams } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { mockPosts } from '../data/mockData';

export const SubredditPage: React.FC = () => {
  const { subreddit } = useParams();
  
  // Filter posts for this subreddit
  const subredditPosts = mockPosts.filter(post => 
    post.subreddit.name.toLowerCase() === subreddit?.toLowerCase()
  );

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h1 className="text-2xl font-bold text-gray-900">{subreddit}</h1>
        <p className="text-gray-600">Fællesskab</p>
      </div>
      
      <div className="space-y-4">
        {subredditPosts.length > 0 ? (
          subredditPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">Ingen indlæg i {subreddit} endnu</p>
          </div>
        )}
      </div>
    </div>
  );
};