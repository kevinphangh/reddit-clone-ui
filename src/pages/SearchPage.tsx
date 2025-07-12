import React from 'react';
import { useSearchParams } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h1 className="text-xl font-bold mb-4">Søgeresultater</h1>
      <p className="text-gray-500">
        Søger efter: "{query}"
      </p>
    </div>
  );
};