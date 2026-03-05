document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.getElementById("titulo");
  if (!titulo) return;

  // Convertir texto en letras (spans)
  const text = titulo.textContent;
  titulo.textContent = "";

  const spans = [];
  [...text].forEach((ch) => {
    const s = document.createElement("span");
    s.className = "ch";
    s.textContent = (ch === " ") ? "\u00A0" : ch;
    titulo.appendChild(s);
    spans.push(s);
  });

  const letters = () => spans.filter(sp => sp.textContent.trim() !== "");

  function pickLetter() {
    const arr = letters();
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pulseClass(el, cls, ms) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth; // reflow (reinicia animación)
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  }

  // GLITCH MUY frecuente: le pega a varias letras por “pulso”
  function glitchBurst() {
    const arr = letters();
    const hits = Math.floor(Math.random() * 4) + 3; // 3 a 6 letras
    for (let i = 0; i < hits; i++) {
      const el = arr[Math.floor(Math.random() * arr.length)];
      pulseClass(el, "glitch", 500);
    }
  }

  // Caída ocasional
  function dropOne() {
    pulseClass(pickLetter(), "fall", 650);
  }

  // Escape ocasional (sale de la página)
  function escapeOne() {
    pulseClass(pickLetter(), "escape", 900);
  }

  // Timers base (frecuentes)
  let tGlitch = setInterval(glitchBurst, 260);  // MUY frecuente
  let tFall   = setInterval(dropOne, 900);      // a veces cae
  let tEscape = setInterval(() => {
    if (Math.random() < 0.55) escapeOne();      // bastante seguido
  }, 1500);

  // Hover: más caos todavía
  titulo.addEventListener("mouseenter", () => {
    clearInterval(tGlitch); clearInterval(tFall); clearInterval(tEscape);
    tGlitch = setInterval(glitchBurst, 150);
    tFall   = setInterval(dropOne, 600);
    tEscape = setInterval(() => {
      if (Math.random() < 0.8) escapeOne();
    }, 950);
  });

  // Leave: vuelve a caos “normal”
  titulo.addEventListener("mouseleave", () => {
    clearInterval(tGlitch); clearInterval(tFall); clearInterval(tEscape);
    tGlitch = setInterval(glitchBurst, 260);
    tFall   = setInterval(dropOne, 900);
    tEscape = setInterval(() => {
      if (Math.random() < 0.55) escapeOne();
    }, 1500);
  });
});