export interface User {
  id: string;
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
  id: string;
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
  id: string;
  title: string;
  description: string;
  order: number;
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
  isLocked?: boolean;
  userVote?: 1 | -1 | 0;
  saved?: boolean;
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
  isDeleted?: boolean;
  isRemoved?: boolean;
  isLocked?: boolean;
  userVote?: 1 | -1 | 0;
  saved?: boolean;
  depth: number;
}

