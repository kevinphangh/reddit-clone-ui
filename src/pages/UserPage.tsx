import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { PostCard } from '../components/PostCard';
import { Comment } from '../components/Comment';
import { formatTimeAgo } from '../utils/formatting';

export const UserPage: React.FC = () => {
  const { username } = useParams();
  const { getUserPosts, getUserComments } = useData();
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  
  const userPosts = getUserPosts(username || '');
  const userComments = getUserComments(username || '');
  
  return (
    <div>
      {/* User Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-medium">
            {username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">u/{username}</h1>
            <p className="text-gray-500">Medlem siden {formatTimeAgo(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))}</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg mb-4">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 md:px-6 py-3 font-medium text-sm md:text-base ${
              activeTab === 'posts' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Indlæg ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 md:px-6 py-3 font-medium text-sm md:text-base ${
              activeTab === 'comments' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Kommentarer ({userComments.length})
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'posts' ? (
          userPosts.length > 0 ? (
            userPosts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Ingen indlæg endnu</p>
            </div>
          )
        ) : (
          userComments.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg divide-y">
              {userComments.map(comment => (
                <div key={comment.id} className="p-4">
                  <div className="text-xs text-gray-500 mb-2">
                    Kommentar på "{comment.post.title}"
                  </div>
                  <Comment comment={comment} depth={0} maxDepth={0} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Ingen kommentarer endnu</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};