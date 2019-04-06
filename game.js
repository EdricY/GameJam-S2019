
const UPDATES_PER_SEC = 60;
const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;
var lastTime = Date.now();
var lag = 0;
var redraw = false;

var player = new Player();
var lockpickWindow;


function gameInit() {
  // setMapData("map3");
  lockpickWindow = new LockpickWindow(6, ()=>player.inventory = 20); // remove me
  lockpickWindow.active = false // remove me
  makeEnemies(3)
}

// gameInit();

function gameDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(floorCanvas, 0, 0);
  ctx.drawImage(collisionCanvas, 0, 0);
  player.draw(ctx);
  for (let en of enemies) {
    en.draw(ctx);
  }
  ctx.fillStyle = "yellow";
  // ctx.fillText("hello world", 10,10);
  if (lockpickWindow.active) lockpickWindow.draw(ctx);
}

function gameUpdate() {
  player.update();
  for (let en of enemies) {
    en.update();
  }
  if (lockpickWindow.active) lockpickWindow.update();
  lastKeys = JSON.parse(JSON.stringify(keys)); //deep copy
}

function tick() {
  let current = Date.now();
  let elapsed = current - lastTime;
  lastTime = current;
  lag += elapsed;
  while (lag >= MS_PER_UPDATE) {
    gameState.update();
    lag -= MS_PER_UPDATE;
    redraw = true;
  }
  if (redraw) {
    gameState.draw();
    redraw = false;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
