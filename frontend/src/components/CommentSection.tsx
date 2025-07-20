import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useCommentCooldown } from '../contexts/CommentCooldownContext';
import { Comment } from './Comment';
import { Comment as CommentType } from '../types';
import { Clock } from 'lucide-react';

interface CommentSectionProps {
  comments: CommentType[];
  commentCount: number;
  isLocked?: boolean;
  postId: string;
  isLoading?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  commentCount,
  isLocked = false,
  postId,
  isLoading = false
}) => {
  const { isLoggedIn } = useAuth();
  const { createComment } = useData();
  const { canComment, isInCooldown, remainingTime, startCooldown } = useCommentCooldown();
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-text text-body-small text-gray-500 bg-white"
            >
              Hvad tænker du? Skriv en kommentar...
            </div>
          ) : (
            <div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-body-small resize-none focus:outline-none focus:border-primary-500"
                placeholder="Hvad tænker du? Del dine tanker med fællesskabet..."
                rows={4}
                autoFocus
              />
              <div className="flex flex-wrap justify-end gap-2 mt-2">
                {isInCooldown && (
                  <div className="flex items-center gap-1 text-caption text-gray-500 mr-auto">
                    <Clock size={12} />
                    Du kan kommentere igen om {remainingTime} sekunder
                  </div>
                )}
                <button 
                  onClick={() => {
                    setShowCommentForm(false);
                    setCommentText('');
                  }}
                  className="text-button px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Annuller
                </button>
                <button 
                  onClick={async () => {
                    if (commentText.trim() && canComment) {
                      setIsSubmitting(true);
                      try {
                        await createComment(postId, commentText.trim());
                        startCooldown();
                        setCommentText('');
                        setShowCommentForm(false);
                      } catch (err) {
                        // Failed to create comment
                        alert('Kunne ikke oprette kommentar. Prøv igen.');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }
                  }}
                  className="text-button px-3 py-1 bg-primary-600 text-gray-900 rounded hover:bg-primary-700 disabled:opacity-50 flex items-center gap-1"
                  disabled={!commentText.trim() || isSubmitting || !canComment}
                >
                  {isInCooldown && <Clock size={12} />}
                  {isSubmitting ? 'Sender...' : isInCooldown ? `Vent ${remainingTime}s` : 'Send'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-body text-gray-500">Indlæser kommentarer...</p>
          </div>
        ) : (
          <>
            {/* Comments Header */}
            <div className="mb-4">
              <h3 className="text-body-small font-medium text-gray-700">
                {commentCount === 0 ? 'Ingen har kommenteret endnu - vær den første! 💬' : `${commentCount} ${commentCount === 1 ? 'kommentar' : 'kommentarer'}`}
              </h3>
            </div>
            
            {comments.length > 0 ? (
              comments.map(comment => (
                <Comment 
                  key={comment.id} 
                  comment={comment}
                  depth={0}
                />
              ))
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};