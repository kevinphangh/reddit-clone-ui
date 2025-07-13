import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Post } from '../types';
import { formatTimeAgo } from '../utils/formatting';

interface SearchDropdownProps {
  results: Post[];
  onClose: () => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({ results, onClose }) => {
  if (results.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      {results.map(post => (
        <Link
          key={post.id}
          to={`/comments/${post.id}`}
          onClick={onClose}
          className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
        >
          <div className="text-sm font-medium text-gray-900 line-clamp-1">
            {post.title}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span>{formatTimeAgo(post.createdAt)}</span>
            <span>•</span>
            <MessageSquare size={12} />
            <span>{post.commentCount}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};