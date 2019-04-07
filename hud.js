function drawHUD(ctx) {
  ctx.fillStyle = "#444";
  ctx.fillRect(0, H+1, W, 64);
  // width 20 margin 8

  //stamina
  ctx.strokeStyle = "black";
  ctx.strokeRect(50, 512+4, maxStamina, 15)
  ctx.fillStyle = "yellow";
  ctx.fillRect(50, 512+4, Math.round(player.stamina), 15)
  ctx.fillStyle = "white";
  ctx.fillText("SP", 30, 512+4+10)


  //health
  ctx.strokeRect(50, 512+8+15, maxHealth, 15)
  ctx.fillStyle = "red";
  ctx.fillRect(50, 512+8+15, Math.round(player.health), 15)
  ctx.fillStyle = "white";
  ctx.fillText("HP", 30, 512+8+15+10)

  //alarm
  ctx.strokeRect(50, 512+12+30, alarmTime/5, 15)
  ctx.fillStyle = "orange";
  ctx.fillRect(50, 512+12+30, Math.round(alarm/5), 15)
  ctx.fillStyle = "white";
  ctx.fillText("!", 30, 512+12+30+10)

  // ctx.strokeRect(W - 10 - alarmTime/5, 536, alarmTime/5, 15)
  // ctx.fillStyle = "red";
  // ctx.fillRect(W - 10 - alarm/5, 536, Math.round(alarm/5), 15)

}
