import React, { useState } from 'react';
import { 
  MessageSquare, 
  ChevronDown,
  Sparkles,
  Clock,
  TrendingUp,
  MessageCircle,
  Shuffle,
  BookOpen
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
      case COMMENT_SORT_OPTIONS.QA: return <BookOpen size={16} />;
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
          <div className="text-xs text-gray-500 mb-2">
            Kommenter som <span className="text-blue-600">anne_pedagog</span>
          </div>
          
          {!showCommentForm ? (
            <div 
              onClick={() => setShowCommentForm(true)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-text text-sm text-gray-500 bg-white focus:outline-none focus:border-blue-500"
            >
              Hvad tænker du?
            </div>
          ) : (
            <div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:border-blue-500"
                placeholder="Hvad tænker du?"
                rows={6}
                autoFocus
              />
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-500">
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
                    className="text-sm px-4 py-1.5 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Annuller
                  </button>
                  <button 
                    className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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
              className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900"
            >
              {getSortIcon(sortBy)}
              <span>Sorter efter: {getSortLabel(sortBy)}</span>
              <ChevronDown size={14} />
            </button>
            
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {Object.values(COMMENT_SORT_OPTIONS).map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setShowSortMenu(false);
                    }}
                    className={clsx(
                      'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2',
                      sortBy === option && 'text-blue-600 font-bold'
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
        <button className="text-xs text-gray-500 hover:text-gray-900">
          <MessageCircle size={16} className="inline mr-1" />
          Diskussionsindstillinger
        </button>
      </div>

      {/* Comments List */}
      {isLocked && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 text-center">
          <MessageSquare size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium mb-1">Kommentarer er låst</p>
          <p className="text-xs text-gray-500">Denne tråd er blevet låst af moderatorerne</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 && !isLocked ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Ingen kommentarer endnu</p>
            <p className="text-sm text-gray-500 mb-4">Vær den første til at dele dine tanker!</p>
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
          <button className="text-sm font-bold text-blue-600 hover:underline">
            Se flere kommentarer ({commentCount - comments.length} svar)
          </button>
        </div>
      )}
    </div>
  );
};