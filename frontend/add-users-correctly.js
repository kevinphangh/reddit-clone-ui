const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

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
  'Katrine_VIA24', 'Mikkel_Pæd25', 'Anna_VIAstud', 'Christian_P24', 'Sofie_VIA23'
];

async function addUsersCorrectly() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('👥 Adding users with correct schema...\n');
    
    let addedCount = 0;
    for (let i = 0; i < newUsers.length; i++) {
      const username = newUsers[i];
      const email = `${username.toLowerCase().replace(/_/g, '.')}@via.dk`;
      
      // Check if user exists
      const existsResult = await client.query('SELECT id FROM users WHERE username = $1', [username]);
      
      if (existsResult.rows.length === 0) {
        try {
          await client.query(`
            INSERT INTO users (username, email, hashed_password, is_verified, is_admin, is_active, created_at)
            VALUES ($1, $2, '$2a$10$defaulthash', true, false, true, NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days')
          `, [username, email]);
          addedCount++;
          console.log(`✅ Added: ${username}`);
        } catch (error) {
          console.log(`❌ Failed to add ${username}: ${error.message}`);
        }
      } else {
        console.log(`⏭️ Already exists: ${username}`);
      }
    }
    
    console.log(`\n🎉 Successfully added ${addedCount} new users!`);
    
    // Get final user count
    const finalUsersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`Total users now: ${finalUsersResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

addUsersCorrectly();