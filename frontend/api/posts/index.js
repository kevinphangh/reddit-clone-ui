const { Client } = require('pg');
const jwt = require('jsonwebtoken');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Debug request body
  console.log('Raw req.body:', req.body);
  console.log('typeof req.body:', typeof req.body);
  console.log('Content-Type:', req.headers['content-type']);
  
  // Parse JSON body for POST requests
  if (req.method === 'POST' && req.headers['content-type'] === 'application/json') {
    try {
      if (typeof req.body === 'string') {
        console.log('Parsing req.body as string...');
        req.body = JSON.parse(req.body);
        console.log('Parsed req.body:', req.body);
      } else if (typeof req.body === 'object' && req.body !== null) {
        console.log('req.body is already an object');
      } else {
        console.log('req.body is not a string or object, type:', typeof req.body);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw body that failed to parse:', req.body);
      return res.status(400).json({ detail: 'Invalid JSON in request body', raw: req.body });
    }
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();

    if (req.method === 'GET') {
      // Get posts with pagination
      const { skip = 0, limit = 10, sort = 'new' } = req.query;
      
      let orderBy = 'p.created_at DESC';
      if (sort === 'hot') {
        orderBy = 'p.score DESC, p.created_at DESC';
      } else if (sort === 'top') {
        orderBy = 'p.score DESC';
      }

      const result = await client.query(`
        SELECT 
          p.id, p.title, p.content, p.created_at, p.updated_at, p.edited_at,
          p.score, p.comment_count, p.is_locked, p.type,
          u.id as author_id, u.username as author_username, u.email as author_email,
          u.is_admin as author_is_admin, u.is_verified as author_is_verified,
          u.created_at as author_created_at
        FROM posts p
        JOIN users u ON p.author_id = u.id
        WHERE p.is_deleted = false
        ORDER BY ${orderBy}
        LIMIT $1 OFFSET $2
      `, [parseInt(limit), parseInt(skip)]);

      const posts = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        content: row.content,
        created_at: row.created_at,
        updated_at: row.updated_at,
        edited_at: row.edited_at,
        score: row.score,
        comment_count: row.comment_count,
        is_locked: row.is_locked,
        type: row.type,
        user_vote: null, // TODO: Add user vote if authenticated
        saved: false, // TODO: Add saved status if authenticated
        author: {
          id: row.author_id,
          username: row.author_username,
          email: row.author_email,
          is_admin: row.author_is_admin,
          is_verified: row.author_is_verified,
          created_at: row.author_created_at,
          points: { post: 0, comment: 0 } // TODO: Calculate actual points
        }
      }));

      return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
      // Create new post (temporarily bypassing authentication for testing)
      let userId = 2; // Test user ID

      console.log('Request body:', req.body);
      
      const { title, content, type = 'text' } = req.body;
      
      console.log('Parsed data:', { title, content, type, userId });
      
      if (!title || !content) {
        return res.status(400).json({ detail: 'Title and content are required' });
      }

      console.log('About to insert post...');
      // Insert new post
      const result = await client.query(`
        INSERT INTO posts (title, content, type, author_id, created_at, updated_at, score, comment_count, is_locked, is_deleted)
        VALUES ($1, $2, $3, $4, NOW(), NOW(), 0, 0, false, false)
        RETURNING id, title, content, created_at, updated_at, score, comment_count, is_locked, type
      `, [title, content, type, userId]);

      console.log('Post inserted, result:', result.rows[0]);

      return res.status(201).json({ success: true, post: result.rows[0] });
    }

    return res.status(405).json({ detail: 'Method not allowed' });

  } catch (error) {
    console.error('Database error:', error);
    console.error('Error details:', error.message, error.stack);
    return res.status(500).json({ detail: 'Database connection failed', error: error.message });
  } finally {
    await client.end();
  }
}