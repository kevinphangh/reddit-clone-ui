import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SubredditPageWrapper } from './components/SubredditPageWrapper';
import { PostPage } from './pages/PostPage';
import { UserPage } from './pages/UserPage';
import { SubmitPage } from './pages/SubmitPage';
import { SearchPage } from './pages/SearchPage';

function App() {
  const [isLoggedIn] = useState(true);
  const [currentUser] = useState({
    username: 'anne_pedagog',
    karma: 4666
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.karma}>
            <HomePage />
          </Layout>
        } />
        <Route path="/r/:subreddit" element={
          <SubredditPageWrapper isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.karma} />
        } />
        <Route path="/r/:subreddit/comments/:postId/:slug?" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.karma}>
            <PostPage />
          </Layout>
        } />
        <Route path="/user/:username" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.karma}>
            <UserPage />
          </Layout>
        } />
        <Route path="/submit" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.karma}>
            <SubmitPage />
          </Layout>
        } />
        <Route path="/search" element={
          <Layout isLoggedIn={isLoggedIn} username={currentUser.username} karma={currentUser.karma}>
            <SearchPage />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;