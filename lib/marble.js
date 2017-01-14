const Util = require("./util");
const MovingObject = require("./moving_object");
const Ship = require("./ship");

const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 15,
	SPEED: 4
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

				}
      return true;
      }
    }
}

module.exports = Marble;
