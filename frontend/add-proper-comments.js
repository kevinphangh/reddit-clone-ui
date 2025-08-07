const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

// Properly matched comments for each post type
const properComments = {
  "Træt af at høre 'bare en pædagog'": [
    { content: "Jeg kan SÅ godt relatere til det her! Min far spurgte mig forleden om jeg ikke 'bare kunne tage en rigtig uddannelse i stedet' 😤", author_id: 34 },
    { content: "Mit standardsvar er blevet: 'Kan du håndtere 25 børn samtidig, samtidig med at du dokumenterer deres udvikling og støtter forældrene?' Plejer at få dem til at tie stille 😏", author_id: 38 },
    { content: "Vi skal bare blive ved med at vise vores faglighed! Jeg fortalte min onkel om alt det psykologi og neurologi vi lærer - han var helt overrasket", author_id: 42 }
  ],
  "Praktik i Italien": [
    { content: "Jeg var i Rom på udveksling! Det var FANTASTISK! Italienerne er så varme og børnene er mega søde. Du skal bare kunne grundlæggende italiensk 🇮🇹", author_id: 33 },
    { content: "Min veninde var i Milano - hun sagde de arbejder meget mere med hele familien end vi gør herhjemme. Spændende tilgang!", author_id: 40 },
    { content: "Go for it! Jeg fortryder at jeg ikke tog chancen. Det ser vildt godt ud på CV'et og du lærer så meget om forskellige kulturer 🌍", author_id: 44 }
  ],
  "Specialisering": [
    { content: "Samme her! Jeg er helt lost. Måske vi skal tage en snak med studievejlederne? De plejer at have god indsigt", author_id: 36 },
    { content: "Jeg valgte børn fordi jeg elsker den alder, men ærligt? Du kan altid skifte senere. Mange af mine kollegaer har gjort det", author_id: 43 },
    { content: "Tag den specialisering som giver dig mest energi når du tænker på den! Følg din mavefornemmelse - den plejer at have ret 💫", author_id: 41 }
  ],
  "Pædagogisk dilemma": [
    { content: "Det er så svært... Jeg var i samme situation. Til sidst kontaktede jeg kommunen anonymt. Det var det rigtige at gøre for børnenes skyld", author_id: 45 },
    { content: "Du har en etisk forpligtelse! Dokumenter alt og tal med din lærer fra VIA - de kan guide dig gennem processen", author_id: 37 },
    { content: "Jeg ved det er svært, men børnenes tarv kommer først. Altid. Der findes whistleblower-beskyttelse for studerende", author_id: 39 }
  ],
  "Eksamen": [
    { content: "SAME! Jeg laver flashcards til alle teoretikerne - Dewey, Piaget, Vygotsky osv. Det hjælper mig med at huske sammenhængene 📚", author_id: 46 },
    { content: "Mit tip: Lav en stor tidslinje over pædagogikkens historie. Det giver så god mening når du kan se udviklingen visuelt!", author_id: 35 },
    { content: "Jeg studerer 2 timer, pause 30 min. Pomodoro-teknik! Og så MASSER af kaffe ☕. Vi klarer det sammen! 💪", author_id: 40 }
  ],
  "Myth Busters": [
    { content: "LOVE this! En til listen: 'Pædagoger bare passer børn' ❌ Vi faciliterer læring, udvikling og trivsel! 🎯", author_id: 47 },
    { content: "Og den her: 'Det er et kvindefag' ❌ Vi har brug for flere mandlige rollemodeller! Diversitet styrker professionen 👨‍👩‍👧‍👦", author_id: 33 }
  ],
  "Balkan": [
    { content: "Min studiekammerat var i Zagreb! Hun sagde de har meget stærk familiefokus i deres pædagogik. Kunne være spændende at opleve 🏛️", author_id: 34 },
    { content: "Jeg overvejer Grækenland! Har hørt de har nogle innovative tilgange til udendørspædagogik ☀️", author_id: 41 }
  ],
  "whistle-blowe": [
    { content: "Kontakt Dansk Pædagog Forbund - de har juridisk rådgivning til studerende. Du er ikke alene med det her! 📞", author_id: 42 },
    { content: "Jeg stod i lignende situation. Dokumentér ALT og gem kopier hjemme. Det var det der reddede mig senere", author_id: 38 }
  ],
  "Prøvetips": [
    { content: "Øv dig på at forklare teorierne til din mor/far/kæreste. Hvis de forstår det, så gør sensor også! 🗣️", author_id: 37 },
    { content: "Mit bedste trick: Forbind altid teori til konkrete eksempler fra praktik. Sensor ELSKER når vi kan se sammenhængene! ⭐", author_id: 45 },
    { content: "Husk at trække vejret! Jeg tog 10 sekunder pause mellem spørgsmål - det gav mig tid til at tænke klart 🧘‍♀️", author_id: 43 }
  ],
  "Udlandsophold": [
    { content: "JA! Gør det! Jeg var i Holland og det ændrede mit syn på pædagogik fuldstændig. Plus I meet amazing people! 🌍", author_id: 36 },
    { content: "Jeg fortryder at jeg ikke gjorde det. Alle mine venner der tog afsted siger det var det bedste ved hele uddannelsen", author_id: 44 }
  ]
};

async function addProperComments() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to Supabase database ✅\n');
    
    // Get the remaining posts (after cleanup)
    const postsResult = await client.query(`
      SELECT id, title 
      FROM posts 
      WHERE created_at > NOW() - INTERVAL '1 day'
      ORDER BY created_at DESC
    `);
    
    console.log(`Found ${postsResult.rows.length} posts to add proper comments to:\n`);
    
    for (const post of postsResult.rows) {
      console.log(`📝 Adding comments to: "${post.title}"`);
      
      // Find matching comments based on title keywords
      let commentsToAdd = [];
      
      if (post.title.includes('bare en pædagog')) {
        commentsToAdd = properComments["Træt af at høre 'bare en pædagog'"];
      } else if (post.title.includes('Italien')) {
        commentsToAdd = properComments["Praktik i Italien"];
      } else if (post.title.includes('Specialisering')) {
        commentsToAdd = properComments["Specialisering"];
      } else if (post.title.includes('kollegaer svigter')) {
        commentsToAdd = properComments["Pædagogisk dilemma"];
      } else if (post.title.includes('Eksamen') && post.title.includes('PANIK')) {
        commentsToAdd = properComments["Eksamen"];
      } else if (post.title.includes('Myth Busters')) {
        commentsToAdd = properComments["Myth Busters"];
      } else if (post.title.includes('Balkan') || post.title.includes('Sydeuropa')) {
        commentsToAdd = properComments["Balkan"];
      } else if (post.title.includes('whistle-blowe')) {
        commentsToAdd = properComments["whistle-blowe"];
      } else if (post.title.includes('Prøvetips')) {
        commentsToAdd = properComments["Prøvetips"];
      } else if (post.title.includes('Udlandsophold')) {
        commentsToAdd = properComments["Udlandsophold"];
      }
      
      // Add 2-3 relevant comments per post
      const numComments = Math.min(commentsToAdd.length, 2 + Math.floor(Math.random() * 2));
      
      for (let i = 0; i < numComments; i++) {
        const comment = commentsToAdd[i];
        
        // Add comment to database
        const commentResult = await client.query(`
          INSERT INTO comments (body, author_id, post_id, created_at, updated_at, score, depth, is_deleted)
          VALUES ($1, $2, $3, NOW(), NOW(), 0, 0, false)
          RETURNING id
        `, [comment.content, comment.author_id, post.id]);
        
        const commentId = commentResult.rows[0].id;
        
        // Add realistic votes to comment (1-4 votes, mostly positive)
        const voteCount = 1 + Math.floor(Math.random() * 4);
        const availableVoterIds = [1, 2, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
        const voterIds = [];
        
        while (voterIds.length < voteCount && voterIds.length < availableVoterIds.length - 1) {
          const randomIndex = Math.floor(Math.random() * availableVoterIds.length);
          const voterId = availableVoterIds[randomIndex];
          if (!voterIds.includes(voterId) && voterId !== comment.author_id) {
            voterIds.push(voterId);
          }
        }
        
        // 85% upvotes for comments (very positive community)
        for (const voterId of voterIds) {
          const voteValue = Math.random() > 0.15 ? 1 : -1;
          await client.query(`
            INSERT INTO votes (user_id, votable_type, votable_id, value, created_at)
            VALUES ($1, 'comment', $2, $3, NOW())
          `, [voterId, commentId, voteValue]);
        }
        
        console.log(`   ✅ Added comment by user ${comment.author_id} with ${voteCount} votes`);
      }
      
      // Update post comment count
      await client.query(`
        UPDATE posts SET comment_count = $1 WHERE id = $2
      `, [numComments, post.id]);
      
      console.log(`   📊 Updated comment count to ${numComments}\n`);
    }
    
    console.log('🎉 All proper comments added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding proper comments:', error.message);
  } finally {
    await client.end();
  }
}

addProperComments();