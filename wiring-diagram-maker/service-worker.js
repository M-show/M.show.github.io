const CACHE_PREFIX="wiring-maker-shell-v";
const CACHE_NAME="wiring-maker-shell-v20";
const APP_FILES=["./index.html","./manifest.webmanifest","./apple-touch-icon.png","./icon-192.png","./icon-512.png"];
const APP_ENTRY=new URL("./index.html",self.registration.scope);
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)));await self.clients.claim()})())});
self.addEventListener("fetch",event=>{const req=event.request;if(req.method!=="GET"||new URL(req.url).origin!==self.location.origin)return;event.respondWith((async()=>{const cache=await caches.open(CACHE_NAME);if(req.mode==="navigate"){try{const response=await fetch(req);if(response.ok)await cache.put(APP_ENTRY,response.clone());return response}catch{return await cache.match(APP_ENTRY)||Response.error()}}const cached=await cache.match(req);return cached||fetch(req)})())});
