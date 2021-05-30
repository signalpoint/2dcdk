var gameSetup = {

  id: 'ExampleGame',

  // HANDLERS

  brain: function() {
    
    // Add game logic here...
    
    // Stop the game and wait for the player...
    game.stop();

  },

  // MOUSE CONTROLS

  mousedown: function(event) { },
  mouseup: function(event) { }

};

// Game Loader
function ExampleGame() {

  // SKY
  sky = new Atmosphere({
    width: 640,
    height: 400,
    draw: function() {
      var ctx = game.context;
      ctx.fillStyle = "rgba(0,0,200,0.2)";
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
  });
  game.add(sky);

  // GROUND
  ground = new Terrain({
    width: 640,
    height: 80,
    y: sky.height,
    draw: function() {
      var ctx = game.context;
      ctx.fillStyle = "rgba(0,300,0,0.2)";
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
  });
  game.add(ground);

  // PLAYER
  player = new Player({
    x: 0,
    y: ground.y,
    width: 100,
    height: 50,
    name: 'Player 1',
    draw: function() {
      var ctx = game.context;
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.font = "20px Arial";
      ctx.fillText(this.name, this.x, this.y + this.height, this.width);
    }
  });
  game.add(player);
  game.setPlayer(player);

  // Start the game.
  game.start();

}

var game = new Game(gameSetup);
