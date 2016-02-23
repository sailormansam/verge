var Teleporter = function (x, y, mapGrain) {
	// align to zero
	x += 0.5;
	y += 0.5;

	// create player
	var graphics = game.add.graphics(0, 0);

	graphics.beginFill(0xE05140);
	graphics.drawRect(0, 0, mapGrain, mapGrain);
	
	// call extending constructor
	Phaser.Sprite.call(this, game, x * mapGrain, y * mapGrain, graphics.generateTexture());
	game.add.existing(this);
	
	graphics.destroy();

	// center sprite to align with map grid (physics objects are centered by default)
	this.anchor.set(0.5);
}

Teleporter.prototype = Object.create(Phaser.Sprite.prototype);
Teleporter.prototype.constructor = Teleporter;