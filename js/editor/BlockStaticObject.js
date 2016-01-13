var BlockStaticObject = function () {
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0xD3902F);

	graphics.drawRect(0, 0, 40, 40);
	
	ActionObject.call(this, graphics.generateTexture(), 'STATIC', 0);
	
	graphics.destroy();
};

BlockStaticObject.prototype = Object.create(ActionObject.prototype);
BlockStaticObject.prototype.constructor = BlockStaticObject;