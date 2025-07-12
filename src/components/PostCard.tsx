import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import { Post } from '../types';
import { formatTimeAgo, formatScore } from '../utils/formatting';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [vote, setVote] = useState(post.userVote || 0);

  const handleVote = (direction: 1 | -1) => {
    if (vote === direction) {
      setVote(0);
    } else {
      setVote(direction);
    }
  };

  const currentScore = post.score + (vote - (post.userVote || 0));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex gap-4">
        {/* Vote buttons */}
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => handleVote(1)}
            className={`p-1 rounded hover:bg-gray-100 ${vote === 1 ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <ArrowUp size={20} />
          </button>
          <span className={`text-sm font-medium ${vote === 1 ? 'text-blue-600' : vote === -1 ? 'text-red-500' : 'text-gray-600'}`}>
            {formatScore(currentScore)}
          </span>
          <button 
            onClick={() => handleVote(-1)}
            className={`p-1 rounded hover:bg-gray-100 ${vote === -1 ? 'text-red-500' : 'text-gray-400'}`}
          >
            <ArrowDown size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to={`/r/${post.subreddit.name}`} className="font-medium hover:text-blue-600">
              {post.subreddit.name}
            </Link>
            <span>•</span>
            <span>af {post.author.username}</span>
            <span>•</span>
            <span>{formatTimeAgo(post.createdAt)}</span>
          </div>

          {/* Title */}
          <h3 className="mb-2">
            <Link 
              to={`/r/${post.subreddit.name}/comments/${post.id}`}
              className="text-lg font-medium text-gray-900 hover:text-blue-600"
            >
              {post.title}
            </Link>
          </h3>

          {/* Content preview */}
          {post.type === 'text' && post.content && (
            <p className="text-gray-600 mb-3 line-clamp-3">
              {post.content.substring(0, 200)}
              {post.content.length > 200 && '...'}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link 
              to={`/r/${post.subreddit.name}/comments/${post.id}`}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <MessageSquare size={16} />
              <span>{post.commentCount} kommentarer</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};