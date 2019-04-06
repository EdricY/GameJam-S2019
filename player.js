//depends on input.js
//depends on tiles.js

const PLAYERSIZE = 16;
const PLAYERHALFSIZE = PLAYERSIZE / 2;
const PHSZ = PLAYERHALFSIZE;
const SQRT2 = Math.sqrt(2);

function Player() {
  this.x = 100;
  this.y = 100;
  this.vx = 0;
  this.vy = 0;
  this.speed = 5;
  this.color = "red";
  this.draw = (ctx) => drawPlayer(ctx, this);
  this.update = function () {
    if (keys[37]) { //left
      this.vx = -this.speed;
    } else if (keys[39]) { //right
      this.vx = this.speed;
    } else {
      this.vx = 0;
    }
    if (keys[38]) { //up
      this.vy = -this.speed;
    } else if (keys[40]) { //down
      this.vy = this.speed;
    } else {
      this.vy = 0;
    }
    if (this.vy != 0 && this.vx != 0) {
      this.vy /= SQRT2;
      this.vx /= SQRT2;
    }
    this.x += this.vx;
    this.y += this.vy;
  }
}

function drawPlayer(ctx, player) {
  ctx.fillStyle = player.color;
  let left = player.x - PLAYERHALFSIZE;
  let top = player.y - PLAYERHALFSIZE;
  ctx.fillRect(left, top, PLAYERSIZE, PLAYERSIZE);
}

function getLocalTiles(player) {
  tl = getTileFromPos(mapData, player.x - PHSZ  , player.y - PHSZ  );
  tr = getTileFromPos(mapData, player.x + PHSZ-1, player.y - PHSZ  );
  bl = getTileFromPos(mapData, player.x - PHSZ  , player.y + PHSZ-1);
  br = getTileFromPos(mapData, player.x + PHSZ-1, player.y + PHSZ-1);
  return [tl, tr, bl, br];
}