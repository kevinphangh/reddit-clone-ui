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
    
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Brugernavn og adgangskode påkrævet' });
    }
    
    // Check if username is email or username
    const isEmail = username.includes('@');
    const query = isEmail 
      ? 'SELECT * FROM users WHERE email = $1'
      : 'SELECT * FROM users WHERE username = $1';
    
    const result = await client.query(query, [username]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Ugyldig brugernavn eller adgangskode' });
    }
    
    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Ugyldig brugernavn eller adgangskode' });
    }
    
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
    
    res.status(200).json({
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server fejl' });
  } finally {
    await client.end();
  }
};