const Game = require("./game");
const GameView = require("./game_view");

function closeGameOver(){
  $(".newgame-section").removeClass("show");
}

document.addEventListener("DOMContentLoaded", function(){
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  const gameView = new GameView(game, ctx);
  gameView.start();
  window.newGame = game.newGame;
  let leftInterval;
  let rightInterval;
  let upInterval;
  let downInterval;

  $(".newgame-section").on("click", e => {
    closeGameOver();
  });

  $(document).keyup(function(e) {
    if(e.keyCode === 27){
      closeInstructions();
    }
  });

  $(document).keydown(function(e) {
    if(e.keyCode === 37){
      if (!leftInterval) {
        leftInterval = window.setInterval(() => {
          gameView.ship.power([-10, 0]);
        }, 75);
      }
    }if(e.keyCode === 38){
      if (!upInterval) {
        upInterval = window.setInterval(() => {
          gameView.ship.power([0,  -10]);
        }, 75);
      }
    }if(e.keyCode === 39){
      if (!rightInterval) {
        rightInterval = window.setInterval(() => {
          gameView.ship.power([10,  0]);
        }, 75);
      }
    }if(e.keyCode === 40){
      if (!downInterval) {
        downInterval = window.setInterval(() => {
          gameView.ship.power([0,  10]);
        }, 75);
      }
    }
  });

  $(document).keyup(function(e) {
    if(e.keyCode === 37){
      window.clearInterval(leftInterval);
      leftInterval = null;
    }if(e.keyCode === 38){
      window.clearInterval(upInterval);
      upInterval = null;
    }if(e.keyCode === 39){
      window.clearInterval(rightInterval);
      rightInterval = null;
    }if(e.keyCode === 40){
      window.clearInterval(downInterval);
      downInterval = null;
    }
  });

});
