(()=>{
'use strict';
const DAY=2, WIDTH=8, HEIGHT=7, SPAN='STERNENPFAD';
const WORDS=['STERNENPFAD','MONDHAIN','NEBELTOR','EISFELS','ROSENAU','DORNA','FROST','LUMEN'];
const lengths=WORDS.map(w=>w.length);
const path=[55,54,48,47,53,45,37,44,50,49,42,35,36,43,51,52,46,38,32,40,41,34,33,39,31,25,19,27,20,26,18,12,13,6,5,4,10,11,17,23,24,30,29,28,21,15,16,22,14,7,0,1,8,2,3,9];
const paths={},letters=Array(WIDTH*HEIGHT).fill(''),owners=Array(WIDTH*HEIGHT).fill('');
let offset=0;WORDS.forEach((word,i)=>{const cells=path.slice(offset,offset+word.length);paths[word]=cells;cells.forEach((id,k)=>{letters[id]=word[k];owners[id]=word});offset+=word.length});
const numbers=Array.from({length:100},(_,i)=>i+1);let seed=20261202;
for(let i=numbers.length-1;i>0;i--){seed=(seed*1664525+1013904223)>>>0;const j=seed%(i+1);[numbers[i],numbers[j]]=[numbers[j],numbers[i]]}
const nums=numbers.slice(0,56), SUM=paths[SPAN].reduce((s,id)=>s+nums[id],0);
const store='advent-tag2-strands-v1';
function load(){try{return JSON.parse(localStorage.getItem(store)||'{}')}catch{return {}}}
let state=load(), modal=null,active=[],dragging=false,checking=false;
state.found=Array.isArray(state.found)?state.found:[];
state.bonusWords=Array.isArray(state.bonusWords)?state.bonusWords:[];
const select=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!select||!board||!instruction)return;
const bar=document.createElement('section');bar.className='day2-quest';bar.hidden=true;
bar.innerHTML='<div class="quest-mark">✧ ✦ ✧</div><h3>Die verschollenen Orte Luminaras</h3><p id="day2-hint">Sieben Orte verbergen den Weg zu einem achten Geheimnis.</p><button type="button" id="day2-open">✧ Zum Tagesrätsel ✧</button><div id="day2-route" hidden></div>';
instruction.before(bar);
const open=bar.querySelector('#day2-open'),hint=bar.querySelector('#day2-hint'),route=bar.querySelector('#day2-route');
const selected=()=>Number(select.value)===DAY;
const unlocked=()=>state.route===true;
function save(){try{localStorage.setItem(store,JSON.stringify(state))}catch{}sync()}
function sync(){
 bar.hidden=!selected();if(!selected())return;
 open.textContent=unlocked()?'✧ Sternenroute erneut ansehen ✧':state.found.length===8?'✧ Lösung eingeben ✧':'✧ Zum Tagesrätsel ✧';
 hint.textContent=unlocked()?'Die Sternenroute ist freigeschaltet. Wähle den Zielstern.':state.found.length===8?'Alle Geheimnisse gefunden. Nun fehlt noch der Zahlenschlüssel.':'Finde die verborgenen Orte und den verbindenden Sternenpfad.';
 route.hidden=!unlocked();
 if(unlocked())route.innerHTML='<strong>Deine Sternenroute (Testdaten)</strong><p>137 → 208 → 314 → 95 → 421 → 63 → 178 → 256</p><small>Dies ist eine vorläufige Route zum Testen.</small>';
 instruction.textContent=unlocked()?'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.';
}
function close(){window.removeEventListener('resize',drawConnections);modal?.remove();modal=null;active=[];dragging=false;sync()}
function match(cells,target){const expected=paths[target];return cells.length===expected.length&&(cells.every((v,i)=>v===expected[i])||cells.every((v,i)=>v===expected[expected.length-1-i]))}
function wordOf(cells){return cells.map(id=>letters[id]).join('')}
function adjacent(a,b){const ax=Math.floor(a/HEIGHT),ay=a%HEIGHT,bx=Math.floor(b/HEIGHT),by=b%HEIGHT;return Math.max(Math.abs(ax-bx),Math.abs(ay-by))===1}
function paint(){
 if(!modal)return;
 const cells=modal.querySelectorAll('.strands-cell');
 cells.forEach(c=>{const id=Number(c.dataset.id);
  c.className='strands-cell';
  if(state.found.includes(owners[id]))c.classList.add(owners[id]===SPAN?'span-found':'place-found');
  if(active.includes(id))c.classList.add('selected');
  if(state.hint&&state.hint===owners[id]&&!state.found.includes(owners[id]))c.classList.add('hinted');
 });
 drawConnections();
 const word=modal.querySelector('#strands-current');word.textContent=active.length?wordOf(active):'Verbinde benachbarte Buchstaben';
 modal.querySelector('#strands-progress').textContent=state.found.length+' / 8 Wörter gefunden';
 modal.querySelector('#strands-bonus').textContent=(state.bonusWords.length%3)+' / 3 Bonuswörter';
 const hintButton=modal.querySelector('#strands-hint-button');hintButton.disabled=state.bonusWords.length<3;hintButton.textContent='✧ Hinweis freischalten (3 Bonuswörter)';
 const next=modal.querySelector('#strands-next');next.hidden=state.found.length!==8;
 if(state.found.length===8){
  next.innerHTML='<p>✦ Alle acht Wörter sind entdeckt!</p><button type="button" id="strands-password-button">✧ Lösung eingeben ✧</button><div id="strands-password-area"></div>';
  next.querySelector('button').onclick=showPassword;
 }
}
function drawConnections(){
 const grid=modal?.querySelector('.strands-grid'),svg=modal?.querySelector('.strands-lines');if(!grid||!svg)return;
 const rect=grid.getBoundingClientRect();if(!rect.width)return;
 svg.setAttribute('viewBox','0 0 '+rect.width+' '+rect.height);svg.replaceChildren();
 const center=id=>{const c=grid.querySelector('[data-id="'+id+'"]');if(!c)return null;const r=c.getBoundingClientRect();return [r.left+r.width/2-rect.left,r.top+r.height/2-rect.top]};
 const draw=(ids,color,width)=>{if(ids.length<2)return;const points=ids.map(center);if(points.some(p=>!p))return;const line=document.createElementNS('http://www.w3.org/2000/svg','polyline');line.setAttribute('points',points.map(p=>p.join(',')).join(' '));line.setAttribute('stroke',color);line.setAttribute('stroke-width',width);line.setAttribute('stroke-linecap','round');line.setAttribute('stroke-linejoin','round');line.setAttribute('fill','none');svg.append(line)};
 for(const word of state.found)draw(paths[word],word===SPAN?'#9d6421':'#487b62',3.5);
 draw(active,'#9c682b',4.5);
}
function clearSelection(){active=[];paint()}
const acceptedBonus=new Set(['ROSS','NAME','MANGO','PARIS','LEGAT']);
const rejectedBonus=new Set(['NEBE','SURE']);
async function validBonus(word){
 if(word.length<4||word.length>14||!/^[A-ZÄÖÜ]+$/.test(word)||rejectedBonus.has(word))return false;
 if(acceptedBonus.has(word))return true;
 // Duden hat keine frei verfuegbare Browser-API; pruefe deutsche Wortarten im Wiktionary.
 for(const title of [...new Set([word[0]+word.slice(1).toLowerCase(),word.toLowerCase()])]){
  try{
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4500);
   let response;try{response=await fetch('https://de.wiktionary.org/w/api.php?action=parse&format=json&formatversion=2&prop=wikitext&redirects=1&page='+encodeURIComponent(title)+'&origin=*',{signal:controller.signal})}finally{clearTimeout(timer)}
   if(!response.ok)continue;
   const json=await response.json(),wiki=String(json?.parse?.wikitext||'');
   const german=wiki.match(/\{\{Sprache\s*\|\s*Deutsch\s*\}\}([\s\S]*?)(?=\{\{Sprache\s*\||$)/i)?.[1]||'';
   if(german&&/\{\{Wortart\|\s*(?:Substantiv|Verb|Adjektiv|Adverb|Pronomen|Numerale|Interjektion|Konjunktion|Präposition|Artikel)\s*\|\s*Deutsch/i.test(german))return true;
  }catch{}
 }
 return false;
}

async function finish(){
 if(checking||!active.length)return;
 const cells=[...active],word=wordOf(cells);active=[];checking=true;
 const found=WORDS.find(w=>!state.found.includes(w)&&match(cells,w));
 const msg=modal.querySelector('#strands-message');
 if(found){state.found.push(found);msg.textContent=found===SPAN?'✦ Der Sternenpfad ist entdeckt!':'✧ Ort gefunden: '+found;save();checking=false;paint();return}
 if(WORDS.some(w=>match(cells,w))){msg.textContent='Diesen Ort hast du schon entdeckt.';checking=false;paint();return}
 const reverse=word.split('').reverse().join('');
 if(state.bonusWords.includes(word)||state.bonusWords.includes(reverse)){msg.textContent='Dieses Bonuswort wurde bereits gezählt.';checking=false;paint();return}
 msg.textContent='Das Wort wird geprüft …';paint();
 if(await validBonus(word)||await validBonus(reverse)){
  state.bonusWords.push(word);msg.textContent='✧ Bonuswort gefunden! Drei Bonuswörter ergeben einen Hinweis.';save();
 }else msg.textContent='Kein gesuchter Ort oder gültiges Bonuswort. Versuche eine andere Verbindung.';
 checking=false;paint();
}
function add(id){
 if(checking||state.found.includes(owners[id]))return;
 if(active.includes(id)){if(active.length>1&&active[active.length-2]===id)active.pop();paint();return}
 if(active.length&&!adjacent(active[active.length-1],id))return;
 active.push(id);paint();
}
function openPuzzle(){
 if(modal)return;
 modal=document.createElement('div');modal.className='strands-overlay';
 modal.innerHTML='<section class="strands-panel" role="dialog" aria-modal="true" aria-label="Strands Tagesrätsel 2"><button type="button" class="strands-close" aria-label="Schließen">×</button><div class="quest-mark">✧ ✦ ✧</div><h2>Die Orte von Luminara</h2><p class="strands-subtitle">Finde sieben verborgene Orte und den Spangram, der den oberen mit dem unteren Rand verbindet. Alle Buchstaben gehören zu einem der acht Wörter.</p><div class="strands-counts"><span id="strands-progress"></span><span>✦ <span id="strands-bonus"></span></span></div><div class="strands-grid" aria-label="Strands Buchstabenfeld"><svg class="strands-lines" aria-hidden="true"></svg></div><div id="strands-current" class="strands-current"></div><p id="strands-message" class="strands-message" role="status"></p><button type="button" id="strands-hint-button">✧ Hinweis freischalten</button><div id="strands-next" hidden></div></section>';
 document.body.append(modal);modal.querySelector('.strands-close').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close()});
 const grid=modal.querySelector('.strands-grid');
 for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++){
  const id=x*HEIGHT+y,b=document.createElement('button');b.type='button';b.className='strands-cell';b.dataset.id=id;
  b.innerHTML='<span class="strands-letter">'+letters[id]+'</span><span class="strands-number">'+nums[id]+'</span>';
  b.setAttribute('aria-label',letters[id]+', Zahl '+nums[id]);grid.append(b);
 }
 grid.addEventListener('pointerdown',e=>{const b=e.target.closest('.strands-cell');if(!b||e.isPrimary===false)return;e.preventDefault();dragging=true;active=[];add(Number(b.dataset.id));grid.setPointerCapture(e.pointerId)});
 grid.addEventListener('pointermove',e=>{if(!dragging)return;e.preventDefault();const b=document.elementFromPoint(e.clientX,e.clientY)?.closest('.strands-cell');if(b&&grid.contains(b))add(Number(b.dataset.id))});
 grid.addEventListener('pointerup',e=>{if(dragging){const b=document.elementFromPoint(e.clientX,e.clientY)?.closest('.strands-cell');if(b&&grid.contains(b))add(Number(b.dataset.id));dragging=false;finish()}});
 grid.addEventListener('pointercancel',()=>{dragging=false;clearSelection()});
 grid.addEventListener('click',e=>{if(e.detail!==0)return;const b=e.target.closest('.strands-cell');if(!b)return;add(Number(b.dataset.id))});
 modal.querySelector('#strands-hint-button').onclick=()=>{
  if(state.bonusWords.length<3)return;
  const target=WORDS.find(w=>w!==SPAN&&!state.found.includes(w))||WORDS.find(w=>!state.found.includes(w));if(!target)return;
  state.bonusWords=state.bonusWords.slice(3);state.hint=target;
  modal.querySelector('#strands-message').textContent='✧ Die markierten Buchstaben gehören zu einem gesuchten Wort. Finde ihre Reihenfolge!';
  save();paint();
 };
 paint();
 window.addEventListener('resize',drawConnections,{passive:true});
 if(state.found.length===8&&!unlocked())showPassword();
}
function showPassword(){
 const area=modal?.querySelector('#strands-password-area');if(!area)return;
 area.innerHTML='<form class="strands-pass-form"><label for="strands-pass">Zahlenschlüssel der Sternenroute</label><input id="strands-pass" inputmode="numeric" autocomplete="off" required placeholder="Zahlenschlüssel"><button type="submit">✧ Schlüssel prüfen ✧</button></form><p class="strands-pass-status" role="status"></p>';
 area.querySelector('form').onsubmit=e=>{e.preventDefault();if(Number(area.querySelector('input').value.trim())===SUM){state.route=true;save();area.innerHTML='<p>✦ Die Sternenroute ist freigeschaltet. Du darfst nun den Zielstern auswählen.</p>'}else area.querySelector('.strands-pass-status').textContent='Der Schlüssel stimmt noch nicht. Betrachte die Zahlen auf deinem Sternenpfad.'};
}
open.onclick=openPuzzle;
board.addEventListener('click',e=>{if(!selected()||unlocked()||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse erst das Tagesrätsel, bevor du das nächste Häuschen auswählst. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
select.addEventListener('change',()=>setTimeout(sync,0));document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));
document.getElementById('test-reset')?.addEventListener('click',()=>setTimeout(()=>{if(!localStorage.getItem('verschollene-blueten-geloest-v1')){localStorage.removeItem(store);state={found:[],bonusWords:[]};sync()}},120),true);
sync();
})();