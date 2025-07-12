import React from 'react';
import { useParams } from 'react-router-dom';

export const UserPage: React.FC = () => {
  const { username } = useParams();
  
  return (
    <div className="reddit-card p-4">
      <h1 className="text-xl font-bold mb-4">Brugerprofil</h1>
      <p className="text-reddit-gray">
        Profil for u/{username}
      </p>
    </div>
  );
};