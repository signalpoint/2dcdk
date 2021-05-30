var Sprite = function(data) {
  
  Entity.call(this, data);
  
  this.type = 'sprite';
  
  this.velocityX = 0;
  this.velocityY = 0;
  
  this.gravity = false;
  this.gravityX = 0;
  this.gravityY = 0; // TODO fill in the universal px / s / s, or whatever's clever
  
  this._items = [];

};
Sprite.prototype = Object.create(Entity.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.getItems = function() {
  return this._items;
};

Sprite.prototype.hasItems = function() {
  return !!this.getItems().length;
};

Sprite.prototype.addItem = function(item) {
  return this.getItems().push(item);
};

Sprite.prototype.removeItem = function(item) {
  var items = this.getItems();
  var delta = null;
  for (var i = 0; i < items.length; i++) {
    if (items[i].id == item.id) {
      delta = i;
      break;
    }
  }
  if (delta !== null) {
    items.splice(delta, 1);
  }
  this._items = items;
};
