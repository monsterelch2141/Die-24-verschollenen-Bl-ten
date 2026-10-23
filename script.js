(() => {
  "use strict";
  const answers = window.STERNEN_LOESUNGEN || {};
  const daySelect = document.getElementById("day");
  const board = document.getElementById("board");
  const feedback = document.getElementById("feedback");
  const progress = document.getElementById("progress");
  const previous = document.getElementById("previous");
  const next = document.getElementById("next");
  const key = "verschollene-blueten-geloest-v1";
  let solved = {};
  try { solved = JSON.parse(localStorage.getItem(key) || "{}"); } catch (_) { solved = {}; }
  let day = 1;
  for (let i = 1; i <= 24; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = `${i}. Dezember`;
    daySelect.appendChild(option);
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(solved)); } catch (_) { /* Private browsing */ }
  }
  function updateProgress() {
    const total = Object.values(solved).filter(Boolean).length;
    progress.textContent = `${total} von 24 Geheimnissen gelüftet`;
  }
  function render() {
    daySelect.value = String(day);
    previous.disabled = day === 1;
    next.disabled = day === 24;
    board.replaceChildren();
    for (let row = 1; row <= 4; row++) {
      for (const col of ["A", "B", "C", "D", "E", "F"]) {
        const code = `${col}${row}`;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "cell";
        button.setAttribute("aria-label", `Feld ${code}`);
        button.append(document.createTextNode(code));
        if (solved[day] === code) {
          button.classList.add("solved");
          const tick = document.createElement("span");
          tick.className = "tick";
          tick.textContent = "✓";
          tick.setAttribute("aria-hidden", "true");
          button.appendChild(tick);
        }
        button.addEventListener("click", () => {
          if (solved[day]) {
            feedback.className = "feedback success";
            feedback.textContent = "✧ Dieses Geheimnis hast du bereits gelüftet. ✧";
            return;
          }
          if (code === answers[day]) {
            solved[day] = code;
            save();
            feedback.className = "feedback success";
            feedback.textContent = "✧ Richtig! Ein weiteres Geheimnis ist gelüftet. ✧";
            render();
          } else {
            button.classList.add("wrong");
            feedback.className = "feedback error";
            feedback.textContent = "Noch nicht ganz – folge den Sternen erneut. ✧";
          }
        });
        board.appendChild(button);
      }
    }
    updateProgress();
  }
  function setDay(value) {
    day = Math.max(1, Math.min(24, Number(value) || 1));
    feedback.className = "feedback";
    feedback.textContent = solved[day]
      ? "✧ Dieses Geheimnis hast du bereits gelüftet. ✧"
      : "✧ Die Sterne warten auf deine Entdeckung. ✧";
    render();
  }
  previous.addEventListener("click", () => setDay(day - 1));
  next.addEventListener("click", () => setDay(day + 1));
  daySelect.addEventListener("change", () => setDay(daySelect.value));
  setDay(1);
})();
