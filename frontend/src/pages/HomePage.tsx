import React from 'react';
import { PostCard } from '../components/PostCard';
import { useData } from '../contexts/DataContext';

export const HomePage: React.FC = () => {
  const { posts, loading, error } = useData();
  
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">Indlæser...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Velkommen til fællesskabet! 🌟</h2>
        <p className="text-gray-600 mb-4">Der er ikke nogen indlæg endnu, men det er din chance for at være den første til at dele noget spændende!</p>
        <p className="text-primary-600 text-sm">Del dine tanker, stil spørgsmål, eller fortæl om dine oplevelser som pædagogstuderende ✨</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Welcome message */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Velkommen til fællesskabet! 🌟</h2>
        <p className="text-gray-600 mb-3">Her deler vi vores oplevelser, hjælper hinanden og skaber en stærkere fællesskab af pædagogstuderende.</p>
        <p className="text-primary-600 text-sm font-medium">Sammen skaber vi de bedste pædagoger ✨</p>
      </div>
      
      {/* Posts */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};