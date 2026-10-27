/* Historic app shell + stories cache */
const CACHE = 'historic-v6';
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-180.png",
  "./icons/icon-512.png",
  "./assets/topic.css",
  "./js/shell.js",
  "./css/story-enhance.css",
  "./css/narrator.css",
  "./js/monetization.js",
  "./js/narrator.js",
  "./js/story-enhance.js",
  "./cospaia.html",
  "./seneca.html",
  "./steiner.html",
  "./rudolf-steiner.html",
  "./stories/ada-lovelace.html",
  "./stories/african-philosophical-traditions.html",
  "./stories/ages-what-people-mean.html",
  "./stories/aksum.html",
  "./stories/ancient-egyptian-religion.html",
  "./stories/animism-indigenous-sacred.html",
  "./stories/ark-of-the-covenant.html",
  "./stories/astrological-ages.html",
  "./stories/astrology-history.html",
  "./stories/banu-musa.html",
  "./stories/bronze-age-early-states.html",
  "./stories/buddhism.html",
  "./stories/christianity.html",
  "./stories/classical-antiquity.html",
  "./stories/confucian-daoist-buddhist-thought.html",
  "./stories/contemporary-age-now.html",
  "./stories/cospaia.html",
  "./stories/daoism-chinese-folk.html",
  "./stories/early-modern-industrial.html",
  "./stories/great-zimbabwe.html",
  "./stories/greek-city-states-democracy.html",
  "./stories/greek-religion-mystery-cults.html",
  "./stories/hellenistic-alexandria.html",
  "./stories/hermione-mutiny.html",
  "./stories/hindu-traditions.html",
  "./stories/hypatia.html",
  "./stories/ibn-sina.html",
  "./stories/iron-age-axial-age.html",
  "./stories/islam.html",
  "./stories/jainism.html",
  "./stories/judaism.html",
  "./stories/kingdom-of-kush.html",
  "./stories/late-antiquity-medieval.html",
  "./stories/library-of-celsus.html",
  "./stories/male-revolt.html",
  "./stories/mapuche-resistance.html",
  "./stories/mary-seacole.html",
  "./stories/mesopotamian-religion.html",
  "./stories/mystery-hermetic-currents.html",
  "./stories/orisha-yoruba-diaspora.html",
  "./stories/paleolithic-neolithic-spirit.html",
  "./stories/pig-war.html",
  "./stories/platos-academy-legacy.html",
  "./stories/presocratics-plato-aristotle.html",
  "./stories/pyrrhonian-skepticism.html",
  "./stories/queen-nzinga.html",
  "./stories/roman-law-roads-everyday.html",
  "./stories/roman-religion-imperial-cult.html",
  "./stories/rome-republic-empire.html",
  "./stories/seneca.html",
  "./stories/shinto.html",
  "./stories/sikhism.html",
  "./stories/sogdian-traders.html",
  "./stories/steiner.html",
  "./stories/stoicism-in-rome.html",
  "./stories/timbuktu-manuscripts.html",
  "./stories/world-philosophies.html",
  "./stories/yi-sun-sin.html",
  "./stories/zanj-rebellion.html",
  "./stories/zoroastrianism.html",
  "./categories/africa-diaspora.html",
  "./categories/ages-eras.html",
  "./categories/ancient-greece.html",
  "./categories/ancient-rome.html",
  "./categories/free-zones.html",
  "./categories/philosophy.html",
  "./categories/religions.html",
  "./categories/sacred-objects.html",
  "./categories/science-invention.html",
  "./categories/sky-lore.html",
  "./categories/thinkers.html",
  "./categories/women.html",
  "./ages/overview.html"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
