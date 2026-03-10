document.addEventListener("DOMContentLoaded", () => {
  
  const titulo = document.getElementById("titulo");

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
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  }

 
  // Esta función hace glitch en varias letras aleatorias
  function glitchBurst() {
    const arr = letters();

    // Escoge aleatoriamente entre 3 y 6 letras
    const hits = Math.floor(Math.random() * 4) + 3;

    for (let i = 0; i < hits; i++) {
      const el = arr[Math.floor(Math.random() * arr.length)];
      pulseClass(el, "glitch", 500);
    }
  }


  // Hace que una sola letra se "caiga"
  function dropOne() {
    pulseClass(pickLetter(), "fall", 650);
  }


  // Hace que una sola letra salga disparada
  function escapeOne() {
    pulseClass(pickLetter(), "escape", 900);
  }


  // Glitch frecuente
  let tGlitch = setInterval(glitchBurst, 260);

  // Una letra cae cada cierto tiempo
  let tFall = setInterval(dropOne, 900);

  // A veces una letra escapa
  let tEscape = setInterval(() => {
    if (Math.random() < 0.55) escapeOne();
  }, 1500);
  });
