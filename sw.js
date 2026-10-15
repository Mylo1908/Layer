const VERSION='__VERSION__';
const SHELL='layer-shell-'+VERSION,MODELS='layer-models-v1';
const FILES=/*__PRECACHE__*/[];
self.addEventListener('install',event=>{event.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('layer-shell-')&&k!==SHELL).map(k=>caches.delete(k)));await self.clients.claim();})());});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.endsWith('/ai-config.json'))return;const model=url.pathname.includes('/models/'),fresh=req.mode==='navigate'||url.pathname.endsWith('/models/resources.json');event.respondWith((async()=>{const c=await caches.open(model?MODELS:SHELL);const cached=await c.match(req);if(cached&&!fresh)return cached;try{const response=await fetch(req);if(response.ok)await c.put(req,response.clone()).catch(()=>{});if(!response.ok&&cached&&fresh)return cached;return response;}catch(e){if(cached)return cached;if(req.mode==='navigate'){const index=await c.match(new URL('./index.html',self.registration.scope));if(index)return index;}throw e;}})());});
