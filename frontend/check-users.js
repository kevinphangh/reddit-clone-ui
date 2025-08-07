const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

async function checkUsers() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to Supabase database ✅');
    
    const result = await client.query('SELECT id, username FROM users ORDER BY id');
    console.log('Available users:');
    result.rows.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();