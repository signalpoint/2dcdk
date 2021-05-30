/**
 * TODO
 * - checkout three.js for 3d canvas
 * 
 * - when the game starts, need to collect player name, open websocket
 * 
 */
// 
// 

var sky;
var ground;

// PLAYERS
var myGamePiece;

// ENEMIES
var myObstacles = [];

// ITEMS
var bow;
//var myScore;

// MOUSE
var mousePosition;
var mouseDown = false;
var mouseUp = false;

// THE GAME...

function ColorArcher() {

  // Sky
  sky = new Atmosphere({
    width: 640,
    height: 400,
    draw: function() {
      var ctx = game.context;
      ctx.fillStyle = "rgba(0,0,200,0.2)";
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
  });

  // Ground
  ground = new Terrain({
    width: 640,
    height: 80,
    y: sky.height,
    draw: function() {
      var ctx = game.context;
      ctx.fillStyle = "rgba(0,200,0,0.2)";
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }
  });

  // Enemies
  var entities = [
    
    // Red Piece
    {
      x: 10,
      y: 120,
      width: 30,
      height: 30,
      color: 'red',
      mousedown: function(event) {
        console.log('red');
      }
    },
    
    // Green Piece
    {
      x: 50,
      y: 120,
      width: 30,
      height: 30,
      color: 'green',
      mousedown: function(event) {
        console.log('green');
      }
    },
    
    // Blue Piece
    {
      x: 90,
      y: 120,
      width: 30,
      height: 30,
      color: 'blue',
      mousedown: function(event) {
        console.log('blue');
      }
    }
    
  ];
  for (var i = 0; i < entities.length; i++) {
    myObstacles.push(new Enemy(entities[i]));
  }

  // Me
  myGamePiece = new Player({
    x: 420,
    y: 420,
    width: 30,
    height: 30,
    color: 'gray',
    gravity: 0.05,
    mousedown: function(event) {
      console.log(this.type);
    }
  });
  
  // Socket Server
//  game.webSocket = new WebSocket('ws://localhost:8080');
//  game.webSocket.onopen = function(e) {
//    console.log("Connection established!");
//  };
//  game.webSocket.onmessage = function(e) {
//    console.log(e.data);
////    sendMessage(e.data, 'right');
//  };
  
  // Bow and Arrow
  bow = new BowAndArrow({
    x: 360,
    y: 360,
    width: 30,
    height: 30,
    strokeStyle: "rgba(255, 165, 0, 1)"
  });
  
  // ADD ENTITIES TO GAME
  game.addEntities(
    sky,
    ground,
    myGamePiece,
    bow
  );
//  game.addEntities.apply(game, myObstacles);
  myObstacles.forEach((entity) => {
    game.addEntity(entity);
  });
  
  // KEYBOARD CONTROLS
  
  // Keys we care about (for now).
  var keyCodes = [
    87, // W
    65, // A
    83, // S
    68  // D
  ];

  // KEY DOWN
  window.addEventListener("keydown", function (event) {
    var keyCode = event.keyCode;
    if (keyCodes.includes(keyCode)) {
      switch (keyCode) {
        case 87: // W
          myGamePiece.moveUp(5);
          break;
        case 65: // A
          myGamePiece.moveLeft(5);
          break;
        case 83: // S
          myGamePiece.moveDown(5);
          break;
        case 68: // D
          myGamePiece.moveRight(5);
          break;
      }
      myGamePiece.draw();
    }
  }
  , false);

  // KEY UP
  window.addEventListener("keyup", function (event) {
    var keyCode = event.keyCode;
    if (keyCodes.includes(keyCode)) {
      switch (keyCode) {
        case 87: // W
          break;
        case 65: // A
          break;
        case 83: // S
          break;
        case 68: // D
          break;
      }
    }
  }, false);

//    myScore = new Entity("30px", "Consolas", "black", 280, 40, "text");

  game.start();

}

// START THE GAME

var game = new Game({
  
  id: 'ColorArcher',
  
  brain: function() {

    if (game.frameNo === 5000) {
      console.log('Times up!');
      game.stop();
      return;
    }

    // Have each enemy chase the player.
    for (var i = 0; i < myObstacles.length; i += 1) {

      var enemy = myObstacles[i];
      
//      if (enemy.x > myGamePiece.x) { enemy.x -= 1; }
//      else if (enemy.x < myGamePiece.x) { enemy.x += 1; }
//
//      if (enemy.y > myGamePiece.y) { enemy.y -= 1; }
//      else if (enemy.y < myGamePiece.y) { enemy.y += 1; }
      
      var desiredX, desiredY;

      if (enemy.x > myGamePiece.x) { desiredX = (enemy.x - 1); }
      else if (enemy.x < myGamePiece.x) { desiredX = (enemy.x + 1); }
      else { desiredX = myGamePiece.x; }

      if (enemy.y > myGamePiece.y) { desiredY = (enemy.y - 1); }
      else if (enemy.y < myGamePiece.y) { desiredY = (enemy.y + 1); }
      else { desiredY = myGamePiece.y; }
      
      // If we want to move, only do so if there is nobody there already.
      // TODO need a game.canMoveTo(entity, x, y); that takes into account the "size" of the entity on the canvas
      var who = game.whoIsThere(desiredX, desiredY, {
        exclude: enemy
      });
      if (who) {
//          console.log('somebody is there', who);
//          game.stop();
        // TODO if it's an enemy try to go around
      }
      else {
        enemy.x = desiredX;
        enemy.y = desiredY;
      }
      

    }

  },
  
  // MOUSE CONTROLS
  mousedown: function(event) {
    
    // If clicked on anybody, run their mousedown handler
//    var pos = game.getMousePosition(event);
//    var who = game.whoIsThere(pos.x, pos.y);
//    if (who) {
//      who.forEach((entity, i) => {
//        entity.mousedown(event);
//      });
//    }
    
  }
  
});


function everyinterval(n) {
  if ((game.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function accelerate(n) {
  myGamePiece.gravity = n;
}

var BowAndArrow = function(data) {
  
  Item.call(this, data);
  
  this.type = 'bow-and-arrow';
  
  this.shootingCircle = {
    x: 200,
    y: 200,
    r: 75
  };
  
  this.drawBackCircle = {
    x: this.shootingCircle.x,
    y: this.shootingCircle.y,
    r: 10
  };
  
  this.draw = function() {
    var ctx = game.context;
  
//  ctx.font = this.width + " " + this.height;
//  ctx.fillStyle = "YELLOW";
//  ctx.fillText("HELLO WORLD", this.x, this.y);

    ctx.strokeStyle = this.strokeStyle;

    ctx.beginPath();
    ctx.arc(this.shootingCircle.x, this.shootingCircle.y, this.shootingCircle.r, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.drawBackCircle.x, this.drawBackCircle.y, this.drawBackCircle.r, 0, 2 * Math.PI);
    ctx.stroke();
  };
  
};
BowAndArrow.prototype = Object.create(Item.prototype);
BowAndArrow.prototype.constructor = BowAndArrow;
