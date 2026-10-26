(()=>{'use strict';
const params=new URLSearchParams(location.search);
const test=params.has('test');
const key='verschollene-blueten-geloest-v1';
function progress(){try{const solved=JSON.parse(localStorage.getItem(key)||'{}');if(!solved||Array.isArray(solved))return 0;return Object.keys(solved).filter(k=>Number(k)>=1&&Number(k)<=24&&solved[k]===({1:'A1',2:'A2',3:'A3',4:'A4',5:'B1',6:'B2',7:'B3',8:'B4',9:'C1',10:'C2',11:'C3',12:'C4',13:'D1',14:'D2',15:'D3',16:'D4',17:'E1',18:'E2',19:'E3',20:'E4',21:'F1',22:'F2',23:'F3',24:'F4'})[k]).length}catch{return 0}}
const img=document.getElementById('bouquet'),counter=document.getElementById('count'),sub=document.getElementById('sub'),slider=document.getElementById('day'),num=document.getElementById('num'),box=document.getElementById('test');
function show(day,preview=false){
day=Math.max(0,Math.min(24,Number(day)||0));
if(day<2){img.hidden=true;img.removeAttribute('src');counter.textContent='Der Strauß wartet noch auf seine ersten Blüten';sub.textContent='Ab dem zweiten gelösten Rätsel beginnt unser Blumenstrauß.'}
else{img.hidden=false;img.src='tag-'+String(day).padStart(2,'0')+'.jpg';counter.textContent=preview?'Vorschau: Tag '+day:'Tag '+day+' · Unser wachsender Blumenstrauß';sub.textContent='Mit jedem gelösten Rätsel wächst unser Strauß. ♡'}
if(num)num.value=day;if(slider)slider.value=Math.max(1,day);
}
show(progress());
if(test){box.hidden=false;slider.addEventListener('input',()=>show(slider.value,true));document.getElementById('reset').onclick=()=>{if(!confirm('Gesamten Testfortschritt zurücksetzen?'))return;localStorage.removeItem(key);localStorage.removeItem('advent_blumen_gefunden');location.reload()}}
window.addEventListener('storage',()=>show(progress()));
})();