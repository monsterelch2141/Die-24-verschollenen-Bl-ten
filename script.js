
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

  const gate = document.getElementById('password-gate');
  const page = document.getElementById('advent-page');
  const passwordForm = document.getElementById('password-form');
  const passwordInput = document.getElementById('password-input');
  const passwordError = document.getElementById('password-error');

  const revealButton = document.getElementById('reveal-all');
  const testComplete = document.getElementById('test-complete');
  const finalActions = document.getElementById('final-actions');

  const collageView = document.getElementById('collage-view');
  const collagePreview = document.getElementById('collage-preview');
  const collageStatus = document.getElementById('collage-status');
  const shareCollage = document.getElementById('share-collage');
  const downloadCollage = document.getElementById('download-collage');

  const key = 'verschollene-blueten-geloest-v1';

  let solved = {};
  let day = 1;
  let lastFocus = null;
  let allRevealed = false;
  let collageBlob = null;
  let collageUrl = null;

  testComplete.hidden = !testMode;

  // ==========================================
  // PASSWORT
  // ==========================================

  function unlockPage() {
    gate.hidden = true;
    page.hidden = false;
    document.body.classList.add('access-granted');
  }

  passwordForm.addEventListener('submit', event => {
    event.preventDefault();

    if (
      passwordInput.value.trim()
        .toLocaleLowerCase('de-DE') === 'quatsch'
    ) {
      passwordError.textContent = '';
      unlockPage();
    } else {
      passwordError.textContent =
        'Das ist leider noch nicht das richtige Geheimwort. ✧';
      passwordInput.select();
    }
  });

  // ==========================================
  // GESPEICHERTE RÄTSEL
  // ==========================================

  try {
    const stored = JSON.parse(
      localStorage.getItem(key) || '{}'
    );

    if (
      stored &&
      typeof stored === 'object' &&
      !Array.isArray(stored)
    ) {
      solved = stored;
    }
  } catch (_) {}

  function save() {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(solved)
      );
    } catch (_) {}
  }

  function solvedCount() {
    return Array.from(
      { length: 24 },
      (_, i) => i + 1
    ).filter(d => solved[d] === answers[d]).length;
  }

  function solvedFields() {
    return new Set(
      Object.keys(solved)
        .filter(d => solved[d] === answers[d])
        .map(d => solved[d])
    );
  }

  // ==========================================
  // ADVENTSFREIGABE
  // ==========================================

  function availableDays() {
    if (testMode) return 24;

    const parts = new Intl.DateTimeFormat(
      'en-GB',
      {
        timeZone: 'Europe/Berlin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    ).formatToParts(new Date());

    const values = Object.fromEntries(
      parts.map(p => [p.type, p.value])
    );

    const year = Number(values.year);
    const month = Number(values.month);
    const date = Number(values.day);

    if (
      year > 2026 ||
      (year === 2026 && month === 12 && date >= 24)
    ) {
      return 24;
    }

    if (year === 2026 && month === 12) {
      return Math.min(24, date);
    }

    return 0;
  }

  function refreshDays() {
    const max = availableDays();

    for (const option of daySelect.options) {
      const n = Number(option.value);
      option.disabled = n > max;
      option.textContent =
        `${n}. Dezember${n > max ? ' 🔒' : ''}`;
    }

    daySelect.disabled = max === 0;

    if (max === 0) {
      unlockHint.textContent =
        'Das erste Adventsrätsel öffnet sich am 1. Dezember 2026. ✧';
    } else if (testMode) {
      unlockHint.textContent =
        '✧ Testmodus: Alle 24 Tage sind zum Ausprobieren geöffnet.';
    } else {
      unlockHint.textContent = max < 24
        ? `✧ Bis zum ${max}. Dezember freigeschaltet.`
        : '✧ Alle 24 Tage sind freigeschaltet.';
    }

    if (day > max && max > 0) {
      day = max;
    }

    return max;
  }

  // ==========================================
  // POLAROID-ANZEIGE
  // ==========================================

  function showPhoto(forDay, animated = true) {
    const info = photos[forDay];

    if (!info || !info.datei) return;

    lastFocus = document.activeElement;

    photoImage.src = info.datei;
    photoImage.alt =
      `Erinnerungsfoto zum ${forDay}. Dezember`;

    photoCaption.textContent =
      info.text ||
      `Unsere Erinnerung vom ${forDay}. Dezember ♡`;

    overlay.hidden = false;
    overlay.classList.remove('legendary-play');

    void overlay.offsetWidth;

    if (animated) {
      overlay.classList.add('legendary-play');
    }

    document.body.classList.add('photo-open');
    closePhoto.focus();
  }

  function hidePhoto() {
    overlay.hidden = true;
    overlay.classList.remove('legendary-play');
    document.body.classList.remove('photo-open');
    photoImage.removeAttribute('src');

    if (lastFocus && lastFocus.isConnected) {
      lastFocus.focus();
    }
  }

  function solvedPhotoFor(code) {
    return Object.keys(solved)
      .map(Number)
      .sort((a, b) => a - b)
      .find(d =>
        solved[d] === code &&
        solved[d] === answers[d] &&
        photos[d]?.datei
      ) || null;
  }

  // ==========================================
  // SPIELFORTSCHRITT
  // ==========================================

  function updateProgress() {
    const count = solvedCount();

    progress.textContent =
      `${count} von 24 Geheimnissen gelüftet`;

    finalActions.hidden = count !== 24;
  }

  // ==========================================
  // RÄTSELRASTER
  // ==========================================

  function render() {
    const max = refreshDays();

    daySelect.value = String(day);

    previous.disabled = day <= 1 || max === 0;
    next.disabled = day >= max || max === 0;

    board.replaceChildren();

    const green = solvedFields();

    for (let row = 1; row <= 4; row++) {
      for (const col of ['A', 'B', 'C', 'D', 'E', 'F']) {
        const code = `${col}${row}`;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cell';

        button.setAttribute(
          'aria-label',
          `Feld ${code}${
            green.has(code) ? ', bereits gelöst' : ''
          }`
        );

        button.append(document.createTextNode(code));
        button.disabled = max === 0;

        const photoDay = solvedPhotoFor(code);

        if (green.has(code)) {
          button.classList.add('solved');

          if (allRevealed && photoDay) {
            button.classList.add('mini-revealed');

            const thumbnail =
              document.createElement('img');

            thumbnail.className = 'mini-photo';
            thumbnail.src = photos[photoDay].datei;
            thumbnail.alt = '';
            thumbnail.loading = 'lazy';

            button.appendChild(thumbnail);

            button.setAttribute(
              'aria-label',
              `Feld ${code}, Foto vom ${photoDay}. Dezember`
            );
          }

          const tick = document.createElement('span');
          tick.className = 'tick';
          tick.textContent = '✓';
          tick.setAttribute('aria-hidden', 'true');

          if (!allRevealed || !photoDay) {
            button.appendChild(tick);
          }
        }

        button.addEventListener('click', () => {
          if (availableDays() < day) {
            render();
            return;
          }

          if (green.has(code)) {
            const matchingDay = solvedPhotoFor(code);

            if (matchingDay) {
              // Sichtbare Miniatur: sofort öffnen.
              // Zugedecktes Feld: Animation.
              showPhoto(matchingDay, !allRevealed);
            } else {
              feedback.className = 'feedback success';
              feedback.textContent =
                '✧ Dieses Feld hast du bereits entdeckt. ✧';
            }

            return;
          }

          if (solved[day]) {
            feedback.className = 'feedback success';
            feedback.textContent =
              '✧ Dieses Tagesrätsel hast du bereits gelöst. ✧';
            return;
          }

          if (code === answers[day]) {
            solved[day] = code;
            save();

            feedback.className = 'feedback success';
            feedback.textContent =
              '✧ Richtig! Ein weiteres Geheimnis ist gelüftet. ✧';

            render();
            showPhoto(day, true);
          } else {
            button.classList.add('wrong');

            feedback.className = 'feedback error';
            feedback.textContent =
              'Noch nicht ganz – folge den Sternen erneut. ✧';
          }
        });

        board.appendChild(button);
      }
    }

    updateProgress();

    revealButton.setAttribute(
      'aria-pressed',
      String(allRevealed)
    );

    revealButton.textContent = allRevealed
      ? '✧ Wieder zudecken ✧'
      : '✧ Alles aufdecken ✧';
  }

  function setDay(value) {
    const max = refreshDays();

    if (!max) {
      render();
      return;
    }

    day = Math.max(
      1,
      Math.min(max, Number(value) || 1)
    );

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

  // ==========================================
  // ALLES AUFDECKEN
  // ==========================================

  revealButton.addEventListener('click', () => {
    if (!allRevealed) {
      const hasPhoto = Object.keys(solved).some(d =>
        solved[d] === answers[d] &&
        photos[d]?.datei
      );

      if (!hasPhoto) {
        feedback.className = 'feedback';
        feedback.textContent =
          '✧ Es gibt noch nichts zum Aufdecken. ✧';
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

  // ==========================================
  // TEST: ALLE RÄTSEL LÖSEN
  // ==========================================

  testComplete.addEventListener('click', () => {
    if (
      !testMode ||
      !confirm(
        'Alle 24 Rätsel für den Collage-Test als gelöst markieren?'
      )
    ) {
      return;
    }

    for (let i = 1; i <= 24; i++) {
      solved[i] = answers[i];
    }

    save();
    allRevealed = true;
    render();

    feedback.className = 'feedback success';
    feedback.textContent =
      '✧ Alle 24 Erinnerungen sind zum Testen freigeschaltet. ✧';
  });

  previous.addEventListener(
    'click',
    () => setDay(day - 1)
  );

  next.addEventListener(
    'click',
    () => setDay(day + 1)
  );

  daySelect.addEventListener(
    'change',
    () => setDay(daySelect.value)
  );

  closePhoto.addEventListener('click', hidePhoto);

  overlay.addEventListener('click', event => {
    if (event.target === overlay) {
      hidePhoto();
    }
  });

  document.addEventListener('keydown', event => {
    if (overlay.hidden) return;

    if (event.key === 'Escape') {
      hidePhoto();
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      closePhoto.focus();
    }
  });

  document.addEventListener(
    'visibilitychange',
    () => {
      if (!document.hidden) render();
    }
  );

  window.setInterval(() => render(), 60000);

  // ==========================================
  // BILDER FÜR DIE COLLAGE LADEN
  // ==========================================

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);

      img.onerror = () => reject(
        new Error(
          `Bild konnte nicht geladen werden: ${url}`
        )
      );

      img.src = url;
    });
  }

  function drawCover(ctx, img, x, y, w, h) {
    const ratio = Math.max(
      w / img.width,
      h / img.height
    );

    const sw = w / ratio;
    const sh = h / ratio;

    ctx.drawImage(
      img,
      (img.width - sw) / 2,
      (img.height - sh) / 2,
      sw,
      sh,
      x,
      y,
      w,
      h
    );
  }

  // ==========================================
  // FINALE ERINNERUNGSCOLLAGE
  // ==========================================

  async function createCollage() {
    const urls = Array.from(
      { length: 24 },
      (_, i) => photos[i + 1]?.datei
    );

    if (urls.some(url => !url)) {
      throw new Error(
        'Noch nicht allen 24 Tagen ist ein Foto zugeordnet.'
      );
    }

    const unique = [...new Set(urls)];

    const loaded = await Promise.all(
      unique.map(loadImage)
    );

    const images = Object.fromEntries(
      unique.map((url, i) => [url, loaded[i]])
    );

    const travelBackground = await loadImage(
      'reise-hintergrund.webp'
    );

    const canvas = document.createElement('canvas');

    canvas.width = 1500;
    canvas.height = 2000;

    const c = canvas.getContext('2d');

    const W = canvas.width;
    const H = canvas.height;

    // --------------------------------------
    // 1. ORIGINALER REISEHINTERGRUND
    // --------------------------------------

    drawCover(
      c,
      travelBackground,
      0,
      0,
      W,
      H
    );

    // --------------------------------------
    // 2. WEICHER PERGAMENT-SCHLEIER
    // --------------------------------------
    //
    // Die Illustration bleibt über die
    // gesamte Fläche sichtbar.
    //
    // Der warme Schleier beruhigt die Farben,
    // ohne einen weißen Mittelblock zu bilden.
    //

    c.fillStyle = 'rgba(255, 246, 226, 0.70)';
    c.fillRect(0, 0, W, H);

    // Sehr sanfter Helligkeitsverlauf:
    // Mitte etwas ruhiger, Ränder minimal
    // kräftiger, aber ohne sichtbare Kante.

    const softLight = c.createRadialGradient(
      W / 2,
      H / 2,
      100,
      W / 2,
      H / 2,
      1100
    );

    softLight.addColorStop(
      0,
      'rgba(255, 249, 236, 0.28)'
    );

    softLight.addColorStop(
      0.65,
      'rgba(255, 249, 236, 0.08)'
    );

    softLight.addColorStop(
      1,
      'rgba(255, 249, 236, 0)'
    );

    c.fillStyle = softLight;
    c.fillRect(0, 0, W, H);

    // --------------------------------------
    // 3. TITEL
    // --------------------------------------

    c.textAlign = 'center';
    c.textBaseline = 'middle';

    c.fillStyle = '#754522';

    c.shadowColor = 'rgba(255, 248, 233, 0.9)';
    c.shadowBlur = 12;

    // Zweizeilig, damit der vollständige
    // Adventskalender-Titel lesbar bleibt.

    c.font = '600 67px Georgia, serif';

    c.fillText(
      'Das Geheimnis der',
      W / 2,
      132
    );

    c.fillText(
      'verschollenen Blüten',
      W / 2,
      215
    );

    c.shadowBlur = 0;

    // Dezentes Ornament, kein Untertitel.

    c.fillStyle = '#a77a43';
    c.font = '30px Georgia, serif';

    c.fillText(
      '❦   ✧   ❦',
      W / 2,
      284
    );

    // --------------------------------------
    // 4. POLAROID-RASTER
    // --------------------------------------

    const cols = 4;
    const cardW = 285;
    const cardH = 232;

    const gapX = 24;
    const gapY = 24;

    const totalWidth =
      cols * cardW +
      (cols - 1) * gapX;

    const left = (W - totalWidth) / 2;
    const top = 342;

    for (let i = 0; i < 24; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const x =
        left + col * (cardW + gapX);

      const y =
        top + row * (cardH + gapY);

      // Leichte Neigung für den
      // natürlichen Polaroid-Look.

      const tilt =
        [-0.012, 0.008, -0.009, 0.011][col] +
        (row % 2 ? -0.003 : 0.003);

      c.save();

      c.translate(
        x + cardW / 2,
        y + cardH / 2
      );

      c.rotate(tilt);

      // Schatten unter dem Foto.

      c.shadowColor = 'rgba(69, 45, 28, 0.30)';
      c.shadowBlur = 15;
      c.shadowOffsetX = 0;
      c.shadowOffsetY = 7;

      // Weißer Polaroid-Rahmen.

      c.fillStyle = '#fffaf1';

      c.fillRect(
        -cardW / 2,
        -cardH / 2,
        cardW,
        cardH
      );

      c.shadowColor = 'transparent';
      c.shadowBlur = 0;
      c.shadowOffsetX = 0;
      c.shadowOffsetY = 0;

      c.strokeStyle = '#e3d6c0';
      c.lineWidth = 1;

      c.strokeRect(
        -cardW / 2,
        -cardH / 2,
        cardW,
        cardH
      );

      // Foto mit einem schmalen weißen Rand.
      // Unterhalb bleibt etwas mehr Papier,
      // aber ohne Schriftzug.

      const border = 12;

      const photoX =
        -cardW / 2 + border;

      const photoY =
        -cardH / 2 + border;

      const photoW =
        cardW - border * 2;

      const photoH =
        cardH - border * 2 - 16;

      c.save();

      c.beginPath();

      c.rect(
        photoX,
        photoY,
        photoW,
        photoH
      );

      c.clip();

      drawCover(
        c,
        images[urls[i]],
        photoX,
        photoY,
        photoW,
        photoH
      );

      c.restore();
      c.restore();
    }

    // --------------------------------------
    // 5. ABSCHLUSS
    // --------------------------------------
    //
    // Kein Untertitel.
    // Kein Schriftzug am unteren Rand.
    // Keine zusätzliche Blumenrahmung.
    //
    // Der aufgehellte Reisehintergrund
    // bildet die gesamte Collage.
    //

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(
              new Error(
                'Bild konnte nicht erstellt werden.'
              )
            );
          }
        },
        'image/png'
      );
    });
  }

  // ==========================================
  // COLLAGE ÖFFNEN
  // ==========================================

  document.getElementById(
    'open-collage'
  ).addEventListener('click', async () => {
    if (solvedCount() !== 24) return;

    page.hidden = true;
    collageView.hidden = false;

    collageStatus.hidden = false;
    collageStatus.textContent =
      'Dein Erinnerungsbild wird vorbereitet …';

    collagePreview.hidden = true;
    shareCollage.disabled = true;

    window.scrollTo(0, 0);

    try {
      // Bei jedem Öffnen neu erstellen.
      // So werden ausgetauschte Fotos
      // nicht aus einem alten Bild übernommen.

      collageBlob = await createCollage();

      if (collageUrl) {
        URL.revokeObjectURL(collageUrl);
      }

      collageUrl = URL.createObjectURL(
        collageBlob
      );

      collagePreview.src = collageUrl;
      collagePreview.hidden = false;

      downloadCollage.href = collageUrl;

      collageStatus.hidden = true;
      shareCollage.disabled = false;
    } catch (error) {
      collageStatus.hidden = false;
      collageStatus.textContent =
        error.message ||
        'Die Collage konnte nicht erstellt werden.';
    }
  });

  // ==========================================
  // ZURÜCK ZUM ADVENTSKALENDER
  // ==========================================

  document.getElementById(
    'back-collage'
  ).addEventListener('click', () => {
    collageView.hidden = true;
    page.hidden = false;

    window.scrollTo(0, 0);
  });

  // ==========================================
  // BILD AUF DEM IPHONE SICHERN
  // ==========================================

  shareCollage.addEventListener('click', async () => {
    if (!collageBlob) return;

    const file = new File(
      [collageBlob],
      'Das-Geheimnis-der-verschollenen-Blueten.png',
      { type: 'image/png' }
    );

    try {
      if (
        navigator.share &&
        navigator.canShare?.({
          files: [file]
        })
      ) {
        await navigator.share({
          files: [file],
          title:
            'Das Geheimnis der verschollenen Blüten'
        });
      } else {
        collageStatus.hidden = false;
        collageStatus.textContent =
          'Halte das Bild länger gedrückt und wähle „In Fotos sichern“ oder nutze „Bild herunterladen“.';
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        collageStatus.hidden = false;
        collageStatus.textContent =
          'Teilen nicht möglich. Halte das Bild länger gedrückt oder verwende „Bild herunterladen“.';
      }
    }
  });

  // ==========================================
  // START
  // ==========================================

  setDay(1);
})();
