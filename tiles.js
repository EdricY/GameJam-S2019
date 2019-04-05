
var mapLoader = document.getElementById('mapLoader')
var ml_ctx = mapLoader.getContext('2d')

const TILES

function getMapData(imgID) {
  let img = document.getElementById(imgID)
  let data = [];
  ml_ctx.drawImage(img, 0, 0);
  let w = 48;
  let h = 32;
  raw_data = ml_ctx.getImageData(0, 0, w, h);
  for (let row = 0; row < h; row++) {
    data.push([])
    for (let col = 0; col < w; col++) {
      let pos = 4 * (col + row * w);
      let colorstr = raw_data.slice(pos, pos + 4).toString();
      let tileid = TILES[colorstr]
    }
  }
  return data;
}