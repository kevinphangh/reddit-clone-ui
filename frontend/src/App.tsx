import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { PostPage } from './pages/PostPage';
import { UserPage } from './pages/UserPage';
import { SubmitPage } from './pages/SubmitPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PopularPage } from './pages/PopularPage';
import { AllPage } from './pages/AllPage';
import { StaticPage } from './pages/StaticPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CommentCooldownProvider } from './contexts/CommentCooldownContext';
import { BackendError } from './components/BackendError';
import { api } from './lib/api';

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        <Route path="/comments/:postId/:slug?" element={
          <Layout>
            <PostPage />
          </Layout>
        } />
        <Route path="/user/:username" element={
          <Layout>
            <UserPage />
          </Layout>
        } />
        <Route path="/submit" element={
          <Layout>
            <SubmitPage />
          </Layout>
        } />
        <Route path="/login" element={
          <Layout>
            <LoginPage />
          </Layout>
        } />
        <Route path="/register" element={
          <Layout>
            <RegisterPage />
          </Layout>
        } />
        <Route path="/verify-email" element={
          <Layout>
            <VerifyEmailPage />
          </Layout>
        } />
        <Route path="/r/popular" element={
          <Layout>
            <PopularPage />
          </Layout>
        } />
        <Route path="/r/all" element={
          <Layout>
            <AllPage />
          </Layout>
        } />
        <Route path="/:page" element={
          <Layout>
            <StaticPage />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Check if backend is available by calling a simple endpoint
        await api.getUserCount();
        setBackendAvailable(true);
      } catch (error) {
        // Backend is not available
        setBackendAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackend();
    
    // Recheck every 30 seconds if backend is down
    const interval = setInterval(() => {
      if (!backendAvailable) {
        checkBackend();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [backendAvailable]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Opretter forbindelse til serveren...</p>
        </div>
      </div>
    );
  }

  // Show error if backend is not available
  if (!backendAvailable) {
    return <BackendError />;
  }

  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <CommentCooldownProvider>
            <AppContent />
          </CommentCooldownProvider>
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;