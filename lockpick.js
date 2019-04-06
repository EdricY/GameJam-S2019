const lockchamber = document.getElementById("lockchamber")
const lockpin = document.getElementById("lockpin")
const holdCheckbox = document.getElementById("holdCheckbox")
const PINW = 64;
var lockPickProgress = 0;
var holdMode = false;
holdCheckbox.onchange = () => holdMode = holdCheckbox.checked

function LockpickWindow(numPins, callback) {
  this.chambers = [];
  this.pattern = getRandomPattern(numPins);
  this.active = true;
  this.holdTimer = 30;
  this.callback = callback;
  let fullwidth = PINW * numPins;
  let firstx = W / 2 - fullwidth / 2;
  for (let i = 0; i < numPins; i++) {
    this.chambers.push(new LockChamber(firstx + i * PINW, i));
  }

  this.draw = function (ctx) {
    let temp = ctx.globalAlpha;
    ctx.globalAlpha = .7 - (.7*(1-(this.holdTimer/30)));
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, W, H)
    ctx.globalAlpha = temp;
    for (let i = 0; i < numPins; i++) {
      this.chambers[i].draw(ctx);
    }
  }


  this.update = function () {
    if (keys[27]) { //escape
      this.active = false;
      lockPickProgress = 0;
      return;
    }
    for (let i = 0; i < numPins; i++) {
      this.chambers[i].update();
    }

    if (lockPickProgress >= numPins) { //success!
      if (this.holdTimer > 0) this.holdTimer--;
      else {
        this.active = false;
        lockPickProgress = 0;
        if (this.callback) this.callback();
      }
      return
    }

    let next = this.pattern[lockPickProgress];
    if (holdMode) {
      let required = this.pattern.slice(0, lockPickProgress)
      for (let i = 1; i <= 6; i++) {
        let keycode = customKeycodes[i-1];
        if (required.includes(i)) {
          if (!keys[keycode]) {
            lockPickProgress = 0;
          }
        } else {
          if (i == next) {
            if (keys[keycode] && !lastKeys[keycode]) {
              lockPickProgress++;
            }
          } else if (keys[keycode]) {
            this.chambers[lockPickProgress].pulse();
            lockPickProgress = 0;
          }
        }
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        let keycode = customKeycodes[i-1];
        if (keys[keycode] && !lastKeys[keycode]) {
          if (i == next) lockPickProgress++;
          else {
            this.chambers[lockPickProgress].pulse();
            lockPickProgress = 0;
          }
        }
      }
    }
  }
}
//97,98,99,100,101,102
//49,50,51,52,53,54
var customKeycodes = [49,50,51,52,53,54]


function getRandomPattern(numPins) {
  return shuffle([1, 2, 3, 4, 5, 6]).slice(0, numPins);
}

function LockChamber(x, seq) {
  this.seq = seq;
  this.w = PINW;
  this.h = 96;
  this.y = H / 2 - this.h / 2;
  this.pinStart = this.y - randInt(0, 10);
  this.pinY = this.pinStart;
  this.pinYGoal = this.pinY;
  this.x = x;
  this.pulseTimer = 0;
  this.draw = function (ctx) {
    let pinX = this.x;
    if (this.pulseTimer) {
      pinX += -1*Math.cos(1024*this.pulseTimer)
    }
    ctx.drawImage(lockchamber, this.x, this.y)
    ctx.drawImage(lockpin, pinX, this.pinY)
  }

  this.update = function() {
    if (lockPickProgress > this.seq) {
      this.pinYGoal = this.y - 20;
      this.pulseTimer = 0;
    }
    else this.pinYGoal = this.pinStart;
    let diff = this.pinYGoal - this.pinY;
    if (Math.abs(diff) < 2) this.pinY = this.pinYGoal;
    else this.pinY += 2*Math.sign(diff);

    this.pulseTimer = Math.max(0, this.pulseTimer-1);
  }

  this.pulse = function () {
    this.pulseTimer = 15;
  }
}
