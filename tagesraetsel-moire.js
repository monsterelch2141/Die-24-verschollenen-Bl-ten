(()=>{
'use strict';
const DAY=11,KEY='advent-tag11-moire-v1',ANSWER='LUMINARA',ROUTE=[137,208,314,95,421,63,178,256];
const seals=[{pair:'RA',angle:22,phase:15},{pair:'MI',angle:-34,phase:-18},{pair:'NU',angle:49,phase:23},{pair:'AL',angle:-13,phase:-12}];
const day=document.getElementById('day'),board=document.getElementById('board'),instruction=document.querySelector('.instruction'),feedback=document.getElementById('feedback');
if(!day||!board||!instruction)return;
let solved=false;try{solved=JSON.parse(localStorage.getItem(KEY)||'{}').solved===true}catch{}
const bar=document.createElement('section');bar.className='day11-quest';bar.hidden=true;bar.innerHTML='<div class="quest-mark">◈ ✧ ◈</div><h3>Das Moiré-Geheimnis</h3><p>Vier alte Siegel bewahren die verstreuten Silben eines vergessenen Namens.</p><button type="button" class="day11-open">✧ Die Siegel untersuchen ✧</button><div class="day11-route" hidden></div>';instruction.before(bar);
const selected=()=>Number(day.value)===DAY;
function sync(){bar.hidden=!selected();if(!selected())return;bar.querySelector('.day11-route').hidden=!solved;if(solved)bar.querySelector('.day11-route').innerHTML='<strong>Sternenroute (Testdaten)</strong><p>'+ROUTE.join(' → ')+'</p><small>Vorläufige Route zum Testen.</small>';instruction.textContent=solved?'Verbinde deine Sternenroute und wähle den richtigen Stern.':'Löse zuerst das Tagesrätsel, bevor du ein Sternenfeld auswählst.'}
let overlay=null,active=0,states=seals.map(()=>({angle:0,phase:0,found:false})),pointer=null,canvas=null,ctx=null;
function close(){overlay?.remove();overlay=null;document.body.classList.remove('day11-active')}
function angleDist(a,b){return Math.abs(((a-b+180)%360+360)%360-180)}
function match(){const s=states[active],target=seals[active];return angleDist(s.angle,target.angle)<7&&Math.abs(s.phase-target.phase)<8}
function render(){
 if(!overlay)return;
 overlay.querySelectorAll('.day11-tab').forEach((b,i)=>{b.classList.toggle('active',i===active);b.classList.toggle('found',states[i].found);b.textContent=(states[i].found?'✦ ':'◈ ')+(i+1)});
 overlay.querySelector('.day11-angle').textContent=Math.round(states[active].angle)+'°';
 overlay.querySelector('.day11-shift').textContent=Math.round(states[active].phase);
 overlay.querySelector('.day11-found').textContent=states.filter(x=>x.found).length+' von 4 Siegeln entziffert';
 const unlocked=states.every(x=>x.found);overlay.querySelector('.day11-form').hidden=!unlocked;
 overlay.querySelector('.day11-scraps').innerHTML=seals.map((x,i)=>'<span class="'+(states[i].found?'known':'')+'">'+(states[i].found?x.pair:'??')+'</span>').join(' · ');
 draw()
}
function draw(){
 if(!ctx)return;const c=canvas,w=c.width,h=c.height;ctx.clearRect(0,0,w,h);
 const state=states[active],target=seals[active],ang=(state.angle-target.angle)*Math.PI/180,offset=state.phase-target.phase,aligned=match();
 ctx.fillStyle='#152036';ctx.fillRect(0,0,w,h);
 ctx.save();ctx.beginPath();ctx.arc(w/2,h/2,w*.435,0,Math.PI*2);ctx.clip();
 // Two physically independent line gratings create a visible moire interference.
 ctx.fillStyle='#c3a36e';ctx.fillRect(0,0,w,h);
 ctx.save();ctx.translate(w/2,h/2);ctx.rotate(target.angle*Math.PI/180);ctx.fillStyle='#24334a';
 for(let x=-w*1.5;x<w*1.5;x+=9)ctx.fillRect(x,-h*2,4.5,h*4);ctx.restore();
 ctx.save();ctx.translate(w/2+offset*2,h/2);ctx.rotate(state.angle*Math.PI/180);
 ctx.globalAlpha=.77;ctx.fillStyle='#12233a';for(let x=-w*1.5;x<w*1.5;x+=9)ctx.fillRect(x,-h*2,4.5,h*4);ctx.restore();
 const strength=Math.max(0,1-angleDist(state.angle,target.angle)/15)*Math.max(0,1-Math.abs(offset)/19);
 if(strength>0){ctx.save();ctx.globalAlpha=Math.min(1,strength*1.6);ctx.fillStyle='#fff1c6';ctx.shadowColor='#fff1a2';ctx.shadowBlur=14;ctx.font='bold '+Math.round(w*.23)+'px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(target.pair,w/2,h/2);ctx.restore()}
 ctx.restore();ctx.strokeStyle='#e1c78a';ctx.lineWidth=5;ctx.beginPath();ctx.arc(w/2,h/2,w*.435,0,Math.PI*2);ctx.stroke();
 if(aligned&&!state.found){state.found=true;overlay.querySelector('.day11-message').textContent='✦ Ein verborgenes Zeichen ist erschienen!';setTimeout(()=>{if(overlay)render()},100)}
}
function open(){
 if(overlay)return;overlay=document.createElement('div');overlay.className='day11-overlay';
 overlay.innerHTML='<header class="day11-top"><span>◈ Das Moiré-Geheimnis ◈</span><button type="button" class="day11-close" aria-label="Schließen">×</button></header><main class="day11-scroll"><div class="day11-intro"><h2>Die vier Sternensiegel</h2><p>Zwei durchscheinende Schichten liegen übereinander. Doch nur in einer ganz bestimmten Stellung geben sie ihr Geheimnis preis.</p><p class="day11-found"></p></div><div class="day11-tabs"></div><div class="day11-stage"><canvas class="day11-canvas" width="560" height="560" aria-label="Verschiebbare Moiré-Schablonen"></canvas><span class="day11-stage-mark">✧</span></div><div class="day11-controls"><div class="day11-readouts"><span>Drehung: <b class="day11-angle"></b></span><span>Versatz: <b class="day11-shift"></b></span></div><label>Schablone drehen <input class="day11-rotate" type="range" min="-90" max="90" step="1" value="0"></label><label>Schablone verschieben <input class="day11-slide" type="range" min="-40" max="40" step="1" value="0"></label><p>Du kannst die Schablone auch mit dem Finger seitlich verschieben. Die Drehung erfolgt über den Regler.</p><p class="day11-message" role="status"></p></div><section class="day11-result"><h3>Geborgene Schriftstücke</h3><div class="day11-scraps"></div><form class="day11-form" hidden><p>Die Zeichen sind durcheinandergeraten. Welcher Name verbirgt sich darin?</p><input type="text" aria-label="Lösungswort" placeholder="Lösungswort" autocomplete="off" required><button type="submit">Sternenroute freischalten</button></form><p class="day11-status" role="status"></p></section></main>';
 document.documentElement.append(overlay);document.body.classList.add('day11-active');
 overlay.querySelector('.day11-close').onclick=close;canvas=overlay.querySelector('canvas');ctx=canvas.getContext('2d');
 const tabs=overlay.querySelector('.day11-tabs');seals.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.className='day11-tab';b.onclick=()=>{active=i;overlay.querySelector('.day11-message').textContent='';updateControls();render()};tabs.append(b)});
 const rot=overlay.querySelector('.day11-rotate'),slide=overlay.querySelector('.day11-slide');
 rot.oninput=()=>{states[active].angle=Number(rot.value);render()};slide.oninput=()=>{states[active].phase=Number(slide.value);render()};
 function updateControls(){rot.value=states[active].angle;slide.value=states[active].phase}
 canvas.addEventListener('pointerdown',e=>{pointer={x:e.clientX,phase:states[active].phase};canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!pointer)return;const width=canvas.getBoundingClientRect().width;states[active].phase=Math.max(-40,Math.min(40,Math.round(pointer.phase+(e.clientX-pointer.x)*80/width)));slide.value=states[active].phase;render()});
 canvas.addEventListener('pointerup',()=>{pointer=null});canvas.addEventListener('pointercancel',()=>{pointer=null});
 overlay.querySelector('.day11-form').onsubmit=e=>{e.preventDefault();const val=overlay.querySelector('.day11-form input').value.toUpperCase().replace(/[^A-Z]/g,'');if(val===ANSWER){solved=true;localStorage.setItem(KEY,JSON.stringify({solved:true}));overlay.querySelector('.day11-status').textContent='✦ Die Sternenroute ist freigeschaltet.';sync()}else overlay.querySelector('.day11-status').textContent='Der Name ist noch nicht richtig zusammengesetzt.'};
 updateControls();render()
}
bar.querySelector('.day11-open').onclick=open;
board.addEventListener('click',e=>{if(!selected()||solved||!e.target.closest('.cell'))return;e.stopImmediatePropagation();e.preventDefault();feedback.className='feedback error';feedback.textContent='✧ Löse erst das Tagesrätsel, bevor du ein Sternenfeld auswählst. ✧';bar.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
day.addEventListener('change',()=>setTimeout(sync,0));document.getElementById('previous')?.addEventListener('click',()=>setTimeout(sync,0));document.getElementById('next')?.addEventListener('click',()=>setTimeout(sync,0));sync();
})();