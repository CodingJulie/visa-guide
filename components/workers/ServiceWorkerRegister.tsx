'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        navigator.serviceWorker
            .register('/sw.js')
            .catch((err) => console.error('SW registration failed:', err));

        const handleOffline = () => {
            if (window.location.pathname === '/offline.html') return;
            window.location.assign('/offline.html');
        };

        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return null;
}
