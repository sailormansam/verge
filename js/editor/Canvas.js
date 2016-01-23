var Canvas = function (parent) {
	// properties
	this.editor = parent;
	this.data;
	this.blocks;
	this.clickElement;
	this.scale;
	this.materialKey = {
		STATIC: this.editor.actions[0].sprite.key,
		DYNAMIC: this.editor.actions[1].sprite.key,
		START: this.editor.actions[2].sprite.key,
		TELEPORTER: this.editor.actions[3].sprite.key
	};
	
	// layers
	this.gridLayer;
	this.blockLayer;
	
	// constants
	this.MAP_GRAIN = 40;	// size of map blocks
	this.SCROLL_SPEED = 0.01;
	this.SCALE_MIN_LIMIT = 0.4;
	
	this.create();
};

Canvas.prototype = {
	create: function () {
		// set variables
		this.blocks = [];
		this.scale = 1;
		
		this.clickElement = game.add.sprite(0, 0);
		this.clickElement.width = game.world.width;
		this.clickElement.height = game.world.height;
		this.clickElement.inputEnabled = true;
		this.clickElement.events.onInputDown.add(this.click, this);
		this.clickElement.events.onInputUp.add(this.up, this);
		this.clickElement.input.priorityID = 1;
		
		// set layers
		this.gridLayer = game.add.group();
		this.blockLayer = game.add.group();
		
		// draw grid
		this.drawGrid();
		
		// inputs
		// zoom functionality
		game.input.mouse.callbackContext = this;
		game.input.mouse.mouseWheelCallback = this.zoom;
	},
	
	loadLevel: function (level) {
		// empty block array show warning or have undo button
		this.blocks.forEach(function (block) {
			block.destroy();
		});
		
		this.blocks = [];
		
		// create map
		for(var i = 0, len = this.editor.data.level[level].blocks.length; i < len; i++) {
			var newBlock = new Block(this.editor.data.level[level].blocks[i].x * this.MAP_GRAIN,
									   this.editor.data.level[level].blocks[i].y * this.MAP_GRAIN,
									   this.materialKey[this.editor.data.level[level].blocks[i].material],
									   this.editor.data.level[level].blocks[i].material);
			this.blocks.push(newBlock);
			this.blockLayer.add(newBlock);
		}
		
		this.editor.UI.loadOverlay.hide();
	},
	
	zoom: function mouseWheel(event) {
		//get camera position based on percentage
		var currentWorldSize = this.editor.WORLD_SIZE * this.scale;
		var scaledCamera = new Phaser.Point((game.camera.x + game.width / 2) / currentWorldSize, (game.camera.y + game.height / 2) / currentWorldSize);
		
//		console.log(scaledCamera);
		
		// calculate scale
		this.scale += game.input.mouse.wheelDelta * this.SCROLL_SPEED;
		
		// cap scale
		if (this.scale > 1) {
			this.scale = 1;
		} else if (this.scale < this.SCALE_MIN_LIMIT) {
			this.scale = this.SCALE_MIN_LIMIT;
		}
		
		//set scale
		this.gridLayer.scale.set(this.scale);
		this.blockLayer.scale.set(this.scale);
		
		// set bounds based on scale
		game.world.setBounds(0, 0, this.editor.WORLD_SIZE * this.scale, this.editor.WORLD_SIZE * this.scale);
		
		// update worldScale
		currentWorldSize = this.editor.WORLD_SIZE * this.scale;
		
		// get mouse pointer to center scaling around mouse
//		var pointer = game.input;
//		var scalePoint = new Phaser.Point(pointer.x / game.world.width, pointer.y / game.world.height);
//		
		game.camera.x = scaledCamera.x * currentWorldSize - game.width / 2;
		game.camera.y = scaledCamera.y * currentWorldSize - game.height / 2;
	},
	
	click: function () {
		if(!this.editor.UI.bubbleController.hidden) {
			this.editor.UI.bubbleController.hide();
		}
	},
	
	up: function () {
		// set hidden equal to true because it will always hide bubbles when clicking on canvas
		if(!this.editor.UI.bubbleController.hidden) {
			this.editor.UI.bubbleController.hidden = true;
		}
	},
	
	place: function () {
		// place block if there is an action and if it checks out with that actions verification
		if(this.editor.UI.bubbleController.currentAction && this.editor.UI.bubbleController.currentAction.check(this.blocks)) {
			var pointer = game.input;

			// get a pointer relative to camera
			var truePointer = {
				x: Math.floor(((pointer.x + game.camera.x) / this.MAP_GRAIN) / this.scale),
				y: Math.floor(((pointer.y + game.camera.y) / this.MAP_GRAIN) / this.scale)
			};

			// check if there is a block at pointer location
			for(var i = 0, len = this.blocks.length; i < len; i++) {
				if(this.blocks[i].x == truePointer.x * this.MAP_GRAIN
				   && this.blocks[i].y == truePointer.y * this.MAP_GRAIN) {
					return;
				}
			}
			
			var newBlock = new Block(truePointer.x * this.MAP_GRAIN, truePointer.y * this.MAP_GRAIN, this.editor.UI.bubbleController.currentAction.sprite.key, this.editor.UI.bubbleController.currentAction.material);
			this.blocks.push(newBlock);
			this.blockLayer.add(newBlock);
			this.editor.history.actionCache.push({ type: 'add', index: this.blocks.length - 1, value: newBlock });
		}
	},
	
	addBlocksWithin: function (hitbox) {
		// remove elements that overlap hitbox
		
		// find a rectangle that matches grid then fill rectangle
		var truePointer = new Phaser.Point(Math.floor((hitbox.x + game.camera.x) / this.MAP_GRAIN), Math.floor((hitbox.y + game.camera.y) / this.MAP_GRAIN));
		var trueDim = new Phaser.Point(Math.ceil((hitbox.x + hitbox.width + game.camera.x) / this.MAP_GRAIN), Math.ceil((hitbox.y + hitbox.height + game.camera.y) / this.MAP_GRAIN));
		
		// slim down list so we only check blocks within the bounds of the net
		this.slimBlocks = [];
		
		for(var i = 0, len = this.blocks.length; i < len; i++) {
			if(this.blocks[i].x > truePointer.x && this.blocks[i].x< trueDim.x
			  && this.blocks[i].y > truePointer.y && this.blocks[i].y < trueDim.y) {
				this.slimBlocks.push(this.blocks[i]);
			}
		}
		
		// check and place blocks
		for(var i = truePointer.x; i < trueDim.x; i++) {
			check: for(var j = truePointer.y; j < trueDim.y; j++) {
				for(var k = 0, len = this.slimBlocks.length; k < len; k++) {
					if(this.slimBlocks[k].x == i * this.MAP_GRAIN
					   && this.slimBlocks[k].y == j * this.MAP_GRAIN) {
						continue check;
					}
				}
				
				var newBlock = new Block(i * this.MAP_GRAIN, j * this.MAP_GRAIN, this.editor.UI.bubbleController.currentAction.sprite.key, this.editor.UI.bubbleController.currentAction.material);
				this.blocks.push(newBlock);
				this.blockLayer.add(newBlock);
				this.editor.history.actionCache.push({ type: 'add', index: this.blocks.length - 1, value: newBlock });
			}
		}
	},
	
	removeBlocksWithin: function (hitbox) {
		// remove elements that overlap hitbox
		var i = this.blocks.length;
		while (i--) {
			if(Phaser.Rectangle.intersects(this.blocks[i].getBounds(), hitbox)) {
				this.editor.history.actionCache.push({ type: 'remove', index: i, value: this.blocks[i] });
				this.blocks[i].destroy();
				this.blocks.splice(i, 1);
			}
		}
	},
	
	drawGrid: function () {
		var bmd = game.add.bitmapData(game.world.width, game.world.height);

		bmd.ctx.beginPath();
		bmd.ctx.lineWidth = "1";
		bmd.ctx.strokeStyle = 'e1e1e1';
		bmd.ctx.setLineDash([1,2]);
		
		// loop through grid x
		for(var i = 0, len = game.world.width / this.MAP_GRAIN; i < len; i++) {
			// draw line
			bmd.ctx.moveTo(i * this.MAP_GRAIN, 0);
			bmd.ctx.lineTo(i * this.MAP_GRAIN, game.world.height);
		}
		
		// loop through grid y
		for(var i = 0, len = game.world.height / this.MAP_GRAIN; i < len; i++) {
			// draw line
			bmd.ctx.moveTo(0, i * this.MAP_GRAIN);
			bmd.ctx.lineTo(game.world.width, i * this.MAP_GRAIN);
		}
		
		bmd.ctx.stroke();
		bmd.ctx.closePath();
		
		// add grid to stage
		this.gridLayer.add(game.add.sprite(0, 0, bmd));
	}
};