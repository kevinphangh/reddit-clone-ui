import React, { useEffect, useRef } from 'react';
import { PostCard } from '../components/PostCard';
import { useData } from '../contexts/DataContext';
import { AnonymityInfo } from '../components/AnonymityInfo';

export const HomePage: React.FC = () => {
  const { posts, loading, error, hasMore, loadingMore, loadMorePosts } = useData();
  const observerTarget = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMorePosts]);
  
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
  
  
  return (
    <div className="space-y-4">
      {/* Welcome message */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center">
        <h2 className="text-heading-2 mb-2">Velkommen til fællesskabet</h2>
        <p className="text-body text-gray-600 mb-3">Her deler vi vores oplevelser, hjælper hinanden og skaber en stærkere fællesskab af pædagogstuderende.</p>
        <p className="text-button text-gray-800">Sammen skaber vi de bedste pædagoger</p>
      </div>
      
      {/* Anonymity info - show only occasionally */}
      {posts.length > 0 && posts.length < 5 && (
        <AnonymityInfo />
      )}
      
      {/* Posts */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {/* Loading indicator */}
      {loadingMore && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-body text-gray-500">Indlæser flere indlæg...</p>
        </div>
      )}
      
      {/* Observer target */}
      <div ref={observerTarget} className="h-10" />
      
      {/* No more posts message */}
      {!hasMore && posts.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-body-small text-gray-600">Du har set alle indlæg</p>
        </div>
      )}
    </div>
  );
};