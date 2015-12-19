var TeleporterObject = function (mapGrain) {
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0x0000ff);

	graphics.drawRect(0, 0, 40, 40);
	
	ActionObject.call(this, graphics.generateTexture());
	
	graphics.destroy();
};

TeleporterObject.prototype = Object.create(ActionObject.prototype);
TeleporterObject.prototype.constructor = TeleporterObject;