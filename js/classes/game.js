/**
 * 
 * @param {object} data
 * 
 *  mousemove {Function}
 *  mousedown {Function}
 *  mouseup {Function}
 *  
 *  * {*} All properties on data will be placed on the game.
 *
 * @returns {Game}
 
 */
var Game = function(data) {
  
  this._entities = []; // Entities loaded into the game.
  this._player = null; // The current player.
  
  this.canvas = document.createElement("canvas");
  
  this.context = null;
  
  this.frameNo = 0;
  
  this.webSocket = null;
  
  /**
   * MOUSE
   */
  
  this.mouseIsDown = null;
  this.mouseIsUp = null;
  
  if (data.mousemove) {
    this.canvas.addEventListener('mousemove', function(event) {
      game.mousemove.call(game, event);
    });
  }
  
  if (data.mousedown) {
    this.canvas.addEventListener('mousedown', function(event) {
      
      game.mouseIsDown = true;
      game.mouseIsUp = false;
      
      game.mousedown.call(game, event);
      
      // If clicked on anybody, run their mousedown handler
      var pos = game.getMousePosition(event);
      var who = game.whoIsThere(pos.x, pos.y);
      if (who) {
        who.forEach((entity, i) => {
          if (entity.mousedown) {
            entity.mousedown.call(entity, event);
          }
        });
      }
      
    });
  }
  
  if (data.mouseup) {
    this.canvas.addEventListener('mouseup', function(event) {
      game.mouseIsUp = true;
      game.mouseIsDown = false;
      game.mouseup.call(game, event);
    });
  }
  
  // Add any incoming data to the game.
  var keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++) {
    this[keys[i]] = data[keys[i]];
  }
  
};

Game.prototype = {
  
  start: function() {
    
    var self = this;
    
    setTimeout(function() {

      // Set the canvas dimensions.
      self.canvas.width = 640;
      self.canvas.height = 480;

      // Get the two dimensional context.
      self.context = self.canvas.getContext("2d");

      // Add the canvas to the body.
      //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      var div = document.getElementById(self.id);
      div.insertBefore(self.canvas, div.childNodes[0]);

      self.frameNo = 0; // TODO not needed, since default is set above?
      self.interval = setInterval(self.update, 20); // 20
      
    });
    
  },
  
  stop: function() {
    clearInterval(this.interval);
    // TODO disable controls
  },
  
  // Empty implementation.
  brain: function() {},
  
  update: function() {

    // Clear the game (aka clear the scene).
    game.clear();

//    sky.update();
//    ground.update();
//
//    myGamePiece.update();

//    bow.update();

    game.brain();

    game.render();

    // Increase the frame number.
    game.frameNo += 1;
    
  },
  
  render: function() {
    var entities = game.getEntities();
    if (entities) {
      entities.forEach((entity) => {
        entity.draw.call(entity);
      });
    }
  },
  
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  
  /**
   * ENTITIES
   */

  /**
   * Get all entities. Or supply some filters to match against.
   * @returns {Array}
   */
  getEntities: function() {
    var entities = this._entities;
    if (arguments.length) { // Has filters
      var data =  arguments[0];
      var results = [];
      entities.forEach((entity) => {
        var match = true;
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          if (entity[key] != data[key]) {
            match = false;
            break;
          }
        }
        if (match) { results.push(entity); }
      });
      return results.length ? results : null;
    }
    return entities;
  },
  
  add: function(entity) {
//    console.log('add', [entity.x + ':' + entity.y, (entity.x + entity.width) + ':' + (entity.y + entity.height)].join(', '));
    this.getEntities().push(entity);
  },
  // TODO deprecated
  addEntity: function(entity) {
    console.log('addEntity deprecated', entity);
    this.getEntities().push(entity);
  },
  
  addMultiple: function(/** entity1, entity2, etc **/) {
    console.log('addMultiple', arguments);
    var stack = this.getEntities();
    stack.push.apply(stack, arguments);
  },
  // TODO deprecated
  addEntities: function(/** entity1, entity2, etc **/) {
    console.log('addEntities deprecated', arguments);
    var stack = this.getEntities();
    stack.push.apply(stack, arguments);
  },
  
  /**
   * PLAYERS
   */

  getPlayers: function() {
    return this.getEntities({
      type: 'player'
    });
  },
  
  // turn based play
  setPlayer: function(player) {
    this._player = player;
  },
  getPlayer: function() {
    return this._player;
  },
  getNextPlayer: function() {
    var currentPlayer = this.getPlayer();
    var nextPlayer = null;
    if (currentPlayer) {
      var players = this.getPlayers();
      var playerCount = players.length;
      for (var i = 0; i < playerCount; i++) {
        var player = players[i];
        if (player.id == currentPlayer.id) {
          var isLast = i == playerCount - 1;
          nextPlayer = !isLast ? players[i + 1] : players[0];
        }
      }
    }
    return nextPlayer;
  },
  getPreviousPlayer: function() {
    var currentPlayer = this.getPlayer();
    var previousPlayer = null;
    if (currentPlayer) {
      var players = this.getPlayers();
      var playerCount = players.length;
      for (var i = 0; i < playerCount; i++) {
        var player = players[i];
        if (player.id == currentPlayer.id) {
          var isFirst = i == 0;
          previousPlayer = !isFirst ? players[i - 1] : players[playerCount - 1];
        }
      }
    }
    return previousPlayer;
  },
  
  getMousePosition: function(event) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.x,
      y: event.clientY - rect.y
    };
  },
  
  /**
   * 
   * @param {type} x
   * @param {type} y
   * @param {type} options
   *  exclude {object} An entity to exclude
   * @returns {Array|Game.whoIsThere.who}
   */
  whoIsThere: function(x, y, options) {
    if (!options) { options = {}; }
    var who = [];
    var entities = this.getEntities();
    if (entities) {
      var ignore = [
        'Atmosphere',
        'Terrain'
      ];
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (
          ignore.includes(entity.constructor.name) ||
          (options.exclude && options.exclude.id == entity.id)
        ) { continue; }
        if (entity.isOnSpot(x, y)) {
          who.push(entity);
        }
      }
    }
    return who.length ? who : null;
  },
  
  isSpotOpen: function(entity) {
    var ignore = ['atmosphere', 'terrain'];
    var entities = this.getEntities();
    for (var i = 0; i < entities.length; i++) {
      var existingEntity = entities[i];
      if (ignore.includes(existingEntity.type)) { continue; }
      if (existingEntity.wouldCollide(entity)) {
        return false;
      }
    }
    return true;
  },
  
  findAnOpenSpot: function(entity) {
    var randomSpot;
    var originalX = entity.x;
    var originalY = entity.y;
    var open = false;
    var depth = 0;
    var maxDepth = 100;
    while (!open) {
      randomSpot = this.randomSpot();
      entity.x = randomSpot.x;
      entity.y = randomSpot.y;
      open = this.isSpotOpen(entity);
      depth++;
      if (depth > maxDepth) { console.log('findAnOpenSpot: none found'); break; }
    }
    entity.x = originalX;
    entity.y = originalY;
    return randomSpot;
    
    
    
    var entities = this.getEntities();
    entities.forEach((existingEntity) => {
      
    });
    
    
    var wouldCollide = true;
    while (wouldCollide) {
      
    }
    console.log('looking for someone', randomSpot);
    var who = this.whoIsThere(randomSpot.x, randomSpot.y, {
      exclude: entity
    });
    
    while (who) {
      randomSpot = this.randomSpot();
      console.log('looking for someone else', randomSpot);
      who = this.whoIsThere(randomSpot.x, randomSpot.y, {
        exclude: entity
      });
    }
    return randomSpot;
  },

  randomX: function() {
    return Math.floor(Math.random()*game.canvas.width); // Not very random!
  },
  randomY: function() {
    return Math.floor(Math.random()*game.canvas.height); // Not very random!
  },
  randomSpot: function() {
    return {
      x: this.randomX(),
      y: this.randomY()
    };
  }
  
};
