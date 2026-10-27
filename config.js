// TESTEINSTELLUNG: true erlaubt vor Dezember 2026 das Testen der alle 24 Tage.
// Für den echten Adventskalender unbedingt auf false stellen!
window.ADVENT_TESTMODUS = true;

// Endgültige Feld-Zuordnung für die 24 Dezembertage.
window.STERNEN_LOESUNGEN = {
  1: 'F3',
  2: 'E4',
  3: 'E1',
  4: 'C3',
  5: 'B4',
  6: 'E2',
  7: 'F1',
  8: 'D4',
  9: 'B1',
  10: 'D3',
  11: 'A4',
  12: 'C2',
  13: 'E3',
  14: 'A2',
  15: 'A1',
  16: 'C1',
  17: 'D1',
  18: 'C4',
  19: 'F4',
  20: 'B3',
  21: 'F2',
  22: 'B2',
  23: 'D2',
  24: 'A3'
};

// Jedem Dezembertag kann ein Foto zugeordnet werden.
// Foto 1 wird beim Lösen von Tag 1 (F3) gezeigt.
window.ADVENT_FOTOS = {
  ...Object.fromEntries(Array.from({length:24}, (_,i) => [i+1, {datei:'foto-01.webp', text:'Ich liebe dich ♡'}]))
};
