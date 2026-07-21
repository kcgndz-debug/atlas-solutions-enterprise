const CACHE="atlas-cloud-v1-3";
const APP=["./","./index.html","./styles.css?v=1.3.0","./atlas-v1-3.js?v=1.3.0","./manifest.json","./atlas-logo.jpg","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const u=new URL(e.request.url);
 const fresh=u.pathname.endsWith("/index.html")||u.pathname.endsWith("/atlas-v1-3.js")||u.pathname==="/";
 if(fresh)e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
 else e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
