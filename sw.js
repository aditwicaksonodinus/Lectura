/**
 * sw.js
 * ─────────────────────────────────────────────────────────────
 * Lectura Service Worker for offline presentation capability.
 * 
 * Strategies:
 *  1. Google Fonts CDN (fonts.googleapis.com / fonts.gstatic.com) -> Cache-First
 *     Once downloaded, fonts are served directly from the cache.
 *  2. Local assets (HTML, CSS, JS, JSON, Markdown slides) -> Network-First
 *     Allows immediate visibility of local slide/code changes while 
 *     providing a reliable fallback to cache when offline.
 * ─────────────────────────────────────────────────────────────
 */

const CACHE_NAME = 'lectura-cache-v1';

const PRECACHE_ASSETS = [
    './',
    './index.html',
    './style.css?v=2',
    './config.json',
    './styles/tokens.css',
    './styles/themes.css',
    './styles/base.css',
    './styles/typography.css',
    './styles/layout.css',
    './styles/components.css',
    './styles/ui.css',
    './styles/animations.css',
    './styles/vendor/reset.min.css',
    './styles/vendor/reveal.min.css',
    './js/main.js',
    './js/theme.js',
    './js/slides.js',
    './js/config.js',
    './js/layouts.js',
    './js/styles.js',
    './js/ui.js',
    './js/animation.js',
    './js/timer.js',
    './js/tabs.js',
    './js/accessibility.js',
    './js/cards.js',
    './js/gestures.js',
    './js/image-preview.js',
    './js/laser.js',
    './js/scribble.js',
    './js/navigation.js',
    './js/vendor/marked.min.js',
    './js/vendor/reveal.min.js',
    './js/vendor/math.min.js',
    './fonts/NotoSerif-Variable.ttf',
    './fonts/Inter-Regular.ttf',
    './fonts/Inter-Bold.ttf',
    './fonts/JetBrainsMono-Regular.ttf',
    './fonts/JetBrainsMono-Bold.ttf',
    './fonts/LibreBaskerville-Regular.ttf',
    './fonts/Lato-Regular.ttf'
];

// ── Service Worker Install Event ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Pre-caching core layout assets');
            // Using Map to catch errors in individual assets during cache addition
            return Promise.all(
                PRECACHE_ASSETS.map((asset) => {
                    return cache.add(asset).catch((err) => {
                        console.warn(`[Service Worker] Failed to pre-cache asset: ${asset}`, err);
                    });
                })
            );
        })
    );
    self.skipWaiting();
});

// ── Service Worker Activate Event ───────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log(`[Service Worker] Deleting obsolete cache: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// ── Service Worker Fetch Event ──────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    // Only intercept GET requests
    if (event.request.method !== 'GET') return;

    // 2. Local Assets (Network-First, fallback to Cache)
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // If offline or network error, serve from cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Special offline fallback warning for MD content if not cached
                    if (event.request.url.endsWith('.md')) {
                        return new Response('## Offline\nSlide content is not cached yet.', {
                            headers: { 'Content-Type': 'text/markdown' }
                        });
                    }
                });
            })
    );
});
