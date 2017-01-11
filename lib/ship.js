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
    options.color = options.color || randomColor();
    super(options);
    this.started = false;
  }

  power(impulse) {
    if(this.pos[0] + impulse[0] < 0 || this.pos[0] + impulse[0] > this.game.x_limit || this.pos[1] + impulse[1] < 0 || this.pos[1] + impulse[1] > this.game.y_limit){
      return;
    }
    const current_pos = [this.pos[0], this.pos[1]];
    this.pos[0] += impulse[0];
    this.pos[1] += impulse[1];
    const next_pos = [this.pos[0], this.pos[1]];
    if(!this.started){
      if(this.game.filledPositions.has(current_pos.toString()) && !this.game.filledPositions.has(next_pos.toString())){
        this.started = true;
        this.game.seenPositions.push(current_pos);
        this.game.seenPositions.push(next_pos);
      }
    } else {
      if(this.game.filledPositions.has(next_pos.toString())){
        this.started = false;
      }
      this.game.seenPositions.push(next_pos);
    }
  }

  relocate() {
    this.pos = [0, 0];
    this.vel = [0, 0];
  }
}

Ship.RADIUS = 15;
module.exports = Ship;
