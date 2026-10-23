// TESTEINSTELLUNG: true erlaubt vor Dezember 2026 das Testen der Tage 1 bis 10.
// Für den echten Adventskalender unbedingt auf false stellen!
window.ADVENT_TESTMODUS = true;

// Testlösungen: später hier deine echten Lösungen eintragen.
window.STERNEN_LOESUNGEN = {
  1:'A1',2:'A2',3:'A3',4:'A4',5:'B1',6:'B2',7:'B3',8:'B4',
  9:'C1',10:'C2',11:'C3',12:'C4',13:'D1',14:'D2',15:'D3',16:'D4',
  17:'E1',18:'E2',19:'E3',20:'E4',21:'F1',22:'F2',23:'F3',24:'F4'
};

// Jedem Dezembertag kann ein Foto zugeordnet werden.
// Foto 1 wird nur beim Lösen von Tag 1 (Testlösung A1) gezeigt.
window.ADVENT_FOTOS = {
  1: { datei: 'foto-01.webp', text: 'Ein kleiner Moment für unser Erinnerungsalbum ♡' }
};
