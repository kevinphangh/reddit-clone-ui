import React, { useState } from 'react';
import { 
  MessageSquare, 
  ChevronDown,
  Sparkles,
  Clock,
  TrendingUp,
  MessageCircle,
  HelpCircle,
  Shuffle
} from 'lucide-react';
import { Comment } from './Comment';
import { Comment as CommentType } from '../types';
import { COMMENT_SORT_OPTIONS } from '../utils/constants';
import { clsx } from 'clsx';

interface CommentSectionProps {
  comments: CommentType[];
  commentCount: number;
  isLocked?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  commentCount,
  isLocked = false
}) => {
  const [sortBy, setSortBy] = useState<string>(COMMENT_SORT_OPTIONS.BEST);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');

  const getSortIcon = (sort: string) => {
    switch (sort) {
      case COMMENT_SORT_OPTIONS.BEST: return <Sparkles size={16} />;
      case COMMENT_SORT_OPTIONS.TOP: return <TrendingUp size={16} />;
      case COMMENT_SORT_OPTIONS.NEW: return <Clock size={16} />;
      case COMMENT_SORT_OPTIONS.CONTROVERSIAL: return <Shuffle size={16} />;
      case COMMENT_SORT_OPTIONS.OLD: return <Clock size={16} />;
      case COMMENT_SORT_OPTIONS.QA: return <HelpCircle size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  const getSortLabel = (sort: string) => {
    return sort.charAt(0).toUpperCase() + sort.slice(1);
  };

  return (
    <div className="mt-4">
      {/* Comment Form */}
      {!isLocked && (
        <div className="mb-4">
          <div className="text-xs text-reddit-gray mb-2">
            Kommenter som <span className="text-reddit-blue">anne_pedagog</span>
          </div>
          
          {!showCommentForm ? (
            <div 
              onClick={() => setShowCommentForm(true)}
              className="reddit-input cursor-text text-sm text-reddit-gray"
            >
              Hvad tænker du?
            </div>
          ) : (
            <div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="reddit-textarea text-sm"
                placeholder="Hvad tænker du?"
                rows={6}
                autoFocus
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-reddit-gray">
                  <button className="hover:underline">Markdown</button>
                  {' • '}
                  <button className="hover:underline">Formateringshjælp</button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setShowCommentForm(false);
                      setCommentText('');
                    }}
                    className="btn-ghost text-sm px-4 py-1.5"
                  >
                    Annuller
                  </button>
                  <button 
                    className="btn-primary text-sm px-4 py-1.5"
                    disabled={!commentText.trim()}
                  >
                    Kommenter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comments Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm">
            {commentCount === 0 ? 'Ingen kommentarer endnu' : `${commentCount.toLocaleString()} ${commentCount === 1 ? 'kommentar' : 'kommentarer'}`}
          </span>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1 text-xs font-bold text-reddit-gray hover:text-reddit-black"
            >
              {getSortIcon(sortBy)}
              <span>Sorter efter: {getSortLabel(sortBy)}</span>
              <ChevronDown size={14} />
            </button>
            
            {showSortMenu && (
              <div className="dropdown-menu">
                {Object.values(COMMENT_SORT_OPTIONS).map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setShowSortMenu(false);
                    }}
                    className={clsx(
                      'dropdown-item flex items-center gap-2',
                      sortBy === option && 'text-reddit-blue font-bold'
                    )}
                  >
                    {getSortIcon(option)}
                    {getSortLabel(option)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Discussion Settings */}
        <button className="text-xs text-reddit-gray hover:text-reddit-black">
          <MessageCircle size={16} className="inline mr-1" />
          Diskussionsindstillinger
        </button>
      </div>

      {/* Comments List */}
      {isLocked && (
        <div className="reddit-card p-4 mb-4 text-center">
          <MessageSquare size={24} className="mx-auto mb-2 text-reddit-gray" />
          <p className="text-sm font-medium mb-1">Kommentarer er låst</p>
          <p className="text-xs text-reddit-gray">Denne tråd er blevet låst af moderatorerne</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 && !isLocked ? (
          <div className="reddit-card p-8 text-center">
            <MessageSquare size={48} className="mx-auto mb-4 text-reddit-lightGray" />
            <p className="text-lg font-medium mb-2">Ingen kommentarer endnu</p>
            <p className="text-sm text-reddit-gray mb-4">Vær den første til at dele dine tanker!</p>
          </div>
        ) : (
          comments.map(comment => (
            <Comment 
              key={comment.id} 
              comment={comment}
              depth={0}
            />
          ))
        )}
      </div>

      {/* View More Comments */}
      {comments.length > 0 && comments.length < commentCount && (
        <div className="mt-4 text-center">
          <button className="text-sm font-bold text-reddit-blue hover:underline">
            Se flere kommentarer ({commentCount - comments.length} svar)
          </button>
        </div>
      )}
    </div>
  );
};