const ASSETS = [
  "assets/STICKER 1.png",
  "assets/STICKER 2.png",
  "assets/STICKER 3.png",
  "assets/STICKER 4.jpg",
  "assets/STICKER 5.png",
  "assets/STICKER 6.png",
  "assets/STICKER 7.png",
  "assets/STICKER 8.png",
  "assets/STICKER 9.png",
  "assets/STICKER 10.png",
  "assets/STICKER 11.png"
];

const LYRICS = [
  "Puerto Rico en casa",
  "Perreo hasta el suelo",
  "El verano sigue vivo",
  "Debí tirar más fotos"
];

const BIG_LYRICS = [
  "DEBÍ TIRAR MÁS FOTOS",
  "PUERTO RICO EN CASA",
  "EL VERANO SIGUE VIVO",
  "PERREO HASTA EL SUELO"
];

const stage = document.getElementById("stage");
const resetBtn = document.getElementById("resetBtn");

let zIndexActual = 10;
let totalClicks = 0;
let stickerEspecial = null;
let fraseGrandeActiva = false;
let fraseGrandeElemento = null;



// escoge un elemento aleatorio de un arreglo
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// número aleatorio entre min y max
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* CREAR STICKER */

function crearSticker(x, y) {
  const img = document.createElement("img");
  img.src = pick(ASSETS);
  img.className = "piece";

  img.style.left = x + "px";
  img.style.top = y + "px";
  img.style.width = rand(160, 260) + "px";
  img.style.zIndex = ++zIndexActual;

  // guardamos rotación y escala
  img.dataset.rot = rand(-20, 20);
  img.dataset.scale = 1;

  actualizarTransform(img);
  hacerArrastrable(img);
  activarEventosSticker(img);

  stage.appendChild(img);

  elegirStickerEspecial();
}


function actualizarTransform(sticker) {
  const rot = sticker.dataset.rot;
  const scale = sticker.dataset.scale;

  sticker.style.transform =
    `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;

  sticker.style.setProperty("--base-rot", rot + "deg");
  sticker.style.setProperty("--base-scale", scale);
}

/* ARRASTRAR  */

function hacerArrastrable(sticker) {
  let moviendo = false;
  let offsetX = 0;
  let offsetY = 0;

  sticker.addEventListener("mousedown", (e) => {
    if (sticker.classList.contains("consume")) return;

    moviendo = true;
    sticker.style.zIndex = ++zIndexActual;

    const rect = sticker.getBoundingClientRect();
    offsetX = e.clientX - (rect.left + rect.width / 2);
    offsetY = e.clientY - (rect.top + rect.height / 2);
  });

  window.addEventListener("mousemove", (e) => {
    if (!moviendo) return;

    sticker.style.left = e.clientX - offsetX + "px";
    sticker.style.top = e.clientY - offsetY + "px";
  });

  window.addEventListener("mouseup", () => {
    moviendo = false;
  });
}

/* EVENTOS DEL STICKER */

function activarEventosSticker(sticker) {
  // click normal
  sticker.addEventListener("click", (e) => {
    e.stopPropagation();

    totalClicks++;

    // si es el sticker especial, se clickea
    if (sticker === stickerEspecial) {
      elegirStickerEspecial(sticker);
      return;
    }

    // cada 3 clics: frases pequeñas
    if (totalClicks % 3 === 0) {
      explosionFrases();
    }

    // cada 10 clics: frase grande
    if (totalClicks % 10 === 0) {
      mostrarFraseGrande();
    }
  });

  // doble clic = agrandar o devolver
  sticker.addEventListener("dblclick", (e) => {
    e.stopPropagation();

    if (sticker.classList.contains("consume")) return;

    if (Number(sticker.dataset.scale) === 1) {
      sticker.dataset.scale = 1.4;
    } else {
      sticker.dataset.scale = 1;
    }

    actualizarTransform(sticker);
  });

  // scroll = girar
    sticker.addEventListener("wheel", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (sticker.classList.contains("consume")) return;

    const delta = Math.sign(e.deltaY);

    // gira el sticker
    if (delta > 0) {
      sticker.dataset.rot = Number(sticker.dataset.rot) + 10;
    } else {
      sticker.dataset.rot = Number(sticker.dataset.rot) - 10;
    }

    actualizarTransform(sticker);

    // al hacer scroll también explotan frases por toda la pantalla
    explosionFrases();
  }, { passive: false });
}

/* FRASES PEQUEÑAS */

function crearFrase(texto) {
  const frase = document.createElement("div");
  frase.className = "lyricBurst";
  frase.textContent = texto;

  frase.style.left = rand(0, window.innerWidth) + "px";
  frase.style.top = rand(0, window.innerHeight) + "px";

  frase.style.setProperty("--tx", rand(-250, 250) + "px");
  frase.style.setProperty("--ty", rand(-250, 250) + "px");
  frase.style.setProperty("--rot", rand(-30, 30) + "deg");

  document.body.appendChild(frase);

  setTimeout(() => {
    frase.remove();
  }, 1600);
}

function explosionFrases() {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      crearFrase(pick(LYRICS));
    }, i * 60);
  }
}

/* FRASE GRANDE */

function mostrarFraseGrande() {
  if (fraseGrandeActiva) return;

  fraseGrandeActiva = true;

  const frase = document.createElement("div");
  frase.className = "bigLyric";
  frase.textContent = pick(BIG_LYRICS);

  // escala inicial
  frase.dataset.scale = 1;

  document.body.appendChild(frase);
  fraseGrandeElemento = frase;

  frase.addEventListener("click", () => {
    let scaleActual = Number(frase.dataset.scale);

    // cada clic la hace crecer más grande
    scaleActual += 0.8;

    frase.dataset.scale = scaleActual;
    frase.style.transform = `translate(-50%, -50%) scale(${scaleActual})`;

    // cuando ya está muy grande, desaparece
    if (scaleActual >= 6) {
      frase.classList.add("done");

      setTimeout(() => {
        frase.remove();
        fraseGrandeActiva = false;
        fraseGrandeElemento = null;
      }, 350);
    }
  });

}

/* STICKER ESPECIAL */

function elegirStickerEspecial() {
  const stickers = document.querySelectorAll(".piece");

  // quitar vibración anterior
  stickers.forEach((sticker) => {
    sticker.classList.remove("targetPulse");
  });

  if (stickers.length === 0) {
    stickerEspecial = null;
    return;
  }

  stickerEspecial = pick([...stickers]);
  stickerEspecial.classList.add("targetPulse");
}

function elegirStickerEspeciall(sticker) {
  sticker.classList.remove("targetPulse");
  sticker.classList.add("consume");
  sticker.style.zIndex = 999;

  explosionFrases();

  setTimeout(() => {
    sticker.remove();
    elegirStickerEspecial();
  }, 1400);
}

/* CLICK EN EL FONDO*/

stage.addEventListener("click", (e) => {
  if (e.target.classList.contains("piece")) return;

  crearSticker(e.clientX, e.clientY);

  totalClicks++;

  if (totalClicks % 3 === 0) {
    explosionFrases();
  }

  if (totalClicks % 10 === 0) {
    mostrarFraseGrande();
  }
});

/* RESET*/

resetBtn.addEventListener("click", () => {
  stage.innerHTML = "";
  totalClicks = 0;
  stickerEspecial = null;
  fraseGrandeActiva = false;
  fraseGrandeElemento = null;

  document.querySelectorAll(".lyricBurst").forEach((el) => el.remove());
  document.querySelectorAll(".bigLyric").forEach((el) => el.remove());
});

/* STICKERS INICIALES */

window.addEventListener("load", () => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  crearSticker(cx - 180, cy);
  crearSticker(cx, cy);
  crearSticker(cx + 180, cy);
  crearSticker(cx + 60, cy - 110);
});