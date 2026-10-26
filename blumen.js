(()=>{'use strict';
const params=new URLSearchParams(location.search);
const test=params.has('test');
const key='verschollene-blueten-geloest-v1';
function progress(){try{const solved=JSON.parse(localStorage.getItem(key)||'{}');if(!solved||Array.isArray(solved))return 0;return Object.keys(solved).filter(k=>Number(k)>=1&&Number(k)<=24&&solved[k]===window.STERNEN_LOESUNGEN?.[k]).length}catch{return 0}}
const img=document.getElementById('bouquet'),counter=document.getElementById('count'),sub=document.getElementById('sub'),slider=document.getElementById('day'),num=document.getElementById('num'),box=document.getElementById('test');
function show(day,preview=false){
day=Math.max(0,Math.min(24,Number(day)||0));
if(day<2){img.hidden=false;img.src='hintergrund.jpg';counter.textContent='Der Strauß wartet noch auf seine ersten Blüten';sub.textContent='Ab dem zweiten gelösten Rätsel beginnt unser Blumenstrauß.'}
else{img.hidden=false;img.src='tag-'+String(day).padStart(2,'0')+'.jpg';counter.textContent=preview?'Vorschau: Tag '+day:'Tag '+day+' · Unser wachsender Blumenstrauß';sub.textContent='Mit jedem gelösten Rätsel wächst unser Strauß. ♡'}
if(num)num.value=day;if(slider)slider.value=Math.max(1,day);
}
show(progress());
if(test){box.hidden=false;slider.addEventListener('input',()=>show(slider.value,true));document.getElementById('reset').onclick=()=>{if(!confirm('Gesamten Testfortschritt zurücksetzen?'))return;localStorage.removeItem(key);localStorage.removeItem('advent_blumen_gefunden');location.reload()}}
window.addEventListener('storage',()=>show(progress()));
})();