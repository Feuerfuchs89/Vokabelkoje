// Vokabelkoje – Offline-Cache. Bei Änderungen an der App die Versionsnummer erhöhen.
const CACHE = 'vokabelkoje-v38';
const CORE = ['./', './index.html', './style.css', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './01-grundlagen.js', './02-oberflaeche.js', './03-ki.js', './04-figuren.js', './05-profile.js', './06-startseite.js', './07-lernen.js', './08-ki-werkzeuge.js', './09-niveau.js', './10-lernpfad.js', './11-uebungen.js', './12-sicherung.js', './13-aktionen.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== 'vokabelkoje-audio').map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Eigene Dateien: erst Netz (damit Updates ankommen), sonst Cache
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req, { cache: 'no-cache' }).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Schriften von Google Fonts: erst Cache, dann Netz
  if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
  }
});
