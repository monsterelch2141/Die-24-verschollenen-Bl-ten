(()=>{
'use strict';
const DAY=4,KEY='advent-tag4-contexto-v2',SOLUTION='schlagloch',ROUTE=[137,208,314,95,421,63,178,256,340,112,29,387,204,77,319,146,408,55];
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
const normalize=s=>String(s||'').toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z]/g,'');
let ranking=null,loading=null;
function loadRanking(){
 if(loading)return loading;
 loading=fetch('contexto-ranking.json?v=1',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Ranking noch nicht veröffentlicht');return r.json()}).then(data=>{
  if(!data||Object.keys(data).length<20000||data.schlagloch!==1)throw Error('Ranking unvollständig');
  ranking=data;return data;
 }).catch(e=>{loading=null;throw e});
 return loading;
}
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
let entries=Array.isArray(saved.entries)?saved.entries:[],solved=!!saved.solved,modal=null;
function save(){localStorage.setItem(KEY,JSON.stringify({entries,solved}))}
const bar=document.createElement('section');bar.className='day4-contexto-quest';bar.hidden=true;bar.innerHTML='<div class="quest-mark">✧ ✦ ✧</div><h3>Das Wort im Nebel</h3><p>Finde das verborgene Wort. Je kleiner die Platznummer, desto näher bist du dem Ziel.</p><button type="button" class="day4-contexto-open">✧ Das Wortgeheimnis betreten ✧</button><div class="day4-contexto-route" hidden></div>';
instruction.before(bar);
function selected(){return Number(day.value)===DAY}
function sync(){bar.hidden=!selected();if(!selected())return;const route=bar.querySelector('.day4-contexto-route');route.hidden=!solved;if(solved)route.innerHTML='<strong>Sternenroute (Testdaten)</strong><p>'+ROUTE.join(' → ')+'</p>';instruction.textContent=solved?'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.'}
function render(){
 if(!modal)return;
 const list=modal.querySelector('.contexto-guesses');
 list.innerHTML=[...entries].sort((a,b)=>a.rank-b.rank).map(e=>'<div class="contexto-guess"><strong>'+e.word.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</strong><span>'+e.rank.toLocaleString('de-DE')+'</span><div class="contexto-meter"><i style="width:'+Math.max(2,100-Math.min(99,Math.log10(e.rank)*28))+'%;background:'+(e.rank<=20?'#659c52':e.rank<=200?'#b99b50':'#9c8067')+'"></i></div></div>').join('');
 modal.querySelector('.contexto-count').textContent=entries.length+' Versuche';
 modal.querySelector('.contexto-finished').hidden=!solved;
 modal.querySelector('.contexto-form').hidden=solved;
}
function open(){
 if(modal)return;
 modal=document.createElement('div');modal.className='contexto-overlay';modal.innerHTML='<div class="contexto-panel" role="dialog" aria-modal="true" aria-label="Contexto – Das Wort im Nebel"><button class="contexto-close" type="button" aria-label="Schließen">×</button><div class="quest-mark">✧ ✦ ✧</div><h2>Das Wort im Nebel</h2><p>Errate das geheime Wort. <strong>Platz 1</strong> ist die Lösung. Kleine Zahlen bedeuten große Nähe!</p><form class="contexto-form"><input aria-label="Wort eingeben" placeholder="Dein Wort …" autocomplete="off" required><button type="submit">Raten</button></form><p class="contexto-status" role="status"></p><div class="contexto-count"></div><div class="contexto-guesses"></div><p class="contexto-finished" hidden>✦ Du hast das verborgene Wort gefunden! Die Sternenroute ist freigeschaltet.</p></div>';
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
 render();modal.querySelector('input')?.focus();
}
bar.querySelector('.day4-contexto-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||solved||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse zuerst das Tagesrätsel. ✧'},true);
day.addEventListener('change',()=>setTimeout(sync,0));day.addEventListener('input',sync);document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));sync();
})();
