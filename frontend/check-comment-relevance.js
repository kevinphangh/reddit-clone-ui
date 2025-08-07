const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

async function checkCommentRelevance() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('🔍 Checking if comments actually match their posts...\n');
    
    // Get all recent posts with their comments
    const result = await client.query(`
      SELECT 
        p.id as post_id, p.title as post_title,
        c.id as comment_id, c.body as comment_body,
        u.username as commenter
      FROM posts p
      LEFT JOIN comments c ON c.post_id = p.id AND c.created_at > NOW() - INTERVAL '1 day'
      LEFT JOIN users u ON c.author_id = u.id
      WHERE p.created_at > NOW() - INTERVAL '1 day'
      ORDER BY p.created_at DESC, c.created_at ASC
    `);
    
    let currentPost = null;
    let problemCount = 0;
    
    for (const row of result.rows) {
      // New post
      if (!currentPost || currentPost.id !== row.post_id) {
        if (currentPost) console.log(''); // Space between posts
        
        currentPost = { id: row.post_id, title: row.post_title };
        console.log(`📝 POST: "${row.post_title}"`);
        console.log(`💬 Comments:`);
      }
      
      // Check comment relevance
      if (row.comment_id) {
        const isRelevant = checkIfCommentMatches(row.post_title, row.comment_body);
        const status = isRelevant ? '✅' : '❌';
        
        if (!isRelevant) {
          problemCount++;
        }
        
        console.log(`   ${status} ${row.commenter}: "${row.comment_body.substring(0, 80)}..."`);
      }
    }
    
    console.log(`\n🎯 RELEVANCE CHECK COMPLETE:`);
    console.log(`   ${problemCount} mismatched comments found!`);
    
    if (problemCount > 0) {
      console.log('\n❌ COMMENTS DO NOT MATCH THEIR POSTS!');
      console.log('   Need to fix comment matching logic immediately.');
    } else {
      console.log('\n✅ All comments properly match their posts!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

function checkIfCommentMatches(postTitle, commentBody) {
  const title = postTitle.toLowerCase();
  const comment = commentBody.toLowerCase();
  
  // Check Italien post
  if (title.includes('italien')) {
    return comment.includes('italien') || comment.includes('rom') || comment.includes('milano') || 
           comment.includes('🇮🇹') || comment.includes('italiensk') || comment.includes('firenze');
  }
  
  // Check negative narrativ post
  if (title.includes('bare en pædagog')) {
    return comment.includes('relatere') || comment.includes('far') || comment.includes('standardsvar') || 
           comment.includes('håndtere') || comment.includes('faglighed') || comment.includes('onkel');
  }
  
  // Check specialisering post
  if (title.includes('specialisering')) {
    return comment.includes('lost') || comment.includes('studievejlederne') || comment.includes('børn') || 
           comment.includes('skifte') || comment.includes('mavefornemmelse') || comment.includes('energi');
  }
  
  // Check eksamen posts
  if (title.includes('eksamen') || title.includes('prøvetips')) {
    return comment.includes('flashcards') || comment.includes('tidslinje') || comment.includes('pomodoro') ||
           comment.includes('teoretiker') || comment.includes('læsning') || comment.includes('mor/far') ||
           comment.includes('sensor') || comment.includes('vejret') || comment.includes('teori');
  }
  
  // Check etik/dilemma posts
  if (title.includes('dilemma') || title.includes('whistle') || title.includes('kollegaer svigter')) {
    return comment.includes('situation') || comment.includes('kommunen') || comment.includes('etisk') ||
           comment.includes('dokumenter') || comment.includes('børnenes') || comment.includes('pligt') ||
           comment.includes('pædagog forbund') || comment.includes('juridisk');
  }
  
  // Check myth busters post
  if (title.includes('myth busters')) {
    return comment.includes('listen') || comment.includes('passer børn') || comment.includes('kvindefag') ||
           comment.includes('faciliterer') || comment.includes('mandlige') || comment.includes('diversitet');
  }
  
  // Check Balkan/Sydeuropa post
  if (title.includes('balkan') || title.includes('sydeuropa')) {
    return comment.includes('zagreb') || comment.includes('grækenland') || comment.includes('familiefokus') ||
           comment.includes('udendørspædagogik') || comment.includes('🏛️') || comment.includes('☀️');
  }
  
  // Check udlandsophold post
  if (title.includes('udlandsophold')) {
    return comment.includes('holland') || comment.includes('ændrede') || comment.includes('fortryder') ||
           comment.includes('afsted') || comment.includes('bedste') || comment.includes('uddannelsen');
  }
  
  // If we can't determine, assume it's mismatched
  return false;
}

checkCommentRelevance();