import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare,
  Clock
} from 'lucide-react';
import { Comment as CommentType } from '../types';
import { formatTimeAgo, formatScore } from '../utils/formatting';
import { clsx } from 'clsx';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useCommentCooldown } from '../contexts/CommentCooldownContext';
import { AdminActions } from './AdminActions';

interface CommentProps {
  comment: CommentType;
  depth?: number;
  maxDepth?: number;
}

export const Comment: React.FC<CommentProps> = ({ 
  comment, 
  depth = 0,
  maxDepth = 10
}) => {
  const { voteComment, createComment, updateComment, deleteComment } = useData();
  const { isLoggedIn, user } = useAuth();
  const { canComment, isInCooldown, remainingTime, startCooldown } = useCommentCooldown();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const isOwner = user?.username === comment.author.username && !comment.isDeleted;

  const handleVote = async (direction: 1 | -1) => {
    if (!isLoggedIn) {
      if (window.confirm('Du skal være logget ind for at stemme. Vil du logge ind nu?')) {
        window.location.href = '/login?from=' + window.location.pathname;
      }
      return;
    }
    try {
      await voteComment(String(comment.id), direction);
    } catch (err) {
      // Vote failed
      alert('Kunne ikke stemme. Prøv igen senere.');
    }
  };

  const handleEdit = () => {
    setEditText(comment.body);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editText.trim()) {
      try {
        await updateComment(String(comment.id), editText.trim());
        setIsEditing(false);
      } catch (err) {
        // Failed to update comment
        alert('Kunne ikke opdatere kommentar');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Er du sikker på at du vil slette denne kommentar?')) {
      try {
        await deleteComment(String(comment.id));
      } catch (err) {
        // Failed to delete comment
        alert('Kunne ikke slette kommentar');
      }
    }
  };

  if (comment.isDeleted) {
    return (
      <div className={clsx('relative', depth > 0 && 'ml-4')}>
        {depth > 0 && depth < maxDepth && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 ml-2"></div>
        )}
        <div className="pl-4 py-2 text-gray-500 text-body-small italic">
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
        <div className="pl-4 py-2 text-gray-500 text-body-small italic">
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
        <div className="flex items-center gap-2 text-caption mb-1 text-gray-500">
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
        {isEditing ? (
          <div className="mb-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-2 py-1 text-body-small border border-gray-300 rounded focus:outline-none focus:border-primary-500"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveEdit}
                className="text-button px-3 py-1 bg-primary-600 text-gray-900 rounded hover:bg-primary-700"
              >
                Gem
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-button px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                Annuller
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-700 text-body-small mb-2">
            {comment.body}
            {comment.editedAt && (
              <span className="text-caption text-gray-500 ml-2">(redigeret)</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Vote Buttons */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleVote(1)}
              className={clsx('p-1 rounded hover:bg-gray-100', comment.userVote === 1 ? 'text-gray-800' : 'text-gray-400')}
            >
              <ArrowUp size={16} />
            </button>
            <span className={clsx(
              'text-caption font-medium',
              comment.userVote === 1 ? 'text-gray-800' : comment.userVote === -1 ? 'text-red-700' : 'text-gray-600'
            )}>
              {formatScore(comment.score)}
            </span>
            <button 
              onClick={() => handleVote(-1)}
              className={clsx('p-1 rounded hover:bg-gray-100', comment.userVote === -1 ? 'text-red-500' : 'text-gray-400')}
            >
              <ArrowDown size={16} />
            </button>
          </div>

          {/* Reply */}
          {!comment.isLocked && depth < maxDepth && isLoggedIn && (
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-caption text-gray-500 hover:text-gray-700 disabled:opacity-50"
              disabled={isInCooldown}
            >
              <MessageSquare size={14} className="inline mr-1" />
              {isInCooldown ? `Svar (${remainingTime}s)` : 'Svar'}
            </button>
          )}

          {/* Edit/Delete */}
          {isOwner && !isEditing && (
            <>
              <button
                onClick={handleEdit}
                className="text-caption text-gray-500 hover:text-gray-700"
              >
                Rediger
              </button>
              <button
                onClick={handleDelete}
                className="text-caption text-red-600 hover:text-red-700"
              >
                Slet
              </button>
            </>
          )}
        </div>

        <AdminActions 
          item={comment} 
          type="comment" 
          onUpdate={() => window.location.reload()} 
        />

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-3">
            <textarea 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-primary-500 text-body-small"
              placeholder="Hvad synes du? Skriv et venligt svar..."
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              {isInCooldown && (
                <div className="flex items-center gap-1 text-caption text-gray-500 mr-auto">
                  <Clock size={12} />
                  Du kan svare igen om {remainingTime} sekunder
                </div>
              )}
              <button 
                onClick={async () => {
                  if (replyText.trim() && comment.post && canComment) {
                    setIsSubmitting(true);
                    try {
                      await createComment(String(comment.post.id), replyText.trim(), String(comment.id));
                      startCooldown();
                      setReplyText('');
                      setShowReplyForm(false);
                    } catch (err) {
                      // Failed to create reply
                      alert('Kunne ikke oprette svar. Prøv igen.');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }
                }}
                disabled={!replyText.trim() || isSubmitting || !canComment}
                className="text-button px-3 py-1 bg-primary-600 text-gray-900 rounded hover:bg-primary-700 disabled:opacity-50 flex items-center gap-1"
              >
                {isInCooldown && <Clock size={12} />}
                {isSubmitting ? 'Sender...' : isInCooldown ? `Vent ${remainingTime}s` : 'Send'}
              </button>
              <button 
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText('');
                }}
                className="text-button px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};