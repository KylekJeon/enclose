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
    this.safePositions = new Set();
    this.shapesArray = [];
    this.linesArray = [];
    this.seenPositions = [];
    this.seenSet = new Set();
    this.x_limit = Game.DIM_X;
    this.y_limit = Game.DIM_Y;
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
      this.safePositions.add(left.toString());
      const right = [Game.DIM_X, i];
      this.safePositions.add(right.toString());
      this.searchGrid[i/10][0] = 1;
      this.searchGrid[i/10][Game.DIM_X/10] = 1;
    }
    for(let i = 0; i <= Game.DIM_X; i += 10){
      const top = [i,0];
      this.safePositions.add(top.toString());
      const bottom = [i, Game.DIM_Y];
      this.safePositions.add(bottom.toString());
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
    this.drawOutlines(ctx);

    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });

    if(this.seenPositions.length === 0){
      const percent = (this.findFilledPercent(ctx) * 100).toFixed(0);
      this.updatePercent(percent);
    }
  }

  findFilledPercent(ctx){
    const imageData = ctx.getImageData(0, 0, Game.DIM_X, Game.DIM_Y);
    const data = imageData.data;
    let black = 0;
    let white = 0;
    for (let i = 0; i < data.length; i += 40){
      if(data[i] === 0){
        black++;
      } else if(data[i] === 255){
        white ++;
      }
    }
    const percent = (white/(white+black));
    return percent;
  }

  clear (element) {
    while (element.lastChild) {
      element.removeChild (element.lastChild);
    }
  }

  updatePercent(text)
  {
    const parent = document.getElementById("percent");
    const textNode = document.createTextNode(text);
    this.clear(parent);
    parent.appendChild(textNode);
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
      if(this.safePositions.has(seen[seen.length-1].toString())){
        const start = [seen[0][0], seen[0][1]];
        const end = [seen[seen.length-1][0], seen[seen.length-1][1]];
        const fillBordersArray = this.pathFinder(end, start);
        seen = seen.concat(fillBordersArray);
        seen.forEach((pos) => {
          this.updateSearchGrid(pos);
          this.safePositions.add(pos.toString());
        });
        if(this.checkMarbles(seen)){
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

  updateSearchGrid(pos){
    const y = pos[0]/10;
    const x = pos[1]/10;
    this.searchGrid[x][y] = 1;
  }

  addSafePoints(shapeArray){
    let x_min = shapeArray[0][0];
    let x_max = shapeArray[0][0];
    let y_min = shapeArray[0][1];
    let y_max = shapeArray[0][1];
    for (let i = 0; i < shapeArray.length; i++){
      const cur_pos = [shapeArray[i][0], shapeArray[i][1]];
      if (cur_pos[0] < x_min){
        x_min = cur_pos[0];
      }
      if (cur_pos[0] > x_max){
        x_max = cur_pos[0];
      }
      if (cur_pos[1] < y_min){
        y_min = cur_pos[1];
      }
      if (cur_pos[1] > y_max){
        y_max = cur_pos[1];
      }
    }
    for (let x = x_min; x <= x_max; x += 10){
      for (let y = y_min; y <= y_max; y += 10){
        let pos = [x, y];
        if(this.rayCasting(pos, shapeArray.slice(1))){
          this.safePositions.add(pos.toString());
        }
      }
    }
  }

  pointInCircle(pos, set){
    const radius = this.marbles[0].radius;

    const min_x = pos[0] - radius;
    const max_x = pos[0] + radius;
    const min_y = pos[1] - radius;
    const max_y = pos[1] + radius;

    for (let i = min_x; i <= max_x; i++){
      for (let j = min_y; j <= max_y; j++){
        if(set.has([i,j].toString())){
          return true;
        }
      }
    }
    return false;
  }

  checkMarbles(shapeArray){
    const marblePos = [];
    this.marbles.forEach((marble) => {
      marblePos.push([Math.round(marble.pos[0]), Math.round(marble.pos[1])]);
    });

    for(let i = 0; i < marblePos.length; i++){
      if(this.rayCasting(marblePos[i], shapeArray)){
        return true;
      }
    }
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

  loseLife(){
    this.ships[0].relocate([this.seenPositions[0][0], this.seenPositions[0][1]]);
    this.seenPositions = [];
    this.seenSet = new Set();
    this.started = false;
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

  drawOutlines(ctx) {
    if(this.linesArray.length > 0){
      for (let i = 0; i < this.linesArray.length; i++){
        const currentArray = this.linesArray[i];
        ctx.beginPath();
        ctx.moveTo(currentArray[0][0], currentArray[0][1]);
        for (let j = 0; j < currentArray.length; j++){
          ctx.lineTo(currentArray[j][0], currentArray[j][1]);
        }
        ctx.closePath();
        ctx.strokeStyle = "white";
        ctx.stroke();
      }
    }
  }

  hitWall(pos) {
    const roundPos = [Math.round(pos[0]), Math.round(pos[1])];
    return this.bounce(roundPos);
  }

  bounce(pos){
    if(pos[0] <= 0 || pos[0] >= Game.DIM_X || pos[1] <= 0 || pos[1] >= Game.DIM_Y || this.pointInCircle(pos, this.safePositions)){
      return true;
    }
    return false;
  }

  moveObjects(delta) {
    this.marbles.forEach((object) => {
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
      this.marbles.splice(this.marbles.indexOf(object), 1);
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
Game.NUM_MARBLES = 5;

module.exports = Game;
