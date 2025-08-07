const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

async function analyzeForumContent() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to Supabase database ✅\n');
    
    // Get all users with their activity
    console.log('=== USER ANALYSIS ===');
    const usersResult = await client.query(`
      SELECT u.id, u.username, u.email,
             COUNT(DISTINCT p.id) as post_count,
             COUNT(DISTINCT c.id) as comment_count
      FROM users u
      LEFT JOIN posts p ON p.author_id = u.id
      LEFT JOIN comments c ON c.author_id = u.id
      GROUP BY u.id, u.username, u.email
      ORDER BY u.id
    `);
    
    console.log('All users and their activity:');
    usersResult.rows.forEach(user => {
      console.log(`${user.id}: ${user.username} (${user.post_count} posts, ${user.comment_count} comments)`);
    });
    
    // Get all posts with their details
    console.log('\n=== POST ANALYSIS ===');
    const postsResult = await client.query(`
      SELECT p.id, p.title, p.content, p.author_id, u.username,
             p.comment_count, p.score, p.created_at,
             COUNT(c.id) as actual_comments
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN comments c ON c.post_id = p.id
      GROUP BY p.id, p.title, p.content, p.author_id, u.username, p.comment_count, p.score, p.created_at
      ORDER BY p.created_at DESC
      LIMIT 15
    `);
    
    console.log(`\nRecent ${postsResult.rows.length} posts:`);
    for (const post of postsResult.rows) {
      console.log(`\n📝 POST ${post.id}: "${post.title}"`);
      console.log(`   Author: ${post.username} (ID: ${post.author_id})`);
      console.log(`   Score: ${post.score}, Comments: ${post.comment_count}/${post.actual_comments}`);
      console.log(`   Content preview: ${post.content.substring(0, 100)}...`);
      
      // Get comments for this post
      const commentsResult = await client.query(`
        SELECT c.body, u.username, c.author_id, c.score
        FROM comments c
        JOIN users u ON c.author_id = u.id
        WHERE c.post_id = $1
        ORDER BY c.created_at ASC
      `, [post.id]);
      
      if (commentsResult.rows.length > 0) {
        console.log(`   💬 Comments (${commentsResult.rows.length}):`);
        commentsResult.rows.forEach((comment, idx) => {
          console.log(`      ${idx + 1}. ${comment.username}: "${comment.body.substring(0, 80)}..." (Score: ${comment.score})`);
        });
      }
    }
    
    // Check for username patterns
    console.log('\n=== USERNAME VARIETY ANALYSIS ===');
    const activeUsers = usersResult.rows.filter(u => u.post_count > 0 || u.comment_count > 0);
    console.log(`Active users: ${activeUsers.length}`);
    console.log('Username patterns:');
    activeUsers.forEach(user => {
      console.log(`- ${user.username}`);
    });
    
    // Check vote distribution
    console.log('\n=== VOTE DISTRIBUTION ANALYSIS ===');
    const voteResult = await client.query(`
      SELECT votable_type, 
             SUM(CASE WHEN value = 1 THEN 1 ELSE 0 END) as upvotes,
             SUM(CASE WHEN value = -1 THEN 1 ELSE 0 END) as downvotes,
             COUNT(*) as total_votes
      FROM votes
      GROUP BY votable_type
    `);
    
    voteResult.rows.forEach(row => {
      const upvotePercent = ((row.upvotes / row.total_votes) * 100).toFixed(1);
      console.log(`${row.votable_type}s: ${row.upvotes} upvotes (${upvotePercent}%), ${row.downvotes} downvotes, ${row.total_votes} total`);
    });
    
  } catch (error) {
    console.error('❌ Error analyzing content:', error.message);
  } finally {
    await client.end();
  }
}

analyzeForumContent();