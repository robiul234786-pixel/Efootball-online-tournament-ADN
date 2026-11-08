/* হাইলাইট ভিডিও থেকে অটো স্কোর + নিউজ (Tesseract.js, ফ্রি) */
;(function(){
const H={ph:'',di:0,list:[],mi:0,m:null,vf:'',url:'',vid:null,dur:0,tp:0,box:{x:.29,y:.77,w:.42,h:.19},sw:0,step:1,stop:0,goals:[],fin:null,base:0,log:[],err:''};
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

function crop(v,f){const b=H.box,W=v.videoWidth,Hh=v.videoHeight,bx=b.x+b.w*f[0],by=b.y+b.h*f[1],bw=b.w*f[2],bh=b.h*f[3],sx=bx*W,sy=by*Hh,sw=Math.max(16,bw*W),sh=Math.max(8,bh*Hh),k=Math.min(5,Math.max(1,700/sw)),w=Math.round(sw*k),h=Math.round(sh*k);
const t=document.createElement('canvas');t.width=w;t.height=h;const y=t.getContext('2d',{willReadFrequently:true});y.drawImage(v,sx,sy,sw,sh,0,0,w,h);
const id=y.getImageData(0,0,w,h),p=id.data,hist=new Array(256).fill(0),N=w*h;for(let i=0;i<p.length;i+=4)hist[Math.round(.299*p[i]+.587*p[i+1]+.114*p[i+2])]++;
let sumA=0;for(let i=0;i<256;i++)sumA+=i*hist[i];let wb=0,sb=0,best=-1,thr=128;for(let i=0;i<256;i++){wb+=hist[i];if(!wb)continue;const wf=N-wb;if(!wf)break;sb+=i*hist[i];const mb=sb/wb,mf=(sumA-sb)/wf,bt=wb*wf*(mb-mf)*(mb-mf);if(bt>best){best=bt;thr=i}}
let up=0;for(let i=thr+1;i<256;i++)up+=hist[i];const textUp=up<N/2;
for(let i=0;i<p.length;i+=4){const g=.299*p[i]+.587*p[i+1]+.114*p[i+2],o=((g>thr)===textUp)?0:255;p[i]=p[i+1]=p[i+2]=o;p[i+3]=255}
y.putImageData(id,0,0);const c=document.createElement('canvas');c.width=w+40;c.height=h+40;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(t,20,20);return c}
function flagSig(v){const b=H.box,W=v.videoWidth,Hh=v.videoHeight,c=document.createElement('canvas');c.width=3;c.height=3;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(v,(b.x+b.w*.02)*W,(b.y+b.h*.3)*Hh,b.w*.1*W,b.h*.4*Hh,0,0,3,3);const d=x.getImageData(0,0,3,3).data,o=[];for(let i=0;i<d.length;i+=4)o.push(d[i],d[i+1],d[i+2]);return o}
const sigD=(a,b)=>a.reduce((s,v,i)=>s+Math.abs(v-b[i]),0)/a.length;
const R1=[.15,0,.85,.3],R2=[.15,.27,.85,.43],R3=[.15,.68,.85,.32];
const nameClean=t=>String(t||'').replace(/assist\w*\s*:?/ig,' ').replace(/[^A-Za-z\u00C0-\u024F'’.\- ]/g,' ').replace(/\s+/g,' ').trim();
function pMin(t){t=String(t||'').replace(/goal\s*scorer/ig,' ');const m=t.match(/(\d{1,3})\D*$/);return m?+m[1]:null}
const top=arr=>{const c={};arr.forEach(x=>{if(x)c[x]=(c[x]||0)+1});let b=null,n=0;for(const k in c)if(c[k]>n||(c[k]===n&&k.length>b.length)){b=k;n=c[k]}return b};

function ensure(){let o=q('hl');if(!o){o=document.createElement('div');o.id='hl';o.className='ov tl';o.innerHTML='<div class="cb sh"></div>';document.body.appendChild(o)}return o.firstChild}
const nm=()=>{const m=H.list[H.mi];return m?[m.a,m.b]:['','']};
const mnt=g=>g.mn?Math.min(120,g.mn):g.tm!=null?Math.min(90,Math.floor(g.tm/60)+1):Math.max(1,Math.min(90,Math.round(g.vt/(H.dur||1)*90)));
const side=g=>(g.s==='L')===!H.sw?'a':'b';

function draw(){const c=ensure(),n=nm(),L=H.sw?n[1]:n[0],Rr=H.sw?n[0]:n[1];let h='';
const swSel=`<select onchange="HLX.sw(this.value)"><option value="0" ${H.sw?'':'selected'}>${esc(n[0])}</option><option value="1" ${H.sw?'selected':''}>${esc(n[1])}</option></select>`;
if(H.ph==='pick'){h=`<h2>🎬 হাইলাইট থেকে স্কোর ও নিউজ</h2><p class="mu" style="margin-top:0">ম্যাচ বাছুন, হাইলাইট ভিডিও দিন। গোলের ব্যানার পড়ে স্কোর, গোলদাতা, অ্যাসিস্ট ও মিনিট বসবে।</p><select onchange="HLX.sel(this.value)">${H.list.map((x,i)=>`<option value="${i}" ${i===H.mi?'selected':''}>${esc(x.a)} বনাম ${esc(x.b)} · ${esc(x.lab)}</option>`).join('')}</select><label class="lgu">🎥 হাইলাইট ভিডিও বাছুন<input type="file" accept="video/*" onchange="HLX.file(this)" hidden></label>${H.vf?`<p class="mu">✅ ${esc(H.vf)}</p>`:''}${H.err?`<p class="mu" style="color:#ef4444">${esc(H.err)}</p>`:''}<button class="big" onclick="HLX.close()">বন্ধ করুন</button>`}
else if(H.ph==='box'){h=`<h2>📺 স্কোরবোর্ড বেছে নিন</h2><p class="mu" style="margin-top:0">স্লাইডারে এমন ফ্রেম আনুন যেখানে গোলের ব্যানার (Goal Scorer, নাম, Assist) দেখা যায়। তারপর আঙুল টেনে পুরো ব্যানারটা পতাকা সহ ঘিরে দিন।</p><canvas id="hlc" style="width:100%;border-radius:12px;touch-action:none;background:#000"></canvas><input type="range" min="0" max="${Math.max(1,Math.floor(H.dur))}" value="${Math.floor(H.tp)}" oninput="HLX.tp(this.value)" style="width:100%"><p class="mu">কত সেকেন্ড পরপর ফ্রেম পড়বে:</p><select onchange="HLX.step(this.value)">${[1,2,3].map(x=>`<option value="${x}" ${x===H.step?'selected':''}>${x} সেকেন্ড${x===1?' (প্রস্তাবিত)':''}</option>`).join('')}</select>${H.err?`<p class="mu" style="color:#ef4444">${esc(H.err)}</p>`:''}<button class="pri big" onclick="HLX.go()">▶ স্ক্যান শুরু</button><button class="big" onclick="HLX.back()">← ফিরে যান</button>`}
else if(H.ph==='run'){h=`<h2>🔎 স্ক্যান চলছে…</h2><div class="lvbar" style="background:rgba(128,128,128,.25)"><i id="hlp" style="width:0%"></i></div><p class="mu" id="hlt">শুরু হচ্ছে (প্রথমবার ভাষার ফাইল নামাতে একটু সময় লাগে)…</p><div class="lve" id="hll"></div><button class="big" onclick="HLX.stop()">⏹ থামান</button>`}
else if(H.ph==='done'){const f=H.fin||[0,0];
h=`<h2>✅ স্ক্যান শেষ</h2>${H.goals.length?'':'<p class="mu" style="color:#ef4444">কোনো গোল-ব্যানার পাওয়া যায়নি। ব্যানারের বক্স ঠিক করে আবার চেষ্টা করুন বা নিজে লিখুন।</p>'}<p class="mu" style="margin-top:0">পাওয়া স্কোর। ভুল থাকলে বদলান:</p><div style="display:flex;justify-content:center;align-items:center;gap:8px;margin:10px 0"><span>${cr(n[0])} ${esc(n[0])}</span><input id="hlL" type="text" inputmode="numeric" value="${f[0]}" style="width:54px;text-align:center"> – <input id="hlR" type="text" inputmode="numeric" value="${f[1]}" style="width:54px;text-align:center"><span>${esc(n[1])} ${cr(n[1])}</span></div>${H.goals.length?`<p class="mu"><b>⚽ গোল (ভুল থাকলে ঠিক করুন)</b></p>${H.goals.map((g,i)=>`<div style="margin:8px 0;padding:8px;border:1px solid var(--bd);border-radius:10px"><div class="row" style="align-items:center"><b style="min-width:40px">${g.mn||'?'}'</b><select id="hlt${i}" onchange="HLX.cnt()" style="flex:1"><option value="a" ${g.t==='a'?'selected':''}>${esc(n[0])}</option><option value="b" ${g.t==='b'?'selected':''}>${esc(n[1])}</option></select></div><div class="row" style="margin-top:6px"><input id="hlg${i}" type="text" maxlength="24" placeholder="গোলদাতা" value="${esc(g.p)}"><input id="hla${i}" type="text" maxlength="24" placeholder="অ্যাসিস্ট" value="${esc(g.as)}"></div></div>`).join('')}`:''}<button class="pri big" onclick="HLX.apply()">✅ স্কোর ও নিউজ বসান</button><button class="big" onclick="HLX.back()">↩ আবার স্ক্যান</button><button class="big" onclick="HLX.close()">বন্ধ করুন</button>`}
