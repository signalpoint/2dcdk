// TODO checkout three.js

var myGamePiece;
var myObstacles = [];
//var myScore;

function bigBang() {
  
  // Enemies
  var entities = [
    
    // Red Piece
    {
      x: 10,
      y: 120,
      width: 30,
      height: 30,
      color: 'red'
    },
    
    // Green Piece
    {
      x: 50,
      y: 120,
      width: 30,
      height: 30,
      color: 'green'
    },
    
    // Blue Piece
    {
      x: 90,
      y: 120,
      width: 30,
      height: 30,
      color: 'blue'
    }
    
  ];
  for (var i = 0; i < entities.length; i++) {
    myObstacles.push(new Enemy(entities[i]));
  }

  // Me
//  myGamePiece = new Entity(30, 30, "red", 10, 120);
//  myGamePiece.gravity = 0.05;
  myGamePiece = new Player({
    x: 420,
    y: 420,
    width: 30,
    height: 30,
    color: 'gray',
    gravity: 0.05
  });
  
  // Bow and Arrow
  var shootingCircle = {
    x: 200,
    y: 200,
    r: 75
  };
  var drawBackCircle = {
    x: shootingCircle.x,
    y: shootingCircle.y,
    r: 10
  };
  var drawCircles = function() {
    
  };
  
  // Attach input controls...
  
  // Keys we care about (for now).
  var keyCodes = [
    87, // W
    65, // A
    83, // S
    68 // D
  ];
  
  // KEY DOWN
  window.addEventListener("keydown", function (event) {
    var keyCode = event.keyCode;
    if (keyCodes.includes(keyCode)) {
      switch (keyCode) {
        case 87: //w
          myGamePiece.moveUp(5);
          break;
        case 65: //a
          myGamePiece.moveLeft(5);
          break;
        case 83: //s
          myGamePiece.moveDown(5);
          break;
        case 68: //d
          myGamePiece.moveRight(5);
          break;
      }
      myGamePiece.update();
    }
  }
  , false);

  // KEY UP
  window.addEventListener("keyup", function (event) {
    var keyCode = event.keyCode;
    if (keyCodes.includes(keyCode)) {
      switch (keyCode) {
        case 87: //w
          break;
        case 65: //a
          break;
        case 83: //s
          break;
        case 68: //d
          break;
      }
    }
  }, false);

//    myScore = new Entity("30px", "Consolas", "black", 280, 40, "text");

  // Let's start with a bang!
  universe.start();
}

var universe = {

  canvas: document.createElement("canvas"),
  
  context: null,
  
  frameNo: 0,
    
  start: function() {
    
    // Set the canvas dimensions.
    this.canvas.width = 640;
    this.canvas.height = 480;
    
    // Get the two dimensional context.
    this.context = this.canvas.getContext("2d");
    
    // Add the canvas to the body.
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    
//    this.frameNo = 0;
    this.interval = setInterval(updateUniverse, 20);

  },
  
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
};

function updateUniverse() {
//  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  
  // If the game piece crashes with any obstacle, game over man!
//  for (i = 0; i < myObstacles.length; i += 1) {
//    if (myGamePiece.crashWith(myObstacles[i])) {
//      console.log('GAME OVER: clearing the interval');
//      clearInterval(universe.interval);
//      return;
//    } 
//  }

  if (universe.frameNo === 5000) {
      console.log('Times up!');
      clearInterval(universe.interval);
      return;    
  }

  // Clear the universe.
  universe.clear();
  
  // Increase the frame number.
  universe.frameNo += 1;

  // Have each enemy chase the player.
  for (var i = 0; i < myObstacles.length; i += 1) {

      var enemy = myObstacles[i];
      
      if (enemy.x > myGamePiece.x) { enemy.x -= 1; }
      else if (enemy.x < myGamePiece.x) { enemy.x += 1; }
      
      if (enemy.y > myGamePiece.y) { enemy.y -= 1; }
      else if (enemy.y < myGamePiece.y) { enemy.y += 1; }
      
      enemy.update();
      
  }

//    myScore.text="SCORE?!?!: " + universe.frameNo;
//    myScore.update();

  // Redraw the player.
  myGamePiece.update();

}

function everyinterval(n) {
  if ((universe.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function accelerate(n) {
  myGamePiece.gravity = n;
}
