const C='tm-v2',F=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>{const n=fetch(r).then(x=>{if(x&&x.ok){const y=x.clone();caches.open(C).then(c=>c.put(r,y))}return x}).catch(()=>null);return m||n.then(x=>x||caches.match('./index.html'))}))});
