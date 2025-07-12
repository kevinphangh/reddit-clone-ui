import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, LogOut, ChevronDown } from 'lucide-react';
import { SearchDropdown } from './SearchDropdown';
import { mockPosts } from '../data/mockData';
import { useClickOutside } from '../hooks/useClickOutside';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
}

export const Header: React.FC<HeaderProps> = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useClickOutside<HTMLDivElement>(() => setShowResults(false), showResults);
  const userMenuRef = useClickOutside<HTMLDivElement>(() => setShowUserMenu(false), showUserMenu);

  // Live search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return mockPosts
      .filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.content?.toLowerCase().includes(query)
      )
      .slice(0, 5); // Max 5 results
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold text-gray-900">
          VIA Pædagoger
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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
        <div className="flex items-center gap-3">
          <Link 
            to="/submit" 
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            aria-label="Opret indlæg"
          >
            <Plus size={20} />
          </Link>
          
          {isLoggedIn ? (
            <>
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
                  aria-label="Brugermenu"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={16} className="text-gray-600" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
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
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Tilmeld
              </Link>
              <Link to="/login" className="px-4 py-2 border border-gray-300 rounded hover:border-gray-400">
                Log ind
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};