var StartObject = function (mapGrain) {
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0xff00ff);

	graphics.drawRect(0, 0, 40, 40);
	
	ActionObject.call(this, graphics.generateTexture());
	
	graphics.destroy();
};

StartObject.prototype = Object.create(ActionObject.prototype);
StartObject.prototype.constructor = StartObject;