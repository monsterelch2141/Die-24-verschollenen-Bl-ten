(()=>{
'use strict';
const DAY=4,KEY='advent-tag4-contexto-v1',SOLUTION='schlagloch',ROUTE=[137,208,314,95,421,63,178,256,340,112,29,387,204,77,319,146,408,55];
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
const normalize=s=>String(s||'').toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z]/g,'');
const ranks=[
['schlagloch',1],['strassenschaden',2],['fahrbahnschaden',3],['loch',4],['asphaltschaden',5],['strassenloch',6],['fahrbahnloch',7],['strassenkrater',8],['krater',9],['bodenloch',11],['asphaltloch',12],['strassenreparatur',14],['strassenbelag',16],['fahrbahn',18],['asphalt',20],['strasse',23],['strassenbau',25],['strassenverkehr',30],['baustelle',34],['strassenoberflache',37],['pflaster',41],['riss',44],['unebenheit',48],['delle',52],['mulde',55],['vertiefung',58],['grube',64],['schaden',70],['reparatur',82],['beton',90],['stein',110],['kies',130],['schotter',140],['autofahren',150],['auto',175],['reifen',190],['rad',220],['fahrrad',235],['stossdampfer',260],['fahrzeug',275],['verkehr',290],['autobahn',310],['weg',340],['gehweg',360],['brucke',410],['tunnel',470],['stadt',530],['dorf',580],['baumaschine',600],['bagger',625],['unfall',660],['gefahr',690],['wasser',750],['regen',780],['winter',830],['frost',860],['erde',910],['boden',940],['landschaft',1100],['natur',1400],['haus',1650],['garten',1750],['blume',2200],['baum',2400],['himmel',2900],['stern',3200],['liebe',3700],['musik',4200],['essen',4800],['computer',5400],['buch',6000]
];
const dictionary=new Map(ranks.map(([w,n])=>[normalize(w),n]));
const aliases={pothole:2,schlaglocher:1,schlagloecher:1,locher:4,loecher:4,straßenschaden:2,straßenbelag:16,straße:23,straßenbau:25,straßeverkehr:30,straßenreparatur:14,fahrbahnbelag:19,teer:45,teerstrasse:32,teerstraße:32,asphaltstrasse:28,asphaltstraße:28,lochig:38,holperig:40,holperstrecke:46,holperpiste:35,schlag:350,loechrig:38,schlaglochartig:5,schlagloechern:1};
for(const [w,n] of Object.entries(aliases))dictionary.set(normalize(w),n);
function score(word){
 const w=normalize(word);
 if(dictionary.has(w))return dictionary.get(w);
 if(w.includes('schlagloch'))return 1;
 if(w.includes('fahrbahn')||w.includes('asphalt')||w.includes('strassen')||w.includes('strasse'))return 75+Math.min(800,w.length*17);
 if(w.includes('loch')||w.includes('krater')||w.includes('grube'))return 115+Math.min(600,w.length*21);
 if(w.includes('auto')||w.includes('verkehr')||w.includes('reifen'))return 350+Math.min(900,w.length*24);
 // Offline-Ersatz für unbekannte Wörter: deterministische, grobe Einordnung.
 let hash=0;for(const ch of w)hash=(Math.imul(hash,31)+ch.charCodeAt(0))>>>0;
 return 1500+hash%6500;
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
 modal.querySelector('.contexto-form').onsubmit=e=>{
 e.preventDefault();const input=modal.querySelector('.contexto-form input');const word=input.value.trim(),w=normalize(word);
 if(w.length<2){modal.querySelector('.contexto-status').textContent='Bitte gib ein vollständiges Wort ein.';return}
 if(entries.some(e=>normalize(e.word)===w)){modal.querySelector('.contexto-status').textContent='Dieses Wort hast du schon versucht.';return}
 const rank=score(word);entries.push({word,rank});input.value='';
 modal.querySelector('.contexto-status').textContent=rank===1?'✦ Das gesuchte Wort ist gefunden!':rank<=20?'Ganz heiß!':rank<=200?'Du bist auf einer guten Spur.':'Suche weiter – die Zahl zeigt deine Nähe.';
 if(rank===1){solved=true;sync()}save();render();
 };
 render();modal.querySelector('input')?.focus();
}
bar.querySelector('.day4-contexto-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||solved||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse zuerst das Tagesrätsel. ✧'},true);
day.addEventListener('change',()=>setTimeout(sync,0));day.addEventListener('input',sync);document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));sync();
})();
