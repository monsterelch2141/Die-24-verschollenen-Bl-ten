(() => {
'use strict';
const DAY=3, WORD='ZWEIG', PASS='2623597', ROUTE=[137,208,314,95,421,63,178,256,340,112,29,387,204,77,319,146,408,55];
const key='advent-tag3-wordle-v1';
const get=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}};
let state=get(), current='', modal=null, status=null, tiles=null, keys={};
const game=document.querySelector('.game'), select=document.getElementById('day'), board=document.getElementById('board'), instruction=document.querySelector('.instruction'), feedback=document.getElementById('feedback');
if(!game||!select||!board)return;
const bar=document.createElement('section');bar.className='day3-quest';bar.hidden=true;bar.innerHTML='<div class="quest-mark">✧ ✦ ✧</div><h3>Die Prüfung des dritten Sterns</h3><p id="day3-hint">Ein verborgenes Wort weist dir den Weg durch die Sterne.</p><button type="button" id="day3-open">✧ Zum Tagesrätsel ✧</button><div id="day3-route" hidden></div>';
instruction.before(bar);
const hint=bar.querySelector('#day3-hint'), open=bar.querySelector('#day3-open'), route=bar.querySelector('#day3-route');
const allowed=()=>Number(select.value)===DAY;
const ready=()=>state.route===true;
function sync(){
 bar.hidden=!allowed();
 if(!allowed())return;
 open.textContent=ready()?'✧ Sternenroute erneut ansehen ✧':state.word?'✧ Sternenroute freischalten ✧':'✧ Zum Tagesrätsel ✧';
 hint.textContent=ready()?'Die Sternenroute wurde freigeschaltet. Du darfst nun das Sternenfeld wählen.':state.word?'Das Wort ist gefunden. Nun fehlt noch der geheime Zahlenschlüssel.':'Löse zuerst das Wortspiel, um den Zahlenschlüssel zu entdecken.';
 route.hidden=!ready();
 if(ready())route.innerHTML='<strong>Deine Sternenroute (Testdaten)</strong><p>'+ROUTE.join(' → ')+'</p><small>Verbinde alle Punkte. Nur die ersten drei Zahlen bestimmen später den Zielstern.</small>';
 instruction.textContent=ready()?'Verbinde die Sternenroute und wähle anschließend den richtigen Stern.': 'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.';
}
function save(){localStorage.setItem(key,JSON.stringify(state));sync()}
function close(){modal?.remove();modal=null;document.removeEventListener('keydown',physical);sync()}
function build(){
 if(modal)return;
 modal=document.createElement('div');modal.className='wordle-overlay';modal.innerHTML='<section class="wordle-panel" role="dialog" aria-modal="true" aria-label="Tagesrätsel 3"><button class="wordle-close" type="button" aria-label="Schließen">×</button><div class="quest-mark">✧ ✦ ✧</div><h2>Das Wort der Sternenwächter</h2><p>Fünf Buchstaben. Sechs Versuche. Welche Spur führt zu den verschollenen Blüten?</p><div class="wordle-grid" aria-label="Wordle-Spielbrett"></div><p class="wordle-status" role="status" aria-live="polite"></p><div class="wordle-keyboard"></div><div class="wordle-next" hidden></div></section>';
 document.body.append(modal);modal.querySelector('.wordle-close').onclick=close;
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 tiles=modal.querySelector('.wordle-grid');status=modal.querySelector('.wordle-status');
 const keyboard=modal.querySelector('.wordle-keyboard');keys={};
 for(const row of ['QWERTZUIOP','ASDFGHJKL','YXCVBNM']){
  const line=document.createElement('div');line.className='wordle-keyrow';
  if(row==='YXCVBNM'){const enter=document.createElement('button');enter.textContent='↵';enter.className='wordle-wide';enter.onclick=submit;line.append(enter)}
  for(const ch of row){const b=document.createElement('button');b.type='button';b.textContent=ch;b.onclick=()=>type(ch);line.append(b);keys[ch]=b}
  if(row==='YXCVBNM'){const del=document.createElement('button');del.textContent='⌫';del.className='wordle-wide';del.onclick=()=>type('BACKSPACE');line.append(del)}
  keyboard.append(line);
 }
 renderGame();document.addEventListener('keydown',physical);
}
function score(guess){
 const result=Array(5).fill('absent'),counts={};
 for(let i=0;i<5;i++)if(guess[i]===WORD[i])result[i]='correct';else counts[WORD[i]]=(counts[WORD[i]]||0)+1;
 for(let i=0;i<5;i++)if(result[i]!=='correct'&&counts[guess[i]]>0){result[i]='present';counts[guess[i]]--}
 return result;
}
function renderGame(){
 if(!modal)return;
 const guesses=state.guesses||[];tiles.replaceChildren();
 for(let row=0;row<6;row++){
  const guess=guesses[row]||(!state.word&&row===guesses.length?current:'');
  const colors=guesses[row]?score(guess):[];
  for(let i=0;i<5;i++){const t=document.createElement('span');t.className='wordle-tile '+(colors[i]||'');t.textContent=guess[i]||'';tiles.append(t)}
 }
 const ranks={absent:1,present:2,correct:3}, best={};
 guesses.forEach(g=>score(g).forEach((c,i)=>{if(!best[g[i]]||ranks[c]>ranks[best[g[i]]])best[g[i]]=c}));
 for(const [k,b] of Object.entries(keys)){b.className=(b.classList.contains('wordle-wide')?'wordle-wide ':'')+(best[k]||'');}
 const next=modal.querySelector('.wordle-next');next.hidden=false;
 if(state.word){status.textContent='✦ Das Wort ist gefunden: '+WORD;next.innerHTML='<p>Übersetze jeden Buchstaben in seine Alphabetposition und hänge die Zahlen aneinander (A = 1, B = 2 … Z = 26).</p><button id="day3-password-open" type="button">✧ Sternenroute freischalten ✧</button><div id="day3-password-area"></div>';next.querySelector('button').onclick=showPassword;modal.querySelector('.wordle-keyboard').hidden=true;}
 else if(guesses.length>=6){status.textContent='Sechs Versuche verbraucht. Du kannst die Prüfung erneut beginnen.';next.innerHTML='<button id="day3-retry" type="button">↺ Noch einmal versuchen</button>';next.querySelector('button').onclick=()=>{state.guesses=[];current='';save();renderGame()};modal.querySelector('.wordle-keyboard').hidden=true}
 else{next.hidden=true;modal.querySelector('.wordle-keyboard').hidden=false;status.textContent=(6-guesses.length)+' Versuche übrig';}
 if(ready()){next.innerHTML='<p>✧ Die Sternenroute ist freigeschaltet. Schließe das Rätsel und wähle das richtige Sternenfeld.</p>';modal.querySelector('.wordle-keyboard').hidden=true}
}
function showPassword(){
 const area=modal.querySelector('#day3-password-area');if(!area)return;
 area.innerHTML='<form class="day3-pass-form"><label for="day3-pass">Dein Zahlenschlüssel</label><input id="day3-pass" type="text" inputmode="numeric" autocomplete="off" placeholder="Zahlenschlüssel eingeben" required><button type="submit">✧ Schlüssel prüfen ✧</button></form><p class="day3-pass-status" role="status"></p>';
 area.querySelector('form').onsubmit=e=>{e.preventDefault();if(area.querySelector('input').value.trim()===PASS){state.route=true;save();renderGame()}else area.querySelector('.day3-pass-status').textContent='Der Schlüssel passt noch nicht. Prüfe die Alphabetpositionen.'};
 area.querySelector('input').focus();
}
function submit(){
 if(state.word||(state.guesses||[]).length>=6)return;
 if(current.length!==5){status.textContent='Bitte gib fünf Buchstaben ein.';return}
 state.guesses=[...(state.guesses||[]),current];
 if(current===WORD)state.word=true;
 current='';save();renderGame();
}
function type(k){if(state.word||(state.guesses||[]).length>=6)return;if(k==='BACKSPACE')current=current.slice(0,-1);else if(/^[A-Z]$/.test(k)&&current.length<5)current+=k;renderGame()}
function physical(e){if(!modal||e.target.closest('input'))return;if(e.key==='Escape'){close();return}if(e.key==='Enter')submit();else if(e.key==='Backspace')type('BACKSPACE');else if(/^[a-zA-Z]$/.test(e.key))type(e.key.toUpperCase())}
open.onclick=()=>{build();if(state.word&&!ready())showPassword()};
board.addEventListener('click',e=>{if(!allowed()||ready())return;const cell=e.target.closest('.cell');if(!cell)return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse erst das Tagesrätsel, bevor du das nächste Häuschen auswählst. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
select.addEventListener('change',()=>setTimeout(sync,0));document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));
const observer=new MutationObserver(()=>{if(allowed()!==!bar.hidden)sync()});observer.observe(select,{attributes:true,attributeFilter:['value']});
document.getElementById('test-reset')?.addEventListener('click',()=>{setTimeout(()=>{if(!localStorage.getItem('verschollene-blueten-geloest-v1')){localStorage.removeItem(key);state={};current='';sync()}},100)},true);
sync();
})();