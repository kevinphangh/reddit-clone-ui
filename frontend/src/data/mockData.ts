import { Post, User, Subreddit, Comment } from '../types';

export const mockUser: User = {
  id: '1',
  username: 'anne_pedagog',
  displayName: 'Anne Pedersen',
  avatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png',
  points: {
    post: 1245,
    comment: 3421
  },
  cakeDay: new Date('2021-08-15'),
  isPremium: false,
  isVerified: true
};

export const mockSubreddits: Subreddit[] = [
  {
    id: '1',
    name: 'Praktik',
    displayName: 'Praktik og erfaringer',
    description: 'Del dine praktikoplevelser, få råd og sparring fra andre pædagogstuderende og erfarne pædagoger.',
    icon: '👶',
    members: 3456,
    activeUsers: 234,
    createdAt: new Date('2022-01-15'),
    rules: [
      {
        id: '1',
        title: 'Respekter tavshedspligten',
        description: 'Del aldrig navne eller identificerbare oplysninger om børn, forældre eller kolleger',
        order: 1
      },
      {
        id: '2',
        title: 'Konstruktiv feedback',
        description: 'Vær konstruktiv og professionel i din feedback til andre',
        order: 2
      }
    ],
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Hvorfor er pædagoger så lavt værdsatte i samfundet?',
    type: 'text',
    content: 'Jeg bliver så frustreret over den manglende anerkendelse vi får som pædagoger. \n\nVi har ansvar for børns trivsel, udvikling og læring i deres mest formative år. Vi håndterer komplekse situationer, konflikter, inklusion af børn med særlige behov, forældresamarbejde og meget mere.\n\nAlligevel bliver vi set som "dem der bare leger med børn" og får en løn der matcher den opfattelse.\n\nJeg elsker mit arbejde, men det er hårdt at blive ved med at kæmpe for bedre vilkår når samfundet ikke anerkender vigtigheden af vores arbejde.\n\nHvad tænker I? Hvordan håndterer I det?',
    author: { ...mockUser, username: 'frustreret_paedagog' },
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    score: 289,
    upvoteRatio: 0.94,
    commentCount: 3,
    userVote: 1,
    saved: true
  },
  {
    id: '2',
    title: 'Den negative mediedækning er ved at ødelægge vores fag',
    type: 'text',
    content: 'Er jeg den eneste der er træt af at læse overskrifter som "Pædagog trak barn i armen" eller "Forældre raser over pædagog"?\n\nMedierne fokuserer KUN på de negative historier. Aldrig på alt det gode vi gør hver dag:\n- De børn vi hjælper gennem svære skilsmisser\n- De børn med diagnoser vi inkluderer\n- De familier vi støtter\n- Den kæmpe udvikling vi ser hos børnene\n\nDen negative tone gør det sværere at rekruttere nye pædagoger og påvirker forældres tillid til os. Vi har i forvejen mangel på hænder.\n\nHvordan kan vi ændre narrativet?',
    author: { ...mockUser, username: 'bekymret_studerende' },
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    score: 234,
    upvoteRatio: 0.97,
    commentCount: 0,
    userVote: 1,
    saved: false,
  },
  {
    id: '3',
    title: 'Startløn 28.000 kr for 5 års uddannelse - er det rimeligt?',
    type: 'text',
    content: 'Jeg bliver snart færdig og har fået tilbudt job. Lønnen er 28.000 kr før skat.\n\nTil sammenligning:\n- Min veninde der er kontorelev (ingen uddannelse) får 25.000\n- Min bror der er IT-supporter (kort uddannelse) får 35.000\n- Min kusine som er sygeplejerske (samme længde uddannelse) får 33.000\n\nJeg har:\n- 3,5 års uddannelse + bachelor\n- Ansvar for 20+ børns udvikling og trivsel\n- Fysisk og psykisk krævende arbejde\n- Dokumentation og forældresamarbejde\n\nEr det bare mig eller er det fuldstændig skævt?',
    author: { ...mockUser, username: 'nyuddannet2024' },
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    score: 456,
    upvoteRatio: 0.98,
    commentCount: 1,
    userVote: 1,
    saved: true
  },
  {
    id: '4',
    title: 'Tips til motorisk udvikling i vuggestuen - hvad virker for jer?',
    type: 'text',
    content: 'Hej alle sammen!\n\nJeg er i praktik i en vuggestue og skal planlægge aktiviteter der fremmer børnenes motoriske udvikling. Jeg har tænkt på at lave en forhindringsbane, men vil gerne høre hvilke aktiviteter I har haft succes med?\n\nBørnene er mellem 1-3 år. Tak på forhånd! 🌟',
    author: mockUser,
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    score: 45,
    upvoteRatio: 0.98,
    commentCount: 0,
    userVote: 1,
    saved: true
  },
  {
    id: '5',
    title: '"Bare" en pædagog - jeg er SÅ træt af den kommentar',
    type: 'text',
    content: 'Til julefrokosten mødte jeg min kærestes familie for første gang. Da de spurgte hvad jeg lavede og jeg svarede jeg var pædagogstuderende, sagde hans onkel: "Nå, så du er bare pædagog?"\n\nBARE?!\n\nJeg prøvede at forklare at jeg:\n- Studerer børns udvikling, psykologi og læring\n- Lærer om inklusion og specialpædagogik  \n- Kan identificere udviklingsforstyrrelser\n- Planlægger pædagogiske aktiviteter baseret på teori\n- Dokumenterer og evaluerer\n\nMen nej, for ham var jeg bare en "barnepige med løn".\n\nHvordan håndterer I sådan nogle kommentarer uden at blive sure?',
    author: { ...mockUser, username: 'stolt_paedagog' },
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    score: 567,
    upvoteRatio: 0.96,
    commentCount: 0,
    userVote: 1,
    saved: false,
  },
  {
    id: '6',
    title: 'Bachelor opgave om inklusion - nogen der har gode kilder?',
    type: 'text',
    content: 'Hej medstuderende!\n\nJeg er lige gået i gang med min bachelor om inklusion i børnehaven. Mit fokus er på børn med særlige behov og hvordan vi som pædagoger kan skabe det bedste inkluderende miljø.\n\nHar I nogle gode anbefalinger til:\n- Teoretikere jeg skal kigge på?\n- Forskningsartikler?\n- Praktiske metoder der er evidensbaserede?\n\nPå forhånd tak!',
    author: { ...mockUser, username: 'studerende2024' },
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    score: 67,
    upvoteRatio: 0.95,
    commentCount: 1,
    userVote: 0,
    saved: false,
  },
  {
    id: '7',
    title: 'Forældre der ikke respekterer vores faglighed',
    type: 'text',
    content: 'Jeg har lige haft en samtale med forældre der mener deres 3-årige "bare keder sig" i børnehaven og derfor har "adfærdsproblemer".\n\nJeg prøvede at forklare at barnet viser tegn på overstimulering og har brug for færre indtryk og mere struktur. Men nej, mor ved bedre fordi hun har læst en artikel på nettet.\n\n5 års uddannelse og 10 års erfaring betyder åbenbart ingenting.\n\nDet værste er at ledelsen bakker forældrene op for "at undgå konflikt".\n\nEr der andre der oplever at vores faglighed konstant bliver undermineret?',
    author: { ...mockUser, username: 'erfaren_paedagog' },
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    score: 345,
    upvoteRatio: 0.93,
    commentCount: 0,
    userVote: 0,
    saved: false,
  },
  {
    id: '8',
    title: 'Positiv historie: Derfor elsker jeg at være pædagog!',
    type: 'text',
    content: 'Midt i al negativiteten vil jeg dele noget positivt!\n\nI dag kom en tidligere børnehavebarn (nu 12 år) forbi med sin mor. Han ville bare sige hej og fortælle at han stadig husker da jeg lærte ham at cykle og at det var "det bedste ever".\n\nHans mor fortalte at han ofte snakker om børnehavetiden og hvor tryg han følte sig.\n\nDET er derfor jeg er pædagog. Ikke for lønnen eller anerkendelsen, men for at gøre en forskel i børns liv.\n\nDel gerne jeres positive historier - vi har brug for dem! ❤️',
    author: { ...mockUser, username: 'glad_paedagog' },
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    score: 678,
    upvoteRatio: 0.99,
    commentCount: 0,
    userVote: 1,
    saved: true
  }
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    body: 'Jeg er SÅ enig! Det er frustrerende at vores uddannelse og ekspertise ikke anerkendes. Vi er professionelle der arbejder med børns udvikling, ikke bare "babysittere".',
    author: { ...mockUser, username: 'enig_kollega' },
    post: mockPosts[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    score: 123,
    replies: [],
    userVote: 1,
    saved: false,
    depth: 0
  },
  {
    id: 'c2',
    body: 'Problemet er at folk ikke forstår hvor komplekst vores arbejde er. De ser kun overfladen - at vi "leger" med børn. De ser ikke planlægningen, dokumentationen, observationerne, samarbejdet med andre faggrupper, osv.',
    author: { ...mockUser, username: 'reflekteret_paedagog' },
    post: mockPosts[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    score: 89,
    replies: [],
    userVote: 0,
    saved: false,
    depth: 0
  },
  {
    id: 'c3',
    body: 'Til din bachelor kan jeg varmt anbefale:\n\n- Susan Hart om neuroaffektiv udvikling\n- Bent Madsen om inklusion\n- Lotte Hedegaard-Sørensen har skrevet meget godt om inklusion i praksis\n\nCheck også EVAs publikationer om inklusion - de har meget evidensbaseret materiale!',
    author: { ...mockUser, username: 'akademiker' },
    post: mockPosts[5],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    score: 45,
    replies: [],
    userVote: 1,
    saved: true,
    depth: 0
  },
  {
    id: 'c4',
    body: 'Som nyuddannet mand i faget oplever jeg også fordomme. "Er du ikke bange for at blive mistænkt for noget?" får jeg ofte at høre. Det er så trættende at skulle forsvare sit fagvalg konstant.',
    author: { ...mockUser, username: 'mandlig_paedagog' },
    post: mockPosts[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    score: 156,
    replies: [],
    userVote: 1,
    saved: false,
    depth: 0
  },
  {
    id: 'c5',
    body: 'Jeg er lige skiftet til privat sektor efter 15 år som pædagog. Lønnen er 10.000 kr højere om måneden for mindre ansvar og stress. Elsker stadig faget, men kunne ikke blive ved økonomisk.',
    author: { ...mockUser, username: 'tidligere_paedagog' },
    post: mockPosts[2],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    score: 78,
    replies: [],
    userVote: 0,
    saved: false,
    depth: 0
  }
];