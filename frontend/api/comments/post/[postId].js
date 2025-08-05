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

  const { postId } = req.query;
  const client = new Client({ connectionString });

  try {
    await client.connect();

    if (req.method === 'GET') {
      // Get comments for a post
      const result = await client.query(`
        SELECT 
          c.id, c.body, c.parent_id, c.created_at, c.updated_at, c.edited_at,
          COALESCE(SUM(v.value), 0) as score, c.depth, c.is_deleted,
          u.id as author_id, u.username as author_username, u.email as author_email,
          u.is_admin as author_is_admin, u.is_verified as author_is_verified,
          u.created_at as author_created_at,
          p.id as post_id, p.title as post_title
        FROM comments c
        JOIN users u ON c.author_id = u.id
        JOIN posts p ON c.post_id = p.id
        LEFT JOIN votes v ON v.votable_type = 'comment' AND v.votable_id = c.id
        WHERE c.post_id = $1
        GROUP BY c.id, c.body, c.parent_id, c.created_at, c.updated_at, c.edited_at,
                 c.depth, c.is_deleted, u.id, u.username, u.email, u.is_admin, 
                 u.is_verified, u.created_at, p.id, p.title
        ORDER BY c.created_at ASC
      `, [parseInt(postId)]);

      const comments = result.rows.map(row => ({
        id: row.id,
        body: row.body,
        parent_id: row.parent_id,
        created_at: row.created_at,
        updated_at: row.updated_at,
        edited_at: row.edited_at,
        score: row.score,
        depth: row.depth,
        is_deleted: row.is_deleted,
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
        },
        post: {
          id: row.post_id,
          title: row.post_title
        }
      }));

      return res.status(200).json(comments);
    }

    if (req.method === 'POST') {
      // Create new comment (temporarily bypassing authentication for testing)
      let userId = 2; // Test user ID

      const { body, parent_id = null } = req.body;
      
      if (!body) {
        return res.status(400).json({ detail: 'Comment body is required' });
      }

      // Calculate depth
      let depth = 0;
      if (parent_id) {
        const parentResult = await client.query('SELECT depth FROM comments WHERE id = $1', [parent_id]);
        if (parentResult.rows.length > 0) {
          depth = parentResult.rows[0].depth + 1;
        }
      }

      // Insert new comment
      const result = await client.query(`
        INSERT INTO comments (body, post_id, author_id, parent_id, depth, created_at, updated_at, score, is_deleted)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), 0, false)
        RETURNING id, body, parent_id, created_at, updated_at, score, depth, is_deleted
      `, [body, parseInt(postId), userId, parent_id, depth]);

      const newComment = result.rows[0];

      // Update post comment count
      await client.query(`
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = $1
      `, [parseInt(postId)]);

      return res.status(201).json({ 
        success: true, 
        comment: {
          id: newComment.id,
          body: newComment.body,
          created_at: newComment.created_at
        }
      });
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