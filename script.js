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
  // Keine Speicherung des Zugangs: Bei jedem neuen Seitenaufruf
  // muss das Passwort erneut eingegeben werden.
  function unlockPage() {
    gate.hidden = true;
    page.hidden = false;
    document.body.classList.add('access-granted');
  }
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
    return testMode && year <= 2026 ? 10 : 0;
  }

  function save() {
    try { localStorage.setItem(key, JSON.stringify(solved)); } catch (_) {}
  }

  function solvedFields() {
    // Bereits gelöste Felder sind auf ALLEN Tagen grün.
    return new Set(Object.values(solved).filter(value => typeof value === 'string'));
  }

  function showPhoto(forDay) {
    const info = photos[forDay];
    if (!info || !info.datei) return;
    lastFocus = document.activeElement;
    photoImage.src = info.datei;
    photoImage.alt = `Erinnerungsfoto zum ${forDay}. Dezember`;
    photoCaption.textContent = info.text || `Unsere Erinnerung vom ${forDay}. Dezember ♡`;
    overlay.hidden = false;
    overlay.classList.remove('legendary-play');
    void overlay.offsetWidth;
    overlay.classList.add('legendary-play');
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
    } else if (testMode && max === 10 && new Date().getFullYear() <= 2026) {
      unlockHint.textContent = '✧ Testmodus: Tage 1 bis 10 sind zum Ausprobieren geöffnet.';
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
            if (matchingDay) showPhoto(matchingDay);
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

  previous.addEventListener('click', () => setDay(day - 1));
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
  setDay(1);
})();
