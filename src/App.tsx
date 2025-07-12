import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SubredditPageWrapper } from './components/SubredditPageWrapper';
import { PostPage } from './pages/PostPage';
import { UserPage } from './pages/UserPage';
import { SubmitPage } from './pages/SubmitPage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SettingsPage } from './pages/SettingsPage';
import { CreateCommunityPage } from './pages/CreateCommunityPage';
import { PopularPage } from './pages/PopularPage';
import { AllPage } from './pages/AllPage';
import { StaticPage } from './pages/StaticPage';

function App() {
  const [isLoggedIn] = useState(true);
  const [currentUser] = useState({
    username: 'anne_pedagog',
    point: 4666
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <HomePage />
          </Layout>
        } />
        <Route path="/r/:subreddit" element={
          <SubredditPageWrapper isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point} />
        } />
        <Route path="/r/:subreddit/comments/:postId/:slug?" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <PostPage />
          </Layout>
        } />
        <Route path="/user/:username" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <UserPage />
          </Layout>
        } />
        <Route path="/submit" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <SubmitPage />
          </Layout>
        } />
        <Route path="/search" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <SearchPage />
          </Layout>
        } />
        <Route path="/login" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <LoginPage />
          </Layout>
        } />
        <Route path="/register" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <RegisterPage />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <SettingsPage />
          </Layout>
        } />
        <Route path="/subreddits/create" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <CreateCommunityPage />
          </Layout>
        } />
        <Route path="/r/popular" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <PopularPage />
          </Layout>
        } />
        <Route path="/r/all" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <AllPage />
          </Layout>
        } />
        <Route path="/:page" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.point}>
            <StaticPage />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;