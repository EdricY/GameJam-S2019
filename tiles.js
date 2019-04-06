const TILES = {
  '255,255,255,255': null,
  '0,0,0,255': 0,
  '64,64,64,255': 1,
  // '66,66,66,255': 1, //ff
  '127,106,0,255': 2,
  '127,51,0,255' : 3,
  '255,0,0,255' : 4,
  '127,51,1,255' : 5,
  '127,51,2,255' : 6,
  '181,181,181,255' : 7,
  '127,106,10,255': 8,
  '125,104,34,255': 8, //ff
  '127,106,20,255': 9,
  '125,104,39,255': 9, //ff
  '127,51,10,255' : 10,
  // '123,54,26,255' : 10, //ff
  '0,255,255,255' : 11,
  '255,106,0,255' : 12,
  '107,42,0,255' : 13,
  '107,42,10,255' : 14,
  '107,42,20,255' : 15,
  '73,29,0,255' : 16,
  '0,255,33,255' : 17,
  '0,62,143,255' : 18,
  '255,140,220,255' : 19,
  '10,0,0,255' : 20, //safe
  '20,0,0,255' : 21, //register
};

const FLOORTILES = [1, 7, 12];
const LOCKEDTILES = [20, 21]

const tileImgIDs = [
  "tile0",
  "metal",
  "wood",
  "wood-door",
  "counter",
  "shelf-v",
  "shelf-h",
  "tile-white",
  "wooda",
  "woodb",
  "wood-door-down",
  "glass-display",
  "carpet",
  "teller",
  "teller-left",
  "teller-down",
  "wall-brown",
  "plant",
  "couch",
  "stall",
  "safe-closed",
  "register-closed",
]

/////////////////////////////

var mapLoader = document.getElementById('mapLoader');
var ml_ctx = mapLoader.getContext('2d');

var collisionCanvas = document.getElementById('collisionCanvas');
var collisionctx = collisionCanvas.getContext('2d');

var floorCanvas = document.getElementById('floorCanvas');
var floorctx = floorCanvas.getContext('2d');

ml_ctx.imageSmoothingEnabled = false;
ml_ctx.webkitImageSmoothingEnabled = false;
ml_ctx.msImageSmoothingEnabled = false;
collisionctx.imageSmoothingEnabled = false;
collisionctx.webkitImageSmoothingEnabled = false;
collisionctx.msImageSmoothingEnabled = false;
floorctx.imageSmoothingEnabled = false;
floorctx.webkitImageSmoothingEnabled = false;
floorctx.msImageSmoothingEnabled = false;

var recentFloorTileID = 1;

const TILESIZE = 16;
const MAPW = 48;
const MAPH = 32;

const tileImgs = []
for (let imgID of tileImgIDs) {
  tileImgs.push(document.getElementById(imgID))
}

const TILECOLORS = []

for (let colorstr in TILES) {
  let arr = getColorArr(colorstr);
  TILECOLORS.push(arr)
}


function setMapData(imgID) {
  mapData = getMapData(imgID);
  collisionctx.clearRect(0, 0, collisionCanvas.width, collisionCanvas.height);
  drawMapData(collisionctx, mapData, true)
  let raw_collision_data = collisionctx.getImageData(0, 0, W, H);
  raw_collision_data = raw_collision_data.data;
  collisionMap = [];
  for (let y = 0; y < H; y++) {
    collisionMap.push([])
    for (let x = 0; x < W; x++) {
      let pos = 4 * (x + y * W) + 3;
      collisionMap[y].push(raw_collision_data[pos] > 0)
    }
  }

  fillMap(floorctx, recentFloorTileID);
  drawFloorData(floorctx, mapData);
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
      let tileid = getTileID(colorstr);
      if (tileid === undefined) console.log(colorstr)
      data[row].push(tileid);
    }
  }
  return data;
}

function drawMapData(ctx, mapData, removeFloor=false) {
  let rl = mapData.length;
  let cl = mapData[0].length;
  for (let row = 0; row < rl; row++) {
    for (let col = 0; col < cl; col++) {
      let tileID = mapData[row][col];
      if (tileID == null) continue;
      let tileImg = getTileImg(tileID);
      if (removeFloor && FLOORTILES.includes(tileID)) {
        recentFloorTileID = tileID;
        continue;
      }
      ctx.drawImage(tileImg, col * TILESIZE, row * TILESIZE);
    }
  }
}

function drawFloorData(ctx, mapData) {
  let rl = mapData.length;
  let cl = mapData[0].length;
  for (let row = 0; row < rl; row++) {
    for (let col = 0; col < cl; col++) {
      let tileID = mapData[row][col];
      if (tileID == null) continue;
      let tileImg = getTileImg(tileID);
      if (FLOORTILES.includes(tileID)) {
        ctx.drawImage(tileImg, col * TILESIZE, row * TILESIZE);
      }
    }
  }
}

function fillMap(ctx, tileID) {
  let rl = mapData.length;
  let cl = mapData[0].length;
  for (let row = 0; row < rl; row++) {
    for (let col = 0; col < cl; col++) {
      let tileImg = getTileImg(tileID);
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
  if (r >= MAPH || c >= MAPW) return null;
  return mapData[r][c]
}

function getTileID(colorstr) {
  let tileid = TILES[colorstr];
  if (tileid) return tileid;
  //find closest
  let colorarr1 = getColorArr(colorstr);
  let min = 10000;
  let mindex = 0;
  let len = TILECOLORS.length;
  for (let i = 0; i < len; i++) {
    let dist = getColorDist(colorarr1, TILECOLORS[i]);
    if (dist < min) {
      min = dist;
      mindex = i;
    }
  }
  colorstr = TILECOLORS[mindex].toString();
  return TILES[colorstr];
}

function getColorDist(colorarr1, colorarr2) {
  let dist = 0;
  dr = colorarr1[0] - colorarr2[0]
  dg = colorarr1[1] - colorarr2[1]
  db = colorarr1[2] - colorarr2[2]
  dist = dr*dr + dg*dg + db*db;
  return dist;
}

function getColorArr(colorstr) {
  let arr = colorstr.split(',');
  for (let i in arr) arr[i] = Number(arr[i]);
  return arr;
}
