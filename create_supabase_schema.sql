-- VIA Forum Database Schema for Supabase
-- This creates all the tables and indexes needed for the forum

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);
CREATE INDEX IF NOT EXISTS ix_users_username ON users(username);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    url VARCHAR(500),
    post_type VARCHAR(20) NOT NULL DEFAULT 'text',
    author_id INTEGER NOT NULL REFERENCES users(id),
    score INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    edited_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE
);

-- Create indexes for posts
CREATE INDEX IF NOT EXISTS ix_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS ix_posts_score ON posts(score);
CREATE INDEX IF NOT EXISTS ix_posts_author_id ON posts(author_id);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES posts(id),
    parent_id INTEGER REFERENCES comments(id),
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    edited_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create indexes for comments
CREATE INDEX IF NOT EXISTS ix_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS ix_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS ix_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS ix_comments_parent_id ON comments(parent_id);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    value INTEGER NOT NULL CHECK (value IN (-1, 1)),
    votable_type VARCHAR(50) NOT NULL,
    votable_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, votable_type, votable_id)
);

-- Create indexes for votes
CREATE INDEX IF NOT EXISTS ix_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS ix_votes_votable_id ON votes(votable_id);
CREATE INDEX IF NOT EXISTS ix_votes_votable_type ON votes(votable_type);

-- Create saved_items table
CREATE TABLE IF NOT EXISTS saved_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    item_type VARCHAR(50) NOT NULL,
    item_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_type, item_id)
);

-- Create indexes for saved_items
CREATE INDEX IF NOT EXISTS ix_saved_items_user_id ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS ix_saved_items_item_id ON saved_items(item_id);
CREATE INDEX IF NOT EXISTS ix_saved_items_item_type ON saved_items(item_type);

-- Optional: Create Row Level Security policies (Supabase feature)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;