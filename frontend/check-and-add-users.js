const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

// Hvis brugere ikke findes, tilføj dem direkte
const newUsers = [
  'Sarah_VIA24', 'Jonas_Pæd25', 'Marie_VIA_AH', 'Kasper_P2025', 'Laura_VIAstud',
  'Mathias_VIA23', 'Amalie_Pæd4', 'Oliver_VIAcampus', 'Emma_Pædstud', 'Lucas_VIA25',
  'Isabella_VIA24', 'William_Pæd23', 'Freja_VIAstudent', 'Victor_P25', 'Alma_VIA_study',
  'Noah_VIApæd', 'Clara_Pædagog24', 'Magnus_VIA23', 'Liv_Pædstudent', 'Elias_VIA25',
  'Agnes_VIApæd24', 'Oscar_Pædagog23', 'Astrid_VIA_stud', 'August_P25', 'Aya_VIAstudent',
  'Arthur_Pæd24', 'Ester_VIA25', 'Malthe_VIApæd', 'Nora_Pædstud23', 'Felix_VIA24',
  'Josephine_P25', 'Viggo_VIAstudent', 'Karla_Pæd24', 'Storm_VIA23', 'Maja_VIApæd',
  'Anton_Pædstudent', 'Celina_VIA25', 'Theo_P24', 'Rosa_VIAstud', 'Emil_Pæd23',
  'Sofie_VIA_25', 'Alexander_Pæd', 'Andrea_VIAstudent', 'Benjamin_P24', 'Caroline_VIA23',
  'Daniel_Pædstud', 'Elisabeth_VIA25', 'Frederik_P23', 'Gabrielle_VIApæd', 'Henrik_VIA24',
  'Katrine_VIA24', 'Mikkel_Pæd25', 'Anna_VIAstud', 'Christian_P24', 'Sofie_VIA23',
  'Marcus_Pædstud', 'Julie_VIA25', 'Tobias_P24', 'Cecilie_VIA23', 'Nikolaj_Pæd25'
];

async function checkAndAddUsers() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('🔍 Checking current user count and adding missing users...\n');
    
    // Check current user count
    const currentUsersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`Current users: ${currentUsersResult.rows[0].count}`);
    
    // Add missing users with different IDs
    let addedCount = 0;
    for (let i = 0; i < newUsers.length; i++) {
      const username = newUsers[i];
      const email = `${username.toLowerCase().replace(/_/g, '.')}@via.dk`;
      
      // Check if user exists
      const existsResult = await client.query('SELECT id FROM users WHERE username = $1', [username]);
      
      if (existsResult.rows.length === 0) {
        try {
          // Add user with high ID to avoid conflicts
          const userId = 100 + i;
          await client.query(`
            INSERT INTO users (id, username, email, password, is_verified, is_admin, created_at, updated_at)
            VALUES ($1, $2, $3, 'hashedpassword', true, false, NOW() - INTERVAL '${Math.floor(Math.random() * 60)} days', NOW())
          `, [userId, username, email]);
          addedCount++;
        } catch (error) {
          console.log(`Skipping ${username}: ${error.message}`);
        }
      }
    }
    
    console.log(`Added ${addedCount} new users`);
    
    // Update sequence for future inserts
    await client.query("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))");
    
    // Get final user count
    const finalUsersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`Total users now: ${finalUsersResult.rows[0].count}`);
    
    // Now update scores with all users
    console.log('\n=== UPDATING ALL SCORES ===');
    
    // Update post scores
    const postScoresResult = await client.query(`
      SELECT p.id, p.title, COALESCE(SUM(v.value), 0) as total_score
      FROM posts p
      LEFT JOIN votes v ON v.votable_type = 'post' AND v.votable_id = p.id
      WHERE p.created_at > NOW() - INTERVAL '1 day'
      GROUP BY p.id, p.title
    `);
    
    for (const post of postScoresResult.rows) {
      await client.query('UPDATE posts SET score = $1 WHERE id = $2', [post.total_score, post.id]);
    }
    
    // Update comment scores  
    const commentScoresResult = await client.query(`
      SELECT c.id, COALESCE(SUM(v.value), 0) as total_score
      FROM comments c
      LEFT JOIN votes v ON v.votable_type = 'comment' AND v.votable_id = c.id
      WHERE c.created_at > NOW() - INTERVAL '1 day'
      GROUP BY c.id
    `);
    
    for (const comment of commentScoresResult.rows) {
      await client.query('UPDATE comments SET score = $1 WHERE id = $2', [comment.total_score, comment.id]);
    }
    
    // Update comment counts
    const commentCountsResult = await client.query(`
      SELECT p.id, COUNT(c.id) as comment_count
      FROM posts p
      LEFT JOIN comments c ON c.post_id = p.id AND c.created_at > NOW() - INTERVAL '1 day'
      WHERE p.created_at > NOW() - INTERVAL '1 day'
      GROUP BY p.id
    `);
    
    for (const post of commentCountsResult.rows) {
      await client.query('UPDATE posts SET comment_count = $1 WHERE id = $2', [post.comment_count, post.id]);
    }
    
    console.log('All scores and counts updated!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkAndAddUsers();