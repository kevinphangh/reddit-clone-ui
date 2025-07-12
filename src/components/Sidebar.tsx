import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Shield,
  Calendar
} from 'lucide-react';
import { Subreddit } from '../types';
import { formatNumber, formatFullDate } from '../utils/formatting';

interface SidebarProps {
  subreddit?: Subreddit;
  showSubredditInfo?: boolean;
  trendingCommunities?: Array<{
    name: string;
    members: number;
    isNew?: boolean;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  subreddit, 
  showSubredditInfo = true,
  trendingCommunities = [
    { name: 'AskReddit', members: 41234567 },
    { name: 'gaming', members: 37890123 },
    { name: 'aww', members: 34567890 },
    { name: 'Music', members: 32123456 },
    { name: 'worldnews', members: 31234567 },
  ]
}) => {
  return (
    <aside className="w-[312px] flex flex-col gap-4">
      {/* Subreddit Info Card */}
      {showSubredditInfo && subreddit && (
        <div className="reddit-card overflow-hidden">
          {/* Banner */}
          <div className="h-[34px] bg-reddit-blue"></div>
          
          {/* Header */}
          <div className="px-3 pb-3">
            <div className="flex items-start -mt-3 mb-2">
              <img 
                src={subreddit.icon || `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${subreddit.name.charCodeAt(0) % 7}.png`}
                alt={subreddit.name}
                className="w-[54px] h-[54px] rounded-full border-4 border-white bg-white"
              />
            </div>
            
            <h1 className="text-base font-bold mb-2">{subreddit.displayName}</h1>
            <div className="text-xs text-reddit-gray mb-3">r/{subreddit.name}</div>
            
            <p className="text-sm mb-4">{subreddit.description}</p>
            
            {/* Stats */}
            <div className="flex gap-4 mb-4">
              <div>
                <div className="text-base font-medium">{formatNumber(subreddit.members)}</div>
                <div className="text-xs text-reddit-gray">Members</div>
              </div>
              <div>
                <div className="text-base font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-reddit-green rounded-full"></span>
                  {formatNumber(subreddit.activeUsers)}
                </div>
                <div className="text-xs text-reddit-gray">Online</div>
              </div>
            </div>
            
            {/* Created Date */}
            <div className="flex items-center gap-2 text-xs text-reddit-gray mb-4">
              <Calendar size={14} />
              <span>Created {formatFullDate(subreddit.createdAt)}</span>
            </div>
            
            {/* Join/Create Post Buttons */}
            <div className="space-y-2">
              <button className="w-full btn-primary">Join</button>
              <Link to="/submit" className="block w-full btn-secondary text-center">
                Create Post
              </Link>
            </div>
          </div>
          
          {/* Community Options */}
          <div className="border-t border-reddit-lightGray px-3 py-2">
            <button className="text-xs font-bold text-reddit-gray hover:text-reddit-black">
              COMMUNITY OPTIONS
            </button>
          </div>
        </div>
      )}

      {/* Community Rules */}
      {subreddit && subreddit.rules.length > 0 && (
        <div className="reddit-card">
          <div className="p-3 border-b border-reddit-lightGray">
            <h2 className="text-sm font-bold">r/{subreddit.name} Rules</h2>
          </div>
          <div className="p-3">
            {subreddit.rules.slice(0, 5).map((rule, index) => (
              <details key={rule.id} className="mb-2">
                <summary className="cursor-pointer text-sm hover:text-reddit-black">
                  <span className="font-medium">{index + 1}. {rule.title}</span>
                </summary>
                <p className="text-xs text-reddit-gray mt-1 ml-4">{rule.description}</p>
              </details>
            ))}
            {subreddit.rules.length > 5 && (
              <button className="text-xs font-bold text-reddit-blue">
                View all {subreddit.rules.length} rules
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trending Communities */}
      {!showSubredditInfo && (
        <div className="reddit-card">
          <div className="p-3 border-b border-reddit-lightGray">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <TrendingUp size={16} className="text-reddit-orange" />
              Today's Top Growing Communities
            </h2>
          </div>
          <div className="py-2">
            {trendingCommunities.map((community, index) => (
              <Link 
                key={community.name}
                to={`/r/${community.name}`}
                className="flex items-center gap-3 px-3 py-2 hover:bg-reddit-bg-hover"
              >
                <span className="text-sm font-medium w-4">{index + 1}</span>
                <img 
                  src={`https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${community.name.charCodeAt(0) % 7}.png`}
                  alt={community.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">r/{community.name}</div>
                  <div className="text-xs text-reddit-gray">{formatNumber(community.members)} members</div>
                </div>
                {community.isNew && (
                  <span className="text-xs bg-reddit-green text-white px-2 py-0.5 rounded-full">NEW</span>
                )}
              </Link>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-reddit-lightGray">
            <button className="text-xs font-bold text-reddit-blue">VIEW ALL</button>
          </div>
        </div>
      )}

      {/* Reddit Premium */}
      <div className="reddit-card">
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} className="text-reddit-orange" />
            <h2 className="text-sm font-bold">Reddit Premium</h2>
          </div>
          <p className="text-xs text-reddit-gray mb-3">
            The best Reddit experience, with monthly Coins
          </p>
          <button className="w-full btn-primary text-sm">Try Now</button>
        </div>
      </div>

      {/* Home Create Post */}
      {!showSubredditInfo && (
        <div className="reddit-card p-3">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src="https://www.redditstatic.com/desktop2x/img/id-cards/snoo-home@2x.png"
              alt="Snoo"
              className="w-10 h-12"
            />
            <div>
              <div className="text-sm font-medium">Home</div>
              <div className="text-xs text-reddit-gray">
                Your personal Reddit frontpage. Come here to check in with your favorite communities.
              </div>
            </div>
          </div>
          <Link to="/submit" className="block w-full btn-primary text-center">
            Create Post
          </Link>
          <Link to="/subreddits/create" className="block w-full btn-secondary text-center mt-2">
            Create Community
          </Link>
        </div>
      )}

      {/* Footer Links */}
      <div className="reddit-card p-3">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
          <Link to="/help" className="hover:underline">Help</Link>
          <Link to="/coins" className="hover:underline">Reddit Coins</Link>
          <Link to="/premium" className="hover:underline">Reddit Premium</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/careers" className="hover:underline">Careers</Link>
          <Link to="/press" className="hover:underline">Press</Link>
          <Link to="/advertise" className="hover:underline">Advertise</Link>
          <Link to="/blog" className="hover:underline">Blog</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/content-policy" className="hover:underline">Content Policy</Link>
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link to="/mod-policy" className="hover:underline">Mod Policy</Link>
        </div>
        <div className="text-xs text-reddit-gray mt-4">
          Reddit Inc © 2024. All rights reserved
        </div>
      </div>
    </aside>
  );
};