(()=>{
'use strict';
const DAY=7,N=19,KEY='advent-tag7-labyrinth-v1',ANSWER=71;
const TOKENS=['22','×','3','+','8','−','6','÷','2'];
const routeNumbers=[137,208,314,95,421,63,178,256];
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
let solved=false;try{solved=JSON.parse(localStorage.getItem(KEY)||'{}').solved===true}catch{}
const bar=document.createElement('section');bar.className='day7-quest';bar.hidden=true;
bar.innerHTML='<div class="quest-mark">✧ ✦ ✧</div><h3>Das Labyrinth der verlorenen Sterne</h3><p id="day7-caption">Führe die Sternenkugel durch die verschlungenen Gänge.</p><button type="button" id="day7-open">✧ Labyrinth betreten ✧</button><div id="day7-route" hidden></div>';
instruction.before(bar);
const selected=()=>Number(day.value)===DAY;
const sync=()=>{bar.hidden=!selected();if(!selected())return;bar.querySelector('#day7-caption').textContent=solved?'Die Sternenroute ist freigeschaltet. Wähle ihren Zielstern.':'Führe die Sternenkugel durch die verschlungenen Gänge.';bar.querySelector('#day7-route').hidden=!solved;if(solved)bar.querySelector('#day7-route').innerHTML='<strong>Sternenroute (Testdaten)</strong><p>'+routeNumbers.join(' → ')+'</p><small>Vorläufige Route zum Testen.</small>';instruction.textContent=solved?'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.'};
let seed=27072026;const random=max=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%max};
const walls=Array.from({length:N*N},()=>[true,true,true,true]);const seen=new Set([0]),stack=[0],parent=Array(N*N).fill(-1);
const dirs=[[-1,0,0,2],[0,1,1,3],[1,0,2,0],[0,-1,3,1]];
while(stack.length){const cur=stack[stack.length-1],y=Math.floor(cur/N),x=cur%N;const opts=dirs.map(([dy,dx,a,b])=>({dy,dx,a,b,ny:y+dy,nx:x+dx})).filter(v=>v.ny>=0&&v.ny<N&&v.nx>=0&&v.nx<N&&!seen.has(v.ny*N+v.nx));if(!opts.length){stack.pop();continue}const v=opts[random(opts.length)],next=v.ny*N+v.nx;walls[cur][v.a]=false;walls[next][v.b]=false;parent[next]=cur;seen.add(next);stack.push(next)}
// Weit entfernten Ausgang am Aussenrand waehlen.
const distance=id=>{let d=0;while(id>0&&d<N*N){id=parent[id];d++}return d};
let exit=0;for(let i=0;i<N*N;i++){const x=i%N,y=Math.floor(i/N);if((x===N-1||y===N-1||x===0||y===0)&&distance(i)>distance(exit))exit=i}
const solution=[];for(let p=exit;p>=0;p=parent[p]){solution.push(p);if(p===0)break}solution.reverse();
const marks=new Map();TOKENS.forEach((token,i)=>{const idx=Math.round((i+1)*solution.length/(TOKENS.length+1));marks.set(solution[Math.min(solution.length-2,Math.max(1,idx))],token)});
let modal=null,position=0,dragging=false,lastPointer=null,flashTimer=0,flashToken='',finished=false;
const neighbors=(a,b)=>{const ax=a%N,ay=Math.floor(a/N),bx=b%N,by=Math.floor(b/N);if(bx===ax&&by===ay-1)return !walls[a][0];if(bx===ax+1&&by===ay)return !walls[a][1];if(bx===ax&&by===ay+1)return !walls[a][2];if(bx===ax-1&&by===ay)return !walls[a][3];return false};
function draw(){
 if(!modal)return;const canvas=modal.querySelector('canvas'),ctx=canvas.getContext('2d');const width=canvas.clientWidth||330,dpr=Math.min(3,window.devicePixelRatio||1),size=width/N;
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(width*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
 ctx.clearRect(0,0,width,width);ctx.fillStyle='#f9f0db';ctx.fillRect(0,0,width,width);
 // Sternenstaub, Mauern und eine dezente Kugelspur.
 ctx.fillStyle='#d9c5a1';for(let i=0;i<N*N;i++){const x=i%N,y=Math.floor(i/N);ctx.beginPath();ctx.arc((x+.5)*size,(y+.5)*size,.6,0,Math.PI*2);ctx.fill()}
 ctx.lineWidth=Math.max(1.5,size*.12);ctx.strokeStyle='#665034';ctx.lineCap='square';ctx.beginPath();
 for(let id=0;id<N*N;id++){const x=id%N,y=Math.floor(id/N),w=walls[id];if(w[0]){ctx.moveTo(x*size,y*size);ctx.lineTo((x+1)*size,y*size)}if(w[3]){ctx.moveTo(x*size,y*size);ctx.lineTo(x*size,(y+1)*size)}if(y===N-1&&w[2]){ctx.moveTo(x*size,(y+1)*size);ctx.lineTo((x+1)*size,(y+1)*size)}if(x===N-1&&w[1]){ctx.moveTo((x+1)*size,y*size);ctx.lineTo((x+1)*size,(y+1)*size)}}ctx.stroke();
 const ex=exit%N,ey=Math.floor(exit/N);ctx.fillStyle='#b7d4b8';ctx.fillRect(ex*size+size*.19,ey*size+size*.19,size*.62,size*.62);
 const px=(position%N+.5)*size,py=(Math.floor(position/N)+.5)*size;const glow=ctx.createRadialGradient(px,py,1,px,py,size*.7);glow.addColorStop(0,'#fff8d5');glow.addColorStop(1,'#c18d31');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(px,py,size*.39,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#7b5427';ctx.lineWidth=1;ctx.stroke();
}
function flash(token){if(!modal)return;const el=modal.querySelector('.maze-flash');clearTimeout(flashTimer);el.textContent=token;el.classList.remove('show');void el.offsetWidth;el.classList.add('show');flashTimer=setTimeout(()=>el.classList.remove('show'),2000)}
function move(next){if(next===position||!neighbors(position,next))return false;position=next;draw();if(marks.has(next))flash(marks.get(next));if(next===exit&&!finished){finished=true;flash('= ?');modal.querySelector('.maze-finish').hidden=false;modal.querySelector('.maze-status').textContent='✦ Du hast den Ausgang erreicht.'}return true}
function coord(e){const canvas=modal.querySelector('canvas'),r=canvas.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*N),y=Math.floor((e.clientY-r.top)/r.height*N);return x>=0&&x<N&&y>=0&&y<N?y*N+x:null}
function close(){clearTimeout(flashTimer);window.removeEventListener('resize',draw);modal?.remove();modal=null;dragging=false;sync()}
function open(){
 if(modal)return;position=0;finished=false;modal=document.createElement('div');modal.className='maze-overlay';
 modal.innerHTML='<section class="maze-panel" role="dialog" aria-modal="true" aria-label="Labyrinth Tag 7"><button type="button" class="maze-close" aria-label="Schließen">×</button><div class="quest-mark">✧ ✦ ✧</div><h2>Das Labyrinth der Sterne</h2><p>Bewege die Kugel mit dem Finger bis zum Ausgang.</p><div class="maze-stage"><canvas class="maze-canvas" aria-label="Labyrinth mit beweglicher Sternenkugel"></canvas><div class="maze-flash" aria-live="off"></div></div><p class="maze-status">✦ Die Kugel wartet am Eingang.</p><button type="button" class="maze-restart">↺ Von vorn beginnen</button><div class="maze-finish" hidden><p>✦ Der Ausgang ist erreicht.</p><form class="maze-form"><label for="maze-answer">Schlüssel zur Sternenroute</label><input id="maze-answer" type="text" inputmode="numeric" autocomplete="off" required placeholder="Schlüssel eingeben"><button type="submit">✧ Sternenroute freischalten ✧</button></form><p class="maze-result" role="status"></p></div></section>';
 document.documentElement.append(modal);modal.querySelector('.maze-close').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close()});
 const canvas=modal.querySelector('canvas');
 canvas.addEventListener('pointerdown',e=>{e.preventDefault();const cell=coord(e);if(cell!==position)return;dragging=true;lastPointer=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!dragging)return;e.preventDefault();const last=lastPointer||[e.clientX,e.clientY],dx=e.clientX-last[0],dy=e.clientY-last[1],steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/Math.max(3,canvas.getBoundingClientRect().width/N*.35)));for(let i=1;i<=steps;i++){const sample={clientX:last[0]+dx*i/steps,clientY:last[1]+dy*i/steps},cell=coord(sample);if(cell!==null)move(cell)}lastPointer=[e.clientX,e.clientY]});
 const stop=()=>{dragging=false;lastPointer=null};canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
 modal.querySelector('.maze-restart').onclick=()=>{position=0;finished=false;modal.querySelector('.maze-finish').hidden=true;modal.querySelector('.maze-status').textContent='✦ Die Kugel wartet am Eingang.';modal.querySelector('.maze-flash').classList.remove('show');draw()};
 modal.querySelector('.maze-form').onsubmit=e=>{e.preventDefault();if(!finished)return;const value=modal.querySelector('#maze-answer').value.trim();if(value===String(ANSWER)){solved=true;localStorage.setItem(KEY,JSON.stringify({solved:true}));modal.querySelector('.maze-result').textContent='✦ Die Sternenroute ist freigeschaltet!';sync()}else modal.querySelector('.maze-result').textContent='Der Schlüssel stimmt noch nicht.'};
 window.addEventListener('resize',draw,{passive:true});requestAnimationFrame(draw);
}
bar.querySelector('#day7-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||solved||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse erst das Tagesrätsel, bevor du ein Sternenfeld auswählst. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
day.addEventListener('change',()=>setTimeout(sync,0));document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));
sync();
})();