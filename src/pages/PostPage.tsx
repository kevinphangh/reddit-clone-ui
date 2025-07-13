import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare,
  Edit2,
  Trash2
} from 'lucide-react';
import { CommentSection } from '../components/CommentSection';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { formatTimeAgo, formatScore } from '../utils/formatting';
import { clsx } from 'clsx';

export const PostPage: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { getPost, getPostComments, votePost, updatePost, deletePost } = useData();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  
  const post = getPost(postId!);
  const comments = getPostComments(postId!);
  
  if (!post) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h1 className="text-xl font-bold mb-2">Indlæg ikke fundet</h1>
        <p className="text-gray-500">Det indlæg du leder efter eksisterer ikke.</p>
      </div>
    );
  }

  const isOwner = user?.username === post.author.username;

  const handleVote = (direction: 1 | -1) => {
    votePost(post.id, direction);
  };

  const handleEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updatePost(post.id, { title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Er du sikker på at du vil slette dette indlæg?')) {
      deletePost(post.id);
      navigate('/');
    }
  };

  return (
    <div>
      {/* Post Content */}
      <div className="bg-white border border-gray-200 rounded-lg mb-4">
        <div className="flex">
          {/* Vote Section */}
          <div className="flex flex-col items-center p-2 bg-gray-50">
            <button 
              onClick={() => handleVote(1)}
              className={clsx('p-1 rounded hover:bg-gray-200 transition-colors', post.userVote === 1 ? 'text-blue-600' : 'text-gray-400')}
              aria-label="Upvote"
            >
              <ArrowUp size={24} />
            </button>
            <span className={clsx(
              'text-base font-bold my-1',
              post.userVote === 1 ? 'text-blue-600' : post.userVote === -1 ? 'text-red-500' : 'text-gray-600'
            )}>
              {formatScore(post.score)}
            </span>
            <button 
              onClick={() => handleVote(-1)}
              className={clsx('p-1 rounded hover:bg-gray-200 transition-colors', post.userVote === -1 ? 'text-red-500' : 'text-gray-400')}
              aria-label="Downvote"
            >
              <ArrowDown size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3">
            {/* Meta Info */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <span>af</span>
              <Link to={`/user/${post.author.username}`} className="hover:underline">
                {post.author.username}
              </Link>
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>

            {/* Title */}
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-xl font-semibold w-full mb-3 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            ) : (
              <h1 className="text-xl font-semibold text-gray-900 mb-3">
                {post.title}
              </h1>
            )}


            {/* Post Content Based on Type */}
            {post.type === 'text' && (
              isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full text-gray-700 mb-4 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500 min-h-[100px]"
                  rows={5}
                />
              ) : (
                post.content && (
                  <div className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                    {post.content}
                  </div>
                )
              )
            )}

            {post.type === 'link' && post.url && (
              <div className="mb-4">
                <a 
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {post.url}
                </a>
              </div>
            )}

            {post.type === 'image' && post.url && (
              <div className="mb-4">
                <img 
                  src={post.url} 
                  alt={post.title}
                  className="max-w-full h-auto"
                />
              </div>
            )}

            {post.type === 'video' && post.url && (
              <div className="mb-4 bg-black">
                <video 
                  src={post.url}
                  controls
                  className="max-w-full h-auto"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MessageSquare size={16} />
                <span>{post.commentCount} {post.commentCount === 1 ? 'kommentar' : 'kommentarer'}</span>
              </div>
              
              {isOwner && (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Gem
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Annuller
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded"
                      >
                        <Edit2 size={14} />
                        Rediger
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded text-red-600"
                      >
                        <Trash2 size={14} />
                        Slet
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection 
        comments={comments}
        commentCount={post.commentCount}
        isLocked={post.isLocked}
        postId={post.id}
      />
    </div>
  );
};