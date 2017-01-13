const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");

const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 15,
	SPEED: 5
};

class Marble extends MovingObject {
    constructor(options = {}) {
      options.color = DEFAULTS.COLOR;
      options.pos = options.pos || options.game.randomPosition();
      options.radius = DEFAULTS.RADIUS;
      options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
			super(options);
    }

    collideWith(otherObject) {
      if (otherObject instanceof Ship) {
				if(this.game.safePositions.has(otherObject.pos.toString())){
					return false;
				} else{
					otherObject.relocate([this.game.seenPositions[0][0], this.game.seenPositions[0][1]]);
					this.game.seenPositions = [];
					this.game.started = false;
				}
      return true;
      }
    }
}

module.exports = Marble;
