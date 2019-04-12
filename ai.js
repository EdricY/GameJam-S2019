var enemies = [];
const PI = Math.PI;
const TAU = 2 * PI;
const VISHALFWIDTH = TAU / 12;
var VISRADIUS = 200;
const VISRSQ = VISRADIUS*VISRADIUS;
const BOUNCE = PHSZ + 10

const bullet = document.getElementById('bullet');

var bulletSpread = .2;

var alarmTime = 1000
var alarm = 0;

var aiDebug = false;

const ENEMYIMGS = [
  document.getElementById("enemy_0"),
  document.getElementById("enemy_1"),
  document.getElementById("enemy_2"),
  document.getElementById("enemy_3")
]

function Enemy(x, y) {
  this.x = x;
  this.y = y;
  this.action = 0; // 0:walking, 1:pathfinding, 2:turning, 3:chasing
  this.alerted = false; 
  this.timer = 30;
  this.theta = Math.random() * TAU - PI;
  this.thetaGoal = this.theta;
  this.basespeed = 3;
  this.animationFrame = 0;
  this.speed = this.basespeed;
  this.shootTimer = 0;
  this.reloadTime = 25;
  this.questionMarkTimer = 0;
  this.rotateDirection = getRotationDirection();
  this.pfBullets = [];
  this.losBullets = [];
  this.bullets = [];
  //TODO: make gunPosition function
  this.update = function () {
    this.shootTimer--;
    if (this.shootTimer < 0) this.shootTimer = 0;
    this.speed = this.basespeed;
    if (alarm) this.speed += this.basespeed;
    let len = this.pfBullets.length;
    for (let i = 0; i < len; i++) {
      let b = this.pfBullets[i];
      if (b.update) b.update();
      else {
        this.pfBullets.splice(i--, 1);
        len--;
      };
    }

    len = this.losBullets.length;
    for (let i = 0; i < len; i++) {
      let b = this.losBullets[i];
      if (b.update) b.update();
      else {
        this.losBullets.splice(i--, 1);
        len--;
      };
    }

    len = this.bullets.length;
    for (let i = 0; i < len; i++) {
      let b = this.bullets[i];
      if (b.update) b.update();
      else {
        this.bullets.splice(i--, 1);
        len--;
      };
    }


    if (this.withinVisibility(player)) {
      this.shootLOSBullets();
    }
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let distSq = dx*dx + dy*dy;
    if (distSq < 32*32 && !player.stealthy) { //bump!
      alarm = alarmTime;
      let dx = player.x - this.x
      let dy = player.y - this.y
      let theta = Math.atan2(dy,dx);
      let bx = this.x;
      let by = this.y;
      this.action = 2
      this.thetaGoal = theta;
      if (this.shootTimer <= 0) {
        this.bullets.push(new Bullet(bx, by, theta))
        this.shootTimer = this.reloadTime;
      }
    }

    this.questionMarkTimer--;
    //do action
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

      this.animationFrame += .2;
      if (this.animationFrame >= 4){
        this.animationFrame = 0;
      }

    } else if (this.action == 1) { //pathfinding
      if (this.timer == 30) this.shootPFBullets();
      if (this.pfBullets.length <= 0 || this.timer <= 0) {
        this.timer = 0;
        this.action = 2;
      }
      this.timer--;
      this.animationFrame = 0;
    } else if (this.action == 2) { //turning
      let diff1 = this.thetaGoal - this.theta;
      let diff2 = diff1 - TAU;
      let diff3 = diff1 + TAU;
      let diff = diff1
      if (Math.abs(diff2) < Math.abs(diff)) diff = diff2;
      if (Math.abs(diff3) < Math.abs(diff)) diff = diff3;

      let turnspeed = this.speed/40;
      if (Math.abs(diff) > turnspeed) {
        this.theta += turnspeed*Math.sign(diff);
      } else {
        this.theta = this.thetaGoal;
        this.action = 0;
        if (this.timer > 0) this.action = 3;
      }
      this.animationFrame = 0;
    } else if (this.action == 3) { //chasing
      let collided = checkCollision(this);
      this.animationFrame += .2;
      if (this.animationFrame >= 4){
        this.animationFrame = 0;
      }
      this.timer--;
      if (this.timer <= 0) {
        this.alerted = false;
        this.action = 1;
        this.questionMarkTimer = 20;
      }
    }
  }

  this.draw = function(ctx) {
    // ctx.fillStyle = "blue";
    // ctx.fillRect(this.x - PHSZ, this.y - PHSZ, 16, 16);

    let f_x = Math.round(this.x)
    let f_y = Math.round(this.y)
    let left = f_x - PLAYERSIZE; //awkward
    let top = f_y - PLAYERSIZE;
    let frame = Math.floor(this.animationFrame);
    let img = ENEMYIMGS[frame];
    let rotation = this.theta + PI/2;

    ctx.translate(f_x, f_y);
    ctx.rotate(rotation);
    ctx.drawImage(img, -PLAYERSIZE, -PLAYERSIZE);
    this.drawVisibility(ctx);
    ctx.resetTransform();

    if (this.alerted) {
      ctx.fillStyle = "red"
      ctx.font = "20px serif"
      ctx.fillText("!", f_x, f_y - PLAYERSIZE);
    } else if (this.questionMarkTimer > 0) {
      ctx.fillStyle = "red"
      ctx.font = "20px serif"
      ctx.fillText("?", f_x, f_y - PLAYERSIZE);
    }

    for (let b of this.bullets) {
      b.draw(ctx);
    }

    if (aiDebug) {
      for (let b of this.pfBullets) { //debug only
        b.draw(ctx);
      }

      for (let b of this.losBullets) { //debug only
        b.draw(ctx);
      }
    }


  }

  this.shootPFBullets = function() {
    let numBullets = randInt(0, 13);
    let start = (Math.random() * TAU) - PI;
    for (let i = 0; i < numBullets; i ++) {
      this.pfBullets.push(
        new PFBullet(this.x, this.y, start + i*TAU/numBullets, this)
      );
    }
  }

  this.shootLOSBullets = function() {
    let pt = {x:player.x, y:player.y}
    let dx = player.x - this.x
    let dy = player.y - this.y
    let theta = Math.atan2(dy,dx);
    this.losBullets.push(new LOSBullet(this.x, this.y, theta, this));
    this.losBullets.push(new LOSBullet(this.x, this.y, theta + TAU/32, this));
    this.losBullets.push(new LOSBullet(this.x, this.y, theta + TAU/64, this));
    this.losBullets.push(new LOSBullet(this.x, this.y, theta - TAU/32, this));
    this.losBullets.push(new LOSBullet(this.x, this.y, theta - TAU/64, this));

  }

  this.pfNotify = function(theta, dist) {
    if (dist > 8) {
      this.thetaGoal = theta;
    }
  }

  this.losNotify = function() {
    if (this.withinVisibility(player) && !player.stealthy) {
      alarm = alarmTime;
      let dx = player.x - this.x
      let dy = player.y - this.y
      let theta = Math.atan2(dy,dx);
      let bx = this.x;
      let by = this.y;
      if (this.shootTimer <= 0) {
        this.bullets.push(new Bullet(bx, by, theta))
        this.shootTimer = this.reloadTime;
      }
      this.alerted = true;
      this.timer = 30;
      this.action = 2;
      this.thetaGoal = theta;
    }
  }

  this.drawVisibility = function(ctx) {
    ctx.fillStyle = "yellow";
    // if (this.withinVisibility(player)) ctx.fillStyle = "red"; //debug

    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(-7,-10);
    ctx.arc(-7, -10, VISRADIUS,-VISHALFWIDTH-PI/2,VISHALFWIDTH-PI/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  this.withinVisibility = function(pt) {
    let lightx = this.x + 7 * Math.cos(this.theta);
    let lighty = this.y + 7 * Math.cos(this.theta);
    lightx += 10*Math.cos(this.theta - PI/2)
    lighty += 10*Math.sin(this.theta - PI/2)
    let dx = pt.x - lightx;
    let dy = pt.y - lighty;
    let distSq = dx*dx + dy*dy;
    // if (distSq > VISRSQ) {
    if (distSq > VISRSQ + 48*48) {
      return false;
    }

    theta = Math.atan2(dy,dx);
    anglediff = mod(this.theta - theta + Math.PI + TAU, TAU) - Math.PI
    anglediff = (anglediff % TAU)
    // if (Math.abs(anglediff) > VISHALFWIDTH + TAU/24) return false;
    if (Math.abs(anglediff) > VISHALFWIDTH) return false;

    return true;

  }
}

function LOSBullet(x, y, theta, owner) {
  this.x = x;
  this.y = y;
  this.theta = theta;
  this.speed = 12;
  this.owner = owner;
  this.dist = 0;
  this.update = function() {
    let vx = this.speed * Math.cos(this.theta);
    let vy = this.speed * Math.sin(this.theta);
    this.x += vx;
    this.y += vy;
    this.dist += this.speed;
    if (this.dist > VISRADIUS) {
      this.update = null;
      return;
    }
    let tile = getTileFromPos(mapData, this.x, this.y);
    if (!FLOORTILES.includes(tile)) { //hit wall
      this.update = null;
      return;
    }
    if (this.intersectsPlayer()) {
      this.owner.losNotify();
    }
  }

  this.intersectsPlayer = function() {
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let distSq = dx*dx + dy*dy;
    return distSq < PLAYERSIZE*PLAYERSIZE;
  }

  this.draw = function(ctx) {//debug only
    ctx.fillStyle = "lime";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, TAU);
    ctx.fill();
  }
}

/**
 * Get best direction to go in
 */
function PFBullet(x, y, theta, owner) {
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
    this.owner.pfNotify(this.theta, this.dist);
    this.update = null;
  }

  this.draw = function(ctx) {//debug only
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, TAU);
    ctx.fill();
  }
}

function Bullet(x, y, t) {
  this.x = x;
  this.y = y;
  this.x += 7 * Math.cos(t);
  this.y += 7 * Math.sin(t);
  this.x += 10 * Math.cos(t - PI/2)
  this.y += 10 * Math.sin(t - PI/2)
  this.theta = t - Math.random() * bulletSpread + Math.random() * bulletSpread;

  this.bulletSpeed = 10;
  this.update = function() {
    let vx = this.bulletSpeed * Math.cos(this.theta);
    let vy = this.bulletSpeed * Math.sin(this.theta);
    this.x += vx;
    this.y += vy;
    if (this.intersectsPlayer()) {
      if(player.health > 0) {
        Particles.explode(player.x, player.y, 'red', 20, 5)
        play_injury_noise();
      }
      // if(player.health > 0) play_injury_noise();
      player.health -= 20;
      this.update = null;
      return;
    }
    let tile = getTileFromPos(mapData, this.x, this.y);
    if (FLOORTILES.includes(tile)) return;
    this.update = null;
  }

  this.draw = function(ctx) {
    let f_x = Math.round(this.x)
    let f_y = Math.round(this.y)
    let rotation = this.theta + PI/2;

    ctx.translate(f_x, f_y);
    ctx.rotate(rotation);
    ctx.drawImage(bullet, -2, -3); //3x6
    ctx.resetTransform();
  }

  this.intersectsPlayer = function() {
    let dx = player.x - this.x;
    let dy = player.y - this.y;
    let distSq = dx*dx + dy*dy;
    return distSq < PHSZ*PHSZ;
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
    let pos = ENEMY_SPAWN_LOCATIONS[mapID][randInt(0, 4)]
    enemies.push(new Enemy(pos.x, pos.y));
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
