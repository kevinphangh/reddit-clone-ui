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
    
    if (title.length > 100) {
      setError(`Titlen er for lang (${title.length}/100 tegn). Forkort venligst din titel.`);
      return;
    }
    
    if (!content.trim()) {
      setError('Indtast venligst noget indhold');
      return;
    }
    
    if (content.length > 5000) {
      setError(`Indholdet er for langt (${content.length}/5000 tegn). Forkort venligst dit indlæg.`);
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
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 text-center">
          <LogIn className="mx-auto mb-4 text-gray-700" size={48} />
          <h2 className="text-heading-2 text-gray-900 mb-2">
            Hej der! 👋
          </h2>
          <p className="text-body text-gray-600 mb-6">
            For at dele dine tanker og være en del af vores hyggelige fællesskab, skal du først logge ind eller blive medlem
          </p>
          <div className="space-y-3">
            <a
              href="/login?from=/submit"
              className="block w-full bg-primary-600 text-gray-900 text-button py-2 rounded hover:bg-primary-700 transition-colors"
            >
              Log ind
            </a>
            <a
              href="/register"
              className="block w-full border border-gray-300 text-button py-2 rounded hover:border-gray-400 transition-colors"
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
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h1 className="text-heading-2 mb-2">Del dine tanker med fællesskabet 💭</h1>
        <p className="text-body-small text-gray-600 mb-6">Hvad beskæftiger dig som pædagogstuderende? Del dine oplevelser, spørgsmål eller inspiration!</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-body-small text-red-700">
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
              placeholder="Hvad handler dit indlæg om?"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none text-body ${
                title.length > 100 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-primary-500'
              }`}
            />
            {title.length > 100 && (
              <div className="text-caption text-red-600 mt-1">
                Titlen er for lang ({title.length}/100 tegn)
              </div>
            )}
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setError('');
              }}
              placeholder="Fortæl os mere... Hvad tænker du på? Har du en god historie, et spørgsmål, eller noget du gerne vil diskutere?"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none text-body min-h-[200px] resize-y ${
                content.length > 5000 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:border-primary-500'
              }`}
              rows={8}
            />
            {content.length > 5000 && (
              <div className="text-caption text-red-600 mt-1">
                Indholdet er for langt ({content.length}/5000 tegn)
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded hover:border-gray-400 transition-colors text-button"
            >
              Annuller
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-gray-900 rounded hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-button"
            >
              {isSubmitting ? 'Deler med fællesskabet...' : 'Del med fællesskabet ✨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};