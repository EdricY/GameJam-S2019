const shopMessage = document.getElementById('shopMessage');

function purchaseStamina() {
  if (walletAmt < 500) {
    shopMessage.innerHTML = "Not enough funds to buy more stamina!";
    return;
  }
  if (maxStamina >= 200) {
    shopMessage.innerHTML = "Max stamina reached!";
    return;
  }
  walletAmt -= 500;
  maxStamina += 20;
  player.stamina = maxStamina;
  document.getElementById("wallet").innerHTML = walletAmt;

}


function purchaseGuardVision() {
  if (walletAmt < 500) {
    shopMessage.innerHTML = "Not enough funds to buy decreased guard vision!";
    return;
  }
  if (VISRADIUS <= 100) {
    shopMessage.innerHTML = "Minimum Guard Vision reached!";
    return;
  }
  walletAmt -= 500;
  VISRADIUS -= 10;
  document.getElementById("wallet").innerHTML = walletAmt;

}

function purchaseGuardAccuracy() {
  if (walletAmt < 500) {
    shopMessage.innerHTML = "Not enough funds to buy decreased guard accuracy!";
    return;
  }
  if (bulletSpread > .4) {
    shopMessage.innerHTML = "Minimum Guard Accuracy reached!";
    return;
  }
  walletAmt -= 500;
  bulletSpread += .05;
  document.getElementById("wallet").innerHTML = walletAmt;

}

function purchaseHealth() {
  if (walletAmt < 500) {
    shopMessage.innerHTML = "Not enough funds to buy more health!";
    return;
  }
  if (maxHealth >= 300) {
    shopMessage.innerHTML = "Max Health reached!";
    return;
  }
  walletAmt -= 500;
  maxHealth += 20;
  player.health = maxStamina;
  document.getElementById("wallet").innerHTML = walletAmt;
}

function purchaseLock() {
  if (walletAmt < 1000) {
    shopMessage.innerHTML = "Not enough funds to buy that upgrade!";
    return;
  }
  if (onelesspin) {
    shopMessage.innerHTML = "You already have that one!";
    return;
  }
  walletAmt -= 1000;
  onelesspin = true;
  document.getElementById("wallet").innerHTML = walletAmt;
}
