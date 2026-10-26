(()=>{'use strict';
const solvedKey='verschollene-blueten-geloest-v1';
const dayKey='advent-ausgewaehlter-tag-v1';
const page=document.getElementById('advent-page');
const world=document.querySelector('.storybook-screen');
if(!page)return;
let running=false,lastVisible=false;
function eligible(){
 if(page.hidden || (world&&!world.hidden) || !document.getElementById('photo-overlay')?.hidden)return false;
 const day=Number(document.getElementById('day')?.value||sessionStorage.getItem(dayKey)||1);
 if(day!==6)return false;
 try {const solved=JSON.parse(localStorage.getItem(solvedKey)||'{}');return solved[6]===window.STERNEN_LOESUNGEN?.[6]}catch{return false}
}
const css=document.createElement('style');
css.textContent=`
.nikolaus-winter{position:fixed;inset:0;z-index:8500;overflow:hidden;pointer-events:none}
.nikolaus-flocke{position:absolute;top:-35px;color:#fff;font-family:Georgia,serif;text-shadow:0 1px 5px #7395b9b0;animation:nikolaus-schnee var(--dauer) linear var(--warte) both;opacity:0}
@keyframes nikolaus-schnee{0%{transform:translate3d(0,-30px,0) rotate(0deg);opacity:0}10%{opacity:.95}90%{opacity:.95}100%{transform:translate3d(var(--drift),110vh,0) rotate(360deg);opacity:0}}
.nikolaus-figur{position:absolute;bottom:10%;left:0;width:min(39vw,190px);filter:drop-shadow(0 8px 6px #432c3850) saturate(.85);animation:nikolaus-lauf 7.5s ease-in-out both;will-change:transform}
@keyframes nikolaus-lauf{0%{transform:translateX(-190px) translateY(0) rotate(-4deg)}15%{transform:translateX(7vw) translateY(-7px) rotate(4deg)}40%{transform:translateX(35vw) translateY(0) rotate(-3deg)}70%{transform:translateX(68vw) translateY(-9px) rotate(5deg)}100%{transform:translateX(calc(100vw + 190px)) translateY(0) rotate(-3deg)}}
@media(prefers-reduced-motion:reduce){.nikolaus-figur{animation-duration:1.5s}.nikolaus-flocke{animation-duration:3s}}
`;document.head.append(css);
function play(){
 if(running||!eligible())return;running=true;
 const layer=document.createElement('div');layer.className='nikolaus-winter';layer.setAttribute('aria-hidden','true');
 for(let i=0;i<55;i++){const flake=document.createElement('span');flake.className='nikolaus-flocke';flake.textContent=i%4===0?'✧':'❄';flake.style.left=((i*73+17)%101)+'%';flake.style.fontSize=(10+(i*13)%17)+'px';flake.style.setProperty('--dauer',(4+(i%5)*.7)+'s');flake.style.setProperty('--warte',((i%8)*.3)+'s');flake.style.setProperty('--drift',((i%2?1:-1)*(25+(i%7)*13))+'px');layer.append(flake)}
 const figure=document.createElement('div');figure.className='nikolaus-figur';
 const image=document.createElement('img');
 image.src='nikolaus-freigestellt.png';
 image.alt='Nikolaus mit einem Sack voller Geschenke';
 image.style.cssText='display:block;width:100%;height:auto;';
 figure.append(image);
 layer.append(figure);document.body.append(layer);
 setTimeout(()=>{layer.remove();running=false;lastVisible=eligible()},8200);
}
function check(){const yes=eligible();if(yes&&!lastVisible)play();lastVisible=yes}
const obs=new MutationObserver(check);obs.observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
document.addEventListener('change',check);document.addEventListener('click',()=>setTimeout(check,180));
window.addEventListener('pageshow',()=>setTimeout(check,300));
setTimeout(check,700);
})();