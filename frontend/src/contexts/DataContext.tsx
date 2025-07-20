import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment } from '../types';
import { api } from '../lib/api';

interface DataContextType {
  posts: Post[];
  comments: Comment[];
  loading: boolean;
  error: string | null;
  
  // Post actions
  createPost: (title: string, content: string, subredditName?: string) => Promise<Post>;
  updatePost: (postId: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  votePost: (postId: string, direction: 1 | -1) => void;
  
  // Comment actions
  createComment: (postId: string, body: string, parentId?: string | null) => Promise<Comment>;
  updateComment: (commentId: string, body: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  voteComment: (commentId: string, direction: 1 | -1) => void;
  
  // Get data
  getPost: (postId: string) => Post | undefined;
  getPostComments: (postId: string) => Comment[];
  getUserPosts: (username: string) => Post[];
  getUserComments: (username: string) => Comment[];
  
  // Refresh data
  refreshPosts: () => Promise<void>;
  refreshComments: (postId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load posts on mount
  useEffect(() => {
    refreshPosts();
  }, []);

  const refreshPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.getPosts({ limit: 50 });
      
      // Transform API data to match frontend format
      const transformedPosts: Post[] = data.map(post => ({
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        type: 'text' as const,
        author: {
          ...post.author,
          id: post.author.id.toString(),
          cakeDay: new Date(post.author.created_at),
          points: post.author.points || { post: 0, comment: 0 }
        },
        subreddit: {
          id: '1',
          name: 'viapædagoger',
          displayName: 'VIA Pædagoger',
          description: '',
          members: 1,
          activeUsers: 1,
          createdAt: new Date(),
          rules: []
        },
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
        editedAt: post.edited_at ? new Date(post.edited_at) : undefined,
        score: post.score,
        commentCount: post.comment_count,
        isLocked: post.is_locked,
        upvoteRatio: 1,
        userVote: post.user_vote || 0,
        saved: post.saved || false,
      }));
      
      setPosts(transformedPosts);
    } catch (err: any) {
      if (err.status === 0) {
        setError('Netværksfejl - kunne ikke oprette forbindelse til serveren');
      } else {
        setError('Kunne ikke hente indlæg. Prøv at genindlæse siden.');
      }
      // Error loading posts
    } finally {
      setLoading(false);
    }
  };

  const refreshComments = async (postId: string) => {
    try {
      const data = await api.getComments(postId);
      
      // Transform and add to comments state
      const transformedComments = transformComments(data);
      
      // Replace comments for this post
      setComments(prev => {
        const otherComments = prev.filter(c => c.post.id !== postId);
        return [...otherComments, ...transformedComments];
      });
    } catch (err: any) {
      if (err.status === 0) {
        setError('Netværksfejl - kunne ikke oprette forbindelse til serveren');
      } else {
        setError('Kunne ikke hente kommentarer. Prøv igen senere.');
      }
      // Error loading comments
    }
  };

  const transformComments = (apiComments: any[]): Comment[] => {
    const result: Comment[] = [];
    
    const processComment = (comment: any, depth: number = 0): Comment => {
      const transformed: Comment = {
        id: comment.id.toString(),
        body: comment.body,
        author: {
          ...comment.author,
          id: comment.author.id.toString(),
          cakeDay: new Date(comment.author.created_at),
          points: comment.author.points || { post: 0, comment: 0 }
        },
        post: {
          id: comment.post.id.toString(),
          title: comment.post.title
        },
        parent: comment.parent_id ? { id: comment.parent_id.toString() } as Comment : undefined,
        createdAt: new Date(comment.created_at),
        updatedAt: new Date(comment.updated_at),
        editedAt: comment.edited_at ? new Date(comment.edited_at) : undefined,
        score: comment.score,
        isDeleted: comment.is_deleted || false,
        userVote: comment.user_vote || 0,
        saved: comment.saved || false,
        depth,
        replies: [],
      };
      
      // Process nested replies if they exist
      if (comment.replies && Array.isArray(comment.replies)) {
        transformed.replies = comment.replies.map((r: any) => processComment(r, depth + 1));
      }
      
      result.push(transformed);
      return transformed;
    };
    
    apiComments.forEach(comment => processComment(comment));
    return result;
  };

  // Post actions
  const createPost = async (title: string, content: string): Promise<Post> => {
    try {
      const newPost = await api.createPost(title, content);
      
      const transformedPost: Post = {
        id: newPost.id.toString(),
        title: newPost.title,
        content: newPost.content,
        type: 'text' as const,
        author: {
          ...newPost.author,
          id: newPost.author.id.toString(),
          cakeDay: new Date(newPost.author.created_at),
          points: newPost.author.points || { post: 0, comment: 0 }
        },
        subreddit: {
          id: '1',
          name: 'viapædagoger',
          displayName: 'VIA Pædagoger',
          description: '',
          members: 1,
          activeUsers: 1,
          createdAt: new Date(),
          rules: []
        },
        createdAt: new Date(newPost.created_at),
        updatedAt: new Date(newPost.updated_at),
        editedAt: newPost.edited_at ? new Date(newPost.edited_at) : undefined,
        score: newPost.score,
        commentCount: newPost.comment_count,
        isLocked: newPost.is_locked,
        upvoteRatio: 1,
        userVote: 1,
        saved: false,
      };
      
      setPosts(prev => [transformedPost, ...prev]);
      return transformedPost;
    } catch (err: any) {
      if (err.status === 0) {
        throw new Error('Netværksfejl - kunne ikke oprette forbindelse til serveren');
      } else {
        throw new Error('Kunne ikke oprette indlæg. Prøv igen senere.');
      }
    }
  };

  const updatePost = async (postId: string, updates: Partial<Post>) => {
    try {
      const updatedPost = await api.updatePost(postId, {
        title: updates.title,
        content: updates.content || undefined,
      });
      
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post,
              title: updatedPost.title,
              content: updatedPost.content || undefined,
              editedAt: updatedPost.edited_at ? new Date(updatedPost.edited_at) : undefined,
              updatedAt: new Date(updatedPost.updated_at),
            }
          : post
      ));
    } catch (err: any) {
      if (err.status === 0) {
        throw new Error('Netværksfejl - kunne ikke oprette forbindelse til serveren');
      } else {
        throw new Error('Kunne ikke opdatere indlæg. Prøv igen senere.');
      }
    }
  };

  const deletePost = async (postId: string) => {
    try {
      await api.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err: any) {
      if (err.status === 0) {
        throw new Error('Netværksfejl - kunne ikke oprette forbindelse til serveren');
      } else {
        throw new Error('Kunne ikke slette indlæg. Prøv igen senere.');
      }
    }
  };

  const votePost = async (postId: string, direction: 1 | -1) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const currentVote = post.userVote || 0;
    const newVote = currentVote === direction ? 0 : direction;
    
    // Optimistic update
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, userVote: newVote, score: p.score - currentVote + newVote }
        : p
    ));
    
    try {
      const result = await api.votePost(postId, newVote);
      
      // Update with server response
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, score: result.score, userVote: result.user_vote || 0 }
          : p
      ));
    } catch (err: any) {
      // Revert on error
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, userVote: currentVote, score: post.score }
          : p
      ));
      
      // Show user-friendly error message
      if (err.status === 401) {
        setError('Du skal være logget ind for at stemme');
      } else if (err.status === 0) {
        setError(err.message || 'Netværksfejl - kunne ikke oprette forbindelse til serveren');
      } else {
        setError('Kunne ikke stemme på indlæg. Prøv igen senere.');
      }
      
      // Failed to vote on post
      throw err;
    }
  };

  // Comment actions
  const createComment = async (postId: string, body: string, parentId?: string | null): Promise<Comment> => {
    try {
      const newComment = await api.createComment(postId, body, parentId);
      
      const transformedComment: Comment = {
        id: newComment.id.toString(),
        body: newComment.body,
        author: {
          ...newComment.author,
          id: newComment.author.id.toString(),
          cakeDay: new Date(newComment.author.created_at),
          points: newComment.author.points || { post: 0, comment: 0 }
        },
        post: {
          id: newComment.post.id.toString(),
          title: newComment.post.title
        },
        parent: undefined,
        createdAt: new Date(newComment.created_at),
        updatedAt: new Date(newComment.updated_at),
        editedAt: newComment.edited_at ? new Date(newComment.edited_at) : undefined,
        score: newComment.score,
        isDeleted: newComment.is_deleted || false,
        userVote: 1,
        saved: false,
        depth: parentId ? 1 : 0,
        replies: [],
      };
      
      if (parentId) {
        // Add as reply
        setComments(prev => {
          const addReply = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), transformedComment]
                };
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: addReply(comment.replies)
                };
              }
              return comment;
            });
          };
          return addReply(prev);
        });
      } else {
        // Add as top-level comment
        setComments(prev => [...prev, transformedComment]);
      }
      
      // Update post comment count
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, commentCount: p.commentCount + 1 }
          : p
      ));
      
      // Refresh comments to ensure proper tree structure
      setTimeout(() => {
        refreshComments(postId);
      }, 100);
      
      return transformedComment;
    } catch (err: any) {
      // Failed to create comment
      if (err.status === 0) {
        throw new Error('Netværksfejl - kunne ikke oprette forbindelse til serveren');
      } else {
        throw new Error('Kunne ikke oprette kommentar. Prøv igen senere.');
      }
    }
  };

  const updateComment = async (commentId: string, body: string) => {
    try {
      const updatedComment = await api.updateComment(commentId, body);
      
      const updateCommentRecursive = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { 
              ...comment, 
              body: updatedComment.body,
              editedAt: updatedComment.edited_at ? new Date(updatedComment.edited_at) : undefined
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentRecursive(comment.replies)
            };
          }
          return comment;
        });
      };
      
      setComments(prev => updateCommentRecursive(prev));
    } catch (err: any) {
      if (err.status === 0) {
        throw new Error('Netværksfejl - kunne ikke oprette forbindelse til serveren');
      } else {
        throw new Error('Kunne ikke opdatere kommentar. Prøv igen senere.');
      }
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await api.deleteComment(commentId);
      
      const deleteCommentRecursive = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              body: '[slettet]',
              author: { 
                id: 'deleted',
                username: '[deleted]', 
                isVerified: false, 
                isPremium: false,
                points: { post: 0, comment: 0 },
                cakeDay: new Date()
              },
              isDeleted: true
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: deleteCommentRecursive(comment.replies)
            };
          }
          return comment;
        });
      };
      
      setComments(prev => deleteCommentRecursive(prev));
      
      // Update post comment count
      const comment = getCommentById(commentId);
      if (comment) {
        setPosts(prev => prev.map(p => 
          p.id === comment.post.id 
            ? { ...p, commentCount: Math.max(0, p.commentCount - 1) }
            : p
        ));
      }
    } catch (err: any) {
      if (err.status === 0) {
        throw new Error('Netværksfejl - kunne ikke oprette forbindelse til serveren');
      } else {
        throw new Error('Kunne ikke slette kommentar. Prøv igen senere.');
      }
    }
  };

  const voteComment = async (commentId: string, direction: 1 | -1) => {
    const comment = getCommentById(commentId);
    if (!comment) return;
    
    const currentVote = comment.userVote || 0;
    const newVote = currentVote === direction ? 0 : direction;
    
    const voteCommentRecursive = (comments: Comment[], updateScore: boolean = true): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          if (updateScore) {
            return { ...c, userVote: newVote, score: c.score - currentVote + newVote };
          } else {
            return { ...c, userVote: currentVote, score: comment.score };
          }
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: voteCommentRecursive(c.replies, updateScore) };
        }
        return c;
      });
    };
    
    // Optimistic update
    setComments(prev => voteCommentRecursive(prev));
    
    try {
      const result = await api.voteComment(commentId, newVote);
      
      // Update with server response
      const updateWithServerData = (comments: Comment[]): Comment[] => {
        return comments.map(c => {
          if (c.id === commentId) {
            return { ...c, score: result.score, userVote: result.user_vote || 0 };
          }
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: updateWithServerData(c.replies) };
          }
          return c;
        });
      };
      
      setComments(prev => updateWithServerData(prev));
    } catch (err: any) {
      // Revert on error
      setComments(prev => voteCommentRecursive(prev, false));
      
      // Show user-friendly error message
      if (err.status === 401) {
        setError('Du skal være logget ind for at stemme');
      } else if (err.status === 0) {
        setError(err.message || 'Netværksfejl - kunne ikke oprette forbindelse til serveren');
      } else {
        setError('Kunne ikke stemme på kommentar. Prøv igen senere.');
      }
      
      // Failed to vote on comment
      throw err;
    }
  };

  // Helper functions
  const getCommentById = (commentId: string): Comment | undefined => {
    const findComment = (comments: Comment[]): Comment | undefined => {
      for (const comment of comments) {
        if (comment.id === commentId) return comment;
        if (comment.replies) {
          const found = findComment(comment.replies);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findComment(comments);
  };

  // Get data functions
  const getPost = (postId: string) => posts.find(p => p.id === postId);
  
  const getPostComments = (postId: string) => {
    return comments.filter(c => c.post.id === postId);
  };
  
  const getUserPosts = (username: string) => {
    return posts.filter(p => p.author.username === username);
  };
  
  const getUserComments = (username: string) => {
    const userComments: Comment[] = [];
    
    const collectUserComments = (commentList: Comment[]) => {
      commentList.forEach(comment => {
        if (comment.author.username === username) {
          userComments.push(comment);
        }
        if (comment.replies && comment.replies.length > 0) {
          collectUserComments(comment.replies);
        }
      });
    };
    
    collectUserComments(comments);
    return userComments;
  };

  return (
    <DataContext.Provider value={{
      posts,
      comments,
      loading,
      error,
      createPost,
      updatePost,
      deletePost,
      votePost,
      createComment,
      updateComment,
      deleteComment,
      voteComment,
      getPost,
      getPostComments,
      getUserPosts,
      getUserComments,
      refreshPosts,
      refreshComments,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};