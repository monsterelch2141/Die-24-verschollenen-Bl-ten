(()=>{
'use strict';
const DAY=9,KEY='advent-tag9-morse-v1',ANSWER='ANGRYBIRDS',ROUTE=[137,208,314,95,421,63,178,256];
const CODES={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..'};
const MESSAGE='BOHSZCJSET',UNIT=330;
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
let solved=false;try{solved=JSON.parse(localStorage.getItem(KEY)||'{}').solved===true}catch{}
const bar=document.createElement('section');bar.className='day9-quest';bar.hidden=true;
bar.innerHTML='<div class="quest-mark">✧ ✦ ✧</div><h3>Das Flüstern der Sterne</h3><p>Manche Sterne haben mehr zu erzählen als andere.</p><button type="button" id="day9-open">✧ Den Sternenhimmel betreten ✧</button><div id="day9-route" hidden></div>';
instruction.before(bar);
const selected=()=>Number(day.value)===DAY;
function sync(){bar.hidden=!selected();if(!selected())return;bar.querySelector('#day9-route').hidden=!solved;if(solved)bar.querySelector('#day9-route').innerHTML='<strong>Sternenroute (Testdaten)</strong><p>'+ROUTE.join(' → ')+'</p><small>Vorläufige Route zum Testen.</small>';instruction.textContent=solved?'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.'}
let overlay=null,timers=[],playing=false,starNodes=[],paper=null,drag=null;
const later=(fn,ms)=>{const id=setTimeout(fn,ms);timers.push(id);return id};
function stop(){timers.forEach(clearTimeout);timers=[];playing=false;starNodes.forEach(n=>n.classList.remove('morse-lit'))}
function sequence(){if(!overlay)return;stop();playing=true;const replay=overlay.querySelector('.morse-replay');replay.disabled=true;let delay=700;
MESSAGE.split('').forEach((letter,index)=>{const node=starNodes[index],code=CODES[letter];for(const signal of code){const length=(signal==='.'?1:3)*UNIT;later(()=>node.classList.add('morse-lit'),delay);later(()=>node.classList.remove('morse-lit'),delay+length);delay+=length+UNIT}delay+=UNIT*3});
later(()=>{playing=false;replay.disabled=false},delay+400)}
function close(){stop();overlay?.remove();overlay=null;paper=null;document.body.classList.remove('day9-active')}
function makePaper(){
 paper=document.createElement('div');paper.className='morse-paper';
 paper.innerHTML='<div class="morse-paper-front"><div class="morse-paper-grip">✥ &nbsp; MORSEALPHABET &nbsp; ✥ <button type="button" class="morse-paper-flip" aria-label="Blatt schließen">×</button></div><div class="morse-paper-list">'+Object.entries(CODES).map(([letter,code])=>'<span><b>'+letter+'</b> <em>'+code.replaceAll('.','·').replaceAll('-','−')+'</em></span>').join('')+'</div><div class="morse-paper-ornament">✦ ❦ ✦</div></div>';
 overlay.querySelector('.morse-sky').append(paper);
 paper.hidden=true;
 overlay.querySelector('.morse-moon').addEventListener('click',()=>{paper.hidden=false;paper.classList.add('morse-paper-open')});
 paper.querySelector('.morse-paper-flip').onclick=e=>{e.stopPropagation();paper.hidden=true;paper.classList.remove('morse-paper-open')};
 paper.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;drag={x:e.clientX,y:e.clientY,left:paper.offsetLeft,top:paper.offsetTop,moved:false};paper.setPointerCapture(e.pointerId)});
 paper.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>7)drag.moved=true;if(!drag.moved)return;e.preventDefault();const sky=overlay.querySelector('.morse-sky');paper.style.left=Math.max(0,Math.min(sky.clientWidth-paper.offsetWidth,drag.left+dx))+'px';paper.style.top=Math.max(0,Math.min(sky.clientHeight-paper.offsetHeight,drag.top+dy))+'px';paper.style.right='auto'});
 paper.addEventListener('pointerup',()=>{later(()=>{drag=null},0)});paper.addEventListener('pointercancel',()=>{drag=null});
}
function open(){if(overlay)return;overlay=document.createElement('div');overlay.className='day9-overlay';overlay.innerHTML='<div class="morse-top"><span>✧ &nbsp; Das Flüstern der Sterne &nbsp; ✧</span><button type="button" class="morse-close" aria-label="Schließen">×</button></div><div class="morse-sky"><div class="morse-haze"></div><button type="button" class="morse-moon" aria-label="Mond betrachten"></button><div class="morse-farstars"></div><div class="morse-signals"></div><div class="morse-horizon"></div><span class="morse-subtle-shift" aria-hidden="true">−1</span></div><div class="morse-bottom"><button type="button" class="morse-replay">↻ Sternenfolge wiederholen</button><form class="morse-form"><input type="text" aria-label="Lösungswort" placeholder="Lösungswort eingeben" autocomplete="off" spellcheck="false" required><button type="submit">Sternenroute freischalten</button></form><p class="morse-status" role="status"></p></div>';
document.documentElement.append(overlay);document.body.classList.add('day9-active');overlay.querySelector('.morse-close').onclick=close;overlay.querySelector('.morse-replay').onclick=sequence;
const stars=overlay.querySelector('.morse-signals');starNodes=MESSAGE.split('').map((_,i)=>{const node=document.createElement('span');node.className='morse-signal';node.style.left=(8+i*84/9)+'%';node.style.top=(i%2?39:35)+'%';node.textContent='✦';stars.append(node);return node});
const far=overlay.querySelector('.morse-farstars');let seed=73921;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};for(let i=0;i<190;i++){const dot=document.createElement('i');dot.style.left=rand()*100+'%';dot.style.top=rand()*85+'%';dot.style.opacity=(.15+rand()*.65).toFixed(2);dot.style.width=dot.style.height=(1+rand()*1.7)+'px';far.append(dot)}
makePaper();overlay.querySelector('.morse-form').onsubmit=e=>{e.preventDefault();const value=overlay.querySelector('.morse-form input').value.toUpperCase().replace(/[^A-Z]/g,'');if(value===ANSWER){solved=true;localStorage.setItem(KEY,JSON.stringify({solved:true}));overlay.querySelector('.morse-status').textContent='✦ Die Sternenroute ist freigeschaltet.';sync()}else overlay.querySelector('.morse-status').textContent='Der Schlüssel stimmt noch nicht.'};sequence()}
bar.querySelector('#day9-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||solved||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse erst das Tagesrätsel, bevor du ein Sternenfeld auswählst. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
day.addEventListener('change',()=>setTimeout(sync,0));document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));sync();
})();