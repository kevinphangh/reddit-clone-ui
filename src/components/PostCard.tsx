import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  Share, 
  Bookmark, 
  MoreHorizontal,
  EyeOff,
  Flag,
  ExternalLink,
  Image as ImageIcon,
  Play,
  FileText,
  BarChart3
} from 'lucide-react';
import { Post } from '../types';
import { formatTimeAgo, formatScore, getDomainFromUrl } from '../utils/formatting';
import { clsx } from 'clsx';

interface PostCardProps {
  post: Post;
  view?: 'card' | 'classic' | 'compact';
  hideSubreddit?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  view = 'card',
  hideSubreddit = false 
}) => {
  const [vote, setVote] = useState(post.userVote || 0);
  const [saved, setSaved] = useState(post.saved || false);
  const [hidden, setHidden] = useState(post.hidden || false);
  const [showActions, setShowActions] = useState(false);

  const handleVote = (direction: 1 | -1) => {
    if (vote === direction) {
      setVote(0);
    } else {
      setVote(direction);
    }
  };

  const currentScore = post.score + (vote - (post.userVote || 0));

  if (hidden) return null;

  const PostTypeIcon = () => {
    switch (post.type) {
      case 'link':
        return <ExternalLink size={16} className="text-reddit-gray" />;
      case 'image':
        return <ImageIcon size={16} className="text-reddit-gray" />;
      case 'video':
        return <Play size={16} className="text-reddit-gray" />;
      case 'poll':
        return <BarChart3 size={16} className="text-reddit-gray" />;
      default:
        return null;
    }
  };

  const PostThumbnail = () => {
    if (view === 'compact') return null;
    
    if (post.type === 'image' && post.url) {
      return (
        <div className="relative w-[140px] h-[100px] flex-shrink-0 overflow-hidden rounded">
          <img 
            src={post.url} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          {post.isNSFW && (
            <div className="absolute inset-0 bg-reddit-red bg-opacity-90 flex items-center justify-center">
              <span className="text-white font-bold">NSFW</span>
            </div>
          )}
          {post.isSpoiler && (
            <div className="absolute inset-0 bg-reddit-darkGray bg-opacity-90 flex items-center justify-center">
              <span className="text-white font-bold">SPOILER</span>
            </div>
          )}
        </div>
      );
    }
    
    if (post.type === 'link' && post.url) {
      return (
        <div className="w-[70px] h-[70px] flex-shrink-0 border border-reddit-lightGray rounded overflow-hidden">
          <div className="w-full h-full bg-reddit-bg-hover flex items-center justify-center">
            <ExternalLink size={24} className="text-reddit-gray" />
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (view === 'compact') {
    return (
      <div className="reddit-card hover:border-reddit-gray">
        <div className="flex items-center p-2 gap-2">
          {/* Vote Buttons */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleVote(1)}
              className={clsx('vote-button', vote === 1 && 'upvoted')}
              aria-label="Upvote"
            >
              <ArrowUp size={16} />
            </button>
            <span className={clsx(
              'text-xs font-bold min-w-[40px] text-center',
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
              <ArrowDown size={16} />
            </button>
          </div>

          {/* Post Icon */}
          <PostTypeIcon />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 flex-wrap">
              <Link 
                to={`/r/${post.subreddit.name}/comments/${post.id}`}
                className="text-sm hover:underline"
              >
                <span className="font-medium">{post.title}</span>
              </Link>
              
              {/* Flairs */}
              <div className="flex items-center gap-1">
                {post.flair && (
                  <span 
                    className="text-xs px-2 py-0.5 rounded"
                    style={{ 
                      backgroundColor: post.flair.backgroundColor, 
                      color: post.flair.textColor 
                    }}
                  >
                    {post.flair.text}
                  </span>
                )}
                {post.isNSFW && (
                  <span className="text-xs font-bold text-reddit-red">NSFW</span>
                )}
                {post.isSpoiler && (
                  <span className="text-xs font-bold text-reddit-gray">SPOILER</span>
                )}
                {post.isOC && (
                  <span className="text-xs font-bold text-reddit-blue">OC</span>
                )}
              </div>
            </div>
            
            {/* Meta */}
            <div className="flex items-center gap-1 text-xs text-reddit-gray">
              {!hideSubreddit && (
                <>
                  <Link to={`/r/${post.subreddit.name}`} className="font-bold hover:underline">
                    r/{post.subreddit.name}
                  </Link>
                  <span>•</span>
                </>
              )}
              <span>Posted by</span>
              <Link to={`/user/${post.author.username}`} className="hover:underline">
                u/{post.author.username}
              </Link>
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.editedAt && <span>(edited)</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link 
              to={`/r/${post.subreddit.name}/comments/${post.id}`}
              className="flex items-center gap-1 text-xs text-reddit-gray hover:bg-reddit-bg-hover p-1 rounded"
            >
              <MessageSquare size={16} />
              <span>{post.commentCount}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      'reddit-card hover:border-reddit-gray',
      view === 'classic' && 'flex'
    )}>
      {/* Classic View Vote Section */}
      {view === 'classic' && (
        <div className="flex flex-col items-center p-2 bg-reddit-bg-hover">
          <button 
            onClick={() => handleVote(1)}
            className={clsx('vote-button', vote === 1 && 'upvoted')}
            aria-label="Upvote"
          >
            <ArrowUp size={20} />
          </button>
          <span className={clsx(
            'text-xs font-bold my-1',
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
            <ArrowDown size={20} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-2">
        <div className="flex gap-3">
          {/* Thumbnail */}
          {view === 'classic' && <PostThumbnail />}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Meta Info */}
            <div className="flex items-center gap-1 text-xs text-reddit-gray mb-1">
              {!hideSubreddit && (
                <>
                  <Link to={`/r/${post.subreddit.name}`} className="font-bold hover:underline">
                    r/{post.subreddit.name}
                  </Link>
                  <span>•</span>
                </>
              )}
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
            <h3 className="mb-1">
              <Link 
                to={`/r/${post.subreddit.name}/comments/${post.id}`}
                className="text-lg font-medium hover:underline inline"
              >
                {post.title}
              </Link>
              {' '}
              {/* Inline Flairs */}
              {post.flair && (
                <span 
                  className="text-xs px-2 py-0.5 rounded ml-2"
                  style={{ 
                    backgroundColor: post.flair.backgroundColor, 
                    color: post.flair.textColor 
                  }}
                >
                  {post.flair.text}
                </span>
              )}
              {post.isNSFW && (
                <span className="text-xs font-bold text-reddit-red ml-2">NSFW</span>
              )}
              {post.isSpoiler && (
                <span className="text-xs font-bold text-reddit-gray ml-2">SPOILER</span>
              )}
              {post.isOC && (
                <span className="text-xs font-bold text-reddit-blue ml-2">OC</span>
              )}
            </h3>

            {/* External Link */}
            {post.type === 'link' && post.url && (
              <a 
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-reddit-blue hover:underline inline-flex items-center gap-1 mb-2"
              >
                {getDomainFromUrl(post.url)}
                <ExternalLink size={12} />
              </a>
            )}

            {/* Awards */}
            {post.awards.length > 0 && (
              <div className="flex items-center gap-1 mb-2">
                {post.awards.map((award, index) => (
                  <div key={index} className="flex items-center">
                    <img 
                      src={award.icon} 
                      alt={award.name}
                      className="w-4 h-4"
                      title={award.description}
                    />
                    {award.count > 1 && (
                      <span className="text-xs font-bold ml-0.5">{award.count}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Card View Content Preview */}
            {view === 'card' && (
              <>
                {/* Text Preview */}
                {post.type === 'text' && post.content && (
                  <div className="text-sm text-reddit-gray mb-2 max-h-[250px] overflow-hidden">
                    {post.content.substring(0, 500)}
                    {post.content.length > 500 && '...'}
                  </div>
                )}

                {/* Image Preview */}
                {post.type === 'image' && post.url && (
                  <div className="mb-2 max-h-[512px] overflow-hidden">
                    <img 
                      src={post.url} 
                      alt={post.title}
                      className="max-w-full h-auto rounded"
                    />
                  </div>
                )}

                {/* Video Preview */}
                {post.type === 'video' && post.url && (
                  <div className="mb-2 max-h-[512px] overflow-hidden bg-black rounded">
                    <video 
                      src={post.url}
                      controls
                      className="max-w-full h-auto"
                    />
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2">
              {/* Card View Vote Buttons */}
              {view === 'card' && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => handleVote(1)}
                    className={clsx('vote-button', vote === 1 && 'upvoted')}
                    aria-label="Upvote"
                  >
                    <ArrowUp size={20} />
                  </button>
                  <span className={clsx(
                    'text-xs font-bold',
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
                    <ArrowDown size={20} />
                  </button>
                </div>
              )}

              {/* Comments */}
              <Link 
                to={`/r/${post.subreddit.name}/comments/${post.id}`}
                className="flex items-center gap-1 text-xs text-reddit-gray hover:bg-reddit-bg-hover px-2 py-1 rounded"
              >
                <MessageSquare size={20} />
                <span className="font-bold">{post.commentCount} Comments</span>
              </Link>

              {/* Share */}
              <button className="flex items-center gap-1 text-xs text-reddit-gray hover:bg-reddit-bg-hover px-2 py-1 rounded">
                <Share size={20} />
                <span className="font-bold">Share</span>
              </button>

              {/* Save */}
              <button 
                onClick={() => setSaved(!saved)}
                className={clsx(
                  'flex items-center gap-1 text-xs hover:bg-reddit-bg-hover px-2 py-1 rounded',
                  saved ? 'text-reddit-green' : 'text-reddit-gray'
                )}
              >
                <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
                <span className="font-bold">{saved ? 'Saved' : 'Save'}</span>
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
                    <button 
                      onClick={() => setHidden(true)}
                      className="dropdown-item flex items-center gap-2"
                    >
                      <EyeOff size={16} />
                      Hide
                    </button>
                    <button className="dropdown-item flex items-center gap-2">
                      <Flag size={16} />
                      Report
                    </button>
                    {post.isCrosspost && (
                      <button className="dropdown-item flex items-center gap-2">
                        <FileText size={16} />
                        View Original
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};