const canvas = document.getElementById('canvas');
const W = canvas.width;
const H = canvas.height;
const ctx = canvas.getContext('2d')
var mapData = [];
var collisionMap = [];


//returns x where min <= x < max
function randInt(min, max) {
  let range = max - min;
  return Math.floor(min + (Math.random() * range));
}