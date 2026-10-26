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
.nikolaus-figur{position:absolute;bottom:10%;left:0;width:min(32vw,160px);filter:drop-shadow(0 9px 9px #432c3866);animation:nikolaus-lauf 7.5s ease-in-out both;will-change:transform}
@keyframes nikolaus-lauf{0%{transform:translateX(-190px) translateY(0) rotate(-4deg)}15%{transform:translateX(7vw) translateY(-7px) rotate(4deg)}40%{transform:translateX(35vw) translateY(0) rotate(-3deg)}70%{transform:translateX(68vw) translateY(-9px) rotate(5deg)}100%{transform:translateX(calc(100vw + 190px)) translateY(0) rotate(-3deg)}}
@media(prefers-reduced-motion:reduce){.nikolaus-figur{animation-duration:1.5s}.nikolaus-flocke{animation-duration:3s}}
`;document.head.append(css);
function play(){
 if(running||!eligible())return;running=true;
 const layer=document.createElement('div');layer.className='nikolaus-winter';layer.setAttribute('aria-hidden','true');
 for(let i=0;i<55;i++){const flake=document.createElement('span');flake.className='nikolaus-flocke';flake.textContent=i%4===0?'✧':'❄';flake.style.left=((i*73+17)%101)+'%';flake.style.fontSize=(10+(i*13)%17)+'px';flake.style.setProperty('--dauer',(4+(i%5)*.7)+'s');flake.style.setProperty('--warte',((i%8)*.3)+'s');flake.style.setProperty('--drift',((i%2?1:-1)*(25+(i%7)*13))+'px');layer.append(flake)}
 const figure=document.createElement('div');figure.className='nikolaus-figur';
 figure.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 210" role="img" aria-label="Kleiner Nikolaus"><ellipse cx="82" cy="197" rx="62" ry="9" fill="#9fabb1" opacity=".25"/><path d="M117 85Q166 88 153 149Q143 171 114 159L106 99Z" fill="#b78a52" stroke="#7e593a" stroke-width="5"/><path d="M131 111l16 6m-16 15 16 6" stroke="#d9bc83" stroke-width="5"/><path d="M52 151L42 194 67 194 79 157M98 154L105 194 132 194 119 150" fill="#523a38" stroke="#4b302d" stroke-width="6"/><path d="M49 94Q32 129 43 166Q84 187 128 165Q135 118 111 92Z" fill="#b63d43" stroke="#80282c" stroke-width="5"/><path d="M85 92V175" stroke="#f1d7a1" stroke-width="9"/><path d="M43 156Q85 177 130 157" stroke="#e5bf73" stroke-width="10" fill="none"/><path d="M49 104Q19 114 25 148" stroke="#b63d43" stroke-width="19" fill="none" stroke-linecap="round"/><circle cx="23" cy="149" r="13" fill="#e7c8ad"/><path d="M113 102Q146 109 143 135" stroke="#b63d43" stroke-width="18" fill="none" stroke-linecap="round"/><circle cx="143" cy="137" r="12" fill="#e7c8ad"/><ellipse cx="85" cy="76" rx="37" ry="43" fill="#f1d4b5" stroke="#a67e67" stroke-width="3"/><path d="M52 78Q85 66 119 78Q116 113 84 121Q52 113 52 78Z" fill="#fff8e9"/><path d="M58 87Q86 115 112 87" fill="none" stroke="#e5d9c7" stroke-width="6"/><circle cx="72" cy="74" r="3.5" fill="#50342d"/><circle cx="99" cy="74" r="3.5" fill="#50342d"/><path d="M77 92Q85 98 94 92" fill="none" stroke="#b36b62" stroke-width="3" stroke-linecap="round"/><path d="M50 47L67 7 85 25 103 7 121 47 109 57 85 42 61 57Z" fill="#b63d43" stroke="#e8c47c" stroke-width="5"/><path d="M85 23V49" stroke="#e8c47c" stroke-width="4"/><path d="M69 36h32" stroke="#e8c47c" stroke-width="4"/></svg>';
 layer.append(figure);document.body.append(layer);
 setTimeout(()=>{layer.remove();running=false;lastVisible=eligible()},8200);
}
function check(){const yes=eligible();if(yes&&!lastVisible)play();lastVisible=yes}
const obs=new MutationObserver(check);obs.observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
document.addEventListener('change',check);document.addEventListener('click',()=>setTimeout(check,180));
window.addEventListener('pageshow',()=>setTimeout(check,300));
setTimeout(check,700);
})();