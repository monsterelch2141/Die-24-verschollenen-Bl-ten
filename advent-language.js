(()=>{'use strict';
const dictionary={
'Das Geheimnis':'The Secret','der verschollenen Blüten':'of the Lost Blossoms',
'Ein Geheimnis wartet auf dich':'A secret awaits you','Für den Zugriff auf diese Seite ist ein Passwort erforderlich.':'A password is required to access this page.',
'Wie ist Ihr Nachname?':'What is your surname?','Deine Antwort …':'Your answer …','Geheimnis enthüllen':'Reveal the secret',
'Nur wer das richtige Wort kennt, darf eintreten.':'Only those who know the right word may enter.',
'Ein Rätselbuch voller Erinnerungen':'A puzzle book full of memories',
'24 kleine Adventsrätsel in unserer gemeinsamen Reise':'24 little Advent puzzles on our shared journey',
'Wähle deinen nächsten Rätseltag':'Choose your next puzzle day',
'Tag auswählen':'Select a day','Vorheriger Tag':'Previous day','Nächster Tag':'Next day',
'Tippe auf das Feld, in dem deine Sternenroute endet.':'Tap the square where your star route ends.',
'Rätselraster mit sechs Spalten und vier Zeilen':'Puzzle grid with six columns and four rows',
'Alles aufdecken':'Reveal all','Alle 24 Blüten sind gefunden. Eure Erinnerungen warten.':'All 24 blossoms have been found. Your memories await.',
'Unser Erinnerungsbild ansehen':'View our memory picture','Test: alle 24 Rätsel lösen':'Test: solve all 24 puzzles','Test: alles zurücksetzen':'Test: reset everything',
'Die Sterne warten auf deine Entdeckung.':'The stars await your discovery.',
'Nur wer den rechten Stern findet,':'Only those who find the right star,','vermag das nächste Geheimnis zu lüften.':'can uncover the next secret.',
'24 Blüten, eine Liebe':'24 blossoms, one love','Unsere schönsten Erinnerungen':'Our most beautiful memories',
'Dein Erinnerungsbild wird vorbereitet …':'Your memory picture is being prepared …',
'Bild sichern / teilen':'Save / share image','Bild herunterladen':'Download image',
'Zurück zum Rätselbuch':'Back to the puzzle book','Foto schließen':'Close photo',
'Unser Erinnerungsfoto':'Our memory photo','Erinnerungscollage mit 24 Polaroid-Fotos':'Memory collage with 24 Polaroid photos',
'Auf dem iPhone:':'On iPhone:','Bild sichern':'Save image','In Fotos sichern':'Save to Photos',
'Tag':'Day','Rätsel':'Puzzle','Schlüsselwort':'Keyword','Schlüsselwort eingeben':'Enter keyword',
'Schlüssel bestätigen':'Confirm keyword','Bestätigen':'Confirm','Schlüssel eingeben':'Enter key',
'Rätsel aufrufen':'Open puzzle','Rätsel starten':'Start puzzle','Starten':'Start','Weiter':'Continue',
'Zurück':'Back','Schließen':'Close','Abbrechen':'Cancel','Prüfen':'Check','Lösung':'Solution',
'Richtig!':'Correct!','Falsch!':'Incorrect!','Erneut versuchen':'Try again','Versuch':'Attempt','Versuche':'Attempts',
'Das Schlüsselwort stimmt noch nicht.':'The keyword is not correct yet.',
'Die Sternenroute ist freigeschaltet.':'The star route has been unlocked.',
'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Connect your star route and choose the correct star.',
'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.':'Solve the daily puzzle before choosing a star square.',
'Dieses Tagesrätsel neu beginnen':'Restart this daily puzzle',
'Die Zitronenbotschaft':'The Lemon Message','Entziffere die unsichtbare Schrift und gib den Schlüssel exakt so ein, wie du ihn entdeckt hast.':'Decipher the invisible writing and enter the key exactly as you found it.',
'Das Geheimnis der Website':'The Website Secret',
'Ein einziges Wort ist nicht wie an den anderen Tagen. Finde das übliche englische Wort und gib es als Schlüssel ein.':'One word differs from the other days. Find the usual English word and enter it as the key.',
'Finde das versteckte Schlüsselwort auf der Website.':'Find the hidden keyword on the website.',
'Gib das gesuchte Schlüsselwort ein, um die Sternenroute freizuschalten.':'Enter the requested keyword to unlock the star route.',
'Gib das gesuchte Schlüsselwort ein.':'Enter the requested keyword.',
'Die zusammengesetzte Botschaft':'The Assembled Message',
'Setze das physische Puzzle zusammen und finde den vierstelligen Zahlenschlüssel.':'Assemble the physical puzzle and find the four-digit number key.',
'Die Prophezeiung der zwei Ufer':'The Prophecy of the Two Shores',
'Das Moiré-Geheimnis':'The Moiré Secret','Die verborgene Erinnerung':'The Hidden Memory',
'Hier wartet noch eine Erinnerung.':'Another memory awaits here.',
'Zur Reisekarte':'Back to the travel map','Zur Startseite':'Back to the home page',
'Berufsschule':'Vocational School','Sterne über Hilgenroth':'Stars over Hilgenroth','Unsere erste Rose':'Our First Rose',
'Winter in Wallmenroth':'Winter in Wallmenroth','Monets Garten & Flora':'Monet’s Garden & Flora',
'Keramik in Frankfurt':'Pottery in Frankfurt','Zoo & Schokolade':'Zoo & Chocolate','Brügge im Juni':'Bruges in June',
'Unser Herzanhänger':'Our Heart Pendant','Blumensamen-Advent':'Flower Seed Advent','Paris im November':'Paris in November',
'IHK-Abschlussprüfung':'Final Chamber of Commerce Exam','Skifahren in Willingen':'Skiing in Willingen',
'FC Köln gegen Inter U19':'FC Cologne vs Inter U19','London im April':'London in April',
'WM 2026':'World Cup 2026','Mailand im Juni':'Milan in June','Comer See im Juni':'Lake Como in June',
'Berlin im Juli':'Berlin in July','Hochzeit von Laura & Silas':'Laura & Silas’s Wedding',
'Wandern im Allgäu':'Hiking in the Allgäu','Zakynthos im September':'Zakynthos in September',
'Luis’ Köln-Marathon':'Luis’s Cologne Marathon','Brügger Weihnachtsmarkt':'Bruges Christmas Market',
'Hier begann alles.':'This is where it all began.','Ein Sternenhimmel und ein Auto mit eigenen Plänen.':'A starry sky and a car with plans of its own.',
'Der Parkplatz, an dem aus Nähe Liebe wurde.':'The parking lot where closeness became love.',
'Ein warmes Zuhause mitten im Winter.':'A warm home in the middle of winter.',
'Köln in voller Blüte.':'Cologne in full bloom.','Unsere selbst gestalteten Erinnerungen.':'Our handmade memories.',
'Ein Tag voller Entdeckungen in Köln.':'A day full of discoveries in Cologne.',
'Grachten und Sommerzauber.':'Canals and summer magic.',
'Ein Herz, das uns begleitet.':'A heart that stays with us.',
'24 kleine Versprechen, die wachsen.':'24 little promises that grow.',
'Lichter in der Stadt der Liebe.':'Lights in the city of love.',
'Ein großer Meilenstein.':'A major milestone.',
'Gemeinsam durch den Schnee.':'Together through the snow.',
'Fußballfieber im RheinEnergieSTADION.':'Football fever at RheinEnergieSTADION.',
'Eine Reise über den Ärmelkanal.':'A journey across the English Channel.',
'Ein Sommer voller Fußball.':'A summer full of football.',
'Zwischen Dom und italienischem Leben.':'Between the cathedral and Italian life.',
'Ein See wie aus einem Märchen.':'A lake straight out of a fairy tale.',
'Ein neues Kapitel in der Hauptstadt.':'A new chapter in the capital.',
'Ein Fest der Liebe.':'A celebration of love.',
'Hand in Hand durch die Berge.':'Hand in hand through the mountains.',
'Türkisblaues Meer und Sonnenlicht.':'Turquoise sea and sunshine.',
'Ein besonderer Zieleinlauf.':'A special finish line.',
'Weihnachtslichter zum Abschluss unserer 24 Stationen.':'Christmas lights to close our 24 stops.'
};
Object.assign(dictionary,{
'Die Welt der verborgenen Sterne':'The World of Hidden Stars',
'Ein ferner Ort wartet darauf, von dir entdeckt zu werden.':'A distant place is waiting for you to discover it.',
'Die Sternenwelt betreten':'Enter the World of Stars',
'Testmodus: Alle 24 Tage sind zum Ausprobieren geöffnet.':'Test mode: All 24 days are open for testing.',
'1. Dezember':'December 1','2. Dezember':'December 2','3. Dezember':'December 3',
'Sternenroute (Testdaten)':'Star Route (Test Data)',
'Vorläufige Route zum Testen.':'Temporary route for testing.',
'Die verborgenen Sterne':'The Hidden Stars',
'Welt der verborgenen Sterne':'World of Hidden Stars',
'Die Sterne':'The Stars',
'Rätsel lösen':'Solve puzzle',
'Die Sternenwelt':'The World of Stars',
'Schlüsselwort richtig!':'Correct keyword!',
'Die Sternenroute freischalten':'Unlock the star route',
'Die Sternenroute':'The star route',
'Noch nicht gelöst':'Not solved yet',
'Rätsel gelöst':'Puzzle solved',
'Richtig geraten!':'Correct guess!',
'Neuer Versuch':'New attempt',
'Land eingeben':'Enter country',
'Land raten':'Guess country',
'Land auswählen':'Select country',
'Entfernung':'Distance',
'Deine Vermutung':'Your guess',
'Noch ein Versuch':'One more attempt',
'Weiter zum nächsten Level':'Continue to the next level',
'Nächste Runde':'Next round',
'Runde':'Round',
'Level':'Level',
'Punkte':'Points',
'Ergebnis':'Result',
'Wähle ein Land':'Choose a country',
'Wähle das richtige Land':'Choose the correct country',
'Du hast gewonnen!':'You won!',
'Du hast es geschafft!':'You did it!'
});
Object.assign(dictionary,{"Die drei Pfade der Wörter":"The Three Paths of Words","Drei Rätselwelten warten auf ihre Entdeckung.":"Three puzzle worlds are waiting to be discovered.","Finde die Themenwörter und den verbindenden Spangram.":"Find the theme words and the connecting spangram.","Zum Tagesrätsel":"Open the Daily Puzzle","Sternenroute erneut ansehen":"View the Star Route Again","Das Flüstern der Sterne":"The Whisper of the Stars","Manche Sterne haben mehr zu erzählen als andere.":"Some stars have more to tell than others.","Den Sternenhimmel betreten":"Enter the Starry Sky","Das Wort im Nebel":"The Word in the Mist","Ein Geheimnis wartet hinter dem Nebel. Nur ein Schlüsselwort kann es lüften.":"A secret lies behind the mist. Only a keyword can reveal it.","Das Wortgeheimnis betreten":"Enter the Word Mystery","Das Labyrinth der verlorenen Sterne":"The Labyrinth of Lost Stars","Führe die Sternenkugel durch die verschlungenen Gänge.":"Guide the star sphere through the winding passages.","Labyrinth betreten":"Enter the Labyrinth","Die Sternenroute ist freigeschaltet. Wähle ihren Zielstern.":"The star route is unlocked. Choose its destination star.","Der Rat der sechs Lebensalter":"The Council of Six Ages","Sechs Gestalten und sechs Geheimnisse ihrer Lebenszeit.":"Six figures and six secrets about their ages.","Rätsel betreten":"Enter the Puzzle","Das Maß der verborgenen Dinge":"The Measure of Hidden Things","Fünf Größenvergleiche erwarten dich. Erreiche mindestens 400 von 500 Punkten, um die Sternenroute freizuschalten.":"Five size comparisons await. Score at least 400 out of 500 points to unlock the star route.","Größenprüfung beginnen":"Begin the Size Challenge","Manchmal liegt die Antwort nicht dort, wo man sie erwartet.":"Sometimes the answer is not where you expect it.","Die verborgenen Zahlen":"The Hidden Numbers","Eine rätselhafte Darstellung wartet darauf, entschlüsselt zu werden.":"A mysterious image is waiting to be decoded.","Rätsel öffnen":"Open Puzzle","Das versiegelte Tonarchiv":"The Sealed Sound Archive","Tag 15 · Ein Geheimnis wartet darauf, entdeckt zu werden.":"Day 15 · A secret is waiting to be discovered.","Rätsel freischalten":"Unlock Puzzle","Ein Geheimnis wartet darauf, freigeschaltet zu werden.":"A secret is waiting to be unlocked.","Manche Geheimnisse offenbaren sich erst, wenn zwei Welten aufeinandertreffen.":"Some secrets reveal themselves only when two worlds meet.","Das Sternensiegel betrachten":"Examine the Star Seal","Die Prüfung des dritten Sterns":"The Trial of the Third Star","Ein verborgenes Wort weist dir den Weg durch die Sterne.":"A hidden word guides you through the stars.","Das Schweigen der Nacht":"The Silence of the Night","Ein Geheimnis wartet im Dunkeln.":"A secret waits in the darkness.","Die Dunkelheit betreten":"Enter the Darkness","Der Basar der verlorenen Sterne":"The Bazaar of Lost Stars","Manche Schätze kosten mehr, als man glaubt.":"Some treasures cost more than you think.","Das Zahlengeheimnis":"The Number Mystery","Neun Reihen, neun Spalten – und ein verborgenes Geheimnis.":"Nine rows, nine columns – and a hidden secret.","Sudoku öffnen":"Open Sudoku","Der Schlüssel wurde bestätigt. Die Sternenroute ist freigeschaltet.":"The key was confirmed. The star route is unlocked.","Die Rätselakten von Luminara":"The Mystery Files of Luminara","Zwei Ermittlungen. Drei Versuche. Eine letzte verrückte Chance.":"Two investigations. Three attempts. One last crazy chance.","Ermittlungen aufnehmen":"Begin the Investigation","Der Tauchgang der sieben Sterne":"The Dive of the Seven Stars","Zwei Level: Krillion und Noillirk. Erst nach jeweils 4.000 Metern wird die Sternenroute freigeschaltet.":"Two levels: Krillion and Noillirk. The star route unlocks only after reaching 4,000 meters in each.","Zum Tauchgang":"Begin the Dive","Schlüsselwort der Zitronenbotschaft":"Keyword for the Lemon Message","Das Schlüsselwort stimmt nicht exakt überein.":"The keyword does not match exactly.","Ein einziges Wort ist nicht wie an den anderen Tagen. Finde das übliche englische Wort und gib es als Schlüssel ein.":"One word differs from the other days. Find the usual English word and enter it as the key.","1. Dezember":"December 1","2. Dezember":"December 2","3. Dezember":"December 3","Dezember":"December"});
const phrases=Object.entries(dictionary).sort((a,b)=>b[0].length-a[0].length);
const originals=new WeakMap(),attributes=new WeakMap();let english=false,busy=false;
const skip='script,style,code,pre,svg,canvas,[contenteditable],.wordle-grid,.wordle-keyboard,.strands-grid,.contexto-word,.contexto-guesses,.octordle-grid,.antiwordle-grid';
function protect(node){const p=node.parentElement;return !p||!!p.closest(skip)||p.closest('input,textarea,select')!==null}
function translateText(s){let a=0,b=s.length;while(a<b&&s[a].trim()==='')a++;while(b>a&&s[b-1].trim()==='')b--;const core=s.slice(a,b);let translated=dictionary[core];if(translated===undefined){const dm=core.split('. Dezember');translated=dm.length===2&&dm[1]===''&&Number.isInteger(Number(dm[0]))?dm[0]+'. December':core}return s.slice(0,a)+translated+s.slice(b)}
function textNode(n){if(protect(n))return;let old=originals.get(n);if(!english){if(old!==undefined&&n.nodeValue!==old)n.nodeValue=old;return}
if(old===undefined){old=n.nodeValue;originals.set(n,old)}
let en=translateText(old);if(old.includes('24 kleine Adventsrätsel in unserer gemeinsamen Reise')&&Number(document.getElementById('day')?.value)===15)en=en.replace('shared journey','shared adventure');
if(n.nodeValue!==en){if(n.nodeValue!==old&&n.nodeValue!==translateText(old)){old=n.nodeValue;originals.set(n,old);en=translateText(old)}if(n.nodeValue!==en)n.nodeValue=en}}
function element(el){if(el.matches(skip)||el.closest(skip))return;for(const a of ['placeholder','title','aria-label','alt']){if(!el.hasAttribute(a))continue;let old=attributes.get(el)||{},raw=el.getAttribute(a);if(english){if(!(a in old))old[a]=raw;let val=translateText(old[a]);if(raw!==val)el.setAttribute(a,val)}else if(a in old&&raw!==old[a])el.setAttribute(a,old[a]);attributes.set(el,old)}}
function walk(root){if(busy)return;busy=true;try{if(root.nodeType===3){textNode(root);return}if(root.nodeType!==1&&root.nodeType!==9)return;if(root.nodeType===1)element(root);const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode())textNode(w.currentNode);if(root.querySelectorAll)root.querySelectorAll('[placeholder],[title],[aria-label],[alt]').forEach(element)}finally{busy=false}}
const button=document.createElement('button');button.type='button';button.className='advent-language-switch';button.setAttribute('aria-label','Switch language / Sprache wechseln');button.setAttribute('title','Deutsch / English');button.innerHTML='<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></svg>';
button.style.cssText='position:fixed;right:14px;top:14px;z-index:100050;display:grid;place-items:center;width:39px;height:39px;border:1px solid #b49a73;border-radius:50%;background:#f6efdf;color:#795b39;box-shadow:0 2px 9px #35240d2b;cursor:pointer';
document.body.append(button);
function refresh(){document.documentElement.lang=english?'en':'de';button.setAttribute('aria-pressed',String(english));walk(document.body);document.title=english?'The Secret of the Lost Blossoms':'Das Geheimnis der verschollenen Blüten'}
button.onclick=()=>{english=!english;try{localStorage.setItem('advent-language-v1',english?'en':'de')}catch{}refresh()};
try{english=localStorage.getItem('advent-language-v1')==='en'}catch{}
document.getElementById('day')?.addEventListener('change',()=>setTimeout(refresh,0));
new MutationObserver(mutations=>{if(busy)return;let needs=false;for(const m of mutations){if(m.target===button||button.contains(m.target))continue;needs=true;break}if(needs)refresh()}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label','alt']});
refresh();
})();