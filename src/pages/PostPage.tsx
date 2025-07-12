import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Share, 
  Bookmark, 
  MoreHorizontal,
  Flag,
  Eye,
  EyeOff,
  Gift,
  ExternalLink
} from 'lucide-react';
import { CommentSection } from '../components/CommentSection';
import { mockPosts, mockComments } from '../data/mockData';
import { formatTimeAgo, formatScore, getDomainFromUrl } from '../utils/formatting';
import { clsx } from 'clsx';

export const PostPage: React.FC = () => {
  const { postId } = useParams();
  
  // Mock finding the post
  const post = mockPosts.find(p => p.id === postId);
  
  if (!post) {
    return (
      <div className="reddit-card p-8 text-center">
        <h1 className="text-xl font-bold mb-2">Post not found</h1>
        <p className="text-reddit-gray">The post you're looking for doesn't exist.</p>
      </div>
    );
  }

  const [vote, setVote] = useState(post.userVote || 0);
  const [saved, setSaved] = useState(post.saved || false);
  const [showActions, setShowActions] = useState(false);

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
      <div className="reddit-card mb-4">
        <div className="flex">
          {/* Vote Section */}
          <div className="flex flex-col items-center p-2 bg-reddit-bg-hover">
            <button 
              onClick={() => handleVote(1)}
              className={clsx('vote-button', vote === 1 && 'upvoted')}
              aria-label="Upvote"
            >
              <ArrowUp size={24} />
            </button>
            <span className={clsx(
              'text-base font-bold my-1',
              vote === 1 && 'text-reddit-orange',
              vote === -1 && 'text-reddit-blue'
            )}>
              {formatScore(currentScore)}
            </span>
            <button 
              onClick={() => handleVote(-1)}
              className={clsx('vote-button', vote === -1 && 'downvoted')}
              aria-label="Downvote"
            >
              <ArrowDown size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3">
            {/* Meta Info */}
            <div className="flex items-center gap-1 text-xs text-reddit-gray mb-2">
              <Link to={`/r/${post.subreddit.name}`} className="font-bold hover:underline">
                r/{post.subreddit.name}
              </Link>
              <span>•</span>
              <span>Posted by</span>
              <Link to={`/user/${post.author.username}`} className="hover:underline">
                u/{post.author.username}
              </Link>
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.editedAt && <span>(edited)</span>}
              {post.isPinned && (
                <>
                  <span>•</span>
                  <span className="text-reddit-green font-bold">PINNED</span>
                </>
              )}
            </div>

            {/* Title and Flairs */}
            <h1 className="text-xl font-medium mb-2">
              {post.title}
              {' '}
              {post.flair && (
                <span 
                  className="text-sm px-2 py-0.5 rounded ml-2"
                  style={{ 
                    backgroundColor: post.flair.backgroundColor, 
                    color: post.flair.textColor 
                  }}
                >
                  {post.flair.text}
                </span>
              )}
              {post.isNSFW && (
                <span className="text-sm font-bold text-reddit-red ml-2">NSFW</span>
              )}
              {post.isSpoiler && (
                <span className="text-sm font-bold text-reddit-gray ml-2">SPOILER</span>
              )}
              {post.isOC && (
                <span className="text-sm font-bold text-reddit-blue ml-2">OC</span>
              )}
            </h1>

            {/* Awards */}
            {post.awards.length > 0 && (
              <div className="flex items-center gap-1 mb-3">
                {post.awards.map((award, index) => (
                  <div key={index} className="flex items-center">
                    <img 
                      src={award.icon} 
                      alt={award.name}
                      className="w-5 h-5"
                      title={award.description}
                    />
                    {award.count > 1 && (
                      <span className="text-xs font-bold ml-0.5">{award.count}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Post Content Based on Type */}
            {post.type === 'text' && post.content && (
              <div className="text-sm mb-4 whitespace-pre-wrap">
                {post.content}
              </div>
            )}

            {post.type === 'link' && post.url && (
              <div className="mb-4">
                <a 
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-reddit-blue hover:underline inline-flex items-center gap-1"
                >
                  {getDomainFromUrl(post.url)}
                  <ExternalLink size={14} />
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
            <div className="flex items-center gap-3 text-sm">
              <button className="flex items-center gap-1 text-reddit-gray hover:bg-reddit-bg-hover px-2 py-1 rounded font-bold">
                <MessageSquare size={20} />
                {post.commentCount} Comments
              </button>

              <button className="flex items-center gap-1 text-reddit-gray hover:bg-reddit-bg-hover px-2 py-1 rounded font-bold">
                <Gift size={20} />
                Award
              </button>

              <button className="flex items-center gap-1 text-reddit-gray hover:bg-reddit-bg-hover px-2 py-1 rounded font-bold">
                <Share size={20} />
                Share
              </button>

              <button 
                onClick={() => setSaved(!saved)}
                className={clsx(
                  'flex items-center gap-1 hover:bg-reddit-bg-hover px-2 py-1 rounded font-bold',
                  saved ? 'text-reddit-green' : 'text-reddit-gray'
                )}
              >
                <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save'}
              </button>

              {/* More Options */}
              <div className="relative">
                <button 
                  onClick={() => setShowActions(!showActions)}
                  className="text-reddit-gray hover:bg-reddit-bg-hover p-1 rounded"
                >
                  <MoreHorizontal size={20} />
                </button>
                
                {showActions && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item flex items-center gap-2">
                      <Eye size={16} />
                      Show fewer posts like this
                    </button>
                    <button className="dropdown-item flex items-center gap-2">
                      <EyeOff size={16} />
                      Hide
                    </button>
                    <button className="dropdown-item flex items-center gap-2">
                      <Flag size={16} />
                      Report
                    </button>
                  </div>
                )}
              </div>

              {/* Upvote Percentage */}
              <div className="ml-auto text-xs text-reddit-gray">
                {Math.round(post.upvoteRatio * 100)}% Upvoted
              </div>
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