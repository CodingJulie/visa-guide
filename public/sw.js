const CACHE_NAME = 'visaguide-v5';
const OFFLINE_URL = '/offline.html';
const HOME_SHELL_URL = '/__visaguide_home_shell__';
const PRECACHE_URLS = [
    OFFLINE_URL,
    '/manifest.json',
    '/noun-usa-2554196.png',
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/apple-touch-icon.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/locales/en/common.json',
    '/locales/ru/common.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
            )
            .then(() => self.clients.claim())
    );
});

function isNavigationRequest(request) {
    return (
        request.mode === 'navigate' ||
        (request.method === 'GET' && (request.headers.get('accept') || '').includes('text/html'))
    );
}

function isHomePath(pathname) {
    return pathname === '/';
}

function isStaticAsset(pathname) {
    return pathname.startsWith('/_next/static/');
}

function isOfflinePage(pathname) {
    return pathname === OFFLINE_URL;
}

function shouldUseCacheFirst(pathname) {
    return isOfflinePage(pathname) || isStaticAsset(pathname);
}

const CACHE_MATCH_OPTIONS = { ignoreSearch: true, ignoreVary: true };

function offlineResponse() {
    return new Response('Offline', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
}

function homeRootRequest(origin) {
    return new Request(new URL('/', origin).href);
}

function homeShellRequest(origin) {
    return new Request(new URL(HOME_SHELL_URL, origin).href);
}

async function putInCache(cache, request, response) {
    if (!response.ok) return;

    await cache.put(request, response.clone());

    const url = new URL(request.url);
    if (!isHomePath(url.pathname) || !isNavigationRequest(request)) return;

    const shellRequest = homeShellRequest(url.origin);
    const rootRequest = homeRootRequest(url.origin);

    await cache.put(shellRequest, response.clone());
    await cache.put(rootRequest, response.clone());
}

async function findHomeFallback(cache, request) {
    const url = new URL(request.url);
    const origin = url.origin;

    const cached = await cache.match(request, CACHE_MATCH_OPTIONS);
    if (cached) return cached;

    const shell = await cache.match(homeShellRequest(origin), CACHE_MATCH_OPTIONS);
    if (shell) return shell;

    const homeRoot = await cache.match(homeRootRequest(origin), CACHE_MATCH_OPTIONS);
    if (homeRoot) return homeRoot;

    const keys = await cache.keys();
    for (const key of keys) {
        const keyUrl = new URL(key.url);
        if (isHomePath(keyUrl.pathname) && isNavigationRequest(key)) {
            const match = await cache.match(key, CACHE_MATCH_OPTIONS);
            if (match) return match;
        }
    }

    return null;
}

async function serveOfflinePage(cache) {
    const offlinePage = await cache.match(OFFLINE_URL, CACHE_MATCH_OPTIONS);
    return offlinePage || offlineResponse();
}

async function handleHomeRequest(request, cache) {
    const url = new URL(request.url);

    if (url.searchParams.get('fromOffline') === '1') {
        const homeFallback = await findHomeFallback(cache, request);
        if (homeFallback) return homeFallback;
    }

    try {
        const response = await fetch(request);
        await putInCache(cache, request, response);
        return response;
    } catch {
        if (!isNavigationRequest(request)) {
            return offlineResponse();
        }

        return serveOfflinePage(cache);
    }
}

async function cacheFirst(request, cache) {
    const cached = await cache.match(request, CACHE_MATCH_OPTIONS);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        await putInCache(cache, request, response);
        return response;
    } catch {
        return offlineResponse();
    }
}

async function networkFirst(request, cache) {
    try {
        const response = await fetch(request);
        await putInCache(cache, request, response);
        return response;
    } catch {
        if (!isNavigationRequest(request)) {
            const cached = await cache.match(request, CACHE_MATCH_OPTIONS);
            return cached || offlineResponse();
        }

        return serveOfflinePage(cache);
    }
}

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            if (isHomePath(url.pathname)) {
                return handleHomeRequest(request, cache);
            }
            if (shouldUseCacheFirst(url.pathname)) {
                return cacheFirst(request, cache);
            }
            return networkFirst(request, cache);
        })
    );
});
