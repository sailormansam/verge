var Canvas = function () {
	this.data;
	this.blocks;
	
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
	},
	
	load: function () {
		
	},
	
	save: function () {
		
	},
	
	createLevel: function () {
		
	},
	
	place: function (action) {
		
	},
	
	destroy: function (hitbox) {
		// remove elements that overlap
	}
};