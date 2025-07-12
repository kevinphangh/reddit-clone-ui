import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  BarChart3, 
  ChevronDown,
  Bold,
  Italic,
  Code,
  Link2,
  List,
  ListOrdered,
  Quote,
  Heading,
  AlertCircle,
  X
} from 'lucide-react';
import { clsx } from 'clsx';

export const SubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const [postType, setPostType] = useState<'text' | 'link' | 'image' | 'poll'>('text');
  const [selectedSubreddit, setSelectedSubreddit] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [flairId, setFlairId] = useState('');
  const [isNSFW, setIsNSFW] = useState(false);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isOC, setIsOC] = useState(false);
  const [showSubredditDropdown, setShowSubredditDropdown] = useState(false);
  const [showFlairDropdown, setShowFlairDropdown] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Mock subreddits for dropdown
  const mockSubreddits = [
    { name: 'VIAPaedagoger', icon: '🎓', members: 1523 },
    { name: 'Specialpaedagogik', icon: '🧩', members: 987 },
    { name: 'Boernehave', icon: '🏫', members: 2341 },
    { name: 'Fritidshjem', icon: '🎨', members: 1876 },
    { name: 'Studerende', icon: '📚', members: 3452 }
  ];

  // Mock flairs
  const mockFlairs = [
    { id: '1', text: 'Diskussion', backgroundColor: '#0079d3', textColor: '#ffffff' },
    { id: '2', text: 'Spørgsmål', backgroundColor: '#ff4500', textColor: '#ffffff' },
    { id: '3', text: 'Nyheder', backgroundColor: '#46d160', textColor: '#ffffff' },
    { id: '4', text: 'Vejledning', backgroundColor: '#ffd635', textColor: '#000000' }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!selectedSubreddit) {
      newErrors.subreddit = 'Vælg venligst et fællesskab';
    }
    
    if (!title.trim()) {
      newErrors.title = 'Indtast venligst en titel';
    } else if (title.length > 300) {
      newErrors.title = 'Titlen må maksimalt være 300 tegn';
    }
    
    if (postType === 'text' && !content.trim()) {
      newErrors.content = 'Indtast venligst noget tekst';
    }
    
    if ((postType === 'link' || postType === 'image') && !url.trim()) {
      newErrors.url = 'Indtast venligst en URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // In a real app, this would submit to the backend
      navigate('/');
    }
  };

  const characterCount = title.length;
  const remainingCharacters = 300 - characterCount;

  return (
    <div className="max-w-[740px]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-medium">Opret et indlæg</h1>
        <Link 
          to="/" 
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          KLADDER
          <span className="ml-1 text-gray-500">0</span>
        </Link>
      </div>

      {/* Community Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="relative">
          <button
            onClick={() => setShowSubredditDropdown(!showSubredditDropdown)}
            className={clsx(
              'w-full flex items-center justify-between p-2 rounded border',
              errors.subreddit ? 'border-red-500' : 'border-gray-200',
              'hover:border-gray-300 focus:border-blue-500 focus:outline-none'
            )}
          >
            {selectedSubreddit ? (
              <span className="flex items-center gap-2">
                <span className="text-lg">
                  {mockSubreddits.find(s => s.name === selectedSubreddit)?.icon}
                </span>
                <span className="font-medium">r/{selectedSubreddit}</span>
              </span>
            ) : (
              <span className="text-gray-500">Vælg et fællesskab</span>
            )}
            <ChevronDown size={20} className="text-gray-500" />
          </button>

          {showSubredditDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-full">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Søg fællesskaber"
                  className="w-full w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {mockSubreddits.map(sub => (
                  <button
                    key={sub.name}
                    onClick={() => {
                      setSelectedSubreddit(sub.name);
                      setShowSubredditDropdown(false);
                      setErrors({ ...errors, subreddit: '' });
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 w-full"
                  >
                    <span className="text-2xl">{sub.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">r/{sub.name}</div>
                      <div className="text-xs text-gray-500">
                        {sub.members.toLocaleString('da-DK')} medlemmer
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {errors.subreddit && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.subreddit}
          </p>
        )}
      </div>

      {/* Post Type Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setPostType('text')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm border-b-2 transition-colors',
              postType === 'text' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-500 border-transparent hover:text-gray-900'
            )}
          >
            <FileText size={20} />
            Indlæg
          </button>
          <button
            onClick={() => setPostType('image')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm border-b-2 transition-colors',
              postType === 'image' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-500 border-transparent hover:text-gray-900'
            )}
          >
            <ImageIcon size={20} />
            Billeder & Video
          </button>
          <button
            onClick={() => setPostType('link')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm border-b-2 transition-colors',
              postType === 'link' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-500 border-transparent hover:text-gray-900'
            )}
          >
            <LinkIcon size={20} />
            Link
          </button>
          <button
            onClick={() => setPostType('poll')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm border-b-2 transition-colors',
              postType === 'poll' 
                ? 'text-blue-600 border-blue-600' 
                : 'text-gray-500 border-transparent hover:text-gray-900'
            )}
          >
            <BarChart3 size={20} />
            Afstemning
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Title */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors({ ...errors, title: '' });
                }}
                placeholder="Titel"
                className={clsx(
                  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500',
                  errors.title && 'border-red-500'
                )}
                maxLength={300}
              />
              <span className={clsx(
                'absolute right-3 top-1/2 -translate-y-1/2 text-xs',
                remainingCharacters < 20 ? 'text-red-500' : 'text-gray-500'
              )}>
                {remainingCharacters}
              </span>
            </div>
            {errors.title && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Content based on post type */}
          {postType === 'text' && (
            <div className="mb-4">
              <div className="border border-gray-200 rounded overflow-hidden">
                {/* Markdown toolbar */}
                <div className="flex items-center gap-1 p-2 bg-gray-100 border-b border-gray-200">
                  <button type="button" className="p-1 hover:bg-gray-100 rounded">
                    <Bold size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded">
                    <Italic size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded">
                    <Link2 size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded">
                    <Quote size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded">
                    <Code size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded">
                    <List size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded">
                    <ListOrdered size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-gray-100 rounded">
                    <Heading size={16} />
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setErrors({ ...errors, content: '' });
                  }}
                  placeholder="Tekst (valgfri)"
                  className={clsx(
                    'w-full p-4 min-h-[200px] resize-y focus:outline-none',
                    errors.content && 'border-red-500'
                  )}
                />
              </div>
              {errors.content && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.content}
                </p>
              )}
            </div>
          )}

          {(postType === 'link' || postType === 'image') && (
            <div className="mb-4">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErrors({ ...errors, url: '' });
                }}
                placeholder={postType === 'image' ? 'Billede/Video URL' : 'URL'}
                className={clsx(
                  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500',
                  errors.url && 'border-red-500'
                )}
              />
              {errors.url && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.url}
                </p>
              )}
            </div>
          )}

          {postType === 'poll' && (
            <div className="mb-4 p-4 bg-gray-100 rounded text-center">
              <BarChart3 size={48} className="mx-auto mb-2 text-gray-500" />
              <p className="text-sm text-gray-500">Afstemninger kommer snart!</p>
            </div>
          )}

          {/* Flair Selector */}
          <div className="mb-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFlairDropdown(!showFlairDropdown)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300"
              >
                {flairId ? (
                  <>
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: mockFlairs.find(f => f.id === flairId)?.backgroundColor }}
                    />
                    <span className="text-sm font-medium">
                      {mockFlairs.find(f => f.id === flairId)?.text}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlairId('');
                      }}
                      className="hover:bg-gray-100 rounded p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium">Flair</span>
                    <ChevronDown size={14} />
                  </>
                )}
              </button>

              {showFlairDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {mockFlairs.map(flair => (
                    <button
                      key={flair.id}
                      type="button"
                      onClick={() => {
                        setFlairId(flair.id);
                        setShowFlairDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: flair.backgroundColor }}
                      />
                      <span>{flair.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Post Options */}
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOC}
                onChange={(e) => setIsOC(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Originalt indhold (OI)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSpoiler}
                onChange={(e) => setIsSpoiler(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Marker som spoiler</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNSFW}
                onChange={(e) => setIsNSFW(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Marker som NSFW</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border border-gray-300 rounded hover:bg-gray-50 px-4 py-2"
            >
              Annuller
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded hover:bg-blue-700 px-4 py-2"
            >
              Opret
            </button>
          </div>
        </form>
      </div>

      {/* Posting Guidelines */}
      <div className="mt-4 text-xs text-gray-500">
        <p>
          Ved at oprette indlæg accepterer du VIA Pædagogers{' '}
          <Link to="/terms" className="text-blue-600 hover:underline">Brugsbetingelser</Link>
          {' '}og{' '}
          <Link to="/content-policy" className="text-blue-600 hover:underline">Indholdspolitik</Link>
        </p>
      </div>
    </div>
  );
};