/* টুর্নামেন্ট নিউজ → আড্ডা অ্যাপে অটো পোস্ট (টুর্নামেন্ট অ্যাপের index.html-এর সাথে যুক্ত হবে) */
(function(){
const on=window.nws;if(typeof on!=='function')return;
const base=()=>{try{return getFb()}catch(e){return''}};
function push(n,tn,art){const b=base();if(!b||!n||!n.t)return Promise.resolve(false);const ls=String(n.x||'').split('\n'),h=String(n.h||ls[0]||'').slice(0,200);if(!h)return Promise.resolve(false);
const k='k'+n.t+'_'+(hs(String(tn))%1000);
return fetch(b+'/social/news/'+k+'.json',{method:'PUT',body:JSON.stringify({t:n.t,i:n.i||'📰',h,b:ls.slice(1).join('\n').slice(0,240),a:String(art||'').slice(0,1800),tn:String(tn).slice(0,40)})}).then(r=>r.ok||r.status===401||r.status===403?r.ok:false).catch(()=>false)}
window.nws=function(){const r=on.apply(this,arguments);try{if(!RO()){const d=D();const x=d.news[d.news.length-1];let art='';try{art=nrBuild2(x).join('\n')}catch(e){}push(x,TNM(),art)}}catch(e){}return r};
try{if(!localStorage.getItem('tmsocbf2')&&base()){setTimeout(()=>{try{const all=[];S.divs.forEach((dv,ix)=>withDiv(ix,()=>{const tn=TNM();A(dv.news).slice(-40).forEach(n=>{let art='';try{art=nrBuild2(n).join('\n')}catch(e){}all.push([n,tn,art])})}));Promise.all(all.map(([n,t,a])=>push(n,t,a))).then(r=>{if(r.some(Boolean))localStorage.setItem('tmsocbf2','1')})}catch(e){}},2500)}}catch(e){}
})();
