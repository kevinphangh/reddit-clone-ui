const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

async function analyzeDatabaseSize() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('📊 DATABASE SIZE ANALYSIS\n');
    
    // Get table sizes
    const tableSizeResult = await client.query(`
      SELECT 
        schemaname,
        tablename,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
        pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
      FROM pg_tables 
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
      ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
    `);
    
    console.log('📋 TABLE SIZES (Largest to Smallest):');
    let totalBytes = 0;
    tableSizeResult.rows.forEach((table, idx) => {
      totalBytes += parseInt(table.size_bytes);
      console.log(`   ${idx + 1}. ${table.tablename}: ${table.size} (${(table.size_bytes / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    console.log(`\n💾 TOTAL DATABASE SIZE: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
    
    // Count records in each table
    console.log('\n📊 RECORD COUNTS:');
    
    const counts = {
      users: await client.query('SELECT COUNT(*) as count FROM users'),
      posts: await client.query('SELECT COUNT(*) as count FROM posts'),
      comments: await client.query('SELECT COUNT(*) as count FROM comments'),
      votes: await client.query('SELECT COUNT(*) as count FROM votes')
    };
    
    Object.entries(counts).forEach(([table, result]) => {
      console.log(`   ${table}: ${result.rows[0].count} records`);
    });
    
    // Analyze content sizes
    console.log('\n📝 CONTENT SIZE ANALYSIS:');
    
    // Average post content length
    const postContentResult = await client.query(`
      SELECT 
        AVG(LENGTH(title)) as avg_title_length,
        AVG(LENGTH(content)) as avg_content_length,
        MAX(LENGTH(content)) as max_content_length,
        SUM(LENGTH(title) + LENGTH(content)) as total_post_chars
      FROM posts
    `);
    
    const postStats = postContentResult.rows[0];
    console.log(`   Posts:`);
    console.log(`     - Average title: ${Math.round(postStats.avg_title_length)} characters`);
    console.log(`     - Average content: ${Math.round(postStats.avg_content_length)} characters`);
    console.log(`     - Longest post: ${postStats.max_content_length} characters`);
    console.log(`     - Total post text: ${Math.round(postStats.total_post_chars / 1024)} KB`);
    
    // Average comment content length
    const commentContentResult = await client.query(`
      SELECT 
        AVG(LENGTH(body)) as avg_comment_length,
        MAX(LENGTH(body)) as max_comment_length,
        SUM(LENGTH(body)) as total_comment_chars
      FROM comments
    `);
    
    const commentStats = commentContentResult.rows[0];
    console.log(`   Comments:`);
    console.log(`     - Average length: ${Math.round(commentStats.avg_comment_length)} characters`);
    console.log(`     - Longest comment: ${commentStats.max_comment_length} characters`);
    console.log(`     - Total comment text: ${Math.round(commentStats.total_comment_chars / 1024)} KB`);
    
    // What's taking up space?
    console.log('\n🔍 SPACE USAGE BREAKDOWN:');
    
    const totalTextKB = Math.round((postStats.total_post_chars + commentStats.total_comment_chars) / 1024);
    const totalVotes = counts.votes.rows[0].count;
    const totalUsers = counts.users.rows[0].count;
    
    console.log(`   📝 Text Content: ~${totalTextKB} KB`);
    console.log(`   🗳️ Votes: ${totalVotes} records (~${Math.round(totalVotes * 32 / 1024)} KB)`);
    console.log(`   👥 Users: ${totalUsers} records (~${Math.round(totalUsers * 200 / 1024)} KB)`);
    console.log(`   🗂️ Indexes & Metadata: ~${Math.round((totalBytes - (totalTextKB * 1024) - (totalVotes * 32) - (totalUsers * 200)) / 1024)} KB`);
    
    // What's likely causing the size
    console.log('\n🎯 SIZE ANALYSIS:');
    
    if (totalBytes > 10 * 1024 * 1024) { // > 10MB
      console.log('   ⚠️  Database is larger than expected!');
      
      // Check for potential space wasters
      const duplicateCheck = await client.query(`
        SELECT COUNT(*) as duplicate_posts 
        FROM (
          SELECT title, content, COUNT(*) 
          FROM posts 
          GROUP BY title, content 
          HAVING COUNT(*) > 1
        ) duplicates
      `);
      
      if (duplicateCheck.rows[0].duplicate_posts > 0) {
        console.log(`   🔄 Found ${duplicateCheck.rows[0].duplicate_posts} potential duplicate posts`);
      }
      
      // Check for very long content
      const longContentResult = await client.query(`
        SELECT COUNT(*) as long_posts 
        FROM posts 
        WHERE LENGTH(content) > 5000
      `);
      
      if (longContentResult.rows[0].long_posts > 0) {
        console.log(`   📄 Found ${longContentResult.rows[0].long_posts} very long posts (>5000 chars)`);
      }
      
    } else {
      console.log('   ✅ Database size is reasonable for the content amount');
    }
    
    // Estimate growth
    console.log('\n📈 GROWTH ESTIMATES:');
    const postsPerDay = counts.posts.rows[0].count / 7; // Assuming posts are from last week
    const commentsPerPost = counts.comments.rows[0].count / counts.posts.rows[0].count;
    
    console.log(`   Current rate: ~${Math.round(postsPerDay)} posts/day`);
    console.log(`   Average: ${Math.round(commentsPerPost)} comments per post`);
    
    const monthlyGrowthMB = (postsPerDay * 30 * (postStats.avg_content_length + postStats.avg_title_length + 
                            commentsPerPost * commentStats.avg_comment_length)) / 1024 / 1024;
    
    console.log(`   Estimated monthly growth: ~${monthlyGrowthMB.toFixed(2)} MB`);
    console.log(`   Time to 500MB limit: ~${Math.round((500 - totalBytes/1024/1024) / monthlyGrowthMB)} months`);
    
  } catch (error) {
    console.error('❌ Error analyzing database:', error.message);
  } finally {
    await client.end();
  }
}

analyzeDatabaseSize();