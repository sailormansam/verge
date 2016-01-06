var Canvas = function (parent) {
	this.editor = parent;
	this.data;
	this.blocks;
	
	this.clickElement = game.add.sprite(0, 0);
	this.clickElement.width = game.world.width;
	this.clickElement.height = game.world.height;
	
	// layers
	this.blockLayer;
	
	this.saveButton;
	this.UIUp;
	
	// constants
	this.MAP_GRAIN = 40;	// size of map blocks
	
	this.create();
};

Canvas.prototype = {
	create: function () {
		// reset variables
		this.blocks = [];
		this.UIUp = true;
		
		// get json
		this.data = JSON.parse(JSON.stringify(game.cache.getJSON('map')));
		this.blockLayer = game.add.group();
		
		this.saveButton = game.add.sprite(game.width - 80, 80, 'bubble');
		this.saveButton.inputEnabled = true;
		this.saveButton.events.onInputDown.add(this.save, this);
		this.saveButton.events.onInputUp.add(this.upSave, this);
		this.saveButton.input.priorityID = 2;
		this.saveButton.anchor.set(0.5);
		this.saveButton.input.useHandCursor = true;
		
		this.clickElement.inputEnabled = true;
		this.clickElement.events.onInputDown.add(this.click, this);
		this.clickElement.events.onInputUp.add(this.up, this);
		this.clickElement.input.priorityID = 1;
	},
	
	load: function () {
		
	},
	
	save: function () {
		var mapSave = {
			levels:[
				{
					start: {x: 0, y: 0},
					teleporter: {x: 0, y: 0},
					blocks: []
				}
			]
		};
		
		// generate blocks and print out
		this.blocks.forEach(function(block){
			if(block.material == "START") {
				mapSave.levels[0].start = {x: block.x, y: block.y};
			}
			else if(block.material == "TELEPORTER") {
				mapSave.levels[0].teleporter = {x: block.x, y: block.y};
			}
			else {
				mapSave.levels[0].blocks.push({ material: block.material, x: block.x, y: block.y });
			}
		});
		
		console.log(JSON.stringify(mapSave));
		this.UIUp = false;
	},
	
	upSave: function () {
		this.UIUp = true;
	},
	
	click: function () {
		if(!this.editor.bubbleController.hidden) {
			this.editor.bubbleController.hide();
		}
	},
	
	up: function () {
		// set hidden equal to true because it will always hide bubbles when clicking on canvas
		if(!this.editor.bubbleController.hidden) {
			this.editor.bubbleController.hidden = true;
		}
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
			
			var newBlock = new Block(truePointer.x * this.MAP_GRAIN, truePointer.y * this.MAP_GRAIN, this.editor.bubbleController.currentAction.sprite.key, this.editor.bubbleController.currentAction.material);
			this.blocks.push(newBlock);
			this.blockLayer.add(newBlock);
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