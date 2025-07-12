import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MessageSquare, 
  Bell, 
  Plus, 
  User, 
  LogOut,
  Settings,
  Moon,
  ChevronDown,
  Users,
  Shield,
  FileText,
  BookOpen,
  GraduationCap,
  Heart,
  Sparkles
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
    <header className="fixed top-0 left-0 right-0 h-[64px] bg-gradient-to-r from-via-blue via-via-primary to-via-secondary shadow-lg z-50">
      <div className="flex items-center h-full px-6 gap-6">
        {/* VIA Logo and Home Link */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="relative">
            <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap size={24} className="text-via-blue" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-via-orange rounded-full flex items-center justify-center">
              <Heart size={10} className="text-white" />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-white text-lg font-bold leading-tight drop-shadow-sm">VIA Pædagoger</div>
            <div className="text-via-orange text-xs leading-tight opacity-90">Fællesskab for pædagogstuderende</div>
          </div>
        </Link>

        {/* Navigation Pills */}
        <div className="hidden lg:flex items-center gap-2">
          <Link to="/" className="nav-pill nav-pill-active">
            <BookOpen size={16} />
            <span>Forum</span>
          </Link>
          <Link to="/studiegrupper" className="nav-pill">
            <Users size={16} />
            <span>Studiegrupper</span>
          </Link>
          <Link to="/ressourcer" className="nav-pill">
            <FileText size={16} />
            <span>Ressourcer</span>
          </Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[500px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-via-gray" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søg efter hjælp, erfaringer, ressourcer..."
              className="w-full h-[44px] pl-12 pr-4 bg-white/90 backdrop-blur-sm hover:bg-white focus:bg-white rounded-xl border border-white/20 focus:border-white focus:outline-none transition-all placeholder:text-via-gray/70 shadow-sm"
            />
          </div>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* VIA Points */}
              <button className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
                <Sparkles size={18} className="text-via-orange" />
                <span className="text-sm font-medium text-white">{karma.toLocaleString()}</span>
                <span className="text-xs text-white/80">point</span>
              </button>

              {/* Notifications */}
              <button className="p-3 hover:bg-white/10 rounded-lg transition-all relative">
                <Bell size={20} className="text-white" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-via-orange rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </button>

              {/* Messages */}
              <button className="p-3 hover:bg-white/10 rounded-lg transition-all relative">
                <MessageSquare size={20} className="text-white" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-via-orange rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </button>

              {/* Create Post */}
              <div className="relative">
                <button 
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-via-orange hover:bg-via-darkOrange rounded-lg transition-all shadow-sm"
                >
                  <Plus size={18} className="text-white" />
                  <span className="hidden sm:block text-sm font-medium text-white">Opret</span>
                </button>
                {showCreateMenu && (
                  <div className="dropdown-menu w-[280px] mt-2">
                    <Link to="/submit" className="dropdown-item flex items-center gap-3 py-3">
                      <div className="w-10 h-10 bg-via-blue/10 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-via-blue" />
                      </div>
                      <div>
                        <div className="font-medium">Opret indlæg</div>
                        <div className="text-xs text-via-gray">Del dine tanker og erfaringer</div>
                      </div>
                    </Link>
                    <Link to="/studiegrupper/create" className="dropdown-item flex items-center gap-3 py-3">
                      <div className="w-10 h-10 bg-via-secondary/10 rounded-lg flex items-center justify-center">
                        <Users size={20} className="text-via-secondary" />
                      </div>
                      <div>
                        <div className="font-medium">Opret studiegruppe</div>
                        <div className="text-xs text-via-gray">Samarbejd med andre studerende</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-via-orange to-via-darkOrange rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{username.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-via-green rounded-full border-2 border-white flex items-center justify-center">
                        <Shield size={8} className="text-white" />
                      </div>
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium text-white">{username}</div>
                      <div className="text-xs text-white/80 flex items-center gap-1">
                        Verificeret pædagog
                      </div>
                    </div>
                  </div>
                  <ChevronDown size={16} className="text-white/80" />
                </button>

                {showUserMenu && (
                  <div className="dropdown-menu w-[280px] mt-2">
                    <div className="px-4 py-3 border-b border-via-lightGray bg-gradient-to-r from-via-blue/5 to-via-secondary/5">
                      <div className="text-sm font-medium">{username}</div>
                      <div className="text-xs text-via-gray flex items-center gap-2 mt-1">
                        <Shield size={12} className="text-via-green" />
                        <span>Verificeret pædagog</span>
                        <span>•</span>
                        <span>{karma.toLocaleString()} point</span>
                      </div>
                    </div>
                    <Link to={`/user/${username}`} className="dropdown-item flex items-center gap-3 py-3">
                      <div className="w-8 h-8 bg-via-blue/10 rounded-lg flex items-center justify-center">
                        <User size={16} className="text-via-blue" />
                      </div>
                      <span>Min profil</span>
                    </Link>
                    <Link to="/settings" className="dropdown-item flex items-center gap-3 py-3">
                      <div className="w-8 h-8 bg-via-gray/10 rounded-lg flex items-center justify-center">
                        <Settings size={16} className="text-via-gray" />
                      </div>
                      <span>Indstillinger</span>
                    </Link>
                    <button className="dropdown-item flex items-center gap-3 py-3 w-full">
                      <div className="w-8 h-8 bg-via-darkGray/10 rounded-lg flex items-center justify-center">
                        <Moon size={16} className="text-via-darkGray" />
                      </div>
                      <span>Mørk tilstand</span>
                    </button>
                    <div className="border-t border-via-lightGray my-1"></div>
                    <button className="dropdown-item flex items-center gap-3 py-3 w-full text-via-gray hover:text-via-red">
                      <div className="w-8 h-8 bg-via-red/10 rounded-lg flex items-center justify-center">
                        <LogOut size={16} className="text-via-red" />
                      </div>
                      <span>Log ud</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/register" className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-via-orange hover:bg-via-darkOrange text-white font-medium rounded-lg shadow-sm transition-all hover:shadow-md">
                <GraduationCap size={16} />
                <span>Bliv medlem</span>
              </Link>
              <Link to="/login" className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all border border-white/20 hover:border-white/40">
                Log ind
              </Link>
              <button className="p-3 hover:bg-white/10 rounded-lg lg:hidden transition-all">
                <User size={20} className="text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};