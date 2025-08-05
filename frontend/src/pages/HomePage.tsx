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
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl p-6 sm:p-8 text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500 rounded-full mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-heading-2 text-primary-800 mb-3 font-bold">Velkommen til fællesskabet</h2>
        <p className="text-body text-primary-700 mb-4 max-w-2xl mx-auto">Her deler vi vores oplevelser, hjælper hinanden og skaber en stærkere fællesskab af pædagogstuderende.</p>
        <div className="inline-block bg-primary-200 px-4 py-2 rounded-full">
          <p className="text-button text-primary-800 font-semibold">✨ Sammen skaber vi de bedste pædagoger ✨</p>
        </div>
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