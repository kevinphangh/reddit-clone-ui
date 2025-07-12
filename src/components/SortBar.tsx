import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Flame, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  Award,
  ChevronDown,
  CreditCard,
  List,
  Grid3X3
} from 'lucide-react';
import { clsx } from 'clsx';
import { SORT_OPTIONS, TIME_FILTER_OPTIONS } from '../utils/constants';

interface SortBarProps {
  currentSort?: string;
  currentTime?: string;
  currentView?: 'card' | 'classic' | 'compact';
  onViewChange?: (view: 'card' | 'classic' | 'compact') => void;
}

export const SortBar: React.FC<SortBarProps> = ({ 
  currentSort = SORT_OPTIONS.HOT,
  currentTime = TIME_FILTER_OPTIONS.DAY,
  currentView = 'card',
  onViewChange
}) => {
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [showViewOptions, setShowViewOptions] = useState(false);
  const [searchParams] = useSearchParams();
  
  const getSortIcon = (sort: string) => {
    switch (sort) {
      case SORT_OPTIONS.HOT: return <Flame size={20} />;
      case SORT_OPTIONS.NEW: return <Clock size={20} />;
      case SORT_OPTIONS.TOP: return <BarChart3 size={20} />;
      case SORT_OPTIONS.RISING: return <TrendingUp size={20} />;
      default: return <Award size={20} />;
    }
  };

  const getTimeLabel = (time: string) => {
    switch (time) {
      case TIME_FILTER_OPTIONS.HOUR: return 'Seneste time';
      case TIME_FILTER_OPTIONS.DAY: return 'I dag';
      case TIME_FILTER_OPTIONS.WEEK: return 'Denne uge';
      case TIME_FILTER_OPTIONS.MONTH: return 'Denne måned';
      case TIME_FILTER_OPTIONS.YEAR: return 'Dette år';
      case TIME_FILTER_OPTIONS.ALL: return 'Altid';
      default: return 'I dag';
    }
  };

  const buildSortUrl = (sort: string, time?: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    if (time) params.set('t', time);
    return `?${params.toString()}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4">
      <div className="flex items-center justify-between px-3 py-2">
        {/* Sort Options */}
        <div className="flex items-center">
          {Object.entries(SORT_OPTIONS).map(([key, value]) => (
            <Link
              key={key}
              to={buildSortUrl(value)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-colors',
                currentSort === value
                  ? 'bg-gray-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              {getSortIcon(value)}
              <span className="capitalize">{key === 'HOT' ? 'Populært' : key === 'NEW' ? 'Nyeste' : key === 'RISING' ? 'Stigende' : key === 'CONTROVERSIAL' ? 'Debatteret' : 'Top'}</span>
            </Link>
          ))}
          
          {/* Time Filter for Top/Controversial */}
          {(currentSort === SORT_OPTIONS.TOP || currentSort === SORT_OPTIONS.CONTROVERSIAL) && (
            <div className="relative ml-2">
              <button
                onClick={() => setShowTimeFilter(!showTimeFilter)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <span>{getTimeLabel(currentTime)}</span>
                <ChevronDown size={16} />
              </button>
              
              {showTimeFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {Object.entries(TIME_FILTER_OPTIONS).map(([key, value]) => (
                    <Link
                      key={key}
                      to={buildSortUrl(currentSort, value)}
                      onClick={() => setShowTimeFilter(false)}
                      className={clsx(
                        'w-full px-4 py-2 text-left text-sm hover:bg-gray-50',
                        currentTime === value && 'text-blue-600 font-bold'
                      )}
                    >
                      {getTimeLabel(value)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* View Options */}
        <div className="relative">
          <button
            onClick={() => setShowViewOptions(!showViewOptions)}
            className="flex items-center gap-1 p-2 text-gray-500 hover:bg-gray-100 rounded"
          >
            {currentView === 'card' && <CreditCard size={20} />}
            {currentView === 'classic' && <List size={20} />}
            {currentView === 'compact' && <Grid3X3 size={20} />}
            <ChevronDown size={16} />
          </button>
          
          {showViewOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button
                onClick={() => {
                  onViewChange?.('card');
                  setShowViewOptions(false);
                }}
                className={clsx(
                  'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2',
                  currentView === 'card' && 'text-blue-600 font-bold'
                )}
              >
                <CreditCard size={16} />
                Kort
              </button>
              <button
                onClick={() => {
                  onViewChange?.('classic');
                  setShowViewOptions(false);
                }}
                className={clsx(
                  'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2',
                  currentView === 'classic' && 'text-blue-600 font-bold'
                )}
              >
                <List size={16} />
                Klassisk
              </button>
              <button
                onClick={() => {
                  onViewChange?.('compact');
                  setShowViewOptions(false);
                }}
                className={clsx(
                  'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2',
                  currentView === 'compact' && 'text-blue-600 font-bold'
                )}
              >
                <Grid3X3 size={16} />
                Kompakt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};