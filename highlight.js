/* হাইলাইট ভিডিও থেকে অটো স্কোর + নিউজ (Tesseract.js, ফ্রি) */
;(function(){
const H={ph:'',di:0,list:[],mi:0,m:null,vf:'',url:'',vid:null,dur:0,tp:0,box:{x:.02,y:.02,w:.46,h:.14},sw:0,step:2,stop:0,goals:[],fin:null,base:0,log:[],err:''};
const q=s=>document.getElementById(s),pad=n=>String(n).padStart(2,'0'),ft=t=>Math.floor(t/60)+':'+pad(Math.floor(t%60));
const same=(a,b)=>!!a&&!!b&&a[0]===b[0]&&a[1]===b[1];

function parse(t){t=String(t||'').replace(/[|]/g,' ');let tm=null,m=t.match(/(\d{1,3})\s*[:.]\s*(\d{2})(?!\d)/);
if(m){tm=+m[1]*60+ +m[2];t=t.replace(m[0],' ')}
let sc=null;m=t.match(/(\d{1,2})\s*[-–—~:]\s*(\d{1,2})/);
if(m)sc=[+m[1],+m[2]];else{const n=(t.match(/\d+/g)||[]).filter(x=>x.length<=2);if(n.length>=2)sc=[+n[0],+n[1]]}
if(sc&&(sc[0]>20||sc[1]>20))sc=null;return{sc,tm}}
window.__hlParse=parse;

function lt(){return new Promise((ok,no)=>{if(window.Tesseract)return ok();const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=ok;s.onerror=()=>no(new Error('Tesseract লোড হয়নি, ইন্টারনেট দেখুন'));document.head.appendChild(s)})}
const seek=(v,t)=>new Promise(res=>{let d=0;const f=()=>{if(d)return;d=1;v.removeEventListener('seeked',f);res()};v.addEventListener('seeked',f);setTimeout(f,4000);v.currentTime=t});

function crop(v,inv){const b=H.box,W=v.videoWidth,Hh=v.videoHeight,sx=b.x*W,sy=b.y*Hh,sw=Math.max(16,b.w*W),sh=Math.max(16,b.h*Hh),k=Math.min(4,Math.max(1,900/sw)),w=Math.round(sw*k),h=Math.round(sh*k);
const t=document.createElement('canvas');t.width=w;t.height=h;const y=t.getContext('2d',{willReadFrequently:true});y.drawImage(v,sx,sy,sw,sh,0,0,w,h);
const id=y.getImageData(0,0,w,h),p=id.data;let sum=0;for(let i=0;i<p.length;i+=4)sum+=.299*p[i]+.587*p[i+1]+.114*p[i+2];
const mean=sum/(w*h),dark=(mean<128)!==!!inv,thr=dark?Math.min(230,mean+45):Math.max(25,mean-45);
for(let i=0;i<p.length;i+=4){const g=.299*p[i]+.587*p[i+1]+.114*p[i+2],o=(dark?g>thr:g<thr)?0:255;p[i]=p[i+1]=p[i+2]=o;p[i+3]=255}
y.putImageData(id,0,0);const c=document.createElement('canvas');c.width=w+40;c.height=h+40;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(t,20,20);return c}

function ensure(){let o=q('hl');if(!o){o=document.createElement('div');o.id='hl';o.className='ov tl';o.innerHTML='<div class="cb sh"></div>';document.body.appendChild(o)}return o.firstChild}
const nm=()=>{const m=H.list[H.mi];return m?[m.a,m.b]:['','']};
const mnt=g=>g.tm!=null?Math.min(90,Math.floor(g.tm/60)+1):Math.max(1,Math.min(90,Math.round(g.vt/(H.dur||1)*90)));
const side=g=>(g.s==='L')===!H.sw?'a':'b';

function draw(){const c=ensure(),n=nm(),L=H.sw?n[1]:n[0],Rr=H.sw?n[0]:n[1];let h='';
const swSel=`<select onchange="HLX.sw(this.value)"><option value="0" ${H.sw?'':'selected'}>${esc(n[0])}</option><option value="1" ${H.sw?'selected':''}>${esc(n[1])}</option></select>`;
if(H.ph==='pick'){h=`<h2>🎬 হাইলাইট থেকে স্কোর ও নিউজ</h2><p class="mu" style="margin-top:0">ম্যাচ বাছুন, হাইলাইট ভিডিও দিন। ভিডিওর স্কোরবোর্ড পড়ে স্কোর ও গোলের খবর বসবে।</p><select onchange="HLX.sel(this.value)">${H.list.map((x,i)=>`<option value="${i}" ${i===H.mi?'selected':''}>${esc(x.a)} বনাম ${esc(x.b)} · ${esc(x.lab)}</option>`).join('')}</select><label class="lgu">🎥 হাইলাইট ভিডিও বাছুন<input type="file" accept="video/*" onchange="HLX.file(this)" hidden></label>${H.vf?`<p class="mu">✅ ${esc(H.vf)}</p>`:''}${H.err?`<p class="mu" style="color:#ef4444">${esc(H.err)}</p>`:''}<button class="big" onclick="HLX.close()">বন্ধ করুন</button>`}
else if(H.ph==='box'){h=`<h2>📺 স্কোরবোর্ড বেছে নিন</h2><p class="mu" style="margin-top:0">স্লাইডারে এমন ফ্রেম আনুন যেখানে স্কোরবোর্ড দেখা যায়। তারপর আঙুল টেনে স্কোর ও টাইমের অংশটা ঘিরে দিন।</p><canvas id="hlc" style="width:100%;border-radius:12px;touch-action:none;background:#000"></canvas><input type="range" min="0" max="${Math.max(1,Math.floor(H.dur))}" value="${Math.floor(H.tp)}" oninput="HLX.tp(this.value)" style="width:100%"><p class="mu">ভিডিওতে বাঁ দিকের টিম:</p>${swSel}<p class="mu">কত সেকেন্ড পরপর ফ্রেম পড়বে:</p><select onchange="HLX.step(this.value)">${[1,2,3,5].map(x=>`<option value="${x}" ${x===H.step?'selected':''}>${x} সেকেন্ড${x===2?' (প্রস্তাবিত)':''}</option>`).join('')}</select>${H.err?`<p class="mu" style="color:#ef4444">${esc(H.err)}</p>`:''}<button class="pri big" onclick="HLX.go()">▶ স্ক্যান শুরু</button><button class="big" onclick="HLX.back()">← ফিরে যান</button>`}
else if(H.ph==='run'){h=`<h2>🔎 স্ক্যান চলছে…</h2><div class="lvbar" style="background:rgba(128,128,128,.25)"><i id="hlp" style="width:0%"></i></div><p class="mu" id="hlt">শুরু হচ্ছে (প্রথমবার ভাষার ফাইল নামাতে একটু সময় লাগে)…</p><div class="lve" id="hll"></div><button class="big" onclick="HLX.stop()">⏹ থামান</button>`}
else if(H.ph==='done'){const f=H.fin||[0,0];
h=`<h2>✅ স্ক্যান শেষ</h2>${H.fin?'':'<p class="mu" style="color:#ef4444">স্কোর পড়া যায়নি। বক্স ঠিক করে আবার চেষ্টা করুন বা নিজে লিখুন।</p>'}${H.fin?'':`<p class="mu">শেষ পড়া: ${esc(H.log.slice(-3).join(' | ')||'কিছুই না')}</p>`}<p class="mu" style="margin-top:0">পাওয়া স্কোর। ভুল থাকলে বদলান:</p><div style="display:flex;justify-content:center;align-items:center;gap:8px;margin:10px 0"><span>${cr(L)} ${esc(L)}</span><input id="hlL" type="text" inputmode="numeric" value="${f[0]}" style="width:54px;text-align:center"> – <input id="hlR" type="text" inputmode="numeric" value="${f[1]}" style="width:54px;text-align:center"><span>${esc(Rr)} ${cr(Rr)}</span></div><p class="mu">ভিডিওতে বাঁ দিকের টিম:</p>${swSel}${H.base?'<p class="mu" style="color:#f59e0b">ভিডিও শুরুতেই গোল নিয়ে শুরু, তাই গোলের খবর বাদ যাবে, শুধু স্কোর বসবে।</p>':''}${H.goals.length?`<p class="mu"><b>⚽ গোলের খবর (গোলদাতার নাম ঐচ্ছিক)</b></p>${H.goals.map((g,i)=>`<div class="row" style="align-items:center;margin:4px 0"><span style="min-width:96px">${mnt(g)}' ${esc(side(g)==='a'?n[0]:n[1])}</span><input id="hlg${i}" type="text" maxlength="24" placeholder="গোলদাতা" style="flex:1"></div>`).join('')}`:''}<button class="pri big" onclick="HLX.apply()">✅ স্কোর ও নিউজ বসান</button><button class="big" onclick="HLX.back()">↩ আবার স্ক্যান</button><button class="big" onclick="HLX.close()">বন্ধ করুন</button>`}
c.innerHTML=h;if(H.ph==='box'){prev();bind()}}

function prev(){const c=q('hlc'),v=H.vid;if(!c||!v||!v.videoWidth)return;const w=Math.min(720,v.videoWidth),h=Math.round(w*v.videoHeight/v.videoWidth);c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(v,0,0,w,h);const b=H.box;x.fillStyle='rgba(250,204,21,.2)';x.fillRect(b.x*w,b.y*h,b.w*w,b.h*h);x.strokeStyle='#facc15';x.lineWidth=3;x.strokeRect(b.x*w,b.y*h,b.w*w,b.h*h)}
function bind(){const c=q('hlc');if(!c)return;let s=null;const pos=e=>{const r=c.getBoundingClientRect();return[Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),Math.min(1,Math.max(0,(e.clientY-r.top)/r.height))]};
c.onpointerdown=e=>{s=pos(e);try{c.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()};
c.onpointermove=e=>{if(!s)return;const p=pos(e);H.box={x:Math.min(s[0],p[0]),y:Math.min(s[1],p[1]),w:Math.abs(p[0]-s[0]),h:Math.abs(p[1]-s[1])};prev()};
c.onpointerup=()=>{s=null}}
