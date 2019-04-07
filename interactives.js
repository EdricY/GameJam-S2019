const safe_open = document.getElementById('safe-open');
const register_open = document.getElementById('register-open');

function LockBox(x, y, tileID) {
  this.x = x;
  this.y = y;
  this.pins = randInt(2,7);
  this.message = "Lockpick [Space]"
  this.done = false;
  if (tileID == 20) { //safe
    this.interact = function() {
      lockpickWindow = new LockpickWindow(this.pins, () => {
        this.done = true;
        player.inventory = 20;
        let r = Math.floor(y / TILESIZE);
        let c = Math.floor(x / TILESIZE);
        collisionctx.clearRect(c * TILESIZE, r * TILESIZE, TILESIZE, TILESIZE);
        collisionctx.drawImage(safe_open,c * TILESIZE, r * TILESIZE);
      });
    }
  } else if (tileID == 21) { //register
    this.interact = function() {
      lockpickWindow = new LockpickWindow(this.pins, () => {
        this.done = true;
        player.inventory = 20;
        let r = Math.floor(y / TILESIZE);
        let c = Math.floor(x / TILESIZE);
        collisionctx.clearRect(c * TILESIZE, r * TILESIZE, TILESIZE, TILESIZE);
        collisionctx.drawImage(register_open, c * TILESIZE, r * TILESIZE);
      });
    }
  } else if (tileID == 24) { //metal door
    this.interact = function() {
       // lockpickWindow = new LockpickWindow(this.pins, () => {
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

      // });
    }
  }
}

function Entrance(x, y) {
  this.x = x;
  this.y = y;
  this.done = false;
  this.message = "";
  setTimeout(() => this.message = "Return Home [Space]", 1000); //debug change me
  this.interact = function() {
    returnToLanding();
  }
}
