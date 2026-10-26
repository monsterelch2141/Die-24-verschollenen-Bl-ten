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
 figure.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 230" role="img" aria-label="Märchenhaft illustrierter Nikolaus mit Geschenkesack"><defs><linearGradient id="mantel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d96359"/><stop offset=".65" stop-color="#aa3d45"/><stop offset="1" stop-color="#7c3340"/></linearGradient><linearGradient id="sack" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e2c28c"/><stop offset="1" stop-color="#947049"/></linearGradient></defs><ellipse cx="96" cy="216" rx="74" ry="8" fill="#7b6657" opacity=".2"/><path d="M120 71Q154 51 172 87Q186 118 170 159Q156 184 122 164L108 100Z" fill="url(#sack)" stroke="#866347" stroke-width="3"/><path d="M132 82Q151 97 171 85M139 92Q153 107 174 100" fill="none" stroke="#f5ddb0" stroke-width="3"/><path d="M129 80l8-23 15 13 13-16 11 30" fill="#b75656" stroke="#e6c98c" stroke-width="3"/><path d="M144 58v27m-11-13h22" stroke="#edcc85" stroke-width="3"/><path d="M153 89l10-24 14 19" fill="#668e79" stroke="#f3d8a0" stroke-width="3"/><path d="M126 96Q138 82 147 94" fill="none" stroke="#6f503e" stroke-width="6"/><path d="M58 162L48 207 72 210 86 171M102 168L113 211 140 208 125 158" fill="#5c494b" stroke="#3f343a" stroke-width="5"/><path d="M46 200q15-7 29 0l2 10-35 1zm65 0q15-8 30-2l3 12-37 2z" fill="#493b3a"/><path d="M58 91Q40 119 41 172Q87 194 136 168Q140 120 115 89Z" fill="url(#mantel)" stroke="#82414a" stroke-width="4"/><path d="M89 95Q95 135 93 179" fill="none" stroke="#e9cb91" stroke-width="9"/><path d="M44 169Q93 189 136 167" fill="none" stroke="#e9cf9c" stroke-width="10"/><path d="M55 110Q28 121 26 153" fill="none" stroke="#ac444b" stroke-width="17" stroke-linecap="round"/><ellipse cx="24" cy="153" rx="11" ry="12" fill="#ebc9aa"/><path d="M119 108Q139 94 146 91" fill="none" stroke="#b24a4e" stroke-width="17" stroke-linecap="round"/><ellipse cx="146" cy="89" rx="10" ry="11" fill="#ebc9aa"/><path d="M52 59Q50 34 76 25Q110 14 125 53Q130 87 107 104Q81 119 59 94Z" fill="#e9c3a2" stroke="#ab8069" stroke-width="3"/><path d="M53 78Q65 85 73 102Q91 116 109 101Q121 88 126 73Q113 87 104 86Q88 76 75 87Q66 77 53 78Z" fill="#f9f2e5" stroke="#d6c6b4" stroke-width="2"/><path d="M72 78q5-5 11 0m19 0q5-5 11 0" stroke="#604c48" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M87 93q8 6 15-1" fill="none" stroke="#ae7367" stroke-width="3" stroke-linecap="round"/><path d="M53 50L70 9 91 29 109 9 127 49 114 57 91 44 67 58Z" fill="#a9424a" stroke="#e6c78b" stroke-width="5"/><path d="M91 28v23m-12-12h24" stroke="#e8c783" stroke-width="4"/><path d="M57 90q-6 40 0 67M120 117q10 24 7 42" stroke="#f1b8a1" stroke-width="3" opacity=".35" fill="none"/><circle cx="35" cy="179" r="3" fill="#f1dca9"/><path d="M151 45l3-8 3 8 8 3-8 3-3 8-3-8-8-3z" fill="#e4bc71"/></svg>';
 layer.append(figure);document.body.append(layer);
 setTimeout(()=>{layer.remove();running=false;lastVisible=eligible()},8200);
}
function check(){const yes=eligible();if(yes&&!lastVisible)play();lastVisible=yes}
const obs=new MutationObserver(check);obs.observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
document.addEventListener('change',check);document.addEventListener('click',()=>setTimeout(check,180));
window.addEventListener('pageshow',()=>setTimeout(check,300));
setTimeout(check,700);
})();