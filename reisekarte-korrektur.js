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
    // Nach der letzten Entdeckung ist die gesamte Karte vollständig sichtbar.
    if (last >= 24) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>`;
    // Nur die tatsächlich gelösten Abschnitte des Schlangenwegs freigeben.
    // Reihenenden liegen unter den jeweiligen Symbolen; nächste Reihe bleibt verdeckt.
    const rows=[
      {first:1,last:4,top:10,bottom:20.2,dir:1},
      {first:5,last:8,top:21.3,bottom:31.7,dir:-1},
      {first:9,last:12,top:33.2,bottom:42.6,dir:1},
      {first:13,last:16,top:44.6,bottom:54.2,dir:-1},
      {first:17,last:20,top:56.6,bottom:66.9,dir:1},
      {first:21,last:23,top:69.3,bottom:80.8,dir:-1},
      {first:24,last:24,top:82.3,bottom:96,dir:1}
    ];
    // Alle freigelegten Bereiche sind weich abgerundete, überlappende Wolkenöffnungen.
    // Die größere Höhe schützt vollständig freigeschaltete Symbole vor Nebelresten.
    // Durchgehende Öffnung vom oberen Kartenrand bis zur aktuellen Reihe.
    // Keine getrennten Masken mehr zwischen bereits gelösten Reihen.
    const activeRow=rows.find(row=>last>=row.first && last<=row.last);
    let open='';
    // Trace the lower edge of the actual luminous route, rather than a rectangular row.
    function boundary(row){
      const pts=positions.slice(row.first-1,row.last).map(([x,y])=>[x,y+.65]).sort((a,b)=>a[0]-b[0]);
      return [[0,pts[0][1]],...pts,[100,pts[pts.length-1][1]]];
    }
    function at(pts,x){
      for(let i=1;i<pts.length;i++)if(x<=pts[i][0]){
        const [a,b]=[pts[i-1],pts[i]];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);
      }return pts.at(-1)[1];
    }
    function strip(pts,left,right,top){
      const line=[[left,at(pts,left)],...pts.filter(p=>p[0]>left&&p[0]<right),[right,at(pts,right)]];
      const rev=line.reverse();
      const rad=Math.min(4.5,(right-left)/3);
      const endY=at(pts,left),startY=at(pts,right);
      const inner=rev.filter(p=>p[0]>left+rad&&p[0]<right-rad);
      return '<path fill="black" d="M '+(left+rad)+' '+top+' L '+(right-rad)+' '+top+' Q '+right+' '+top+' '+right+' '+(top+rad)+' L '+right+' '+(startY-rad)+' Q '+right+' '+startY+' '+(right-rad)+' '+at(pts,right-rad)+' '+inner.map(p=>'L '+p.join(' ')).join(' ')+' L '+(left+rad)+' '+at(pts,left+rad)+' Q '+left+' '+endY+' '+left+' '+(endY-rad)+' L '+left+' '+(top+rad)+' Q '+left+' '+top+' '+(left+rad)+' '+top+' Z"/>';
    }
    for(const row of rows){
      const count=Math.max(0,Math.min(row.last-row.first+1,last-row.first+1));
      if(!count)continue;
      const full=count===row.last-row.first+1;
      const x=positions[row.first+count-2][0];
      const edge=row.dir===1?Math.min(100,x+10):Math.max(0,x-10);
      const left=full?0:row.dir===1?0:edge,right=full?100:row.dir===1?edge:100;
      const pts=boundary(row);
      if(full)open+=strip(pts,0,100,0);
      else open+=strip(pts,left,right,Math.max(0,row.top-8));
    }
    // Unabhängig vom Fortschritt: die beiden sitzenden Figuren unten links.
    if(last)open+='<ellipse cx="12" cy="90" rx="23" ry="13.5" fill="black"/>';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <filter id="edge" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency=".085 .12" numOctaves="4" seed="23" result="edgeNoise"/><feDisplacementMap in="SourceGraphic" in2="edgeNoise" scale="3.2" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation=".58"/>
        </filter>
        <mask id="visibility" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect width="100" height="100" fill="white"/>
          <g filter="url(#edge)">${open}</g>
        </mask>
        <!-- Multiscale turbulence produces continuous, irregular cloud masses,
             not geometric scallops or pastel circles. -->
        <filter id="cloudTexture" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".09 .13" numOctaves="6" seed="17" stitchTiles="stitch" result="clouds"/>
          <feColorMatrix in="clouds" type="saturate" values="0" result="mono"/>
          <feComponentTransfer in="mono">
            <feFuncR type="gamma" amplitude=".60" exponent="1.3" offset=".39"/>
            <feFuncG type="gamma" amplitude=".62" exponent="1.3" offset=".38"/>
            <feFuncB type="gamma" amplitude=".63" exponent="1.3" offset=".37"/>
          </feComponentTransfer>
          <feGaussianBlur stdDeviation=".10"/>
        </filter>
        <filter id="cloudDepth" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".037 .065" numOctaves="5" seed="8" result="depth"/>
          <feColorMatrix in="depth" type="saturate" values="0"/>
          <feComponentTransfer>
            <feFuncR type="linear" slope=".52" intercept=".42"/>
            <feFuncG type="linear" slope=".56" intercept=".41"/>
            <feFuncB type="linear" slope=".57" intercept=".40"/>
          </feComponentTransfer>
          <feGaussianBlur stdDeviation=".32"/>
        </filter>
        <linearGradient id="mistBase" x1="0" y1="0" x2=".2" y2="1">
          <stop stop-color="#dce3e4"/><stop offset=".35" stop-color="#f4f5f5"/>
          <stop offset=".65" stop-color="#dce2e3"/><stop offset="1" stop-color="#f0f2f2"/>
        </linearGradient>
      </defs>
      <g mask="url(#visibility)">
        <rect width="100" height="100" fill="url(#mistBase)"/>
        <rect width="100" height="100" filter="url(#cloudDepth)" opacity=".82"/>
        <rect width="100" height="100" filter="url(#cloudTexture)" opacity=".88"/>
            </g>
    </svg>`;
  }
  // Non-destructive exchange of the two illustrated scenes, using original pixels.
  let correctedArt=null;
  function swappedArt(){
    if(correctedArt)return correctedArt;
    correctedArt=new Promise((resolve,reject)=>{
      const source=new Image();
      source.onload=()=>{
        try{
          const canvas=document.createElement('canvas');canvas.width=source.naturalWidth;canvas.height=source.naturalHeight;
          const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0);
          const sx=canvas.width/1024,sy=canvas.height/1536;
          // Feathered scene polygons deliberately exclude the numbered circles and luminous path.
          const patches=[
            {dx:-255,poly:[[525,477],[550,465],[690,467],[730,482],[750,520],[766,575],[760,602],[703,608],[604,600],[595,587],[548,587],[520,596],[510,550]]},
            {dx:255,poly:[[270,478],[300,467],[445,467],[485,480],[510,516],[510,570],[500,604],[450,608],[371,601],[359,588],[315,588],[295,600],[255,586],[245,540]]}
          ];
          for(const p of patches){
            const layer=document.createElement('canvas');layer.width=canvas.width;layer.height=canvas.height;
            const l=layer.getContext('2d');
            l.save();l.scale(sx,sy);l.translate(p.dx,0);l.beginPath();
            p.poly.forEach(([x,y],i)=>i?l.lineTo(x,y):l.moveTo(x,y));l.closePath();l.fillStyle='white';l.filter='blur(5px)';l.fill();l.restore();
            l.globalCompositeOperation='source-in';l.drawImage(source,p.dx*sx,0,canvas.width,canvas.height);
            ctx.drawImage(layer,0,0);
          }
          // Restore the original numbered badges and path below the scene boundary.
          ctx.save();ctx.scale(sx,sy);ctx.beginPath();
          ctx.arc(337,614,29,0,Math.PI*2);ctx.arc(573,614,29,0,Math.PI*2);
          ctx.clip();ctx.drawImage(source,0,0,1024,1536);ctx.restore();
          resolve(canvas.toDataURL('image/png'));
        }catch(e){reject(e);}
      };source.onerror=reject;source.src='reisekarte-final.webp';
    }).catch(e=>{correctedArt=null;throw e;});
    return correctedArt;
  }
  let lastMap=null, lastPosition=null;
  function enhance() {
    const frame=document.querySelector('.storybook-screen:not([hidden]) .final-map');
    if(!frame) { lastMap=null;return; }
    if(frame===lastMap)return;
    lastMap=frame;
    const img=frame.querySelector('.final-map-art');
    if(img) {img.src='reisekarte-final.webp';img.alt='Unsere illustrierte Reisekarte mit 24 Stationen';swappedArt().then(url=>{if(img.isConnected)img.src=url;}).catch(()=>{});}
    const done=solvedDays(),last=Math.max(0,...done);
    frame.querySelectorAll('.final-map-hotspot').forEach((button,i)=>{
      if(!positions[i])return;
      const [x,y]=positions[i];button.style.left=x+'%';button.style.top=y+'%';Object.assign(button.style,{width:'19%',height:'9.5%',transform:'translate(-50%,-62%)',background:'transparent',border:'0',boxShadow:'none',pointerEvents:button.disabled?'none':'auto',cursor:button.disabled?'default':'pointer'});
      // Die existierenden Klick-Handler für die freigeschalteten Fotogalerien bleiben bestehen.
    });
    const hot=frame.querySelector('.final-map-hotspots');
    if(hot)Object.assign(hot.style,{position:'absolute',inset:'0',zIndex:'30',pointerEvents:'none'});
    if(img)img.style.pointerEvents='none';
    const fog=frame.querySelector('.final-map-fog');
    if(fog) {
      fog.style.pointerEvents='none';
      fog.style.backgroundImage=`url("data:image/svg+xml,${encodeURIComponent(fogSvg(last))}")`;
      fog.style.backgroundSize='100% 100%';
      fog.style.backgroundRepeat='no-repeat';
    }
    const couple=frame.querySelector('.final-map-couple');
    if(couple) {
      couple.style.pointerEvents='none';
      // Tatsächliche Positionen des gedruckten Pfads, nicht im freien Kartenfeld.
      // Auf der waagerechten Strecke stehen die Figuren zwischen den Zahlen.
      // Bei den Reihenwechseln stehen sie auf dem senkrechten Kurvenstück.
      const previous=last>1?positions[last-2]:[7.4,15.6];
      const current=last?positions[last-1]:[7.4,15.6];
      const sameRow=Math.abs(previous[1]-current[1])<4;
      const rest=last<=1?[7.4,9.1]:sameRow
        ?[(previous[0]+current[0])/2,(previous[1]+current[1])/2+1.2]
        :[(previous[0]+current[0])/2,(previous[1]+current[1])/2];
      // Nach dem Aufbauen der Karte erst positionieren; die alte
      // map()-Animation darf die Figuren nicht nachträglich versetzen.
      // The map is recreated on every visit. Animate the new image from
      // the preceding waypoint to the midpoint of the current segment.
      // A transition:none here previously disabled the walking entirely.
      const shouldWalk=frame.dataset.walk==='yes';
      const start=shouldWalk?(last>1?previous:[7.4,9.1]):rest;
      couple.style.transition='none';
      couple.style.left=start[0]+'%';
      couple.style.top=start[1]+'%';
      couple.style.visibility=last?'visible':'hidden';
      couple.style.width=last<=1?'9%':'13%';
      if(last===1){
        const marker=document.createElement('div');
        marker.className='final-map-start-marker';
        marker.textContent='✦ Start';
        marker.setAttribute('aria-label','Beginn unserer gemeinsamen Reise');
        Object.assign(marker.style,{position:'absolute',left:'7.4%',top:'7.7%',transform:'translate(-50%,-50%)',zIndex:'5',pointerEvents:'none',font:'bold clamp(8px,1.6vw,12px) Georgia,serif',color:'#72421e',background:'linear-gradient(#fff8df,#e7c995)',border:'1px solid #bd914c',borderRadius:'999px',padding:'2px 7px',boxShadow:'0 2px 7px #40230d55',whiteSpace:'nowrap'});
        frame.append(marker);
      }
      // Force the initial position to be committed before enabling motion.
      void couple.offsetWidth;
      requestAnimationFrame(()=>{
        if(!couple.isConnected || !shouldWalk)return;
        couple.style.transition='left 3.5s cubic-bezier(.2,.65,.2,1), top 3.5s cubic-bezier(.2,.65,.2,1)';
        couple.style.left=rest[0]+'%';
        couple.style.top=rest[1]+'%';
      });
    }
    lastPosition=last;
  }
  // Die ursprüngliche Funktion map() baut den Bildschirm neu auf.
  // Wir passen ihn danach an, ohne ihre Navigation oder Galerie-Logik zu ersetzen.
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  enhance();
})();
