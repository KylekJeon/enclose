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
    const next_pos = [Math.round(this.pos[0] + offsetX), Math.round(this.pos[1] + offsetY)];
    if(this.game.filledPositions.has(cur_pos.toString()) && this.game.filledPositions.has(next_pos.toString())){
      this.remove();
    }
    const x_vel = this.vel[0];
    const y_vel = this.vel[1];
    if(this.game.hitWall(next_pos)){
      if(x_vel <= 0 && y_vel >= 0){
        this.vel[1] = -y_vel;
      } else if(x_vel >= 0 && y_vel >= 0){
        this.vel[1] = -y_vel;
      } else if(x_vel <= 0 && y_vel <= 0){
        this.vel[0] = -x_vel;
      } else if(x_vel >= 0 && y_vel <= 0){
        this.vel[0] = -x_vel;
      }
    }
    offsetX = this.vel[0] * velocityScale;
    offsetY = this.vel[1] * velocityScale;
    this.pos = [(this.pos[0] + offsetX), (this.pos[1] + offsetY)];
  }

  remove() {
    this.game.remove(this);
  }
}

const NORMAL_FRAME_TIME_DELTA = 1000/60;

module.exports = MovingObject;
