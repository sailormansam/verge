var BlockDynamicObject = function (mapGrain) {
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0x999999);

	graphics.drawRect(0, 0, mapGrain, mapGrain);
	
	Phaser.Sprite.call(this, game, 0, 0, graphics.generateTexture());
	game.add.existing(this);
	
	graphics.destroy();
};

BlockDynamicObject.prototype = Object.create(ActionObject.prototype);
BlockDynamicObject.prototype.constructor = BlockDynamicObject;