// 一度開けば電波がなくても動くように、画面のファイルを端末に取っておく。
// V は build_poker_calc_web.py が中身から作る(画面を直すと自動で変わり、古い画面が残らない)
const V = "poker-calc-685fa288f6";
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await c.addAll(FILES.map(u => new Request(u, { cache: "reload" })));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== V) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const hit = await caches.match(e.request, { ignoreSearch: true });
    return hit || fetch(e.request);
  })());
});
