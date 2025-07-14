import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export const SubmitPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { createPost } = useData();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Indtast venligst en titel');
      return;
    }
    
    if (!content.trim()) {
      setError('Indtast venligst noget indhold');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newPost = await createPost(title.trim(), content.trim());
      navigate(`/comments/${newPost.id}`);
    } catch (err) {
      setError('Der opstod en fejl. Prøv igen.');
      setIsSubmitting(false);
    }
  };

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <LogIn className="mx-auto mb-4 text-gray-400" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Du skal være logget ind
          </h2>
          <p className="text-gray-600 mb-6">
            Log ind eller opret en konto for at oprette indlæg i VIA Pædagoger
          </p>
          <div className="space-y-3">
            <a
              href="/login?from=/submit"
              className="block w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors"
            >
              Log ind
            </a>
            <a
              href="/register"
              className="block w-full border border-gray-300 py-2 rounded hover:border-gray-400 transition-colors"
            >
              Opret konto
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <h1 className="text-xl font-semibold mb-6">Opret indlæg</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="Titel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500"
              maxLength={300}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {title.length}/300
            </div>
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError('');
              }}
              placeholder="Skriv dit indlæg her..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary-500 min-h-[200px] resize-y"
              rows={8}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded hover:border-gray-400 transition-colors"
            >
              Annuller
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Opretter...' : 'Opret indlæg'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};