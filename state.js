const canvasContainer = document.getElementById('canvasContainer');
const menuDiv = document.getElementById('menuDiv');
const landingDiv = document.getElementById('landingDiv');
const instructionsDiv = document.getElementById('instructionsDiv');
const upgradesDiv = document.getElementById('upgradesDiv');

gameState = {
  MENU: 0, GAME: 1, TRANSITION: 2,
  state: 0,
  update: function () { },
  draw: function () { },
  hideAll: function () {
    canvasContainer.classList.add("nodisplay")
    landingDiv.classList.add("nodisplay")
    menuDiv.classList.add("nodisplay")
    instructionsDiv.classList.add("nodisplay")
    upgradesDiv.classList.add("nodisplay")
  }
}

function showLanding() {
  gameState.hideAll();
  landingDiv.classList.remove("nodisplay")
}

function showMenu() {
  gameState.hideAll();
  menuDiv.classList.remove("nodisplay")
}

function showInstructions() {
  gameState.hideAll();
  instructionsDiv.classList.remove("nodisplay")
}

function showUpgrades() {
  gameState.hideAll();
  upgradesDiv.classList.remove("nodisplay")
}

function showGame() {
  gameState.hideAll();
  canvasContainer.classList.remove("nodisplay");
  gameState.state = gameState.GAME;
  gameInit();
  gameState.update = gameUpdate;
  gameState.draw = gameDraw;
}


const levelSquares = document.getElementById('levelSquares');
const goBtn = document.getElementById('goBtn');
const preview = document.getElementById('preview');
const previewctx = preview.getContext('2d');

for (let mapID of MAPIDS) {
  addLevelSquare(mapID);
}

function addLevelSquare(mapID) {
  let sq = createLevelSquare(mapID);
  if (sq) levelSquares.appendChild(sq);
}
function createLevelSquare(mapID) {
  let sq = document.createElement('div');
  sq.classList.add('square');
  sq.id = mapID + "-div"
  sq.onclick = e => squareonclick(e, mapID);
  let sqInner = document.createElement('div');
  sqInner.innerHTML = levelSquares.children.length + 1;
  sq.appendChild(sqInner);
  return sq;
}

function squareonclick(e, mapID) {
  goBtn.disabled = false;
  setMapData(mapID);
  previewctx.drawImage(floorCanvas, 0, 0);
  previewctx.drawImage(collisionCanvas, 0, 0);
  let divID = mapID + "-div";
  selectSquare(divID);
}

function selectSquare(divID) {
  for (let child of levelSquares.children) child.classList.remove('squareSelected')
  document.getElementById(divID).classList.add('squareSelected')
}
