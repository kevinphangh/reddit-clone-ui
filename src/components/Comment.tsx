import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare, 
  MoreHorizontal,
  Share,
  Flag,
  Bookmark,
  Edit2,
  Trash2,
  Award,
  Shield,
  ChevronUp
} from 'lucide-react';
import { Comment as CommentType } from '../types';
import { formatTimeAgo, formatScore } from '../utils/formatting';
import { clsx } from 'clsx';

interface CommentProps {
  comment: CommentType;
  depth?: number;
  maxDepth?: number;
  onReply?: (commentId: string) => void;
}

export const Comment: React.FC<CommentProps> = ({ 
  comment, 
  depth = 0,
  maxDepth = 10,
  onReply
}) => {
  const [vote, setVote] = useState(comment.userVote || 0);
  const [saved, setSaved] = useState(comment.saved || false);
  const [collapsed, setCollapsed] = useState(comment.isCollapsed || false);
  const [showActions, setShowActions] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleVote = (direction: 1 | -1) => {
    if (vote === direction) {
      setVote(0);
    } else {
      setVote(direction);
    }
  };

  const currentScore = comment.score + (vote - (comment.userVote || 0));

  if (comment.isDeleted) {
    return (
      <div className={clsx('relative', depth > 0 && 'ml-4')}>
        {depth > 0 && depth < maxDepth && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 ml-2"></div>
        )}
        <div className="pl-4 py-2 text-gray-500 text-sm italic">
          [slettet]
        </div>
      </div>
    );
  }

  if (comment.isRemoved) {
    return (
      <div className={clsx('relative', depth > 0 && 'ml-4')}>
        {depth > 0 && depth < maxDepth && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 ml-2"></div>
        )}
        <div className="pl-4 py-2 text-gray-500 text-sm italic">
          [fjernet]
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('relative', depth > 0 && 'ml-4')}>
      {/* Thread Line */}
      {depth > 0 && depth < maxDepth && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 ml-2"
          aria-label={collapsed ? 'Expand thread' : 'Collapse thread'}
        />
      )}

      {/* Comment Content */}
      <div className={clsx('pl-4', depth === 0 && 'border-l-2 border-transparent')}>
        {/* Header */}
        <div className="flex items-center gap-2 text-xs mb-1">
          {comment.isStickied && (
            <span className="text-green-600 font-bold">FASTGJORT KOMMENTAR</span>
          )}
          
          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-0.5 hover:bg-gray-100 rounded"
          >
            <ChevronUp 
              size={12} 
              className={clsx(
                'transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </button>

          {/* Author */}
          <Link 
            to={`/user/${comment.author.username}`} 
            className={clsx(
              'font-medium hover:underline',
              comment.author.username === '[deleted]' && 'text-gray-500'
            )}
          >
            {comment.author.username}
          </Link>

          {/* Author Badges */}
          {comment.author.isPremium && (
            <span className="text-orange-500" title="VIA Plus medlem">
              <Award size={12} />
            </span>
          )}
          {comment.author.isVerified && (
            <span className="text-blue-600" title="Verificeret pædagog">
              <Shield size={12} />
            </span>
          )}

          {/* Score */}
          <span className={clsx(
            'font-bold',
            vote === 1 && 'text-orange-500',
            vote === -1 && 'text-blue-600'
          )}>
            {formatScore(currentScore)} {currentScore === 1 ? 'point' : 'point'}
          </span>

          {/* Time */}
          <span className="text-gray-500">
            {formatTimeAgo(comment.createdAt)}
          </span>
          
          {comment.editedAt && (
            <span className="text-gray-500">(redigeret)</span>
          )}

          {/* Awards */}
          {comment.awards.length > 0 && (
            <div className="flex items-center gap-0.5">
              {comment.awards.map((award, index) => (
                <div key={index} className="flex items-center">
                  <img 
                    src={award.icon} 
                    alt={award.name}
                    className="w-3 h-3"
                    title={award.description}
                  />
                  {award.count > 1 && (
                    <span className="text-[10px] font-bold">{award.count}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comment Body */}
        {!collapsed && (
          <>
            <div className="text-sm mb-2 whitespace-pre-wrap break-words">
              {comment.body}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 -ml-1">
              {/* Vote Buttons */}
              <button 
                onClick={() => handleVote(1)}
                className={clsx('p-1 rounded hover:bg-gray-100', vote === 1 && 'text-orange-500')}
                aria-label="Upvote"
              >
                <ArrowUp size={16} />
              </button>
              <button 
                onClick={() => handleVote(-1)}
                className={clsx('p-1 rounded hover:bg-gray-100', vote === -1 && 'text-blue-600')}
                aria-label="Downvote"
              >
                <ArrowDown size={16} />
              </button>

              {/* Reply */}
              {!comment.isLocked && depth < maxDepth && (
                <button 
                  onClick={() => {
                    setShowReplyForm(!showReplyForm);
                    onReply?.(comment.id);
                  }}
                  className="text-xs font-bold text-gray-500 hover:bg-gray-100 px-2 py-1 rounded"
                >
                  <MessageSquare size={14} className="inline mr-1" />
                  Svar
                </button>
              )}

              {/* Share */}
              <button className="text-xs font-bold text-gray-500 hover:bg-gray-100 px-2 py-1 rounded">
                <Share size={14} className="inline mr-1" />
                Del
              </button>

              {/* Save */}
              <button 
                onClick={() => setSaved(!saved)}
                className={clsx(
                  'text-xs font-bold hover:bg-gray-100 px-2 py-1 rounded',
                  saved ? 'text-green-600' : 'text-gray-500'
                )}
              >
                <Bookmark size={14} className="inline mr-1" fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Gemt' : 'Gem'}
              </button>

              {/* More Options */}
              <div className="relative">
                <button 
                  onClick={() => setShowActions(!showActions)}
                  className="text-gray-500 hover:bg-gray-100 p-1 rounded"
                >
                  <MoreHorizontal size={16} />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                      <Edit2 size={14} />
                      Rediger
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                      <Trash2 size={14} />
                      Slet
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                      <Flag size={14} />
                      Anmeld
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-3 mb-3">
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Hvad tænker du?"
                  rows={4}
                />
                <div className="flex gap-2 mt-2">
                  <button className="bg-blue-600 text-white rounded hover:bg-blue-700 text-xs px-4 py-1.5">
                    Svar
                  </button>
                  <button 
                    onClick={() => setShowReplyForm(false)}
                    className="border border-gray-300 rounded hover:bg-gray-50 text-xs px-4 py-1.5"
                  >
                    Annuller
                  </button>
                </div>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies.length > 0 && (
              <div className="mt-3">
                {comment.replies.map(reply => (
                  <Comment 
                    key={reply.id} 
                    comment={reply} 
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    onReply={onReply}
                  />
                ))}
              </div>
            )}

            {/* Continue Thread Link */}
            {depth >= maxDepth && comment.replies.length > 0 && (
              <Link 
                to={`/r/${comment.post.subreddit.name}/comments/${comment.post.id}?thread=${comment.id}`}
                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
              >
                Fortsæt denne tråd →
              </Link>
            )}
          </>
        )}

        {/* Collapsed State */}
        {collapsed && (
          <div className="text-xs text-gray-500">
            {comment.replies.length > 0 && (
              <span>{comment.replies.length} {comment.replies.length === 1 ? 'svar mere' : 'svar mere'}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};