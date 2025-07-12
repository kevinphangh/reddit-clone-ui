import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
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
    { name: 'Pædagogik', members: 41234 },
    { name: 'Børneudvikling', members: 37890 },
    { name: 'Inklusion', members: 34567 }
  ]
}) => {
  return (
    <aside className="w-full flex flex-col gap-4">
      {/* Subreddit Info Card */}
      {showSubredditInfo && subreddit && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h1 className="text-lg font-semibold mb-2">{subreddit.displayName}</h1>
            <div className="text-sm text-gray-600 mb-3">r/{subreddit.name}</div>
            
            <p className="text-sm mb-4 text-gray-700">{subreddit.description}</p>
            
            {/* Stats */}
            <div className="flex gap-4 mb-4 text-sm">
              <div>
                <div className="font-medium">{formatNumber(subreddit.members)}</div>
                <div className="text-gray-500">Medlemmer</div>
              </div>
              <div>
                <div className="font-medium">{formatNumber(subreddit.activeUsers)}</div>
                <div className="text-gray-500">Online</div>
              </div>
            </div>
            
            <Link to="/submit" className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700">
              Opret indlæg
            </Link>
        </div>
      )}


      {/* Popular Communities */}
      {!showSubredditInfo && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-600" />
            Populære fællesskaber
          </h2>
          <div className="space-y-2">
            {trendingCommunities.map((community, index) => (
              <Link 
                key={community.name}
                to={`/r/${community.name}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
              >
                <span className="text-sm font-medium w-4 text-gray-500">{index + 1}</span>
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">{community.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">r/{community.name}</div>
                  <div className="text-xs text-gray-500">{formatNumber(community.members)} medlemmer</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}



    </aside>
  );
};