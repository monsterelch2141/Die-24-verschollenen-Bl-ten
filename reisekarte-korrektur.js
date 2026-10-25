/* Reisekarte: präzise, nicht-destruktive Ergänzung zu magic-features.js.
   Originalbild und die anderen Bereiche der Website bleiben unangetastet. */
(() => {
  'use strict';
  const positions = [
    [7.4,15.6],[33.1,16.1],[55.4,16.8],[85.2,16.5],
    [91,27.5],[58.6,28.6],[34.3,28.6],[10.7,27.6],
    [8,37.5],[33,39.7],[55.9,39.5],[91.8,39.5],
    [92.7,50.3],[60.4,51.2],[31.9,51.1],[7.4,50.6],
    [7.2,61.7],[31.9,63.7],[60.4,63.5],[89.7,62.7],
    [89.7,76.4],[61.3,77.7],[28.3,76.7],[49.8,89]
  ];
  const storageKey='verschollene-blueten-geloest-v1';
  function solvedDays() {
    let solved={};
    try { solved=JSON.parse(localStorage.getItem(storageKey)||'{}')||{}; } catch(_) {}
    return positions.map((_,i)=>i+1).filter(d=>solved[d]===window.STERNEN_LOESUNGEN?.[d]);
  }
  function fogSvg(last) {
    // Exakte Schlangenlinien-Reihen: keine Öffnung in der nächsten Reihe.
    // Die erste obere Dekorzone und die untere linke Figurenillustration bleiben sichtbar.
    const rowEnds=[22,34,45,57,70,83,95];
    const rowStarts=[10,22,34,45,57,70,83];
    const count=[4,4,4,4,4,3,1];
    let cleared='<rect x="0" y="0" width="100" height="10" fill="black"/>';
    let offset=0;
    for(let row=0;row<count.length;row++){
      const n=Math.max(0,Math.min(count[row],last-offset));
      if(n===count[row]) {
        cleared+=`<rect x="0" y="${rowStarts[row]}" width="100" height="${rowEnds[row]-rowStarts[row]}" fill="black"/>`;
      } else if(n>0) {
        const first=positions[offset][0],current=positions[offset+n-1][0];
        const leftToRight=positions[offset+count[row]-1][0]>first;
        const x=leftToRight?0:Math.max(0,current-7.8);
        const width=leftToRight?Math.min(100,current+7.8):100-x;
        cleared+=`<rect x="${x}" y="${rowStarts[row]}" width="${width}" height="${rowEnds[row]-rowStarts[row]}" fill="black"/>`;
      }
      offset+=count[row];
    }
    // Figuren im Buchcover-Stil unten links sind von Beginn an sichtbar.
    cleared+='<ellipse cx="11" cy="91" rx="22" ry="12" fill="black"/>';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <mask id="fog-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="white"/>${cleared}
        </mask>
        <filter id="clouds" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".038 .095" numOctaves="5" seed="9" result="noise"/>
          <feColorMatrix in="noise" type="saturate" values="0" result="gray"/>
          <feComponentTransfer in="gray" result="cloud-alpha">
            <feFuncR type="gamma" amplitude=".42" exponent=".9" offset=".53"/>
            <feFuncG type="gamma" amplitude=".46" exponent=".9" offset=".53"/>
            <feFuncB type="gamma" amplitude=".48" exponent=".9" offset=".53"/>
          </feComponentTransfer>
        </filter>
        <linearGradient id="cloudshade" x1="0" y1="0" x2=".7" y2="1">
          <stop stop-color="#f9faf8"/><stop offset=".5" stop-color="#e5e8e6"/><stop offset="1" stop-color="#d1d9d8"/>
        </linearGradient>
      </defs>
      <g mask="url(#fog-cut)">
        <rect width="100" height="100" fill="#e8eeec"/>
        <rect width="100" height="100" fill="url(#cloudshade)" filter="url(#clouds)"/>
        <g fill="#fff" opacity=".75">
          <ellipse cx="12" cy="24" rx="25" ry="7"/><ellipse cx="42" cy="27" rx="31" ry="9"/>
          <ellipse cx="82" cy="30" rx="29" ry="8"/><ellipse cx="12" cy="48" rx="30" ry="9"/>
          <ellipse cx="55" cy="52" rx="38" ry="8"/><ellipse cx="95" cy="55" rx="28" ry="9"/>
          <ellipse cx="28" cy="76" rx="35" ry="10"/><ellipse cx="78" cy="79" rx="36" ry="10"/>
        </g>
        <g fill="#cdd8d8" opacity=".35">
          <ellipse cx="35" cy="37" rx="37" ry="6"/><ellipse cx="79" cy="65" rx="32" ry="7"/>
          <ellipse cx="46" cy="92" rx="38" ry="8"/>
        </g>
      </g>
    </svg>`;
  }
  let lastMap=null, lastPosition=null;
  function enhance() {
    const frame=document.querySelector('.storybook-screen:not([hidden]) .final-map');
    if(!frame) { lastMap=null;return; }
    if(frame===lastMap)return;
    lastMap=frame;
    const img=frame.querySelector('.final-map-art');
    if(img) {img.src='reisekarte-final.webp';img.alt='Unsere illustrierte Reisekarte mit 24 Stationen';}
    const done=solvedDays(),last=Math.max(0,...done);
    frame.querySelectorAll('.final-map-hotspot').forEach((button,i)=>{
      if(!positions[i])return;
      const [x,y]=positions[i];button.style.left=x+'%';button.style.top=y+'%';
      // Die existierenden Klick-Handler für die freigeschalteten Fotogalerien bleiben bestehen.
    });
    const fog=frame.querySelector('.final-map-fog');
    if(fog) {
      fog.style.backgroundImage=`url("data:image/svg+xml,${encodeURIComponent(fogSvg(last))}")`;
      fog.style.backgroundSize='100% 100%';
      fog.style.backgroundRepeat='no-repeat';
    }
    const couple=frame.querySelector('.final-map-couple');
    if(couple) {
      const target=last?positions[last-1]:[12,90];
      const before=last>1?positions[last-2]:[Math.max(2,target[0]-12),target[1]];
      // Zwischen zwei Stationen stehen, statt auf der aktuellen Zahl.
      const rest=[before[0]*.55+target[0]*.45,before[1]*.55+target[1]*.45];
      // Auf der ersten Anzeige steht das Paar bei der erreichten Station.
      // Bei einer neu gelösten Station läuft es von der vorherigen Station dorthin.
      const shouldWalk=lastPosition!==null && last>lastPosition;
      const previous=last>1?positions[last-2]:[12,90];
      const start=shouldWalk?previous:rest;
      couple.style.left=start[0]+'%';couple.style.top=start[1]+'%';
      if(shouldWalk)requestAnimationFrame(()=>requestAnimationFrame(()=>{
        couple.style.left=rest[0]+'%';couple.style.top=rest[1]+'%';
      }));
    }
    lastPosition=last;
  }
  // Die ursprüngliche Funktion map() baut den Bildschirm neu auf.
  // Wir passen ihn danach an, ohne ihre Navigation oder Galerie-Logik zu ersetzen.
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  enhance();
})();
