import React, { useState, useEffect } from 'react';
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
  const { getPost, getPostComments, votePost, updatePost, deletePost, refreshComments } = useData();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(true);
  
  const post = getPost(postId!);
  const comments = getPostComments(postId!);
  
  // Load comments when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadComments = async () => {
      if (postId && isMounted) {
        setCommentsLoading(true);
        try {
          await refreshComments(postId);
        } catch (error) {
          console.error('Failed to load comments:', error);
        } finally {
          if (isMounted) {
            setCommentsLoading(false);
          }
        }
      }
    };
    
    loadComments();
    
    return () => {
      isMounted = false;
    };
  }, [postId, refreshComments]);
  
  if (!post) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h1 className="text-heading-2 mb-2">Hmm, vi kan ikke finde dette indlæg 🤔</h1>
        <p className="text-body text-gray-600 mb-4">Det indlæg du leder efter eksisterer ikke eller er blevet slettet.</p>
        <p className="text-body-small text-primary-600">Gå tilbage til <Link to="/" className="underline">forsiden</Link> og find andre spændende indlæg!</p>
      </div>
    );
  }

  const isOwner = user?.username === post.author.username;

  const handleVote = async (direction: 1 | -1) => {
    if (!user) {
      if (window.confirm('Du skal være logget ind for at stemme. Vil du logge ind nu?')) {
        navigate('/login?from=' + window.location.pathname);
      }
      return;
    }
    
    try {
      await votePost(String(post.id), direction);
    } catch (err) {
      console.error('Vote failed:', err);
      alert('Der opstod en fejl ved afstemning. Prøv igen senere.');
    }
  };

  const handleEdit = () => {
    setEditTitle(post.title);
    setEditContent(post.content || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updatePost(String(post.id), { title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Er du sikker på at du vil slette dette indlæg?')) {
      deletePost(String(post.id));
      navigate('/');
    }
  };

  return (
    <div>
      {/* Post Content */}
      <div className="bg-white border border-gray-200 rounded-lg mb-4">
        <div className="flex">
          {/* Vote Section */}
          <div className="flex flex-col items-center p-2 bg-primary-50">
            <button 
              onClick={() => handleVote(1)}
              className={clsx('p-1 rounded hover:bg-primary-100 transition-colors', post.userVote === 1 ? 'text-primary-600' : 'text-gray-400')}
              aria-label="Upvote"
            >
              <ArrowUp size={24} />
            </button>
            <span className={clsx(
              'text-body font-bold my-1',
              post.userVote === 1 ? 'text-primary-600' : post.userVote === -1 ? 'text-red-500' : 'text-gray-600'
            )}>
              {formatScore(post.score)}
            </span>
            <button 
              onClick={() => handleVote(-1)}
              className={clsx('p-1 rounded hover:bg-primary-100 transition-colors', post.userVote === -1 ? 'text-red-500' : 'text-gray-400')}
              aria-label="Downvote"
            >
              <ArrowDown size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-3">
            {/* Meta Info */}
            <div className="flex items-center gap-1 text-caption text-gray-500 mb-2">
              <span>Delt af</span>
              <Link to={`/user/${post.author.username}`} className="hover:underline font-medium text-primary-600">
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
                className="text-heading-2 w-full mb-3 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-primary-500"
              />
            ) : (
              <h1 className="text-heading-2 text-gray-900 mb-3">
                {post.title}
              </h1>
            )}


            {/* Post Content Based on Type */}
            {post.type === 'text' && (
              isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full text-body text-gray-700 mb-4 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-primary-500 min-h-[100px]"
                  rows={5}
                />
              ) : (
                post.content && (
                  <div className="text-body text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
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
                  className="text-primary-600 hover:underline"
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
            <div className="flex items-center justify-between text-body-small text-gray-500">
              <div className="flex items-center gap-1">
                <MessageSquare size={16} className="text-primary-500" />
                <span>{post.commentCount} {post.commentCount === 1 ? 'kommentar' : 'kommentarer'}</span>
              </div>
              
              {isOwner && (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveEdit}
                        className="text-button px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
                      >
                        Gem
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-button px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Annuller
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleEdit}
                        className="text-button flex items-center gap-1 px-2 py-1 hover:bg-primary-50 rounded text-primary-600"
                      >
                        <Edit2 size={14} />
                        Rediger
                      </button>
                      <button
                        onClick={handleDelete}
                        className="text-button flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded text-red-600"
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
        postId={String(post.id)}
        isLoading={commentsLoading}
      />
    </div>
  );
};