import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  email: string;
  points: {
    post: number;
    comment: number;
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
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

  // Check localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('forum_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simuler login - i virkeligheden ville dette kalde en API
    if (username && password.length >= 6) {
      const userData: User = {
        username,
        email: `${username}@via.dk`,
        points: {
          post: Math.floor(Math.random() * 1000),
          comment: Math.floor(Math.random() * 2000)
        }
      };
      
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('forum_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simuler registrering
    if (username && email.includes('@') && password.length >= 6) {
      const userData: User = {
        username,
        email,
        points: {
          post: 0,
          comment: 0
        }
      };
      
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('forum_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('forum_user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};