const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

async function fixUnrealisticTimestamps() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('🔧 FIXING UNREALISTIC TIMESTAMPS...\n');
    
    // Fix posts created at unrealistic times (2-6 AM)
    console.log('📝 Fixing posts created at night/very early morning...');
    
    const unrealisticPosts = await client.query(`
      SELECT id, title, created_at,
        EXTRACT(HOUR FROM created_at) as hour
      FROM posts 
      WHERE EXTRACT(HOUR FROM created_at) BETWEEN 2 AND 6
      ORDER BY created_at DESC
    `);
    
    for (const post of unrealisticPosts.rows) {
      // Move to realistic student hours (8-22)
      const newHour = generateRealisticStudentHour();
      const randomMinutes = Math.floor(Math.random() * 60);
      
      await client.query(`
        UPDATE posts 
        SET created_at = DATE_TRUNC('day', created_at) + INTERVAL '${newHour} hours' + INTERVAL '${randomMinutes} minutes',
            updated_at = DATE_TRUNC('day', created_at) + INTERVAL '${newHour} hours' + INTERVAL '${randomMinutes} minutes'
        WHERE id = $1
      `, [post.id]);
      
      console.log(`   ✅ "${post.title}" - Moved from ${post.hour}:xx to ${newHour}:${randomMinutes.toString().padStart(2, '0')}`);
    }
    
    // Spread out comments that are all clustered at the same time
    console.log('\n💬 Spreading out clustered comments...');
    
    // Find comments that are too clustered (same hour with many comments)
    const clusteredComments = await client.query(`
      SELECT 
        c.id, c.post_id, c.created_at,
        p.created_at as post_created,
        EXTRACT(HOUR FROM c.created_at) as hour,
        COUNT(*) OVER (PARTITION BY EXTRACT(HOUR FROM c.created_at)) as comments_this_hour
      FROM comments c
      JOIN posts p ON c.post_id = p.id
      WHERE c.created_at > NOW() - INTERVAL '7 days'
      ORDER BY c.post_id, c.created_at ASC
    `);
    
    // Group by post and spread comments more naturally
    const commentsByPost = {};
    clusteredComments.rows.forEach(comment => {
      if (!commentsByPost[comment.post_id]) {
        commentsByPost[comment.post_id] = [];
      }
      commentsByPost[comment.post_id].push(comment);
    });
    
    for (const [postId, comments] of Object.entries(commentsByPost)) {
      if (comments.length === 0) continue;
      
      const postCreated = new Date(comments[0].post_created);
      console.log(`\n   📝 Post ${postId}: Spreading ${comments.length} comments naturally...`);
      
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        
        // Create natural delays:
        // First comment: 30min - 4 hours after post
        // Subsequent: 15min - 3 hours after previous comment
        
        let delayMinutes;
        if (i === 0) {
          delayMinutes = Math.floor(Math.random() * 210) + 30; // 30min - 4hours
        } else {
          delayMinutes = Math.floor(Math.random() * 165) + 15; // 15min - 3hours
        }
        
        // Base time calculation
        let baseTime;
        if (i === 0) {
          baseTime = `(SELECT created_at FROM posts WHERE id = ${postId})`;
        } else {
          baseTime = `(SELECT created_at FROM comments WHERE id = ${comments[i-1].id})`;
        }
        
        const newCommentTime = `${baseTime} + INTERVAL '${delayMinutes} minutes'`;
        
        await client.query(`
          UPDATE comments 
          SET created_at = ${newCommentTime},
              updated_at = ${newCommentTime}
          WHERE id = $1
        `, [comment.id]);
        
        const hours = Math.floor(delayMinutes / 60);
        const mins = delayMinutes % 60;
        const delayStr = hours > 0 ? `${hours}t ${mins}m` : `${mins}m`;
        
        console.log(`      💬 Kommentar ${i+1}: +${delayStr} efter ${i === 0 ? 'post' : 'forrige'}`);
      }
    }
    
    // Fix any votes that might be before their content
    console.log('\n🗳️ Fixing vote timestamps...');
    
    await client.query(`
      UPDATE votes 
      SET created_at = (
        CASE 
          WHEN votable_type = 'post' THEN (
            SELECT p.created_at + (RANDOM() * INTERVAL '12 hours') + INTERVAL '10 minutes'
            FROM posts p 
            WHERE p.id = votes.votable_id
          )
          WHEN votable_type = 'comment' THEN (
            SELECT c.created_at + (RANDOM() * INTERVAL '6 hours') + INTERVAL '5 minutes'
            FROM comments c 
            WHERE c.id = votes.votable_id
          )
        END
      )
      WHERE created_at > NOW() - INTERVAL '7 days'
    `);
    
    console.log('   ✅ Stemmer nu spredt realistisk efter deres content');
    
    // Verify the fixes
    console.log('\n🔍 VERIFYING FIXES...');
    
    const hourCheck = await client.query(`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as post_count
      FROM posts 
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `);
    
    console.log('\n⏰ POST DISTRIBUTION BY HOUR (After Fix):');
    hourCheck.rows.forEach(row => {
      console.log(`   ${row.hour.toString().padStart(2, '0')}:xx - ${row.post_count} posts`);
    });
    
    const commentHourCheck = await client.query(`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as comment_count
      FROM comments 
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `);
    
    console.log('\n💬 COMMENT DISTRIBUTION BY HOUR (After Fix):');
    let maxComments = 0;
    commentHourCheck.rows.forEach(row => {
      maxComments = Math.max(maxComments, row.comment_count);
      console.log(`   ${row.hour.toString().padStart(2, '0')}:xx - ${row.comment_count} comments`);
    });
    
    console.log('\n✅ TIMESTAMP FIXES COMPLETED!');
    console.log(`   📝 No more posts at 2-6 AM (unrealistic hours)`);
    console.log(`   💬 Comments spread naturally over time`);
    console.log(`   🗳️ Votes come after their content`);
    console.log(`   ⏰ Max comments per hour: ${maxComments} (much more realistic)`);
    
  } catch (error) {
    console.error('❌ Error fixing timestamps:', error.message);
  } finally {
    await client.end();
  }
}

function generateRealisticStudentHour() {
  // Student activity patterns - NO posts between 2-6 AM!
  const patterns = [
    { weight: 0.25, hours: [8, 9, 10, 11] },      // Morning study
    { weight: 0.15, hours: [12, 13] },            // Lunch break
    { weight: 0.25, hours: [14, 15, 16, 17] },    // Afternoon study
    { weight: 0.20, hours: [19, 20, 21] },        // Evening activity
    { weight: 0.10, hours: [22, 23] },            // Late evening
    { weight: 0.05, hours: [7, 18] }              // Edge hours
  ];
  
  const random = Math.random();
  let cumulative = 0;
  
  for (const pattern of patterns) {
    cumulative += pattern.weight;
    if (random <= cumulative) {
      return pattern.hours[Math.floor(Math.random() * pattern.hours.length)];
    }
  }
  
  // Fallback to common study hours
  return [10, 14, 19][Math.floor(Math.random() * 3)];
}

fixUnrealisticTimestamps();