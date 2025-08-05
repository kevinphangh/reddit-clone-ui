const { Client } = require('pg');

module.exports = async (req, res) => {
  try {
    // Connect to Supabase PostgreSQL using environment variable
    const client = new Client({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Maa72ckrsick!@db.rmtiksoarunbpeatdrng.supabase.co:5432/postgres'
    });
    
    await client.connect();
    
    // Create users table
    await client.query(`
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
      
      CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS ix_users_username ON users(username);
    `);
    
    // Drop and recreate posts table to fix schema mismatch
    console.log('Dropping and recreating posts table...');
    await client.query('DROP TABLE IF EXISTS posts CASCADE');
    
    // Create posts table with correct "type" column
    await client.query(`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        url VARCHAR(500),
        type VARCHAR(20) NOT NULL DEFAULT 'text',
        author_id INTEGER NOT NULL REFERENCES users(id),
        score INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        edited_at TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE,
        is_locked BOOLEAN DEFAULT FALSE
      );
      
      CREATE INDEX ix_posts_created_at ON posts(created_at);
      CREATE INDEX ix_posts_score ON posts(score);
      CREATE INDEX ix_posts_author_id ON posts(author_id);
    `);
    
    // Drop and recreate comments table to fix schema mismatch
    console.log('Dropping and recreating comments table...');
    await client.query('DROP TABLE IF EXISTS comments CASCADE');
    
    // Create comments table with correct schema
    await client.query(`
      CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        body TEXT NOT NULL,
        author_id INTEGER NOT NULL REFERENCES users(id),
        post_id INTEGER NOT NULL REFERENCES posts(id),
        parent_id INTEGER REFERENCES comments(id),
        depth INTEGER DEFAULT 0,
        score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        edited_at TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE
      );
      
      CREATE INDEX ix_comments_created_at ON comments(created_at);
      CREATE INDEX ix_comments_post_id ON comments(post_id);
      CREATE INDEX ix_comments_author_id ON comments(author_id);
      CREATE INDEX ix_comments_parent_id ON comments(parent_id);
    `);
    
    // Create votes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS votes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        value INTEGER NOT NULL CHECK (value IN (-1, 1)),
        votable_type VARCHAR(50) NOT NULL,
        votable_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, votable_type, votable_id)
      );
      
      CREATE INDEX IF NOT EXISTS ix_votes_user_id ON votes(user_id);
      CREATE INDEX IF NOT EXISTS ix_votes_votable_id ON votes(votable_id);
      CREATE INDEX IF NOT EXISTS ix_votes_votable_type ON votes(votable_type);
    `);
    
    // Create saved_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS saved_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        item_type VARCHAR(50) NOT NULL,
        item_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, item_type, item_id)
      );
      
      CREATE INDEX IF NOT EXISTS ix_saved_items_user_id ON saved_items(user_id);
      CREATE INDEX IF NOT EXISTS ix_saved_items_item_id ON saved_items(item_id);
      CREATE INDEX IF NOT EXISTS ix_saved_items_item_type ON saved_items(item_type);
    `);
    
    // Get table list
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    // Create admin user if no admin exists
    const adminCheck = await client.query('SELECT COUNT(*) as count FROM users WHERE is_admin = true');
    const adminCount = parseInt(adminCheck.rows[0].count);

    if (adminCount === 0) {
      const bcrypt = require('bcryptjs');
      const adminPassword = await bcrypt.hash('admin123', 10);
      
      await client.query(`
        INSERT INTO users (username, email, hashed_password, is_admin, is_verified, created_at, updated_at)
        VALUES ($1, $2, $3, true, true, NOW(), NOW())
      `, ['admin', 'admin@via-forum.dk', adminPassword]);
    }

    // Insert welcome post if posts table is empty
    const postsCheck = await client.query('SELECT COUNT(*) as count FROM posts');
    const postCount = parseInt(postsCheck.rows[0].count);

    if (postCount === 0) {
      await client.query(`
        INSERT INTO posts (title, content, author_id, created_at, updated_at, score, comment_count, type)
        VALUES ($1, $2, $3, NOW(), NOW(), 1, 0, 'text')
      `, [
        'Velkommen til VIA Pædagoger Forum!',
        `Dette forum er nu migreret til helt gratis hosting på Vercel + Supabase. Alt funktionalitet er bevaret og du kan nu oprette posts, kommentere og interagere med andre pædagogstuderende på VIA University College!

**Nye funktioner:**
- 🆓 Komplet gratis hosting (fra $43/måned til $0!)
- ⚡ Hurtigere loading på Vercel  
- 🔒 Sikker database på Supabase
- 📱 Samme brugervenlige interface

Log ind eller opret en bruger for at deltage i diskussioner!

**Admin login:** username: admin, password: admin123`,
        1
      ]);
    }

    await client.end();
    
    // Get final counts
    const finalClient = new Client({ connectionString: process.env.DATABASE_URL });
    await finalClient.connect();
    const finalPostsCheck = await finalClient.query('SELECT COUNT(*) as count FROM posts');
    const finalUsersCheck = await finalClient.query('SELECT COUNT(*) as count FROM users');
    await finalClient.end();
    
    res.status(200).json({
      success: true,
      message: 'Database schema created successfully!',
      tables: result.rows.map(row => row.table_name),
      data: {
        users: parseInt(finalUsersCheck.rows[0].count),
        posts: parseInt(finalPostsCheck.rows[0].count)
      }
    });
    
  } catch (error) {
    console.error('Database setup error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};