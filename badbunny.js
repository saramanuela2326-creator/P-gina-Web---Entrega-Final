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

const stage = document.getElementById("stage");
const resetBtn = document.getElementById("resetBtn");

let topZ = 10;
let stickerCount = 0;
let currentSticker = null;

/* helpers */

function rand(min,max){
return Math.random()*(max-min)+min;
}

function pick(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

/* crear sticker */

function spawnPiece(x,y){

const img=document.createElement("img");
img.src=pick(ASSETS);
img.className="piece";

img.style.left=x+"px";
img.style.top=y+"px";

img.style.width=rand(160,280)+"px";

img.dataset.rot=rand(-20,20);
img.dataset.scale=1;

applyTransform(img);

img.style.zIndex=++topZ;

makeDraggable(img);

setupClicks(img);

stage.appendChild(img);

stickerCount++;

/* cada 3 stickers cambia luces */

if(stickerCount%3===0){
shiftLights();
}

}

/* transform */

function applyTransform(el){

const r=el.dataset.rot;
const s=el.dataset.scale;

el.style.transform=
`translate(-50%,-50%) rotate(${r}deg) scale(${s})`;

}

/* arrastrar */

function makeDraggable(el){

let dragging=false;
let offsetX=0;
let offsetY=0;

el.addEventListener("mousedown",e=>{

dragging=true;
currentSticker=el;

const rect=el.getBoundingClientRect();

offsetX=e.clientX-(rect.left+rect.width/2);
offsetY=e.clientY-(rect.top+rect.height/2);

});

window.addEventListener("mousemove",e=>{

if(!dragging)return;

el.style.left=e.clientX-offsetX+"px";
el.style.top=e.clientY-offsetY+"px";

});

window.addEventListener("mouseup",()=>{

dragging=false;

});

}

/* clicks */

function setupClicks(el){

let clicks=0;

el.addEventListener("click",e=>{

clicks++;

if(clicks===2){

el.dataset.scale=1.4;
applyTransform(el);

}

if(clicks===3){

el.dataset.scale=0.7;
applyTransform(el);

clicks=0;

}

});

/* scroll rota */

el.addEventListener("wheel",e=>{

e.preventDefault();

const delta=Math.sign(e.deltaY);

el.dataset.rot=Number(el.dataset.rot)+(delta>0?8:-8);

applyTransform(el);

},{passive:false});

}

/* click fondo */

stage.addEventListener("mousedown",e=>{

if(e.target.classList.contains("piece"))return;

spawnPiece(e.clientX,e.clientY);

});

/* delete sticker */

document.addEventListener("keydown",e=>{

if(e.key==="Delete" && currentSticker){

currentSticker.remove();
currentSticker=null;

}

});

/* reset */

resetBtn.addEventListener("click",()=>{

stage.innerHTML="";
stickerCount=0;

});

/* luces concierto */

function shiftLights(){

document.body.style.filter=
`hue-rotate(${rand(0,360)}deg) saturate(1.4)`;

}

/* inicio */

window.addEventListener("load",()=>{

const cx=window.innerWidth/2;
const cy=window.innerHeight/2;

spawnPiece(cx-200,cy);
spawnPiece(cx,cy);
spawnPiece(cx+200,cy);
spawnPiece(cx+80,cy-120);

});