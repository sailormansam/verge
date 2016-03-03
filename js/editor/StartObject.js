var StartObject = function (mapGrain) {
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0x3CB58A);

	graphics.drawRect(0, 0, 40, 40);
	
	ActionObject.call(this, graphics.generateTexture(), 'START', 1);
	
	graphics.destroy();
};

StartObject.prototype = Object.create(ActionObject.prototype);
StartObject.prototype.constructor = StartObject;