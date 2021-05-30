var gameSetup = {

  id: 'SunkenStash',

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
function SunkenStash() {

  // AIR
  air = new Atmosphere({
    width: 640,
    height: 80,
    draw: function() {
      var ctx = game.context;
      ctx.fillStyle = "rgba(0,0,128,0.4)";
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
  });
  game.add(air);

  // WATER
  water = new Terrain({
    width: 640,
    height: 400,
    y: air.height,
    draw: function() {
      var ctx = game.context;
      ctx.fillStyle = "rgba(114, 139, 168, 1)";
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
  });
  game.add(water);

  // PLAYER
  player = new Player({
    x: 0,
    y: water.y,
    width: 100,
    height: 50,
    name: 'Player 1',
    draw: function() {
      var ctx = game.context;
      ctx.fillStyle = "rgba(255,255,255,1)";
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
