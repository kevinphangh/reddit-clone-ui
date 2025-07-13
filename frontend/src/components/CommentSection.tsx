import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Comment } from './Comment';
import { Comment as CommentType } from '../types';

interface CommentSectionProps {
  comments: CommentType[];
  commentCount: number;
  isLocked?: boolean;
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  commentCount,
  isLocked = false,
  postId
}) => {
  const { isLoggedIn } = useAuth();
  const { createComment } = useData();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  return (
    <div className="mt-4">
      {/* Comment Form */}
      {!isLocked && isLoggedIn && (
        <div className="mb-4">
          {!showCommentForm ? (
            <div 
              onClick={() => setShowCommentForm(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-text text-sm text-gray-500 bg-white"
            >
              Skriv en kommentar...
            </div>
          ) : (
            <div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:border-blue-500"
                placeholder="Skriv en kommentar..."
                rows={4}
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button 
                  onClick={() => {
                    setShowCommentForm(false);
                    setCommentText('');
                  }}
                  className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Annuller
                </button>
                <button 
                  onClick={async () => {
                    if (commentText.trim()) {
                      setIsSubmitting(true);
                      try {
                        await createComment(postId, null, commentText.trim());
                        setCommentText('');
                        setShowCommentForm(false);
                      } catch (err) {
                        // Failed to create comment
                      } finally {
                        setIsSubmitting(false);
                      }
                    }
                  }}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={!commentText.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Sender...' : 'Send'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comments Header */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700">
          {commentCount === 0 ? 'Ingen kommentarer endnu' : `${commentCount} ${commentCount === 1 ? 'kommentar' : 'kommentarer'}`}
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map(comment => (
          <Comment 
            key={comment.id} 
            comment={comment}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
};