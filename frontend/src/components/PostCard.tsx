import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import { Post } from '../types';
import { formatTimeAgo, formatScore } from '../utils/formatting';
import { useData } from '../contexts/DataContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const { votePost } = useData();

  const handleVote = (direction: 1 | -1, e: React.MouseEvent) => {
    e.stopPropagation();
    votePost(String(post.id), direction);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if clicking on the card itself, not on links or buttons
    if ((e.target as HTMLElement).closest('a, button')) {
      return;
    }
    navigate(`/comments/${post.id}`);
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex gap-3 md:gap-4">
        {/* Vote buttons */}
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={(e) => handleVote(1, e)}
            className={`p-1 rounded hover:bg-gray-100 ${post.userVote === 1 ? 'text-blue-600' : 'text-gray-400'}`}
            aria-label="Stem op"
          >
            <ArrowUp size={20} />
          </button>
          <span className={`text-sm font-medium ${post.userVote === 1 ? 'text-blue-600' : post.userVote === -1 ? 'text-red-500' : 'text-gray-600'}`}>
            {formatScore(post.score)}
          </span>
          <button 
            onClick={(e) => handleVote(-1, e)}
            className={`p-1 rounded hover:bg-gray-100 ${post.userVote === -1 ? 'text-red-500' : 'text-gray-400'}`}
            aria-label="Stem ned"
          >
            <ArrowDown size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>af {post.author.username}</span>
            <span>•</span>
            <span>{formatTimeAgo(post.createdAt)}</span>
          </div>

          {/* Title */}
          <h3 className="mb-2">
            <Link 
              to={`/comments/${post.id}`}
              className="text-base md:text-lg font-medium text-gray-900 hover:text-blue-600"
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
              to={`/comments/${post.id}`}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <MessageSquare size={16} />
              <span>{post.commentCount} {post.commentCount === 1 ? 'kommentar' : 'kommentarer'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};