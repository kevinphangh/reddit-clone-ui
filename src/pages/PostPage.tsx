import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare
} from 'lucide-react';
import { CommentSection } from '../components/CommentSection';
import { mockPosts, mockComments } from '../data/mockData';
import { formatTimeAgo, formatScore } from '../utils/formatting';
import { clsx } from 'clsx';

export const PostPage: React.FC = () => {
  const { postId } = useParams();
  
  // Mock finding the post
  const post = mockPosts.find(p => p.id === postId);
  
  if (!post) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h1 className="text-xl font-bold mb-2">Indlæg ikke fundet</h1>
        <p className="text-gray-500">Det indlæg du leder efter eksisterer ikke.</p>
      </div>
    );
  }

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
    <div>
      {/* Post Content */}
      <div className="bg-white border border-gray-200 rounded-lg mb-4">
        <div className="flex">
          {/* Vote Section */}
          <div className="flex flex-col items-center p-2 bg-gray-50">
            <button 
              onClick={() => handleVote(1)}
              className={clsx('p-1 rounded hover:bg-gray-200 transition-colors', vote === 1 ? 'text-blue-600' : 'text-gray-400')}
              aria-label="Upvote"
            >
              <ArrowUp size={24} />
            </button>
            <span className={clsx(
              'text-base font-bold my-1',
              vote === 1 ? 'text-blue-600' : vote === -1 ? 'text-red-500' : 'text-gray-600'
            )}>
              {formatScore(currentScore)}
            </span>
            <button 
              onClick={() => handleVote(-1)}
              className={clsx('p-1 rounded hover:bg-gray-200 transition-colors', vote === -1 ? 'text-red-500' : 'text-gray-400')}
              aria-label="Downvote"
            >
              <ArrowDown size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3">
            {/* Meta Info */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <span>af</span>
              <Link to={`/user/${post.author.username}`} className="hover:underline">
                {post.author.username}
              </Link>
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>

            {/* Title */}
            <h1 className="text-xl font-semibold text-gray-900 mb-3">
              {post.title}
            </h1>


            {/* Post Content Based on Type */}
            {post.type === 'text' && post.content && (
              <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
              </div>
            )}

            {post.type === 'link' && post.url && (
              <div className="mb-4">
                <a 
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {post.url}
                </a>
              </div>
            )}

            {post.type === 'image' && post.url && (
              <div className="mb-4">
                <img 
                  src={post.url} 
                  alt={post.title}
                  className="max-w-full h-auto"
                />
              </div>
            )}

            {post.type === 'video' && post.url && (
              <div className="mb-4 bg-black">
                <video 
                  src={post.url}
                  controls
                  className="max-w-full h-auto"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MessageSquare size={16} />
              <span>{post.commentCount} kommentarer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection 
        comments={mockComments.filter(c => c.post.id === post.id)}
        commentCount={post.commentCount}
        isLocked={post.isLocked}
      />
    </div>
  );
};