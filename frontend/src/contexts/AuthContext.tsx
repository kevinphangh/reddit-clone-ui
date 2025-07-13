import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, ApiError } from '../lib/api';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const userData = await api.getMe();
        setUser({
          ...userData,
          cakeDay: new Date(userData.created_at),
        });
        setIsLoggedIn(true);
      } catch (error) {
        // Token is invalid
        api.setToken(null);
      }
    }
    setLoading(false);
  };

  const refreshUser = async () => {
    if (isLoggedIn) {
      try {
        const userData = await api.getMe();
        setUser({
          ...userData,
          cakeDay: new Date(userData.created_at),
        });
      } catch (error) {
        console.error('Failed to refresh user:', error);
      }
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await api.login(username, password);
      
      // Get user data after successful login
      const userData = await api.getMe();
      setUser({
        ...userData,
        cakeDay: new Date(userData.created_at),
      });
      setIsLoggedIn(true);
      
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Login failed:', error.message);
      }
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      await api.register(username, email, password);
      
      // Automatically login after registration
      return await login(username, password);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Registration failed:', error.message);
      }
      return false;
    }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      loading, 
      login, 
      register, 
      logout,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};