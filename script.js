function typeText(el, text, speed) {
  if (!el) return;

  el.textContent = "";
  let i = 0;

  const timer = setInterval(() => {
    el.textContent += text.charAt(i);
    i++;

    if (i >= text.length) clearInterval(timer);
  }, speed);
}

document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.getElementById("titulo");
  const subtitulo = document.getElementById("subtitulo");

  typeText(titulo, "ENTRA A CADA MUNDO 🎧", 60);

  setTimeout(() => {
    typeText(subtitulo, "Haz click en un artista para desbloquear su collage.", 25);
  }, 900);
});