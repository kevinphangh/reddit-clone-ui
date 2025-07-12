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
  BarChart3,
  FileText,
  Clock,
  User,
  Shield,
  Award,
  TrendingUp
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
        return <ExternalLink size={16} className="text-via-blue" />;
      case 'image':
        return <ImageIcon size={16} className="text-via-green" />;
      case 'video':
        return <Play size={16} className="text-via-red" />;
      case 'poll':
        return <BarChart3 size={16} className="text-via-orange" />;
      case 'text':
        return <FileText size={16} className="text-via-secondary" />;
      default:
        return <FileText size={16} className="text-via-gray" />;
    }
  };

  const PostThumbnail = () => {
    if (view === 'compact') return null;
    
    if (post.type === 'image' && post.url) {
      return (
        <div className="relative w-[140px] h-[100px] flex-shrink-0 overflow-hidden rounded-xl border border-via-lightGray shadow-sm group">
          <img 
            src={post.url} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {post.isNSFW && (
            <div className="absolute inset-0 bg-via-red/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center text-white">
                <span className="text-sm font-bold block">NSFW</span>
              </div>
            </div>
          )}
          {post.isSpoiler && (
            <div className="absolute inset-0 bg-via-darkGray/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center text-white">
                <span className="text-sm font-bold block">SPOILER</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (post.type === 'link' && post.url) {
      return (
        <div className="w-[70px] h-[70px] flex-shrink-0 border border-via-lightGray rounded-xl overflow-hidden bg-gradient-to-br from-via-blue/10 to-via-secondary/10 group hover:shadow-md transition-all duration-300">
          <div className="w-full h-full flex items-center justify-center">
            <ExternalLink size={24} className="text-via-blue group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      );
    }
    
    if (post.type === 'video' && post.url) {
      return (
        <div className="w-[70px] h-[70px] flex-shrink-0 border border-via-lightGray rounded-xl overflow-hidden bg-gradient-to-br from-via-red/10 to-via-orange/10 group hover:shadow-md transition-all duration-300">
          <div className="w-full h-full flex items-center justify-center">
            <Play size={24} className="text-via-red group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (view === 'compact') {
    return (
      <div className="bg-white rounded-xl border border-via-lightGray hover:border-via-blue/30 hover:shadow-md transition-all duration-300 group">
        <div className="flex items-center p-4 gap-3">
          {/* Vote Buttons */}
          <div className="flex flex-col items-center gap-1 bg-gradient-to-b from-via-lightGray/30 to-via-lightGray/10 rounded-lg p-2">
            <button 
              onClick={() => handleVote(1)}
              className={clsx(
                'p-1.5 rounded-lg transition-all duration-200 hover:scale-110',
                vote === 1 ? 'bg-via-orange text-white shadow-sm' : 'hover:bg-via-orange/10 text-via-gray hover:text-via-orange'
              )}
              aria-label="Upvote"
            >
              <ArrowUp size={16} />
            </button>
            <span className={clsx(
              'text-sm font-bold min-w-[32px] text-center',
              vote === 1 && 'text-via-orange',
              vote === -1 && 'text-via-blue'
            )}>
              {formatScore(currentScore)}
            </span>
            <button 
              onClick={() => handleVote(-1)}
              className={clsx(
                'p-1.5 rounded-lg transition-all duration-200 hover:scale-110',
                vote === -1 ? 'bg-via-blue text-white shadow-sm' : 'hover:bg-via-blue/10 text-via-gray hover:text-via-blue'
              )}
              aria-label="Downvote"
            >
              <ArrowDown size={16} />
            </button>
          </div>

          {/* Post Type Badge */}
          <div className="flex items-center justify-center w-8 h-8 bg-via-secondary/10 rounded-lg">
            <PostTypeIcon />
          </div>

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
                  <span className="text-xs font-bold text-via-red">NSFW</span>
                )}
                {post.isSpoiler && (
                  <span className="text-xs font-bold text-via-gray">SPOILER</span>
                )}
                {post.isOC && (
                  <span className="text-xs font-bold text-via-blue">OC</span>
                )}
              </div>
            </div>
            
            {/* Meta */}
            <div className="flex items-center gap-1 text-xs text-via-gray">
              {!hideSubreddit && (
                <>
                  <Link to={`/r/${post.subreddit.name}`} className="font-bold hover:underline">
                    r/{post.subreddit.name}
                  </Link>
                  <span>•</span>
                </>
              )}
              <span>Skrevet af</span>
              <Link to={`/user/${post.author.username}`} className="hover:underline">
                u/{post.author.username}
              </Link>
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.editedAt && <span>(redigeret)</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link 
              to={`/r/${post.subreddit.name}/comments/${post.id}`}
              className="flex items-center gap-1 text-xs text-via-gray hover:bg-via-bg-hover p-1 rounded"
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
      'bg-white rounded-xl border border-via-lightGray hover:border-via-blue/30 hover:shadow-lg transition-all duration-300 group overflow-hidden',
      view === 'classic' && 'flex'
    )}>
      {/* Classic View Vote Section */}
      {view === 'classic' && (
        <div className="flex flex-col items-center p-4 bg-gradient-to-b from-via-lightGray/20 to-via-lightGray/10">
          <button 
            onClick={() => handleVote(1)}
            className={clsx(
              'p-2 rounded-lg transition-all duration-200 hover:scale-110',
              vote === 1 ? 'bg-via-orange text-white shadow-md' : 'hover:bg-via-orange/10 text-via-gray hover:text-via-orange'
            )}
            aria-label="Upvote"
          >
            <ArrowUp size={20} />
          </button>
          <span className={clsx(
            'text-sm font-bold my-2 px-2 py-1 rounded bg-white shadow-sm min-w-[40px] text-center',
            vote === 1 && 'text-via-orange border border-via-orange/20',
            vote === -1 && 'text-via-blue border border-via-blue/20',
            vote === 0 && 'text-via-gray border border-via-lightGray'
          )}>
            {formatScore(currentScore)}
          </span>
          <button 
            onClick={() => handleVote(-1)}
            className={clsx(
              'p-2 rounded-lg transition-all duration-200 hover:scale-110',
              vote === -1 ? 'bg-via-blue text-white shadow-md' : 'hover:bg-via-blue/10 text-via-gray hover:text-via-blue'
            )}
            aria-label="Downvote"
          >
            <ArrowDown size={20} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex gap-4">
          {/* Thumbnail */}
          {view === 'classic' && <PostThumbnail />}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Meta Info */}
            <div className="flex items-center gap-2 text-sm text-via-gray mb-3">
              {!hideSubreddit && (
                <>
                  <Link 
                    to={`/r/${post.subreddit.name}`} 
                    className="flex items-center gap-1.5 font-semibold text-via-blue hover:text-via-darkBlue transition-colors"
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-via-blue to-via-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{post.subreddit.name.charAt(0).toUpperCase()}</span>
                    </div>
                    {post.subreddit.name}
                  </Link>
                  <span className="text-via-lightGray">•</span>
                </>
              )}
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-via-gray" />
                <Link to={`/user/${post.author.username}`} className="hover:text-via-blue transition-colors font-medium">
                  {post.author.username}
                </Link>
                {post.author.isVerified && (
                  <Shield size={12} className="text-via-green" />
                )}
              </div>
              <span className="text-via-lightGray">•</span>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-via-gray" />
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
              {post.editedAt && (
                <>
                  <span className="text-via-lightGray">•</span>
                  <span className="italic">(redigeret)</span>
                </>
              )}
              {post.isPinned && (
                <>
                  <span className="text-via-lightGray">•</span>
                  <div className="flex items-center gap-1 px-2 py-1 bg-via-green/10 rounded-full">
                    <TrendingUp size={12} className="text-via-green" />
                    <span className="text-via-green font-semibold text-xs">FASTGJORT</span>
                  </div>
                </>
              )}
            </div>

            {/* Title and Flairs */}
            <div className="mb-3">
              <h3 className="mb-2">
                <Link 
                  to={`/r/${post.subreddit.name}/comments/${post.id}`}
                  className="text-xl font-semibold text-via-black hover:text-via-blue transition-colors leading-tight group-hover:text-via-blue"
                >
                  {post.title}
                </Link>
              </h3>
              
              {/* Flairs */}
              <div className="flex items-center gap-2">
                {post.flair && (
                  <span 
                    className="text-xs px-3 py-1 rounded-full font-medium shadow-sm"
                    style={{ 
                      backgroundColor: post.flair.backgroundColor, 
                      color: post.flair.textColor 
                    }}
                  >
                    {post.flair.text}
                  </span>
                )}
                {post.isNSFW && (
                  <span className="text-xs px-3 py-1 bg-via-red/10 text-via-red rounded-full font-semibold border border-via-red/20">
                    NSFW
                  </span>
                )}
                {post.isSpoiler && (
                  <span className="text-xs px-3 py-1 bg-via-darkGray/10 text-via-darkGray rounded-full font-semibold border border-via-darkGray/20">
                    SPOILER
                  </span>
                )}
              </div>
            </div>


            {/* Awards */}
            {post.awards.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-via-orange/10 rounded-lg border border-via-orange/20">
                  <Award size={16} className="text-via-orange" />
                  <span className="text-sm font-semibold text-via-orange">{post.awards.length} Awards</span>
                </div>
                {post.awards.slice(0, 3).map((award, index) => (
                  <div key={index} className="flex items-center gap-1 px-2 py-1 bg-white border border-via-lightGray rounded-lg shadow-sm">
                    <img 
                      src={award.icon} 
                      alt={award.name}
                      className="w-4 h-4"
                      title={award.description}
                    />
                    {award.count > 1 && (
                      <span className="text-xs font-bold text-via-gray">{award.count}</span>
                    )}
                  </div>
                ))}
                {post.awards.length > 3 && (
                  <span className="text-xs text-via-gray font-medium">+{post.awards.length - 3} mere</span>
                )}
              </div>
            )}

            {/* Card View Content Preview */}
            {view === 'card' && (
              <>
                {/* Text Preview */}
                {post.type === 'text' && post.content && (
                  <div className="text-sm text-via-gray mb-4 p-4 bg-via-lightGray/10 rounded-lg border-l-4 border-via-blue/30 max-h-[250px] overflow-hidden">
                    <p className="leading-relaxed">
                      {post.content.substring(0, 500)}
                      {post.content.length > 500 && (
                        <span className="text-via-blue font-medium"> ...læs mere</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Image Preview */}
                {post.type === 'image' && post.url && (
                  <div className="mb-4 max-h-[512px] overflow-hidden rounded-xl border border-via-lightGray shadow-sm">
                    <img 
                      src={post.url} 
                      alt={post.title}
                      className="max-w-full h-auto transition-transform duration-300 hover:scale-105"
                    />
                    {post.isNSFW && (
                      <div className="absolute inset-0 bg-via-red/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="text-center text-white">
                          <span className="text-lg font-bold block">NSFW</span>
                          <span className="text-sm opacity-90">Klik for at se</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Video Preview */}
                {post.type === 'video' && post.url && (
                  <div className="mb-4 max-h-[512px] overflow-hidden bg-black rounded-xl border border-via-lightGray shadow-sm">
                    <video 
                      src={post.url}
                      controls
                      className="max-w-full h-auto"
                    />
                  </div>
                )}
                
                {/* External Link Preview */}
                {post.type === 'link' && post.url && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-via-blue/5 to-via-secondary/5 rounded-lg border border-via-blue/20">
                    <a 
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-via-blue hover:text-via-darkBlue transition-colors"
                    >
                      <div className="w-10 h-10 bg-via-blue/10 rounded-lg flex items-center justify-center">
                        <ExternalLink size={20} className="text-via-blue" />
                      </div>
                      <div>
                        <div className="font-medium">{getDomainFromUrl(post.url)}</div>
                        <div className="text-xs text-via-gray">Klik for at åbne ekstern side</div>
                      </div>
                    </a>
                  </div>
                )}
              </>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-via-lightGray/50">
              <div className="flex items-center gap-3">
                {/* Card View Vote Buttons */}
                {view === 'card' && (
                  <div className="flex items-center gap-2 bg-via-lightGray/20 rounded-lg p-2">
                    <button 
                      onClick={() => handleVote(1)}
                      className={clsx(
                        'p-2 rounded-lg transition-all duration-200 hover:scale-110',
                        vote === 1 ? 'bg-via-orange text-white shadow-md' : 'hover:bg-via-orange/20 text-via-gray hover:text-via-orange'
                      )}
                      aria-label="Upvote"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <span className={clsx(
                      'text-sm font-bold min-w-[40px] text-center px-2 py-1 rounded bg-white shadow-sm',
                      vote === 1 && 'text-via-orange border border-via-orange/20',
                      vote === -1 && 'text-via-blue border border-via-blue/20',
                      vote === 0 && 'text-via-gray border border-via-lightGray'
                    )}>
                      {formatScore(currentScore)}
                    </span>
                    <button 
                      onClick={() => handleVote(-1)}
                      className={clsx(
                        'p-2 rounded-lg transition-all duration-200 hover:scale-110',
                        vote === -1 ? 'bg-via-blue text-white shadow-md' : 'hover:bg-via-blue/20 text-via-gray hover:text-via-blue'
                      )}
                      aria-label="Downvote"
                    >
                      <ArrowDown size={18} />
                    </button>
                  </div>
                )}

                {/* Comments */}
                <Link 
                  to={`/r/${post.subreddit.name}/comments/${post.id}`}
                  className="flex items-center gap-2 text-sm text-via-gray hover:text-via-blue hover:bg-via-blue/10 px-3 py-2 rounded-lg transition-all duration-200"
                >
                  <MessageSquare size={18} />
                  <span className="font-medium">{post.commentCount}</span>
                </Link>

                {/* Share */}
                <button className="flex items-center gap-2 text-sm text-via-gray hover:text-via-secondary hover:bg-via-secondary/10 px-3 py-2 rounded-lg transition-all duration-200">
                  <Share size={18} />
                  <span className="font-medium">Del</span>
                </button>

                {/* Save */}
                <button 
                  onClick={() => setSaved(!saved)}
                  className={clsx(
                    'flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all duration-200',
                    saved ? 'text-via-green bg-via-green/10 hover:bg-via-green/20' : 'text-via-gray hover:text-via-green hover:bg-via-green/10'
                  )}
                >
                  <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
                  <span className="font-medium">{saved ? 'Gemt' : 'Gem'}</span>
                </button>
              </div>

              {/* Awards */}
              {post.awards.length > 0 && (
                <div className="flex items-center gap-1">
                  <Award size={16} className="text-via-orange" />
                  <span className="text-sm font-medium text-via-orange">{post.awards.length}</span>
                </div>
              )}
              
              {/* More Options */}
              <div className="relative">
                <button 
                  onClick={() => setShowActions(!showActions)}
                  className="text-via-gray hover:text-via-black hover:bg-via-lightGray/30 p-2 rounded-lg transition-all duration-200"
                >
                  <MoreHorizontal size={18} />
                </button>
                
                {showActions && (
                  <div className="dropdown-menu w-48">
                    <button 
                      onClick={() => setHidden(true)}
                      className="dropdown-item flex items-center gap-3 py-3"
                    >
                      <div className="w-8 h-8 bg-via-gray/10 rounded-lg flex items-center justify-center">
                        <EyeOff size={16} className="text-via-gray" />
                      </div>
                      <span>Skjul indlæg</span>
                    </button>
                    <button className="dropdown-item flex items-center gap-3 py-3">
                      <div className="w-8 h-8 bg-via-red/10 rounded-lg flex items-center justify-center">
                        <Flag size={16} className="text-via-red" />
                      </div>
                      <span>Anmeld</span>
                    </button>
                    {post.isCrosspost && (
                      <button className="dropdown-item flex items-center gap-3 py-3">
                        <div className="w-8 h-8 bg-via-blue/10 rounded-lg flex items-center justify-center">
                          <FileText size={16} className="text-via-blue" />
                        </div>
                        <span>Se original</span>
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