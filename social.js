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

function crop(v){const b=H.box,W=v.videoWidth,Hh=v.videoHeight,sx=b.x*W,sy=b.y*Hh,sw=Math.max(16,b.w*W),sh=Math.max(16,b.h*Hh),k=Math.min(4,Math.max(1,900/sw)),w=Math.round(sw*k),h=Math.round(sh*k);
const t=document.createElement('canvas');t.width=w;t.height=h;const y=t.getContext('2d',{willReadFrequently:true});y.drawImage(v,sx,sy,sw,sh,0,0,w,h);
const id=y.getImageData(0,0,w,h),p=id.data;let sum=0;for(let i=0;i<p.length;i+=4)sum+=.299*p[i]+.587*p[i+1]+.114*p[i+2];
const mean=sum/(w*h),dark=mean<128,thr=dark?Math.min(230,mean+45):Math.max(25,mean-45);
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
h=`<h2>✅ স্ক্যান শেষ</h2>${H.fin?'':'<p class="mu" style="color:#ef4444">স্কোর পড়া যায়নি। বক্স ঠিক করে আবার চেষ্টা করুন বা নিজে লিখুন।</p>'}<p class="mu" style="margin-top:0">পাওয়া স্কোর। ভুল থাকলে বদলান:</p><div style="display:flex;justify-content:center;align-items:center;gap:8px;margin:10px 0"><span>${cr(L)} ${esc(L)}</span><input id="hlL" type="text" inputmode="numeric" value="${f[0]}" style="width:54px;text-align:center"> – <input id="hlR" type="text" inputmode="numeric" value="${f[1]}" style="width:54px;text-align:center"><span>${esc(Rr)} ${cr(Rr)}</span></div><p class="mu">ভিডিওতে বাঁ দিকের টিম:</p>${swSel}${H.base?'<p class="mu" style="color:#f59e0b">ভিডিও শুরুতেই গোল নিয়ে শুরু, তাই গোলের খবর বাদ যাবে, শুধু স্কোর বসবে।</p>':''}${H.goals.length?`<p class="mu"><b>⚽ গোলের খবর (গোলদাতার নাম ঐচ্ছিক)</b></p>${H.goals.map((g,i)=>`<div class="row" style="align-items:center;margin:4px 0"><span style="min-width:96px">${mnt(g)}' ${esc(side(g)==='a'?n[0]:n[1])}</span><input id="hlg${i}" type="text" maxlength="24" placeholder="গোলদাতা" style="flex:1"></div>`).join('')}`:''}<button class="pri big" onclick="HLX.apply()">✅ স্কোর ও নিউজ বসান</button><button class="big" onclick="HLX.back()">↩ আবার স্ক্যান</button><button class="big" onclick="HLX.close()">বন্ধ করুন</button>`}
c.innerHTML=h;if(H.ph==='box'){prev();bind()}}

function prev(){const c=q('hlc'),v=H.vid;if(!c||!v||!v.videoWidth)return;const w=Math.min(720,v.videoWidth),h=Math.round(w*v.videoHeight/v.videoWidth);c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(v,0,0,w,h);const b=H.box;x.fillStyle='rgba(250,204,21,.2)';x.fillRect(b.x*w,b.y*h,b.w*w,b.h*h);x.strokeStyle='#facc15';x.lineWidth=3;x.strokeRect(b.x*w,b.y*h,b.w*w,b.h*h)}
function bind(){const c=q('hlc');if(!c)return;let s=null;const pos=e=>{const r=c.getBoundingClientRect();return[Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),Math.min(1,Math.max(0,(e.clientY-r.top)/r.height))]};
c.onpointerdown=e=>{s=pos(e);try{c.setPointerCapture(e.pointerId)}catch(x){}e.preventDefault()};
c.onpointermove=e=>{if(!s)return;const p=pos(e);H.box={x:Math.min(s[0],p[0]),y:Math.min(s[1],p[1]),w:Math.abs(p[0]-s[0]),h:Math.abs(p[1]-s[1])};prev()};
c.onpointerup=()=>{s=null}}

function logLine(t,p){H.log.push(ft(t)+' → '+(p.sc?p.sc[0]+'-'+p.sc[1]:'?')+(p.tm!=null?' · খেলার সময় '+ft(p.tm):''));const e=q('hll');if(e)e.innerHTML=H.log.slice(-5).map(x=>`<div class="lvr">${x}</div>`).join('')}

async function scan(){H.err='';H.stop=0;H.goals=[];H.log=[];H.fin=null;H.base=0;H.m=H.list[H.mi];H.ph='run';draw();const v=H.vid;let w=null,acc=null,pend=null,pn=0,pt=null,pv=0;
try{await lt();w=await Tesseract.createWorker('eng');await w.setParameters({tessedit_pageseg_mode:Tesseract.PSM.SPARSE_TEXT});
const dur=v.duration,st=H.step,n=Math.floor(dur/st);
for(let i=0;i<=n&&!H.stop;i++){const t=Math.min(Math.max(0,dur-.05),i*st);await seek(v,t);
const r=await w.recognize(crop(v)),p=parse(r.data&&r.data.text);logLine(t,p);
const pe=q('hlp');if(pe)pe.style.width=(i/Math.max(1,n)*100).toFixed(0)+'%';const te=q('hlt');if(te)te.textContent='ফ্রেম '+(i+1)+'/'+(n+1)+(acc?' · স্কোর '+acc[0]+'-'+acc[1]:'');
if(!p.sc)continue;
if(!acc){if(same(pend,p.sc))pn++;else{pend=p.sc;pn=1}if(pn>=2){acc=pend.slice();pend=null;pn=0;if(acc[0]+acc[1]>0)H.base=1}continue}
if(same(p.sc,acc)){pend=null;pn=0;continue}
const da=p.sc[0]-acc[0],db=p.sc[1]-acc[1];if(da<0||db<0||da+db>3)continue;
if(same(pend,p.sc))pn++;else{pend=p.sc;pn=1;pt=p.tm;pv=t}
if(pn>=2){for(let k=0;k<da;k++)H.goals.push({s:'L',tm:pt,vt:pv});for(let k=0;k<db;k++)H.goals.push({s:'R',tm:pt,vt:pv});acc=pend.slice();pend=null;pn=0}}
}catch(e){H.err='সমস্যা: '+(e&&e.message||e);H.ph='box';draw();return}
finally{try{w&&w.terminate()}catch(e){}}
if(H.stop){H.ph='box';draw();return}
H.dur=v.duration;H.fin=acc;H.ph='done';draw()}

function apply(){const m=H.m;if(!m||RO())return;const l=Math.max(0,parseInt(q('hlL').value)||0),r=Math.max(0,parseInt(q('hlR').value)||0),sa=H.sw?r:l,sb=H.sw?l:r,names=H.goals.map((g,i)=>{const e=q('hlg'+i);return e?e.value.trim():''});let ok=0;
withDiv(H.di,()=>{const d=D(),k=m.k,pp=k.slice(1).split('-');let o,had;
if(k[0]==='L'){o=d.league[+k.slice(1)];had=o&&o.sa!==''&&o.sb!==''}else{o=d.ko[+pp[0]]&&d.ko[+pp[0]][+pp[1]];had=o&&(+pp[2]===1?(o.l1a!==''&&o.l1b!==''):(o.l2a!==''&&o.l2b!==''))}
if(!o)return;if(had&&!confirm('এই ম্যাচের স্কোর আগে থেকেই আছে। বদলে দেবেন?'))return;
if(k[0]==='L'){o.sa=sa;o.sb=sb}else{if(+pp[2]===1){o.l1a=sa;o.l1b=sb}else{o.l2b=sa;o.l2a=sb}o.pw=''}
const g=H.goals.map((z,i)=>({s:side(z),m:mnt(z),p:names[i]||''})),ca=g.filter(z=>z.s==='a').length,cb=g.length-ca;
if(g.length&&!H.base&&ca===sa&&cb===sb){let ta=0,tb=0;const stg=stgK(k),id='H'+Date.now().toString(36);
g.forEach((z,i)=>{z.s==='a'?ta++:tb++;const me=z.s==='a'?ta:tb,op=z.s==='a'?tb:ta,ld=me===1&&op===0?'ওপেনার':me===op?'সমতা':me>op&&me-1<op?'কামব্যাক':me-1===op?'লিড':me-op>=2?'ব্যবধান বাড়ল':'ব্যবধান কমল',tn=z.s==='a'?m.a:m.b;
nws('⚽ '+ld+'! '+tn+' গোল দিল'+(z.p?' — '+z.p+' গোল করলেন':'')+' ('+z.m+"')। "+m.a+' '+ta+'–'+tb+' '+m.b,'⚽',id+'-'+(i+1),[m.a,m.b],'',stg)});
d.mh=A(d.mh);d.mh.push({s:d.season||1,a:m.a,b:m.b,ga:sa,gb:sb,mv:'',ev:g.map(z=>z.p?{t:'g',s:z.s,m:z.m,p:z.p}:{t:'g',s:z.s,m:z.m})})}
d.nr=A(d.nr);chkRound();ok=1});
if(!ok)return;close();save();R()}

function close(){try{H.vid&&H.vid.pause()}catch(e){}if(H.url)URL.revokeObjectURL(H.url);if(H.vid&&H.vid.parentNode)H.vid.parentNode.removeChild(H.vid);H.vid=null;H.url='';H.vf='';H.ph='';const o=q('hl');if(o)o.remove()}

window.HLX={sel(i){H.mi=+i},
file(inp){const f=inp.files&&inp.files[0];if(!f)return;H.err='';if(H.url)URL.revokeObjectURL(H.url);H.url=URL.createObjectURL(f);H.vf=f.name;
if(!H.vid){const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.style.cssText='position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0';document.body.appendChild(v);H.vid=v}
const v=H.vid;v.onloadedmetadata=()=>{H.dur=v.duration;H.tp=Math.min(5,v.duration*.1);seek(v,H.tp).then(()=>{H.ph='box';draw()})};v.onerror=()=>{H.err='ভিডিওটা খোলা যায়নি';H.ph='pick';draw()};v.src=H.url;v.load();draw()},
tp(x){H.tp=+x;seek(H.vid,H.tp).then(prev)},
sw(x){if(H.ph==='done'){H.fin=[parseInt(q('hlL').value)||0,parseInt(q('hlR').value)||0]}H.sw=+x;draw()},
step(x){H.step=+x},go:scan,stop(){H.stop=1},
back(){H.ph=H.ph==='done'?'box':'pick';draw()},
apply,close};

window.hlOpen=function(){if(RO())return;H.di=S.cur;const l=withDiv(H.di,mList).filter(x=>x.st==='u');if(!l.length){alert('বাকি কোনো ম্যাচ নেই');return}H.list=l;H.mi=0;H.ph='pick';H.vf='';H.err='';H.sw=0;H.goals=[];draw()};

const _mp=window.matchPg;
if(typeof _mp==='function')window.matchPg=function(){let h=_mp.apply(this,arguments);if(!RO())h=h.replace('<div class="mg">','<div class="row" style="margin:0 0 10px"><button data-ok style="flex:1" onclick="hlOpen()">🎬 হাইলাইট থেকে অটো স্কোর ও নিউজ</button></div><div class="mg">');return h};
})();
