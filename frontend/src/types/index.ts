export interface User {
  id: number | string; // Support both for compatibility
  username: string;
  email?: string;
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
  id: number | string;
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  members: number;
  activeUsers: number;
  createdAt: Date;
  rules: SubredditRule[];
}

export interface SubredditRule {
  id: number | string;
  title: string;
  description: string;
  order: number;
}


export interface Post {
  id: number | string;
  title: string;
  content?: string | null;
  url?: string;
  type: 'text' | 'link' | 'image' | 'video' | 'poll';
  author: User;
  subreddit: Subreddit;
  createdAt: Date;
  updatedAt: Date;
  editedAt?: Date;
  score: number;
  upvoteRatio: number;
  commentCount: number;
  isLocked?: boolean;
  userVote?: 1 | -1 | 0 | number;
  saved?: boolean;
}

export interface Comment {
  id: number | string;
  body: string;
  author: User;
  post: {
    id: number | string;
    title: string;
  };
  parent?: Comment;
  createdAt: Date;
  editedAt?: Date;
  updatedAt: Date;
  score: number;
  replies: Comment[];
  isDeleted?: boolean;
  isRemoved?: boolean;
  isLocked?: boolean;
  userVote?: 1 | -1 | 0 | number;
  saved?: boolean;
  depth: number;
}

