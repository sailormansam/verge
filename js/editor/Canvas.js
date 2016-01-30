var Canvas = function (parent) {
	// properties
	this.editor = parent;
	this.data;
	this.blocks;
	this.clickElement;
	this.scale;
	this.zoomed;
    this.level;
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
	this.MAP_GRAIN = 40;			// size of map blocks
	this.SCROLL_SPEED = 0.03;
	this.SCALE_MIN_LIMIT = 0.4;
	this.CENTERING_STRENGTH = 8;	// how fast an object gets centered when zooming higher = slower
	
	this.create();
};

Canvas.prototype = {
	create: function () {
		// set variables
		this.blocks = [];
		this.scale = 1;
        
        // start level at high index for save
        this.level = this.editor.data.levels.length;
		
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
        this.level = level;
        
		// empty block array show warning or have undo button
		this.blocks.forEach(function (block) {
			block.destroy();
		});
		
		this.blocks = [];
		
		// create map
		for(var i = 0, len = this.editor.data.levels[level].blocks.length; i < len; i++) {
			var newBlock = new Block(this.editor.data.levels[level].blocks[i].x * this.MAP_GRAIN,
									   this.editor.data.levels[level].blocks[i].y * this.MAP_GRAIN,
									   this.materialKey[this.editor.data.levels[level].blocks[i].material],
									   this.editor.data.levels[level].blocks[i].material);
			this.blocks.push(newBlock);
			this.blockLayer.add(newBlock);
		}
		
		this.editor.UI.loadOverlay.hide();
	},
	
	zoom: function (event) {
		// we want to call all of the logic during the update loop not when this is fired
		this.zoomed = true;
	},
	
	updateZoom: function () {
		//get camera position based on percentage
		// center camera on mouse location
		var centerPoint = new Phaser.Point(game.width / 2, game.height / 2);
		var mousePoint = new Phaser.Point((game.input.x - centerPoint.x) + centerPoint.x , (game.input.y - centerPoint.y) + centerPoint.y);
		
		var scaledCamera = new Phaser.Point((game.camera.x + mousePoint.x) / game.world.width, (game.camera.y + mousePoint.y) / game.world.height);
		
		// truncate for better accuracy
		scaledCamera.x = scaledCamera.x.toFixed(2);
		scaledCamera.y = scaledCamera.y.toFixed(2);
		
		// calculate scale
		this.scale += game.input.mouse.wheelDelta * this.SCROLL_SPEED;
		
		// cap scale and don't move the camera at all
		if (this.scale > 1) {
			this.scale = 1;
			return;
		} else if (this.scale < this.SCALE_MIN_LIMIT) {
			this.scale = this.SCALE_MIN_LIMIT;
			return;
		}
		
		//set scale
		this.gridLayer.scale.set(this.scale);
		this.blockLayer.scale.set(this.scale);
		
		// set bounds based on scale
		game.world.setBounds(0, 0, this.editor.WORLD_SIZE * this.scale, this.editor.WORLD_SIZE * this.scale);
		
		// find the new (center point) to move the camera to
		// this center point will be a point on the line connecting the actual center point and the cursor
		// and it will be a set distance from the cursor
		var newCenterPoint = centerPoint.clone();
		if(!mousePoint.equals(newCenterPoint)) {
			var vector = Phaser.Point.subtract(centerPoint, mousePoint);
			var vectorLength = Phaser.Point.distance(centerPoint, mousePoint);
			var normalized = Phaser.Point.divide(vector, new Phaser.Point(vectorLength, vectorLength));
			var multiplied = Phaser.Point.multiply(normalized, new Phaser.Point(vectorLength / 8, vectorLength / 8));
			newCenterPoint = Phaser.Point.add(mousePoint, multiplied);
		}
		
//		game.add.tween(game.camera).to({ x: scaledCamera.x * game.world.width - newCenterPoint.x, y: scaledCamera.y * game.world.height - newCenterPoint.y }, 100, Phaser.Easing.Linear.None, true);
		game.camera.x = scaledCamera.x * game.world.width - newCenterPoint.x;
		game.camera.y = scaledCamera.y * game.world.height - newCenterPoint.y;
		
		// tween scaling grid
//		game.add.tween(this.gridLayer.scale).to({ x: this.scale, y: this.scale }, 100, Phaser.Easing.Quadratic.In, true);
//		game.add.tween(this.blockLayer.scale).to({ x: this.scale, y: this.scale }, 100, Phaser.Easing.Quadratic.In, true);
		
		this.zoomed = false;
	},
	
	update: function () {
		if(this.zoomed) {
			this.updateZoom();
		}
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
	
	remove: function () {
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
				this.editor.history.actionCache.push({ type: 'remove', index: i, value: this.blocks[i] });
				this.blocks[i].destroy();
				this.blocks.splice(i, 1);
				return;
			}
		}
	},
	
	addBlocksWithin: function (hitbox) {
		// remove elements that overlap hitbox
		
		// find a rectangle that matches grid then fill rectangle
		var truePointer = new Phaser.Point(Math.floor(((hitbox.x + game.camera.x) / this.MAP_GRAIN) / this.scale), Math.floor(((hitbox.y + game.camera.y) / this.MAP_GRAIN) / this.scale));
		var trueDim = new Phaser.Point(Math.ceil(((hitbox.x + hitbox.width + game.camera.x) / this.MAP_GRAIN) / this.scale), Math.ceil(((hitbox.y + hitbox.height + game.camera.y) / this.MAP_GRAIN) / this.scale));
		
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