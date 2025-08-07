const { Client } = require('pg');

const connectionString = 'postgresql://postgres.rmtiksoarunbpeatdrng:Maa72ckrsick!@aws-0-eu-north-1.pooler.supabase.com:6543/postgres';

const newPosts = [
  // Udfordre negativt narrativ
  {
    title: "Træt af at høre 'bare en pædagog' - hvordan tackler I det?",
    content: `Hej alle sammen!

Jeg bliver så træt af at høre kommentarer som "nå, du læser bare til pædagog" eller "det kan da alle finde ud af". 

Jeg var til familiesammenkomst i weekenden, og min onkel spurgte hvad jeg læste til. Da jeg svarede pædagog, kom der bare sådan et "nå okay" og så skiftede han emne. Det var så nedladende!

Vi ved alle hvor komplekst vores arbejde er - børnepsykologi, socialpædagogik, konflikthåndtering, inklusion, dokumentation, forældresamarbejde... Listen er lang!

Hvordan håndterer I sådan nogle situationer? Har I gode comebacks eller måder at forklare vores professions værdi på?

Jeg tænker vi skal blive bedre til at stå sammen om at løfte vores profession. Vi gør en forskel hver dag! 💪`,
    author_id: 35
  },
  {
    title: "Praktik i Italien - nogen der har prøvet det?",
    content: `Ciao ragazzi! 🇮🇹

Jeg overvejer virkelig at søge praktik i Italien næste semester. VIA har vist nogle partnerskaber med institutioner dernede, og det lyder som en fantastisk mulighed!

Er der nogen der har været på udenlandspraktik - specielt i Italien? Jeg vil gerne høre om:

• Hvordan var sproget? Skal man kunne italiensk?
• Hvilke typer institutioner var I på?
• Var det meget anderledes end dansk pædagogik?
• Hvordan var det at bo dernede som studerende?
• Blev det anerkendt fuldt ud herhjemme?

Jeg synes det kunne være vildt spændende at se hvordan de arbejder med børn og unge i en anden kultur. Plus italiensk mad og sol ikke? 😍

Tak for input!`,
    author_id: 37
  },
  {
    title: "Specialisering - stadig helt blank på 4. semester 🤯",
    content: `Hey guys!

Er der andre der stadig er totalt lost omkring specialisering? Jeg skal snart vælge og jeg aner ikke hvad jeg vil!

Jeg kan godt lide at arbejde med børn, men også unge. Og så synes jeg også ældre lyder interessant. Og psykiatri... Argh! 

Mine bekymringer:
- Hvad hvis jeg vælger forkert?
- Kan man skifte senere i karrieren?
- Hvilken specialisering giver bedst jobmuligheder?
- Er der forskel på løn?

Måske I kan dele jeres overvejelser? Hvad fik jer til at vælge som I gjorde? Fortryder I noget?

Jeg føler mig så presset til at vælge "rigtigt" første gang. Men måske det ikke er så sort/hvidt?

Help a girl out! 🙏`,
    author_id: 39
  },
  {
    title: "Pædagogisk dilemma: Når kollegaer svigter børnene 💔",
    content: `Det her er svært at skrive, men jeg har brug for jeres input...

Jeg er på praktik på en institution hvor jeg flere gange har oplevet situationer, hvor jeg synes personalet ikke handler i børnenes bedste interesse. 

Konkret har jeg set:
- Børn der bliver overset eller ignoreret når de har brug for omsorg
- Konflikter der ikke håndteres professionelt
- En kollega der bruger nedladende tone over for et barn med særlige behov

Jeg har talt med min praktikvejleder, men hun bagatelliserer det og siger "sådan er det bare i virkeligheden".

Men det ER jo ikke okay! Vi har et ansvar over for de børn vi arbejder med.

Hvad gør I i sådan en situation? 
- Taler I direkte til kollegaen?
- Går I til lederen?
- Kontakter I kommunen?
- Bare holder I jer væk fra det?

Jeg vil gerne gøre det rigtige, men jeg er også bekymret for min praktik. Det er så svært når man står mellem sin uddannelse og sin etik.

Har I oplevet lignende? Hvordan håndterede I det?`,
    author_id: 33
  },
  {
    title: "Eksamen om 3 uger - PANIK! Hvordan forbereder I jer? 😰",
    content: `HELP! 

Har eksamen i Pædagogik og Dannelse om 3 uger og jeg føler mig slet ikke klar! 

Pensum er KÆMPERT - Dewey, Freire, Klafki, danske traditioner, kompetencemål... How do you even??? 

Mine spørgsmål til jer eksperter:
1. Hvordan strukturerer I jeres læsning?
2. Laver I resuméer eller mind maps?
3. Læser I i grupper eller alene?
4. Hvor lang tid bruger I på forberedelse dagligt?
5. Nogen gode tricks til at huske teorier?

Jeg har læst, men føler ikke jeg kan huske det hele. Er så bange for at blanke totalt til eksamen! 

Min angst lige nu: 📈📈📈

Send hjælp og gode råd! Jeg lover at dele mit eget bedste studietrick hvis I hjælper 🙏

PS: Kaffe eller energidrik - hvad virker bedst til de lange læsedage? ☕`,
    author_id: 41
  },
  {
    title: "Skal vi ikke lave en 'Myth Busters' om pædagogfaget?",
    content: `Hej allesammen! 

Jeg tænkte - skal vi ikke lave en samlet liste over alle de dumme fordomme om pædagoger, og så knuse dem én for én?

Her er dem jeg tit hører:
❌ "Pædagoger leger bare hele dagen"
✅ Sandheden: Vi faciliterer læring gennem leg og strukturerede aktiviteter

❌ "Det kræver ikke meget uddannelse"  
✅ Sandheden: 3,5-årig professionsbachelor med psykologi, sociologi, pædagogik, dansk...

❌ "Alle kan arbejde med børn"
✅ Sandheden: Professionel tilgang til udvikling, konfliktløsning, inklusion kræver ekspertise

Hvad kan I tilføje? Lad os få lavet en ordentlig liste vi kan bruge næste gang nogen kommer med deres "smarte" kommentarer!

Vi skal blive bedre til at forsvare vores profession. Vi gør noget MEGA vigtigt! 🌟

Drop jeres input nedenfor 👇`,
    author_id: 38
  },
  {
    title: "Praktik på Balkan eller Sydeuropa - erfaringer?",
    content: `Hej alle!

Jeg har set at VIA har nogle udvekslingsmuligheder til bl.a. Kroatien, Grækenland og Spanien. 

Er der nogen der har prøvet praktik i Sydeuropa eller Balkan-landene? Jeg er mega nysgerrig på:

🌍 Hvordan er deres tilgang til pædagogik?
🏛️ Arbejder de meget anderledes end os?
👨‍👩‍👧‍👦 Hvordan er forældresamarbejdet?
🏫 Har de samme udfordringer som danske institutioner?

Jeg tænker det kunne være fed at se hvordan andre kulturer håndterer børnepædagogik. Måske vi kan lære noget?

Plus jeg vil gerne have lidt sol og varme i praktikperioden 😎☀️

Alle erfaringer modtages med kyshånd!

Mange tak 🙏`,
    author_id: 40
  },
  {
    title: "Dilemma: Hvornår skal man 'whistle-blowe'? 🤐➡️📢",
    content: `Okay det her er et seriøst spørgsmål til jer alle...

Vi lærer om etik og ansvar, men hvad gør man KONKRET når man ser ting der ikke er okay?

Jeg tænker på situationer som:
• Kollega der konsekvent ignorerer et barn
• Leder der dækker over problemer i stedet for at løse dem  
• Forældreklager der fejes under gulvtæppet
• Børn der ikke får den hjælp de har ret til

Er der nogen der har stået i sådan en situation? Hvad gjorde I?

Jeg er bevidst om at det kan være svært som studerende - man vil jo gerne have en god praktik og reference. Men hvad med vores etiske ansvar?

Har I kendskab til:
- Hvem man kan henvende sig til?
- Hvilke rettigheder man har som praktikant?
- Hvordan man beskytter sig selv juridisk?

Det er sgu ikke nemt at navigere i når man står i det... 😔

Tak for jeres input!`,
    author_id: 34
  },
  {
    title: "Prøvetips til mundtlig eksamen - sidste chance!",
    content: `Hej pædagog-warriors! ⚔️

Har mundtlig eksamen i næste uge og tænkte jeg ville dele mine bedste tips - og høre jeres!

Mine strategies:
📚 Lav en storyline gennem pensum i stedet for at pugge fakta
🗣️ Øv dig på at forklare til din bedstemor (hvis hun forstår det, kan sensor også)
⏰ Timer dig selv - 10 min oplæg går HURTIGT
📝 Lav stikord, ikke hele sætninger på dine noter
😰 Accepter at du VIL være nervøs - det er normalt!

Hvad virker for jer?
• Nogle der har gode eksempler på hvordan man forbinder teori til praksis?
• Tips til at håndtere blank-outs?
• Hvordan tackler I svære spørgsmål fra sensor?

Vi skal nok alle sammen klare det! Vi har arbejdet hårdt for det her 💪

Lad os hjælpe hinanden over målstregen! 🎯

#PædagogPower #ViKanDet`,
    author_id: 43
  },
  {
    title: "Udlandsophold som pædagogstuderende - worth it?",
    content: `Hej alle!

Jeg overvejer seriøst at tage et semester i udlandet. VIA har partnerskaber med universiteter i flere lande - Italien, Tyskland, Holland...

Men jeg er i tvivl:
💰 Det er dyrt (selvom der er SU)
⏱️ Forsinker det min uddannelse?
🎓 Bliver det anerkendt ordentligt?
👥 Mister jeg kontakt til min årgang?

TIL GENGÆLD:
🌍 Fed kulturel erfaring
📚 Andet perspektiv på pædagogik
💼 Ser godt ud på CV'et
🗣️ Sprogfærdigheder

Er der nogen der har gjort det? Fortryder I? Eller fortryder I at I IKKE gjorde det?

Jeg tænker især på om det giver mening karrieremæssigt. Bliver man en bedre pædagog af det? Eller er det bare en dyr ferie? 🤔

Hjælp en ven med at træffe den rigtige beslutning! 🙏`,
    author_id: 45
  }
];

async function addPosts() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to Supabase database ✅');
    
    for (const post of newPosts) {
      // Add post
      const result = await client.query(`
        INSERT INTO posts (title, content, author_id, type, created_at, updated_at)
        VALUES ($1, $2, $3, 'text', NOW(), NOW())
        RETURNING id
      `, [post.title, post.content, post.author_id]);
      
      const postId = result.rows[0].id;
      
      // Add some votes (3-12 votes per post with realistic distribution)
      const voteCount = Math.floor(Math.random() * 10) + 3;
      const voterIds = [];
      
      // Generate unique voter IDs from available users
      const availableVoterIds = [1, 2, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
      while (voterIds.length < voteCount && voterIds.length < availableVoterIds.length - 1) {
        const randomIndex = Math.floor(Math.random() * availableVoterIds.length);
        const voterId = availableVoterIds[randomIndex];
        if (!voterIds.includes(voterId) && voterId !== post.author_id) {
          voterIds.push(voterId);
        }
      }
      
      // Add votes with 70% upvotes, 30% downvotes for realistic distribution
      for (const voterId of voterIds) {
        const voteValue = Math.random() > 0.3 ? 1 : -1;
        await client.query(`
          INSERT INTO votes (user_id, votable_type, votable_id, value, created_at)
          VALUES ($1, 'post', $2, $3, NOW())
        `, [voterId, postId, voteValue]);
      }
      
      console.log(`✅ Added post: "${post.title}" with ${voteCount} votes`);
    }
    
    console.log(`\n🎉 Successfully added ${newPosts.length} authentic VIA pedagogy posts!`);
    
  } catch (error) {
    console.error('❌ Error adding posts:', error.message);
  } finally {
    await client.end();
  }
}

addPosts();