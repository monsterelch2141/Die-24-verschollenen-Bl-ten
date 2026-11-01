(()=>{
'use strict';
const DAY=5,KEY='advent-tag5-sizeitup-v1',TARGET=400,SECRET='SCHOKOLADE';
const ROUNDS=[
 [{name:'Tulpe',h:.45,kind:'flower',note:'Blütenhöhe einer typischen Gartentulpe'},
 {name:'Fahrrad',h:1.1,kind:'bike',note:'Höhe eines üblichen Erwachsenenfahrrads'},
 {name:'Haustür',h:2.0,kind:'door',note:'Typische Türhöhe'},
 {name:'Giraffe',h:5.2,kind:'giraffe',note:'Ungefähre Höhe einer ausgewachsenen Giraffe'},
 {name:'Straßenlaterne',h:8,kind:'lamp',note:'Beispiel einer acht Meter hohen Straßenlaterne'}],
 [{name:'Schneeglöckchen',h:.18,kind:'flower',note:'Typische Höhe eines Schneeglöckchens'},
 {name:'Gitarre',h:1.0,kind:'guitar',note:'Länge einer üblichen Akustikgitarre, senkrecht aufgestellt'},
 {name:'Fußballtor',h:2.44,kind:'goal',note:'Offizielle Höhe eines großen Fußballtors'},
 {name:'Elefant',h:3.2,kind:'elephant',note:'Schulterhöhe eines großen afrikanischen Elefanten'},
 {name:'Apfelbaum',h:6,kind:'tree',note:'Beispiel eines ausgewachsenen kleineren Apfelbaums'}],
 [{name:'Rose',h:.65,kind:'flower',note:'Beispiel einer langstieligen Rose'},
 {name:'Golden Retriever',h:.58,kind:'dog',note:'Typische Schulterhöhe eines erwachsenen Rüden'},
 {name:'Kühlschrank',h:1.85,kind:'fridge',note:'Höhe eines typischen freistehenden Kühlschranks'},
 {name:'Basketballkorb',h:3.05,kind:'hoop',note:'Offizielle Korbhöhe über dem Boden'},
 {name:'Doppeldeckerbus',h:4.0,kind:'bus',note:'Ungefähre Höhe eines typischen Doppeldeckerbusses'}]
];
const paths={
 person:'<circle cx="50" cy="12" r="9"/><path d="M43 24 Q50 21 57 24 L64 65 L57 68 L55 48 L54 91 L47 91 L45 58 L43 91 L36 91 L37 48 L34 68 L27 65 L36 26 Z"/>',
 flower:'<path d="M48 95 L49 37 L52 37 L52 95Z M50 70 Q20 44 28 62 Q36 79 50 76 M51 61 Q79 35 74 57 Q68 71 51 70 M39 36 Q30 12 48 24 Q52 4 60 22 Q76 9 64 37Z"/>',
 bike:'<circle cx="24" cy="72" r="18" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="77" cy="72" r="18" fill="none" stroke="currentColor" stroke-width="5"/><path d="M24 72 L42 42 L57 72 L24 72 M42 42 L67 42 L77 72 M39 39 L47 39 M65 37 L72 37" fill="none" stroke="currentColor" stroke-width="5"/>',
 door:'<rect x="24" y="5" width="52" height="90" rx="2"/><circle cx="67" cy="54" r="3" fill="#f4e4c5"/>',
 giraffe:'<path d="M27 34 L61 32 L71 22 L72 3 L79 2 L82 26 L91 33 L87 44 L78 44 L71 36 L67 92 L60 92 L57 50 L45 50 L43 92 L36 92 L35 48 L31 90 L24 90 L26 43Z"/>',
 lamp:'<path d="M47 96 L50 16 L56 16 L53 96Z M52 16 Q52 5 66 5 L84 5 L84 13 L66 13 L60 19Z"/>',
 guitar:'<path d="M48 5 L55 5 L57 38 Q77 47 70 67 Q66 91 50 94 Q33 91 29 70 Q24 48 44 39Z"/><path d="M49 7 L51 66" stroke="#f5e5c7" stroke-width="2"/><circle cx="50" cy="64" r="10" fill="#f5e5c7"/>',
 goal:'<path d="M9 22 L91 22 L91 92 L9 92Z M9 22 L25 12 L99 12 L91 22 M91 92 L99 83 L99 12" fill="none" stroke="currentColor" stroke-width="5"/>',
 elephant:'<path d="M12 34 Q18 17 47 22 Q66 21 75 36 L83 35 Q93 38 89 52 L84 76 Q81 85 74 76 L77 50 L70 49 L70 91 L59 91 L57 59 L37 59 L35 91 L24 91 L22 56 L16 56 Q6 48 12 34Z"/>',
 tree:'<path d="M46 95 L46 54 L54 54 L54 95Z M15 52 Q9 29 29 24 Q31 6 51 9 Q70 4 76 26 Q95 34 83 53 Q80 70 59 66 Q42 75 29 62 Q15 64 15 52Z"/>',
 dog:'<path d="M14 44 L26 31 L37 34 L43 41 L71 39 L80 29 L88 33 L81 46 L76 56 L74 87 L66 87 L63 58 L43 59 L40 87 L33 87 L31 56 L23 54 L20 61 L12 56Z"/>',
 fridge:'<rect x="25" y="5" width="50" height="90" rx="4"/><path d="M25 44 L75 44" stroke="#f5e5c7" stroke-width="3"/><path d="M32 29 L32 40 M32 51 L32 67" stroke="#f5e5c7" stroke-width="4"/>',
 hoop:'<path d="M18 96 L20 25 L26 25 L25 96Z M22 25 L76 25 L76 53 L22 53Z" /><path d="M45 54 L84 54 M49 54 L55 78 L76 78 L81 54" stroke="currentColor" stroke-width="4" fill="none"/>',
 bus:'<path d="M10 13 Q10 5 20 5 L81 5 Q91 5 91 16 L91 81 L10 81Z"/><path d="M18 18 L83 18 L83 46 L18 46Z" fill="#f5e5c7"/><path d="M48 18 L48 46 M18 55 L83 55" stroke="#f5e5c7" stroke-width="3"/><circle cx="29" cy="85" r="9"/><circle cx="74" cy="85" r="9"/>'
};
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
let state;try{state=JSON.parse(localStorage.getItem(KEY)||'{}')}catch{state={}}
if(!Number.isInteger(state.round))state.round=0;
if(!Array.isArray(state.scores))state.scores=[];
if(!Number.isFinite(state.estimate))state.estimate=1.81;
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const selected=()=>Number(day.value)===DAY;
const bar=document.createElement('section');bar.className='day5-quest';bar.hidden=true;
bar.innerHTML='<div class="quest-mark">✧ ✦ ✧</div><h3>Das Maß der verborgenen Dinge</h3><p>Fünf geheimnisvolle Größenvergleiche warten auf dich.</p><button type="button" class="day5-open">✧ Größenprüfung beginnen ✧</button><div class="day5-route" hidden></div>';
instruction.before(bar);
let overlay=null;
const svg=(kind)=>'<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><g fill="currentColor">'+paths[kind]+'</g></svg>';
const format=h=>h<1?Math.round(h*100)+' cm':h.toLocaleString('de-DE',{maximumFractionDigits:2})+' m';
const score=(a,b)=>Math.max(0,Math.min(100,Math.round(100-40*Math.abs(Math.log2(a/b)))));
const current=()=>ROUNDS[state.round%3][state.scores.length];
function sync(){
 bar.hidden=!selected();if(!selected())return;
 const solved=state.unlocked===true;
 bar.querySelector('.day5-open').textContent=solved?'✧ Ergebnis erneut ansehen ✧':'✧ Größenprüfung beginnen ✧';
 bar.querySelector('.day5-route').hidden=!solved;
 if(solved)bar.querySelector('.day5-route').innerHTML='<strong>Sternenroute (Testdaten)</strong><p>137 → 208 → 314 → 95 → 421 → 63 → 178 → 256</p><small>Verbinde die Punkte und finde den Zielstern.</small>';
 instruction.textContent=solved?'Nutze das Schlüsselwort und verbinde anschließend die Sternenroute.':'Bestehe die Größenprüfung, bevor du ein Sternenfeld auswählst.';
}
function open(){
 if(overlay)return;
 overlay=document.createElement('div');overlay.className='day5-overlay';
 overlay.innerHTML='<section class="day5-panel" role="dialog" aria-modal="true" aria-label="Größenprüfung"><button class="day5-close" type="button" aria-label="Schließen">×</button><div class="quest-mark">✧ ✦ ✧</div><h2>Das Maß der verborgenen Dinge</h2><div class="day5-content"></div></section>';
 document.documentElement.append(overlay);overlay.querySelector('.day5-close').onclick=close;overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 render();
}
function close(){overlay?.remove();overlay=null;sync()}
function render(){
 if(!overlay)return;
 const content=overlay.querySelector('.day5-content');content.replaceChildren();
 if(state.solved){
  content.innerHTML='<p class="day5-success">✦ Die Prüfung ist bestanden! ✦</p><p>Du hast mindestens 400 von 500 Punkten erreicht.</p><p>Dein Schlüsselwort lautet:</p><h2 class="day5-secret">SCHOKOLADE</h2>'+(state.unlocked?'<p>✧ Die Sternenroute ist freigeschaltet.</p>':'<form class="day5-secret-form"><label>Schlüsselwort eingeben<input type="text" autocomplete="off" required placeholder="Geheimes Wort"></label><button class="day5-action" type="submit">✧ Sternenroute freischalten ✧</button></form><p class="day5-error" role="status"></p>');
  const form=content.querySelector('form');if(form)form.onsubmit=e=>{e.preventDefault();const v=form.querySelector('input').value.trim().toLocaleUpperCase('de');if(v===SECRET){state.unlocked=true;save();sync();render()}else content.querySelector('.day5-error').textContent='Das Schlüsselwort stimmt noch nicht.'};
  return;
 }
 if(state.reveal){
  const item=current(),pts=score(state.estimate,item.h),total=state.scores.reduce((a,b)=>a+b,0)+pts;
  content.innerHTML='<p class="day5-count">Vergleich '+(state.scores.length+1)+' von 5</p><h3>'+item.name+'</h3><p>Deine Schätzung: <strong>'+format(state.estimate)+'</strong> · Tatsächlich: <strong>'+format(item.h)+'</strong></p><p class="day5-points">'+pts+' / 100 Punkte</p><p>'+item.note+'</p><div class="day5-stage"><div class="day5-object"><div class="day5-silhouette" style="height:'+Math.max(7,Math.min(94,1.81/Math.max(1.81,item.h)*94))+'%">'+svg('person')+'</div><span>Quatsch Quatsch<br>1,81 m</span></div><div class="day5-object"><div class="day5-silhouette day5-actual" style="height:'+Math.max(7,Math.min(94,item.h/Math.max(1.81,item.h)*94))+'%">'+svg(item.kind)+'</div><span>'+item.name+'<br>'+format(item.h)+'</span></div></div><p>Zwischenstand: '+total+' / 500 Punkte</p><button class="day5-action" type="button">✧ Weiter ✧</button>';
  content.querySelector('.day5-action').onclick=()=>{
   state.scores.push(pts);state.reveal=false;state.estimate=1.81;
   if(state.scores.length===5){
    const sum=state.scores.reduce((a,b)=>a+b,0);
    if(sum>=TARGET)state.solved=true;
    else {state.lastTotal=sum;state.round=(state.round+1)%3;state.scores=[];state.failed=true}
   }
   save();render();sync();
  };
  return;
 }
 if(state.failed){
  state.failed=false;save();
  content.innerHTML='<p class="day5-count">Die fünf Vergleiche sind abgeschlossen.</p><p class="day5-points">'+state.lastTotal+' / 500 Punkte</p><p>Für das Sternengeheimnis fehlen noch ein paar Punkte. Na gut, eine weitere Chance bekommst du!</p><button class="day5-action" type="button">✧ Neue Größenprüfung ✧</button>';
  content.querySelector('button').onclick=()=>render();
  return;
 }
 const item=current();if(!item)return;
 const sliderValue=Math.round((Math.log(state.estimate/.12)/Math.log(12/.12))*1000);
 content.innerHTML='<p class="day5-count">Vergleich '+(state.scores.length+1)+' von 5</p><h3>Wie groß ist '+item.name+'?</h3><p>Verändere die Silhouette, bis das Größenverhältnis zu Quatsch Quatsch stimmt.</p><div class="day5-stage"><div class="day5-object"><div class="day5-silhouette day5-person">'+svg('person')+'</div><span>Quatsch Quatsch<br>1,81 m</span></div><div class="day5-object"><div class="day5-silhouette day5-guess">'+svg(item.kind)+'</div><span>'+item.name+'</span></div></div><label class="day5-slider-label">Größe anpassen<input class="day5-slider" type="range" min="0" max="1000" value="'+sliderValue+'" step="1"></label><p class="day5-estimate">Deine Schätzung: <strong>'+format(state.estimate)+'</strong></p><button class="day5-action" type="button">✦ Schätzung festlegen ✦</button><p class="day5-progress">Bisher '+state.scores.reduce((a,b)=>a+b,0)+' Punkte gesammelt</p>';
 const slider=content.querySelector('.day5-slider'),person=content.querySelector('.day5-person'),guess=content.querySelector('.day5-guess'),label=content.querySelector('.day5-estimate strong');
 function scale(){
  const max=Math.max(1.81,state.estimate);
  person.style.height=Math.max(7,1.81/max*94)+'%';
  guess.style.height=Math.max(7,state.estimate/max*94)+'%';
  label.textContent=format(state.estimate);
 }
 slider.oninput=()=>{state.estimate=.12*Math.pow(100,Number(slider.value)/1000);scale()};
 slider.onchange=save;scale();
 content.querySelector('.day5-action').onclick=()=>{state.reveal=true;save();render()};
}
bar.querySelector('.day5-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||state.unlocked)return;const cell=e.target.closest('.cell');if(!cell)return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Bestehe zuerst die Größenprüfung. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
day.addEventListener('change',()=>setTimeout(sync,0));
document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));
document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));
sync();
})();