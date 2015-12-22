var Canvas = function (parent) {
	this.parent = parent;
	this.data;
	this.blocks;
	// create block
	var graphics = game.add.graphics(0, 0);
	
	graphics.beginFill(0x999999);

	graphics.drawRect(0, 0, game.world.width, game.world.height);
	
	this.clickElement = game.add.sprite(0, 0);
	this.clickElement.width = game.world.width;
	this.clickElement.height = game.world.height;
	
	graphics.destroy();
	
	// layers
	this.blockLayer;
	
	// constants
	this.MAP_GRAIN = 40;				// size of map blocks
	
	this.create();
};

Canvas.prototype = {
	create: function () {
		// reset variables
		this.blocks = [];
		
		// get json
		this.data = JSON.parse(JSON.stringify(game.cache.getJSON('map')));
		this.blockLayer = game.add.group();
		
		this.clickElement.inputEnabled = true;
		this.clickElement.events.onInputDown.add(this.place, this);
		this.clickElement.input.priorityID = 1;
	},
	
	load: function () {
		
	},
	
	save: function () {
		
	},
	
	createLevel: function () {
		
	},
	
	place: function () {
		console.log('canvas click', this.parent.currentAction);
	},
	
	destroy: function (hitbox) {
		// remove elements that overlap
	}
};