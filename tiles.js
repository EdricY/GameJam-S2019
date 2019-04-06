
var mapLoader = document.getElementById('mapLoader')
var ml_ctx = mapLoader.getContext('2d')

const TILESIZE = 16;

const TILES = {
  '255,255,255,255' : null,
  '0,0,0,255' : 0,
  '64, 64, 64, 255' : 1,
  '127, 106, 0, 255' : 2
};

const tileImgIDs = [
  "tile0",
  "metal",
  "wood"
]
const tileImgs = []
for (let imgID of tileImgIDs) {
  tileImgs.push(document.getElementById(imgID))
}



function getMapData(imgID) {
  let img = document.getElementById(imgID)
  let data = [];
  ml_ctx.drawImage(img, 0, 0);
  let w = 48;
  let h = 32;
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

function drawMap(ctx, mapData) {
  let rl = mapData.length;
  let cl = mapData[0].length;
  let TILESIZE = 16;
  for (let row = 0; row < rl; row++) {
    for (let col = 0; col < cl; col++) {
      let tileID = mapData[row][col];
      if (tileID == null) continue;
      let tileImg = getTileImg(tileID);
      ctx.drawImage(tileImg, col * tilesize, row * tilesize);
    }
  }
}

function getTileImg(tileID) {
  return tileImgs[tileID];
}

function getTileFromPos(mapData, x, y) {
  return mapData[Math.floor(y/TILESIZE)][[Math.floor(x/TILESIZE)]]
}