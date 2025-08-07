const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

// KORREKTE kommentarer der matcher specifikt hver post
const correctComments = {
  "Udlandsophold som pædagogstuderende - worth it?": [
    "JA! Gør det! Jeg var i Holland og det ændrede mit syn på pædagogik fuldstændig. Plus I meet amazing people! 🌍",
    "Jeg fortryder at jeg ikke gjorde det. Alle mine venner der tog afsted siger det var det bedste ved hele uddannelsen",
    "Det er dyrt, men SU hjælper. Og du får så meget mere end bare uddannelse - det er livserfaring!",
    "Min veninde var i Tyskland - hun sagde deres tilgang til inklusion var helt anderledes end vores",
    "Go for it! Det ser vildt godt ud på CV'et og arbejdsgivere elsker international erfaring",
    "Jeg tøvede for længe og så var pladserne væk. Søg tidligt!"
  ],
  
  "Prøvetips til mundtlig eksamen - sidste chance!": [
    "Øv dig på at forklare teorierne til din mor/far/kæreste. Hvis de forstår det, så gør sensor også! 🗣️",
    "Mit bedste trick: Forbind altid teori til konkrete eksempler fra praktik. Sensor ELSKER når vi kan se sammenhængene! ⭐",
    "Husk at trække vejret! Jeg tog 10 sekunder pause mellem spørgsmål - det gav mig tid til at tænke klart 🧘‍♀️",
    "Lav flashcards til alle teoretikerne - Dewey, Piaget, Vygotsky. Det hjælper med at huske sammenhængene 📚",
    "Mit tip: Lav en stor tidslinje over pædagogikkens historie. Det giver så god mening når du kan se udviklingen visuelt!",
    "Timer dig selv når du øver - 10 min oplæg går HURTIGT! Og lav stikord, ikke hele sætninger på dine noter",
    "Accepter at du VIL være nervøs - det er normalt! Sensor ved godt at vi er spændte",
    "Forbered dig på svære spørgsmål ved at tænke: 'Hvad ville jeg spørge om hvis jeg var sensor?'"
  ],
  
  "Dilemma: Hvornår skal man 'whistle-blowe'? 🤐➡️📢": [
    "Kontakt Dansk Pædagog Forbund - de har juridisk rådgivning til studerende. Du er ikke alene med det her! 📞",
    "Jeg stod i lignende situation. Dokumentér ALT og gem kopier hjemme. Det var det der reddede mig senere",
    "VIA har faktisk en anonym hotline til studerende i etiske dilemmaer - brug den!",
    "Børnenes sikkerhed kommer først. ALTID. Din praktikkarakter er sekundær",
    "Du har en etisk forpligtelse ifølge vores kodeks. Ring til kommunen anonymt hvis nødvendigt",
    "Jeg ringede til Børns Vilkår for råd først - de guidede mig gennem processen",
    "Det er okay at være bange, men børnene har kun dig lige nu. Vær deres stemme",
    "Min praktikvejleder støttede mig da jeg rapporterede. Find de rette mennesker!"
  ],
  
  "Praktik på Balkan eller Sydeuropa - erfaringer?": [
    "Min studiekammerat var i Zagreb! Hun sagde de har meget stærk familiefokus i deres pædagogik. Kunne være spændende at opleve 🏛️",
    "Jeg overvejer Grækenland! Har hørt de har nogle innovative tilgange til udendørspædagogik ☀️",
    "En fra min årgang var i Kroatien - hun sagde sproget var udfordrende, men alle hjalp hende",
    "Balkan-landene har meget tradition for storfamilie-involvering. Kunne være lærerigt!",
    "Jeg så på VIA's hjemmeside at de har partnerskaber med flere universiteter dernede",
    "Husk at tjekke om dine ECTS bliver anerkendt ordentligt når du kommer hjem"
  ],
  
  "Skal vi ikke lave en 'Myth Busters' om pædagogfaget?": [
    "LOVE this! En til listen: 'Pædagoger bare passer børn' ❌ Vi faciliterer læring, udvikling og trivsel! 🎯",
    "Og den her: 'Det er et kvindefag' ❌ Vi har brug for flere mandlige rollemodeller! Diversitet styrker professionen 👨‍👩‍👧‍👦",
    "Tilføj: 'Pædagoger har fri hele sommeren' ❌ Vi har kurser, forberedelse og efteruddannelse!",
    "'Det er nemt at få job som pædagog' ❌ Der er kæmpe konkurrence om de gode stillinger!",
    "Min favorit: 'I sidder bare og drikker kaffe' 🙄 Prøv at passe 20 børn samtidig!",
    "'Alle børn er ens' ❌ Hver barn er unikt og kræver individuel pædagogisk tilgang",
    "Vi skal lave TikToks der afkræfter disse myter! Vær proaktive på sociale medier 📱",
    "Print den her liste og giv til alle der kommer med dumme kommentarer på familiesammenkomster!"
  ],
  
  "Eksamen om 3 uger - PANIK! Hvordan forbereder I jer? 😰": [
    "SAME! Jeg laver flashcards til alle teoretikerne - Dewey, Piaget, Vygotsky osv. Det hjælper mig med at huske sammenhængene 📚",
    "Mit tip: Lav en stor tidslinje over pædagogikkens historie. Det giver så god mening når du kan se udviklingen visuelt!",
    "Jeg studerer 2 timer, pause 30 min. Pomodoro-teknik! Og så MASSER af kaffe ☕. Vi klarer det sammen! 💪",
    "Lav en storyline gennem pensum i stedet for at pugge fakta - det hænger bedre sammen",
    "Øv dig på at forklare til din bedstemor - hvis hun forstår det, kan sensor også! 😊",
    "Timer dig selv - 10 min oplæg går HURTIGT. Og lav stikord, ikke hele sætninger",
    "YouTube har faktisk nogle gode danske pædagogik-videoer til repetition",
    "BREATHE! Du har læst mere end du tror. Stol på dig selv! 💪"
  ],
  
  "Pædagogisk dilemma: Når kollegaer svigter børnene 💔": [
    "Det er så svært... Jeg var i samme situation. Til sidst kontaktede jeg kommunen anonymt. Det var det rigtige at gøre for børnenes skyld",
    "Du har en etisk forpligtelse! Dokumenter alt og tal med din lærer fra VIA - de kan guide dig gennem processen",
    "Jeg ved det er svært, men børnenes tarv kommer først. Altid. Der findes whistleblower-beskyttelse for studerende",
    "Tal med din praktikvejleder først - måske kan de hjælpe med at løse det internt",
    "Dokumentér ALTING. Tid, sted, hvad der skete, hvem der var til stede. Det bliver vigtigt senere",
    "Ring til Børns Vilkår anonymt - de kan rådgive dig om dine muligheder",
    "VIA har en etisk hotline til studerende. Brug den - det er derfor den findes!",
    "Min praktikvejleder støttede mig da jeg rapporterede problemet. Find de rette mennesker"
  ],
  
  "Specialisering - stadig helt blank på 4. semester 🤯": [
    "Samme her! Jeg er helt lost. Måske vi skal tage en snak med studievejlederne? De plejer at have god indsigt",
    "Jeg valgte børn fordi jeg elsker den alder, men ærligt? Du kan altid skifte senere. Mange af mine kollegaer har gjort det",
    "Tag den specialisering som giver dig mest energi når du tænker på den! Følg din mavefornemmelse - den plejer at have ret 💫",
    "Børn 0-6 er amazing! Men det er hårdt fysisk - vær forberedt på meget løfting og gulvtid",
    "Specialpædagogik giver MEGA gode jobmuligheder lige nu - stor efterspørgsel",
    "Tag praktik i forskellige områder først - det åbner øjnene for hvad du bedst kan lide",
    "Psykiatri er udfordrende men så meningsfuldt. Du gør virkelig en forskel!",
    "Du kan altid tage videreuddannelse senere - start bare et sted!"
  ],
  
  "Praktik i Italien - nogen der har prøvet det?": [
    "Jeg var i Rom på udveksling! Det var FANTASTISK! Italienerne er så varme og børnene er mega søde. Du skal bare kunne grundlæggende italiensk 🇮🇹",
    "Min veninde var i Milano - hun sagde de arbejder meget mere med hele familien end vi gør herhjemme. Spændende tilgang!",
    "Go for it! Jeg fortryder at jeg ikke tog chancen. Det ser vildt godt ud på CV'et og du lærer så meget om forskellige kulturer 🌍",
    "OMG ja! Jeg var i Firenze - børnehaven havde have med oliventræer! Så smukt 🌳",
    "Milano er fantastisk! De har meget mere kunstpædagogik end herhjemme - børnene laver kunst hver dag",
    "Pas på bureaukratiet - italiensk dokumentation er... speciel 😅 Men det er det værd!",
    "Rom-praktik er guld værd! Du lærer så meget om forskellige kulturer og tilgange",
    "Jeg skulle bruge Google Translate hver dag de første 2 uger 😂 Men så lærte jeg sproget hurtigt"
  ],
  
  "Træt af at høre 'bare en pædagog' - hvordan tackler I det?": [
    "Jeg kan SÅ godt relatere til det her! Min far spurgte mig forleden om jeg ikke 'bare kunne tage en rigtig uddannelse i stedet' 😤",
    "Mit standardsvar er blevet: 'Kan du håndtere 25 børn samtidig, samtidig med at du dokumenterer deres udvikling og støtter forældrene?' Plejer at få dem til at tie stille 😏",
    "Vi skal bare blive ved med at vise vores faglighed! Jeg fortalte min onkel om alt det psykologi og neurologi vi lærer - han var helt overrasket",
    "Jeg bliver også træt af det! Min svigermor siger altid 'nå ja, du leger jo bare' 🙄",
    "Prøv at fortælle dem hvor mange timer vi bruger på observation og dokumentation!",
    "Min bror spørger altid 'hvornår får du et rigtigt job?' Det gør så ondt...",
    "Vi skal have en FAQ til familiesammenkomster 😂 'Nej, jeg leger ikke bare hele dagen'",
    "Det værste er når de siger 'du kunne bare blive lærer i stedet' 😤 Som om det er nemmere!"
  ]
};

async function fixCommentMatching() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('🔧 Fixing comment matching - deleting old and adding correct comments...\n');
    
    // Get all recent posts
    const postsResult = await client.query(`
      SELECT id, title FROM posts 
      WHERE created_at > NOW() - INTERVAL '1 day'
      ORDER BY created_at DESC
    `);
    
    // Delete ALL recent comments and votes
    console.log('🗑️  Deleting mismatched comments and votes...');
    await client.query("DELETE FROM votes WHERE votable_type = 'comment' AND created_at > NOW() - INTERVAL '1 day'");
    await client.query("DELETE FROM comments WHERE created_at > NOW() - INTERVAL '1 day'");
    
    // Get all user IDs for proper distribution
    const usersResult = await client.query('SELECT id FROM users ORDER BY id');
    const allUserIds = usersResult.rows.map(row => row.id);
    
    console.log('✅ Adding properly matched comments...\n');
    
    for (const post of postsResult.rows) {
      console.log(`📝 Adding comments to: "${post.title}"`);
      
      // Find correct comments for this exact post title
      const correctCommentsForPost = correctComments[post.title] || [];
      
      if (correctCommentsForPost.length === 0) {
        console.log(`   ⚠️  No matching comments found for this post title`);
        continue;
      }
      
      // Add 6-10 relevant comments
      const numComments = Math.min(correctCommentsForPost.length, 6 + Math.floor(Math.random() * 4));
      
      for (let i = 0; i < numComments; i++) {
        const commentBody = correctCommentsForPost[i];
        const authorId = allUserIds[(i * 7 + post.id) % allUserIds.length]; // Spread authors evenly
        
        // Add comment
        const commentResult = await client.query(`
          INSERT INTO comments (body, author_id, post_id, created_at, updated_at, score, depth, is_deleted)
          VALUES ($1, $2, $3, NOW() - INTERVAL '${Math.floor(Math.random() * 18)} hours', NOW(), 0, 0, false)
          RETURNING id
        `, [commentBody, authorId, post.id]);
        
        const commentId = commentResult.rows[0].id;
        
        // Add 5-20 votes per comment
        const voteCount = 5 + Math.floor(Math.random() * 15);
        const voters = [];
        
        while (voters.length < Math.min(voteCount, allUserIds.length * 0.4)) {
          const randomUserId = allUserIds[Math.floor(Math.random() * allUserIds.length)];
          if (!voters.includes(randomUserId) && randomUserId !== authorId) {
            voters.push(randomUserId);
          }
        }
        
        // 82% positive votes (very supportive community)
        for (const voterId of voters) {
          const voteValue = Math.random() > 0.18 ? 1 : -1;
          await client.query(`
            INSERT INTO votes (user_id, votable_type, votable_id, value, created_at)
            VALUES ($1, 'comment', $2, $3, NOW() - INTERVAL '${Math.floor(Math.random() * 16)} hours')
          `, [voterId, commentId, voteValue]);
        }
        
        console.log(`   ✅ Added relevant comment with ${voteCount} votes`);
      }
      
      // Update post comment count
      await client.query('UPDATE posts SET comment_count = $1 WHERE id = $2', [numComments, post.id]);
      console.log(`   📊 Updated comment count to ${numComments}\n`);
    }
    
    // Update all scores
    console.log('📊 Updating all scores...');
    
    // Update comment scores
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
    
    console.log('🎉 Comment matching fixed! All comments now properly match their posts.');
    
  } catch (error) {
    console.error('❌ Error fixing comments:', error.message);
  } finally {
    await client.end();
  }
}

fixCommentMatching();