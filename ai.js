const enemies = [];
const PI = Math.PI;
const TAU = 2 * PI;
const VISHALFWIDTH = TAU / 12;
const VISRADIUS = 100;
const BOUNCE = PHSZ + 10

var alarm = false;

function Enemy() {
  this.x = 300;
  this.y = 300;
  this.action = 0; // 0:starts walking; 1:seeking; 2:turning
  this.timer = randInt(5, 35);
  this.theta = Math.random() * TAU - PI;
  this.thetaGoal = this.theta;
  this.basespeed = 3;
  this.speed = this.basespeed;
  this.rotateDirection = getRotationDirection();
  this.losBullets = [];
  this.update = function () {
    this.speed = this.basespeed
    if (alarm) this.speed += this.basespeed;
    let len = this.losBullets.length;
    for (let i = 0; i < len; i++) {
      let b = this.losBullets[i];
      if (b.update) b.update();
      else {
        this.losBullets.splice(i--, 1);
        len--;
      };
    }

    if (this.action == 0) { //moving
      let collided = checkCollision(this);
      if (collided == true) {
        this.action = 1;
        this.timer = 30;
      } else {
        lookaheadx = 48 * Math.cos(this.theta) + this.x;
        lookaheady = 48 * Math.sin(this.theta) + this.y;
        let lookaheadtile = getTileFromPos(mapData, lookaheadx, lookaheady);
        if (!FLOORTILES.includes(lookaheadtile)) {
          this.action = 1;
          this.timer = 30;
        }
      }
    } else if (this.action == 1) {
      if (this.timer == 30) this.shootLOSBullets();
      if (this.losBullets.length <= 0 || this.timer <= 0) {
        this.action = 2;
      }
      this.timer--;
    } else if (this.action == 2) {
      let diff = this.thetaGoal - this.theta;
      let turnspeed = this.speed/40;
      if (Math.abs(diff) > turnspeed) {
        this.theta += turnspeed*Math.sign(diff);
      } else {
        this.theta = this.thetaGoal;
        this.action = 0;
      }
    }
  }
  this.draw = function(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x - PHSZ, this.y - PHSZ, 16, 16);
    drawVisibility(ctx, this);

    // for (let b of this.losBullets) { //debug only
    //   b.draw(ctx);
    // }
  }

  this.shootLOSBullets = function() {
    let numBullets = randInt(0, 13);
    let start = (Math.random() * TAU) - PI;
    for (let i = 0; i < numBullets; i ++) {
      this.losBullets.push(
        new LOSBullet(this.x, this.y, start + i*TAU/numBullets, this)
      );
    }
  }

  this.losNotify = function(theta, dist) {
    if (dist > 8) {
      this.thetaGoal = theta;
    }
  }
}


/**
 * Get best direction to go in
 */
function LOSBullet(x, y, theta, owner) {
  this.x = x;
  this.y = y;
  this.theta = theta;
  this.speed = 14;
  this.owner = owner;
  this.dist = 0;
  this.update = function() {
    let vx = this.speed * Math.cos(this.theta);
    let vy = this.speed * Math.sin(this.theta);
    this.x += vx;
    this.y += vy;
    this.dist += this.speed;
    let tile = getTileFromPos(mapData, this.x, this.y);
    if (FLOORTILES.includes(tile)) return;
    this.owner.losNotify(this.theta, this.dist);
    this.update = null;
  }

  this.draw = function(ctx) {//debug only
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, TAU);
    ctx.fill();
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
  ctx.fillStyle = "yellow";
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(sector.x, sector.y);
  ctx.arc(sector.x, sector.y, VISRADIUS, sector.theta - VISHALFWIDTH, sector.theta + VISHALFWIDTH);
  ctx.lineTo(sector.x, sector.y);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1.0;
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
  return collided;
}
