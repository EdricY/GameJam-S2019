const INJURIES = [];
const LOCK_PICKING = [];
const SAFE_OPENING = new Audio("resrc/safe_opening.wav");
const ALARM = new Audio("resrc/alarm_sound.wav");
const BACKGROUND = new Audio("resrc/Lee_Rosevere_-_12_-_Dont_Trust_the_Cloud.wav");

INJURIES.push(new Audio("resrc/injury_0.wav"));
INJURIES.push(new Audio("resrc/injury_1.wav"));
INJURIES.push(new Audio("resrc/injury_2.wav"));
LOCK_PICKING.push(new Audio("resrc/lock_picking_0.wav"));
LOCK_PICKING.push(new Audio("resrc/lock_picking_1.wav"));
LOCK_PICKING.push(new Audio("resrc/lock_picking_2.wav"));
LOCK_PICKING.push(new Audio("resrc/lock_picking_3.wav"));

function play_lock_picking_noise() {
  let song = randInt(0, 4);
  LOCK_PICKING[song].pause();
  LOCK_PICKING[song].play();
}

function play_injury_noise() {
  let song = randInt(0, 3);
  INJURIES[song].pause();
  INJURIES[song].play();
}

function play_open_noise() {
  SAFE_OPENING.pause();
  SAFE_OPENING.play();
}

function play_background_music() {
  BACKGROUND.loop = true;
  BACKGROUND.pause();
  BACKGROUND.play();
}
