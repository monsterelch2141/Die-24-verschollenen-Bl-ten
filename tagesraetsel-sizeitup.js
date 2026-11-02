(()=>{
'use strict';
const DAY=5,KEY='advent-tag5-sizeitup-v1',TARGET=400,SECRET='SCHOKOLADE';
const ROUNDS=[
 [
 {base:'Quatsch Quatsch',bh:1.81,bk:'person',name:'Giraffe',h:5.2,kind:'giraffe',note:'Beispielhöhe einer ausgewachsenen Giraffe'},
 {base:'Kölner Dom',bh:157,bk:'cathedral',name:'Freiheitsstatue (mit Sockel)',h:93,kind:'statue',note:'Gesamthöhe der Freiheitsstatue inklusive Sockel'},
 {base:'Tulpe',bh:.45,bk:'flower',name:'Schneeglöckchen',h:.18,kind:'snowdrop',note:'Typische Pflanzenhöhen; Exemplare können abweichen'},
 {base:'Fußball',bh:.22,bk:'ball',name:'Bowlingkugel',h:.22,kind:'bowling',note:'Verglichen wird jeweils der Durchmesser'},
 {base:'Eiffelturm',bh:330,bk:'tower',name:'Elizabeth Tower (Big Ben)',h:96,kind:'clocktower',note:'Verglichen wird die Bauwerkshöhe'}
 ],
 [
 {base:'Spielkarte',bh:.088,bk:'card',name:'LEGO-Minifigur',h:.04,kind:'lego',note:'Höhe einer üblichen LEGO-Minifigur'},
 {base:'London Eye',bh:135,bk:'wheel',name:'Brandenburger Tor',h:26,kind:'gate',note:'Höhe des Brandenburger Tors'},
 {base:'Haustür',bh:2,bk:'door',name:'Königspinguin',h:.9,kind:'penguin',note:'Typische Höhe eines Königspinguins'},
 {base:'Tischtennisball',bh:.04,bk:'pingpong',name:'Tennisball',h:.067,kind:'tennis',note:'Verglichen wird jeweils der Durchmesser'},
 {base:'Schiefer Turm von Pisa',bh:56,bk:'leaningtower',name:'Triumphbogen Paris',h:50,kind:'arch',note:'Gerundete Bauwerkshöhen'}
 ],
 [
 {base:'Rose',bh:.65,bk:'rose',name:'Flamingo',h:1.25,kind:'flamingo',note:'Beispielhöhe einer Rose und eines Flamingos'},
 {base:'Gartenzwerg',bh:.4,bk:'gnome',name:'Karnevalswagen',h:4,kind:'float',note:'Beispielmaße: 40 cm Gartenzwerg und 4 m hoher Karnevalswagen'},
 {base:'DIN-A4-Blatt',bh:.297,bk:'paper',name:'Sektflasche (0,75 l)',h:.32,kind:'bottle',note:'Längsseite des A4-Blatts und Höhe einer typischen 0,75-l-Flasche'},
 {base:'Fußballtor',bh:2.44,bk:'goal',name:'Basketballbrett',h:1.05,kind:'hoop',note:'Verglichen wird die Höhe des Basketballbretts (105 cm) mit der Torhöhe (244 cm), nicht die Aufhängehöhe des Korbrings'},
 {base:'Burj Khalifa',bh:828,bk:'skyscraper',name:'Fernsehturm Berlin',h:368,kind:'tv',note:'Höhen beider Bauwerke'}
 ]
];
const EXACT_ASSETS={cathedral:'https://commons.wikimedia.org/wiki/Special:Redirect/file/CologneCathedralSilhouette.svg',tower:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eiffel_Tower_Silhouette.svg',gate:'https://commons.wikimedia.org/wiki/Special:Redirect/file/BrandenburgerTorSilhouette.svg',tv:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kontur-BerlinerFernsehturm.svg'};
const LIBRARY_ICONS={"person":"fa6-solid:person","giraffe":"game-icons:giraffe","cathedral":"game-icons:cathedral","statue":"game-icons:statue-of-liberty","flower":"game-icons:tulip","snowdrop":"game-icons:flower-twirl","ball":"mdi:soccer","bowling":"mdi:bowling","tower":"game-icons:eiffel-tower","clocktower":"game-icons:clock-tower","card":"mdi:cards-playing","lego":"mdi:lego","wheel":"game-icons:ferris-wheel","gate":"game-icons:gate","door":"mdi:door","penguin":"game-icons:penguin","pingpong":"mdi:table-tennis","tennis":"mdi:tennis-ball","leaningtower":"game-icons:leaning-tower","arch":"game-icons:arc-triomphe","rose":"game-icons:rose","flamingo":"game-icons:flamingo","gnome":"game-icons:dwarf-helmet","float":"game-icons:festival","paper":"mdi:file-document","bottle":"mdi:bottle-wine","goal":"mdi:soccer-field","hoop":"mdi:basketball-hoop","skyscraper":"game-icons:skyscraper","tv":"game-icons:radio-tower"};
const paths={
 gnome:'<path d="M48 2 L22 40 L38 42 L32 56 L38 70 L32 94 L68 94 L62 70 L68 56 L62 42 L78 40Z"/>',
 float:'<path d="M8 67 L14 34 L26 34 L30 15 L40 33 L51 25 L62 34 L72 12 L78 35 L89 35 L95 67 L95 83 L8 83Z"/>',
 bottle:'<path d="M42 3 L58 3 L58 20 L63 29 L65 88 L57 96 L43 96 L35 88 L37 29 L42 20Z"/>',
 cathedral:'<path d="M8 96 L8 73 L13 73 L13 44 L18 44 L18 27 L21 27 L21 17 L25 2 L29 17 L29 27 L32 27 L32 45 L38 45 L38 35 L43 35 L43 27 L50 16 L57 27 L57 35 L62 35 L62 45 L68 45 L68 27 L71 27 L71 17 L75 2 L79 17 L79 27 L82 27 L82 44 L87 44 L87 73 L92 73 L92 96Z"/><path d="M25 24 L25 86 M75 24 L75 86 M50 37 L50 94 M14 63 L86 63 M17 78 L83 78 M38 49 L62 49" fill="none" stroke="#f5e5c7" stroke-width="2"/><path d="M42 96 L42 77 Q50 65 58 77 L58 96Z" fill="#f5e5c7"/>',
 statue:'<path d="M18 96 L18 78 L82 78 L82 96Z M30 78 L36 40 L44 33 L46 15 L50 4 L54 15 L55 31 L66 43 L72 78Z"/>',
 snowdrop:'<path d="M47 96 L48 30 L51 30 L52 96Z M49 31 Q40 20 30 31 Q36 51 48 50 Q62 49 69 28 Q58 20 49 31Z"/>',
 ball:'<circle cx="50" cy="50" r="39"/>',
 bowling:'<circle cx="50" cy="50" r="39"/><circle cx="40" cy="35" r="4" fill="#f5e5c7"/><circle cx="54" cy="30" r="4" fill="#f5e5c7"/><circle cx="59" cy="44" r="4" fill="#f5e5c7"/>',
 tower:'<path d="M45 4 L55 4 L57 24 L68 72 L86 96 L14 96 L32 72 L43 24Z M35 61 L65 61 M25 82 L75 82" stroke="currentColor" stroke-width="3"/>',
 clocktower:'<path d="M30 96 L30 23 L38 23 L38 10 L50 2 L62 10 L62 23 L70 23 L70 96Z"/><circle cx="50" cy="32" r="11" fill="#f5e5c7"/><path d="M50 25 L50 32 L56 35" stroke="#594735" stroke-width="2" fill="none"/>',
 card:'<rect x="24" y="5" width="52" height="90" rx="5"/><path d="M50 33 L65 50 L50 67 L35 50Z" fill="#f5e5c7"/>',
 lego:'<circle cx="50" cy="19" r="13"/><path d="M30 35 L70 35 L76 61 L65 65 L61 51 L61 74 L59 95 L48 95 L48 75 L44 95 L33 95 L33 51 L29 65 L19 61Z"/>',
 wheel:'<circle cx="50" cy="43" r="36" fill="none" stroke="currentColor" stroke-width="5"/><path d="M50 8 L50 79 M15 43 L85 43 M25 18 L75 68 M75 18 L25 68 M50 43 L27 96 M50 43 L73 96" stroke="currentColor" stroke-width="4" fill="none"/>',
 gate:'<path d="M6 32 L94 32 L88 22 L12 22Z M14 36 L24 36 L24 90 L14 90Z M33 36 L43 36 L43 90 L33 90Z M57 36 L67 36 L67 90 L57 90Z M76 36 L86 36 L86 90 L76 90Z M8 90 L92 90 L92 97 L8 97Z"/>',
 penguin:'<path d="M50 6 Q73 5 76 46 L86 69 L75 74 L70 92 L54 95 L48 88 L42 95 L26 92 L23 74 L14 69 L24 46 Q27 5 50 6Z"/><path d="M39 30 Q50 22 61 30 L66 78 L50 86 L34 78Z" fill="#f5e5c7"/>',
 pingpong:'<circle cx="50" cy="50" r="39"/>',
 tennis:'<circle cx="50" cy="50" r="39"/><path d="M32 16 Q62 49 32 84 M68 16 Q38 49 68 84" fill="none" stroke="#f5e5c7" stroke-width="4"/>',
 leaningtower:'<g transform="rotate(-7 50 50)"><path d="M28 94 L28 18 L72 18 L72 94Z M25 18 L75 18 L70 8 L30 8Z"/><path d="M30 34 L70 34 M30 50 L70 50 M30 66 L70 66 M30 82 L70 82" stroke="#f5e5c7" stroke-width="3"/></g>',
 arch:'<path d="M12 95 L12 25 L88 25 L88 95 L66 95 L66 64 Q50 35 34 64 L34 95Z M20 25 L20 14 L80 14 L80 25Z"/>',
 rose:'<path d="M47 96 L49 43 L52 43 L53 96Z M50 72 Q21 48 26 66 Q35 78 50 78 M50 43 Q28 36 35 22 Q43 9 52 20 Q66 5 72 24 Q75 38 50 43Z"/>',
 flamingo:'<path d="M44 96 L45 55 L49 55 L48 96Z M59 96 L58 54 L62 54 L62 96Z M28 49 Q32 24 57 30 Q74 34 69 54 Q54 70 35 59Z M66 34 Q77 25 73 13 Q68 4 75 4 Q91 14 79 35 L69 44Z"/>',
 christ:'<circle cx="50" cy="16" r="10"/><path d="M44 27 L56 27 L60 44 L94 44 L94 52 L62 52 L60 96 L40 96 L38 52 L6 52 L6 44 L40 44Z"/>',
 paper:'<rect x="21" y="5" width="58" height="90" rx="2"/>',
 postcard:'<rect x="12" y="21" width="76" height="58" rx="2"/><path d="M51 25 L51 75" stroke="#f5e5c7" stroke-width="2"/>',
 skyscraper:'<path d="M42 96 L42 38 L46 38 L46 22 L49 22 L49 3 L52 3 L52 22 L56 22 L56 38 L60 38 L60 96Z"/>',
 tv:'<path d="M48 96 L49 22 L51 22 L52 96Z M50 2 L50 22 M31 37 Q50 22 69 37 L63 50 L37 50Z"/>',
 person:'<circle cx="50" cy="12" r="9"/><path d="M43 24 Q50 21 57 24 L64 65 L57 68 L55 48 L54 91 L47 91 L45 58 L43 91 L36 91 L37 48 L34 68 L27 65 L36 26 Z"/>',
 flower:'<path d="M48 95 L49 37 L52 37 L52 95Z M50 70 Q20 44 28 62 Q36 79 50 76 M51 61 Q79 35 74 57 Q68 71 51 70 M39 36 Q30 12 48 24 Q52 4 60 22 Q76 9 64 37Z"/>',
 bike:'<circle cx="24" cy="72" r="18" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="77" cy="72" r="18" fill="none" stroke="currentColor" stroke-width="5"/><path d="M24 72 L42 42 L57 72 L24 72 M42 42 L67 42 L77 72 M39 39 L47 39 M65 37 L72 37" fill="none" stroke="currentColor" stroke-width="5"/>',
 door:'<rect x="24" y="5" width="52" height="90" rx="2"/><circle cx="67" cy="54" r="3" fill="#f4e4c5"/>',
 giraffe:'<path d="M9 36 Q16 30 24 33 L44 36 Q50 34 54 28 L61 12 L65 5 L68 3 L71 6 L74 4 L78 8 L86 9 L91 15 L86 19 L76 19 L73 24 L70 39 L68 53 L65 68 L67 92 L60 92 L56 57 L50 48 L43 50 L39 92 L32 92 L32 49 L23 48 L19 92 L12 92 L15 46 L10 42 L6 53 L2 52 L3 40Z"/><path d="M18 36 L22 43 L27 36 M34 38 L39 45 L44 39 M56 31 L61 37 L64 26 M64 13 L68 17 M26 50 L28 63 M47 50 L50 63" stroke="#f5e5c7" stroke-width="3" fill="none"/>',
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
bar.innerHTML='<div class="quest-mark">✧ ✦ ✧</div><h3>Das Maß der verborgenen Dinge</h3><p>Fünf Größenvergleiche erwarten dich. Erreiche mindestens 400 von 500 Punkten, um die Sternenroute freizuschalten.</p><button type="button" class="day5-open">✧ Größenprüfung beginnen ✧</button><div class="day5-route" hidden></div>';
instruction.before(bar);
let overlay=null;
const PNG_ASSETS={"person":"01_quatsch_quatsch.png","giraffe":"02_giraffe.png","cathedral":"03_koelner_dom.png","statue":"04_freiheitsstatue.png","flower":"05_tulpe.png","snowdrop":"06_schneegloeckchen.png","ball":"07_fussball.png","bowling":"08_bowlingkugel.png","tower":"09_eiffelturm.png","clocktower":"10_elizabeth_tower.png","card":"11_spielkarte.png","lego":"12_lego_minifigur.png","wheel":"13_london_eye.png","gate":"14_brandenburger_tor.png","door":"15_haustuer.png","penguin":"16_koenigspinguin.png","pingpong":"17_tischtennisball.png","tennis":"18_tennisball.png","leaningtower":"19_turm_pisa.png","arch":"20_triumphbogen.png","rose":"21_rose.png","flamingo":"22_flamingo.png","gnome":"23_gartenzwerg.png","float":"24_karnevalswagen.png","paper":"25_din_a4.png","bottle":"26_sektflasche.png","goal":"27_fussballtor.png","hoop":"28_basketballkorb.png","skyscraper":"29_burj_khalifa.png","tv":"30_berliner_fernsehturm.png"};
const imageCache=new Map();
const svg=(kind)=>kind==='hoop'?'<img class="day5-library-icon day5-png" alt="" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20600%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23263c52%22%20stroke-width%3D%2210%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%2245%22%20y%3D%2238%22%20width%3D%22310%22%20height%3D%22330%22%20rx%3D%225%22%2F%3E%3Crect%20x%3D%22145%22%20y%3D%22150%22%20width%3D%22110%22%20height%3D%22110%22%20stroke-width%3D%227%22%2F%3E%3Cellipse%20cx%3D%22200%22%20cy%3D%22389%22%20rx%3D%2287%22%20ry%3D%2217%22%2F%3E%3Cpath%20d%3D%22M125%20396%20L153%20490%20L247%20490%20L275%20396%20M153%20407%20L168%20488%20M181%20408%20L188%20489%20M219%20408%20L212%20489%20M247%20407%20L232%20488%20M144%20441%20L256%20441%20M154%20466%20L246%20466%22%20stroke-width%3D%225%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E">':'<img class="day5-library-icon day5-png" data-kind="'+kind+'" alt="" loading="eager" src="'+PNG_ASSETS[kind]+'">';
function prepareImages(root){
 root.querySelectorAll('img.day5-png').forEach(img=>{
  const kind=img.dataset.kind,src=PNG_ASSETS[kind];
  if(imageCache.has(kind)){img.src=imageCache.get(kind);return}
  img.addEventListener('load',()=>{
   if(imageCache.has(kind))return;
   try{
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    if(!c.width||!c.height)return;
    const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);
    const data=ctx.getImageData(0,0,c.width,c.height).data;
    let left=c.width,top=c.height,right=-1,bottom=-1;
    for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
     const i=(y*c.width+x)*4;if(data[i+3]<45)continue;
     if(x<left)left=x;if(x>right)right=x;if(y<top)top=y;if(y>bottom)bottom=y;
    }
    if(right<left)return;
    const out=document.createElement('canvas');out.width=right-left+1;out.height=bottom-top+1;
    out.getContext('2d').drawImage(c,left,top,out.width,out.height,0,0,out.width,out.height);
    const url=out.toDataURL('image/png');imageCache.set(kind,url);
    root.querySelectorAll('img.day5-png[data-kind="'+kind+'"]').forEach(el=>el.src=url);
   }catch(e){console.warn('Silhouette cropping failed',kind,e)}
  },{once:true});
  img.addEventListener('error',()=>{img.alt='Bild fehlt: '+kind;img.classList.add('day5-image-missing')},{once:true});
 });
}

const format=h=>h<1?Math.round(h*100)+' cm':h.toLocaleString('de-DE',{maximumFractionDigits:2})+' m';
const PENALTIES=[4,2.8,1.8];
const score=(a,b)=>{if(a===b||format(a)===format(b))return 100;const error=Math.abs(a-b)/b;const basePoints=Math.round(100/(1+PENALTIES[state.round%3]*Math.pow(error/.5,1.7)));return Math.max(0,Math.min(100,basePoints+(state.round%3===2?10:0)));};
const current=()=>ROUNDS[state.round%3][state.scores.length];
function renderGoalComparison(root,item,estimate,actual){
 const stage=root.querySelector('.day5-stage');if(!stage)return;
 stage.classList.add('day5-goal-overlay-stage');
 const px=92/2.44;
 const img=(kind,h,klass)=>'<img class="day5-goal-image '+klass+'" alt="" src="'+PNG_ASSETS[kind]+'" style="height:'+Math.max(1,h*px)+'px">';
 stage.innerHTML='<div class="day5-goal-comparison"><div class="day5-goal-display">'+img('goal',2.44,'day5-goal-reference')+img('hoop',estimate,'day5-hoop-estimate')+(actual===undefined?'':img('hoop',actual,'day5-hoop-actual'))+'</div><div class="day5-goal-caption">Blau: Fußballtor (7,32 × 2,44 m) · Rot: dein Basketballbrett'+(actual===undefined?'':' · Grün: tatsächliche Größe')+'</div></div>';
}
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
  content.innerHTML='<p class="day5-success">✦ Die Prüfung ist bestanden! ✦</p><p>Du hast mindestens 400 von 500 Punkten erreicht.</p><p>Das Geheimnis zeigt sich in einem einzigen Zeichen:</p><div class="day5-secret" role="img" aria-label="Geheimer Bildhinweis">🍫</div>'+(state.unlocked?'<p>✧ Die Sternenroute ist freigeschaltet.</p>':'<form class="day5-secret-form"><label>Schlüsselwort eingeben<input type="text" autocomplete="off" required placeholder="Geheimes Wort"></label><button class="day5-action" type="submit">✧ Sternenroute freischalten ✧</button></form><p class="day5-error" role="status"></p>');
  const form=content.querySelector('form');if(form)form.onsubmit=e=>{e.preventDefault();const v=form.querySelector('input').value.trim().toLocaleUpperCase('de');if(v===SECRET){state.unlocked=true;save();sync();render()}else content.querySelector('.day5-error').textContent='Das Schlüsselwort stimmt noch nicht.'};
  return;
 }
 if(state.reveal){
  const item=current(),pts=score(state.estimate,item.h),total=state.scores.reduce((a,b)=>a+b,0)+pts;
  const mx=Math.max(item.bh,state.estimate,item.h);
  const hBase=Math.max(.5,item.bh/mx*94),hGuess=Math.max(.5,state.estimate/mx*94),hTrue=Math.max(.5,item.h/mx*94);
  content.innerHTML='<p class="day5-count">Vergleich '+(state.scores.length+1)+' von 5</p><h3>'+item.name+'</h3><p class="day5-points">'+pts+' / 100 Punkte</p><div class="day5-stage day5-reveal-stage"><div class="day5-object"><div class="day5-silhouette day5-person" style="height:'+hBase+'%">'+svg(item.bk)+'</div><span>'+item.base+'<br>'+format(item.bh)+'</span></div><div class="day5-object"><div class="day5-layer-stack"><div class="day5-silhouette day5-guess day5-layer" style="height:'+hGuess+'%">'+svg(item.kind)+'</div><div class="day5-silhouette day5-actual day5-layer" style="height:'+hTrue+'%">'+svg(item.kind)+'</div></div><span>'+item.name+'</span></div></div><div class="day5-legend"><span>● Deine Schätzung: <strong>'+format(state.estimate)+'</strong></span><span>● Tatsächlich: <strong>'+format(item.h)+'</strong></span></div><p>'+item.note+'</p><p>Zwischenstand: '+total+' / 500 Punkte</p><button class="day5-action" type="button">✧ Weiter ✧</button>';
  prepareImages(content);
  if(item.bk==='goal')renderGoalComparison(content,item,state.estimate,item.h);
  content.querySelector('.day5-action').onclick=()=>{
   state.scores.push(pts);state.reveal=false;state.estimate=NaN;
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
 if(!Number.isFinite(state.estimate)||state.estimate<=0)state.estimate=item.bh;
 const unit=item.bh>=10?1:.01;
 const minEstimate=unit;
 state.estimate=Math.max(unit,Math.round(state.estimate/unit)*unit);
 const maxEstimate=Math.max(item.bh*5,item.h*2,minEstimate*100);
 const sliderValue=Math.max(0,Math.min(10000,Math.round((state.estimate-minEstimate)/(maxEstimate-minEstimate)*10000)));
 content.innerHTML='<p class="day5-count">Vergleich '+(state.scores.length+1)+' von 5 · Ziel: 400 von 500 Punkten</p><h3>Wie groß ist '+item.name+'?</h3><p>Verändere die rechte Silhouette, bis die beiden Größen im richtigen Verhältnis stehen.</p><div class="day5-stage"><div class="day5-object"><div class="day5-silhouette day5-person">'+svg(item.bk)+'</div><span>'+item.base+'<br>'+format(item.bh)+'</span></div><div class="day5-object"><div class="day5-silhouette day5-guess">'+svg(item.kind)+'</div><span>'+item.name+'</span></div></div><label class="day5-slider-label">Größe anpassen<input class="day5-slider" type="range" min="0" max="10000" value="'+sliderValue+'" step="1"></label><div class="day5-fine"><button type="button" class="day5-minus" aria-label="Kleiner">−</button><label>Geschätzte Größe <input class="day5-number" type="number" min="0.00001" step="any" inputmode="decimal" value="'+Number(state.estimate.toFixed(5))+'"></label><span>Meter</span><button type="button" class="day5-plus" aria-label="Größer">+</button></div><p class="day5-estimate">Deine Schätzung: <strong>'+format(state.estimate)+'</strong></p><button class="day5-action" type="button">✦ Schätzung festlegen ✦</button><p class="day5-progress">Bisher '+state.scores.reduce((a,b)=>a+b,0)+' Punkte gesammelt</p>';
 prepareImages(content);
 if(item.bk==='goal')renderGoalComparison(content,item,state.estimate);
 const number=content.querySelector('.day5-number');
 const slider=content.querySelector('.day5-slider'),person=content.querySelector('.day5-person'),guess=content.querySelector('.day5-guess'),label=content.querySelector('.day5-estimate strong');
 function scale(){
  const max=Math.max(item.bh,state.estimate);
  if(person)person.style.height=Math.max(.5,item.bh/max*94)+'%';
  if(guess)guess.style.height=Math.max(.5,state.estimate/max*94)+'%';
  label.textContent=format(state.estimate);
  if(item.bk==='goal')renderGoalComparison(content,item,state.estimate);
  number.value=Number(state.estimate.toFixed(5));
 }
 slider.oninput=()=>{const raw=minEstimate+(maxEstimate-minEstimate)*Number(slider.value)/10000;state.estimate=Math.max(unit,Math.round(raw/unit)*unit);scale()};
 slider.onchange=save;
 number.onchange=()=>{const v=Number(number.value);if(Number.isFinite(v)&&v>0){state.estimate=v;slider.value=Math.max(0,Math.min(10000,Math.round((v-minEstimate)/(maxEstimate-minEstimate)*10000)));save()}scale()};
 content.querySelector('.day5-minus').onclick=()=>{state.estimate=Math.max(unit,Math.round((state.estimate-unit)/unit)*unit);slider.value=Math.max(0,Math.min(10000,Math.round((state.estimate-minEstimate)/(maxEstimate-minEstimate)*10000)));scale();save()};
 content.querySelector('.day5-plus').onclick=()=>{state.estimate=Math.round((state.estimate+unit)/unit)*unit;slider.value=Math.max(0,Math.min(10000,Math.round((state.estimate-minEstimate)/(maxEstimate-minEstimate)*10000)));scale();save()};
 scale();
 content.querySelector('.day5-action').onclick=()=>{state.reveal=true;save();render()};
}
bar.querySelector('.day5-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||state.unlocked)return;const cell=e.target.closest('.cell');if(!cell)return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Bestehe zuerst die Größenprüfung. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
day.addEventListener('change',()=>setTimeout(sync,0));
document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));
document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));
sync();
})();