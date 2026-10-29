(()=>{
'use strict';
const DAY=11,KEY='advent-tag11-moire-v5',ANSWER='LUMINARA',ROUTE=[137,208,314,95,421,63,178,256];
const chars=['R','A','N','L','U','I','A','M'];
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
let solved=false;try{solved=JSON.parse(localStorage.getItem(KEY)||'{}').solved===true}catch{}
const bar=document.createElement('section');bar.className='day11-quest';bar.hidden=true;bar.innerHTML='<div class="quest-mark">◈ ✧ ◈</div><h3>Das Moiré-Geheimnis</h3><p>Ein einziges Streifenbild verbirgt acht Zeichen.</p><button type="button" class="day11-open">✧ Schablonen untersuchen ✧</button><div class="day11-route" hidden></div>';instruction.before(bar);
const selected=()=>Number(day.value)===DAY;
function sync(){bar.hidden=!selected();if(!selected())return;bar.querySelector('.day11-route').hidden=!solved;if(solved)bar.querySelector('.day11-route').innerHTML='<strong>Sternenroute (Testdaten)</strong><p>'+ROUTE.join(' → ')+'</p><small>Vorläufige Route zum Testen.</small>';instruction.textContent=solved?'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.'}
const N=400,P=8;
const glyphs=[[-100,-103,-24,-52],[18,-110,32,35],[111,-76,-39,-24],[-78,8,17,57],[69,12,-14,13],[-110,110,40,-39],[10,110,-29,47],[112,101,14,-7]];
let overlay=null,pointer=null,canvas=null,ctx=null,maskCanvas=null,maskCtx=null;
const states=[{baseX:0,baseY:0,topX:0,topY:0}];
function close(){overlay?.remove();overlay=null;document.body.classList.remove('day11-active')}
function makeMask(){maskCanvas=document.createElement('canvas');maskCanvas.width=N;maskCanvas.height=N;maskCtx=maskCanvas.getContext('2d',{willReadFrequently:true});}
function draw(){
 if(!ctx)return;
 const s=states[0],m=maskCtx;m.clearRect(0,0,N,N);m.fillStyle='#fff';m.textAlign='center';m.textBaseline='middle';m.font='bold 73px Georgia';glyphs.forEach((g,i)=>{m.save();m.translate(N/2+g[0],N/2+g[1]);m.rotate(g[2]*Math.PI/180);m.fillText(chars[i],0,0);m.restore()});
 const mask=m.getImageData(0,0,N,N).data;
 const masks=glyphs.map((g,i)=>{m.clearRect(0,0,N,N);m.save();m.translate(N/2+g[0],N/2+g[1]);m.rotate(g[2]*Math.PI/180);m.fillText(chars[i],0,0);m.restore();return m.getImageData(0,0,N,N).data});
 const img=ctx.createImageData(N,N),data=img.data;
 // Physikalische Rasterüberlagerung: In den Buchstaben verschiebt sich die Phase
 // der unteren Streifen um eine halbe Periode. Die obere Folie maskiert
 // bei richtiger Registrierung den Hintergrund, aber nicht den Buchstaben.
 const dx=s.topX-s.baseX,dy=s.topY-s.baseY;
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
 const j=(y*N+x)*4;
 let phase=0;
 for(let i=0;i<glyphs.length;i++)if(masks[i][j+3]>110){const distance=Math.abs(dx-glyphs[i][3]);phase=(P/2)*Math.max(0,1-distance/10);break}
 const lower=((x-s.baseX+phase)%P+P)%P<P/2;
 const upper=((x-s.topX)%P+P)%P<P/2;
 // Two transparent ink layers, rather than a separately drawn letter.
 const ink=(lower?0.57:0)+(upper?0.43:0);
 const v=Math.max(0,Math.round(222-ink*190));
 data[j]=Math.round(v*.95);data[j+1]=Math.round(v*.88);data[j+2]=Math.round(v*.73);data[j+3]=255;
 }
 ctx.putImageData(img,0,0);
 ctx.strokeStyle='#caa66b';ctx.lineWidth=5;ctx.strokeRect(2,2,N-4,N-4);
 
}
function render(){
 if(!overlay)return;
 
 
 draw();
}
function open(){
 if(overlay)return;overlay=document.createElement('div');overlay.className='day11-overlay';
 overlay.innerHTML='<header class="day11-top"><span>◈ Das Moiré-Geheimnis ◈</span><button type="button" class="day11-close" aria-label="Schließen">×</button></header><main class="day11-scroll"><div class="day11-intro"><h2>Das Streifenbild</h2><p>Beide Schablonen tragen nur Streifen. Verschiebe die Folien gegeneinander, bis sich die acht verstreuten Zeichen zeigen.</p><p class="day11-found"></p></div><div class="day11-stage day11-moire-stage"><canvas class="day11-canvas" width="400" height="400" aria-label="Zwei gegeneinander verschiebbare gestreifte Folien"></canvas></div><div class="day11-controls"><div class="day11-layer-controls"><button type="button" class="day11-layer active" data-layer="top">Obere Folie bewegen</button><button type="button" class="day11-layer" data-layer="base">Untere Folie bewegen</button></div><p>Ziehe mit dem Finger über das Raster. Du kannst beide Folien unabhängig voneinander bewegen.</p><p class="day11-message" role="status"></p></div><section class="day11-result"><h3>Entdeckte Zeichen</h3><div class="day11-scraps"></div><form class="day11-form" hidden><p>Setze die acht Zeichen zu einem Namen zusammen.</p><input type="text" aria-label="Lösungswort" placeholder="Lösungswort" autocomplete="off" required><button type="submit">Sternenroute freischalten</button></form><p class="day11-status" role="status"></p></section></main>';
 document.documentElement.append(overlay);document.body.classList.add('day11-active');overlay.querySelector('.day11-close').onclick=close;
 canvas=overlay.querySelector('canvas');ctx=canvas.getContext('2d');makeMask();
 
 overlay.querySelectorAll('.day11-layer').forEach(b=>b.onclick=()=>{layer=b.dataset.layer;render()});
 canvas.addEventListener('pointerdown',e=>{const s=states[active];pointer={x:e.clientX,y:e.clientY,startX:layer==='top'?s.topX:s.baseX,startY:layer==='top'?s.topY:s.baseY};canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!pointer)return;const rect=canvas.getBoundingClientRect(),s=states[active],dx=(e.clientX-pointer.x)*N/rect.width,dy=(e.clientY-pointer.y)*N/rect.height;
 if(layer==='top'){s.topX=Math.max(-70,Math.min(70,pointer.startX+dx));s.topY=Math.max(-70,Math.min(70,pointer.startY+dy))}
 else{s.baseX=Math.max(-70,Math.min(70,pointer.startX+dx));s.baseY=Math.max(-70,Math.min(70,pointer.startY+dy))}
 draw()});
 canvas.addEventListener('pointerup',()=>{pointer=null});canvas.addEventListener('pointercancel',()=>{pointer=null});
 overlay.querySelector('.day11-form').onsubmit=e=>{e.preventDefault();const val=overlay.querySelector('.day11-form input').value.toUpperCase().replace(/[^A-Z]/g,'');if(val===ANSWER){solved=true;localStorage.setItem(KEY,JSON.stringify({solved:true}));overlay.querySelector('.day11-status').textContent='✦ Die Sternenroute ist freigeschaltet.';sync()}else overlay.querySelector('.day11-status').textContent='Der Name ist noch nicht richtig zusammengesetzt.'};
 render()
}
bar.querySelector('.day11-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||solved||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse erst das Tagesrätsel, bevor du ein Sternenfeld auswählst. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
day.addEventListener('change',()=>setTimeout(sync,0));document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));sync();
})();