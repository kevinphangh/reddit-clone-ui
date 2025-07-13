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
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

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
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const isOwner = user?.username === comment.author.username && !comment.isDeleted;

  const handleVote = async (direction: 1 | -1) => {
    if (!isLoggedIn) {
      alert('Du skal være logget ind for at stemme');
      return;
    }
    try {
      await voteComment(String(comment.id), direction);
    } catch (err) {
      console.error('Vote failed:', err);
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
        console.error('Failed to update comment:', err);
        alert('Kunne ikke opdatere kommentar');
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Er du sikker på at du vil slette denne kommentar?')) {
      try {
        await deleteComment(String(comment.id));
      } catch (err) {
        console.error('Failed to delete comment:', err);
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
        {isEditing ? (
          <div className="mb-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveEdit}
                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Gem
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
              >
                Annuller
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-700 text-sm mb-2">
            {comment.body}
            {comment.editedAt && (
              <span className="text-xs text-gray-500 ml-2">(redigeret)</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Vote Buttons */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handleVote(1)}
              className={clsx('p-1 rounded hover:bg-gray-100', comment.userVote === 1 ? 'text-blue-600' : 'text-gray-400')}
            >
              <ArrowUp size={16} />
            </button>
            <span className={clsx(
              'text-xs font-medium',
              comment.userVote === 1 ? 'text-blue-600' : comment.userVote === -1 ? 'text-red-500' : 'text-gray-600'
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
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              <MessageSquare size={14} className="inline mr-1" />
              Svar
            </button>
          )}

          {/* Edit/Delete */}
          {isOwner && !isEditing && (
            <>
              <button
                onClick={handleEdit}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Rediger
              </button>
              <button
                onClick={handleDelete}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Slet
              </button>
            </>
          )}
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-3">
            <textarea 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500 text-sm"
              placeholder="Skriv et svar..."
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button 
                onClick={async () => {
                  if (replyText.trim() && comment.post) {
                    setIsSubmitting(true);
                    try {
                      await createComment(String(comment.post.id), replyText.trim(), String(comment.id));
                      setReplyText('');
                      setShowReplyForm(false);
                    } catch (err) {
                      console.error('Failed to create reply:', err);
                      alert('Kunne ikke oprette svar. Prøv igen.');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }
                }}
                disabled={!replyText.trim() || isSubmitting}
                className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Sender...' : 'Send'}
              </button>
              <button 
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText('');
                }}
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};