const safe_open = document.getElementById('safe-open');

function LockBox(x, y) {
  this.x = x;
  this.y = y;
  this.done = false;
  this.interact = function() {
    lockpickWindow = new LockpickWindow(4, () => {
      this.done = true;
      player.inventory = 20;
      // floorctx.fillRect()
      let r = Math.floor(y / TILESIZE);
      let c = Math.floor(x / TILESIZE);
      collisionctx.clearRect(c * TILESIZE, r * TILESIZE, TILESIZE, TILESIZE);
      collisionctx.drawImage(safe_open,c * TILESIZE, r * TILESIZE);
    });
  }
}
