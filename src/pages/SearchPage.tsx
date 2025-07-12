import React from 'react';
import { useSearchParams } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  
  return (
    <div className="via-card p-4">
      <h1 className="text-xl font-bold mb-4">Søgeresultater</h1>
      <p className="text-via-gray">
        Søger efter: "{query}"
      </p>
    </div>
  );
};