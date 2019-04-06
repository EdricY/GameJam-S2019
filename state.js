const canvasContainer = document.getElementById('canvasContainer');
const menuDiv = document.getElementById('menuDiv');
const landingDiv = document.getElementById('landingDiv');

gameState = {
  MENU: 0, GAME: 1, TRANSITION: 2,
  state: 0,
  update: function () { },
  draw: function () { },
  hideAll: function () {
    canvasContainer.classList.add("nodisplay")
    landingDiv.classList.add("nodisplay")
    menuDiv.classList.add("nodisplay")
  }
}

function showLanding() {
  gameState.hideAll();
  landingDiv.classList.remove("nodisplay")
}

function showGame() {
  gameState.hideAll();
  canvasContainer.classList.remove("nodisplay");
  gameState.state = gameState.GAME;
  gameState.update = gameUpdate;
  gameState.draw = gameDraw;
  
}