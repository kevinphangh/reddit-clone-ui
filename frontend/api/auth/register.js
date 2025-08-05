const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Alle felter er påkrævet' });
    }
    
    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Brugernavn eller email findes allerede' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await client.query(
      `INSERT INTO users (username, email, hashed_password, is_active, is_verified, created_at)
       VALUES ($1, $2, $3, true, true, NOW())
       RETURNING id, username, email, is_admin, is_verified`,
      [username, email, hashedPassword]
    );
    
    const user = result.rows[0];
    
    // Create JWT token
    const token = jwt.sign(
      { 
        user_id: user.id, 
        username: user.username,
        is_admin: user.is_admin 
      },
      process.env.SECRET_KEY,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        is_verified: user.is_verified
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server fejl' });
  } finally {
    await client.end();
  }
};