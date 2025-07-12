export interface User {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  points: {
    post: number;
    comment: number;
  };
  cakeDay: Date;
  isPremium?: boolean;
  isVerified?: boolean;
}

export interface Subreddit {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  banner?: string;
  members: number;
  activeUsers: number;
  createdAt: Date;
  rules: SubredditRule[];
  flairs: Flair[];
  isNSFW?: boolean;
  isQuarantined?: boolean;
}

export interface SubredditRule {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Flair {
  id: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  isModOnly?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  url?: string;
  type: 'text' | 'link' | 'image' | 'video' | 'poll';
  author: User;
  subreddit: Subreddit;
  createdAt: Date;
  editedAt?: Date;
  score: number;
  upvoteRatio: number;
  commentCount: number;
  flair?: Flair;
  awards: Award[];
  isNSFW?: boolean;
  isSpoiler?: boolean;
  isOC?: boolean;
  isPinned?: boolean;
  isLocked?: boolean;
  isArchived?: boolean;
  isCrosspost?: boolean;
  crosspostParent?: Post;
  userVote?: 1 | -1 | 0;
  saved?: boolean;
  hidden?: boolean;
}

export interface Comment {
  id: string;
  body: string;
  author: User;
  post: Post;
  parent?: Comment;
  createdAt: Date;
  editedAt?: Date;
  score: number;
  replies: Comment[];
  awards: Award[];
  isDeleted?: boolean;
  isRemoved?: boolean;
  isLocked?: boolean;
  isStickied?: boolean;
  userVote?: 1 | -1 | 0;
  saved?: boolean;
  isCollapsed?: boolean;
  depth: number;
}

export interface Award {
  id: string;
  name: string;
  icon: string;
  description: string;
  coinPrice: number;
  count: number;
}

