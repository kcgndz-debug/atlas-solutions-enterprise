const CACHE="atlas-cloud-v2-1-1";
const APP=["./","./index.html?v=2.1.1","./styles.css?v=2.1.1","./atlas-v2-1-1.js?v=2.1.1","./manifest.json","./atlas-logo.jpg","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const u=new URL(e.request.url);
 const fresh=u.pathname.endsWith("/")||u.pathname.endsWith("index.html")||u.pathname.endsWith("atlas-v2-1-1.js");
 if(fresh){
   e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{let cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html?v=2.1.1"))));
 }else{
   e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
 }
});