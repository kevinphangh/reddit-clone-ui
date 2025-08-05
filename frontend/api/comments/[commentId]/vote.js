const { Client } = require('pg');
const jwt = require('jsonwebtoken');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  const { commentId } = req.query;
  const { vote_value } = req.query;

  if (!commentId || !vote_value) {
    return res.status(400).json({ detail: 'Comment ID and vote_value are required' });
  }

  const voteValue = parseInt(vote_value);
  if (voteValue !== 1 && voteValue !== -1) {
    return res.status(400).json({ detail: 'Vote value must be 1 or -1' });
  }

  // Get JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Authentication required' });
  }

  const token = authHeader.substring(7);
  let userId;
  
  try {
    const decoded = jwt.verify(token, 'your-secret-key-here-make-it-long-and-secure');
    userId = decoded.user_id;
  } catch (error) {
    return res.status(401).json({ detail: 'Invalid token' });
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();

    // Check if comment exists
    const commentCheck = await client.query('SELECT id FROM comments WHERE id = $1 AND is_deleted = false', [parseInt(commentId)]);
    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ detail: 'Comment not found' });
    }

    // Check if user already voted on this comment
    const existingVote = await client.query(
      'SELECT value FROM votes WHERE user_id = $1 AND votable_type = $2 AND votable_id = $3',
      [userId, 'comment', parseInt(commentId)]
    );

    if (existingVote.rows.length > 0) {
      const currentVote = existingVote.rows[0].value;
      
      if (currentVote === voteValue) {
        // Remove vote (toggle off)
        await client.query(
          'DELETE FROM votes WHERE user_id = $1 AND votable_type = $2 AND votable_id = $3',
          [userId, 'comment', parseInt(commentId)]
        );
        voteValue = null; // No vote
      } else {
        // Update vote
        await client.query(
          'UPDATE votes SET value = $1 WHERE user_id = $2 AND votable_type = $3 AND votable_id = $4',
          [voteValue, userId, 'comment', parseInt(commentId)]
        );
      }
    } else {
      // Create new vote
      await client.query(
        'INSERT INTO votes (user_id, votable_type, votable_id, value) VALUES ($1, $2, $3, $4)',
        [userId, 'comment', parseInt(commentId), voteValue]
      );
    }

    // Get updated score
    const scoreResult = await client.query(
      'SELECT COALESCE(SUM(value), 0) as score FROM votes WHERE votable_type = $1 AND votable_id = $2',
      ['comment', parseInt(commentId)]
    );

    const newScore = parseInt(scoreResult.rows[0].score);

    return res.status(200).json({
      score: newScore,
      user_vote: voteValue
    });

  } catch (error) {
    console.error('Error in comment vote endpoint:', error);
    return res.status(500).json({ detail: 'Internal server error' });
  } finally {
    await client.end();
  }
};