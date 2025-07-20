import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, ApiError } from '../lib/api';
import { incrementUserCount } from '../utils/userCount';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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
        // Verify that we got valid user data
        if (userData && userData.id && userData.username) {
          setUser({
            ...userData,
            cakeDay: new Date(userData.created_at),
          });
          setIsLoggedIn(true);
        } else {
          // Invalid user data
          console.error('Invalid user data received:', userData);
          api.setToken(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        // Token is invalid
        console.error('Auth check failed:', error);
        api.setToken(null);
        setIsLoggedIn(false);
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
      console.log('Login attempt for username:', username);
      await api.login(username, password);
      
      // Get user data after successful login
      const userData = await api.getMe();
      console.log('User data received:', userData);
      
      setUser({
        ...userData,
        cakeDay: new Date(userData.created_at),
      });
      setIsLoggedIn(true);
      
      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Login failed:', error.message, 'Status:', error.status);
      }
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // First, register the user
      console.log('Registering user:', username);
      await api.register(username, email, password);
      
      // Increment the user count since registration was successful
      incrementUserCount();
      
      // Wait longer to ensure backend has fully processed the registration
      console.log('Waiting for backend to process...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Try to login with the new credentials
      console.log('Attempting to login with:', username);
      try {
        await api.login(username, password);
        console.log('Login successful, token received');
        
        // Get user data immediately after login
        const userData = await api.getMe();
        console.log('User data fetched:', userData.username);
        
        setUser({
          ...userData,
          cakeDay: new Date(userData.created_at),
        });
        setIsLoggedIn(true);
        
        return { success: true };
      } catch (loginError) {
        console.error('Login failed after registration:', loginError);
        
        // Registration succeeded but login failed
        return { 
          success: false, 
          error: 'Konto blev oprettet succesfuldt! Log venligst ind manuelt med dit brugernavn og adgangskode.' 
        };
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Registration failed:', error.message);
        
        // Parse specific error messages
        const errorMsg = error.message.toLowerCase();
        
        if (errorMsg.includes('email') && errorMsg.includes('already')) {
          return { success: false, error: 'Denne email er allerede registreret' };
        } else if (errorMsg.includes('username') && errorMsg.includes('already')) {
          return { success: false, error: 'Dette brugernavn er allerede taget' };
        } else if (errorMsg.includes('invalid') && errorMsg.includes('email')) {
          return { success: false, error: 'Ugyldig email adresse' };
        } else if (errorMsg.includes('password') && errorMsg.includes('short')) {
          return { success: false, error: 'Adgangskode skal være mindst 6 tegn' };
        } else if (errorMsg.includes('username') && errorMsg.includes('invalid')) {
          return { success: false, error: 'Brugernavn må kun indeholde bogstaver, tal og underscore' };
        }
        
        return { success: false, error: error.message || 'Kunne ikke oprette konto' };
      }
      return { success: false, error: 'Der opstod en fejl. Prøv igen senere.' };
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