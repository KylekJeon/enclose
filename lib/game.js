const Marble = require("./marble");
const Ship = require("./ship");
const Util = require("./util");

class Game {
  constructor() {
    this.marbles = [];
    this.ships = [];
    this.filledPositions = new Set();
    this.shapePositions = new Set();
    this.shapesArray = [];
    this.seenPositions = [];
    this.addMarbles();
    this.addFilledPositions();
    this.x_limit = Game.DIM_X;
    this.y_limit = Game.DIM_Y;
    this.found = false;
  }

  addFilledPositions() {
    for(let i = 0; i <= Game.DIM_Y; i += 1){
      const left = `0,${i}`;
      const right = `${Game.DIM_X},${i}`;
      this.filledPositions.add(left);
      this.filledPositions.add(right);
    }
    for(let i = 0; i <= Game.DIM_X; i += 1){
      const top = `${i},0`;
      const bottom = `${i},${Game.DIM_Y}`;
      this.filledPositions.add(top);
      this.filledPositions.add(bottom);
    }
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

  dfs(root, target, seen, count){
    if(root.toString() === target.toString()){
      const foundArray = [];
      foundArray.push(root);
      return foundArray;
    }

    let left = [(root[0] - 10), root[1]];
    let right = [(root[0] + 10), root[1]];
    let up = [root[0], (root[1] - 10)];
    let down = [root[0], (root[1] + 10)];
    let validArrays = [];
    const leftCount = count + 1;
    const rightCount = count + 1;
    const upCount = count + 1;
    const downCount = count + 1;
    if(this.filledPositions.has(left.toString()) && !seen.has(left.toString())){
      let returnLeft = this.dfs(left, target, Object.assign(seen.add(root.toString())), leftCount);
      if(returnLeft){
        returnLeft.unshift(root);
        validArrays.push(returnLeft);
      }
    }
    if(this.filledPositions.has(right.toString()) && !seen.has(right.toString())){
      let returnRight = this.dfs(right, target, Object.assign(seen.add(root.toString())), rightCount);
      if(returnRight){
        returnRight.unshift(root);
        validArrays.push(returnRight);
      }
    }
    if(this.filledPositions.has(down.toString()) && !seen.has(down.toString())){
      let returnDown = this.dfs(down, target, Object.assign(seen.add(root.toString())), downCount);
      if(returnDown){
        returnDown.unshift(root);
        validArrays.push(returnDown);
      }
    }
    if(this.filledPositions.has(up.toString()) && !seen.has(up.toString())){
      let returnUp = this.dfs(up, target, Object.assign(seen.add(root.toString())), upCount);
      if(returnUp){
        returnUp.unshift(root);
        validArrays.push(returnUp);
      }
    }
    let returnArray;
    validArrays.forEach((array) => {
      if (!returnArray){
        returnArray = array;
      } else {
        if(array.length < returnArray.length){
          returnArray = array;
        }
      }
    });
    if(count === 0){
      return validArrays;
    } else {
      return returnArray;
    }

  }


  drawSeen(ctx){
    const seen = this.seenPositions;
    if(seen.length > 1){
      for (let i = 0; i < seen.length - 1; i++){
        const startX = seen[i][0];
        const startY = seen[i][1];
        const endX = seen[i+1][0];
        const endY = seen[i+1][1];
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
        ctx.closePath();
      if(this.filledPositions.has(seen[seen.length-1].toString())){
        let shapeArray = [];
        for (let i = 0; i < seen.length - 1; i++){
          const cur_pos = [seen[i][0], seen[i][1]];
          shapeArray.push(cur_pos);
        }
        const start = [seen[0][0], seen[0][1]];
        const end = [seen[seen.length-1][0], seen[seen.length-1][1]];
        const fillArray = this.dfs(end, start, new Set(), 0);
        let shortArray = fillArray[0];
        for(let i = 1; i< fillArray.length; i++){
          if (fillArray[i].length < shortArray.length){
            shortArray = fillArray[i];
          }
        }
        shapeArray = shapeArray.concat(shortArray);

        const fillPointArray = this.fillPoints(shapeArray);
        for(let i = 0; i < shapeArray.length; i++){
          this.filledPositions.add([shapeArray[i][0], shapeArray[i][1]]);
        }
        shapeArray.forEach((arr) => {
          this.filledPositions.add(arr.toString());
        });
        fillPointArray.forEach((arr) => {
          this.filledPositions.add(arr.toString());
        });
        this.shapesArray.push(shapeArray);
        this.seenPositions = [];
      }
    }
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

  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = Game.BG_COLOR;
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);


    this.drawSeen(ctx);
    this.drawShapes(ctx);

    this.allObjects().forEach((object) => {
      object.draw(ctx);
    });
    const imageData = ctx.getImageData(0, 0, Game.DIM_X, Game.DIM_Y);
    const data = imageData.data;
    let black = 0;
    let white = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 40){
      if(data[i] === 0){
        black++;
      } else if (data[i] === 255){
        white ++;
      }
    }
    const percent = (white/(white+black));

    if (percent > (4/5)){
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
