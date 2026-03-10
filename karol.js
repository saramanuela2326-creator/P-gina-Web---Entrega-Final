const ASSETS = [
  "assets/k1.png",
  "assets/k2.jpg",
  "assets/k3.png",
  "assets/k4.png",
  "assets/k5.png",
  "assets/k6.jpg",
  "assets/k7.jpg",
  "assets/k8.png",
  "assets/k9.png",
  "assets/k10.png",
  "assets/k11.png"
];

const LYRICS = [
  "fantástica",
  "magnífica",
  "exótica",
  "mágica",
  "mística",
  "única",
  "bonitona",
  "tropicoqueta",
  "bichota"
];

const BIG_LYRICS = [
  "FANTÁSTICA",
  "MAGNÍFICA",
  "EXÓTICA",
  "MÁGICA",
  "MÍSTICA",
  "ÚNICA",
  "BONITONA",
  "TROPICOQUETA",
  "BICHOTA"
];

const stage = document.getElementById("stage");
const resetBtn = document.getElementById("resetBtn");

let zIndexActual = 10;
let totalClicks = 0;
let fraseGrandeActiva = false;

/* escoge una opción al azar */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* saca un número aleatorio entre mínimo y máximo */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* crea un sticker nuevo en la posición donde se hizo clic */
function crearSticker(x, y) {
  const img = document.createElement("img");

  img.src = pick(ASSETS);
  img.className = "sticker";

  img.style.left = x + "px";
  img.style.top = y + "px";

  img.style.width = rand(160, 260) + "px";
  img.style.zIndex = ++zIndexActual;

  img.dataset.rot = rand(-20, 20);
  img.dataset.scale = 1;

  actualizarTransform(img);
  hacerArrastrable(img);
  activarEventosSticker(img);

  stage.append(img);
}

/* actualiza giro y tamaño del sticker */
function actualizarTransform(sticker) {
  const rot = sticker.dataset.rot;
  const scale = sticker.dataset.scale;

  sticker.style.transform =
    `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
}

/* hace que se pueda mover con el mouse */
function hacerArrastrable(sticker) {
  let moviendo = false;
  let offsetX = 0;
  let offsetY = 0;

  sticker.addEventListener("mousedown", e => {
    moviendo = true;
    sticker.style.zIndex = ++zIndexActual;

    const rect = sticker.getBoundingClientRect();

    offsetX = e.clientX - (rect.left + rect.width / 2);
    offsetY = e.clientY - (rect.top + rect.height / 2);
  });

  window.addEventListener("mousemove", e => {
    if (!moviendo) return;

    sticker.style.left = e.clientX - offsetX + "px";
    sticker.style.top = e.clientY - offsetY + "px";
  });

  window.addEventListener("mouseup", () => {
    moviendo = false;
  });
}

/* aquí va lo que puede pasar con cada sticker */
function activarEventosSticker(sticker) {
  /* clic normal */
  sticker.addEventListener("click", e => {
    e.stopPropagation();

    totalClicks++;

    if (totalClicks % 3 === 0) {
      explosionFrases();
    }

    if (totalClicks % 10 === 0) {
      mostrarFraseGrande();
    }
  });

  /* doble clic: agranda o vuelve */
  sticker.addEventListener("dblclick", e => {
    e.stopPropagation();

    if (Number(sticker.dataset.scale) === 1) {
      sticker.dataset.scale = 1.4;
    } else {
      sticker.dataset.scale = 1;
    }

    actualizarTransform(sticker);
  });

  /* scroll: gira y saca frases */
  sticker.addEventListener("wheel", e => {
    e.preventDefault();
    e.stopPropagation();

    const delta = Math.sign(e.deltaY);

    if (delta > 0) {
      sticker.dataset.rot = Number(sticker.dataset.rot) + 10;
    } else {
      sticker.dataset.rot = Number(sticker.dataset.rot) - 10;
    }

    actualizarTransform(sticker);
    explosionFrases();

  }, { passive: false });
}

/* crea una frase pequeña */
function crearFrase(texto) {
  const frase = document.createElement("div");

  frase.className = "fraseExplota";
  frase.textContent = texto;

  frase.style.left = rand(0, window.innerWidth) + "px";
  frase.style.top = rand(0, window.innerHeight) + "px";

  frase.style.setProperty("--tx", rand(-250, 250) + "px");
  frase.style.setProperty("--ty", rand(-250, 250) + "px");
  frase.style.setProperty("--rot", rand(-30, 30) + "deg");

  document.body.append(frase);

  setTimeout(() => {
    frase.remove();
  }, 1600);
}

/* lanza varias frases para que se vea como explosión */
function explosionFrases() {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      crearFrase(pick(LYRICS));
    }, i * 60);
  }
}

/* muestra la frase grande */
function mostrarFraseGrande() {
  if (fraseGrandeActiva) return;

  fraseGrandeActiva = true;

  const frase = document.createElement("div");
  frase.className = "fraseGrande";
  frase.textContent = pick(BIG_LYRICS);
  frase.dataset.scale = 1;

  document.body.append(frase);

  frase.addEventListener("click", () => {
    let scaleActual = Number(frase.dataset.scale);

    scaleActual += 0.8;
    frase.dataset.scale = scaleActual;

    frase.style.transform =
      `translate(-50%, -50%) scale(${scaleActual})`;

    if (scaleActual >= 6) {
      frase.classList.add("done");

      setTimeout(() => {
        frase.remove();
        fraseGrandeActiva = false;
      }, 350);
    }
  });
}

/* clic en el fondo: crea sticker */
stage.addEventListener("click", e => {
  if (e.target.classList.contains("sticker")) return;

  crearSticker(e.clientX, e.clientY);
  totalClicks++;

  if (totalClicks % 3 === 0) {
    explosionFrases();
  }

  if (totalClicks % 10 === 0) {
    mostrarFraseGrande();
  }
});

/* reset: limpia todo */
resetBtn.addEventListener("click", () => {
  stage.innerHTML = "";
  totalClicks = 0;
  fraseGrandeActiva = false;

  document.querySelectorAll(".fraseExplota").forEach(el => el.remove());
  document.querySelectorAll(".fraseGrande").forEach(el => el.remove());
});

/* stickers iniciales */
window.addEventListener("load", () => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  crearSticker(cx - 180, cy);
  crearSticker(cx, cy);
  crearSticker(cx + 180, cy);
  crearSticker(cx + 60, cy - 110);
});