const CACHE="atlas-cloud-v1-2";
const APP=["./","./index.html","./styles.css?v=1.2.0","./app.js?v=1.2.0","./manifest.json","./atlas-logo.jpg","./icon-192.png","./icon-512.png"];
self.addEventListener("install",event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP)))});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET") return;
  const url=new URL(event.request.url);
  const networkFirst=url.pathname.endsWith("/index.html")||url.pathname.endsWith("/app.js")||url.pathname==="/";
  if(networkFirst){
    event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(r=>r||caches.match("./index.html"))));
  }else{
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));return response})));
  }
});
