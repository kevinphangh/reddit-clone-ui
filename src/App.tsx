import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SubredditPage } from './pages/SubredditPage';
import { PostPage } from './pages/PostPage';
import { UserPage } from './pages/UserPage';
import { SubmitPage } from './pages/SubmitPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PopularPage } from './pages/PopularPage';
import { AllPage } from './pages/AllPage';
import { StaticPage } from './pages/StaticPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { isLoggedIn, user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout isLoggedIn={isLoggedIn} username={user?.username}>
            <HomePage />
          </Layout>
        } />
        <Route path="/r/:subreddit" element={
          <Layout isLoggedIn={isLoggedIn} username={user?.username}>
            <SubredditPage />
          </Layout>
        } />
        <Route path="/r/:subreddit/comments/:postId/:slug?" element={
          <Layout isLoggedIn={isLoggedIn} username={user?.username}>
            <PostPage />
          </Layout>
        } />
        <Route path="/user/:username" element={
          <Layout isLoggedIn={isLoggedIn} username={user?.username}>
            <UserPage />
          </Layout>
        } />
        <Route path="/submit" element={
          <Layout isLoggedIn={isLoggedIn} username={user?.username}>
            <SubmitPage />
          </Layout>
        } />
        <Route path="/login" element={
          <Layout isLoggedIn={isLoggedIn} username={user?.username}>
            <LoginPage />
          </Layout>
        } />
        <Route path="/register" element={
          <Layout isLoggedIn={isLoggedIn} username={user?.username}>
            <RegisterPage />
          </Layout>
        } />
        <Route path="/r/popular" element={
          <Layout isLoggedIn={isLoggedIn} username={user?.username}>
            <PopularPage />
          </Layout>
        } />
        <Route path="/r/all" element={
          <Layout isLoggedIn={isLoggedIn} username={user?.username}>
            <AllPage />
          </Layout>
        } />
        <Route path="/:page" element={
          <Layout isLoggedIn={isLoggedIn} username={user?.username}>
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
      <AppContent />
    </AuthProvider>
  );
}

export default App;