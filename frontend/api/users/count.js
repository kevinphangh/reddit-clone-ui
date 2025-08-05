const { Client } = require('pg');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    
    const result = await client.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    const count = parseInt(result.rows[0].count);
    
    res.status(200).json({ count });
    
  } catch (error) {
    console.error('Users count error:', error);
    res.status(500).json({ error: 'Server fejl' });
  } finally {
    await client.end();
  }
};