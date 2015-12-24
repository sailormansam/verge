var Map = function (gameState) {
	this.gameState = gameState;
	this.blocks;
	this.data;
	this.level;
	
	// layers
	this.blockLayer;
	
	// constants
	this.WORLD_PADDING_BOTTOM = 300;
	this.MAP_GRAIN = 40;				// size of map blocks
	this.FALL_BUFFER = 200;
	
	this.create();
};

Map.prototype = {
	create: function () {
		// reset variables
		this.blocks = [];
		this.level = 0;
		
		// get json
		this.data = JSON.parse(JSON.stringify(game.cache.getJSON('map')));
		
		// create a layer for moveable blocks to live on
		this.blockLayer = game.add.group();
	},
	
	hasNextLevel: function () {
		return this.data.level[this.level + 1]
	},
	
	incrementLevel: function () {
		this.level++;
	},
	
	createCurrentLevel: function () {
		// let's tween in the world
		game.world.alpha = 0;
		
		// clear block array
		this.blocks.forEach(function (block) {
			if(block != null){
				block.destroy();
			}
		});
		this.blocks = [];
		
		// clear teleporter
		if(this.gameState.teleporter) {
			this.gameState.teleporter.destroy();
		}
		
		// create player
		if(this.gameState.player) {
			this.gameState.player.moveToStart(this.data.level[this.level].start.x * this.MAP_GRAIN + 0.5, this.data.level[this.level].start.y * this.MAP_GRAIN + 0.5);
		}
		else {
			this.gameState.player = new Player(this.gameState, this.data.level[this.level].start.x * this.MAP_GRAIN + 0.5, this.data.level[this.level].start.y * this.MAP_GRAIN + 0.5);
		}
		
		this.gameState.player.inventory.clear();
		
		// create map
		for(var i = 0, len = this.data.level[this.level].blocks.length; i < len; i++) {
			this.blocks.push(new Block(this.gameState,
									   this.data.level[this.level].blocks[i].x,
									   this.data.level[this.level].blocks[i].y,
									   this.MAP_GRAIN,
									   this.data.level[this.level].blocks[i].material));
		}
		
		// create teleporter for this level
		this.gameState.teleporter = new Teleporter(this.data.level[this.level].teleporter.x,
										 this.data.level[this.level].teleporter.y,
										 this.MAP_GRAIN);
		
		//  find the greatest x and y position of blocks
		var greatestX = 0;
		var greatestY = 0;

		for(var i = 0, len = this.blocks.length; i < len; i++) {
			if(this.blocks[i].x > greatestX) {
				greatestX = this.blocks[i].x;
			}

			if(this.blocks[i].y > greatestY) {
				greatestY = this.blocks[i].y;
			}

		}

		// check for small values
		if (greatestX < game.width) {
			greatestX = game.width;
		}

		if (greatestY < game.height) {
			greatestY = game.height;
		}

		// set the world bounds based on level
		// added a little to the game height so the camera follows the player a little before allowing the player to fall off screen and reset
		// add a half of a block to the width because the blocks are centered on position
		game.world.setBounds(0, 0, greatestX + this.MAP_GRAIN / 2, greatestY + this.FALL_BUFFER);
		
		// set camera follow to null to tween camera
		game.camera.follow(null);
		
		// change the game camera for tween
		game.camera.x = 20;
		
		// tween in world
		game.add.tween(game.world).to({ alpha: 1}, 500).start();
		var t = game.add.tween(game.camera).to({ x: 0}, 300);
		
		t.start();
		t.onComplete.add((function() {game.camera.follow(this.gameState.player);}), this);
	},
	
	placeBlock: function (pointer) {
		// get a pointer relative to camera
		var truePointer = {
			x: Math.floor(((pointer.x + game.camera.x) / this.MAP_GRAIN)),
			y: Math.floor(((pointer.y + game.camera.y) / this.MAP_GRAIN))
		};
		
		// check if there is a block at pointer location
		for(var i = 0, len = this.blocks.length; i < len; i++) {
			if(this.blocks[i] != null
			   && this.blocks[i].x == (truePointer.x + 0.5) * this.MAP_GRAIN
			   && this.blocks[i].y == (truePointer.y + 0.5) * this.MAP_GRAIN) {
				return;
			}
		}
		
		// place block if inventory allows
		if(this.gameState.player && this.gameState.player.inventory.count > 0) {
			var newBlock = new Block(this.gameState, truePointer.x, truePointer.y, this.MAP_GRAIN, blockType.DYNAMIC);
			this.blocks.push(newBlock);
			this.blockLayer.add(newBlock);
			this.gameState.player.inventory.change(-1);
		}
		else if(!this.gameState.player) {
			var newBlock = new Block(this.gameState, truePointer.x, truePointer.y, this.MAP_GRAIN, blockType.DYNAMIC);
			this.blocks.push(newBlock);
			this.blockLayer.add(newBlock);
		}
	},
	
	removeBlocksWithin: function (hitbox) {
		// remove blocks that overlap
		for(var i = 0, len = this.blocks.length; i < len; i++) {
			if(this.gameState.player) {
				if(this.blocks[i] != null
				   && this.gameState.player.inventory.count < this.gameState.player.inventory.CAP
				   && this.blocks[i].material == blockType.DYNAMIC
				   && Phaser.Rectangle.intersects(this.blocks[i].getBounds(), hitbox)) {
					this.blocks[i].destroy();
					this.blocks[i] = null;
					this.gameState.player.inventory.change(1);
				}
			}
			else {
				if(this.blocks[i] != null
				   && this.blocks[i].material == blockType.DYNAMIC
				   && Phaser.Rectangle.intersects(this.blocks[i].getBounds(), hitbox)) {
					this.blocks[i].destroy();
					this.blocks[i] = null;
				}
			}
		}
	}
};