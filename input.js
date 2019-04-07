const keys = {};
var lastKeys = {};

onkeydown = e => {
  let k = e.keyCode;
  if (k == 32) e.preventDefault();
  keys[k] = true;
}

onkeyup = e => {
  let k = e.keyCode;
  keys[k] = false;
}
