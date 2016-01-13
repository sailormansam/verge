var BlockDynamicObject = function () {
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0x334D63);

	graphics.drawRect(0, 0, 40, 40);
	
	ActionObject.call(this, graphics.generateTexture(), 'DYNAMIC', 0);
	
	graphics.destroy();
};

BlockDynamicObject.prototype = Object.create(ActionObject.prototype);
BlockDynamicObject.prototype.constructor = BlockDynamicObject;