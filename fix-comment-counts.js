const { Client } = require('./frontend/node_modules/pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

async function fixCommentCounts() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to Supabase database ✅');
    
    // Get all posts with their actual comment counts
    const result = await client.query(`
      SELECT 
        p.id, 
        p.title, 
        p.comment_count as stored_count,
        COUNT(c.id) as actual_count
      FROM posts p
      LEFT JOIN comments c ON c.post_id = p.id AND c.is_deleted = false
      GROUP BY p.id, p.title, p.comment_count
      HAVING p.comment_count != COUNT(c.id)
      ORDER BY p.created_at DESC
    `);
    
    console.log(`Found ${result.rows.length} posts with incorrect comment counts:\n`);
    
    for (const post of result.rows) {
      console.log(`"${post.title}"`);
      console.log(`  Stored: ${post.stored_count}, Actual: ${post.actual_count}`);
      
      // Fix the comment count
      await client.query(`
        UPDATE posts 
        SET comment_count = $1 
        WHERE id = $2
      `, [post.actual_count, post.id]);
      
      console.log(`  ✅ Fixed to ${post.actual_count}\n`);
    }
    
    console.log('🎉 All comment counts have been corrected!');
    
  } catch (error) {
    console.error('❌ Error fixing comment counts:', error.message);
  } finally {
    await client.end();
  }
}

fixCommentCounts();