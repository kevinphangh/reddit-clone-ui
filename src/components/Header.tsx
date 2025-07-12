import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  isLoggedIn = false, 
  username = 'bruger'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold text-gray-900">
          VIA Pædagoger
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Søg..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link to="/submit" className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Plus size={20} />
              </Link>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {username.charAt(0).toUpperCase()}
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