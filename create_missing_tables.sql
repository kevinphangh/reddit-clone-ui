-- Create posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    type VARCHAR(50) DEFAULT 'text',
    author_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    edited_at TIMESTAMP,
    score INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    is_locked BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create comments table if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    post_id INTEGER NOT NULL REFERENCES posts(id),
    author_id INTEGER NOT NULL REFERENCES users(id),
    parent_id INTEGER REFERENCES comments(id),
    depth INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    edited_at TIMESTAMP,
    score INTEGER DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create votes table if it doesn't exist
CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id),
    comment_id INTEGER REFERENCES comments(id),
    value INTEGER NOT NULL CHECK (value IN (-1, 1)),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, comment_id)
);

-- Create saved_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS saved_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    post_id INTEGER REFERENCES posts(id),
    comment_id INTEGER REFERENCES comments(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, post_id),
    UNIQUE(user_id, comment_id)
);

-- Insert a welcome post if posts table is empty
INSERT INTO posts (title, content, author_id, created_at, updated_at, score, comment_count)
SELECT 
    'Velkommen til VIA Pædagoger Forum!', 
    'Dette forum er nu migreret til helt gratis hosting på Vercel + Supabase. Alt funktionalitet er bevaret og du kan nu oprette posts, kommentere og interagere med andre pædagogstuderende på VIA University College!

**Nye funktioner:**
- 🆓 Komplet gratis hosting (fra $43/måned til $0!)
- ⚡ Hurtigere loading på Vercel
- 🔒 Sikker database på Supabase
- 📱 Samme brugervenlige interface

Log ind eller opret en bruger for at deltage i diskussioner!', 
    1, 
    NOW(), 
    NOW(), 
    1, 
    0
WHERE NOT EXISTS (SELECT 1 FROM posts LIMIT 1);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_post ON votes(user_id, post_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_comment ON votes(user_id, comment_id);