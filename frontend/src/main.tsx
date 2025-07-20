import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

// PERMANENT FIX: Intercept all fetch requests to ensure HTTPS
const originalFetch = window.fetch;
window.fetch = function(...args) {
  let input = args[0];
  
  if (typeof input === 'string' && input.includes('via-forum-api.fly.dev')) {
    if (input.startsWith('http://')) {
      // Silently convert HTTP to HTTPS
      input = input.replace('http://', 'https://');
      args[0] = input;
    }
  }
  
  return originalFetch.apply(this, args);
};

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('ServiceWorker registered:', registration))
      .catch(error => console.log('ServiceWorker registration failed:', error));
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)