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
  new GameView(game, ctx).start();
  window.newGame = game.newGame;

  $(".newgame-section").on("click", e => {
    closeGameOver();
  });

  $(document).keyup(function(e) {
    if(e.keyCode === 27){
      closeInstructions();
    }
  });
});
