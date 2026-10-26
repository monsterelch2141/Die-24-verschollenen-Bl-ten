(() => {
  'use strict';
  const answers = window.STERNEN_LOESUNGEN || {};
  const photos = window.ADVENT_FOTOS || {};
  const testMode = window.ADVENT_TESTMODUS === true;
  const daySelect = document.getElementById('day');
  const board = document.getElementById('board');
  const feedback = document.getElementById('feedback');
  const progress = document.getElementById('progress');
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  const overlay = document.getElementById('photo-overlay');
  const photoImage = document.getElementById('photo-image');
  const photoCaption = document.getElementById('photo-caption');
  const closePhoto = document.getElementById('close-photo');
  const unlockHint = document.getElementById('unlock-hint');
  const key = 'verschollene-blueten-geloest-v1';
  const gate = document.getElementById('password-gate');
  const page = document.getElementById('advent-page');
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('password-input');
  const passwordError = document.getElementById('password-error');
  // Nur eine spielerische Zugangssperre: In statischen GitHub-Seiten
  // sind Passwort und Dateien technisch öffentlich einsehbar.
  // Zugang gilt für diese Browser-Sitzung; bei neuer Sitzung erneut Passwort.
  function unlockPage() {
    gate.hidden = true;
    page.hidden = false;
    document.body.classList.add('access-granted');
    try { sessionStorage.setItem('advent-zugang-frei', '1'); } catch (_) {}
  }
  try { if (sessionStorage.getItem('advent-zugang-frei') === '1') unlockPage(); } catch (_) {}
  passwordForm.addEventListener('submit', event => {
    event.preventDefault();
    if (passwordInput.value.trim().toLocaleLowerCase('de-DE') === 'quatsch') {
      passwordError.textContent = '';
      unlockPage();
    } else {
      passwordError.textContent = 'Das ist leider noch nicht das richtige Geheimwort. ✧';
      passwordInput.select();
    }
  });
  let solved = {};
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '{}');
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) solved = stored;
  } catch (_) {}
  let day = 1;
  let lastFocus = null;
  let allRevealed = false;
  const revealButton = document.getElementById('reveal-all');
  const testComplete = document.getElementById('test-complete');
  testComplete.hidden = !testMode;
  const testReset = document.getElementById('test-reset');
  if (testReset) testReset.hidden = !testMode;

  function availableDays() {
    // Deutsche Zeit, unabhängig von der eingestellten Geräte-Zeitzone.
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
    const year = Number(values.year), month = Number(values.month), date = Number(values.day);
    if (year > 2026 || (year === 2026 && month === 12 && date >= 24)) return 24;
    if (year === 2026 && month === 12) return Math.min(24, date);
    // Testmodus öffnet vor dem Advent die Tage 1 bis 10.
    return testMode && year <= 2026 ? 24 : 0;
  }

  function save() {
    try { localStorage.setItem(key, JSON.stringify(solved)); } catch (_) {}
  }

  function solvedFields() {
    // Bereits gelöste Felder sind auf ALLEN Tagen grün.
    return new Set(Object.values(solved).filter(value => typeof value === 'string'));
  }

  function showPhoto(forDay, animated = true) {
    const info = photos[forDay];
    if (!info || !info.datei) return;
    lastFocus = document.activeElement;
    photoImage.src = info.datei;
    photoImage.alt = `Erinnerungsfoto zum ${forDay}. Dezember`;
    photoCaption.textContent = info.text || `Unsere Erinnerung vom ${forDay}. Dezember ♡`;
    overlay.hidden = false;
    overlay.classList.remove('legendary-play');
    void overlay.offsetWidth;
    if (animated) overlay.classList.add('legendary-play');
    document.body.classList.add('photo-open');
    closePhoto.focus();
  }

  function hidePhoto() {
    overlay.hidden = true;
    overlay.classList.remove('legendary-play');
    document.body.classList.remove('photo-open');
    photoImage.removeAttribute('src');
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
  }

  function solvedPhotoFor(code) {
    const matching = Object.keys(solved)
      .map(Number)
      .sort((a, b) => a - b)
      .find(d => solved[d] === code && solved[d] === answers[d] && photos[d]?.datei);
    return matching || null;
  }

  function updateProgress() {
    const count = Object.keys(solved).filter(d => solved[d] === answers[d]).length;
    progress.textContent = `${count} von 24 Geheimnissen gelüftet`;
    document.getElementById('final-actions').hidden = count !== 24;
  }

  function refreshDays() {
    const max = availableDays();
    for (const option of daySelect.options) {
      const n = Number(option.value);
      option.disabled = n > max;
      option.textContent = `${n}. Dezember${n > max ? ' 🔒' : ''}`;
    }
    daySelect.disabled = max === 0;
    if (max === 0) {
      unlockHint.textContent = 'Das erste Adventsrätsel öffnet sich am 1. Dezember 2026. ✧';
    } else if (testMode && new Date().getFullYear() <= 2026 && max === 24) {
      unlockHint.textContent = '✧ Testmodus: Alle 24 Tage sind zum Ausprobieren geöffnet.';
    } else {
      unlockHint.textContent = max < 24 ? `✧ Bis zum ${max}. Dezember freigeschaltet.` : '✧ Alle 24 Tage sind freigeschaltet.';
    }
    if (day > max && max > 0) day = max;
    return max;
  }

  function render() {
    const max = refreshDays();
    daySelect.value = String(day);
    previous.disabled = day <= 1 || max === 0;
    next.disabled = day >= max || max === 0;
    board.replaceChildren();
    const green = solvedFields();
    for (let row = 1; row <= 4; row++) {
      for (const col of ['A','B','C','D','E','F']) {
        const code = `${col}${row}`;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cell';
        button.setAttribute('aria-label', `Feld ${code}${green.has(code) ? ', bereits gelöst' : ''}`);
        button.append(document.createTextNode(code));
        button.disabled = max === 0;
        const photoDay = solvedPhotoFor(code);
        if (green.has(code)) {
          button.classList.add('solved');
          if (allRevealed && photoDay) {
            button.classList.add('mini-revealed');
            const thumbnail = document.createElement('img');
            thumbnail.className = 'mini-photo';
            thumbnail.src = photos[photoDay].datei;
            thumbnail.alt = '';
            thumbnail.loading = 'lazy';
            button.appendChild(thumbnail);
            button.setAttribute('aria-label', `Feld ${code}, Foto vom ${photoDay}. Dezember`);
          }
          const tick = document.createElement('span');
          tick.className = 'tick';
          tick.textContent = '✓';
          tick.setAttribute('aria-hidden', 'true');
          if (!allRevealed || !photoDay) button.appendChild(tick);
        }
        button.addEventListener('click', () => {
          if (availableDays() < day) { render(); return; }
          // Das grüne Feld kann auf jedem Tag erneut angetippt werden.
          if (green.has(code)) {
            const matchingDay = solvedPhotoFor(code);
            if (matchingDay) showPhoto(matchingDay, !allRevealed);
            else {
              feedback.className = 'feedback success';
              feedback.textContent = '✧ Dieses Feld hast du bereits entdeckt. ✧';
            }
            return;
          }
          if (solved[day]) {
            feedback.className = 'feedback success';
            feedback.textContent = '✧ Dieses Tagesrätsel hast du bereits gelöst. ✧';
            return;
          }
          if (code === answers[day]) {
            solved[day] = code;
            save();
            feedback.className = 'feedback success';
            feedback.textContent = '✧ Richtig! Ein weiteres Geheimnis ist gelüftet. ✧';
            render();
            showPhoto(day);
          } else {
            button.classList.add('wrong');
            feedback.className = 'feedback error';
            feedback.textContent = 'Noch nicht ganz – folge den Sternen erneut. ✧';
          }
        });
        board.appendChild(button);
      }
    }
    updateProgress();
    revealButton.setAttribute('aria-pressed', String(allRevealed));
    revealButton.textContent = allRevealed ? '✧ Wieder zudecken ✧' : '✧ Alles aufdecken ✧';
  }

  function setDay(value) {
    const max = refreshDays();
    if (!max) { render(); return; }
    day = Math.max(1, Math.min(max, Number(value) || 1));
    feedback.className = 'feedback';
    feedback.textContent = solved[day]
      ? '✧ Dieses Geheimnis hast du bereits gelüftet. ✧'
      : '✧ Die Sterne warten auf deine Entdeckung. ✧';
    render();
  }

  for (let i = 1; i <= 24; i++) {
    const option = document.createElement('option');
    option.value = String(i);
    daySelect.appendChild(option);
  }
  revealButton.addEventListener('click', () => {
    if (!allRevealed) {
      const hasPhoto = Object.keys(solved).some(d =>
        solved[d] === answers[d] && photos[d]?.datei
      );
      if (!hasPhoto) {
        feedback.className = 'feedback';
        feedback.textContent = '✧ Es gibt noch nichts zum Aufdecken. ✧';
        return;
      }
    }
    allRevealed = !allRevealed;
    render();
    feedback.className = 'feedback success';
    feedback.textContent = allRevealed
      ? '✧ Deine bisherigen Erinnerungen sind aufgedeckt. ✧'
      : '✧ Die Erinnerungen sind wieder zugedeckt. ✧';
  });

  testComplete.addEventListener('click', () => {
    if (!testMode || !confirm('Alle 24 Rätsel für den Collage-Test als gelöst markieren?')) return;
    for (let i=1; i<=24; i++) solved[i] = answers[i];
    save(); allRevealed = true; render();
    feedback.className = 'feedback success';
    feedback.textContent = '✧ Alle 24 Erinnerungen sind zum Testen freigeschaltet. ✧';
  });

  if (testReset) testReset.addEventListener('click', () => {
    if (!testMode || !confirm('Testfortschritt vollständig zurücksetzen? Alle grünen Felder, die Reisekarte und die Blumenvase beginnen wieder bei null.')) return;
    solved = {};
    try { localStorage.removeItem(key); localStorage.removeItem('advent_blumen_gefunden'); } catch (_) {}
    allRevealed = false;
    day = 1;
    if (!overlay.hidden) hidePhoto();
    feedback.className = 'feedback';
    feedback.textContent = '✧ Zurück am Anfang unserer Reise. ✧';
    render();
    // Die Reise- und Blumenansichten lesen denselben gespeicherten Fortschritt.
    // Ein vollständiger Neustart setzt auch eventuell noch offene Ansichten zurück.
    location.reload();
  });

  previous.addEventListener('click' , () => setDay(day - 1));
  next.addEventListener('click', () => setDay(day + 1));
  daySelect.addEventListener('change', () => setDay(daySelect.value));
  closePhoto.addEventListener('click', hidePhoto);
  overlay.addEventListener('click', event => { if (event.target === overlay) hidePhoto(); });
  document.addEventListener('keydown', event => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') hidePhoto();
    if (event.key === 'Tab') { event.preventDefault(); closePhoto.focus(); }
  });
  // Falls die Seite über Mitternacht geöffnet bleibt, wird die Tagesfreigabe aktualisiert.
  document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
  window.setInterval(() => render(), 60000);
  const collageView = document.getElementById('collage-view');
  const collagePreview = document.getElementById('collage-preview');
  const collageStatus = document.getElementById('collage-status');
  const shareCollage = document.getElementById('share-collage');
  const downloadCollage = document.getElementById('download-collage');
  let collageBlob = null;
  let collageUrl = null;

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Foto konnte nicht geladen werden: ${url}`));
      img.src = url;
    });
  }

  function roundedRect(ctx,x,y,w,h,r) {
    ctx.beginPath(); ctx.roundRect(x,y,w,h,r);
  }
  function drawCover(ctx,img,x,y,w,h) {
    const ratio=Math.max(w/img.width,h/img.height);
    const sw=w/ratio,sh=h/ratio;
    ctx.drawImage(img,(img.width-sw)/2,(img.height-sh)/2,sw,sh,x,y,w,h);
  }
  function flower(ctx,x,y,scale=1) {
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
    ctx.fillStyle='#d5a9a1';
    for(let p=0;p<5;p++) {
      ctx.rotate(Math.PI*2/5);ctx.beginPath();ctx.ellipse(0,-16,10,18,0,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='#c79a4e';ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  function leaf(ctx,x,y,rotation) {
    ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.fillStyle='#9aab83';
    ctx.beginPath();ctx.ellipse(0,0,9,20,.4,0,Math.PI*2);ctx.fill();ctx.restore();
  }
  // Eine zusätzliche, weiche Illustration in der Mitte und am unteren Rand:
  // Alle Ausschnitte stammen aus dem vorhandenen Reisehintergrund.
  function drawSoftMotif(ctx, source, sx, sy, sw, sh, dx, dy, dw, dh, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    const buffer = document.createElement('canvas');
    buffer.width = Math.round(dw);
    buffer.height = Math.round(dh);
    const b = buffer.getContext('2d');
    b.drawImage(source, sx, sy, sw, sh, 0, 0, buffer.width, buffer.height);
    b.globalCompositeOperation = 'destination-in';
    const fade = b.createRadialGradient(buffer.width/2, buffer.height/2, buffer.width*.06,
                                         buffer.width/2, buffer.height/2, Math.max(buffer.width,buffer.height)*.60);
    fade.addColorStop(0,'rgba(0,0,0,1)');
    fade.addColorStop(.55,'rgba(0,0,0,.78)');
    fade.addColorStop(1,'rgba(0,0,0,0)');
    b.fillStyle = fade;
    b.fillRect(0,0,buffer.width,buffer.height);
    ctx.drawImage(buffer,dx,dy,dw,dh);
    ctx.restore();
  }

  async function createCollage() {
    const urls = Array.from({length:24},(_,i)=>photos[i+1]?.datei);
    if(urls.some(url=>!url)) throw new Error('Noch nicht allen 24 Tagen ist ein Foto zugeordnet.');
    const unique=[...new Set(urls)];
    const loaded=await Promise.all(unique.map(loadImage));
    const images=Object.fromEntries(unique.map((url,i)=>[url,loaded[i]]));
    // Eigenständiges vollflächiges Reisebild, nicht nur dekorierte Ränder.
    const travelBackground=await loadImage('collage-reise-maerchenhaft.webp');
    const canvas=document.createElement('canvas');
    canvas.width=1500;canvas.height=2000;
    const c=canvas.getContext('2d');
    const W=canvas.width,H=canvas.height;
    drawCover(c,travelBackground,0,0,W,H);
    // Der Pergamentschleier ist bereits gleichmäßig in der Bilddatei enthalten.
    // Keine zusätzliche Aufhellung, die Titel oder Zwischenräume verfälscht.

    c.textAlign='center';c.textBaseline='middle';
    c.fillStyle='#754522';c.shadowColor='rgba(255,248,233,.9)';c.shadowBlur=12;
    c.font='600 67px Georgia,serif';
    c.fillText('Das Geheimnis der',W/2,132);
    c.fillText('verschollenen Blüten',W/2,215);
    c.shadowBlur=0;
    c.fillStyle='#a77a43';c.font='30px Georgia,serif';
    c.fillText('❦   ✧   ❦',W/2,284);

    const cols=4,cardW=285,cardH=232,gapX=24,gapY=24;
    const left=(W-(cols*cardW+(cols-1)*gapX))/2,top=342;
    for(let i=0;i<24;i++) {
      const row=Math.floor(i/cols),col=i%cols;
      const x=left+col*(cardW+gapX),y=top+row*(cardH+gapY);
      const tilt=([-0.012,.008,-.009,.011][col]+(row%2?-.003:.003));
      c.save();c.translate(x+cardW/2,y+cardH/2);c.rotate(tilt);
      c.shadowColor='rgba(69,45,28,.30)';c.shadowBlur=15;c.shadowOffsetY=7;
      c.fillStyle='#fffaf1';c.fillRect(-cardW/2,-cardH/2,cardW,cardH);
      c.shadowColor='transparent';c.shadowBlur=0;c.shadowOffsetY=0;
      c.strokeStyle='#e3d6c0';c.lineWidth=1;c.strokeRect(-cardW/2,-cardH/2,cardW,cardH);
      const border=12;
      const px=-cardW/2+border,py=-cardH/2+border;
      const pw=cardW-border*2,ph=cardH-border*2-16;
      c.save();c.beginPath();c.rect(px,py,pw,ph);c.clip();
      drawCover(c,images[urls[i]],px,py,pw,ph);
      c.restore();c.restore();
    }
    return await new Promise((resolve,reject)=>canvas.toBlob(
      b=>b?resolve(b):reject(new Error('Bild konnte nicht erstellt werden.')),'image/png'));
  }

  document.getElementById('open-collage').addEventListener('click', async () => {
    const count=Object.keys(solved).filter(d=>solved[d]===answers[d]).length;
    if(count!==24) return;
    page.hidden=true;collageView.hidden=false;
    collageStatus.hidden=false;collageStatus.textContent='Dein Erinnerungsbild wird vorbereitet …';
    collagePreview.hidden=true;shareCollage.disabled=true;
    window.scrollTo(0,0);
    try {
      collageBlob=await createCollage();
      if(collageUrl) URL.revokeObjectURL(collageUrl);
      collageUrl=URL.createObjectURL(collageBlob);
      collagePreview.src=collageUrl;collagePreview.hidden=false;
      downloadCollage.href=collageUrl;
      collageStatus.hidden=true;shareCollage.disabled=false;
    } catch(error) {
      collageStatus.textContent=error.message;
    }
  });
  document.getElementById('back-collage').addEventListener('click',()=>{
    collageView.hidden=true;page.hidden=false;window.scrollTo(0,0);
  });
  shareCollage.addEventListener('click',async()=>{
    if(!collageBlob)return;
    const file=new File([collageBlob],'Das-Geheimnis-der-verschollenen-Blueten.png',{type:'image/png'});
    try {
      if(navigator.share && navigator.canShare?.({files:[file]})) {
        await navigator.share({files:[file],title:'Das Geheimnis der verschollenen Blüten'});
      } else {
        collageStatus.hidden=false;
        collageStatus.textContent='Tippe länger auf das Bild und wähle „In Fotos sichern“ oder nutze „Bild herunterladen“.';
      }
    } catch(error) {
      if(error.name!=='AbortError') {
        collageStatus.hidden=false;
        collageStatus.textContent='Teilen nicht möglich. Halte das Bild länger gedrückt oder verwende „Bild herunterladen“.';
      }
    }
  });

  setDay(1);
})();
