import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

// AGGRESSIVE FIX: Block ALL fly.dev requests and redirect to Vercel
const originalFetch = window.fetch;
window.fetch = function(...args) {
  let input = args[0];
  
  if (typeof input === 'string') {
    // Block fly.dev requests completely
    if (input.includes('fly.dev')) {
      console.error('🚨 BLOCKED FLY.DEV REQUEST:', input);
      // Redirect to Vercel equivalent
      input = input.replace('https://via-forum-api.fly.dev', 'https://via-forum.vercel.app');
      args[0] = input;
      console.log('✅ REDIRECTED TO:', input);
    }
    
    // Ensure HTTPS
    if (input.startsWith('http://')) {
      input = input.replace('http://', 'https://');
      args[0] = input;
    }
  }
  
  return originalFetch.apply(this, args);
};

// EMERGENCY CACHE CLEAR: Clear everything on each load until migration is complete
window.addEventListener('load', () => {
  // Clear localStorage if it contains fly.dev references
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value && value.includes('fly.dev')) {
        console.log('🗑️ Removing fly.dev from localStorage key:', key);
        localStorage.removeItem(key);
      }
    }
  }
  
  // Clear all service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        console.log('🗑️ Unregistering service worker');
        registration.unregister();
      });
    });
  }
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        console.log('🗑️ Deleting cache:', cacheName);
        caches.delete(cacheName);
      });
    });
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)