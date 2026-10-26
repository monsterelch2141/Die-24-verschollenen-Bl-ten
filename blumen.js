(()=>{'use strict';
const params=new URLSearchParams(location.search),test=params.has('test');
const SOLVED='verschollene-blueten-geloest-v1',FOUND='advent_blumen_gefunden';
const img=document.getElementById('bouquet'),sub=document.getElementById('sub'),slider=document.getElementById('day'),num=document.getElementById('num'),box=document.getElementById('test');
function progress(){try{const solved=JSON.parse(localStorage.getItem(SOLVED)||'{}');if(!solved||Array.isArray(solved))return 0;return Object.keys(solved).filter(k=>Number(k)>=1&&Number(k)<=24&&solved[k]===window.STERNEN_LOESUNGEN?.[k]).length}catch{return 0}}
function show(day,preview=false){day=Math.max(1,Math.min(24,Number(day)||1));img.src='tag-'+String(day).padStart(2,'0')+'.PNG';img.alt='Original-Tagesbild Tag '+day+' mit fertig gestaltetem Blumenstrauß und Beschriftung';sub.textContent=preview?'Vorschau: Tag '+day:day===1?'Der Anfang unseres Blumenstraußes ♡':'Unser Blumenstrauß wächst mit jedem Tag. ♡';if(num)num.value=day;if(slider)slider.value=day;}
show(Math.max(1,progress()));
if(test){box.hidden=false;slider.addEventListener('input',()=>show(slider.value,true));document.getElementById('reset').onclick=()=>{if(!confirm('Gesamten Testfortschritt zurücksetzen?'))return;localStorage.removeItem(SOLVED);localStorage.removeItem(FOUND);location.reload()}}
window.addEventListener('storage',()=>{if(!test)show(Math.max(1,progress()))});
})();