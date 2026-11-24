(()=>{'use strict';
const params=new URLSearchParams(location.search),test=params.has('test');
const SOLVED='verschollene-blueten-geloest-v1',FOUND='advent_blumen_gefunden';
const img=document.getElementById('bouquet'),sub=document.getElementById('sub'),slider=document.getElementById('day'),num=document.getElementById('num'),box=document.getElementById('test');
function progress(){try{const solved=JSON.parse(localStorage.getItem(SOLVED)||'{}'),found=JSON.parse(localStorage.getItem(FOUND)||'[]');return Array.isArray(found)?new Set(found.map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=24&&solved[n]===window.STERNEN_LOESUNGEN?.[n])).size:0}catch{return 0}}
function show(day,preview=false){day=Math.max(0,Math.min(24,Number(day)||0));if(!day){img.hidden=true;sub.textContent='Noch keine Blüten gesammelt. ♡';return}img.hidden=false;img.src='tag-'+String(day).padStart(2,'0')+'.PNG';img.alt='Original-Tagesbild Tag '+day+' mit fertig gestaltetem Blumenstrauß und Beschriftung';sub.textContent=preview?'Vorschau: Tag '+day:day===1?'Der Anfang unseres Blumenstraußes ♡':'Unser Blumenstrauß wächst mit jedem Tag. ♡';if(num)num.value=day;if(slider)slider.value=day;}
show(progress());
if(test){box.hidden=false;slider.addEventListener('input',()=>show(slider.value,true));document.getElementById('reset').onclick=()=>{if(!confirm('Gesamten Testfortschritt zurücksetzen?'))return;localStorage.removeItem(SOLVED);localStorage.removeItem(FOUND);location.reload()}}
window.addEventListener('storage',()=>{if(!test)show(progress())});
})();