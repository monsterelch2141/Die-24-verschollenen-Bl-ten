(()=>{
'use strict';
const DAY=10, KEY='advent-tag10-detektiv-v4', ROUTE=[137,208,314,95,421,63,178,256];
const SUSPECTS=['Laura','Silas','Tung Tung Tung Sahur','Nymera','Elarion'];
const CASES=[
 {title:'Die verstummte Sternenuhr',place:'Sternenturm von Luminara',story:'Die große Sternenuhr steht still. Fünf Personen hielten sich in fünf verschiedenen Räumen auf; jede trug einen anderen Gegenstand. Wer im Uhrwerkraum den Aufziehschlüssel bei sich hatte, konnte die Uhr anhalten. Die Räume sind vom Erdgeschoss bis zum Dach nummeriert: 1 Uhrwerkraum, 2 Galerie, 3 Archivkammer, 4 Sternensaal, 5 Dachterrasse.',suspects:['Laura','Silas','Tung Tung Tung Sahur','Nymera','Elarion'],places:['1 · Uhrwerkraum','2 · Galerie','3 · Archivkammer','4 · Sternensaal','5 · Dachterrasse'],objects:['Laterne','Federwedel','Sternenkarte','Aufziehschlüssel','Messingglocke'],culprit:'Tung Tung Tung Sahur',clues:[
 'Der Federwedel befand sich auf der Dachterrasse.',
 'Der Aufziehschlüssel befand sich im Uhrwerkraum.',
 'Die Laterne war genau eine Etage neben dem Federwedel.',
 'Tung Tung Tung Sahur war genau eine Etage von Elarion entfernt.',
 'Laura war genau eine Etage von Elarion entfernt.',
 'Laura war genau eine Etage von Nymera entfernt.',
 'Elarion befand sich auf einer niedrigeren Etage als Nymera.',
 'Die Sternenkarte war nicht in der Archivkammer.',
 'Tung Tung Tung Sahur hatte nicht die Sternenkarte.'
 ],hints:['Zeichne fünf Etagen auf und trage für jede Person und jeden Gegenstand mögliche Positionen ein.','Die Laterne war neben dem Federwedel auf Etage 5. Welche Etage bleibt dafür?','Nutze nun die Nachbarschaften zwischen Laura, Elarion, Nymera und Tung Tung Tung Sahur.']},
 {title:'Die vertauschten Blütenschleifen',suspects:['Laura','Silas','Tung Tung Tung Sahur'],place:'Blütenfest von Luminara',story:'Beim großen Blütenfest wurden die Auszeichnungen für den ersten und letzten Platz heimlich vertauscht. Die Schleifen am Seerosenteich wurden mit einem Bindfaden neu befestigt. Laura, Silas und Tung Tung Tung Sahur hielten sich jeweils an einem anderen Ort auf und trugen unterschiedliche Dinge.',places:['Musikpavillon','Teepavillon','Seerosenteich'],objects:['Heroldshorn','Strohhut','Bindfaden'],culprit:'Laura',clues:[
 'Laura hatte nicht das Heroldshorn.',
 'Laura war nicht am Musikpavillon.',
 'Silas war nicht im Teepavillon.',
 'Der Strohhut war am Musikpavillon.',
 'Das Heroldshorn war im Teepavillon.'
 ],hints:['Die Gegenstände gehören jeweils genau einem Ort.','Wo muss das Heroldshorn gewesen sein?','Laura war weder am Musikpavillon noch mit dem Heroldshorn unterwegs.']}
];
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
let stored={};try{stored=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{}
let solved=!!stored.solved,level=stored.level===2?2:1,wrong=stored.wrong===1?1:0,opened=false,overlay=null,hints=[0,0];
const selected=()=>Number(day.value)===DAY;
function save(){localStorage.setItem(KEY,JSON.stringify({solved,level,wrong}))}
const bar=document.createElement('section');bar.className='day10-quest';bar.hidden=true;
bar.innerHTML='<div class="quest-mark">✧ ⚖ ✧</div><h3>Die Rätselakten von Luminara</h3><p>Zwei mögliche Prüfungen, ein geheimnisvoller Täter.</p><button type="button" class="day10-open">✧ Ermittlungen aufnehmen ✧</button><div class="day10-route" hidden></div>';
instruction.before(bar);
function sync(){bar.hidden=!selected();if(!selected())return;bar.querySelector('.day10-route').hidden=!solved;if(solved)bar.querySelector('.day10-route').innerHTML='<strong>Sternenroute (Testdaten)</strong><p>'+ROUTE.join(' → ')+'</p>';instruction.textContent=solved?'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.'}
function close(){overlay?.remove();overlay=null;document.body.classList.remove('day10-active')}
function finish(){solved=true;save();sync();render()}
function norm(s){return s.trim().toLocaleLowerCase('de').replace(/\s+/g,' ').normalize('NFKD').replace(/[\u0300-\u036f]/g,'')}
function render(){
 if(!overlay)return;
 const c=CASES[level-1],root=overlay.querySelector('.day10-scroll');
 if(solved){root.innerHTML='<div class="day10-intro"><span>✧ AKTE 10 · GELÖST ✧</span><h2>Die Wahrheit ist ans Licht gekommen!</h2><p>Du hast die Ermittlungen erfolgreich abgeschlossen. Die Sternenroute ist freigeschaltet.</p><div class="day10-route"><strong>Sternenroute (Testdaten)</strong><p>'+ROUTE.join(' → ')+'</p></div></div>';return}
 root.innerHTML='<div class="day10-intro"><span>✧ AKTE 10 · '+(level===1?'ERSTE PRÜFUNG':'ZWEITE PRÜFUNG')+' ✧</span><h2>'+c.title+'</h2><p><strong>'+c.place+'</strong></p><p>'+c.story+'</p></div><section class="day10-investigation"><h3>✦ Die Verdächtigen</h3><p>'+(c.suspects||SUSPECTS).join(' · ')+'</p><h3>✦ Fünf gesicherte Hinweise</h3><ol class="day10-clues">'+c.clues.map(t=>'<li>'+t+'</li>').join('')+'</ol><p><strong>Ermittlungsregel:</strong> Jede Person befand sich an genau einem anderen Ort und hatte genau einen anderen Gegenstand. Niemand teilt sich einen Ort oder Gegenstand mit einer anderen Person.</p><p><strong>Orte:</strong> '+c.places.join(' · ')+'</p><p><strong>Gegenstände:</strong> '+c.objects.join(' · ')+'</p><h3>✦ Wer war es?</h3><p>Trage den vollständigen Namen der verdächtigen Person ein. Unvollständige oder vertippte Namen zählen nicht als Fehlversuch.</p><form class="day10-form"><input type="text" autocomplete="off" spellcheck="false" aria-label="Name der verdächtigen Person" placeholder="Name des Täters" required><button type="submit">✧ Verdacht prüfen</button></form><p class="day10-status" role="status"></p><button type="button" class="day10-question day10-hint">✧ Hinweis ansehen</button><p class="day10-hint-text" role="status"></p></section>';
 const form=root.querySelector('form'),status=root.querySelector('.day10-status');
 form.onsubmit=e=>{e.preventDefault();const input=norm(form.querySelector('input').value),match=(c.suspects||SUSPECTS).find(n=>norm(n)===input);
 if(!match){status.textContent='Bitte gib einen vollständigen Namen aus der Verdächtigenliste ein. Tippfehler zählen nicht als Versuch.';return}
 if(match===c.culprit){if(level===1&&wrong===1){level=2;save();render();overlay.querySelector('.day10-status').textContent='✦ Richtig! Du hast noch eine zweite Prüfung vor dir. Beweise dich in Level 2!'}else finish();return}
 if(level===1&&wrong===0){wrong=1;save();status.textContent='Dieser Verdacht war falsch. Du hast noch einen Versuch, den richtigen Täter zu finden. Danach wartet eine zweite Prüfung auf dich.';return}
 if(level===1){status.textContent='Auch dieser Verdacht ist falsch. Prüfe die Hinweise erneut; der richtige Name ist nötig, um weiterzukommen.';return}
 status.textContent='Das ist nicht die gesuchte Person. Prüfe die fünf Hinweise erneut.';
 };
 root.querySelector('.day10-hint').onclick=()=>{const i=level-1;const n=Math.min(hints[i],2);root.querySelector('.day10-hint-text').textContent=c.hints[n];hints[i]++};
}
function open(){if(overlay)return;overlay=document.createElement('div');overlay.className='day10-overlay day10-detective';overlay.innerHTML='<div class="day10-top"><span>✧ &nbsp; Geheimes Ermittlungsarchiv</span><button type="button" class="day10-close" aria-label="Schließen">×</button></div><div class="day10-scroll"></div>';document.documentElement.append(overlay);document.body.classList.add('day10-active');overlay.querySelector('.day10-close').onclick=close;render()}
bar.querySelector('.day10-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||solved||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse zuerst das Tagesrätsel. ✧'},true);
day.addEventListener('change',()=>setTimeout(sync,0));document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));day.addEventListener('input',sync);sync();
})();