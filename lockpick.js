lockchamber = document.getElementById("lockchamber")
lockpin = document.getElementById("lockpin")

var holdMode = false;
const PINW = 64;
lockPickProgress = 0;
function LockpickWindow(numPins) {
  this.chambers = [];
  this.pattern = getRandomPattern(numPins);
  this.active = true;
  this.holdTimer = 30;
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
    for (let i = 0; i < numPins; i++) {
      this.chambers[i].update();
    }

    if (lockPickProgress >= numPins) {
      if (this.holdTimer > 0) this.holdTimer--;
      else this.active = false;
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
            lockPickProgress = 0;
          }
        }
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        let keycode = customKeycodes[i-1];
        if (keys[keycode] && !lastKeys[keycode]) {
          if (i == next) lockPickProgress++;
          else lockPickProgress = 0;
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
  this.draw = function (ctx) {
    ctx.drawImage(lockchamber, this.x, this.y)
    ctx.drawImage(lockpin, this.x, this.pinY)
  }

  this.update = function() {
    if (lockPickProgress > this.seq) this.pinYGoal = this.y - 20;
    else this.pinYGoal = this.pinStart;
    let diff = this.pinYGoal - this.pinY;
    if (Math.abs(diff) < 2) this.pinY = this.pinYGoal;
    else this.pinY += 2*Math.sign(diff);

  }
}