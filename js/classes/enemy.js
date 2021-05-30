var Enemy = function(data) {
  Sprite.call(this, data);
  this.type = 'enemy';
};
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;
