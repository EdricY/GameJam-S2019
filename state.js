const canvasContainer = document.getElementById('canvasContainer');
const menuDiv = document.getElementById('menuDiv');
const landingDiv = document.getElementById('landingDiv');
const instructionsDiv = document.getElementById('instructionsDiv');
const upgradesDiv = document.getElementById('upgradesDiv');
const TILE_OFFSET = 16;

const PLAYER_SPAWN_LOCATIONS = {
  0: {x : 5 * TILE_OFFSET, y : 5 * TILE_OFFSET},
  1: {x : 45 * TILE_OFFSET, y : 15 * TILE_OFFSET},
  2: {x : 1 * TILE_OFFSET, y : 16 * TILE_OFFSET},
  3: {x : 24 * TILE_OFFSET, y : 30 * TILE_OFFSET},
  4: {x : 24 * TILE_OFFSET, y : 30 * TILE_OFFSET},
  5: {x : 1 * TILE_OFFSET, y : 16 * TILE_OFFSET},
  6: {x : 1 * TILE_OFFSET, y : 16 * TILE_OFFSET},
  7: {x : 1 * TILE_OFFSET, y : 29 * TILE_OFFSET},
  8: {x : 1 * TILE_OFFSET, y : 16 * TILE_OFFSET},
  9: {x : 24 * TILE_OFFSET, y : 30 * TILE_OFFSET},
  10: {x : 24 * TILE_OFFSET, y : 1 * TILE_OFFSET},
  11: {x : 42 * TILE_OFFSET, y : 1 * TILE_OFFSET},
  12: {x : 24 * TILE_OFFSET, y : 1 * TILE_OFFSET},
  13: {x : 1 * TILE_OFFSET, y : 16 * TILE_OFFSET},
  14: {x : 4 * TILE_OFFSET, y : 30 * TILE_OFFSET},
};

const ENEMY_SPAWN_LOCATIONS = {
  0: [
      {x : 22 * TILE_OFFSET, y : 13 * TILE_OFFSET},
      {x : 22 * TILE_OFFSET, y : 13 * TILE_OFFSET},
      {x : 22 * TILE_OFFSET, y : 13 * TILE_OFFSET},
      {x : 22 * TILE_OFFSET, y : 13 * TILE_OFFSET},
  ],
  1: [
      {x:  4 * TILE_OFFSET, y : 12 * TILE_OFFSET},
      {x: 36 * TILE_OFFSET, y : 9  * TILE_OFFSET},
      {x: 21 * TILE_OFFSET, y : 4  * TILE_OFFSET},
      {x: 21 * TILE_OFFSET, y : 28 * TILE_OFFSET},
  ],
  2: [
      {x : 4   * TILE_OFFSET, y : 2 * TILE_OFFSET},
      {x : 22 * TILE_OFFSET, y : 16 * TILE_OFFSET},
      {x : 22 * TILE_OFFSET, y : 29 * TILE_OFFSET},
      {x : 43 * TILE_OFFSET, y : 27 * TILE_OFFSET},
  ],
  3: [
      {x : 1  * TILE_OFFSET, y : 3  * TILE_OFFSET},
      {x : 43 * TILE_OFFSET, y : 11 * TILE_OFFSET},
      {x : 15 * TILE_OFFSET, y : 23 * TILE_OFFSET},
      {x : 24 * TILE_OFFSET, y : 11 * TILE_OFFSET},
  ],
  4: [
      {x : 3  * TILE_OFFSET, y : 18 * TILE_OFFSET},
      {x : 41 * TILE_OFFSET, y : 15 * TILE_OFFSET},
      {x : 8  * TILE_OFFSET, y : 5  * TILE_OFFSET},
      {x : 23 * TILE_OFFSET, y : 14 * TILE_OFFSET},
  ],
  5: [
      {x : 8  * TILE_OFFSET, y : 2  * TILE_OFFSET},
      {x : 35 * TILE_OFFSET, y : 8  * TILE_OFFSET},
      {x : 8  * TILE_OFFSET, y : 28 * TILE_OFFSET},
      {x : 35 * TILE_OFFSET, y : 22 * TILE_OFFSET},
  ],
  6: [
      {x : 39 * TILE_OFFSET, y : 5  * TILE_OFFSET},
      {x : 23 * TILE_OFFSET, y : 11 * TILE_OFFSET},
      {x : 43 * TILE_OFFSET, y : 16 * TILE_OFFSET},
      {x : 7  * TILE_OFFSET, y : 26 * TILE_OFFSET},
  ],
  7: [
      {x : 10 * TILE_OFFSET, y : 11 * TILE_OFFSET},
      {x : 38 * TILE_OFFSET, y : 31 * TILE_OFFSET},
      {x : 5 * TILE_OFFSET, y : 8 * TILE_OFFSET},
      {x : 25 * TILE_OFFSET, y : 0 * TILE_OFFSET},
  ],
  8: [
      {x : 7 * TILE_OFFSET, y : 0 * TILE_OFFSET},
      {x : 7 * TILE_OFFSET, y : 31 * TILE_OFFSET},
      {x : 47 * TILE_OFFSET, y : 24 * TILE_OFFSET},
      {x : 35 * TILE_OFFSET, y : 0 * TILE_OFFSET},
  ],
  9: [
      {x : 40 * TILE_OFFSET, y : 5 * TILE_OFFSET},
      {x : 6 * TILE_OFFSET, y : 2 * TILE_OFFSET},
      {x : 0 * TILE_OFFSET, y : 21 * TILE_OFFSET},
      {x : 46 * TILE_OFFSET, y : 25 * TILE_OFFSET},
  ],
  10: [
    {x : 19 * TILE_OFFSET, y : 17 * TILE_OFFSET},
    {x : 41 * TILE_OFFSET, y : 9 * TILE_OFFSET},
    {x : 15 * TILE_OFFSET, y : 31 * TILE_OFFSET},
    {x : 6 * TILE_OFFSET, y : 16 * TILE_OFFSET},
  ],
  11: [
    {x : 45 * TILE_OFFSET, y : 15 * TILE_OFFSET},
    {x : 3 * TILE_OFFSET, y : 20 * TILE_OFFSET},
    {x : 17 * TILE_OFFSET, y : 10 * TILE_OFFSET},
    {x : 23 * TILE_OFFSET, y : 25 * TILE_OFFSET},
  ],
  12: [
    {x : 5 * TILE_OFFSET, y : 2 * TILE_OFFSET},
    {x : 39 * TILE_OFFSET, y : 7 * TILE_OFFSET},
    {x : 42 * TILE_OFFSET, y : 27 * TILE_OFFSET},
    {x : 9 * TILE_OFFSET, y : 23 * TILE_OFFSET},
  ],
  13: [
    {x : 34 * TILE_OFFSET, y : 27 * TILE_OFFSET},
    {x : 37 * TILE_OFFSET, y : 17 * TILE_OFFSET},
    {x : 14 * TILE_OFFSET, y : 27 * TILE_OFFSET},
    {x : 20 * TILE_OFFSET, y : 2 * TILE_OFFSET},
  ],
  14: [
    {x : 45 * TILE_OFFSET, y : 11 * TILE_OFFSET},
    {x : 4 * TILE_OFFSET, y : 5 * TILE_OFFSET},
    {x : 32 * TILE_OFFSET, y : 19 * TILE_OFFSET},
    {x : 19 * TILE_OFFSET, y : 8 * TILE_OFFSET},
  ],
};

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
  goBtn.disabled = true;
  setTimeout(() => {
    setMapData(mapID);
    player = new Player(PLAYER_SPAWN_LOCATIONS[window.mapID].x, PLAYER_SPAWN_LOCATIONS[window.mapID].y)
    previewctx.drawImage(floorCanvas, 0, 0);
    previewctx.drawImage(collisionCanvas, 0, 0);
    let divID = mapID + "-div";
    selectSquare(divID);
    goBtn.disabled = false;
  }, 0)

}



function selectSquare(divID) {
  for (let child of levelSquares.children) child.classList.remove('squareSelected')
  document.getElementById(divID).classList.add('squareSelected')
}
