var BlockDynamicObject = function () {
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0x999999);

	graphics.drawRect(0, 0, 40, 40);
	
	ActionObject.call(this, graphics.generateTexture());
	
	graphics.destroy();
};

BlockDynamicObject.prototype = Object.create(ActionObject.prototype);
BlockDynamicObject.prototype.constructor = BlockDynamicObject;