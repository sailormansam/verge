var BlockStaticObject = function (mapGrain) {
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0x666666);

	graphics.drawRect(0, 0, mapGrain, mapGrain);
	
	Phaser.Sprite.call(this, game, 0, 0, graphics.generateTexture());
	game.add.existing(this);
	
	graphics.destroy();
};

BlockStaticObject.prototype = Object.create(ActionObject.prototype);
BlockStaticObject.prototype.constructor = BlockStaticObject;