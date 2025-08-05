const { Client } = require('pg');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    
    // Make kevinphangh@outlook.com admin
    const result = await client.query(
      'UPDATE users SET is_admin = true WHERE email = $1 RETURNING id, username, email, is_admin',
      ['kevinphangh@outlook.com']
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    res.status(200).json({
      success: true,
      message: 'User updated to admin',
      user: user
    });
    
  } catch (error) {
    console.error('Make admin error:', error);
    res.status(500).json({ error: 'Server fejl' });
  } finally {
    await client.end();
  }
};