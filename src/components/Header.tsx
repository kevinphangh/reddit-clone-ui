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
  Award,
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
    <header className="fixed top-0 left-0 right-0 h-[48px] bg-white border-b border-via-lightGray z-50">
      <div className="flex items-center h-full px-4 gap-4">
        {/* VIA Logo and Home Link */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 bg-via-blue px-3 py-1 rounded">
            <div className="w-6 h-6 bg-via-orange rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">V</span>
            </div>
            <div className="hidden md:block">
              <div className="text-white text-sm font-bold leading-tight">VIA</div>
              <div className="text-via-orange text-xs leading-tight">Pædagoger</div>
            </div>
          </div>
        </Link>

        {/* Home Dropdown */}
        <div className="relative hidden lg:block">
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-via-bg-hover rounded">
            <Home size={20} />
            <span className="font-medium">Hjem</span>
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[690px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-via-gray" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søg i forum"
              className="w-full h-[36px] pl-10 pr-4 bg-via-bg-hover hover:bg-white hover:border-via-blue focus:bg-white rounded-full border border-transparent focus:border-via-blue focus:outline-none transition-all"
            />
          </div>
        </form>

        {/* Popular/All Links */}
        <div className="hidden lg:flex items-center gap-1">
          <Link to="/r/popular" className="p-2 hover:bg-via-bg-hover rounded">
            <TrendingUp size={20} className="text-via-gray" />
          </Link>
          <Link to="/r/all" className="p-2 hover:bg-via-bg-hover rounded">
            <Compass size={20} className="text-via-gray" />
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* Get Coins */}
              <button className="hidden lg:flex items-center gap-1 px-3 py-1.5 hover:bg-via-bg-hover rounded">
                <Award size={20} className="text-via-gray" />
                <span className="text-sm font-medium">VIA Point</span>
              </button>

              {/* Chat */}
              <button className="p-2 hover:bg-via-bg-hover rounded relative">
                <MessageSquare size={20} className="text-via-gray" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-via-orange rounded-full"></span>
              </button>

              {/* Notifications */}
              <button className="p-2 hover:bg-via-bg-hover rounded relative">
                <Bell size={20} className="text-via-gray" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-via-orange rounded-full"></span>
              </button>

              {/* Create Post */}
              <div className="relative">
                <button 
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="p-2 hover:bg-via-bg-hover rounded"
                >
                  <Plus size={20} className="text-via-gray" />
                </button>
                {showCreateMenu && (
                  <div className="dropdown-menu w-[270px]">
                    <Link to="/submit" className="dropdown-item flex items-center gap-3">
                      <FileText size={20} />
                      <div>
                        <div className="font-medium">Opret indlæg</div>
                        <div className="text-xs text-via-gray">Del dine tanker med fællesskabet</div>
                      </div>
                    </Link>
                    <Link to="/subreddits/create" className="dropdown-item flex items-center gap-3">
                      <Users size={20} />
                      <div>
                        <div className="font-medium">Opret fællesskab</div>
                        <div className="text-xs text-via-gray">Byg og udvid et fællesskab</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 hover:bg-via-bg-hover rounded"
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={`https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${username.charCodeAt(0) % 7}.png`}
                      alt={username}
                      className="w-6 h-6 rounded"
                    />
                    <div className="hidden lg:block text-left">
                      <div className="text-xs font-medium">{username}</div>
                      <div className="text-xs text-via-gray flex items-center gap-1">
                        <Shield size={12} className="text-via-orange" />
                        {karma.toLocaleString()} point
                      </div>
                    </div>
                  </div>
                  <ChevronDown size={16} className="text-via-gray" />
                </button>

                {showUserMenu && (
                  <div className="dropdown-menu w-[250px]">
                    <div className="px-4 py-2 border-b border-via-lightGray">
                      <div className="text-xs text-via-gray mb-1">MINE TING</div>
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
                    <div className="border-t border-via-lightGray my-1"></div>
                    <button className="dropdown-item flex items-center gap-3 w-full text-via-gray">
                      <LogOut size={16} />
                      <span>Log ud</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/register" className="hidden sm:flex items-center gap-2 px-8 py-1.5 bg-via-orange hover:bg-via-darkOrange text-white font-bold rounded-full transition-colors">
                Tilmeld
              </Link>
              <Link to="/login" className="px-8 py-1.5 border border-via-blue text-via-blue hover:bg-via-blue hover:text-white font-bold rounded-full transition-colors">
                Log ind
              </Link>
              <button className="p-2 hover:bg-via-bg-hover rounded lg:hidden">
                <User size={20} className="text-via-gray" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};