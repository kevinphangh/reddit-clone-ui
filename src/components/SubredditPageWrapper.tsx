import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from './Layout';
import { SubredditPage } from '../pages/SubredditPage';
import { mockSubreddits } from '../data/mockData';

interface SubredditPageWrapperProps {
  isLoggedIn: boolean;
  username: string;
  karma: number;
}

export const SubredditPageWrapper: React.FC<SubredditPageWrapperProps> = ({ 
  isLoggedIn, 
  username, 
  karma 
}) => {
  const { subreddit } = useParams();
  const currentSubreddit = mockSubreddits.find(
    s => s.name.toLowerCase() === subreddit?.toLowerCase()
  );

  return (
    <Layout 
      isLoggedIn={isLoggedIn} 
      username={username} 
      karma={karma}
      subreddit={currentSubreddit}
    >
      <SubredditPage />
    </Layout>
  );
};