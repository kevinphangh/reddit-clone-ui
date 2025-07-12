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
          <div className="comment-thread-line ml-2"></div>
        )}
        <div className="pl-4 py-2 text-reddit-gray text-sm italic">
          [deleted]
        </div>
      </div>
    );
  }

  if (comment.isRemoved) {
    return (
      <div className={clsx('relative', depth > 0 && 'ml-4')}>
        {depth > 0 && depth < maxDepth && (
          <div className="comment-thread-line ml-2"></div>
        )}
        <div className="pl-4 py-2 text-reddit-gray text-sm italic">
          [removed]
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
          className="comment-thread-line ml-2"
          aria-label={collapsed ? 'Expand thread' : 'Collapse thread'}
        />
      )}

      {/* Comment Content */}
      <div className={clsx('pl-4', depth === 0 && 'border-l-2 border-transparent')}>
        {/* Header */}
        <div className="flex items-center gap-2 text-xs mb-1">
          {comment.isStickied && (
            <span className="text-reddit-green font-bold">STICKIED COMMENT</span>
          )}
          
          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-0.5 hover:bg-reddit-bg-hover rounded"
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
              comment.author.username === '[deleted]' && 'text-reddit-gray'
            )}
          >
            {comment.author.username}
          </Link>

          {/* Author Badges */}
          {comment.author.isPremium && (
            <span className="text-reddit-orange" title="Reddit Premium">
              <Award size={12} />
            </span>
          )}

          {/* Score */}
          <span className={clsx(
            'font-bold',
            vote === 1 && 'text-reddit-orange',
            vote === -1 && 'text-reddit-blue'
          )}>
            {formatScore(currentScore)} {currentScore === 1 ? 'point' : 'points'}
          </span>

          {/* Time */}
          <span className="text-reddit-gray">
            {formatTimeAgo(comment.createdAt)}
          </span>
          
          {comment.editedAt && (
            <span className="text-reddit-gray">(edited)</span>
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
                className={clsx('vote-button', vote === 1 && 'upvoted')}
                aria-label="Upvote"
              >
                <ArrowUp size={16} />
              </button>
              <button 
                onClick={() => handleVote(-1)}
                className={clsx('vote-button', vote === -1 && 'downvoted')}
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
                  className="text-xs font-bold text-reddit-gray hover:bg-reddit-bg-hover px-2 py-1 rounded"
                >
                  <MessageSquare size={14} className="inline mr-1" />
                  Reply
                </button>
              )}

              {/* Share */}
              <button className="text-xs font-bold text-reddit-gray hover:bg-reddit-bg-hover px-2 py-1 rounded">
                <Share size={14} className="inline mr-1" />
                Share
              </button>

              {/* Save */}
              <button 
                onClick={() => setSaved(!saved)}
                className={clsx(
                  'text-xs font-bold hover:bg-reddit-bg-hover px-2 py-1 rounded',
                  saved ? 'text-reddit-green' : 'text-reddit-gray'
                )}
              >
                <Bookmark size={14} className="inline mr-1" fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save'}
              </button>

              {/* More Options */}
              <div className="relative">
                <button 
                  onClick={() => setShowActions(!showActions)}
                  className="text-reddit-gray hover:bg-reddit-bg-hover p-1 rounded"
                >
                  <MoreHorizontal size={16} />
                </button>
                
                {showActions && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item flex items-center gap-2">
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button className="dropdown-item flex items-center gap-2">
                      <Trash2 size={14} />
                      Delete
                    </button>
                    <button className="dropdown-item flex items-center gap-2">
                      <Flag size={14} />
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-3 mb-3">
                <textarea 
                  className="reddit-textarea text-sm"
                  placeholder="What are your thoughts?"
                  rows={4}
                />
                <div className="flex gap-2 mt-2">
                  <button className="btn-primary text-xs px-4 py-1.5">
                    Reply
                  </button>
                  <button 
                    onClick={() => setShowReplyForm(false)}
                    className="btn-ghost text-xs px-4 py-1.5"
                  >
                    Cancel
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
                className="text-xs text-reddit-blue hover:underline mt-2 inline-block"
              >
                Continue this thread →
              </Link>
            )}
          </>
        )}

        {/* Collapsed State */}
        {collapsed && (
          <div className="text-xs text-reddit-gray">
            {comment.replies.length > 0 && (
              <span>{comment.replies.length} more {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};