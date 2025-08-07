const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

async function cleanupForum() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to Supabase database ✅\n');
    
    // 1. Find and remove duplicate posts
    console.log('=== REMOVING DUPLICATE POSTS ===');
    const duplicatesQuery = `
      WITH duplicates AS (
        SELECT id, title, author_id, created_at,
               ROW_NUMBER() OVER (PARTITION BY title, author_id ORDER BY created_at DESC) as rn
        FROM posts 
        WHERE created_at > NOW() - INTERVAL '1 day'
      )
      SELECT id, title FROM duplicates WHERE rn > 1
    `;
    
    const duplicatesResult = await client.query(duplicatesQuery);
    console.log(`Found ${duplicatesResult.rows.length} duplicate posts to remove:`);
    
    for (const dup of duplicatesResult.rows) {
      console.log(`Removing duplicate: "${dup.title}" (ID: ${dup.id})`);
      
      // Delete votes for this post
      await client.query('DELETE FROM votes WHERE votable_type = $1 AND votable_id = $2', ['post', dup.id]);
      
      // Delete comments for this post  
      await client.query('DELETE FROM comments WHERE post_id = $1', [dup.id]);
      
      // Delete the post
      await client.query('DELETE FROM posts WHERE id = $1', [dup.id]);
    }
    
    // 2. Delete all mismatched comments (they're all wrong)
    console.log('\n=== REMOVING MISMATCHED COMMENTS ===');
    await client.query(`
      DELETE FROM votes WHERE votable_type = 'comment' AND votable_id IN (
        SELECT id FROM comments WHERE created_at > NOW() - INTERVAL '1 day'
      )
    `);
    
    await client.query("DELETE FROM comments WHERE created_at > NOW() - INTERVAL '1 day'");
    console.log('Removed all recent comments (they were mismatched)');
    
    // 3. Reset post comment counts
    console.log('\n=== RESETTING COMMENT COUNTS ===');
    await client.query(`
      UPDATE posts SET comment_count = 0 
      WHERE created_at > NOW() - INTERVAL '1 day'
    `);
    
    // 4. Update post scores from votes
    console.log('\n=== UPDATING POST SCORES ===');
    const postsResult = await client.query(`
      SELECT p.id, COALESCE(SUM(v.value), 0) as total_score
      FROM posts p
      LEFT JOIN votes v ON v.votable_type = 'post' AND v.votable_id = p.id
      WHERE p.created_at > NOW() - INTERVAL '1 day'
      GROUP BY p.id
    `);
    
    for (const post of postsResult.rows) {
      await client.query('UPDATE posts SET score = $1 WHERE id = $2', [post.total_score, post.id]);
    }
    
    console.log(`Updated scores for ${postsResult.rows.length} posts`);
    
    console.log('\n🎉 Forum cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    await client.end();
  }
}

cleanupForum();