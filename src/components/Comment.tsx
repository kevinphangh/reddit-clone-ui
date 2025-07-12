import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare 
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
      {depth > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 ml-2" />
      )}

      {/* Comment Content */}
      <div className={clsx('pl-4', depth === 0 && 'border-l-2 border-transparent')}>
        {/* Header */}
        <div className="flex items-center gap-2 text-xs mb-1 text-gray-500">
          <Link 
            to={`/user/${comment.author.username}`} 
            className="font-medium text-gray-900 hover:underline"
          >
            {comment.author.username}
          </Link>
          <span>•</span>
          <span>{formatTimeAgo(comment.createdAt)}</span>
        </div>

        {/* Comment Body */}
        <div className="text-gray-700 text-sm mb-2">
          {comment.body}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Vote Buttons */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleVote(1)}
              className={clsx('p-1 rounded hover:bg-gray-100', vote === 1 ? 'text-blue-600' : 'text-gray-400')}
            >
              <ArrowUp size={16} />
            </button>
            <span className={clsx(
              'text-xs font-medium',
              vote === 1 ? 'text-blue-600' : vote === -1 ? 'text-red-500' : 'text-gray-600'
            )}>
              {formatScore(currentScore)}
            </span>
            <button 
              onClick={() => handleVote(-1)}
              className={clsx('p-1 rounded hover:bg-gray-100', vote === -1 ? 'text-red-500' : 'text-gray-400')}
            >
              <ArrowDown size={16} />
            </button>
          </div>

          {/* Reply */}
          {!comment.isLocked && depth < maxDepth && (
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              <MessageSquare size={14} className="inline mr-1" />
              Svar
            </button>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-3">
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500 text-sm"
              placeholder="Skriv et svar..."
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                Send
              </button>
              <button 
                onClick={() => setShowReplyForm(false)}
                className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                Annuller
              </button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
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
      </div>
    </div>
  );
};