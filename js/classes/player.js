var Player = function(data) {
  
  Sprite.call(this, data);
  
  this.type = 'player';
//  this.isTurn = false;
  
  this.isCurrentPlayer = function() {
    var currentPlayer = game.getPlayer();
    return currentPlayer && currentPlayer.id == this.id;
  };
  
};
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;
