const MovingObject = require("./moving_object");
const Util = require("./util");

function randomColor() {
  const hexDigits = "0123456789ABCDEF";

  let color = "#";
  for (let i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

class Ship extends MovingObject {
  constructor(options) {
    options.radius = Ship.RADIUS;
    options.vel = options.vel || [0, 0];
    options.color = "green";
    super(options);
  }

  power(impulse) {
    if(this.pos[0] + (impulse[0]) < 0 || this.pos[0] + (impulse[0]) > this.game.x_limit || this.pos[1] + (impulse[1]) < 0 || this.pos[1] + (impulse[1]) > this.game.y_limit){
      return;
    }
    const current_pos = [this.pos[0], this.pos[1]];
    this.pos[0] += impulse[0];
    this.pos[1] += impulse[1];
    const next_pos = [this.pos[0], this.pos[1]];
    if(!this.game.started){
      if(this.game.safePositions.has(current_pos.toString()) && !this.game.safePositions.has(next_pos.toString())){
        this.game.started = true;
        this.game.seenPositions.push(current_pos);
        this.game.seenPositions.push(next_pos);
        this.game.seenSet.add(current_pos.toString());
        this.game.seenSet.add(next_pos.toString());
      }
    } else {
      if(this.game.safePositions.has(next_pos.toString())){
        this.game.started = false;
      }
      this.game.seenPositions.push(next_pos);
      this.game.seenSet.add(next_pos.toString());
    }
  }

  relocate(newPos) {
    this.pos = [newPos[0], newPos[1]];
  }
}

Ship.RADIUS = 10;
module.exports = Ship;
