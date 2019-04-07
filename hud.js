function drawHUD(ctx) {
  ctx.fillStyle = "#444";
  ctx.fillRect(0, H+1, W, 64);
  // width 20 margin 8

  //stamina
  ctx.strokeStyle = "black";
  ctx.strokeRect(10, 512+8, player.maxStamina, 20)
  ctx.fillStyle = "yellow";
  ctx.fillRect(10, 512+8, Math.round(player.stamina), 20)

  //alarm
  ctx.strokeRect(10, 512+16+20, alarmTime/5, 20)
  ctx.fillStyle = "red";
  ctx.fillRect(10, 512+16+20, Math.round(alarm/5), 20)

  // ctx.strokeRect(W - 10 - alarmTime/5, 536, alarmTime/5, 15)
  // ctx.fillStyle = "red";
  // ctx.fillRect(W - 10 - alarm/5, 536, Math.round(alarm/5), 15)

}
