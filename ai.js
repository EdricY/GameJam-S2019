const enemies = [];
const PI = Math.PI;
const TAU = 2 * PI;
const VISHALFWIDTH = TAU / 12;
const VISRADIUS = 100;
const BOUNCE = PHSZ + 10

function Enemy() {
  this.x = 300;
  this.y = 300;
  this.action = 0; // 0 = starts walking; 1 = turning
  this.timer = randInt(5, 35);
  this.theta = Math.random() * TAU - PI;
  this.speed = 3;
  this.rotateDirection = getRotationDirection();
  this.update = function () {
    if (this.action == 0) {
      this.timer--;
    } else {
      rotateAI(this);
    }
    checkCollision(this);
  }
  this.draw = function (ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x - PHSZ, this.y - PHSZ, 16, 16);
    drawVisibility(ctx, this);
  }
}


/**
 * Change AI's action and reset their timer
 */
function resetAI(person) {
  person.action = (++person.action % 2);
  person.timer = randInt(12, 35);
}


/**
 * Generate @num enemies on the map
 */
function makeEnemies(num) {
  for (let i = 0; i < num; i++) {
    enemies.push(new Enemy());
  }
}


/**
 * Rotate AI
 */
function rotateAI(person) {
  if (person.timer > 0) {
    person.timer--;
    person.theta += person.rotateDirection;
  } else {
    person.timer = randInt(5, 35);
    person.action = (++person.action) % 2;
    person.rotateDirection = getRotationDirection();
  }
}


/**
 * Generate direction for AI to turn towards
 */
function getRotationDirection() {
  return randInt(0, 2) ? -(TAU / 100) : (TAU / 100);
}


/**
 * Run the update() function for each enemy
 */
function updateAI() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
  }
}


/**
 * Render enemy visibility
 */
function drawVisibility(ctx, sector) {
  ctx.fillStyle = "cyan";
  ctx.beginPath();
  ctx.moveTo(sector.x, sector.y);
  ctx.arc(sector.x, sector.y, VISRADIUS, sector.theta - VISHALFWIDTH, sector.theta + VISHALFWIDTH);
  ctx.lineTo(sector.x, sector.y);
  ctx.fill();
  ctx.stroke();
}


/**
 * Check to see if Enemy is going to collide with the wall
 */
function checkCollision(person) {
  person.vx = person.speed * Math.cos(person.theta);
  person.vy = person.speed * Math.sin(person.theta);
  let collided = false;
  if (person.vy > 0) { //moving down
    let y_cls = findYCollisionDown(person.y - PHSZ, person.vy, person.x - PHSZ, PLAYERSIZE+5, PLAYERSIZE+5);
    if (y_cls == null) {
      person.y += person.vy;
    } else { //landed on something
      person.vy = 0;
      person.y = y_cls.y + PHSZ;
      collided = true;
    }
  } else if (person.vy < 0) { //moving up
    let y_cls = findYCollisionUp(person.y - PHSZ, person.vy, person.x - PHSZ, PLAYERSIZE+5, PLAYERSIZE+5);
    person.midair = true;
    if (y_cls == null) {
      person.y += person.vy;
    } else { //hit your head
      person.vy = 0;
      person.y = y_cls.y + PHSZ;
      collided = true;
    }
  }

  if (person.vx > 0) { //moving right
    let x_cls = findXCollisionRight(person.x - PHSZ, person.vx, person.y - PHSZ, PLAYERSIZE+5, PLAYERSIZE+5);
    if (x_cls == null) person.x += person.vx;
    else { //hit wall
      person.vx = 0;
      person.x = x_cls.x + PHSZ;
      collided = true;
    }
  } else if (person.vx < 0) { //moving left
    let x_cls = findXCollisionLeft(person.x - PHSZ, person.vx, person.y - PHSZ, PLAYERSIZE+5, PLAYERSIZE+5);
    if (x_cls == null) person.x += person.vx;
    else { //hit wall
      person.vx = 0;
      person.x = x_cls.x + PHSZ;
      collided = true;
    }
  }
  if (collided) resetAI(person);
}