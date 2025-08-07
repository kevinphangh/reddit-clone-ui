const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

// VIA pædagog-relevante brugernavne (realistiske danske navne)
const moreUsernames = [
  'Sarah_VIA24', 'Jonas_Pæd25', 'Marie_VIA_AH', 'Kasper_P2025', 'Laura_VIAstud',
  'Mathias_VIA23', 'Amalie_Pæd4', 'Oliver_VIAcampus', 'Emma_Pædstud', 'Lucas_VIA25',
  'Isabella_VIA24', 'William_Pæd23', 'Freja_VIAstudent', 'Victor_P25', 'Alma_VIA_study',
  'Noah_VIApæd', 'Clara_Pædagog24', 'Magnus_VIA23', 'Liv_Pædstudent', 'Elias_VIA25',
  'Agnes_VIApæd24', 'Oscar_Pædagog23', 'Astrid_VIA_stud', 'August_P25', 'Aya_VIAstudent',
  'Arthur_Pæd24', 'Ester_VIA25', 'Malthe_VIApæd', 'Nora_Pædstud23', 'Felix_VIA24',
  'Josephine_P25', 'Viggo_VIAstudent', 'Karla_Pæd24', 'Storm_VIA23', 'Maja_VIApæd',
  'Anton_Pædstudent', 'Celina_VIA25', 'Theo_P24', 'Rosa_VIAstud', 'Emil_Pæd23',
  'Sofie_VIA_25', 'Alexander_Pæd', 'Andrea_VIAstudent', 'Benjamin_P24', 'Caroline_VIA23',
  'Daniel_Pædstud', 'Elisabeth_VIA25', 'Frederik_P23', 'Gabrielle_VIApæd', 'Henrik_VIA24'
];

// Mange flere relevante kommentarer for hver post type
const expandedComments = {
  "negative_narrativ": [
    { content: "Jeg bliver også træt af det! Min svigermor siger altid 'nå ja, du leger jo bare' 🙄", author_offset: 3 },
    { content: "Prøv at fortælle dem hvor mange timer vi bruger på observation og dokumentation!", author_offset: 7 },
    { content: "Min bror spørger altid 'hvornår får du et rigtigt job?' Det gør så ondt...", author_offset: 12 },
    { content: "Vi skal have en FAQ til familiesammenkomster 😂 'Nej, jeg leger ikke bare hele dagen'", author_offset: 18 },
    { content: "Jeg fortalte min nabo om neuropsykologi og børneudvikling - hun blev helt stille!", author_offset: 24 },
    { content: "Det værste er når de siger 'du kunne bare blive lærer i stedet' 😤", author_offset: 29 },
    { content: "Min chef på mit bijob siger altid ironisk 'hvordan går det med leg-studiet?' ARGH!", author_offset: 35 },
    { content: "Vi burde lave en kampagne: #PædagogerErProfessionelle", author_offset: 41 }
  ],
  "italien_praktik": [
    { content: "OMG ja! Jeg var i Firenze - børnehaven havde have med oliventræer! 🌳", author_offset: 2 },
    { content: "Milano er fantastisk! De har meget mere kunstpædagogik end herhjemme", author_offset: 8 },
    { content: "Pas på bureaukratiet - italiensk dokumentation er... speciel 😅", author_offset: 15 },
    { content: "Rom-praktik er guld værd! Du lærer så meget om forskellige kulturer", author_offset: 21 },
    { content: "Jeg skulle bruge Google Translate hver dag de første 2 uger 😂", author_offset: 27 },
    { content: "Italienske børn er så ekspressive! Det ændrede min tilgang til kommunikation", author_offset: 33 },
    { content: "VIA har god støtte - min kontaktperson hjalp med alt praktisk", author_offset: 39 },
    { content: "Du SKAL smage gelato med børnene - det er 'pædagogisk aktivitet' 🍦", author_offset: 45 }
  ],
  "specialisering": [
    { content: "Børn 0-6 er Amazing! Men det er hårdt fysisk - vær forberedt på løfting!", author_offset: 4 },
    { content: "Jeg skiftede fra unge til ældre - bedste beslutning ever!", author_offset: 9 },
    { content: "Specialpædagogik giver MEGA gode jobmuligheder lige nu", author_offset: 16 },
    { content: "Tag praktik i forskellige områder først - det åbner øjnene!", author_offset: 22 },
    { content: "Psykiatri er udfordrende men så meningsfuldt. Du gør virkelig en forskel!", author_offset: 28 },
    { content: "Børn/unge med særlige behov - der mangler så mange kvalificerede pædagoger", author_offset: 34 },
    { content: "Følg dit hjerte! Jeg vidste det øjeblikket jeg kom på demenscenteret", author_offset: 40 },
    { content: "Du kan altid tage videreuddannelse senere - start bare et sted!", author_offset: 46 }
  ],
  "etisk_dilemma": [
    { content: "Jeg var i PRÆCIS samme situation. Kontaktede kommunen - børnene kom i sikre hænder", author_offset: 5 },
    { content: "Dokumentér ALTING. Tid, sted, hvad der skete, hvem der var til stede", author_offset: 11 },
    { content: "VIA har faktisk en anonym hotline til studerende i etiske dilemmaer", author_offset: 17 },
    { content: "Min praktikvejleder støttede mig da jeg rapporterede. Find de rette mennesker!", author_offset: 23 },
    { content: "Børnenes sikkerhed > din praktikkarakter. ALTID.", author_offset: 30 },
    { content: "Jeg ringede til Børns Vilkår for råd - de var super hjælpsomme", author_offset: 36 },
    { content: "Du har PLIGT til at handle. Det står i vores etiske kodeks", author_offset: 42 },
    { content: "Det er okay at være bange - men børnene har kun dig lige nu", author_offset: 48 }
  ],
  "eksamen_panik": [
    { content: "Lav en STOR mindmap over alle teoretikere - hæng den op over sengen! 🧠", author_offset: 6 },
    { content: "Pomodoro-teknik redder LIVET! 25 min læsning, 5 min pause", author_offset: 13 },
    { content: "Jeg læste højt for min hund - hun var en god tilhører 😂", author_offset: 19 },
    { content: "Flashcards app på telefonen - læs i bussen, i køen, overalt!", author_offset: 25 },
    { content: "Mit trick: Forbind hver teoretiker med en farve. Hjælper med hukommelsen!", author_offset: 31 },
    { content: "YouTube har faktisk nogle gode danske pædagogik-videoer", author_offset: 37 },
    { content: "Øv mundtlige præsentationer foran spejlet - jeg ved det lyder mærkeligt!", author_offset: 43 },
    { content: "BREATHE! Du har læst mere end du tror. Stol på dig selv! 💪", author_offset: 49 }
  ],
  "myth_busters": [
    { content: "Tilføj: 'Pædagoger har fri hele sommeren' ❌ Vi har kurser og forberedelse!", author_offset: 1 },
    { content: "'Det er nemt at få job som pædagog' ❌ Der er kæmpe konkurrence!", author_offset: 10 },
    { content: "'Alle børn er ens' ❌ Hver barn er unikt og kræver individuel tilgang", author_offset: 14 },
    { content: "Min favorit dumme kommentar: 'I sidder bare og drikker kaffe' 🙄", author_offset: 20 },
    { content: "'Pædagoger kan ikke disciplinere børn' ❌ Vi er eksperter i konflikthåndtering!", author_offset: 26 },
    { content: "Vi skal lave TikToks der afkræfter disse myter! 📱", author_offset: 32 },
    { content: "'Mænd kan ikke være pædagoger' ❌ Vi har brug for flere mandlige rollemodeller!", author_offset: 38 },
    { content: "Print den her liste og giv til alle der kommer med dumme kommentarer!", author_offset: 44 }
  ]
};

async function scaleUpForum() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('🚀 Scaling up forum to realistic VIA pedagogy activity levels...\n');
    
    // 1. Add more users (simulate 300+ registered, 50+ active)
    console.log('=== ADDING MORE USERS ===');
    let userIds = [];
    
    for (let i = 0; i < moreUsernames.length; i++) {
      const username = moreUsernames[i];
      const email = `${username.toLowerCase().replace('_', '.')}@via.dk`;
      
      try {
        const result = await client.query(`
          INSERT INTO users (username, email, password, is_verified, is_admin, created_at, updated_at)
          VALUES ($1, $2, 'hashedpassword', true, false, NOW() - INTERVAL '${Math.floor(Math.random() * 60)} days', NOW())
          RETURNING id
        `, [username, email]);
        
        userIds.push(result.rows[0].id);
      } catch (error) {
        // User might already exist, skip
        console.log(`Skipping existing user: ${username}`);
      }
    }
    
    console.log(`Added ${userIds.length} new users`);
    
    // 2. Get all available user IDs for voting and commenting
    const allUsersResult = await client.query('SELECT id FROM users ORDER BY id');
    const allUserIds = allUsersResult.rows.map(row => row.id);
    console.log(`Total users available: ${allUserIds.length}`);
    
    // 3. Add many more votes to posts (50-150 votes per post)
    console.log('\n=== SCALING UP POST VOTES ===');
    const postsResult = await client.query(`
      SELECT id, title FROM posts 
      WHERE created_at > NOW() - INTERVAL '1 day'
    `);
    
    for (const post of postsResult.rows) {
      // Remove existing votes for this post
      await client.query('DELETE FROM votes WHERE votable_type = $1 AND votable_id = $2', ['post', post.id]);
      
      // Add 50-150 votes per post (realistic for 300+ user forum)
      const voteCount = 50 + Math.floor(Math.random() * 100);
      const voters = [];
      
      // Select random voters (no duplicates)
      while (voters.length < Math.min(voteCount, allUserIds.length * 0.6)) {
        const randomUserId = allUserIds[Math.floor(Math.random() * allUserIds.length)];
        if (!voters.includes(randomUserId)) {
          voters.push(randomUserId);
        }
      }
      
      // Add votes with realistic distribution (70% positive, 30% negative)
      for (const voterId of voters) {
        const voteValue = Math.random() > 0.3 ? 1 : -1;
        await client.query(`
          INSERT INTO votes (user_id, votable_type, votable_id, value, created_at)
          VALUES ($1, 'post', $2, $3, NOW() - INTERVAL '${Math.floor(Math.random() * 24)} hours')
        `, [voterId, post.id, voteValue]);
      }
      
      console.log(`${post.title}: ${voters.length} votes added`);
    }
    
    // 4. Add many more comments to each post (8-20 comments per post)
    console.log('\n=== ADDING MORE COMMENTS ===');
    
    for (const post of postsResult.rows) {
      // Delete existing recent comments
      await client.query('DELETE FROM comments WHERE post_id = $1 AND created_at > NOW() - INTERVAL \'1 day\'', [post.id]);
      
      let commentsToAdd = [];
      
      // Match comments to post types
      if (post.title.includes('bare en pædagog')) {
        commentsToAdd = expandedComments.negative_narrativ;
      } else if (post.title.includes('Italien')) {
        commentsToAdd = expandedComments.italien_praktik;
      } else if (post.title.includes('Specialisering')) {
        commentsToAdd = expandedComments.specialisering;
      } else if (post.title.includes('kollegaer svigter') || post.title.includes('whistle-blowe')) {
        commentsToAdd = expandedComments.etisk_dilemma;
      } else if (post.title.includes('Eksamen') || post.title.includes('Prøvetips')) {
        commentsToAdd = expandedComments.eksamen_panik;
      } else if (post.title.includes('Myth Busters')) {
        commentsToAdd = expandedComments.myth_busters;
      } else {
        // Use a mix for other posts
        commentsToAdd = [...expandedComments.negative_narrativ.slice(0, 3), ...expandedComments.specialisering.slice(0, 3)];
      }
      
      // Add 8-15 comments per post
      const numComments = Math.min(commentsToAdd.length, 8 + Math.floor(Math.random() * 7));
      
      for (let i = 0; i < numComments; i++) {
        const comment = commentsToAdd[i];
        const authorId = allUserIds[comment.author_offset % allUserIds.length];
        
        // Add comment
        const commentResult = await client.query(`
          INSERT INTO comments (body, author_id, post_id, created_at, updated_at, score, depth, is_deleted)
          VALUES ($1, $2, $3, NOW() - INTERVAL '${Math.floor(Math.random() * 20)} hours', NOW(), 0, 0, false)
          RETURNING id
        `, [comment.content, authorId, post.id]);
        
        const commentId = commentResult.rows[0].id;
        
        // Add 3-25 votes per comment
        const commentVoteCount = 3 + Math.floor(Math.random() * 22);
        const commentVoters = [];
        
        while (commentVoters.length < Math.min(commentVoteCount, allUserIds.length * 0.3)) {
          const randomUserId = allUserIds[Math.floor(Math.random() * allUserIds.length)];
          if (!commentVoters.includes(randomUserId) && randomUserId !== authorId) {
            commentVoters.push(randomUserId);
          }
        }
        
        // 80% positive votes for comments (supportive community)
        for (const voterId of commentVoters) {
          const voteValue = Math.random() > 0.2 ? 1 : -1;
          await client.query(`
            INSERT INTO votes (user_id, votable_type, votable_id, value, created_at)
            VALUES ($1, 'comment', $2, $3, NOW() - INTERVAL '${Math.floor(Math.random() * 18)} hours')
          `, [voterId, commentId, voteValue]);
        }
      }
      
      console.log(`${post.title}: ${numComments} comments added`);
    }
    
    console.log('\n🎉 Forum scaled up successfully!');
    
  } catch (error) {
    console.error('❌ Error scaling forum:', error.message);
  } finally {
    await client.end();
  }
}

scaleUpForum();