var Atmosphere = function(data) {
  Entity.call(this, data);
  this.type = 'atmosphere';
};
Atmosphere.prototype = Object.create(Entity.prototype);
Atmosphere.prototype.constructor = Atmosphere;
