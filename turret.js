const PI = Math.PI;
const TAU = PI * 2;
const ROTATEDIST = PI/100;

const TURRETS = [];

const BULLETS = [];

function Turret(x, y) {
  this.size = 16;
  this.x = x;
  this.y = y;
  this.theta = 0;
  this.rotateDir = randInt(0, 2) % 2 == 0 ? -1 : 1;
  this.shoot = function() {
    addBullet(this);
  }
  this.update = function() {
    if(this.rotateDir > 0) {
      this.theta += ROTATEDIST;
    } else {
      this.theta -= ROTATEDIST;
    }
    if(Math.abs(this.theta) > PI) this.rotateDir *= -1; //reset direction
  }
  this.draw = function(ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.moveTo(this.x, this.y);
    ctx.fillStyle = "red";
    ctx.lineTo(100 * Math.cos(this.theta), 100 * Math.sin(this.theta));
  }
}

function addTurret(n) {
  for(let i = 0; i < n; i++) {
    TURRETS.push(new Turret(20, 20));
  }
}

function updateTurrets() {
  for(let i = 0; i < TURRETS.length; i++) {
    TURRETS[i].update();
    TURRETS[i].draw();
  }
}



function Bullet(x, y, t) {
  this.flag = false;
  this.id = i;
  this.x = x;
  this.y = y;
  this.theta = t;
  this.bulletSpeed = 10;
  this.update = function() {
    if(collisionMap[this.x][this.y]) {
      this.update = null;
    }
    let vx = this.bulletSpeed * Math.cos(this.theta);
    let vy = this.bulletSpeed * Math.sin(this.theta);
    this.x += vx;
    this.y += vy;
    if(this.y < 0 || this.y > 511) this.update = null;
    if(this.x < - || this.x > 767) this.update = null;
  }
}

function addBullet(person) {
  BULLETS.push(new Bullet(bulletCounter++, person.x, person.y, person.theta));
}

function removeFlagged() {
  for(let i = 0; i < BULLETS.length; i++) {
    if(BULLETS[i].flag == id) {
      BULLETS.splice(i, 1);
      return;
    }
  }
}

function updateBullets() {
  let len = BULLETS.length;
  for(let i = 0; i < len; i++) {
    if(BULLETS[i].update) {
      BULLETS[i].update();
    } else {
      BULLETS.splice(i--, 1);
      len--;
    }
  }
}

updateTurrets();
