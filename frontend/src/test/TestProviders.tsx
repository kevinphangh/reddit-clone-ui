import React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { DataContext } from '../contexts/DataContext';
import { vi } from 'vitest';

// Mock auth context value
const mockAuthValue = {
  isLoggedIn: false,
  user: null,
  loading: false,
  login: vi.fn().mockResolvedValue(true),
  logout: vi.fn(),
  register: vi.fn().mockResolvedValue(true),
  updateProfile: vi.fn(),
};

// Mock data context value
const mockDataValue = {
  posts: [],
  users: [],
  comments: [],
  loading: false,
  error: null,
  fetchPosts: vi.fn(),
  fetchPostById: vi.fn(),
  fetchUserProfile: vi.fn(),
  fetchUserPosts: vi.fn(),
  fetchUserComments: vi.fn(),
  createPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
  votePost: vi.fn(),
  voteComment: vi.fn(),
  createComment: vi.fn(),
  updateComment: vi.fn(),
  deleteComment: vi.fn(),
  toggleSaved: vi.fn(),
  handleVote: vi.fn(),
};

export const TestAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={mockAuthValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const TestDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DataContext.Provider value={mockDataValue}>
      {children}
    </DataContext.Provider>
  );
};