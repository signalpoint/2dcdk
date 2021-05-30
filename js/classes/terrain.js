var Terrain = function(data) {
  Entity.call(this, data);
  this.type = 'terrain';
};
Terrain.prototype = Object.create(Entity.prototype);
Terrain.prototype.constructor = Terrain;
