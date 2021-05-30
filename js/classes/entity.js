// TODO
// - rename to Sprite
// - use the concept of a "behaviors" array, but call it "do"
// - continue to use "draw" instead of "paint"
// - introduce idea of "execute"

function Entity(data) {
  
  // Generate a random id if one wasn't provided.
  // TODO make sure id isn't taken; use an "index" on the game obj to track entity types and ids?
  if (!data.id) { data.id = Math.random().toString(36).substring(7); }
  
  this.type = 'entity';
  
  this.x = 0;
  this.y = 0;
  
  this.width = 0;
  this.height = 0;
  
  this.color = ''; // rgba value

  

//  this.score = 0;
//
//  this.speedX = 0;
//  this.speedY = 0;    
//
//  this.gravity = 0;
//  this.gravitySpeed = 0;
    
//    this.update = function() {
//        
//    };
//    
//    this.newPos = function() {
//        
//    };
//    
//    this.hitBottom = function() {
//        
//    };
//    
//    this.crashWith = function(otherobj) {
//        
//    };

  this.isAtSpot = function(x, y) {
    return this.x === x && this.y === y;
  };

  /**
   * Given a spot, this returns true if the entity is "on" that spot.
   * @param {type} x
   * @param {type} y
   * @returns {Boolean}
   */
  this.isOnSpot = function(x, y) {
    
    // TODO this is only working for rectangles, so our default entity will assume rectangle, and additional
    // prototypes will need to be created for other shapes!
    var result =
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height;
//    console.log('isOnSpot', x + ':' + y, '(' + [this.x + ':' + this.y, (this.x + this.width) + ':' + (this.y + this.height)].join(', ') + ')? ' + (!!result ? 'Y' : 'N'));    
    return result;
  };
  
  this.wouldCollide = function(entity) {
    
//    return entity.x >= this.x &&
//      entity.x + entity.width <= this.x + this.width &&
//      entity.y >= this.y &&
//      entity.y + entity.height <= this.y + this.height;
//    return entity.x <= this.x &&
//      entity.x + entity.width >= this.x + this.width &&
//      entity.y <= this.y &&
//      entity.y + entity.height >= this.y + this.height;
//    return (entity.x >= this.x &&
//      entity.x + entity.width <= this.x + this.width) ||
//      (entity.y >= this.y &&
//      entity.y + entity.height <= this.y + this.height);
//    var result =
//      (
//        entity.x >= this.x && entity.x <= this.x + this.width &&
//        entity.y >= this.y && entity.y <= this.y + this.height
//      ) ||
//      (
//        entity.x + entity.width >= this.x && entity.x + entity.width <= this.x + this.width &&
//        entity.y + entity.height >= this.y && entity.y + entity.height <= this.y + this.height
//      );

//    var newTopLeftX = entity.x;
//    var newTopLeftY = entity.y;
//    var newBottomRightX = entity.x + entity.width;
//    var newBottomRightY = entity.y + entity.height;
//    
//    var existingTopLeftX = this.x;
//    var existingTopLeftY = this.y;
//    var existingBottomRightX = this.x + this.width;
//    var existingBottomRightY = this.y + this.height;
//    
//    var result =
//      (
//        newTopLeftX >= existingTopLeftX &&
//        newTopLeftX <= existingBottomRightX &&
//        newBottomRightX >= existingTopLeftX &&
//        newBottomRightX <= existingBottomRightX
//      );

    var result = false;
    
    var topLeftX = this.x,
      topLeftY = this.y,
      topRightX = this.x + this.width,
      topRightY = this.y,
      bottomRightX = this.x + this.width,
      bottomRightY = this.y + this.height,
      bottomLeftX = this.x,
      bottomLeftY = this.y + this.height;
    
    var entityTopLeftX = entity.x,
      entityTopLeftY = entity.y,
      entityTopRightX = entity.x + entity.width,
      entityTopRightY = entity.y,
      entityBottomRightX = entity.x + entity.width,
      entityBottomRightY = entity.y + entity.height,
      entityBottomLeftX = entity.x,
      entityBottomLeftY = entity.y + entity.height;
    
    // Check the 4 points.
    var points = [
      [entityTopLeftX, entityTopLeftY],
      [entityTopRightX, entityTopRightY],
      [entityBottomRightX, entityBottomRightY],
      [entityBottomLeftX, entityBottomLeftY]
    ];
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      // Is the point within the bounds?
      var x = point[0];
      var y = point[1];
      if (
        x >= topLeftX && y >= topLeftY &&
        x <= topRightX && y >= topRightY &&
        x <= bottomRightX && y <= bottomRightY &&
        x >= bottomLeftX && y<= bottomRightY
      ) {
        result = true;
//        console.log(
//          'collision detected!',
//          '(' + [entity.x + ':' + entity.y, (entity.x + entity.width) + ':' + (entity.y + entity.height)].join(', ') + ')',
//          '(' + [this.x + ':' + this.y, (this.x + this.width) + ':' + (this.y + this.height)].join(', ') + ') ? '
//        );
        break;
      }
    }
//    var checkPoint = function(x, y, bounds) {
//      
//    };
    
//    console.log(
//      'wouldCollide',
//      '(' + [entity.x + ':' + entity.y, (entity.x + entity.width) + ':' + (entity.y + entity.height)].join(', ') + ')',
//      '(' + [this.x + ':' + this.y, (this.x + this.width) + ':' + (this.y + this.height)].join(', ') + ') ? ' +
//      (result ? 'Y' : 'N')
//    );

    return result;
  };
  
  // Implementation templates.
//  this.mousemove = function(event) { };
//  this.mousedown = function(event) { };
//  this.mouseup = function(event) { };
  
  var keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++) {
    this[keys[i]] = data[keys[i]];
  }
    
}

Entity.prototype = {
  
  draw: function() {
  
    // We just draw a rectangle by default, and assume entity implementations have their own draw() with it.
    var ctx = game.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

  },

  newPos: function() {
    this.gravitySpeed += this.gravity;
          this.x += this.speedX;
          this.y += this.speedY + this.gravitySpeed;
          this.hitBottom();
  },

  hitBottom: function() {
    var rockbottom = game.canvas.height - this.height;
          if (this.y > rockbottom) {
              this.y = rockbottom;
              this.gravitySpeed = 0;
          }
  },

  crashWith: function(otherobj) {
    var myleft = this.x;
          var myright = this.x + (this.width);
          var mytop = this.y;
          var mybottom = this.y + (this.height);
          var otherleft = otherobj.x;
          var otherright = otherobj.x + (otherobj.width);
          var othertop = otherobj.y;
          var otherbottom = otherobj.y + (otherobj.height);
          var crash = true;
          if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
              crash = false;
          }
          return crash;
  },

  move: function(x, y) {
    this.x = x;
    this.y = y;
  },

  moveUp: function(y) {
    if (!y) { y = 1; }
    this.move(this.x, this.y - y);
  },

  moveDown: function(y) {
    if (!y) { y = 1; }
    this.move(this.x, this.y + y);
  },

  moveLeft: function(x) {
    if (!x) { x = 1; }
    this.move(this.x - x, this.y);
  },

  moveRight: function(x) {
    if (!x) { x = 1; }
    this.move(this.x + x, this.y);
  }
  
};
