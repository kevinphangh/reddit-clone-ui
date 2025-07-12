import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { SortBar } from '../components/SortBar';
import { mockPosts } from '../data/mockData';
import { SORT_OPTIONS } from '../utils/constants';

export const SubredditPage: React.FC = () => {
  const { subreddit } = useParams();
  const [currentSort] = useState(SORT_OPTIONS.HOT);
  const [currentView, setCurrentView] = useState<'card' | 'classic' | 'compact'>('card');

  
  // Filter posts for this subreddit
  const subredditPosts = mockPosts.filter(post => 
    post.subreddit.name.toLowerCase() === subreddit?.toLowerCase()
  );

  return (
    <div>
      <SortBar 
        currentSort={currentSort}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="space-y-3">
        {subredditPosts.length > 0 ? (
          subredditPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              view={currentView}
              hideSubreddit={true}
            />
          ))
        ) : (
          <div className="via-card p-8 text-center">
            <p className="text-via-gray">No posts in r/{subreddit} yet</p>
          </div>
        )}
      </div>
    </div>
  );
};