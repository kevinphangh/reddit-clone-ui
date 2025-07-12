import { Post, User, Subreddit, Comment } from '../types';

export const mockUser: User = {
  id: '1',
  username: 'reddit_user',
  displayName: 'Reddit User',
  avatar: 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png',
  karma: {
    post: 12345,
    comment: 54321
  },
  cakeDay: new Date('2020-06-15'),
  isPremium: true,
  isVerified: false
};

export const mockSubreddits: Subreddit[] = [
  {
    id: '1',
    name: 'AskReddit',
    displayName: 'Ask Reddit',
    description: 'r/AskReddit is the place to ask and answer thought-provoking questions.',
    icon: 'https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_tijjpyw1qe201.png',
    banner: 'https://styles.redditmedia.com/t5_2qh1i/styles/bannerBackgroundImage_x7t1on9yqr851.jpg',
    members: 41234567,
    activeUsers: 123456,
    createdAt: new Date('2008-01-25'),
    rules: [
      {
        id: '1',
        title: 'Rule 1 - Questions must be clear and direct',
        description: 'Questions must be clear, written in English, and conclude with a question mark',
        order: 1
      },
      {
        id: '2',
        title: 'Rule 2 - No personal or professional advice requests',
        description: 'Questions asking for professional advice are not allowed',
        order: 2
      }
    ],
    flairs: [
      { id: '1', text: 'Serious', backgroundColor: '#ff4500', textColor: '#ffffff' },
      { id: '2', text: 'Discussion', backgroundColor: '#0079d3', textColor: '#ffffff' }
    ]
  },
  {
    id: '2',
    name: 'funny',
    displayName: 'Funny',
    description: 'Welcome to r/Funny, Reddit\'s largest humour depository.',
    members: 42123456,
    activeUsers: 89012,
    createdAt: new Date('2008-01-25'),
    rules: [],
    flairs: []
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'What\'s the most interesting fact you know that sounds completely made up?',
    type: 'text',
    content: 'I\'ll start: Wombat poop is cube-shaped. They evolved this way to mark their territory on rocks without the poop rolling away.',
    author: mockUser,
    subreddit: mockSubreddits[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    score: 28453,
    upvoteRatio: 0.96,
    commentCount: 8234,
    flair: { id: '1', text: 'Serious', backgroundColor: '#ff4500', textColor: '#ffffff' },
    awards: [
      { id: '1', name: 'Gold', icon: '🏅', description: 'Reddit Gold', coinPrice: 500, count: 3 },
      { id: '2', name: 'Helpful', icon: '🤝', description: 'Helpful Award', coinPrice: 100, count: 12 }
    ],
    userVote: 1,
    saved: false,
    hidden: false
  },
  {
    id: '2',
    title: 'My cat thinks he\'s invisible when he covers his eyes',
    type: 'image',
    url: 'https://i.redd.it/1234567890.jpg',
    author: { ...mockUser, username: 'CatLover123' },
    subreddit: mockSubreddits[1],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    score: 45678,
    upvoteRatio: 0.98,
    commentCount: 1234,
    awards: [
      { id: '3', name: 'Wholesome', icon: '🤗', description: 'Wholesome Award', coinPrice: 50, count: 24 }
    ],
    userVote: 0,
    saved: true,
    hidden: false
  },
  {
    id: '3',
    title: 'Scientists discover new species of deep-sea fish that glows in the dark',
    type: 'link',
    url: 'https://www.sciencenews.org/article/new-glowing-fish-species',
    author: { ...mockUser, username: 'ScienceDaily' },
    subreddit: { ...mockSubreddits[0], name: 'science', displayName: 'Science' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    score: 12345,
    upvoteRatio: 0.91,
    commentCount: 567,
    awards: [],
    isOC: false,
    userVote: -1,
    saved: false,
    hidden: false
  },
  {
    id: '4',
    title: '[Spoiler] The ending of the new movie completely shocked me',
    type: 'text',
    content: 'I can\'t believe they actually went through with it. The main character...',
    author: { ...mockUser, username: 'MovieBuff2023' },
    subreddit: { ...mockSubreddits[0], name: 'movies', displayName: 'Movies' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    score: 8901,
    upvoteRatio: 0.87,
    commentCount: 2345,
    isSpoiler: true,
    awards: [],
    userVote: 0,
    saved: false,
    hidden: false
  },
  {
    id: '5',
    title: 'NSFW: Medical gore - My surgery recovery progress',
    type: 'image',
    url: 'https://i.redd.it/medical123.jpg',
    author: { ...mockUser, username: 'RecoveringPatient' },
    subreddit: { ...mockSubreddits[0], name: 'medical', displayName: 'Medical' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    editedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    score: 3456,
    upvoteRatio: 0.89,
    commentCount: 789,
    isNSFW: true,
    awards: [
      { id: '4', name: 'Take My Energy', icon: '⚡', description: 'Sending support', coinPrice: 30, count: 8 }
    ],
    userVote: 0,
    saved: false,
    hidden: false
  },
  {
    id: '6',
    title: 'I made this website that lets you explore space in 3D [OC]',
    type: 'link',
    url: 'https://myspaceexplorer.com',
    author: { ...mockUser, username: 'WebDev3000' },
    subreddit: { ...mockSubreddits[0], name: 'programming', displayName: 'Programming' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    score: 67890,
    upvoteRatio: 0.99,
    commentCount: 4567,
    isOC: true,
    flair: { id: '2', text: 'Show & Tell', backgroundColor: '#46d160', textColor: '#ffffff' },
    awards: [
      { id: '5', name: 'Platinum', icon: '💎', description: 'Reddit Platinum', coinPrice: 1800, count: 2 },
      { id: '1', name: 'Gold', icon: '🏅', description: 'Reddit Gold', coinPrice: 500, count: 15 }
    ],
    isPinned: true,
    userVote: 1,
    saved: true,
    hidden: false
  }
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    body: 'This is absolutely fascinating! I had no idea wombats had cube-shaped poop. Nature is truly amazing.',
    author: { ...mockUser, username: 'NatureLover22' },
    post: mockPosts[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    score: 1234,
    replies: [],
    awards: [],
    userVote: 1,
    saved: false,
    depth: 0
  },
  {
    id: 'c2',
    body: 'Here\'s another one: Oxford University is older than the Aztec Empire. Oxford was founded in 1096, while the Aztec Empire began in 1428.',
    author: { ...mockUser, username: 'HistoryBuff' },
    post: mockPosts[0],
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    score: 5678,
    replies: [],
    awards: [
      { id: '1', name: 'Gold', icon: '🏅', description: 'Reddit Gold', coinPrice: 500, count: 1 }
    ],
    userVote: 0,
    saved: true,
    depth: 0
  }
];