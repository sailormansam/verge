var BlockStaticObject = function () {
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0xff0000);

	graphics.drawRect(0, 0, 40, 40);
	
	ActionObject.call(this, graphics.generateTexture());
	
	graphics.destroy();
};

BlockStaticObject.prototype = Object.create(ActionObject.prototype);
BlockStaticObject.prototype.constructor = BlockStaticObject;