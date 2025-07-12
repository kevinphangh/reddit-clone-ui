import React from 'react';
import { useParams } from 'react-router-dom';

const pageContent: { [key: string]: { title: string; content: string } } = {
  help: {
    title: 'Hjælp',
    content: 'Her kan du finde hjælp til at bruge VIA Pædagoger forum.'
  },
  about: {
    title: 'Om',
    content: 'VIA Pædagoger forum er et sted for pædagogstuderende og pædagoger at dele viden og erfaringer.'
  },
  terms: {
    title: 'Brugsbetingelser',
    content: 'Brugsbetingelserne for VIA Pædagoger forum.'
  },
  'content-policy': {
    title: 'Indholdspolitik',
    content: 'Retningslinjer for indhold på VIA Pædagoger forum.'
  },
  'privacy-policy': {
    title: 'Privatlivspolitik',
    content: 'Hvordan vi beskytter dit privatliv på VIA Pædagoger forum.'
  },
  'mod-policy': {
    title: 'Moderatorpolitik',
    content: 'Retningslinjer for moderatorer på VIA Pædagoger forum.'
  },
  careers: {
    title: 'Karriere',
    content: 'Information om karrieremuligheder.'
  },
  press: {
    title: 'Presse',
    content: 'Presseinformation.'
  },
  advertise: {
    title: 'Annoncer',
    content: 'Information om annoncering.'
  },
  blog: {
    title: 'Blog',
    content: 'VIA Pædagoger blog.'
  },
  coins: {
    title: 'VIA Coins',
    content: 'Information om VIA Coins belønningssystem.'
  },
  premium: {
    title: 'VIA Premium',
    content: 'Information om VIA Premium medlemskab.'
  }
};

export const StaticPage: React.FC = () => {
  const { page } = useParams<{ page: string }>();
  
  const pageData = page ? pageContent[page] : null;
  
  if (!pageData) {
    return (
      <div className="via-card p-8 text-center">
        <h1 className="text-xl font-bold mb-2">Side ikke fundet</h1>
        <p className="text-via-gray">Den side du leder efter eksisterer ikke.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="via-card p-6">
        <h1 className="text-2xl font-bold mb-4">{pageData.title}</h1>
        <p className="text-via-gray">{pageData.content}</p>
      </div>
    </div>
  );
};