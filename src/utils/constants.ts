export const SORT_OPTIONS = {
  HOT: 'populært',
  NEW: 'nyeste',
  TOP: 'top',
  RISING: 'stigende',
  CONTROVERSIAL: 'debatteret',
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
  BEST: 'bedste',
  TOP: 'top',
  NEW: 'nyeste',
  CONTROVERSIAL: 'debatteret',
  OLD: 'ældste',
  QA: 'spørgsmål',
} as const;

export const POST_TYPES = {
  TEXT: 'text',
  LINK: 'link',
  IMAGE: 'image',
  VIDEO: 'video',
  POLL: 'poll',
} as const;

