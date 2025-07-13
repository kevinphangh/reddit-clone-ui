import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PostCard } from '../components/PostCard';
import { Comment } from '../components/Comment';
import { formatTimeAgo } from '../utils/formatting';
import { api } from '../lib/api';
import { Post, Comment as CommentType } from '../types';

export const UserPage: React.FC = () => {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (username) {
      loadUserData();
    }
  }, [username, activeTab]);
  
  const loadUserData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'posts') {
        const posts = await api.getUserPosts(username!);
        setUserPosts(posts.map(post => ({
          id: post.id.toString(),
          title: post.title,
          content: post.content,
          type: 'text' as const,
          author: {
            ...post.author,
            id: post.author.id.toString(),
            cakeDay: new Date(post.author.created_at),
            points: post.author.points || { post: 0, comment: 0 }
          },
          subreddit: { 
            id: '1', 
            name: 'viapædagoger', 
            displayName: 'VIA Pædagoger',
            description: '',
            members: 1,
            activeUsers: 1,
            createdAt: new Date(),
            rules: []
          },
          createdAt: new Date(post.created_at),
          updatedAt: new Date(post.updated_at),
          editedAt: post.edited_at ? new Date(post.edited_at) : undefined,
          score: post.score,
          commentCount: post.comment_count,
          isLocked: post.is_locked,
          upvoteRatio: 1,
          userVote: post.user_vote || 0,
          saved: post.saved || false,
        })));
      } else {
        const comments = await api.getUserComments(username!);
        setUserComments(comments.map(comment => ({
          id: comment.id.toString(),
          body: comment.body,
          author: {
            ...comment.author,
            id: comment.author.id.toString(),
            cakeDay: new Date(comment.author.created_at),
            points: comment.author.points || { post: 0, comment: 0 }
          },
          post: {
            id: comment.post.id.toString(),
            title: comment.post.title
          },
          parent: undefined,
          createdAt: new Date(comment.created_at),
          updatedAt: new Date(comment.updated_at),
          editedAt: comment.edited_at ? new Date(comment.edited_at) : undefined,
          score: comment.score,
          isDeleted: comment.is_deleted || false,
          userVote: comment.user_vote || 0,
          saved: comment.saved || false,
          depth: 0,
          replies: [],
        })));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!username) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">Bruger ikke fundet</p>
      </div>
    );
  }

  return (
    <div>
      {/* User Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-medium">
            {username.charAt(0).toUpperCase()}
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
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">Indlæser...</p>
          </div>
        ) : (
          activeTab === 'posts' ? (
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
          )
        )}
      </div>
    </div>
  );
};