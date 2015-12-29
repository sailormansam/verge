var Canvas = function (parent) {
	this.editor = parent;
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
//		this.clickElement.input.onDown.add(this.place, this);
		this.clickElement.input.priorityID = 1;
	},
	
	load: function () {
		
	},
	
	save: function () {
		
	},
	
	createLevel: function () {
		
	},
	
	place: function () {
		if(this.editor.bubbleController.currentAction) {
			var pointer = game.input;

			// get a pointer relative to camera
			var truePointer = {
				x: Math.floor(((pointer.x + game.camera.x) / this.MAP_GRAIN)),
				y: Math.floor(((pointer.y + game.camera.y) / this.MAP_GRAIN))
			};

			// check if there is a block at pointer location
			for(var i = 0, len = this.blocks.length; i < len; i++) {
				if(this.blocks[i] != null
				   && this.blocks[i].x == (truePointer.x) * this.MAP_GRAIN
				   && this.blocks[i].y == (truePointer.y) * this.MAP_GRAIN) {
					return;
				}
			}

			var newBlock = game.add.sprite(truePointer.x * this.MAP_GRAIN, truePointer.y * this.MAP_GRAIN, this.editor.bubbleController.currentAction.sprite.key);
			this.blocks.push(newBlock);
			this.blockLayer.add(newBlock);
			
			console.log('canvas click', this.editor.bubbleController.currentAction);
		}
	},
	
	removeBlocksWithin: function (hitbox) {
		// remove elements that overlap hitbox
		for(var i = 0, len = this.blocks.length; i < len; i++) {
			if(this.blocks[i] != null
			   && Phaser.Rectangle.intersects(this.blocks[i].getBounds(), hitbox)) {
				this.blocks[i].destroy();
				this.blocks[i] = null;
			}
		}
	}
};