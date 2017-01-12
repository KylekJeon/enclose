const Marble = require("./marble");
const Ship = require("./ship");
const Util = require("./util");
const Astar = require("./astar");
const Graph = Astar.Graph;
const astar = Astar.astar;

class Game {
  constructor() {
    this.marbles = [];
    this.ships = [];
    this.filledPositions = new Set();
    this.borderPositions = new Set();
    this.emptyPositions = new Set();
    this.shapesArray = [];
    this.seenPositions = [];
    this.addMarbles();
    this.searchGrid = this.createSearchGrid();
    this.initializeBoard();
    this.started = false;
  }

  createSearchGrid() {
    const arr = [];
    for(let i = 0; i <= 60; i++){
      const temp = [];
      for(let j = 0; j <= 100; j++){
        temp.push(0);
      }
      arr.push(temp);
    }
    return arr;
  }

  initializeBoard() {
    for(let i = 0; i <= Game.DIM_Y; i += 10){
      const left = [0,i];
      this.borderPositions.add(left.toString());
      const right = [Game.DIM_X, i];
      this.borderPositions.add(right.toString());
      this.searchGrid[i/10][0] = 1;
      this.searchGrid[i/10][Game.DIM_X/10] = 1;
    }
    for(let i = 0; i <= Game.DIM_X; i += 10){
      const top = [i,0];
      this.borderPositions.add(top.toString());
      const bottom = [i, Game.DIM_Y];
      this.borderPositions.add(bottom.toString());
      this.searchGrid[0][i/10] = 1;
      this.searchGrid[Game.DIM_Y/10][i/10] = 1;
    }
  }

  pathFinder(start, end){
    const returnArr = [];
    const graph = new Graph(this.searchGrid);
    let graphStart = graph.grid[start[1]/10][start[0]/10];
    let graphEnd = graph.grid[end[1]/10][end[0]/10];
    const result = astar.search(graph, graphStart, graphEnd);
    for (let i = 0; i < result.length; i++){
      const x = parseInt(result[i].y) * 10;
      const y = parseInt(result[i].x) * 10;
      returnArr.push([x,y]);
    }
    return returnArr;
  }


  add(object) {
    if (object instanceof Marble) {
      this.marbles.push(object);
    } else if (object instanceof Ship) {
      this.ships.push(object);
    } else {
      throw "wtf?";
    }
  }

  addMarbles() {
    for (let i = 0; i < Game.NUM_MARBLES; i++) {
      this.add(new Marble({ game: this }));
    }
  }

  addShip(ctx) {
    const ship = new Ship({
      pos: [0,0],
      game: this,
      ctx: ctx
    });

    this.add(ship);

    return ship;
  }

  allObjects() {
    return [].concat(this.ships, this.marbles);
  }

  checkCollisions() {
    const allObjects = this.allObjects();
    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];

        if (obj1.isCollidedWith(obj2)) {
          const collision = obj1.collideWith(obj2);
          if (collision) return;
        }
      }
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.drawSeen(ctx);
    this.drawShapes(ctx);

    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });

    const percent = this.findFilledPercent(ctx);
  }

  findFilledPercent(ctx){
    const imageData = ctx.getImageData(0, 0, Game.DIM_X, Game.DIM_Y);
    const data = imageData.data;
    let black = 0;
    let white = 0;
    for (let i = 0; i < data.length; i += 40){
      if(data[i] === 0){
        black++;
      } else if (data[i] === 255){
        white ++;
      }
    }
    const percent = (white/(white+black));
    return percent;
  }

  drawSeen(ctx){
    let seen = this.seenPositions;
    if(seen.length > 1){
      for (let i = 0; i < seen.length - 1; i++){
        const startX = seen[i][0];
        const startY = seen[i][1];
        const endX = seen[i+1][0];
        const endY = seen[i+1][1];
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      ctx.closePath();
      if(this.borderPositions.has(seen[seen.length-1].toString())){
        const start = [seen[0][0], seen[0][1]];
        const end = [seen[seen.length-1][0], seen[seen.length-1][1]];
        const fillBordersArray = this.pathFinder(end, start);
        seen = seen.concat(fillBordersArray);
        seen.forEach((pos) => {
          this.borderPositions.add(pos.toString());
          this.emptyPositions.delete(pos.toString());
          this.updateSearchGrid(pos);
        });
        this.shapesArray.push(seen);
        this.seenPositions = [];
        this.started = false;
      }
    }
  }

  updateSearchGrid(pos){
    const y = pos[0]/10;
    const x = pos[1]/10;
    this.searchGrid[x][y] = 1;
  }

  fillPoints(shapeArray){
    let x_min = Game.DIM_X;
    let x_max = 0;
    let y_min = Game.DIM_Y;
    let y_max = 0;
    for (let i = 0; i < shapeArray.length - 1; i++){
      const cur_pos = [shapeArray[i][0], shapeArray[i][1]];
      if (cur_pos[0] < x_min){
        x_min = cur_pos[i];
      }
      if (cur_pos[0] > x_max){
        x_max = cur_pos[i];
      }
      if (cur_pos[1] < y_min){
        y_min = cur_pos[1];
      }
      if (cur_pos[1] > y_max){
        y_max = cur_pos[1];
      }
    }
    let fillPointArray = [];
    for (let x = x_min; x <= x_max; x++){
      for (let y = y_min; y <= y_max; y++){
        if(this.rayCasting([x, y], shapeArray)){
          fillPointArray.push([x,y]);
        }
      }
    }
    return fillPointArray;
  }

  rayCasting(point, vs) {

    let x = point[0], y = point[1];

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i][0], yi = vs[i][1];
      let xj = vs[j][0], yj = vs[j][1];

      let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  drawShapes(ctx) {
    if(this.shapesArray.length > 0){
      for (let i = 0; i < this.shapesArray.length; i++){
        const currentArray = this.shapesArray[i];
        ctx.beginPath();
        ctx.moveTo(currentArray[0][0], currentArray[0][1]);
        for (let j = 0; j < currentArray.length; j++){
          ctx.lineTo(currentArray[j][0], currentArray[j][1]);
        }
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
      }
    }
  }


  hitWall(pos) {
    if(pos[0] < 0 || pos[0] > Game.DIM_X){
      return "horizontal";
    } else if( pos[1] < 0 || pos[1] > Game.DIM_Y){
      return "vertical";
    }
  }

  moveObjects(delta) {
    this.allObjects().forEach((object) => {
      object.move(delta);
    });
  }

  randomPosition() {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  }

  remove(object) {
    if (object instanceof Marble) {
      this.asteroids.splice(this.marble.indexOf(object), 1);
    } else if (object instanceof Ship) {
      this.ships.splice(this.ships.indexOf(object), 1);
    } else {
      throw "wtf?";
    }
  }

  step(delta) {
    this.moveObjects(delta);
    this.checkCollisions();
  }

  wrap(pos) {
    return [
      Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
    ];
  }
}

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.NUM_MARBLES = 0;

module.exports = Game;
