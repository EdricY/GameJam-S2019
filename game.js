var canvas = document.getElementById('canvas');
const W = canvas.width;
const H = canvas.height;
var ctx = canvas.getContext('2d')

const UPDATES_PER_SEC = 30;
const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;
var lastTime = Date.now();
var lag = 0;
var redraw = false;

function gameDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red"
  ctx.fillRect(100, 100, 20, 10)

}

function gameUpdate() {

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