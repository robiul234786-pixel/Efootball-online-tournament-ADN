/* সোশ্যাল মডিউল: index.html-এ </body>-এর আগে <script src="social.js"></script> দিন */
(function(){
var st=document.createElement('style');
st.textContent='.pgt{grid-template-columns:repeat(6,1fr)!important;gap:4px!important}.pgt button{font-size:10px!important}.pt-so{--b:#ec4899}.soi{width:100%;border-radius:14px;margin-top:6px}';
document.head.appendChild(st);
})();
var SOL=[],SOS='',SOE='',SOX='',SOK='tmsoc';
function soK(n){return String(n||'').replace(/[.$#\[\]\/]/g,'_')}
function soLoc(){try{return JSON.parse(localStorage.getItem(SOK)||'[]')}catch(e){return[]}}
function soSaveLoc(l){try{localStorage.setItem(SOK,JSON.stringify(l.slice(-80)))}catch(e){}}
function soName(){var e=document.getElementById('son'),n=((e&&e.value)||CN()).trim().slice(0,20);if(!n){alert('আগে আপনার নাম লিখুন');return''}try{localStorage.setItem('tmcn',n)}catch(x){}return n}
async function soPoll(){
  if(PG!=='so')return;var s=FBX();if(!s)return;
  try{
    var r=await fetch(s.fb+'/soc/'+s.room+'.json?orderBy='+encodeURIComponent('"$key"')+'&limitToLast=50');
    if(!r.ok)throw 0;var x=(await r.json())||{};
    var l=Object.keys(x).map(function(k){var p=x[k];return{k:k,n:String(p.n||'').slice(0,20),x:String(p.x||'').slice(0,500),i:/^data:image\/jpeg;base64,/.test(p.i||'')?p.i:'',t:p.t||0,l:Object.keys(p.l||{}),c:Object.values(p.c||{}).map(function(c){return{n:String(c.n||'').slice(0,20),x:String(c.x||'').slice(0,200),t:c.t||0}}).sort(function(a,b){return a.t-b.t})}}).sort(function(a,b){return b.t-a.t});
    var j=JSON.stringify(l);SOE='';if(j!==SOS){SOS=j;SOL=l;if(!typing())R()}
  }catch(e){if(!SOE){SOE='সংযোগ হয়নি। Firebase রুলসে soc যোগ করুন।';if(!typing())R()}}
}
setInterval(soPoll,5000);
async function soPost(){
  var n=soName();if(!n)return;
  var t=((document.getElementById('sox')||{}).value||'').trim().slice(0,500),fi=document.getElementById('soi'),f=fi&&fi.files[0];
  if(!t&&!f)return;
  var go=async function(i){
    var p={n:n,x:t,i:i||'',t:Date.now()},s=FBX();
    try{
      if(s){var r=await fetch(s.fb+'/soc/'+s.room+'.json',{method:'POST',body:JSON.stringify(p)});if(!r.ok)throw 0}
      else{var l=soLoc();p.k=String(p.t);p.l=[];p.c=[];l.push(p);soSaveLoc(l)}
      SOX='';SOE='';SOS='';await soPoll();
    }catch(e){SOE='পোস্ট হয়নি, আবার চেষ্টা করুন'}
    R();
  };
  f?shrink(f,go):go('');
}
async function soLike(k){
  var n=soName();if(!n)return;var s=FBX(),key=soK(n);
  if(s){var p=SOL.find(function(x){return x.k===k}),has=p&&p.l.indexOf(key)>=0;
    try{await fetch(s.fb+'/soc/'+s.room+'/'+k+'/l/'+encodeURIComponent(key)+'.json',{method:has?'DELETE':'PUT',body:'true'})}catch(e){}
    SOS='';await soPoll();
  }else{var l=soLoc(),q=l.find(function(x){return x.k===k});if(q){var i=q.l.indexOf(key);i<0?q.l.push(key):q.l.splice(i,1);soSaveLoc(l)}}
  R();
}
async function soCom(k){
  var n=soName();if(!n)return;var e=document.getElementById('sc'+k),x=((e&&e.value)||'').trim().slice(0,200);if(!x)return;
  var s=FBX(),c={n:n,x:x,t:Date.now()};
  if(s){try{await fetch(s.fb+'/soc/'+s.room+'/'+k+'/c.json',{method:'POST',body:JSON.stringify(c)})}catch(er){}SOS='';await soPoll()}
  else{var l=soLoc(),p=l.find(function(z){return z.k===k});if(p){p.c.push(c);soSaveLoc(l)}}
  R();
}
async function soDel(k){
  var s=FBX();
  if(s){if(!isAd())return;try{await fetch(s.fb+'/soc/'+s.room+'/'+k+'.json',{method:'DELETE'})}catch(e){}SOS='';await soPoll()}
  else{soSaveLoc(soLoc().filter(function(x){return x.k!==k}))}
  R();
}
function socialPg(){
  setTimeout(soPoll,50);
  var s=FBX(),me=soK(CN()),adm=!s||isAd();
  var P=s?SOL:soLoc().slice().reverse();
  var nw=A(D().news).slice(-8).map(function(x){return{nw:1,t:x.t,i:x.i,x:HL(x)}});
  var L=P.concat(nw).sort(function(a,b){return b.t-a.t});
  var card=function(p){
    if(p.nw)return '<div class="card" style="border-left:4px solid var(--ac)"><small class="mu">📰 টুর্নামেন্ট নিউজ · '+ago(p.t)+'</small><p style="margin:6px 0 0">'+p.i+' '+esc(p.x)+'</p></div>';
    var liked=p.l.indexOf(me)>=0;
    return '<div class="card"><div class="top"><b>'+esc(p.n)+'</b><small class="mu">'+ago(p.t)+'</small></div>'
      +(p.x?'<p style="white-space:pre-wrap">'+esc(p.x)+'</p>':'')
      +(p.i?'<img class="soi" src="'+p.i+'" alt="">':'')
      +'<div class="row" style="margin-top:8px"><button data-ok onclick="soLike(\''+p.k+'\')">'+(liked?'❤️':'🤍')+' '+p.l.length+'</button>'
      +(adm?'<button data-ok onclick="soDel(\''+p.k+'\')">🗑</button>':'')+'</div>'
      +p.c.map(function(c){return '<div class="chm"><b>'+esc(c.n)+'</b> '+esc(c.x)+'</div>'}).join('')
      +'<div class="row" style="margin-top:6px"><input data-ok id="sc'+p.k+'" type="text" maxlength="200" placeholder="কমেন্ট…"><button data-ok onclick="soCom(\''+p.k+'\')">➤</button></div></div>';
  };
  return '<div class="card"><h2>🌐 সোশ্যাল</h2>'
    +'<input data-ok id="son" type="text" maxlength="20" placeholder="আপনার নাম" value="'+esc(CN())+'" style="width:100%;margin-bottom:6px">'
    +'<textarea data-ok id="sox" rows="3" maxlength="500" placeholder="আপনার মনে কী আছে?" oninput="SOX=this.value" style="width:100%">'+esc(SOX)+'</textarea>'
    +'<div class="row" style="margin-top:6px;align-items:center"><input data-ok id="soi" type="file" accept="image/*" style="font-size:12px;flex:1"><button data-ok class="pri" onclick="soPost()">পোস্ট</button></div>'
    +(SOE?'<p class="mu" style="color:#ef4444">'+esc(SOE)+'</p>':'')
    +(s?'':'<p class="mu">লাইভ শেয়ার চালু করলে সবাই একসাথে দেখবে; এখন শুধু এই ফোনে।</p>')
    +'</div>'+(L.map(card).join('')||'<p class="mu">এখনো কোনো পোস্ট নেই</p>');
}
/* অ্যাপে জোড়া */
(function(){
  var _pv=pageV;
  pageV=function(){return PG==='so'?pgTabs()+socialPg():_pv()};
  var _pt=pgTabs;
  pgTabs=function(){
    var h=_pt(),i=h.lastIndexOf('</div>');
    return h.slice(0,i)+'<button data-ok class="pt-so '+(PG==='so'?'on':'')+'" onclick="pgSet(\'so\')"><span>🌐</span>সোশ্যাল</button>'+h.slice(i);
  };
  var _hd=homeDash;
  homeDash=function(){
    return _hd().replace('<div class="tiles">','<div class="tiles"><button class="tile" onclick="goPg(\'so\')"><span class="ic">🌐</span><b>সোশ্যাল</b><small>পোস্ট, ছবি, কমেন্ট</small></button>');
  };
  R();
})();
