
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

  // Passwort wird bei jedem Seitenaufruf abgefragt.
  // Auf GitHub Pages ist es nur eine spielerische Sperre.
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

  let solved = {};

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

  let day = 1;
  let lastFocus = null;
  let allRevealed = false;

  const revealButton =
    document.getElementById('reveal-all');

  const testComplete =
    document.getElementById('test-complete');

  testComplete.hidden = !testMode;

  // =========================================
  // TAGESFREIGABE
  // =========================================

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

  function save() {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(solved)
      );
    } catch (_) {}
  }

  function solvedFields() {
    return new Set(
      Object.values(solved).filter(
        value => typeof value === 'string'
      )
    );
  }

  // =========================================
  // POLAROID-FOTOS
  // =========================================

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
    const matching = Object.keys(solved)
      .map(Number)
      .sort((a, b) => a - b)
      .find(
        d =>
          solved[d] === code &&
          solved[d] === answers[d] &&
          photos[d]?.datei
      );

    return matching || null;
  }

  // =========================================
  // SPIELFORTSCHRITT
  // =========================================

  function updateProgress() {
    const count = Object.keys(solved).filter(
      d => solved[d] === answers[d]
    ).length;

    progress.textContent =
      `${count} von 24 Geheimnissen gelüftet`;

    document.getElementById(
      'final-actions'
    ).hidden = count !== 24;
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
      unlockHint.textContent =
        max < 24
          ? `✧ Bis zum ${max}. Dezember freigeschaltet.`
          : '✧ Alle 24 Tage sind freigeschaltet.';
    }

    if (day > max && max > 0) {
      day = max;
    }

    return max;
  }

  // =========================================
  // RÄTSELRASTER
  // =========================================

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

          // Aufgedeckte Fotos öffnen ohne Animation.
          if (green.has(code)) {
            const matchingDay = solvedPhotoFor(code);

            if (matchingDay) {
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

  // =========================================
  // ALLE FOTOS AUFDECKEN
  // =========================================

  revealButton.addEventListener('click', () => {
    if (!allRevealed) {
      const hasPhoto = Object.keys(solved).some(
        d =>
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

  // =========================================
  // TEST: ALLE 24 RÄTSEL LÖSEN
  // =========================================

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

  // =========================================
  // ERINNERUNGSCOLLAGE
  // =========================================

  const collageView =
    document.getElementById('collage-view');

  const collagePreview =
    document.getElementById('collage-preview');

  const collageStatus =
    document.getElementById('collage-status');

  const shareCollage =
    document.getElementById('share-collage');

  const downloadCollage =
    document.getElementById('download-collage');

  let collageBlob = null;
  let collageUrl = null;

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);

      img.onerror = () => reject(
        new Error(
          `Foto konnte nicht geladen werden: ${url}`
        )
      );

      img.src = url;
    });
  }

  // Zeichnet ein Bild ohne Verzerrung.
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

  // =========================================
  // NEUE COLLAGE MIT REISEHINTERGRUND
  // =========================================

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
      unique.map(
        (url, i) => [url, loaded[i]]
      )
    );

    // Originaler Hintergrund aus deinem Buchcover.
    const travelBackground = await loadImage(
      'reise-hintergrund.webp'
    );

    const canvas = document.createElement('canvas');

    // Hochauflösendes Hochformat.
    canvas.width = 1500;
    canvas.height = 2000;

    const c = canvas.getContext('2d');

    const W = 1500;
    const H = 2000;

    // Originalillustration als Hintergrund.
    drawCover(
      c,
      travelBackground,
      0,
      0,
      W,
      H
    );

    // =====================================
    // TITEL
    // =====================================

    c.textAlign = 'center';
    c.fillStyle = '#78451f';

    c.shadowColor = '#fff8e6';
    c.shadowBlur = 14;

    c.font = 'bold 68px Georgia, serif';

    c.fillText(
      '24 Blüten, eine Liebe',
      W / 2,
      242
    );

    c.font = 'italic 30px Georgia, serif';

    c.fillText(
      'Unsere schönsten Erinnerungen',
      W / 2,
      293
    );

    c.shadowBlur = 0;
    c.fillStyle = '#b68a4b';

    c.font = '32px Georgia, serif';

    c.fillText(
      '❦  ✧  ❦',
      W / 2,
      335
    );

    // =====================================
    // 24 POLAROID-FOTOS
    // =====================================

    const cols = 4;

    const cardW = 195;
    const cardH = 222;

    const gapX = 16;
    const gapY = 18;

    const left = (
      W -
      (
        cols * cardW +
        (cols - 1) * gapX
      )
    ) / 2;

    const top = 380;

    for (let i = 0; i < 24; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;

      const x = left + col * (cardW + gapX);
      const y = top + row * (cardH + gapY);

      // Minimale Neigung für den Polaroid-Stil.
      const tilt = (
        [-0.012, 0.009, -0.008, 0.012][col] +
        (row % 2 ? -0.003 : 0.003)
      );

      c.save();

      c.translate(
        x + cardW / 2,
        y + cardH / 2
      );

      c.rotate(tilt);

      // Schatten.
      c.shadowColor = '#3e261d66';
      c.shadowBlur = 11;
      c.shadowOffsetY = 5;

      // Weißes Polaroid.
      c.fillStyle = '#fffaf1';

      c.fillRect(
        -cardW / 2,
        -cardH / 2,
        cardW,
        cardH
      );

      c.shadowColor = 'transparent';
      c.shadowBlur = 0;
      c.shadowOffsetY = 0;

      // Feiner Papierrand.
      c.strokeStyle = '#dfd1b8';
      c.lineWidth = 1;

      c.strokeRect(
        -cardW / 2,
        -cardH / 2,
        cardW,
        cardH
      );

      // Bildfläche.
      const border = 9;

      const imageH =
        cardH - border * 2 - 13;

      c.save();
      c.beginPath();

      c.rect(
        -cardW / 2 + border,
        -cardH / 2 + border,
        cardW - border * 2,
        imageH
      );

      c.clip();

      drawCover(
        c,
        images[urls[i]],
        -cardW / 2 + border,
        -cardH / 2 + border,
        cardW - border * 2,
        imageH
      );

      c.restore();
      c.restore();
    }

    // Absichtlich kein Schriftzug am unteren Rand.
    // Die Reiseillustration bleibt sichtbar.

    // =====================================
    // PNG ERZEUGEN
    // =====================================

    return await new Promise(
      (resolve, reject) => {
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
      }
    );
  }

  // =========================================
  // COLLAGE ANZEIGEN
  // =========================================

  document.getElementById(
    'open-collage'
  ).addEventListener('click', async () => {
    const count = Object.keys(solved).filter(
      d => solved[d] === answers[d]
    ).length;

    if (count !== 24) return;

    page.hidden = true;
    collageView.hidden = false;

    collageStatus.hidden = false;
    collageStatus.textContent =
      'Dein Erinnerungsbild wird vorbereitet …';

    collagePreview.hidden = true;
    shareCollage.disabled = true;

    window.scrollTo(0, 0);

    try {
      if (!collageBlob) {
        collageBlob = await createCollage();
      }

      if (collageUrl) {
        URL.revokeObjectURL(collageUrl);
      }

      collageUrl = URL.createObjectURL(collageBlob);

      collagePreview.src = collageUrl;
      collagePreview.hidden = false;

      downloadCollage.href = collageUrl;

      collageStatus.hidden = true;
      shareCollage.disabled = false;
    } catch (error) {
      collageStatus.textContent = error.message;
    }
  });

  // =========================================
  // ZURÜCK ZUM RÄTSELRASTER
  // =========================================

  document.getElementById(
    'back-collage'
  ).addEventListener('click', () => {
    collageView.hidden = true;
    page.hidden = false;

    window.scrollTo(0, 0);
  });

  // =========================================
  // AUF DEM IPHONE BILD SICHERN
  // =========================================

  shareCollage.addEventListener(
    'click',
    async () => {
      if (!collageBlob) return;

      const file = new File(
        [collageBlob],
        '24-Blueten-eine-Liebe.png',
        { type: 'image/png' }
      );

      try {
        if (
          navigator.share &&
          navigator.canShare?.({ files: [file] })
        ) {
          await navigator.share({
            files: [file],
            title: '24 Blüten, eine Liebe'
          });
        } else {
          collageStatus.hidden = false;
          collageStatus.textContent =
            'Tippe länger auf das Bild und wähle „In Fotos sichern“ oder nutze „Bild herunterladen“.';
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          collageStatus.hidden = false;
          collageStatus.textContent =
            'Teilen nicht möglich. Halte das Bild länger gedrückt oder verwende „Bild herunterladen“.';
        }
      }
    }
  );

  // =========================================
  // START
  // =========================================

  setDay(1);
})();
