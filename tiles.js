
var mapLoader = document.getElementById('mapLoader');
var ml_ctx = mapLoader.getContext('2d');

var mapCanvas = document.getElementById('mapCanvas');
var mapctx = mapCanvas.getContext('2d');
mapctx.fillStyle = "red";
mapctx.fillRect(0, 0, 500, 500)


const TILESIZE = 16;
const MAPW = 48;
const MAPH = 32;

const TILES = {
  '255,255,255,255': null,
  '0,0,0,255': 0,
  '64,64,64,255': 1,
  '127,106,0,255': 2,
  '127,51,0,255' : 3,
  '255,0,0,255' : 4,
  '127,51,1,255' : 5,
  '127,51,2,255' : 6,
  '181,181,181,255' : 7
};

const FLOORTILES = [1];

const tileImgIDs = [
  "tile0",
  "metal",
  "wood",
  "wood-door",
  "counter",
  "shelf-v",
  "shelf-h",
  "tile-white"
]
const tileImgs = []
for (let imgID of tileImgIDs) {
  tileImgs.push(document.getElementById(imgID))
}

function setMapData(imgID) {
  mapData = getMapData(imgID);
  mapctx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
  drawMap(mapctx, mapData, true)
  let raw_collision_data = mapctx.getImageData(0, 0, W, H);
  raw_collision_data = raw_collision_data.data;
  collisionMap = [];
  for (let y = 0; y < H; y++) {
    collisionMap.push([])
    for (let x = 0; x < W; x++) {
      let pos = 4 * (x + y * W) + 3;
      collisionMap[y].push(raw_collision_data[pos] > 0)
    }
  }

}

function getMapData(imgID) {
  let img = document.getElementById(imgID)
  let data = [];
  ml_ctx.drawImage(img, 0, 0);
  let w = MAPW;
  let h = MAPH;
  let raw_data = ml_ctx.getImageData(0, 0, w, h);
  raw_data = raw_data.data
  for (let row = 0; row < h; row++) {
    data.push([])
    for (let col = 0; col < w; col++) {
      let pos = 4 * (col + row * w);
      let colorstr = raw_data.slice(pos, pos + 4).toString();
      let tileid = TILES[colorstr];
      data[row].push(tileid);
    }
  }
  return data;
}

function drawMap(ctx, mapData, removeFloor=false) {
  let rl = mapData.length;
  let cl = mapData[0].length;
  for (let row = 0; row < rl; row++) {
    for (let col = 0; col < cl; col++) {
      let tileID = mapData[row][col];
      if (tileID == null) continue;
      let tileImg = getTileImg(tileID);
      if (removeFloor && FLOORTILES.includes(tileID)) {
        continue;
      }
      ctx.drawImage(tileImg, col * TILESIZE, row * TILESIZE);
    }
  }
}

function getTileImg(tileID) {
  return tileImgs[tileID];
}

function getTileFromPos(mapData, x, y) {
  let r = Math.floor(y / TILESIZE);
  let c = Math.floor(x / TILESIZE);
  if (r < 0 || c < 0) return null;
  if (r > MAPH || c > MAPW) return null;
  return mapData[r][c]
}