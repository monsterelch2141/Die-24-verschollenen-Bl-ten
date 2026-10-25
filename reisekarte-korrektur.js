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
    const seen=positions.slice(0,last);
    const points=seen.map(([x,y])=>`${x},${y}`).join(' ');
    const trail=seen.length>1?`<polyline points="${points}" stroke="black" stroke-width="17" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`:'';
    const clear=seen.map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="10" ry="7.8" fill="black"/>`).join('');
    // SVG-Maske: Weiß = Nebel, Schwarz = freie Sicht. Ein durchgehender
    // Nebelteppich, keine einzeln aufgesetzten Wolkenflecken.
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <mask id="fog-cut"><rect width="100" height="100" fill="white"/>
          <ellipse cx="10" cy="89" rx="23" ry="13" fill="black"/>
          ${trail}${clear}
        </mask>
        <radialGradient id="mist" cx="50%" cy="40%" r="80%">
          <stop stop-color="#f4f6f4"/><stop offset=".6" stop-color="#e6ebeb"/><stop offset="1" stop-color="#d1dbdc"/>
        </radialGradient>
      </defs>
      <g mask="url(#fog-cut)">
        <rect width="100" height="100" fill="url(#mist)"/>
        <path d="M-20 15 Q20 5 60 18 T120 10 M-20 42 Q20 33 60 46 T120 38 M-20 70 Q20 60 60 75 T120 68 M-20 93 Q20 85 60 96 T120 89" stroke="#fff" stroke-opacity=".3" stroke-width="12" fill="none"/>
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
      // Auf der ersten Anzeige steht das Paar bei der erreichten Station.
      // Bei einer neu gelösten Station läuft es von der vorherigen Station dorthin.
      const shouldWalk=lastPosition!==null && last>lastPosition;
      const previous=last>1?positions[last-2]:[12,90];
      const start=shouldWalk?previous:target;
      couple.style.left=start[0]+'%';couple.style.top=start[1]+'%';
      if(shouldWalk)requestAnimationFrame(()=>requestAnimationFrame(()=>{
        couple.style.left=target[0]+'%';couple.style.top=target[1]+'%';
      }));
    }
    lastPosition=last;
  }
  // Die ursprüngliche Funktion map() baut den Bildschirm neu auf.
  // Wir passen ihn danach an, ohne ihre Navigation oder Galerie-Logik zu ersetzen.
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  enhance();
})();
