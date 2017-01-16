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
	var GameView = __webpack_require__(8);
	
	document.addEventListener("DOMContentLoaded", function () {
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start();
	  window.nextLevel = game.nextLevel;
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
	var Astar = __webpack_require__(6);
	var Graph = Astar.Graph;
	var astar = Astar.astar;
	
	var Game = function () {
	  function Game() {
	    _classCallCheck(this, Game);
	
	    this.marbles = [];
	    this.ships = [];
	    this.safePositions = new Set();
	    this.shapesArray = [];
	    this.linesArray = [];
	    this.seenPositions = [];
	    this.seenSet = new Set();
	    this.x_limit = Game.DIM_X;
	    this.y_limit = Game.DIM_Y;
	    this.level = 4;
	    this.addMarbles(this.level);
	    this.searchGrid = this.createSearchGrid();
	    this.initializeBoard();
	    this.started = false;
	    this.nextLevel = this.nextLevel.bind(this);
	  }
	
	  _createClass(Game, [{
	    key: "nextLevel",
	    value: function nextLevel() {
	      this.ships[0].pos = [0, 0];
	      this.marbles = [];
	      this.safePositions = new Set();
	      this.shapesArray = [];
	      this.linesArray = [];
	      this.seenPositions = [];
	      this.seenSet = new Set();
	      this.level += 2;
	      this.addMarbles(this.level);
	      this.searchGrid = this.createSearchGrid();
	      this.initializeBoard();
	      this.started = false;
	    }
	  }, {
	    key: "createSearchGrid",
	    value: function createSearchGrid() {
	      var arr = [];
	      for (var i = 0; i <= 60; i++) {
	        var temp = [];
	        for (var j = 0; j <= 100; j++) {
	          temp.push(0);
	        }
	        arr.push(temp);
	      }
	      return arr;
	    }
	  }, {
	    key: "initializeBoard",
	    value: function initializeBoard() {
	      for (var i = 0; i <= Game.DIM_Y; i += 10) {
	        var left = [0, i];
	        this.safePositions.add(left.toString());
	        var right = [Game.DIM_X, i];
	        this.safePositions.add(right.toString());
	        this.searchGrid[i / 10][0] = 1;
	        this.searchGrid[i / 10][Game.DIM_X / 10] = 1;
	      }
	      for (var _i = 0; _i <= Game.DIM_X; _i += 10) {
	        var top = [_i, 0];
	        this.safePositions.add(top.toString());
	        var bottom = [_i, Game.DIM_Y];
	        this.safePositions.add(bottom.toString());
	        this.searchGrid[0][_i / 10] = 1;
	        this.searchGrid[Game.DIM_Y / 10][_i / 10] = 1;
	      }
	    }
	  }, {
	    key: "pathFinder",
	    value: function pathFinder(start, end) {
	      var returnArr = [];
	      var graph = new Graph(this.searchGrid);
	      var graphStart = graph.grid[start[1] / 10][start[0] / 10];
	      var graphEnd = graph.grid[end[1] / 10][end[0] / 10];
	      var result = astar.search(graph, graphStart, graphEnd);
	      for (var i = 0; i < result.length; i++) {
	        var x = parseInt(result[i].y) * 10;
	        var y = parseInt(result[i].x) * 10;
	        returnArr.push([x, y]);
	      }
	      return returnArr;
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
	    value: function addMarbles(level) {
	      for (var i = 0; i < Game.NUM_MARBLES; i++) {
	        this.add(new Marble(level, { game: this }));
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
	    key: "draw",
	    value: function draw(ctx) {
	      ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	      ctx.fillStyle = Game.BG_COLOR;
	      ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	      this.drawSeen(ctx);
	      this.drawShapes(ctx);
	      this.drawOutlines(ctx);
	
	      this.allObjects().forEach(function (object) {
	        object.draw(ctx);
	      });
	
	      if (this.seenPositions.length === 0) {
	        var percent = (this.findFilledPercent(ctx) * 100).toFixed(0);
	        if (percent > 70) {
	          this.nextLevel();
	          var level = Math.round((this.level - 4) / 2 + 1);
	          this.updateLevel(level);
	        }
	        this.updatePercent(percent);
	      }
	    }
	  }, {
	    key: "findFilledPercent",
	    value: function findFilledPercent(ctx) {
	      var imageData = ctx.getImageData(0, 0, Game.DIM_X, Game.DIM_Y);
	      var data = imageData.data;
	      var black = 0;
	      var white = 0;
	      for (var i = 0; i < data.length; i += 40) {
	        if (data[i] === 0) {
	          black++;
	        } else if (data[i] === 255) {
	          white++;
	        }
	      }
	      var percent = white / (white + black);
	      return percent;
	    }
	  }, {
	    key: "clear",
	    value: function clear(element) {
	      while (element.lastChild) {
	        element.removeChild(element.lastChild);
	      }
	    }
	  }, {
	    key: "updatePercent",
	    value: function updatePercent(text) {
	      var parent = document.getElementById("percent");
	      var textNode = document.createTextNode(text);
	      this.clear(parent);
	      parent.appendChild(textNode);
	    }
	  }, {
	    key: "updateLevel",
	    value: function updateLevel(text) {
	      var parent = document.getElementById("level");
	      var textNode = document.createTextNode(text);
	      this.clear(parent);
	      parent.appendChild(textNode);
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
	          ctx.lineWidth = 1;
	          ctx.beginPath();
	          ctx.moveTo(startX, startY);
	          ctx.lineTo(endX, endY);
	          ctx.stroke();
	        }
	        ctx.closePath();
	        if (this.safePositions.has(seen[seen.length - 1].toString())) {
	          var start = [seen[0][0], seen[0][1]];
	          var end = [seen[seen.length - 1][0], seen[seen.length - 1][1]];
	          var fillBordersArray = this.pathFinder(end, start);
	          seen = seen.concat(fillBordersArray);
	          seen.forEach(function (pos) {
	            _this.updateSearchGrid(pos);
	            _this.safePositions.add(pos.toString());
	          });
	          if (this.checkMarbles(seen)) {
	            this.linesArray.push(seen);
	          } else {
	            this.shapesArray.push(seen);
	            this.addSafePoints(seen);
	          }
	          this.seenPositions = [];
	          this.seenSet = new Set();
	          this.started = false;
	        }
	      }
	    }
	  }, {
	    key: "updateSearchGrid",
	    value: function updateSearchGrid(pos) {
	      var y = pos[0] / 10;
	      var x = pos[1] / 10;
	      this.searchGrid[x][y] = 1;
	    }
	  }, {
	    key: "addSafePoints",
	    value: function addSafePoints(shapeArray) {
	      var x_min = shapeArray[0][0];
	      var x_max = shapeArray[0][0];
	      var y_min = shapeArray[0][1];
	      var y_max = shapeArray[0][1];
	      for (var i = 0; i < shapeArray.length; i++) {
	        var cur_pos = [shapeArray[i][0], shapeArray[i][1]];
	        if (cur_pos[0] < x_min) {
	          x_min = cur_pos[0];
	        }
	        if (cur_pos[0] > x_max) {
	          x_max = cur_pos[0];
	        }
	        if (cur_pos[1] < y_min) {
	          y_min = cur_pos[1];
	        }
	        if (cur_pos[1] > y_max) {
	          y_max = cur_pos[1];
	        }
	      }
	      for (var x = x_min; x <= x_max; x += 10) {
	        for (var y = y_min; y <= y_max; y += 10) {
	          var pos = [x, y];
	          if (this.rayCasting(pos, shapeArray.slice(1))) {
	            this.safePositions.add(pos.toString());
	          }
	        }
	      }
	    }
	  }, {
	    key: "pointInCircle",
	    value: function pointInCircle(pos, set) {
	      var radius = this.marbles[0].radius;
	
	      var min_x = pos[0] - radius;
	      var max_x = pos[0] + radius;
	      var min_y = pos[1] - radius;
	      var max_y = pos[1] + radius;
	
	      for (var i = min_x; i <= max_x; i++) {
	        for (var j = min_y; j <= max_y; j++) {
	          if (set.has([i, j].toString())) {
	            return true;
	          }
	        }
	      }
	      return false;
	    }
	  }, {
	    key: "checkMarbles",
	    value: function checkMarbles(shapeArray) {
	      var marblePos = [];
	      this.marbles.forEach(function (marble) {
	        marblePos.push([Math.round(marble.pos[0]), Math.round(marble.pos[1])]);
	      });
	
	      for (var i = 0; i < marblePos.length; i++) {
	        if (this.rayCasting(marblePos[i], shapeArray)) {
	          return true;
	        }
	      }
	    }
	  }, {
	    key: "rayCasting",
	    value: function rayCasting(point, vs) {
	
	      var x = point[0],
	          y = point[1];
	
	      var inside = false;
	      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
	        var xi = vs[i][0],
	            yi = vs[i][1];
	        var xj = vs[j][0],
	            yj = vs[j][1];
	
	        var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
	        if (intersect) {
	          inside = !inside;
	        }
	      }
	
	      return inside;
	    }
	  }, {
	    key: "loseLife",
	    value: function loseLife() {
	      this.ships[0].relocate([this.seenPositions[0][0], this.seenPositions[0][1]]);
	      this.seenPositions = [];
	      this.seenSet = new Set();
	      this.started = false;
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
	    key: "drawOutlines",
	    value: function drawOutlines(ctx) {
	      if (this.linesArray.length > 0) {
	        for (var i = 0; i < this.linesArray.length; i++) {
	          var currentArray = this.linesArray[i];
	          ctx.beginPath();
	          ctx.moveTo(currentArray[0][0], currentArray[0][1]);
	          for (var j = 0; j < currentArray.length; j++) {
	            ctx.lineTo(currentArray[j][0], currentArray[j][1]);
	          }
	          ctx.closePath();
	          ctx.strokeStyle = "white";
	          ctx.stroke();
	        }
	      }
	    }
	  }, {
	    key: "hitWall",
	    value: function hitWall(pos) {
	      var roundPos = [Math.round(pos[0]), Math.round(pos[1])];
	      return this.bounce(roundPos);
	    }
	  }, {
	    key: "bounce",
	    value: function bounce(pos) {
	      if (pos[0] <= 0 || pos[0] >= Game.DIM_X || pos[1] <= 0 || pos[1] >= Game.DIM_Y || this.pointInCircle(pos, this.safePositions)) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: "moveObjects",
	    value: function moveObjects(delta) {
	      this.marbles.forEach(function (object) {
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
	        this.marbles.splice(this.marbles.indexOf(object), 1);
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
	Game.NUM_MARBLES = 1;
	
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
	  SPEED: 5
	};
	
	var Marble = function (_MovingObject) {
	  _inherits(Marble, _MovingObject);
	
	  function Marble(level) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    _classCallCheck(this, Marble);
	
	    options.color = DEFAULTS.COLOR;
	    options.pos = options.pos || options.game.randomPosition();
	    options.radius = DEFAULTS.RADIUS;
	    options.vel = Util.randomVec(level);
	    return _possibleConstructorReturn(this, (Marble.__proto__ || Object.getPrototypeOf(Marble)).call(this, options));
	  }
	
	  _createClass(Marble, [{
	    key: "collideWith",
	    value: function collideWith(otherObject) {
	      if (otherObject instanceof Ship) {
	        if (this.game.safePositions.has(otherObject.pos.toString())) {
	          return false;
	        } else {}
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
	      if (this === this.game.ships[0]) {
	        if (this.game.safePositions.has(this.pos.toString())) {
	          this.color = "green";
	        } else {
	          this.color = "red";
	        }
	      }
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
	      var cur_pos = [Math.round(this.pos[0]), Math.round(this.pos[1])];
	
	      if (this.game.pointInCircle(cur_pos, this.game.seenSet)) {
	        this.game.loseLife();
	      }
	
	      if (this.game.hitWall(cur_pos)) {
	        var next_vel = this.checkRebound(cur_pos, this.vel);
	        if (next_vel === "x") {
	          this.vel[0] = -this.vel[0];
	        } else if (next_vel === "y") {
	          this.vel[1] = -this.vel[1];
	        } else {
	          this.vel[0] = -this.vel[0];
	          this.vel[1] = -this.vel[1];
	        }
	      }
	
	      var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA;
	      var offsetX = this.vel[0] * velocityScale;
	      var offsetY = this.vel[1] * velocityScale;
	      this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	    }
	  }, {
	    key: "checkRebound",
	    value: function checkRebound(pos, vel) {
	      var x = void 0;
	      var y = void 0;
	      var found = false;
	      if (vel[0] < 0) {
	        x = -1;
	      } else {
	        x = 1;
	      }
	      if (vel[1] < 0) {
	        y = -1;
	      } else {
	        y = 1;
	      }
	
	      var firstPos = pos.slice();
	      var set1 = [-x, y];
	
	      var secondPos = pos.slice();
	      var set2 = [x, -y];
	      var count = 0;
	      while (!found && count < 40) {
	        firstPos = [firstPos[0] + set1[0], firstPos[1] + set1[1]];
	        secondPos = [secondPos[0] + set2[0], secondPos[1] + set2[1]];
	        if (!this.game.hitWall(firstPos)) {
	          found = "firstPos";
	        }
	        if (!this.game.hitWall(secondPos)) {
	          found = "secondPos";
	        }
	        count++;
	      }
	
	      if (found === "firstPos") {
	        return "x";
	      } else if (found === "secondPos") {
	        return "y";
	      } else {
	        return "z";
	      }
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
	    options.color = "green";
	    return _possibleConstructorReturn(this, (Ship.__proto__ || Object.getPrototypeOf(Ship)).call(this, options));
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
	      if (!this.game.started) {
	        if (this.game.safePositions.has(current_pos.toString()) && !this.game.safePositions.has(next_pos.toString())) {
	          this.game.started = true;
	          this.game.seenPositions.push(current_pos);
	          this.game.seenPositions.push(next_pos);
	          this.game.seenSet.add(current_pos.toString());
	          this.game.seenSet.add(next_pos.toString());
	        }
	      } else {
	        if (this.game.safePositions.has(next_pos.toString())) {
	          this.game.started = false;
	        }
	        this.game.seenPositions.push(next_pos);
	        this.game.seenSet.add(next_pos.toString());
	      }
	    }
	  }, {
	    key: "relocate",
	    value: function relocate(newPos) {
	      this.pos = [newPos[0], newPos[1]];
	    }
	  }]);
	
	  return Ship;
	}(MovingObject);
	
	Ship.RADIUS = 10;
	module.exports = Ship;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	// javascript-astar 0.4.1
	// http://github.com/bgrins/javascript-astar
	// Freely distributable under the MIT License.
	// Implements the astar search algorithm in javascript using a Binary Heap.
	// Includes Binary Heap (with modifications) from Marijn Haverbeke.
	// http://eloquentjavascript.net/appendix2.html
	(function (definition) {
	  /* global module, define */
	  if (( false ? 'undefined' : _typeof(module)) === 'object' && _typeof(module.exports) === 'object') {
	    module.exports = definition();
	  } else if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else {
	    var exports = definition();
	    window.astar = exports.astar;
	    window.Graph = exports.Graph;
	  }
	})(function () {
	
	  function pathTo(node) {
	    var curr = node;
	    var path = [];
	    while (curr.parent) {
	      path.unshift(curr);
	      curr = curr.parent;
	    }
	    return path;
	  }
	
	  function getHeap() {
	    return new BinaryHeap(function (node) {
	      return node.f;
	    });
	  }
	
	  var astar = {
	    /**
	    * Perform an A* Search on a graph given a start and end node.
	    * @param {Graph} graph
	    * @param {GridNode} start
	    * @param {GridNode} end
	    * @param {Object} [options]
	    * @param {bool} [options.closest] Specifies whether to return the
	               path to the closest node if the target is unreachable.
	    * @param {Function} [options.heuristic] Heuristic function (see
	    *          astar.heuristics).
	    */
	    search: function search(graph, start, end, options) {
	      graph.cleanDirty();
	      options = options || {};
	      var heuristic = options.heuristic || astar.heuristics.manhattan;
	      var closest = options.closest || false;
	
	      var openHeap = getHeap();
	      var closestNode = start; // set the start node to be the closest if required
	
	      start.h = heuristic(start, end);
	      graph.markDirty(start);
	
	      openHeap.push(start);
	
	      while (openHeap.size() > 0) {
	
	        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
	        var currentNode = openHeap.pop();
	
	        // End case -- result has been found, return the traced path.
	        if (currentNode === end) {
	          return pathTo(currentNode);
	        }
	
	        // Normal case -- move currentNode from open to closed, process each of its neighbors.
	        currentNode.closed = true;
	
	        // Find all neighbors for the current node.
	        var neighbors = graph.neighbors(currentNode);
	
	        for (var i = 0, il = neighbors.length; i < il; ++i) {
	          var neighbor = neighbors[i];
	
	          if (neighbor.closed || neighbor.isWall()) {
	            // Not a valid node to process, skip to next neighbor.
	            continue;
	          }
	
	          // The g score is the shortest distance from start to current node.
	          // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
	          var gScore = currentNode.g + neighbor.getCost(currentNode);
	          var beenVisited = neighbor.visited;
	
	          if (!beenVisited || gScore < neighbor.g) {
	
	            // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
	            neighbor.visited = true;
	            neighbor.parent = currentNode;
	            neighbor.h = neighbor.h || heuristic(neighbor, end);
	            neighbor.g = gScore;
	            neighbor.f = neighbor.g + neighbor.h;
	            graph.markDirty(neighbor);
	            if (closest) {
	              // If the neighbour is closer than the current closestNode or if it's equally close but has
	              // a cheaper path than the current closest node then it becomes the closest node
	              if (neighbor.h < closestNode.h || neighbor.h === closestNode.h && neighbor.g < closestNode.g) {
	                closestNode = neighbor;
	              }
	            }
	
	            if (!beenVisited) {
	              // Pushing to heap will put it in proper place based on the 'f' value.
	              openHeap.push(neighbor);
	            } else {
	              // Already seen the node, but since it has been rescored we need to reorder it in the heap
	              openHeap.rescoreElement(neighbor);
	            }
	          }
	        }
	      }
	
	      if (closest) {
	        return pathTo(closestNode);
	      }
	
	      // No result was found - empty array signifies failure to find path.
	      return [];
	    },
	    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
	    heuristics: {
	      manhattan: function manhattan(pos0, pos1) {
	        var d1 = Math.abs(pos1.x - pos0.x);
	        var d2 = Math.abs(pos1.y - pos0.y);
	        return d1 + d2;
	      },
	      diagonal: function diagonal(pos0, pos1) {
	        var D = 1;
	        var D2 = Math.sqrt(2);
	        var d1 = Math.abs(pos1.x - pos0.x);
	        var d2 = Math.abs(pos1.y - pos0.y);
	        return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
	      }
	    },
	    cleanNode: function cleanNode(node) {
	      node.f = 0;
	      node.g = 0;
	      node.h = 0;
	      node.visited = false;
	      node.closed = false;
	      node.parent = null;
	    }
	  };
	
	  /**
	   * A graph memory structure
	   * @param {Array} gridIn 2D array of input weights
	   * @param {Object} [options]
	   * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
	   */
	  function Graph(gridIn, options) {
	    options = options || {};
	    this.nodes = [];
	    this.diagonal = !!options.diagonal;
	    this.grid = [];
	    for (var x = 0; x < gridIn.length; x++) {
	      this.grid[x] = [];
	
	      for (var y = 0, row = gridIn[x]; y < row.length; y++) {
	        var node = new GridNode(x, y, row[y]);
	        this.grid[x][y] = node;
	        this.nodes.push(node);
	      }
	    }
	    this.init();
	  }
	
	  Graph.prototype.init = function () {
	    this.dirtyNodes = [];
	    for (var i = 0; i < this.nodes.length; i++) {
	      astar.cleanNode(this.nodes[i]);
	    }
	  };
	
	  Graph.prototype.cleanDirty = function () {
	    for (var i = 0; i < this.dirtyNodes.length; i++) {
	      astar.cleanNode(this.dirtyNodes[i]);
	    }
	    this.dirtyNodes = [];
	  };
	
	  Graph.prototype.markDirty = function (node) {
	    this.dirtyNodes.push(node);
	  };
	
	  Graph.prototype.neighbors = function (node) {
	    var ret = [];
	    var x = node.x;
	    var y = node.y;
	    var grid = this.grid;
	
	    // West
	    if (grid[x - 1] && grid[x - 1][y]) {
	      ret.push(grid[x - 1][y]);
	    }
	
	    // East
	    if (grid[x + 1] && grid[x + 1][y]) {
	      ret.push(grid[x + 1][y]);
	    }
	
	    // South
	    if (grid[x] && grid[x][y - 1]) {
	      ret.push(grid[x][y - 1]);
	    }
	
	    // North
	    if (grid[x] && grid[x][y + 1]) {
	      ret.push(grid[x][y + 1]);
	    }
	
	    if (this.diagonal) {
	      // Southwest
	      if (grid[x - 1] && grid[x - 1][y - 1]) {
	        ret.push(grid[x - 1][y - 1]);
	      }
	
	      // Southeast
	      if (grid[x + 1] && grid[x + 1][y - 1]) {
	        ret.push(grid[x + 1][y - 1]);
	      }
	
	      // Northwest
	      if (grid[x - 1] && grid[x - 1][y + 1]) {
	        ret.push(grid[x - 1][y + 1]);
	      }
	
	      // Northeast
	      if (grid[x + 1] && grid[x + 1][y + 1]) {
	        ret.push(grid[x + 1][y + 1]);
	      }
	    }
	
	    return ret;
	  };
	
	  Graph.prototype.toString = function () {
	    var graphString = [];
	    var nodes = this.grid;
	    for (var x = 0; x < nodes.length; x++) {
	      var rowDebug = [];
	      var row = nodes[x];
	      for (var y = 0; y < row.length; y++) {
	        rowDebug.push(row[y].weight);
	      }
	      graphString.push(rowDebug.join(" "));
	    }
	    return graphString.join("\n");
	  };
	
	  function GridNode(x, y, weight) {
	    this.x = x;
	    this.y = y;
	    this.weight = weight;
	  }
	
	  GridNode.prototype.toString = function () {
	    return "[" + this.x + " " + this.y + "]";
	  };
	
	  GridNode.prototype.getCost = function (fromNeighbor) {
	    // Take diagonal weight into consideration.
	    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
	      return this.weight * 1.41421;
	    }
	    return this.weight;
	  };
	
	  GridNode.prototype.isWall = function () {
	    return this.weight === 0;
	  };
	
	  function BinaryHeap(scoreFunction) {
	    this.content = [];
	    this.scoreFunction = scoreFunction;
	  }
	
	  BinaryHeap.prototype = {
	    push: function push(element) {
	      // Add the new element to the end of the array.
	      this.content.push(element);
	
	      // Allow it to sink down.
	      this.sinkDown(this.content.length - 1);
	    },
	    pop: function pop() {
	      // Store the first element so we can return it later.
	      var result = this.content[0];
	      // Get the element at the end of the array.
	      var end = this.content.pop();
	      // If there are any elements left, put the end element at the
	      // start, and let it bubble up.
	      if (this.content.length > 0) {
	        this.content[0] = end;
	        this.bubbleUp(0);
	      }
	      return result;
	    },
	    remove: function remove(node) {
	      var i = this.content.indexOf(node);
	
	      // When it is found, the process seen in 'pop' is repeated
	      // to fill up the hole.
	      var end = this.content.pop();
	
	      if (i !== this.content.length - 1) {
	        this.content[i] = end;
	
	        if (this.scoreFunction(end) < this.scoreFunction(node)) {
	          this.sinkDown(i);
	        } else {
	          this.bubbleUp(i);
	        }
	      }
	    },
	    size: function size() {
	      return this.content.length;
	    },
	    rescoreElement: function rescoreElement(node) {
	      this.sinkDown(this.content.indexOf(node));
	    },
	    sinkDown: function sinkDown(n) {
	      // Fetch the element that has to be sunk.
	      var element = this.content[n];
	
	      // When at 0, an element can not sink any further.
	      while (n > 0) {
	
	        // Compute the parent element's index, and fetch it.
	        var parentN = (n + 1 >> 1) - 1;
	        var parent = this.content[parentN];
	        // Swap the elements if the parent is greater.
	        if (this.scoreFunction(element) < this.scoreFunction(parent)) {
	          this.content[parentN] = element;
	          this.content[n] = parent;
	          // Update 'n' to continue at the new position.
	          n = parentN;
	        }
	        // Found a parent that is less, no need to sink any further.
	        else {
	            break;
	          }
	      }
	    },
	    bubbleUp: function bubbleUp(n) {
	      // Look up the target element and its score.
	      var length = this.content.length;
	      var element = this.content[n];
	      var elemScore = this.scoreFunction(element);
	
	      while (true) {
	        // Compute the indices of the child elements.
	        var child2N = n + 1 << 1;
	        var child1N = child2N - 1;
	        // This is used to store the new position of the element, if any.
	        var swap = null;
	        var child1Score;
	        // If the first child exists (is inside the array)...
	        if (child1N < length) {
	          // Look it up and compute its score.
	          var child1 = this.content[child1N];
	          child1Score = this.scoreFunction(child1);
	
	          // If the score is less than our element's, we need to swap.
	          if (child1Score < elemScore) {
	            swap = child1N;
	          }
	        }
	
	        // Do the same checks for the other child.
	        if (child2N < length) {
	          var child2 = this.content[child2N];
	          var child2Score = this.scoreFunction(child2);
	          if (child2Score < (swap === null ? elemScore : child1Score)) {
	            swap = child2N;
	          }
	        }
	
	        // If the element needs to be moved, swap it, and continue.
	        if (swap !== null) {
	          this.content[n] = this.content[swap];
	          this.content[swap] = element;
	          n = swap;
	        }
	        // Otherwise, we are done.
	        else {
	            break;
	          }
	      }
	    }
	  };
	
	  return {
	    astar: astar,
	    Graph: Graph
	  };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)(module)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 8 */
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