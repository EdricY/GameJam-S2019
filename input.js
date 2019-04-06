const keys = {};
var lastKeys = {};

onkeydown = e => {
  let k = e.keyCode;
  keys[k] = true;
}

onkeyup = e => {
  let k = e.keyCode;
  keys[k] = false;
}

