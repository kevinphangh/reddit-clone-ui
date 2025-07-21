import React from 'react';
import { PostCard } from '../components/PostCard';
import { useData } from '../contexts/DataContext';
import { Mascot } from '../components/Mascot';

export const HomePage: React.FC = () => {
  const { posts, loading, error } = useData();
  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 text-center">
        <p className="text-body text-gray-500">Indlæser...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 md:p-8 text-center">
        <p className="text-body text-red-600">{error}</p>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 text-center">
        <div className="flex justify-center mb-4">
          <Mascot mood="thinking" size="large" />
        </div>
        <h2 className="text-heading-2 mb-2">Velkommen til fællesskabet</h2>
        <p className="text-body text-gray-600 mb-4">Der er ikke nogen indlæg endnu, men det er din chance for at være den første til at dele noget spændende!</p>
        <p className="text-body-small text-gray-700">Del dine tanker, stil spørgsmål, eller fortæl om dine oplevelser som pædagogstuderende</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Welcome message */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center">
        <h2 className="text-heading-2 mb-2">Velkommen til fællesskabet</h2>
        <p className="text-body text-gray-600 mb-3">Her deler vi vores oplevelser, hjælper hinanden og skaber en stærkere fællesskab af pædagogstuderende.</p>
        <p className="text-button text-gray-800">Sammen skaber vi de bedste pædagoger</p>
      </div>
      
      {/* Posts */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};