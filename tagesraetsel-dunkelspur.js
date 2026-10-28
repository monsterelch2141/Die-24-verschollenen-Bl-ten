(()=>{
'use strict';
const DAY=8,KEY='advent-tag8-dunkelspur-v1',ANSWER='WELTALL',ROUTE=[137,208,314,95,421,63,178,256];
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
let solved=false;try{solved=JSON.parse(localStorage.getItem(KEY)||'{}').solved===true}catch{}
const bar=document.createElement('section');bar.className='day8-quest';bar.hidden=true;
bar.innerHTML='<div class="quest-mark">✧ ✦ ✧</div><h3>Das Schweigen der Nacht</h3><p>Ein Geheimnis wartet im Dunkeln.</p><button type="button" id="day8-open">✧ Die Dunkelheit betreten ✧</button><div id="day8-route" hidden></div>';
instruction.before(bar);
const selected=()=>Number(day.value)===DAY;
function sync(){bar.hidden=!selected();if(!selected())return;bar.querySelector('#day8-route').hidden=!solved;if(solved)bar.querySelector('#day8-route').innerHTML='<strong>Sternenroute (Testdaten)</strong><p>'+ROUTE.join(' → ')+'</p><small>Vorläufige Route zum Testen.</small>';instruction.textContent=solved?'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.'}
let overlay=null,canvas=null,ctx=null,mask=null,maskCtx=null,words=null,wordCtx=null,points=[],raf=0,active=false,resizeObserver=null;
const labels=[
 {text:'MOND',x:.23,y:.17,rot:-.13},
 {text:'STERNE',x:.76,y:.25,rot:.13},
 {text:'NACHT',x:.45,y:.39,rot:-.07},
 {text:'KOMET',x:.18,y:.58,rot:.1},
 {text:'GALAXIE',x:.75,y:.62,rot:-.12},
 {text:'PLANET',x:.37,y:.80,rot:.09},
 {text:'MILCHSTRASSE',x:.71,y:.91,rot:-.04}
];
function layout(){if(!canvas)return;const r=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));for(const c of [canvas,mask,words]){c.width=w;c.height=h}ctx=canvas.getContext('2d');maskCtx=mask.getContext('2d');wordCtx=words.getContext('2d');const scale=Math.min(w,h);wordCtx.textAlign='center';wordCtx.textBaseline='middle';labels.forEach(({text,x,y,rot})=>{wordCtx.save();wordCtx.translate(x*w,y*h);wordCtx.rotate(rot);let font=Math.min(scale*.042,w/(text.length*.75));font=Math.max(11,font);wordCtx.font='700 '+font+'px Georgia,serif';wordCtx.shadowColor='#55565c';wordCtx.shadowBlur=scale*.015;wordCtx.fillStyle='#27292e';wordCtx.strokeStyle='#777980';wordCtx.lineWidth=Math.max(1.1,font*.12);wordCtx.strokeText(text,0,0);wordCtx.fillText(text,0,0);wordCtx.restore()});render()}
function render(){if(!canvas)return;const w=canvas.width,h=canvas.height,now=performance.now(),scale=Math.min(w,h);wordCtx.clearRect(0,0,w,h);wordCtx.textAlign='center';wordCtx.textBaseline='middle';labels.forEach(({text,x,y,rot},i)=>{wordCtx.save();const t=now/1000;wordCtx.translate(Math.max(w*.17,Math.min(w*.83,x*w+Math.sin(t*(.3+i*.04)+i)*w*.085)),Math.max(h*.08,Math.min(h*.92,y*h+Math.cos(t*(.27+i*.035)+i)*h*.06)));wordCtx.rotate(rot+Math.sin(t*.25+i)*.06);const font=Math.max(11,Math.min(scale*.042,w/(text.length*.95)));wordCtx.font='700 '+font+'px Georgia,serif';wordCtx.lineJoin='round';wordCtx.lineWidth=Math.max(1.1,font*.12);wordCtx.strokeStyle='#777980';wordCtx.strokeText(text,0,0);wordCtx.fillStyle='#27292e';wordCtx.fillText(text,0,0);wordCtx.restore()});points=points.filter(p=>now-p.t<850);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#020306';ctx.fillRect(0,0,w,h);maskCtx.clearRect(0,0,w,h);
for(const p of points){const age=(now-p.t)/850,alpha=Math.pow(1-age,1.3),radius=scale*.105;const g=maskCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius);g.addColorStop(0,'rgba(255,255,255,'+alpha+')');g.addColorStop(.45,'rgba(255,255,255,'+(alpha*.75)+')');g.addColorStop(1,'rgba(255,255,255,0)');maskCtx.globalCompositeOperation='screen';maskCtx.fillStyle=g;maskCtx.fillRect(p.x-radius,p.y-radius,radius*2,radius*2)}
maskCtx.globalCompositeOperation='source-in';maskCtx.drawImage(words,0,0);maskCtx.globalCompositeOperation='source-over';ctx.drawImage(mask,0,0);
raf=requestAnimationFrame(render)}
function trail(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)*canvas.width/r.width,y=(e.clientY-r.top)*canvas.height/r.height;if(x<0||y<0||x>canvas.width||y>canvas.height)return;const last=points.at(-1),t=performance.now(),step=Math.max(4,Math.min(canvas.width,canvas.height)*.018);if(last&&t-last.t<100&&Math.hypot(x-last.x,y-last.y)>step){const dist=Math.hypot(x-last.x,y-last.y),n=Math.min(100,Math.ceil(dist/step));for(let i=1;i<=n;i++)points.push({x:last.x+(x-last.x)*i/n,y:last.y+(y-last.y)*i/n,t})}else points.push({x,y,t});if(points.length>1400)points=points.slice(-1400);if(!raf)raf=requestAnimationFrame(render)}
function close(){active=false;cancelAnimationFrame(raf);raf=0;resizeObserver?.disconnect();resizeObserver=null;overlay?.remove();overlay=null;canvas=null;points=[];document.body.classList.remove('day8-active');sync()}
function open(){if(overlay)return;overlay=document.createElement('div');overlay.className='day8-overlay';overlay.innerHTML='<div class="day8-top"><button class="day8-close" type="button" aria-label="Rätsel schließen">×</button></div><div class="day8-surface"><canvas class="day8-canvas" aria-label="Dunkle Fläche"></canvas></div><form class="day8-form"><label for="day8-answer">Lösungsbegriff</label><div class="day8-input-row"><input id="day8-answer" type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Lösungsbegriff eingeben" required><button type="submit">✧ Sternenroute freischalten ✧</button></div><p class="day8-status" role="status"></p></form>';
document.body.append(overlay);document.body.classList.add('day8-active');overlay.querySelector('.day8-close').onclick=close;
canvas=overlay.querySelector('canvas');mask=document.createElement('canvas');words=document.createElement('canvas');
canvas.addEventListener('pointerdown',e=>{e.preventDefault();active=true;canvas.setPointerCapture(e.pointerId);trail(e)});
canvas.addEventListener('pointermove',e=>{if(!active)return;e.preventDefault();trail(e)});
for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{active=false});
overlay.querySelector('.day8-form').onsubmit=e=>{e.preventDefault();const input=overlay.querySelector('#day8-answer').value.trim().toLocaleUpperCase('de-DE').replace(/[\s-]+/g,'');if(input===ANSWER){solved=true;localStorage.setItem(KEY,JSON.stringify({solved:true}));overlay.querySelector('.day8-status').textContent='✦ Die Sternenroute ist freigeschaltet.';sync()}else overlay.querySelector('.day8-status').textContent='Der Schlüssel stimmt noch nicht.'};
resizeObserver=new ResizeObserver(layout);resizeObserver.observe(canvas);requestAnimationFrame(layout)}
bar.querySelector('#day8-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||solved||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse erst das Tagesrätsel, bevor du ein Sternenfeld auswählst. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
day.addEventListener('change',()=>setTimeout(sync,0));document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));
sync();
})();