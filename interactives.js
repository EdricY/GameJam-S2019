const safe_open = document.getElementById('safe-open');
const register_open = document.getElementById('register-open');

var onelesspin = false;

function LockBox(x, y, tileID) {
  this.x = x;
  this.y = y;
  this.pins = randInt(2,7);
  if (onelesspin) this.pins--;
  this.message = "Lockpick [Space]"
  this.done = false;

  this.callback = () => {};
  if (tileID == 20) { //safe
    this.callback = () => {
      this.done = true;
      player.inventory += randInt(200,1000);
      let r = Math.floor(y / TILESIZE);
      let c = Math.floor(x / TILESIZE);
      collisionctx.clearRect(c * TILESIZE, r * TILESIZE, TILESIZE, TILESIZE);
      collisionctx.drawImage(safe_open,c * TILESIZE, r * TILESIZE);
    };
  } else if (tileID == 21) { //register
    this.callback = () => {
      this.done = true;
      player.inventory += randInt(300, 800);
      let r = Math.floor(y / TILESIZE);
      let c = Math.floor(x / TILESIZE);
      collisionctx.clearRect(c * TILESIZE, r * TILESIZE, TILESIZE, TILESIZE);
      collisionctx.drawImage(register_open, c * TILESIZE, r * TILESIZE);
    };
  } else if (tileID == 24) { // metal door
    this.callback = () => {
      this.done = true;
      let r = Math.floor(y / TILESIZE);
      let c = Math.floor(x / TILESIZE);
      collisionctx.clearRect(c * TILESIZE, r * TILESIZE, TILESIZE, TILESIZE);

      collisionMap[r][c] = recentFloorTileID;
      mapData[r][c] = recentFloorTileID;

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
    }
  }
  this.lockpickWindow = new LockpickWindow(this.pins, this.callback);
  this.interact = () => {
    lockpickWindow = this.lockpickWindow;
    lockpickWindow.active = true;
  }
}

function Entrance(x, y) {
  this.x = x;
  this.y = y;
  this.done = false;
  this.message = "";
  setTimeout(() => this.message = "Return Home [Space]", 10000); //debug change me
  this.interact = function() {
    walletAmt += player.inventory;
    returnToLanding();
  }
}
