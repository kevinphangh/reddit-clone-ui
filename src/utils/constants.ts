export const SORT_OPTIONS = {
  HOT: 'hot',
  NEW: 'new',
  TOP: 'top',
  RISING: 'rising',
  CONTROVERSIAL: 'controversial',
} as const;

export const TIME_FILTER_OPTIONS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL: 'all',
} as const;

export const COMMENT_SORT_OPTIONS = {
  BEST: 'best',
  TOP: 'top',
  NEW: 'new',
  CONTROVERSIAL: 'controversial',
  OLD: 'old',
  QA: 'qa',
} as const;

export const POST_TYPES = {
  TEXT: 'text',
  LINK: 'link',
  IMAGE: 'image',
  VIDEO: 'video',
  POLL: 'poll',
} as const;

export const ROUTES = {
  HOME: '/',
  POPULAR: '/r/popular',
  ALL: '/r/all',
  SUBREDDIT: '/r/:subreddit',
  POST: '/r/:subreddit/comments/:postId/:slug?',
  USER: '/user/:username',
  SUBMIT: '/submit',
  SEARCH: '/search',
  SETTINGS: '/settings',
  MESSAGES: '/message/inbox',
  NOTIFICATIONS: '/notifications',
  SAVED: '/user/:username/saved',
  HIDDEN: '/user/:username/hidden',
  UPVOTED: '/user/:username/upvoted',
  DOWNVOTED: '/user/:username/downvoted',
  CREATE_COMMUNITY: '/subreddits/create',
} as const;

export const REDDIT_COLORS = {
  ORANGE: '#FF4500',
  ORANGE_RED: '#FF5700',
  DARK_ORANGE: '#CC3700',
  LIGHT_GRAY: '#DAE0E6',
  GRAY: '#878A8C',
  DARK_GRAY: '#1A1A1B',
  BLACK: '#030303',
  WHITE: '#FFFFFF',
  BLUE: '#0079D3',
  LIGHT_BLUE: '#24A0ED',
  DARK_BLUE: '#0060A8',
  GREEN: '#46D160',
  RED: '#EA0027',
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const MAX_TITLE_LENGTH = 300;
export const MAX_TEXT_LENGTH = 40000;
export const MAX_COMMENT_LENGTH = 10000;
export const MAX_FLAIR_LENGTH = 64;
export const MAX_SUBREDDIT_NAME_LENGTH = 21;
export const MAX_USERNAME_LENGTH = 20;