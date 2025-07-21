import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, LogOut, ChevronDown, Bell } from 'lucide-react';
import { SearchDropdown } from './SearchDropdown';
import { useClickOutside } from '../hooks/useClickOutside';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useData } from '../contexts/DataContext';

export const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { posts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useClickOutside<HTMLDivElement>(() => setShowResults(false), showResults);
  const userMenuRef = useClickOutside<HTMLDivElement>(() => setShowUserMenu(false), showUserMenu);
  const notificationRef = useClickOutside<HTMLDivElement>(() => setShowNotifications(false), showNotifications);

  // Live search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return posts
      .filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query)
      )
      .slice(0, 5); // Max 5 results
  }, [searchQuery, posts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-heading-1 text-gray-900">
          <span className="hidden sm:inline">VIA Pædagoger</span>
          <span className="sm:hidden">VIAP</span>
        </Link>

        {/* Search - Responsive */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-2 sm:mx-4 md:mx-8">
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Søg..."
              className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-body border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
            />
            {showResults && searchResults.length > 0 && (
              <SearchDropdown 
                results={searchResults} 
                onClose={() => {
                  setSearchQuery('');
                  setShowResults(false);
                }}
              />
            )}
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <Link 
            to="/submit" 
            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            aria-label="Opret indlæg"
          >
            <Plus size={20} />
          </Link>
          
          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-50 rounded relative"
                  aria-label="Notifikationer"
                >
                  <Bell size={20} className="text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-caption rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-heading-3">Notifikationer</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <p className="p-4 text-body-small text-gray-500 text-center">
                        Ingen nye notifikationer
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                  aria-label="Brugermenu"
                >
                  <div className="w-8 h-8 bg-primary-600 text-gray-900 rounded-full flex items-center justify-center text-button">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={16} className="text-gray-600" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-body-small font-medium text-gray-900">{user?.username}</p>
                      <p className="text-caption text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-body-small hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={14} />
                      Log ud
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/register" className="px-3 py-2 bg-primary-600 text-gray-900 rounded hover:bg-primary-700 text-button md:px-4">
                Tilmeld
              </Link>
              <Link to="/login" className="px-3 py-2 border border-gray-300 rounded hover:border-gray-400 text-button md:px-4">
                Log ind
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};