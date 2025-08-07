const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

async function addRealisticTimestamps() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('⏰ Adding realistic time variations to posts and comments...\n');
    
    // Get all recent posts
    const postsResult = await client.query(`
      SELECT id, title, created_at FROM posts 
      WHERE created_at > NOW() - INTERVAL '1 day'
      ORDER BY created_at DESC
    `);
    
    console.log('📝 Updating post creation times with realistic variations...');
    
    // Spread posts over last 5 days with realistic patterns
    for (let i = 0; i < postsResult.rows.length; i++) {
      const post = postsResult.rows[i];
      
      // Generate realistic post times:
      // - Most posts during typical study hours (8-22)
      // - Some late night posts (students staying up)
      // - Spread over 2-5 days ago
      
      const daysAgo = Math.floor(Math.random() * 4) + 1; // 1-4 days ago
      const hour = generateRealisticHour(); // Peak times for student activity
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);
      
      const newCreateTime = `NOW() - INTERVAL '${daysAgo} days' - INTERVAL '${24-hour} hours' - INTERVAL '${minute} minutes' - INTERVAL '${second} seconds'`;
      
      await client.query(`
        UPDATE posts 
        SET created_at = ${newCreateTime}, updated_at = ${newCreateTime}
        WHERE id = $1
      `, [post.id]);
      
      console.log(`   ✅ "${post.title}" - Nu ${daysAgo} dage, ${hour}:${minute.toString().padStart(2, '0')} siden`);
    }
    
    // Get all recent comments
    const commentsResult = await client.query(`
      SELECT c.id, c.post_id, c.created_at, p.created_at as post_created, p.title
      FROM comments c
      JOIN posts p ON c.post_id = p.id
      WHERE c.created_at > NOW() - INTERVAL '1 day'
      ORDER BY c.post_id, c.created_at ASC
    `);
    
    console.log('\n💬 Updating comment times to be realistic after their posts...');
    
    // Group comments by post
    const commentsByPost = {};
    commentsResult.rows.forEach(comment => {
      if (!commentsByPost[comment.post_id]) {
        commentsByPost[comment.post_id] = [];
      }
      commentsByPost[comment.post_id].push(comment);
    });
    
    // Update each comment to be after its post with realistic delays
    for (const [postId, comments] of Object.entries(commentsByPost)) {
      const postInfo = comments[0]; // Get post info from first comment
      
      console.log(`   📝 Post: "${postInfo.title}"`);
      
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        
        // Comments come after posts with realistic delays:
        // - First comment: 30 min - 8 hours after post
        // - Subsequent comments: 10 min - 4 hours after previous
        
        let delayHours, delayMinutes;
        
        if (i === 0) {
          // First comment: 30min - 8 hours after post
          delayHours = Math.floor(Math.random() * 8);
          delayMinutes = Math.floor(Math.random() * 60) + 30;
        } else {
          // Subsequent comments: 10min - 4 hours after previous
          delayHours = Math.floor(Math.random() * 4);
          delayMinutes = Math.floor(Math.random() * 60) + 10;
        }
        
        const totalMinutes = delayHours * 60 + delayMinutes;
        
        // Base time on post creation or previous comment
        let baseTime;
        if (i === 0) {
          baseTime = `(SELECT created_at FROM posts WHERE id = ${postId})`;
        } else {
          baseTime = `(SELECT created_at FROM comments WHERE id = ${comments[i-1].id})`;
        }
        
        const newCommentTime = `${baseTime} + INTERVAL '${totalMinutes} minutes'`;
        
        await client.query(`
          UPDATE comments 
          SET created_at = ${newCommentTime}, updated_at = ${newCommentTime}
          WHERE id = $1
        `, [comment.id]);
        
        console.log(`      💬 Kommentar ${i+1}: +${Math.floor(totalMinutes/60)}t ${totalMinutes%60}m efter ${i === 0 ? 'post' : 'forrige kommentar'}`);
      }
    }
    
    // Update vote timestamps to be after posts/comments
    console.log('\n🗳️ Updating vote timestamps...');
    
    await client.query(`
      UPDATE votes 
      SET created_at = (
        CASE 
          WHEN votable_type = 'post' THEN (
            SELECT p.created_at + (RANDOM() * INTERVAL '2 days')
            FROM posts p 
            WHERE p.id = votes.votable_id
          )
          WHEN votable_type = 'comment' THEN (
            SELECT c.created_at + (RANDOM() * INTERVAL '1 day')
            FROM comments c 
            WHERE c.id = votes.votable_id
          )
        END
      )
      WHERE created_at > NOW() - INTERVAL '1 day'
    `);
    
    console.log('   ✅ Stemmer nu spredt realistisk efter posts/kommentarer');
    
    // Show final timeline
    console.log('\n📅 FINAL TIMELINE OVERVIEW:');
    const timelineResult = await client.query(`
      SELECT 
        'post' as type,
        id,
        title as content,
        created_at,
        (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) as responses
      FROM posts 
      WHERE created_at > NOW() - INTERVAL '7 days'
      
      UNION ALL
      
      SELECT 
        'comment' as type,
        c.id,
        LEFT(c.body, 50) || '...' as content,
        c.created_at,
        0 as responses
      FROM comments c
      WHERE c.created_at > NOW() - INTERVAL '7 days'
      
      ORDER BY created_at DESC
      LIMIT 15
    `);
    
    timelineResult.rows.forEach((item, idx) => {
      const timeAgo = calculateTimeAge(item.created_at);
      const icon = item.type === 'post' ? '📝' : '💬';
      console.log(`   ${idx + 1}. ${icon} ${timeAgo}: "${item.content.substring(0, 60)}..."`);
    });
    
    console.log('\n⏰ REALISTIC TIMESTAMPS ADDED!');
    console.log('   ✅ Posts spread naturally over flere dage');
    console.log('   ✅ Kommentarer kommer efter posts med realistiske delays');
    console.log('   ✅ Stemmer spread efter content creation');
    console.log('   ✅ Timeline ligner nu et ægte aktivt forum!');
    
  } catch (error) {
    console.error('❌ Error adding timestamps:', error.message);
  } finally {
    await client.end();
  }
}

function generateRealisticHour() {
  // Simulate student activity patterns:
  // Peak: 10-12, 14-16, 19-22 (study periods)
  // Low: 1-7 (sleeping), 12-13 (lunch), 16-18 (dinner/free time)
  // Late night: 23-24 (some night owls)
  
  const random = Math.random();
  
  if (random < 0.3) {
    // Morning study period (8-12)
    return 8 + Math.floor(Math.random() * 4);
  } else if (random < 0.5) {
    // Afternoon study (14-17)
    return 14 + Math.floor(Math.random() * 3);
  } else if (random < 0.8) {
    // Evening study/activity (19-22) 
    return 19 + Math.floor(Math.random() * 3);
  } else if (random < 0.9) {
    // Late night (23-24)
    return 23 + Math.floor(Math.random() * 2);
  } else {
    // Random other hours (lunch, dinner, etc)
    return Math.floor(Math.random() * 24);
  }
}

function calculateTimeAge(timestamp) {
  const now = new Date();
  const created = new Date(timestamp);
  const diffMs = now - created;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} dag${diffDays > 1 ? 'e' : ''} siden`;
  } else if (diffHours > 0) {
    return `${diffHours} time${diffHours > 1 ? 'r' : ''} siden`;
  } else {
    const diffMin = Math.floor(diffMs / (1000 * 60));
    return `${diffMin} min siden`;
  }
}

addRealisticTimestamps();