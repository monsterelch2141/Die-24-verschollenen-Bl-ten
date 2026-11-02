(()=>{
'use strict';
const DAY=4,KEY='advent-tag4-contexto-v2',SOLUTION='schlagloch',ROUTE=[137,208,314,95,421,63,178,256,340,112,29,387,204,77,319,146,408,55];
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
const normalize=s=>String(s||'').toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z]/g,'');
let ranking=null,loading=null;
function loadRanking(){
 if(loading)return loading;
 loading=fetch('contexto-ranking.json?v=5',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Ranking noch nicht veröffentlicht');return r.json()}).then(data=>{
  if(!data||Object.keys(data).length<20000||data.schlagloch!==1)throw Error('Ranking unvollständig');
  ranking=data;return data;
 }).catch(e=>{loading=null;throw e});
 return loading;
}
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
let entries=Array.isArray(saved.entries)?saved.entries:[],solved=!!saved.solved,modal=null;
let hints=Array.isArray(saved.hints)?saved.hints:[],modalHintWords=new Set(hints.filter(h=>h.type==='word').map(h=>h.word));
function save(){localStorage.setItem(KEY,JSON.stringify({entries,solved,hints}))}
const bar=document.createElement('section');bar.className='day4-contexto-quest';bar.hidden=true;bar.innerHTML='<div class="quest-mark">✧ ✦ ✧</div><h3>Das Wort im Nebel</h3><p>Finde das verborgene Wort. Je kleiner die Platznummer, desto näher bist du dem Ziel.</p><button type="button" class="day4-contexto-open">✧ Das Wortgeheimnis betreten ✧</button><div class="day4-contexto-route" hidden></div>';
instruction.before(bar);
function selected(){return Number(day.value)===DAY}
function sync(){bar.hidden=!selected();if(!selected())return;const route=bar.querySelector('.day4-contexto-route');route.hidden=!solved;if(solved)route.innerHTML='<strong>Sternenroute (Testdaten)</strong><p>'+ROUTE.join(' → ')+'</p>';instruction.textContent=solved?'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.'}
function render(){
 if(!modal)return;
 const list=modal.querySelector('.contexto-guesses');
 list.innerHTML=[...entries].sort((a,b)=>a.rank-b.rank).map(e=>'<div class="contexto-guess"><strong>'+e.word.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</strong><span>'+e.rank.toLocaleString('de-DE')+'</span><div class="contexto-meter"><i style="width:'+Math.max(2,100-Math.min(99,Math.log10(e.rank)*28))+'%;background:'+(e.rank<=20?'#659c52':e.rank<=200?'#b99b50':'#9c8067')+'"></i></div></div>').join('');
 modal.querySelector('.contexto-count').textContent=entries.length+' Versuche';
 const used=hints.length, categoryUsed=hints.some(h=>h.type==='category'), letterUsed=hints.some(h=>h.type==='letter');
 const hintBox=modal.querySelector('.contexto-hints');
 hintBox.querySelector('.contexto-hint-count').textContent='Tipps: '+used+' von 5 verwendet';
 hintBox.querySelector('[data-hint="word"]').disabled=solved||used>=5;
 hintBox.querySelector('[data-hint="category"]').disabled=solved||used>=5||categoryUsed;
 hintBox.querySelector('[data-hint="letter"]').disabled=solved||used>=5||letterUsed;
 hintBox.querySelector('.contexto-hint-results').innerHTML=hints.map(h=>'<div>'+ (h.type==='word'?'Top-10-Wort: <strong>'+h.word+'</strong> (Platz '+h.rank+')':h.type==='category'?'Kategorie: <strong>Straßenverkehr</strong>':'Anfangsbuchstabe: <strong>S</strong>')+'</div>').join('');
 modal.querySelector('.contexto-finished').hidden=!solved;
 modal.querySelector('.contexto-form').hidden=solved;
}
function open(){
 if(modal)return;
 modal=document.createElement('div');modal.className='contexto-overlay';modal.innerHTML='<div class="contexto-panel" role="dialog" aria-modal="true" aria-label="Contexto – Das Wort im Nebel"><button class="contexto-close" type="button" aria-label="Schließen">×</button><div class="quest-mark">✧ ✦ ✧</div><h2>Das Wort im Nebel</h2><p>Errate das geheime Wort. <strong>Platz 1</strong> ist die Lösung. Kleine Zahlen bedeuten große Nähe!</p><form class="contexto-form"><input aria-label="Wort eingeben" placeholder="Dein Wort …" autocomplete="off" required><button type="submit">Raten</button></form><p class="contexto-status" role="status"></p><div class="contexto-hints"><p class="contexto-hint-count"></p><div class="contexto-hint-buttons"><button type="button" data-hint="word">Top-10-Wort</button><button type="button" data-hint="category">Kategorie</button><button type="button" data-hint="letter">Anfangsbuchstabe</button></div><div class="contexto-hint-results"></div></div><div class="contexto-count"></div><div class="contexto-guesses"></div><p class="contexto-finished" hidden>✦ Du hast das verborgene Wort gefunden! Die Sternenroute ist freigeschaltet.</p></div>';
 document.body.append(modal);modal.querySelector('.contexto-close').onclick=()=>{modal.remove();modal=null};
 modal.querySelector('.contexto-form').onsubmit=async e=>{
 e.preventDefault();
 const form=modal.querySelector('.contexto-form'),button=form.querySelector('button');
 const input=form.querySelector('input'),word=input.value.trim(),w=normalize(word);
 const status=modal.querySelector('.contexto-status');
 if(w.length<2){status.textContent='Bitte gib ein vollständiges Wort ein.';return}
 if(entries.some(e=>normalize(e.word)===w)){status.textContent='Dieses Wort hast du schon versucht.';return}
 button.disabled=true;
 try{
  status.textContent='Rangliste wird geladen …';
  const ranks=await loadRanking();
  if(!modal||!modal.isConnected)return;
  const rank=ranks[w];
  if(!rank){status.textContent='Dieses Wort steht nicht im deutschen Spielwörterbuch. Bitte versuche ein anderes Wort.';return}
  entries.push({word,rank});input.value='';
  status.textContent=rank===1?'✦ Das gesuchte Wort ist gefunden!':rank<=25?'Ganz heiß!':rank<=200?'Du bist auf einer guten Spur.':'Suche weiter – die Zahl zeigt deine Nähe.';
  if(rank===1){solved=true;sync()}save();render();
 }catch(err){status.textContent='Die vorberechnete Rangliste ist noch nicht verfügbar. Bitte später erneut versuchen.'}
 finally{if(button.isConnected)button.disabled=false}
 };
 modal.querySelectorAll('[data-hint]').forEach(btn=>btn.addEventListener('click',async()=>{
  if(hints.length>=5||solved)return;
  const type=btn.dataset.hint;
  if(type==='category'&&hints.some(h=>h.type==='category'))return;
  if(type==='letter'&&hints.some(h=>h.type==='letter'))return;
  if(type==='word'){
   btn.disabled=true;
   try{
    const ranks=await loadRanking();
    if(!modal||!modal.isConnected)return;
    const best=Math.min(11,...entries.map(e=>e.rank),...hints.filter(h=>h.type==='word').map(h=>h.rank));
    
    const choices=Object.entries(ranks).filter(([w,rank])=>rank>=2&&rank<=10&&(best<=2?rank>2:rank<best)&&!entries.some(e=>normalize(e.word)===w)&&!modalHintWords.has(w)).sort((a,b)=>b[1]-a[1]);
    if(!choices.length){modal.querySelector('.contexto-status').textContent='Kein weiteres unverbrauchtes Top-10-Wort verfügbar.';return}
    const [word,rank]=choices[0];hints.push({type,word,rank});modalHintWords.add(word);
   }catch(e){modal.querySelector('.contexto-status').textContent='Die Rangliste konnte nicht geladen werden.';return}
   finally{btn.disabled=false}
  }else hints.push({type});
  save();render();
 }));
 render();modal.querySelector('input')?.focus();
}
bar.querySelector('.day4-contexto-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||solved||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse zuerst das Tagesrätsel. ✧'},true);
day.addEventListener('change',()=>setTimeout(sync,0));day.addEventListener('input',sync);document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));sync();
})();
