import { Post, User, Subreddit, Comment } from '../types';

export const mockUser: User = {
  id: '1',
  username: 'anne_pedagog',
  displayName: 'Anne Pedersen',
  avatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png',
  point: {
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
    flairs: [
      { id: '1', text: 'Vuggestue', backgroundColor: '#8CC63F', textColor: '#ffffff' },
      { id: '2', text: 'Børnehave', backgroundColor: '#00A3E0', textColor: '#ffffff' },
      { id: '3', text: 'SFO', backgroundColor: '#003F72', textColor: '#ffffff' }
    ]
  },
  {
    id: '2',
    name: 'Studiehjaelp',
    displayName: 'Studiehjælp',
    description: 'Få hjælp til opgaver, eksamen og generelle studiespørgsmål på VIA pædagoguddannelsen.',
    icon: '📚',
    members: 2890,
    activeUsers: 156,
    createdAt: new Date('2022-03-20'),
    rules: [],
    flairs: [
      { id: '4', text: 'Opgavehjælp', backgroundColor: '#E31937', textColor: '#ffffff' },
      { id: '5', text: 'Eksamen', backgroundColor: '#666666', textColor: '#ffffff' }
    ]
  },
  {
    id: '3',
    name: 'Jobogkarriere',
    displayName: 'Job og karriere',
    description: 'Diskuter karrieremuligheder, del jobopslag og få tips til jobsøgning som pædagog.',
    icon: '💼',
    members: 1567,
    activeUsers: 89,
    createdAt: new Date('2022-06-10'),
    rules: [],
    flairs: []
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Tips til motorisk udvikling i vuggestuen - hvad virker for jer?',
    type: 'text',
    content: 'Hej alle sammen!\n\nJeg er i praktik i en vuggestue og skal planlægge aktiviteter der fremmer børnenes motoriske udvikling. Jeg har tænkt på at lave en forhindringsbane, men vil gerne høre hvilke aktiviteter I har haft succes med?\n\nBørnene er mellem 1-3 år. Tak på forhånd! 🌟',
    author: mockUser,
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    score: 45,
    upvoteRatio: 0.98,
    commentCount: 23,
    flair: { id: '1', text: 'Vuggestue', backgroundColor: '#8CC63F', textColor: '#ffffff' },
    awards: [
      { id: '1', name: 'Hjælpsom', icon: '🤝', description: 'Hjælpsom post', coinPrice: 100, count: 3 }
    ],
    userVote: 1,
    saved: true,
    hidden: false
  },
  {
    id: '2',
    title: 'Bachelor opgave om inklusion - nogen der har gode kilder?',
    type: 'text',
    content: 'Hej medstuderende!\n\nJeg er lige gået i gang med min bachelor om inklusion i børnehaven. Mit fokus er på børn med særlige behov og hvordan vi som pædagoger kan skabe det bedste inkluderende miljø.\n\nHar I nogle gode anbefalinger til:\n- Teoretikere jeg skal kigge på?\n- Forskningsartikler?\n- Praktiske metoder der er evidensbaserede?\n\nPå forhånd tak!',
    author: { ...mockUser, username: 'studerende2024' },
    subreddit: mockSubreddits[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    score: 67,
    upvoteRatio: 0.95,
    commentCount: 34,
    flair: { id: '4', text: 'Opgavehjælp', backgroundColor: '#E31937', textColor: '#ffffff' },
    awards: [],
    userVote: 0,
    saved: false,
    hidden: false
  },
  {
    id: '3',
    title: 'Nyuddannet pædagog søger råd til første jobsamtale',
    type: 'text',
    content: 'Hej alle!\n\nJeg blev færdig i juni og har nu fået min første jobsamtale til en stilling i en integreret institution. Jeg er super nervøs!\n\nHvad slags spørgsmål kan jeg forvente?\nHvordan forbereder jeg mig bedst?\nHvilke spørgsmål er gode at stille dem?\n\nAlle tips modtages med kyshånd! 🙏',
    author: { ...mockUser, username: 'nypaedagog' },
    subreddit: mockSubreddits[2],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    score: 89,
    upvoteRatio: 0.97,
    commentCount: 45,
    awards: [
      { id: '2', name: 'Held og lykke', icon: '🍀', description: 'Held og lykke!', coinPrice: 50, count: 5 }
    ],
    userVote: 1,
    saved: true,
    hidden: false
  },
  {
    id: '4',
    title: 'Konflikthåndtering mellem børn - del jeres bedste strategier',
    type: 'text',
    content: 'Jeg oplever ofte konflikter mellem børnene i børnehaven (3-6 år), især omkring legetøj og inklusion i lege.\n\nHvilke strategier bruger I til:\n- At forebygge konflikter?\n- At guide børnene gennem konflikter?\n- At lære dem selv at løse konflikter?\n\nJeg bruger selv meget "børnemøder" og konflikttrappen, men søger flere redskaber.',
    author: { ...mockUser, username: 'erfaren_paedagog' },
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    score: 123,
    upvoteRatio: 0.99,
    commentCount: 67,
    flair: { id: '2', text: 'Børnehave', backgroundColor: '#00A3E0', textColor: '#ffffff' },
    awards: [],
    isOC: true,
    userVote: 0,
    saved: false,
    hidden: false
  },
  {
    id: '5',
    title: 'Gode ideer til forældresamarbejde?',
    type: 'text',
    content: 'Hej forum!\n\nVi har udfordringer med at få forældrene engageret i vores institution. De afleverer og henter, men deltager sjældent i arrangementer eller viser interesse for børnenes hverdag.\n\nHvordan får I skabt et godt forældresamarbejde?\nHvilke arrangementer fungerer godt hos jer?\nHvordan kommunikerer I med forældrene?\n\nDel gerne jeres erfaringer!',
    author: { ...mockUser, username: 'teamleder_pia' },
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    score: 78,
    upvoteRatio: 0.94,
    commentCount: 89,
    awards: [],
    userVote: 0,
    saved: false,
    hidden: false
  },
  {
    id: '6',
    title: 'Eksamenangst - hvordan håndterer I det?',
    type: 'text',
    content: 'Jeg skal op til eksamen i "Pædagogens praksis" om 2 uger og er ved at gå i panik!\n\nJeg har læst og læst, men føler ikke jeg kan huske noget. Har I nogle gode råd til:\n- Hvordan jeg strukturerer min læsning?\n- Hvordan jeg håndterer nerverne?\n- Gode måder at øve sig på?\n\nHjælp! 😰',
    author: { ...mockUser, username: 'nervoes_studerende' },
    subreddit: mockSubreddits[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    score: 56,
    upvoteRatio: 1.0,
    commentCount: 42,
    flair: { id: '5', text: 'Eksamen', backgroundColor: '#666666', textColor: '#ffffff' },
    awards: [
      { id: '1', name: 'Hjælpsom', icon: '🤝', description: 'Hjælpsom post', coinPrice: 100, count: 2 }
    ],
    userVote: 1,
    saved: false,
    hidden: false
  }
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    body: 'Forhindringsbaner er super gode! Vi har haft stor succes med at bruge puder, tunneler og små trampoliner. Husk at variere sværhedsgraden så alle børn kan være med 😊',
    author: { ...mockUser, username: 'vuggestuepædagog' },
    post: mockPosts[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    score: 23,
    replies: [],
    awards: [],
    userVote: 1,
    saved: false,
    depth: 0
  },
  {
    id: 'c2',
    body: 'Prøv også sanglege med bevægelse! "Bjørnen sover" og "Boogie Woogie" er hits hos os. Det træner både grov- og finmotorik på en sjov måde.',
    author: { ...mockUser, username: 'musikpædagog' },
    post: mockPosts[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    score: 18,
    replies: [],
    awards: [],
    userVote: 0,
    saved: false,
    depth: 0
  },
  {
    id: 'c3',
    body: 'Til din bachelor kan jeg varmt anbefale:\n\n- Susan Hart om neuroaffektiv udvikling\n- Bent Madsen om inklusion\n- Lotte Hedegaard-Sørensen har skrevet meget godt om inklusion i praksis\n\nCheck også EVAs publikationer om inklusion - de har meget evidensbaseret materiale!',
    author: { ...mockUser, username: 'akademiker' },
    post: mockPosts[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    score: 45,
    replies: [],
    awards: [
      { id: '1', name: 'Hjælpsom', icon: '🤝', description: 'Hjælpsom kommentar', coinPrice: 100, count: 1 }
    ],
    userVote: 1,
    saved: true,
    depth: 0
  }
];