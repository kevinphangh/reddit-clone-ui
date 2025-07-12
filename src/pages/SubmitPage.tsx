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
    { name: 'AskReddit', icon: '🤔', members: 41234567 },
    { name: 'funny', icon: '😄', members: 42123456 },
    { name: 'gaming', icon: '🎮', members: 37890123 },
    { name: 'science', icon: '🔬', members: 28901234 },
    { name: 'technology', icon: '💻', members: 14567890 }
  ];

  // Mock flairs
  const mockFlairs = [
    { id: '1', text: 'Discussion', backgroundColor: '#0079d3', textColor: '#ffffff' },
    { id: '2', text: 'Question', backgroundColor: '#ff4500', textColor: '#ffffff' },
    { id: '3', text: 'News', backgroundColor: '#46d160', textColor: '#ffffff' },
    { id: '4', text: 'Guide', backgroundColor: '#ffd635', textColor: '#000000' }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!selectedSubreddit) {
      newErrors.subreddit = 'Please select a community';
    }
    
    if (!title.trim()) {
      newErrors.title = 'Please enter a title';
    } else if (title.length > 300) {
      newErrors.title = 'Title must be 300 characters or less';
    }
    
    if (postType === 'text' && !content.trim()) {
      newErrors.content = 'Please enter some text';
    }
    
    if ((postType === 'link' || postType === 'image') && !url.trim()) {
      newErrors.url = 'Please enter a URL';
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
        <h1 className="text-lg font-medium">Create a post</h1>
        <Link 
          to="/" 
          className="text-xs font-bold text-reddit-blue hover:underline"
        >
          DRAFTS
          <span className="ml-1 text-reddit-gray">0</span>
        </Link>
      </div>

      {/* Community Selector */}
      <div className="reddit-card p-4 mb-4">
        <div className="relative">
          <button
            onClick={() => setShowSubredditDropdown(!showSubredditDropdown)}
            className={clsx(
              'w-full flex items-center justify-between p-2 rounded border',
              errors.subreddit ? 'border-reddit-red' : 'border-reddit-lightGray',
              'hover:border-reddit-gray focus:border-reddit-blue focus:outline-none'
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
              <span className="text-reddit-gray">Choose a community</span>
            )}
            <ChevronDown size={20} className="text-reddit-gray" />
          </button>

          {showSubredditDropdown && (
            <div className="dropdown-menu w-full">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search communities"
                  className="w-full reddit-input text-sm"
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
                    className="dropdown-item flex items-center gap-3 w-full"
                  >
                    <span className="text-2xl">{sub.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">r/{sub.name}</div>
                      <div className="text-xs text-reddit-gray">
                        {sub.members.toLocaleString()} members
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {errors.subreddit && (
          <p className="text-xs text-reddit-red mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {errors.subreddit}
          </p>
        )}
      </div>

      {/* Post Type Tabs */}
      <div className="reddit-card">
        <div className="flex border-b border-reddit-lightGray">
          <button
            onClick={() => setPostType('text')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm border-b-2 transition-colors',
              postType === 'text' 
                ? 'text-reddit-blue border-reddit-blue' 
                : 'text-reddit-gray border-transparent hover:text-reddit-black'
            )}
          >
            <FileText size={20} />
            Post
          </button>
          <button
            onClick={() => setPostType('image')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm border-b-2 transition-colors',
              postType === 'image' 
                ? 'text-reddit-blue border-reddit-blue' 
                : 'text-reddit-gray border-transparent hover:text-reddit-black'
            )}
          >
            <ImageIcon size={20} />
            Images & Video
          </button>
          <button
            onClick={() => setPostType('link')}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm border-b-2 transition-colors',
              postType === 'link' 
                ? 'text-reddit-blue border-reddit-blue' 
                : 'text-reddit-gray border-transparent hover:text-reddit-black'
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
                ? 'text-reddit-blue border-reddit-blue' 
                : 'text-reddit-gray border-transparent hover:text-reddit-black'
            )}
          >
            <BarChart3 size={20} />
            Poll
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
                placeholder="Title"
                className={clsx(
                  'reddit-input',
                  errors.title && 'border-reddit-red'
                )}
                maxLength={300}
              />
              <span className={clsx(
                'absolute right-3 top-1/2 -translate-y-1/2 text-xs',
                remainingCharacters < 20 ? 'text-reddit-red' : 'text-reddit-gray'
              )}>
                {remainingCharacters}
              </span>
            </div>
            {errors.title && (
              <p className="text-xs text-reddit-red mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Content based on post type */}
          {postType === 'text' && (
            <div className="mb-4">
              <div className="border border-reddit-lightGray rounded overflow-hidden">
                {/* Markdown toolbar */}
                <div className="flex items-center gap-1 p-2 bg-reddit-bg-hover border-b border-reddit-lightGray">
                  <button type="button" className="p-1 hover:bg-reddit-bg-hover rounded">
                    <Bold size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-reddit-bg-hover rounded">
                    <Italic size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-reddit-bg-hover rounded">
                    <Link2 size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-reddit-bg-hover rounded">
                    <Quote size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-reddit-bg-hover rounded">
                    <Code size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-reddit-bg-hover rounded">
                    <List size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-reddit-bg-hover rounded">
                    <ListOrdered size={16} />
                  </button>
                  <button type="button" className="p-1 hover:bg-reddit-bg-hover rounded">
                    <Heading size={16} />
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setErrors({ ...errors, content: '' });
                  }}
                  placeholder="Text (optional)"
                  className={clsx(
                    'w-full p-4 min-h-[200px] resize-y focus:outline-none',
                    errors.content && 'border-reddit-red'
                  )}
                />
              </div>
              {errors.content && (
                <p className="text-xs text-reddit-red mt-1 flex items-center gap-1">
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
                placeholder={postType === 'image' ? 'Image/Video URL' : 'URL'}
                className={clsx(
                  'reddit-input',
                  errors.url && 'border-reddit-red'
                )}
              />
              {errors.url && (
                <p className="text-xs text-reddit-red mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.url}
                </p>
              )}
            </div>
          )}

          {postType === 'poll' && (
            <div className="mb-4 p-4 bg-reddit-bg-hover rounded text-center">
              <BarChart3 size={48} className="mx-auto mb-2 text-reddit-gray" />
              <p className="text-sm text-reddit-gray">Poll posts are coming soon!</p>
            </div>
          )}

          {/* Flair Selector */}
          <div className="mb-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFlairDropdown(!showFlairDropdown)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-reddit-lightGray hover:border-reddit-gray"
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
                      className="hover:bg-reddit-bg-hover rounded p-0.5"
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
                <div className="dropdown-menu">
                  {mockFlairs.map(flair => (
                    <button
                      key={flair.id}
                      type="button"
                      onClick={() => {
                        setFlairId(flair.id);
                        setShowFlairDropdown(false);
                      }}
                      className="dropdown-item flex items-center gap-2"
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
              <span className="text-sm font-medium">Original Content (OC)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSpoiler}
                onChange={(e) => setIsSpoiler(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Mark as Spoiler</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNSFW}
                onChange={(e) => setIsNSFW(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Mark as NSFW</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Posting Guidelines */}
      <div className="mt-4 text-xs text-reddit-gray">
        <p>
          By posting, you agree to Reddit's{' '}
          <Link to="/terms" className="text-reddit-blue hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link to="/content-policy" className="text-reddit-blue hover:underline">Content Policy</Link>
        </p>
      </div>
    </div>
  );
};