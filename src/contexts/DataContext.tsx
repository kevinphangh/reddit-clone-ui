import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment, Subreddit } from '../types';
import { mockPosts, mockComments, mockSubreddits } from '../data/mockData';

interface DataContextType {
  posts: Post[];
  comments: Comment[];
  subreddits: Subreddit[];
  loading: boolean;
  error: string | null;
  
  // Post actions
  createPost: (title: string, content: string, subredditName?: string) => Promise<Post>;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => void;
  votePost: (postId: string, direction: 1 | -1) => void;
  
  // Comment actions
  createComment: (postId: string, parentId: string | null, body: string) => Promise<Comment>;
  updateComment: (commentId: string, body: string) => void;
  deleteComment: (commentId: string) => void;
  voteComment: (commentId: string, direction: 1 | -1) => void;
  
  // Get data
  getPost: (postId: string) => Post | undefined;
  getPostComments: (postId: string) => Comment[];
  getUserPosts: (username: string) => Post[];
  getUserComments: (username: string) => Comment[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [subreddits] = useState<Subreddit[]>(mockSubreddits);
  const [loading, setLoading] = useState(true);

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedPosts = localStorage.getItem('forum_posts');
      const savedComments = localStorage.getItem('forum_comments');
      
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts);
        // Convert date strings back to Date objects
        setPosts(parsedPosts.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          editedAt: p.editedAt ? new Date(p.editedAt) : undefined
        })));
      } else {
        setPosts(mockPosts);
      }
      
      if (savedComments) {
        const parsedComments = JSON.parse(savedComments);
        setComments(parsedComments.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          editedAt: c.editedAt ? new Date(c.editedAt) : undefined
        })));
      } else {
        setComments(mockComments);
      }
    } catch (err) {
      // Error loading data, use mock data
      setPosts(mockPosts);
      setComments(mockComments);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('forum_posts', JSON.stringify(posts));
      localStorage.setItem('forum_comments', JSON.stringify(comments));
    }
  }, [posts, comments, loading]);

  // Post actions
  const createPost = async (title: string, content: string, subredditName?: string): Promise<Post> => {
    const user = JSON.parse(localStorage.getItem('forum_user') || '{}');
    const subreddit = subreddits.find(s => s.name === subredditName) || subreddits[0];
    
    const newPost: Post = {
      id: `post_${Date.now()}`,
      title,
      content,
      type: 'text',
      author: {
        id: user.id || 'anon',
        username: user.username || 'anonymous',
        isVerified: false,
        isPremium: false,
        points: { post: 0, comment: 0 },
        cakeDay: new Date()
      },
      subreddit: subreddit,
      score: 1,
      upvoteRatio: 1,
      commentCount: 0,
      createdAt: new Date(),
      userVote: 1,
      saved: false
    };
    
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (postId: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, ...updates, editedAt: new Date() }
        : post
    ));
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    // Also delete all comments for this post
    setComments(prev => prev.filter(comment => comment.post.id !== postId));
  };

  const votePost = (postId: string, direction: 1 | -1) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      
      const currentVote = post.userVote || 0;
      const newVote = currentVote === direction ? 0 : direction;
      const scoreDiff = newVote - currentVote;
      
      return {
        ...post,
        userVote: newVote,
        score: post.score + scoreDiff
      };
    }));
  };

  // Comment actions
  const createComment = async (postId: string, parentId: string | null, body: string): Promise<Comment> => {
    const user = JSON.parse(localStorage.getItem('forum_user') || '{}');
    const post = posts.find(p => p.id === postId);
    
    if (!post) throw new Error('Post not found');
    
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      body,
      author: {
        id: user.id || 'anon',
        username: user.username || 'anonymous',
        isVerified: false,
        isPremium: false,
        points: { post: 0, comment: 0 },
        cakeDay: new Date()
      },
      score: 1,
      createdAt: new Date(),
      post: post,
      userVote: 1,
      saved: false,
      replies: [],
      depth: 0
    };
    
    if (parentId) {
      // Add as reply to parent comment
      setComments(prev => {
        const addReply = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment]
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
      setComments(prev => [...prev, newComment]);
    }
    
    // Update post comment count
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, commentCount: p.commentCount + 1 }
        : p
    ));
    
    return newComment;
  };

  const updateComment = (commentId: string, body: string) => {
    const updateCommentRecursive = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, body, editedAt: new Date() };
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
  };

  const deleteComment = (commentId: string) => {
    let postId: string | null = null;
    
    const deleteCommentRecursive = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          postId = comment.post.id;
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
    if (postId) {
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, commentCount: Math.max(0, p.commentCount - 1) }
          : p
      ));
    }
  };

  const voteComment = (commentId: string, direction: 1 | -1) => {
    const voteCommentRecursive = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          const currentVote = comment.userVote || 0;
          const newVote = currentVote === direction ? 0 : direction;
          const scoreDiff = newVote - currentVote;
          
          return {
            ...comment,
            userVote: newVote,
            score: comment.score + scoreDiff
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: voteCommentRecursive(comment.replies)
          };
        }
        return comment;
      });
    };
    
    setComments(prev => voteCommentRecursive(prev));
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
      subreddits,
      loading,
      error: null,
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
      getUserComments
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