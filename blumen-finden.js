(()=>{'use strict';
const BLUMENNAMEN={"11":"Ranunkel","12":"Amaryllis","13":"Iris","14":"Nelke","15":"Sonnenblume","16":"Hortensie","17":"Pfingstrose","18":"Blaue Rose","19":"Lilie","20":"Strandflieder","21":"Paradiesvogelblume","22":"Zierquitte","23":"Magnolie","24":"Ranunkel"};
const KEY='advent_blumen_gefunden',SOLVED='verschollene-blueten-geloest-v1';
const page=document.getElementById('advent-page'),overlay=document.getElementById('photo-overlay');
if(!page)return;
function found(){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?[...new Set(a.map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=24))]:[]}catch{return []}}
function solved(){try{const a=JSON.parse(localStorage.getItem(SOLVED)||'{}');return Object.keys(a).map(Number).filter(n=>n>=1&&n<=24&&a[n]===window.STERNEN_LOESUNGEN?.[n]).sort((a,b)=>a-b)}catch{return []}}
const style=document.createElement('style');style.textContent=`
.blumen-fund{position:fixed;z-index:900;width:65px;height:96px;padding:0;background:none;border:0;cursor:pointer;filter:drop-shadow(0 5px 6px #583f2866);animation:blumeSchweben 3.2s ease-in-out infinite alternate}
.blumen-fund img{width:100%;height:100%;object-fit:contain}
@keyframes blumeSchweben{from{transform:translateY(0) rotate(-7deg)}to{transform:translateY(-16px) rotate(7deg)}}
.blumen-fundmeldung{position:fixed;z-index:10002;inset:0;background:#25140c99;display:grid;place-items:center;padding:22px}
.blumen-fundkarte{max-width:380px;width:100%;padding:28px 22px;border:3px solid #b78a54;border-radius:22px;background:#fff2d8;color:#65412a;text-align:center;box-shadow:0 16px 65px #0007;font:italic 23px/1.35 Georgia,serif}
.blumen-fundkarte .fundblume{display:block;max-width:125px;width:38%;height:190px;object-fit:contain;margin:0 auto 12px;filter:drop-shadow(0 7px 8px #5c402c55)}\n.blumen-fundkarte button{display:block;margin:22px auto 0;border:1px solid #ac804d;background:#f5dca8;border-radius:30px;padding:12px 22px;color:#5a3d2b;font:normal 17px Georgia;cursor:pointer}
`;document.head.append(style);
let signature='',showing=false;
function refresh(){
 const unlocked=solved(),available=unlocked.length>=2?unlocked:[],already=found();
 const canShow=!page.hidden&&(!overlay||overlay.hidden)&&!document.querySelector('.storybook-screen:not([hidden])');
 const wanted=canShow?available.filter(d=>!already.includes(d)):[];
 const next=wanted.join(',')+'|'+canShow;
 if(next===signature)return;signature=next;
 document.querySelectorAll('.blumen-fund').forEach(e=>e.remove());
 wanted.forEach((day,i)=>{
  const button=document.createElement('button');button.type='button';button.className='blumen-fund';button.setAttribute('aria-label','Verschollene Blume '+day+' einsammeln');
  button.style.left=(i%2===0?72:10)+'%';button.style.top=(24+(i%4)*13)+'%';
  const img=document.createElement('img');img.src='blume-'+String(day).padStart(2,'0')+'.png';img.alt='';button.append(img);
  button.addEventListener('click',()=>{
   if(showing)return;showing=true;localStorage.setItem(KEY,JSON.stringify([...new Set([...found(),day])].sort((a,b)=>a-b)));button.remove();
   const count=found().length,modal=document.createElement('div');modal.className='blumen-fundmeldung';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
   const card=document.createElement('div');card.className='blumen-fundkarte';
   const headline=document.createElement('p');headline.textContent=count===1?'✧ Glückwunsch! Du hast deine erste verschollene Blume gefunden! ✧':count===24?'✧ Alle 24 Blüten sind vereint! ✧':'✧ Glückwunsch! Du hast eine weitere verschollene Blume gefunden! ✧';
   const large=document.createElement('img');large.className='fundblume';large.src='blume-'+String(day).padStart(2,'0')+'.png';large.alt='Deine gefundene Blume';
   const detail=document.createElement('p');detail.style.fontSize='17px';detail.textContent=count+' von 24 Blumen gesammelt.';
   const go=document.createElement('button');go.type='button';go.textContent='✿ Zur Blumenvase';go.onclick=()=>location.assign('blumen.html');
   const flowerName=document.createElement('h3');flowerName.textContent=BLUMENNAMEN[day]||'Blüte des '+day+'. Tages';flowerName.style.cssText='font:italic 24px Georgia,serif;margin:8px 0;color:#85552e';card.append(large,headline,flowerName,detail,go);modal.append(card);document.body.append(modal);go.focus();signature='';refresh();
  });document.body.append(button);
 });
}
window.addEventListener('storage',refresh);window.addEventListener('focus',refresh);
new MutationObserver(refresh).observe(page,{attributes:true,attributeFilter:['hidden']});
if(overlay)new MutationObserver(refresh).observe(overlay,{attributes:true,attributeFilter:['hidden']});
const board=document.getElementById('board');if(board)board.addEventListener('click',()=>setTimeout(refresh,180));
document.getElementById('test-reset')?.addEventListener('click',()=>setTimeout(refresh,200));
setInterval(refresh,800);refresh();
})();