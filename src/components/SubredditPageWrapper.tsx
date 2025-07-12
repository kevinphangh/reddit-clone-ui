import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from './Layout';
import { SubredditPage } from '../pages/SubredditPage';

interface SubredditPageWrapperProps {
  isLoggedIn: boolean;
  username: string;
}

export const SubredditPageWrapper: React.FC<SubredditPageWrapperProps> = ({ 
  isLoggedIn, 
  username
}) => {
  useParams(); // For route matching

  return (
    <Layout 
      isLoggedIn={isLoggedIn} 
      username={username}
    >
      <SubredditPage />
    </Layout>
  );
};