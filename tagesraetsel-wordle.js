(() => {
'use strict';
const DAY=3, WORD='ZWEIG', PASS='2623597', ROUTE=[137,208,314,95,421,63,178,256,340,112,29,387,204,77,319,146,408,55];
const key='advent-tag3-wordle-v1';
const get=()=>{try{const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved.extra&&!saved.unlockedRows)saved.unlockedRows=7;return saved}catch{return {}}};
let state=get(), current='', modal=null, status=null, tiles=null, keys={}, busy=false, revealing=false;
const knownWords=new Set(['ZWEIG','KRANZ','FROST','GLANZ','KOMET','NACHT','STERN','WALDE','WALDS','LICHT','TRAUM','MONAT','WINDE','WINDS','WOLKE','WOLLE','BLUME','BLUTE','LIEBE','ROSEN','ROSES','REISE','WEISE','LEISE','PREIS','STEIN','SANDU','SAGEN','SAGTE','SINGT','KLING','KLANG','KLEIN','GROSS','GRUEN','BRAUN','WEISS','SCHON','SCHUH','STUHL','TISCH','HAUSE','HAUS','HUNDE','KATZE','MAUER','RAUCH','FEUER','WASSER','BLATT','BAUMS','BLICK','BRIEF','BRISE','BREIT','BROTE','BRUCH','DANKE','DENKT','DICHT','DINGE','DREHT','DURCH','EINER','EINEN','EISEN','ENGEL','ERNTE','ERSTE','ESSEN','FADEN','FAHRT','FALLE','FARBE','FEDER','FEIER','FERNE','FESTE','FINDE','FISCH','FLUSS','FRAGE','FREMD','FRIED','FROHE','FRUET','GABEL','GASSE','GEHEN','GEIST','GELBE','GENAU','GERNE','GLATT','GLAUB','GOLD','GRAUE','GRUND','GRUSS','HALLO','HALTE','HANDY','HART','HEUTE','HERDE','HERZE','HILFE','HIMMEL','HOBEL','HOFFE','HOLEN','HONIG','HOSEN','HOTEL','HUEGE','HUTEN','JUNGE','KABEL','KAMIN','KANAL','KANNE','KARTE','KERZE','KETTE','KIND','KISTE','KLOPF','KNAPP','KNOCH','KOCHT','KOPFE','KRAFT','KREIS','KRONE','KUGEL','KUNST','LACHE','LADEN','LAMPE','LANGE','LASSO','LAUFE','LAUNE','LEBEN','LEDER','LEGEN','LEHRE','LEINE','LEUTE','LINIE','LINKE','LOCKE','LUFT','MALEN','MARKE','MASKE','MEERE','MEILE','MEINE','MENGE','MERKE','MILCH','MINZE','MITTE','MORGEN','MOTIV','MUEDE','MUTIG','NADEL','NAMEN','NEBEL','NEBEN','NEHME','NEUES','NICHT','NORD','NOTEN','OBERE','OCHSE','OFFEN','OFTEN','OPFER','ORDEN','ORGAN','PAPPE','PARTY','PAUSE','PERLE','PFERD','PILZE','PLATZ','PUNKT','QUARK','RADIO','RASEN','RASTE','RAUHE','RECHT','REGEN','REIHE','REIME','REINE','REITE','RENNT','RESTE','RICHT','RIESE','RINDE','RINGE','RITTE','RODEL','ROHRE','ROLLE','RUNDE','SACHE','SALAT','SAMEN','SANFT','SAUER','SCHAF','SCHEU','SCHON','SEGEN','SEHEN','SEIDE','SEINE','SEITE','SELIG','SENDE','SIEHT','SILBE','SINNE','SITZE','SOHLE','SOLAR','SONNE','SORGE','SPASS','SPECK','SPIEL','SPITZ','SPRAY','SPULE','STAAT','STADT','STAND','STARK','STAUB','STEHT','STIEL','STIFT','STILL','STOFF','STOLZ','STROM','STUFE','STURM','SUCHT','SUMME','SUPER','TANZT','TAUBE','TAUFE','TEICH','TEILE','TEMPO','TEXTE','THEMA','TIGER','TOLLE','TORTE','TOTAL','TRAGE','TRANK','TREUE','TRICK','TRINK','TROST','TULPE','TURBO','TURME','UEBER','UNTER','VATER','VIELE','VOGEL','VOLLE','VORNE','WACHE','WAGEN','WAHRE','WALZE','WARME','WARTE','WEGEN','WEICH','WEIDE','WEINE','WELLE','WENDE','WERTE','WESEN','WETTE','WICHT','WIESE','WILLE','WINKE','WIRKT','WISSE','WOHNE','WORTE','WUNDE','WURDE','WURST','ZAHLT','ZANGE','ZEIGE','ZEILE','ZEIT','ZELTE','ZIEGE','ZIEHT','ZIMTE','ZIRKA','ZONEN','ZUGES','ZUNGE']);
// Häufige deutsche Lehnwörter, Früchte, Städte, Eigennamen und Fachbegriffe.
const additionalGermanWords=new Set(['MANGO','PARIS','LEGAT','APFEL','BANAN','BANANEN','KIWIS','KIWIS','KIWIS','PAPAYA','GUAVE','OLIVE','MELON','FEIGE','DATTE','KAKAO','ZITRO','BEERE','BIRNE','TRAUB','PFLAU','ANANA','LIMES','LIMON','HONIG','LACHS','BERNE','ROMAN','ROMER','ROMEO','TOKIO','OSAKA','SEOUL','BONNE','BONNS','KOELN','KOLIN','ESSEN','MAINZ','TRIER','ULM','BERLIN','WIEN','GRAZ','BASEL','GENUA','MAILA','DOVER','DELHI','KAIRO','DUBAI','MIAMI','TAMPA','TEXAS','NEPAL','INDIA','CHILE','CHINA','JAPAN','KENIA','KONGO','GHANA','GABUN','HAITI','MALTA','SAMOA','TONGA','KATAR','SYRIEN','NIGER','BENIN','TOGO','SUDAN','IRANS','ISRAE','KRETA','IBIZA','SYLT','RUEGE','ELBAS','MOSEL','RHEIN','DONAU','ALPEN','HARZ','EIFEL','TAUNU','SPREE','ELBE','ODER','ISAR','SAAR','RUHR','INSEL','DELTA','ATLAS','OZEAN','NORDS','OSTEN','WESTE','SUEDE','LEGAT','ERBEN','ERBTE','ERBES','ERBIN','NOTAR','AKTEN','RECHT','KONTO','AKTIE','KREDIT','ZINSEN','RENTE','SALDO','DEPOT','KASSE','EUROS','EURO','MOTTO','MOTIV','TANGO','SALSA','OPERA','PIZZA','PASTA','SUSHI','CURRY','TACOS','KEBAB','DÖNER'.replace('Ö','OE')]);
async function wiktionaryEntry(title){
 const url='https://de.wiktionary.org/w/api.php?action=parse&format=json&formatversion=2&prop=wikitext&redirects=1&page='+encodeURIComponent(title)+'&origin=*';
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),6000);
 try{
  const response=await fetch(url,{signal:controller.signal});
  if(!response.ok)return false;
  const data=await response.json();
  const wiki=String(data?.parse?.wikitext||'');
  // Deutscher Eintrag, einschließlich geografischer Eigennamen und Lehnwörter.
  return /\{\{Sprache\s*\|\s*Deutsch\s*\}\}/i.test(wiki)||/\{\{=de=\}\}/i.test(wiki);
 }finally{clearTimeout(timer)}
}
async function isGermanWord(word){
 if(knownWords.has(word)||additionalGermanWords.has(word))return true;
 // Großschreibung ist für Nomen und Ortsnamen entscheidend.
 try{
  if(await wiktionaryEntry(word[0]+word.slice(1).toLowerCase()))return true;
  if(await wiktionaryEntry(word.toLowerCase()))return true;
  return false;
 }catch{return null}
}

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
 const maxRows=Math.max(6,Number(state.unlockedRows)||6);
 for(let row=0;row<maxRows;row++){
  const guess=guesses[row]||(!state.word&&row===guesses.length?current:'');
  const colors=guesses[row]&&!(revealing&&row===guesses.length-1)?score(guess):[];
  for(let i=0;i<5;i++){const t=document.createElement('span');t.className='wordle-tile '+(colors[i]||'');t.textContent=guess[i]||'';tiles.append(t)}
 }
 const ranks={absent:1,present:2,correct:3}, best={};
 guesses.forEach((g,index)=>{if(revealing&&index===guesses.length-1)return;score(g).forEach((c,i)=>{if(!best[g[i]]||ranks[c]>ranks[best[g[i]]])best[g[i]]=c})});
 for(const [k,b] of Object.entries(keys)){b.className=(b.classList.contains('wordle-wide')?'wordle-wide ':'')+(best[k]||'');}
 const next=modal.querySelector('.wordle-next');next.hidden=false;
 if(state.word&&!revealing){status.textContent='✦ Das Wort ist gefunden: '+WORD;next.innerHTML='<p>Du hast das geheime Wort entdeckt. Kannst du daraus den Schlüssel zur Sternenroute entschlüsseln?</p><button id="day3-password-open" type="button">✧ Lösung eingeben ✧</button><div id="day3-password-area"></div>';next.querySelector('button').onclick=showPassword;modal.querySelector('.wordle-keyboard').hidden=true;}
 else if(guesses.length>=maxRows&&!revealing){
  const extras=guesses.length-6;
  const messages=[
   'Die Sterne sind heute gnädig. Na gut – noch ein Versuch!',
   'Die Sternenwächter runzeln die Stirn. Aber eine weitere Chance sei dir gewährt.',
   'Nun wird es ernst. Dies ist deine allerletzte Chance. Ganz bestimmt.',
   'Die Sternenwächter verlieren langsam die Geduld. Eine letzte, allerletzte Chance!',
   'Selbst die Sterne können es kaum glauben. Noch EIN Versuch!',
   'Das Sternenreich hält den Atem an. Wie oft möchtest du die letzte Chance noch bekommen?',
   'Die Geduld der Sternenwächter ist legendär. Du stellst sie auf eine harte Probe.',
   'Ein Stern ist vor Verzweiflung vom Himmel gefallen. Hier ist dein nächster Versuch.',
   'Das Wort „allerletzt“ hat heute offenbar eine neue Bedeutung bekommen.',
   'Die Sternenwächter haben aufgehört zu zählen. Du hoffentlich nicht.'
  ];
  status.textContent=extras===0?'Sechs Versuche sind vergangen …':'Auch dieser Versuch war es noch nicht …';
  next.innerHTML='<p>'+messages[Math.min(extras,messages.length-1)]+'</p><button id="day3-extra" type="button">✦ Noch eine Chance ✦</button>';
  next.querySelector('button').onclick=()=>{state.unlockedRows=guesses.length+1;save();renderGame()};
  modal.querySelector('.wordle-keyboard').hidden=true;
 }
 else{next.hidden=true;modal.querySelector('.wordle-keyboard').hidden=busy||revealing;status.textContent=revealing?'Die Sterne prüfen dein Wort …':busy?'Das Wort wird geprüft …':Math.max(0,maxRows-guesses.length)+' Versuch'+(maxRows-guesses.length===1?'':'e')+' übrig';}
 if(ready()){next.innerHTML='<p>✧ Die Sternenroute ist freigeschaltet. Schließe das Rätsel und wähle das richtige Sternenfeld.</p>';modal.querySelector('.wordle-keyboard').hidden=true}
}
function showPassword(){
 const area=modal.querySelector('#day3-password-area');if(!area)return;
 area.innerHTML='<form class="day3-pass-form"><label for="day3-pass">Dein Zahlenschlüssel</label><input id="day3-pass" type="text" inputmode="numeric" autocomplete="off" placeholder="Zahlenschlüssel eingeben" required><button type="submit">✧ Schlüssel prüfen ✧</button></form><p class="day3-pass-status" role="status"></p>';
 area.querySelector('form').onsubmit=e=>{e.preventDefault();if(area.querySelector('input').value.trim()===PASS){state.route=true;save();renderGame()}else area.querySelector('.day3-pass-status').textContent='Der Schlüssel passt noch nicht. Versuche es erneut.'};
 area.querySelector('input').focus();
}
async function submit(){
 if(busy||revealing||state.word||(state.guesses||[]).length>=Math.max(6,Number(state.unlockedRows)||6))return;
 if(current.length!==5){status.textContent='Bitte gib fünf Buchstaben ein.';return}
 busy=true;const guess=current;status.textContent='Das Wort wird geprüft …';
 const valid=await isGermanWord(guess);
 if(!modal){busy=false;return}
 if(valid!==true){busy=false;status.textContent=valid===false?'Dieses Wort existiert nicht im deutschen Wörterbuch.':'Wörterbuch gerade nicht erreichbar. Bitte versuche es erneut.';return}
 state.guesses=[...(state.guesses||[]),guess];current='';revealing=true;busy=false;save();renderGame();
 const row=state.guesses.length-1,colors=score(guess),rowTiles=[...tiles.children].slice(row*5,row*5+5);
 for(let i=0;i<5;i++){setTimeout(()=>{
  if(!modal)return;
  rowTiles[i].classList.add('wordle-flip',colors[i]);
  const keyButton=keys[guess[i]];if(keyButton){const rank={absent:1,present:2,correct:3};const old=['correct','present','absent'].find(c=>keyButton.classList.contains(c));if(!old||rank[colors[i]]>rank[old]){keyButton.classList.remove('correct','present','absent');keyButton.classList.add(colors[i])}}
 },i*360)}
 setTimeout(()=>{revealing=false;if(guess===WORD)state.word=true;save();renderGame()},5*360+540);
}
function type(k){if(busy||revealing||state.word||(state.guesses||[]).length>=Math.max(6,Number(state.unlockedRows)||6))return;if(k==='BACKSPACE')current=current.slice(0,-1);else if(/^[A-Z]$/.test(k)&&current.length<5)current+=k;renderGame()}
function physical(e){if(!modal||e.target.closest('input'))return;if(e.key==='Escape'){close();return}if(e.key==='Enter')submit();else if(e.key==='Backspace')type('BACKSPACE');else if(/^[a-zA-Z]$/.test(e.key))type(e.key.toUpperCase())}
open.onclick=()=>{build();if(state.word&&!ready())showPassword()};
board.addEventListener('click',e=>{if(!allowed()||ready())return;const cell=e.target.closest('.cell');if(!cell)return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse erst das Tagesrätsel, bevor du das nächste Häuschen auswählst. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
select.addEventListener('change',()=>setTimeout(sync,0));document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));
const observer=new MutationObserver(()=>{if(allowed()!==!bar.hidden)sync()});observer.observe(select,{attributes:true,attributeFilter:['value']});
document.getElementById('test-reset')?.addEventListener('click',()=>{setTimeout(()=>{if(!localStorage.getItem('verschollene-blueten-geloest-v1')){localStorage.removeItem(key);state={};current='';sync()}},100)},true);
sync();
})();