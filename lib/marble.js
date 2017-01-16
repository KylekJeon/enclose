const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");

const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 15,
	SPEED: 5
};

class Marble extends MovingObject {
    constructor(level, options = {}) {
      options.color = DEFAULTS.COLOR;
      options.pos = options.pos || options.game.randomPosition();
      options.radius = DEFAULTS.RADIUS;
      options.vel = Util.randomVec(level);
			super(options);
    }

    collideWith(otherObject) {
      if (otherObject instanceof Ship) {
				if(this.game.safePositions.has(otherObject.pos.toString())){
					return false;
				} else{

				}
      return true;
      }
    }
}

module.exports = Marble;
