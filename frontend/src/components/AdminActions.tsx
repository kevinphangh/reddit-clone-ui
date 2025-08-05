import React, { useState } from 'react';
import { Edit3, Trash2, Lock, Unlock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Post, Comment } from '../types';
import { api } from '../lib/api';

interface AdminActionsProps {
  item: Post | Comment;
  type: 'post' | 'comment';
  onUpdate?: () => void;
}

export const AdminActions: React.FC<AdminActionsProps> = ({ item, type, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // Only show to admins
  if (!user?.is_admin) {
    return null;
  }

  const handleEdit = () => {
    if (type === 'post') {
      const post = item as Post;
      setEditTitle(post.title);
      setEditContent(post.content || '');
    } else {
      const comment = item as Comment;
      setEditContent(comment.body);
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      if (type === 'post') {
        const updateData: any = { content: editContent };
        if (editTitle.trim()) {
          updateData.title = editTitle.trim();
        }
        
        await (api as any).request(`/api/posts/admin/${item.id}`, {
          method: 'PUT',
          body: JSON.stringify(updateData)
        });
      } else {
        await (api as any).request(`/api/comments/admin/${item.id}`, {
          method: 'PUT',
          body: JSON.stringify({ body: editContent })
        });
      }
      
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error('Failed to edit:', error);
      alert('Fejl ved redigering');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Er du sikker på at du vil slette dette ${type === 'post' ? 'indlæg' : 'kommentar'}?`)) {
      return;
    }

    setLoading(true);
    try {
      await (api as any).request(`/api/${type}s/admin/${item.id}`, {
        method: 'DELETE'
      });
      onUpdate?.();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Fejl ved sletning');
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async () => {
    if (type !== 'post') return;
    
    setLoading(true);
    try {
      await (api as any).request(`/api/posts/admin/${item.id}/lock`, {
        method: 'POST'
      });
      onUpdate?.();
    } catch (error) {
      console.error('Failed to lock/unlock:', error);
      alert('Fejl ved låsning');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div 
        className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs text-yellow-700 mb-2 font-medium">Admin redigering</div>
        
        {type === 'post' && (
          <div className="mb-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="Titel"
            />
          </div>
        )}
        
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded resize-none"
          rows={3}
          placeholder={type === 'post' ? 'Indhold' : 'Kommentar'}
        />
        
        <div className="flex gap-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSaveEdit();
            }}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Gemmer...' : 'Gem'}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(false);
            }}
            className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
          >
            Annuller
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-xs text-red-600 font-medium">Admin:</span>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEdit();
        }}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
        title="Rediger"
      >
        <Edit3 size={12} />
        Rediger
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
        title="Slet"
      >
        <Trash2 size={12} />
        Slet
      </button>
      
      {type === 'post' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLock();
          }}
          disabled={loading}
          className="flex items-center gap-1 px-2 py-1 text-xs text-orange-600 hover:bg-orange-50 rounded disabled:opacity-50"
          title={(item as Post).isLocked ? 'Lås op' : 'Lås'}
        >
          {(item as Post).isLocked ? <Unlock size={12} /> : <Lock size={12} />}
          {(item as Post).isLocked ? 'Lås op' : 'Lås'}
        </button>
      )}
    </div>
  );
};