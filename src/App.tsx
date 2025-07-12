import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SubredditPage } from './pages/SubredditPage';
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
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <HomePage />
          </Layout>
        } />
        <Route path="/r/:subreddit" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <SubredditPage />
          </Layout>
        } />
        <Route path="/r/:subreddit/comments/:postId/:slug?" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <PostPage />
          </Layout>
        } />
        <Route path="/user/:username" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <UserPage />
          </Layout>
        } />
        <Route path="/submit" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <SubmitPage />
          </Layout>
        } />
        <Route path="/search" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <SearchPage />
          </Layout>
        } />
        <Route path="/login" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <LoginPage />
          </Layout>
        } />
        <Route path="/register" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <RegisterPage />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <SettingsPage />
          </Layout>
        } />
        <Route path="/subreddits/create" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <CreateCommunityPage />
          </Layout>
        } />
        <Route path="/r/popular" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <PopularPage />
          </Layout>
        } />
        <Route path="/r/all" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <AllPage />
          </Layout>
        } />
        <Route path="/:page" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username}>
            <StaticPage />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;