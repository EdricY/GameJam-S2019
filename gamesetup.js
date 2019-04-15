const canvas = document.getElementById('canvas');
const W = canvas.width;
const H = 512;//canvas.height;
const ctx = canvas.getContext('2d');
ctx.textAlign = "center";
ctx.textBaseLine = "middle";

var mapID = -1;
var mapData = [];
var collisionMap = [];
var interactionObjects = [];
var gameState = {};

var walletAmt = 107;

const MAPIDS = [
  "map0",
  "map1",
  "map2",
  "map3",
  "map4",
  "map5",
  "map6",
  "map7",
  "map8",
  "map9",
  "map10",
  "map11",
  "map12",
  "map13",
  "map14"
]

//math!

//returns x where min <= x < max
function randInt(min, max) {
  let range = max - min;
  return Math.floor(min + (Math.random() * range));
}

function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function mod(a, n) {
 return (a % n + n) % n;
}
