
const UPDATES_PER_SEC = 30;
const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;
var lastTime = Date.now();
var lag = 0;
var redraw = false;

var player = new Player();

function gameInit() {
  setMapData("map2");
}

gameInit();

function gameDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap(ctx, mapData);
  player.draw(ctx);
  ctx.fillStyle = "yellow";
  ctx.fillText(getLocalTiles(player), 10,10);
}

function gameUpdate() {
  player.update()
}

function tick() {
  let current = Date.now();
  let elapsed = current - lastTime;
  lastTime = current;
  lag += elapsed;
  while (lag >= MS_PER_UPDATE) {
    gameUpdate();
    lag -= MS_PER_UPDATE;
    redraw = true;
  }
  if (redraw) {
    gameDraw();
    redraw = false;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
