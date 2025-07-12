import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  TrendingUp, 
  MessageSquare, 
  Bell, 
  Plus, 
  User, 
  LogOut,
  Settings,
  Moon,
  ChevronDown,
  Home,
  Compass,
  Users,
  Coins,
  Shield,
  FileText
} from 'lucide-react';

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
  karma?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn = false, 
  username = 'redditor',
  karma = 1234
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[48px] bg-white border-b border-reddit-lightGray z-50">
      <div className="flex items-center h-full px-4 gap-4">
        {/* Reddit Logo and Home Link */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#FF4500"/>
            <path d="M22 16c0-1.1-.9-2-2-2-.6 0-1.1.3-1.5.7-1.3-.9-3.1-1.5-5.1-1.6l.9-4.2 2.8.6c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5-.7-1.5-1.5-1.5c-.6 0-1.1.4-1.3.9l-3.1-.7c-.1 0-.2 0-.3 0-.1.1-.1.2-.2.3l-.9 4.5c-2 .1-3.7.7-5.1 1.6-.4-.4-.9-.7-1.5-.7-1.1 0-2 .9-2 2 0 .8.5 1.5 1.1 1.8 0 .2-.1.4-.1.7 0 3.3 3.9 6 8.6 6s8.6-2.7 8.6-6c0-.2 0-.5-.1-.7.7-.3 1.1-1 1.1-1.8zM11 17.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5zm8.1 4.1c-1 1-3 1.1-3.6 1.1s-2.5-.1-3.6-1.1c-.1-.1-.1-.3 0-.5.1-.1.3-.1.5 0 .7.7 2.2.9 3.1.9s2.4-.2 3.1-.9c.1-.1.3-.1.5 0 .1.2.1.4 0 .5zm-.6-2.6c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" fill="white"/>
          </svg>
          <span className="hidden md:block text-xl font-bold text-reddit-orange">VIA Pædagoger</span>
        </Link>

        {/* Home Dropdown */}
        <div className="relative hidden lg:block">
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-reddit-bg-hover rounded">
            <Home size={20} />
            <span className="font-medium">Hjem</span>
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[690px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-reddit-gray" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søg i forum"
              className="w-full h-[36px] pl-10 pr-4 bg-reddit-bg-hover hover:bg-white hover:border-reddit-blue focus:bg-white rounded-full border border-transparent focus:border-reddit-blue focus:outline-none transition-all"
            />
          </div>
        </form>

        {/* Popular/All Links */}
        <div className="hidden lg:flex items-center gap-1">
          <Link to="/r/popular" className="p-2 hover:bg-reddit-bg-hover rounded">
            <TrendingUp size={20} className="text-reddit-gray" />
          </Link>
          <Link to="/r/all" className="p-2 hover:bg-reddit-bg-hover rounded">
            <Compass size={20} className="text-reddit-gray" />
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* Get Coins */}
              <button className="hidden lg:flex items-center gap-1 px-3 py-1.5 hover:bg-reddit-bg-hover rounded">
                <Coins size={20} className="text-reddit-gray" />
                <span className="text-sm font-medium">Få point</span>
              </button>

              {/* Chat */}
              <button className="p-2 hover:bg-reddit-bg-hover rounded relative">
                <MessageSquare size={20} className="text-reddit-gray" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-reddit-orange rounded-full"></span>
              </button>

              {/* Notifications */}
              <button className="p-2 hover:bg-reddit-bg-hover rounded relative">
                <Bell size={20} className="text-reddit-gray" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-reddit-orange rounded-full"></span>
              </button>

              {/* Create Post */}
              <div className="relative">
                <button 
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="p-2 hover:bg-reddit-bg-hover rounded"
                >
                  <Plus size={20} className="text-reddit-gray" />
                </button>
                {showCreateMenu && (
                  <div className="dropdown-menu w-[270px]">
                    <Link to="/submit" className="dropdown-item flex items-center gap-3">
                      <FileText size={20} />
                      <div>
                        <div className="font-medium">Opret indlæg</div>
                        <div className="text-xs text-reddit-gray">Del dine tanker med fællesskabet</div>
                      </div>
                    </Link>
                    <Link to="/subreddits/create" className="dropdown-item flex items-center gap-3">
                      <Users size={20} />
                      <div>
                        <div className="font-medium">Opret fællesskab</div>
                        <div className="text-xs text-reddit-gray">Byg og udvid et fællesskab</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 hover:bg-reddit-bg-hover rounded"
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={`https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${username.charCodeAt(0) % 7}.png`}
                      alt={username}
                      className="w-6 h-6 rounded"
                    />
                    <div className="hidden lg:block text-left">
                      <div className="text-xs font-medium">{username}</div>
                      <div className="text-xs text-reddit-gray flex items-center gap-1">
                        <Shield size={12} className="text-reddit-orange" />
                        {karma.toLocaleString()} karma
                      </div>
                    </div>
                  </div>
                  <ChevronDown size={16} className="text-reddit-gray" />
                </button>

                {showUserMenu && (
                  <div className="dropdown-menu w-[250px]">
                    <div className="px-4 py-2 border-b border-reddit-lightGray">
                      <div className="text-xs text-reddit-gray mb-1">MINE TING</div>
                    </div>
                    <Link to={`/user/${username}`} className="dropdown-item flex items-center gap-3">
                      <User size={16} />
                      <span>Profil</span>
                    </Link>
                    <Link to="/settings" className="dropdown-item flex items-center gap-3">
                      <Settings size={16} />
                      <span>Brugerindstillinger</span>
                    </Link>
                    <button className="dropdown-item flex items-center gap-3 w-full">
                      <Moon size={16} />
                      <span>Mørk tilstand</span>
                    </button>
                    <div className="border-t border-reddit-lightGray my-1"></div>
                    <button className="dropdown-item flex items-center gap-3 w-full text-reddit-gray">
                      <LogOut size={16} />
                      <span>Log ud</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/register" className="hidden sm:flex items-center gap-2 px-8 py-1.5 bg-reddit-orange hover:bg-reddit-darkOrange text-white font-bold rounded-full transition-colors">
                Tilmeld
              </Link>
              <Link to="/login" className="px-8 py-1.5 border border-reddit-blue text-reddit-blue hover:bg-reddit-blue hover:text-white font-bold rounded-full transition-colors">
                Log ind
              </Link>
              <button className="p-2 hover:bg-reddit-bg-hover rounded lg:hidden">
                <User size={20} className="text-reddit-gray" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};