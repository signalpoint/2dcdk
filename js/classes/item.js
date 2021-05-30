var Item = function(data) {
  Sprite.call(this, data);
  this.type = 'item';
};
Item.prototype = Object.create(Sprite.prototype);
Item.prototype.constructor = Item;
