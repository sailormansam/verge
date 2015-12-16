var StartObject = function (mapGrain) {
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0xff0000);

	graphics.drawRect(0, 0, mapGrain, mapGrain);
	
	Phaser.Sprite.call(this, game, 0, 0, graphics.generateTexture());
	game.add.existing(this);
	
	graphics.destroy();
};

StartObject.prototype = Object.create(ActionObject.prototype);
StartObject.prototype.constructor = StartObject;