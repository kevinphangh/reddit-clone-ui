const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

async function updateAllScores() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to Supabase database ✅\n');
    
    // Update comment scores from their votes
    console.log('=== UPDATING COMMENT SCORES ===');
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
    
    console.log(`Updated scores for ${commentScoresResult.rows.length} comments`);
    
    // Update post scores from their votes  
    console.log('\n=== UPDATING POST SCORES ===');
    const postScoresResult = await client.query(`
      SELECT p.id, p.title, COALESCE(SUM(v.value), 0) as total_score
      FROM posts p
      LEFT JOIN votes v ON v.votable_type = 'post' AND v.votable_id = p.id
      WHERE p.created_at > NOW() - INTERVAL '1 day'
      GROUP BY p.id, p.title
    `);
    
    for (const post of postScoresResult.rows) {
      await client.query('UPDATE posts SET score = $1 WHERE id = $2', [post.total_score, post.id]);
      console.log(`"${post.title}" - Score: ${post.total_score}`);
    }
    
    // Show final forum status
    console.log('\n=== FINAL FORUM STATUS ===');
    const finalResult = await client.query(`
      SELECT p.id, p.title, p.score, p.comment_count, u.username as author
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.created_at > NOW() - INTERVAL '1 day'
      ORDER BY p.created_at DESC
    `);
    
    console.log('Recent posts with activity:');
    finalResult.rows.forEach(post => {
      console.log(`📝 "${post.title}" by ${post.author}`);
      console.log(`   Score: ${post.score}, Comments: ${post.comment_count}`);
    });
    
    console.log('\n🎉 All scores updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating scores:', error.message);
  } finally {
    await client.end();
  }
}

updateAllScores();