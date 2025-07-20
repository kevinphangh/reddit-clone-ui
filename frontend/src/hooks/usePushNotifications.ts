import { useState, useEffect } from 'react';

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return null;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (error) {
      return null;
    }
  };

  const subscribeToPush = async () => {
    if (!isSupported) return;

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== 'granted') return;

      // Register service worker
      const registration = await registerServiceWorker();
      if (!registration) return;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'your-vapid-public-key' // This would come from backend
      });

      setSubscription(subscription);

      // Send subscription to backend
      // await api.saveSubscription(subscription);

      return subscription;
    } catch (error) {
      return null;
    }
  };

  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      
      // Remove subscription from backend
      // await api.removeSubscription(subscription);
    } catch (error) {
      // Handle error
    }
  };

  const sendTestNotification = () => {
    if (permission === 'granted' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('VIA Forum', {
          body: 'Velkommen til VIA Pædagoger Forum! 🎓',
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag: 'welcome',
          requireInteraction: true
        });
      });
    }
  };

  return {
    isSupported,
    permission,
    subscription,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification
  };
};