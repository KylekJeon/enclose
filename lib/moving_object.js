const Util = require("./util");

class MovingObject {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.isWrappable = true;
    this.ctx = options.ctx;
  }

  collideWith(otherObject) {
    // default do nothing
  }

  draw(ctx) {
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  }

  isCollidedWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  }

  move(timeDelta) {
    //timeDelta is number of milliseconds since last move
    //if the computer is busy the time delta will be larger
    //in this case the MovingObject should move farther in this frame
    //velocity of object is how far it should move in 1/60th of a second
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
    let offsetX = this.vel[0] * velocityScale;
    let offsetY = this.vel[1] * velocityScale;
    const cur_pos = [Math.round(this.pos[0]), Math.round(this.pos[1])];
    let next_pos = [Math.round(this.pos[0] + offsetX), Math.round(this.pos[1] + offsetY)];
    if(this.game.filledPositions.has(cur_pos.toString()) && this.game.filledPositions.has(next_pos.toString())){
      this.remove();
    }
    const x_vel = this.vel[0];
    const y_vel = this.vel[1];
    if(this.game.hitWall(next_pos)){
      const next_vel = this.checkRebound(next_pos, this.vel);
      if(next_vel === "x"){
        this.vel[0] = -this.vel[0];
      } else if(next_vel === "y"){
        this.vel[1] = -this.vel[1];
      } else {
        this.vel[0] = -this.vel[0];
        this.vel[1] = -this.vel[1];
      }
    }
    offsetX = this.vel[0] * velocityScale;
    offsetY = this.vel[1] * velocityScale;
    this.pos = [(this.pos[0] + offsetX), (this.pos[1] + offsetY)];
  }

  checkRebound(pos, vel){
    let x;
    let y;
    let found = false;
    if (vel[0] < 0){
      x = -1;
    } else {
      x = 1;
    }
    if (vel[1] < 0){
      y = -1;
    } else {
      y = 1;
    }

    let firstPos = pos.slice();
    const set1 = [-x, y];

    let secondPos = pos.slice();
    const set2 = [x, -y];
    let count = 0;
    while(!found && count < 40){
      firstPos = [(firstPos[0] + set1[0]), (firstPos[1] + set1[1])];
      secondPos = [(secondPos[0] + set2[0]), (secondPos[1] + set2[1])];
      if(!this.game.hitWall(firstPos)){
        found = "firstPos";
      }
      if(!this.game.hitWall(secondPos)){
        found = "secondPos";
      }
      count++;
    }

    if(found === "firstPos"){
      return "x";
    } else if(found === "secondPos"){
      return "y";
    } else {
      return "z";
    }
  }

  remove() {
    this.game.remove(this);
  }
}

const NORMAL_FRAME_TIME_DELTA = 1000/60;

module.exports = MovingObject;
