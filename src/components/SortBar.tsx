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
    <div className="reddit-card mb-4">
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
                  ? 'bg-reddit-bg-hover text-reddit-blue'
                  : 'text-reddit-gray hover:bg-reddit-bg-hover'
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
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-reddit-gray hover:bg-reddit-bg-hover rounded-full"
              >
                <span>{getTimeLabel(currentTime)}</span>
                <ChevronDown size={16} />
              </button>
              
              {showTimeFilter && (
                <div className="dropdown-menu">
                  {Object.entries(TIME_FILTER_OPTIONS).map(([key, value]) => (
                    <Link
                      key={key}
                      to={buildSortUrl(currentSort, value)}
                      onClick={() => setShowTimeFilter(false)}
                      className={clsx(
                        'dropdown-item',
                        currentTime === value && 'text-reddit-blue font-bold'
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
            className="flex items-center gap-1 p-2 text-reddit-gray hover:bg-reddit-bg-hover rounded"
          >
            {currentView === 'card' && <CreditCard size={20} />}
            {currentView === 'classic' && <List size={20} />}
            {currentView === 'compact' && <Grid3X3 size={20} />}
            <ChevronDown size={16} />
          </button>
          
          {showViewOptions && (
            <div className="dropdown-menu">
              <button
                onClick={() => {
                  onViewChange?.('card');
                  setShowViewOptions(false);
                }}
                className={clsx(
                  'dropdown-item flex items-center gap-2',
                  currentView === 'card' && 'text-reddit-blue font-bold'
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
                  'dropdown-item flex items-center gap-2',
                  currentView === 'classic' && 'text-reddit-blue font-bold'
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
                  'dropdown-item flex items-center gap-2',
                  currentView === 'compact' && 'text-reddit-blue font-bold'
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