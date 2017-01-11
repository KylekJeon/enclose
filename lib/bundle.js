/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(6);
	
	document.addEventListener("DOMContentLoaded", function () {
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Marble = __webpack_require__(2);
	var Ship = __webpack_require__(5);
	var Util = __webpack_require__(3);
	
	var Game = function () {
	  function Game() {
	    _classCallCheck(this, Game);
	
	    this.marbles = [];
	    this.ships = [];
	    this.filledPositions = new Set();
	    this.shapesArray = [];
	    this.seenPositions = [];
	    this.addMarbles();
	    this.addFilledPositions();
	    this.x_limit = Game.DIM_X;
	    this.y_limit = Game.DIM_Y;
	    this.found = false;
	  }
	
	  _createClass(Game, [{
	    key: "addFilledPositions",
	    value: function addFilledPositions() {
	      for (var i = 0; i <= Game.DIM_Y; i += 10) {
	        var top = "0," + i;
	        var bottom = Game.DIM_X + "," + i;
	        this.filledPositions.add(top);
	        this.filledPositions.add(bottom);
	      }
	      for (var _i = 0; _i <= Game.DIM_X; _i += 10) {
	        var left = _i + ",0";
	        var right = _i + "," + Game.DIM_Y;
	        this.filledPositions.add(left);
	        this.filledPositions.add(right);
	      }
	    }
	  }, {
	    key: "add",
	    value: function add(object) {
	      if (object instanceof Marble) {
	        this.marbles.push(object);
	      } else if (object instanceof Ship) {
	        this.ships.push(object);
	      } else {
	        throw "wtf?";
	      }
	    }
	  }, {
	    key: "addMarbles",
	    value: function addMarbles() {
	      for (var i = 0; i < Game.NUM_MARBLES; i++) {
	        this.add(new Marble({ game: this }));
	      }
	    }
	  }, {
	    key: "addShip",
	    value: function addShip(ctx) {
	      var ship = new Ship({
	        pos: [0, 0],
	        game: this,
	        ctx: ctx
	      });
	
	      this.add(ship);
	
	      return ship;
	    }
	  }, {
	    key: "allObjects",
	    value: function allObjects() {
	      return [].concat(this.ships, this.marbles);
	    }
	  }, {
	    key: "checkCollisions",
	    value: function checkCollisions() {
	      var allObjects = this.allObjects();
	      for (var i = 0; i < allObjects.length; i++) {
	        for (var j = 0; j < allObjects.length; j++) {
	          var obj1 = allObjects[i];
	          var obj2 = allObjects[j];
	
	          if (obj1.isCollidedWith(obj2)) {
	            var collision = obj1.collideWith(obj2);
	            if (collision) return;
	          }
	        }
	      }
	    }
	  }, {
	    key: "drawShapes",
	    value: function drawShapes(ctx) {
	      if (this.shapesArray.length > 0) {
	        for (var i = 0; i < this.shapesArray.length; i++) {
	          var currentArray = this.shapesArray[i];
	          ctx.beginPath();
	          ctx.moveTo(currentArray[0][0], currentArray[0][1]);
	          for (var j = 0; j < currentArray.length; j++) {
	            ctx.lineTo(currentArray[j][0], currentArray[j][1]);
	          }
	          ctx.closePath();
	          ctx.fillStyle = "white";
	          ctx.fill();
	        }
	      }
	    }
	  }, {
	    key: "dfs",
	    value: function dfs(root, target, seen) {
	      if (root.toString() === target.toString()) {
	        var foundArray = [];
	        foundArray.push(root);
	        return foundArray;
	      }
	
	      var left = [root[0] - 10, root[1]];
	      var right = [root[0] + 10, root[1]];
	      var up = [root[0], root[1] - 10];
	      var down = [root[0], root[1] + 10];
	      var validArrays = [];
	      if (this.filledPositions.has(left.toString()) && !seen.has(left.toString())) {
	        var returnLeft = this.dfs(left, target, Object.assign(seen.add(root.toString())));
	        if (returnLeft) {
	          returnLeft.unshift(root);
	          validArrays.push(returnLeft);
	        }
	      }
	      if (this.filledPositions.has(right.toString()) && !seen.has(right.toString())) {
	        var returnRight = this.dfs(right, target, Object.assign(seen.add(root.toString())));
	        if (returnRight) {
	          returnRight.unshift(root);
	          validArrays.push(returnRight);
	        }
	      }
	      if (this.filledPositions.has(up.toString()) && !seen.has(up.toString())) {
	        var returnUp = this.dfs(up, target, Object.assign(seen.add(root.toString())));
	        if (returnUp) {
	          returnUp.unshift(root);
	          validArrays.push(returnUp);
	        }
	      }
	      if (this.filledPositions.has(down.toString()) && !seen.has(down.toString())) {
	        var returnDown = this.dfs(down, target, Object.assign(seen.add(root.toString())));
	        if (returnDown) {
	          returnDown.unshift(root);
	          validArrays.push(returnDown);
	        }
	      }
	      var returnArray = void 0;
	      validArrays.forEach(function (array) {
	        if (!returnArray) {
	          returnArray = array;
	        } else {
	          if (array.length < returnArray.length) {
	            returnArray = array;
	          }
	        }
	      });
	      return returnArray;
	    }
	  }, {
	    key: "drawSeen",
	    value: function drawSeen(ctx) {
	      var _this = this;
	
	      var seen = this.seenPositions;
	      if (seen.length > 1) {
	        for (var i = 0; i < seen.length - 1; i++) {
	          var startX = seen[i][0];
	          var startY = seen[i][1];
	          var endX = seen[i + 1][0];
	          var endY = seen[i + 1][1];
	          ctx.strokeStyle = "white";
	          ctx.beginPath();
	          ctx.moveTo(startX, startY);
	          ctx.lineTo(endX, endY);
	          ctx.stroke();
	        }
	        ctx.closePath();
	        if (this.filledPositions.has(seen[seen.length - 1].toString())) {
	
	          var shapeArray = [];
	          for (var _i2 = 0; _i2 < seen.length - 1; _i2++) {
	            var cur_pos = [seen[_i2][0], seen[_i2][1]];
	            shapeArray.push(cur_pos);
	          }
	          var start = [seen[0][0], seen[0][1]];
	          var end = [seen[seen.length - 1][0], seen[seen.length - 1][1]];
	          var fillArray = this.dfs(end, start, new Set());
	          shapeArray = shapeArray.concat(fillArray);
	          this.shapesArray.push(shapeArray);
	          shapeArray.forEach(function (arr) {
	            _this.filledPositions.add(arr.toString());
	          });
	          this.seenPositions = [];
	        }
	      }
	    }
	  }, {
	    key: "draw",
	    value: function draw(ctx) {
	      ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	      ctx.fillStyle = Game.BG_COLOR;
	      ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	      this.drawSeen(ctx);
	      this.drawShapes(ctx);
	
	      this.allObjects().forEach(function (object) {
	        object.draw(ctx);
	      });
	      var imageData = ctx.getImageData(0, 0, Game.DIM_X, Game.DIM_Y);
	      var data = imageData.data;
	      var black = 0;
	      var white = 0;
	      var count = 0;
	      for (var i = 0; i < data.length; i += 40) {
	        if (data[i] === 0) {
	          black++;
	        } else if (data[i] === 255) {
	          white++;
	        }
	      }
	      var percent = white / (white + black);
	
	      if (percent > 4 / 5) {}
	    }
	  }, {
	    key: "hitWall",
	    value: function hitWall(pos) {
	      if (pos[0] < 0 || pos[0] > Game.DIM_X) {
	        return "horizontal";
	      } else if (pos[1] < 0 || pos[1] > Game.DIM_Y) {
	        return "vertical";
	      }
	    }
	  }, {
	    key: "moveObjects",
	    value: function moveObjects(delta) {
	      this.allObjects().forEach(function (object) {
	        object.move(delta);
	      });
	    }
	  }, {
	    key: "randomPosition",
	    value: function randomPosition() {
	      return [Game.DIM_X * Math.random(), Game.DIM_Y * Math.random()];
	    }
	  }, {
	    key: "remove",
	    value: function remove(object) {
	      if (object instanceof Marble) {
	        this.asteroids.splice(this.marble.indexOf(object), 1);
	      } else if (object instanceof Ship) {
	        this.ships.splice(this.ships.indexOf(object), 1);
	      } else {
	        throw "wtf?";
	      }
	    }
	  }, {
	    key: "step",
	    value: function step(delta) {
	      this.moveObjects(delta);
	      this.checkCollisions();
	    }
	  }, {
	    key: "wrap",
	    value: function wrap(pos) {
	      return [Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)];
	    }
	  }]);
	
	  return Game;
	}();
	
	Game.BG_COLOR = "#000000";
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	Game.NUM_MARBLES = 3;
	
	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	var Ship = __webpack_require__(5);
	
	var DEFAULTS = {
	  COLOR: "#505050",
	  RADIUS: 15,
	  SPEED: 4
	};
	
	var Marble = function (_MovingObject) {
	  _inherits(Marble, _MovingObject);
	
	  function Marble() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	    _classCallCheck(this, Marble);
	
	    options.color = DEFAULTS.COLOR;
	    options.pos = options.pos || options.game.randomPosition();
	    options.radius = DEFAULTS.RADIUS;
	    options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
	    return _possibleConstructorReturn(this, (Marble.__proto__ || Object.getPrototypeOf(Marble)).call(this, options));
	  }
	
	  _createClass(Marble, [{
	    key: "collideWith",
	    value: function collideWith(otherObject) {
	      if (otherObject instanceof Ship) {
	        otherObject.relocate();
	        return true;
	      }
	    }
	  }]);
	
	  return Marble;
	}(MovingObject);
	
	module.exports = Marble;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	var Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir: function dir(vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	
	  // Find distance between two points.
	  dist: function dist(pos1, pos2) {
	    return Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2));
	  },
	
	  // Find the length of the vector.
	  norm: function norm(vec) {
	    return Util.dist([0, 0], vec);
	  },
	
	  // Return a randomly oriented vector with the given length.
	  randomVec: function randomVec(length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	
	  // Scale the length of a vector by the given amount.
	  scale: function scale(vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	  wrap: function wrap(coord, max) {
	    if (coord < 0) {
	      return max - coord % max;
	    } else if (coord > max) {
	      return coord % max;
	    } else {
	      return coord;
	    }
	  }
	};
	
	module.exports = Util;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Util = __webpack_require__(3);
	
	var MovingObject = function () {
	  function MovingObject(options) {
	    _classCallCheck(this, MovingObject);
	
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.radius = options.radius;
	    this.color = options.color;
	    this.game = options.game;
	    this.isWrappable = true;
	    this.ctx = options.ctx;
	  }
	
	  _createClass(MovingObject, [{
	    key: "collideWith",
	    value: function collideWith(otherObject) {
	      // default do nothing
	    }
	  }, {
	    key: "draw",
	    value: function draw(ctx) {
	      ctx.fillStyle = this.color;
	
	      ctx.beginPath();
	      ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
	      ctx.fill();
	    }
	  }, {
	    key: "isCollidedWith",
	    value: function isCollidedWith(otherObject) {
	      var centerDist = Util.dist(this.pos, otherObject.pos);
	      return centerDist < this.radius + otherObject.radius;
	    }
	  }, {
	    key: "move",
	    value: function move(timeDelta) {
	      //timeDelta is number of milliseconds since last move
	      //if the computer is busy the time delta will be larger
	      //in this case the MovingObject should move farther in this frame
	      //velocity of object is how far it should move in 1/60th of a second
	      var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	          offsetX = this.vel[0] * velocityScale,
	          offsetY = this.vel[1] * velocityScale;
	      var prev_pos = this.pos;
	      this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	      this.game.hitWall(prev_pos, this.pos);
	    }
	  }, {
	    key: "remove",
	    value: function remove() {
	      this.game.remove(this);
	    }
	  }]);
	
	  return MovingObject;
	}();
	
	var NORMAL_FRAME_TIME_DELTA = 1000 / 60;
	
	module.exports = MovingObject;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var MovingObject = __webpack_require__(4);
	var Util = __webpack_require__(3);
	
	function randomColor() {
	  var hexDigits = "0123456789ABCDEF";
	
	  var color = "#";
	  for (var i = 0; i < 3; i++) {
	    color += hexDigits[Math.floor(Math.random() * 16)];
	  }
	
	  return color;
	}
	
	var Ship = function (_MovingObject) {
	  _inherits(Ship, _MovingObject);
	
	  function Ship(options) {
	    _classCallCheck(this, Ship);
	
	    options.radius = Ship.RADIUS;
	    options.vel = options.vel || [0, 0];
	    options.color = options.color || randomColor();
	
	    var _this = _possibleConstructorReturn(this, (Ship.__proto__ || Object.getPrototypeOf(Ship)).call(this, options));
	
	    _this.started = false;
	    return _this;
	  }
	
	  _createClass(Ship, [{
	    key: "power",
	    value: function power(impulse) {
	      if (this.pos[0] + impulse[0] < 0 || this.pos[0] + impulse[0] > this.game.x_limit || this.pos[1] + impulse[1] < 0 || this.pos[1] + impulse[1] > this.game.y_limit) {
	        return;
	      }
	      var current_pos = [this.pos[0], this.pos[1]];
	      this.pos[0] += impulse[0];
	      this.pos[1] += impulse[1];
	      var next_pos = [this.pos[0], this.pos[1]];
	      if (!this.started) {
	        if (this.game.filledPositions.has(current_pos.toString()) && !this.game.filledPositions.has(next_pos.toString())) {
	          this.started = true;
	          this.game.seenPositions.push(current_pos);
	          this.game.seenPositions.push(next_pos);
	        }
	      } else {
	        if (this.game.filledPositions.has(next_pos.toString())) {
	          this.started = false;
	        }
	        this.game.seenPositions.push(next_pos);
	      }
	    }
	  }, {
	    key: "relocate",
	    value: function relocate() {
	      this.pos = [0, 0];
	      this.vel = [0, 0];
	    }
	  }]);
	
	  return Ship;
	}(MovingObject);
	
	Ship.RADIUS = 15;
	module.exports = Ship;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GameView = function () {
	  function GameView(game, ctx) {
	    _classCallCheck(this, GameView);
	
	    this.ctx = ctx;
	    this.game = game;
	    this.ship = this.game.addShip(ctx);
	  }
	
	  _createClass(GameView, [{
	    key: "bindKeyHandlers",
	    value: function bindKeyHandlers() {
	      var ship = this.ship;
	
	      Object.keys(GameView.MOVES).forEach(function (k) {
	        var move = GameView.MOVES[k];
	        key(k, function () {
	          ship.power(move);
	        });
	      });
	
	      key("space", function () {
	        ship.fireBullet();
	      });
	    }
	  }, {
	    key: "start",
	    value: function start() {
	      this.bindKeyHandlers();
	      this.lastTime = 0;
	      //start the animation
	      requestAnimationFrame(this.animate.bind(this));
	    }
	  }, {
	    key: "animate",
	    value: function animate(time) {
	      var timeDelta = time - this.lastTime;
	
	      this.game.step(timeDelta);
	      this.game.draw(this.ctx);
	      this.lastTime = time;
	
	      //every call to animate requests causes another call to animate
	      requestAnimationFrame(this.animate.bind(this));
	    }
	  }]);
	
	  return GameView;
	}();
	
	GameView.MOVES = {
	  "up": [0, -10],
	  "left": [-10, 0],
	  "down": [0, 10],
	  "right": [10, 0]
	};
	
	module.exports = GameView;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map