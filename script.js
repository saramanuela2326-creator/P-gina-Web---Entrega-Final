document.addEventListener("DOMContentLoaded", () => {
  
  // Busca el título por su id
  const titulo = document.getElementById("titulo");

  // Si no encuentra el título, detiene el código
  if (!titulo) return;

  // Guarda el texto original del título
  const text = titulo.textContent;

  // Borra el texto del h1 para reconstruirlo letra por letra
  titulo.textContent = "";

  // Aquí guardaremos todos los spans (cada letra)
  const spans = [];

  // Recorre cada carácter del texto
  [...text].forEach((ch) => {

    // Crea un span nuevo para cada letra
    const s = document.createElement("span");

    // Le pone la clase "ch" para que tenga estilos y animación
    s.className = "ch";

    // Si el carácter es un espacio, mete un espacio especial para que no se pierda
    s.textContent = (ch === " ") ? "\u00A0" : ch;

    // Agrega ese span dentro del título
    titulo.appendChild(s);

    // Guarda ese span en el arreglo spans
    spans.push(s);
  });

  // Función que devuelve solo las letras, ignorando espacios
  const letters = () => spans.filter(sp => sp.textContent.trim() !== "");

  // Función para escoger una letra aleatoria
  function pickLetter() {
    const arr = letters();
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Función general para poner una clase por un tiempo y luego quitarla
  function pulseClass(el, cls, ms) {
    if (!el) return;

    // Quita la clase por si ya estaba puesta
    el.classList.remove(cls);

    // Fuerza al navegador a recalcular el elemento
    // Esto sirve para reiniciar la animación
    void el.offsetWidth;

    // Vuelve a agregar la clase para que la animación arranque otra vez
    el.classList.add(cls);

    // Después del tiempo indicado, quita la clase
    setTimeout(() => el.classList.remove(cls), ms);
  }

  // =========================
  // EFECTO GLITCH
  // =========================

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

  // =========================
  // EFECTO CAÍDA
  // =========================

  // Hace que una sola letra se "caiga"
  function dropOne() {
    pulseClass(pickLetter(), "fall", 650);
  }

  // =========================
  // EFECTO ESCAPE
  // =========================

  // Hace que una sola letra salga disparada
  function escapeOne() {
    pulseClass(pickLetter(), "escape", 900);
  }

  // =========================
  // ANIMACIONES AUTOMÁTICAS
  // =========================

  // Glitch frecuente
  let tGlitch = setInterval(glitchBurst, 260);

  // Una letra cae cada cierto tiempo
  let tFall = setInterval(dropOne, 900);

  // A veces una letra escapa
  let tEscape = setInterval(() => {
    if (Math.random() < 0.55) escapeOne();
  }, 1500);

  // =========================
  // CUANDO EL MOUSE ENTRA AL TÍTULO
  // =========================

  titulo.addEventListener("mouseenter", () => {

    // Borra los intervalos anteriores
    clearInterval(tGlitch);
    clearInterval(tFall);
    clearInterval(tEscape);

    // Activa un modo más intenso
    tGlitch = setInterval(glitchBurst, 150);
    tFall = setInterval(dropOne, 600);
    tEscape = setInterval(() => {
      if (Math.random() < 0.8) escapeOne();
    }, 950);
  });

  // =========================
  // CUANDO EL MOUSE SALE DEL TÍTULO
  // =========================

  titulo.addEventListener("mouseleave", () => {

    // Borra los intervalos intensos
    clearInterval(tGlitch);
    clearInterval(tFall);
    clearInterval(tEscape);

    // Vuelve al ritmo normal
    tGlitch = setInterval(glitchBurst, 260);
    tFall = setInterval(dropOne, 900);
    tEscape = setInterval(() => {
      if (Math.random() < 0.55) escapeOne();
    }, 1500);
  });
});