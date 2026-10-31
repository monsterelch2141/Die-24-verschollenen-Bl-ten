(() => {
'use strict';
const DAY=3, WORD='ZWEIG', PASS='40', ROUTE=[137,208,314,95,421,63,178,256,340,112,29,387,204,77,319,146,408,55];
const key='advent-tag3-wordle-v1';
const get=()=>{try{const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved.extra&&!saved.unlockedRows)saved.unlockedRows=7;return saved}catch{return {}}};
let state=get(), current='', modal=null, status=null, tiles=null, keys={}, busy=false, revealing=false;
const ANTI='FROST', OCT=['KERZE','NEBEL','KLANG','BRIEF','REISE','HONIG','MONAT','STERN'];
const originalKey='advent-tag3-wordle-v1';
const nextState=()=>{if(!state.level)state.level=1;if(!state.levelGuesses)state.levelGuesses={1:state.guesses||[],2:[],3:[]};return state;};
nextState();
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
 open.textContent=ready()?'✧ Sternenroute erneut ansehen ✧':state.level===3?'✧ Wortprüfung fortsetzen ✧':'✧ Zum Tagesrätsel ✧';
 hint.textContent=ready()?'Die Sternenroute wurde freigeschaltet. Du darfst nun das Sternenfeld wählen.':state.level===3?'Die letzte Wortprüfung wartet auf dich.':'Löse zuerst das Wortspiel, um den Zahlenschlüssel zu entdecken.';
 route.hidden=!ready();
 if(ready())route.innerHTML='<strong>Deine Sternenroute (Testdaten)</strong><p>'+ROUTE.join(' → ')+'</p><small>Verbinde alle Punkte. Nur die ersten drei Zahlen bestimmen später den Zielstern.</small>';
 instruction.textContent=ready()?'Verbinde die Sternenroute und wähle anschließend den richtigen Stern.': 'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.';
}
function save(){localStorage.setItem(key,JSON.stringify(state));sync()}
function close(){modal?.remove();modal=null;document.removeEventListener('keydown',physical);sync()}
function score(guess,word){
 const result=Array(5).fill('absent'),counts={};
 for(let i=0;i<5;i++)if(guess[i]===word[i])result[i]='correct';else counts[word[i]]=(counts[word[i]]||0)+1;
 for(let i=0;i<5;i++)if(result[i]!=='correct'&&counts[guess[i]]>0){result[i]='present';counts[guess[i]]--}
 return result;
}
const guesses=()=>nextState().levelGuesses[state.level];
const levelDone=()=>state.level===1?guesses().includes(WORD):state.level===2?guesses().length>=6||guesses().includes(ANTI):OCT.every(w=>guesses().includes(w));
function antiConstraint(guess){
 const prev=guesses(),forbidden=new Set(),fixed={},required={},wrong={};
 for(const word of prev){
  const sc=score(word,ANTI);
  for(let i=0;i<5;i++){
   if(sc[i]==='correct')fixed[i]=word[i];
   if(sc[i]==='present'){required[word[i]]=Math.max(required[word[i]]||0,sc.filter((c,j)=>c!=='absent'&&word[j]===word[i]).length);(wrong[word[i]]||=new Set()).add(i)}
   if(sc[i]==='absent'&&!ANTI.includes(word[i]))forbidden.add(word[i]);
  }
 }
 for(let i=0;i<5;i++)if(fixed[i]&&guess[i]!==fixed[i])return 'Der rote Buchstabe '+fixed[i]+' muss an Position '+(i+1)+' bleiben.';
 for(const c of forbidden)if(guess.includes(c))return 'Der graue Buchstabe '+c+' darf nicht erneut vorkommen.';
 for(const [c,n] of Object.entries(required)){
  if([...guess].filter(x=>x===c).length<n)return 'Der gelbe Buchstabe '+c+' muss wieder vorkommen.';
  for(const i of wrong[c])if(guess[i]===c)return 'Der gelbe Buchstabe '+c+' muss seine Position wechseln.';
 }
 return '';
}
function build(){
 if(modal)return;
 modal=document.createElement('div');modal.className='wordle-overlay';
 modal.innerHTML='<section class="wordle-panel" role="dialog" aria-modal="true" aria-label="Wortprüfung in drei Leveln"><button class="wordle-close" type="button" aria-label="Schließen">×</button><div class="quest-mark">✧ ✦ ✧</div><h2>Das Wort der Sternenwächter</h2><p class="wordle-level-description"></p><div class="wordle-grid" aria-label="Wortspielbrett"></div><p class="wordle-status" role="status" aria-live="polite"></p><div class="wordle-keyboard"></div><div class="wordle-next" hidden></div></section>';
 document.documentElement.append(modal);modal.querySelector('.wordle-close').onclick=close;
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 tiles=modal.querySelector('.wordle-grid');status=modal.querySelector('.wordle-status');
 const keyboard=modal.querySelector('.wordle-keyboard');keys={};
 for(const row of ['QWERTZUIOP','ASDFGHJKL','YXCVBNM']){
  const line=document.createElement('div');line.className='wordle-keyrow';
  if(row==='YXCVBNM'){const enter=document.createElement('button');enter.type='button';enter.textContent='↵';enter.className='wordle-wide';enter.onclick=submit;line.append(enter)}
  for(const ch of row){const b=document.createElement('button');b.type='button';b.textContent=ch;b.onclick=()=>type(ch);line.append(b);keys[ch]=b}
  if(row==='YXCVBNM'){const del=document.createElement('button');del.type='button';del.textContent='⌫';del.className='wordle-wide';del.onclick=()=>type('BACKSPACE');line.append(del)}
  keyboard.append(line);
 }
 renderGame();document.addEventListener('keydown',physical);
}
function drawBoard(container,history,word,rows,active){
 const grid=document.createElement('div');grid.className='wordle-grid';
 for(let row=0;row<rows;row++){
  const g=history[row]||(!levelDone()&&row===history.length?active:'');
  const colors=history[row]?score(g,word):[];
  for(let i=0;i<5;i++){const t=document.createElement('span');t.className='wordle-tile '+(colors[i]||'');t.textContent=g[i]||'';grid.append(t)}
 }
 container.append(grid);
}
function renderGame(){
 if(!modal)return;
 nextState();const lv=state.level,h=guesses(),done=levelDone(),next=modal.querySelector('.wordle-next');
 const desc=modal.querySelector('.wordle-level-description');
 desc.textContent=lv===1?'Level 1 von 3 · Wordle: Finde das Wort in sechs Versuchen.':lv===2?'Level 2 von 3 · Antiwordle: Vermeide das Lösungswort sechs Versuche lang! Grau ist verboten, Gelb muss umziehen, Rot bleibt stehen.':'Level 3 von 3 · Octordle: Acht Wörter gleichzeitig, insgesamt 13 Versuche. Ein Tipp zählt für alle acht Felder.';
 tiles.replaceChildren();tiles.className=lv===3?'wordle-octordle':'wordle-grid';
 if(lv===3){
  OCT.forEach((word,i)=>{
   const pane=document.createElement('div');pane.className='wordle-octo-board';
   const heading=document.createElement('div');heading.className='wordle-octo-heading';heading.textContent='Wort '+(i+1)+(h.includes(word)?' ✓':'');
   pane.append(heading);
   drawBoard(pane,h,word,13,h.includes(word)?'':current);
   tiles.append(pane);
  });
 }else{
  const word=lv===1?WORD:ANTI,rows=lv===1?Math.max(6,Number(state.unlockedRows)||6):6;
  for(let row=0;row<rows;row++){
   const g=h[row]||(!done&&row===h.length?current:'');
   const colors=h[row]?score(g,word):[];
   for(let i=0;i<5;i++){const t=document.createElement('span');t.className='wordle-tile '+(colors[i]||'');t.textContent=g[i]||'';tiles.append(t)}
  }
 }
 const best={},rank={absent:1,present:2,correct:3};
 if(lv!==3)h.forEach(g=>score(g,lv===1?WORD:ANTI).forEach((c,i)=>{if(!best[g[i]]||rank[c]>rank[best[g[i]]])best[g[i]]=c}));
 for(const [c,b] of Object.entries(keys))b.className=best[c]||'';
 next.hidden=true;next.replaceChildren();
 const keyboard=modal.querySelector('.wordle-keyboard');
 keyboard.hidden=busy||revealing||done||ready()||(lv===3&&h.length>=13)||(lv===1&&h.length>=Math.max(6,Number(state.unlockedRows)||6));
 if(ready()){
  status.textContent='✧ Die Sternenroute ist freigeschaltet.';
  next.hidden=false;next.innerHTML='<p>Verbinde nun die Punkte deiner Sternenroute und wähle das richtige Sternenfeld.</p>';return;
 }
 if(lv===1&&h.includes(WORD)){
  status.textContent='✦ Level 1 geschafft: ZWEIG';
  next.hidden=false;next.innerHTML='<p>Die erste Prüfung ist bestanden. Doch die Sternenwächter haben noch eine Aufgabe.</p><button type="button">✧ Weiter zu Level 2 ✧</button>';
  next.querySelector('button').onclick=()=>advance(2);return;
 }
 if(lv===1&&h.length>=Math.max(6,Number(state.unlockedRows)||6)){
  const extras=h.length-6;status.textContent='Das gesuchte Wort wurde noch nicht gefunden.';
  next.hidden=false;next.innerHTML='<p>'+(extras===0?'Na gut – einen Versuch hast du noch!':'Die Sternenwächter gewähren dir noch eine weitere Chance.')+'</p><button type="button">✦ Noch eine Chance ✦</button>';
  next.querySelector('button').onclick=()=>{state.unlockedRows=h.length+1;save();renderGame()};return;
 }
 if(lv===2&&done){
  const lost=h.includes(ANTI);status.textContent=lost?'Das Antiwordle-Wort wurde erraten.':'✦ Sechs Versuche überstanden!';
  next.hidden=false;next.innerHTML='<p>'+(lost?'Na gut, einen Versuch hast du noch!':'Die Sterne sind beeindruckt. Aber eine letzte Prüfung wartet auf dich.')+'</p><button type="button">✧ Weiter zu Level 3 ✧</button>';
  next.querySelector('button').onclick=()=>advance(3);return;
 }
 if(lv===3&&OCT.every(w=>h.includes(w))){
  status.textContent='✦ Alle acht Wörter gefunden!';
  next.hidden=false;next.innerHTML='<p>Entschlüssle nun das vierte Wort. Addiere die Alphabetpositionen seiner fünf Buchstaben, um den Zahlenschlüssel zu erhalten.</p><button type="button">✧ Lösung eingeben ✧</button><div id="day3-password-area"></div>';
  next.querySelector('button').onclick=showPassword;return;
 }
 if(lv===3&&h.length>=13){
  status.textContent='Die 13 Versuche sind aufgebraucht.';
  next.hidden=false;next.innerHTML='<p>Die Sternenwächter lassen dich nicht im Stich. Na gut – noch ein Versuch!</p><button type="button">✦ Noch eine Chance ✦</button>';
  next.querySelector('button').onclick=()=>{state.octoExtra=(state.octoExtra||0)+1;save();renderGame()};keyboard.hidden=!(state.octoExtra>0);return;
 }
 status.textContent=busy?'Das Wort wird geprüft …':lv===3?(13-h.length)+' von 13 Versuchen übrig · '+OCT.filter(w=>h.includes(w)).length+'/8 gefunden':lv===2?(6-h.length)+' Antiwordle-Versuche übrig':(Math.max(6,Number(state.unlockedRows)||6)-h.length)+' Versuche übrig';
}
function advance(level){state.level=level;state.levelGuesses[level]||=[];current='';save();renderGame()}
function showPassword(){
 const area=modal?.querySelector('#day3-password-area');if(!area)return;
 area.innerHTML='<form class="day3-pass-form"><label for="day3-pass">Dein Zahlenschlüssel aus Wort 4</label><input id="day3-pass" type="text" inputmode="numeric" autocomplete="off" placeholder="Summe der Alphabetpositionen" required><button type="submit">✧ Schlüssel prüfen ✧</button></form><p class="day3-pass-status" role="status"></p>';
 area.querySelector('form').onsubmit=e=>{e.preventDefault();if(area.querySelector('input').value.trim()===PASS){state.word=true;state.route=true;save();renderGame()}else area.querySelector('.day3-pass-status').textContent='Der Schlüssel passt noch nicht. Prüfe die Buchstaben von Wort 4.'};
 area.querySelector('input').focus();
}
async function submit(){
 if(busy||revealing||ready()||levelDone())return;
 const lv=state.level,h=guesses(),max=lv===1?Math.max(6,Number(state.unlockedRows)||6):lv===2?6:13+(state.octoExtra||0);
 if(h.length>=max)return;
 if(current.length!==5){status.textContent='Bitte gib fünf Buchstaben ein.';return}
 if(lv===2){const err=antiConstraint(current);if(err){status.textContent=err;return}}
 busy=true;const guess=current;status.textContent='Das Wort wird geprüft …';
 const valid=await isGermanWord(guess);
 if(!modal){busy=false;return}
 if(valid!==true){busy=false;status.textContent=valid===false?'Dieses Wort existiert nicht im deutschen Wörterbuch.':'Wörterbuch gerade nicht erreichbar. Bitte versuche es erneut.';return}
 h.push(guess);current='';busy=false;save();renderGame();
}
function type(k){
 if(busy||revealing||ready()||levelDone())return;
 const lv=state.level,h=guesses(),max=lv===1?Math.max(6,Number(state.unlockedRows)||6):lv===2?6:13+(state.octoExtra||0);
 if(h.length>=max)return;
 if(k==='BACKSPACE')current=current.slice(0,-1);else if(/^[A-Z]$/.test(k)&&current.length<5)current+=k;renderGame();
}
function physical(e){if(!modal||e.target.closest('input'))return;if(e.key==='Escape'){close();return}if(e.key==='Enter')submit();else if(e.key==='Backspace')type('BACKSPACE');else if(/^[a-zA-Z]$/.test(e.key))type(e.key.toUpperCase())}
open.onclick=()=>build();
board.addEventListener('click',e=>{if(!allowed()||ready())return;const cell=e.target.closest('.cell');if(!cell)return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse erst das Tagesrätsel, bevor du das nächste Häuschen auswählst. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
select.addEventListener('change',()=>setTimeout(sync,0));document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));
const observer=new MutationObserver(()=>{if(allowed()!==!bar.hidden)sync()});observer.observe(select,{attributes:true,attributeFilter:['value']});
document.getElementById('test-reset')?.addEventListener('click',()=>{setTimeout(()=>{if(!localStorage.getItem('verschollene-blueten-geloest-v1')){localStorage.removeItem(key);state={};current='';nextState();sync()}},100)},true);
sync();
})();