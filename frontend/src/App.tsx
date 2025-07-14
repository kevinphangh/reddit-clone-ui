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
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CommentCooldownProvider } from './contexts/CommentCooldownContext';

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