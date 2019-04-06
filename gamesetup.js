const canvas = document.getElementById('canvas');
const W = canvas.width;
const H = canvas.height;
const ctx = canvas.getContext('2d');
ctx.textAlign = "center";
ctx.textBaseLine = "middle";
var mapData = [];
var collisionMap = [];
var gameState = {};

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
  "map7",
]

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
