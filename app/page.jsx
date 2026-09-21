'use client';

import { useEffect } from 'react';
import { ConsultHubProvider } from '@/lib/context';
import MainApp from '@/components/MainApp';

export default function Home() {
  useEffect(() => {
    // Register PWA service worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .catch((err) => console.log('Service Worker registration skipped:', err));
      });
    }
  }, []);

  return (
    <ConsultHubProvider>
      <MainApp />
    </ConsultHubProvider>
  );
}
