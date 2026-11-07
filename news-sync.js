/* টুর্নামেন্ট নিউজ → আড্ডা অ্যাপে অটো পোস্ট (টুর্নামেন্ট অ্যাপের index.html-এর সাথে যুক্ত হবে) */
(function(){
const on=window.nws;if(typeof on!=='function')return;
const base=()=>'https://my-personal-efootball-default-rtdb.firebaseio.com';
function push(n,tn){const b=base();if(!b||!n||!n.t)return Promise.resolve(false);const ls=String(n.x||'').split('\n'),h=String(n.h||ls[0]||'').slice(0,200);if(!h)return Promise.resolve(false);
const k='k'+n.t+'_'+(hs(String(tn))%1000);
return fetch(b+'/social/news/'+k+'.json',{method:'PUT',body:JSON.stringify({t:n.t,i:n.i||'📰',h,b:ls.slice(1).join('\n').slice(0,240),tn:String(tn).slice(0,40)})}).then(r=>r.ok||r.status===401||r.status===403?r.ok:false).catch(()=>false)}
window.nws=function(){const r=on.apply(this,arguments);try{if(!RO()){const d=D();push(d.news[d.news.length-1],TNM())}}catch(e){}return r};
try{if(!localStorage.getItem('tmsocbf')&&base()){const all=[];LIB.items.forEach(it=>{const s=it.id===LIB.act?S:it.s;if(!s||(s.share&&s.share.role==='view'))return;A(s.divs).forEach(d=>A(d.news).forEach(n=>all.push([n,(s.mode==='tour'||s.mode==='wc')?it.name:it.name+' · '+d.name])))});
all.sort((a,b)=>b[0].t-a[0].t);Promise.all(all.slice(0,40).map(([n,t])=>push(n,t))).then(a=>{if(a.some(Boolean))localStorage.setItem('tmsocbf','1')})}}catch(e){}
})();
