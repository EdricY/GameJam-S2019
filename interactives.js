const safe_open = document.getElementById('safe-open');
const register_open = document.getElementById('register-open');

function LockBox(x, y, tileID) {
  this.x = x;
  this.y = y;
  this.message = "Lockpick [Space]"
  this.done = false;
  if (tileID == 20) { //safe
    this.interact = function() {
      lockpickWindow = new LockpickWindow(4, () => {
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
      lockpickWindow = new LockpickWindow(3, () => {
        this.done = true;
        player.inventory = 20;
        let r = Math.floor(y / TILESIZE);
        let c = Math.floor(x / TILESIZE);
        collisionctx.clearRect(c * TILESIZE, r * TILESIZE, TILESIZE, TILESIZE);
        collisionctx.drawImage(register_open, c * TILESIZE, r * TILESIZE);
      });
    }
  }
}

function Entrance(x, y) {
  this.x = x;
  this.y = y;
  this.done = false;
  this.message = "";
  setTimeout(() => this.message = "Return Home [Space]", 10000);
  this.interact = function() {
    mapID = -1;
    mapData = [];
    collisionMap = [];
    interactionObjects = [];
    gameState.update = function() {};
    gameState.draw = function() {};
    gameState.state = gameState.MENU;
    showLanding();
  }
}
