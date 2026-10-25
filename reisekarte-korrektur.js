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
    // Nur die tatsächlich gelösten Abschnitte des Schlangenwegs freigeben.
    // Reihenenden liegen unter den jeweiligen Symbolen; nächste Reihe bleibt verdeckt.
    const rows=[
      {first:1,last:4,top:10,bottom:21.3,dir:1},
      {first:5,last:8,top:21.3,bottom:33.2,dir:-1},
      {first:9,last:12,top:33.2,bottom:44.6,dir:1},
      {first:13,last:16,top:44.6,bottom:56.6,dir:-1},
      {first:17,last:20,top:56.6,bottom:69.3,dir:1},
      {first:21,last:23,top:69.3,bottom:82.3,dir:-1},
      {first:24,last:24,top:82.3,bottom:96,dir:1}
    ];
    let open='<rect width="100" height="10" fill="black"/>';
    for(const row of rows) {
      const n=Math.max(0,Math.min(row.last-row.first+1,last-row.first+1));
      if(!n)continue;
      const h=row.bottom-row.top;
      if(n===row.last-row.first+1) {
        open+=`<rect x="0" y="${row.top}" width="100" height="${h}" fill="black"/>`;
      } else {
        const x=positions[row.first+n-2][0];
        // Die Grenzlinie liegt jeweils NACH der erreichten Station.
        const edge=row.dir===1?Math.min(100,x+7):Math.max(0,x-7);
        open+=row.dir===1
          ?`<rect x="0" y="${row.top}" width="${edge}" height="${h}" fill="black"/>`
          :`<rect x="${edge}" y="${row.top}" width="${100-edge}" height="${h}" fill="black"/>`;
      }
    }
    // Unabhängig vom Fortschritt: die beiden sitzenden Figuren unten links.
    open+='<ellipse cx="12" cy="91" rx="22" ry="12" fill="black"/>';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <filter id="edge" x="-4%" y="-4%" width="108%" height="108%">
          <feGaussianBlur stdDeviation=".38"/>
        </filter>
        <mask id="visibility" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="white"/>
          <g filter="url(#edge)">${open}</g>
        </mask>
        <filter id="cloudTexture" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".065 .10" numOctaves="5" seed="12" stitchTiles="stitch"/>
          <feColorMatrix type="matrix" values="1.4 0 0 0 -.15  0 1.4 0 0 -.13  0 0 1.4 0 -.10  0 0 0 0 1"/>
        </filter>
        <linearGradient id="mistBase" x1="0" y1="0" x2=".15" y2="1">
          <stop stop-color="#e1e8e7"/><stop offset=".35" stop-color="#f9fbfa"/>
          <stop offset=".65" stop-color="#e6edeb"/><stop offset="1" stop-color="#f6f8f7"/>
        </linearGradient>
      </defs>
      <g mask="url(#visibility)">
        <rect width="100" height="100" fill="url(#mistBase)"/>
        <rect width="100" height="100" filter="url(#cloudTexture)" opacity=".30"/>
        <g opacity=".75" fill="#fff">
          <circle cx="5" cy="24" r="8"/><circle cx="14" cy="22" r="7"/>
          <circle cx="27" cy="26" r="9"/><circle cx="42" cy="24" r="8"/>
          <circle cx="55" cy="28" r="10"/><circle cx="69" cy="25" r="8"/>
          <circle cx="84" cy="29" r="10"/><circle cx="98" cy="25" r="8"/>
          <circle cx="4" cy="51" r="10"/><circle cx="19" cy="49" r="9"/>
          <circle cx="35" cy="54" r="11"/><circle cx="50" cy="50" r="9"/>
          <circle cx="66" cy="54" r="11"/><circle cx="83" cy="51" r="9"/>
          <circle cx="98" cy="55" r="10"/><circle cx="8" cy="77" r="10"/>
          <circle cx="24" cy="75" r="8"/><circle cx="40" cy="80" r="11"/>
          <circle cx="56" cy="77" r="10"/><circle cx="74" cy="80" r="11"/>
          <circle cx="91" cy="77" r="10"/><circle cx="16" cy="97" r="10"/>
          <circle cx="42" cy="96" r="11"/><circle cx="69" cy="98" r="10"/>
          <circle cx="93" cy="96" r="9"/>
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
      // Tatsächliche Positionen des gedruckten Pfads, nicht im freien Kartenfeld.
      // Auf der waagerechten Strecke stehen die Figuren zwischen den Zahlen.
      // Bei den Reihenwechseln stehen sie auf dem senkrechten Kurvenstück.
      const previous=last>1?positions[last-2]:[7.4,15.6];
      const current=last?positions[last-1]:[7.4,15.6];
      const sameRow=Math.abs(previous[1]-current[1])<4;
      const rest=last<=1?[14.5,15.8]:sameRow
        ?[(previous[0]+current[0])/2,(previous[1]+current[1])/2+1.2]
        :[(previous[0]+current[0])/2,(previous[1]+current[1])/2];
      // Nach dem Aufbauen der Karte erst positionieren; die alte
      // map()-Animation darf die Figuren nicht nachträglich versetzen.
      couple.style.transition='none';
      couple.style.left=rest[0]+'%';
      couple.style.top=rest[1]+'%';
      couple.style.visibility='visible';
    }
    lastPosition=last;
  }
  // Die ursprüngliche Funktion map() baut den Bildschirm neu auf.
  // Wir passen ihn danach an, ohne ihre Navigation oder Galerie-Logik zu ersetzen.
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  enhance();
})();
