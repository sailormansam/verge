var Map = function (gameState) {
	this.gameState = gameState;
	this.blocks;
    this.blocks2d;
    this.collidableBlocks;
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
        this.blocks2d = [];
        this.collidableBlocks = [];
        
        for (var i = 0; i < 40; i++) {
            this.blocks2d[i] = new Array(40);
        }
        
		this.level = 0;
		
		// get json
		this.data = JSON.parse(JSON.stringify(game.cache.getJSON('map')));
		
		// create a layer for moveable blocks to live on
		this.blockLayer = game.add.group();
	},
	
	hasNextLevel: function () {
		return this.data.levels[this.level + 1]
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
		
		// create map
		for(var i = 0, len = this.data.levels[this.level].blocks.length; i < len; i++) {
            // create player
            if(this.data.levels[this.level].blocks[i].material == 'START') {
                if(this.gameState.player) {
                    this.gameState.player.moveToStart(this.data.levels[this.level].blocks[i].x * this.MAP_GRAIN, this.data.levels[this.level].blocks[i].y * this.MAP_GRAIN);
                }
                else {
                    this.gameState.player = new Player(this.gameState, this.data.levels[this.level].blocks[i].x * this.MAP_GRAIN, this.data.levels[this.level].blocks[i].y * this.MAP_GRAIN);
                }

                this.gameState.player.inventory.clear();
            }
            else if(this.data.levels[this.level].blocks[i].material == 'TELEPORTER') {
                // create teleporter for this level
                this.gameState.teleporter = new Teleporter(this.data.levels[this.level].blocks[i].x,
                                                           this.data.levels[this.level].blocks[i].y,
                                                           this.MAP_GRAIN);
            }
            else {
                this.blocks.push(new Block(this.gameState,
                                           this.data.levels[this.level].blocks[i].x,
                                           this.data.levels[this.level].blocks[i].y,
                                           this.MAP_GRAIN,
                                           this.data.levels[this.level].blocks[i].material));
            }
		}
        
        for(var i = 0, len = this.blocks.length; i < len; i++) {
            // create 2d array to more efficiently locate blocks that need colliders
            if(this.blocks[i].material == 'STATIC') {
                this.blocks2d[this.blocks[i].x / this.MAP_GRAIN][this.blocks[i].y / this.MAP_GRAIN] = i;
            }
        }
        
        // loop through 2d block array to find blocks that need colliders
        for(var i = 1, len = this.blocks2d.length - 1; i < len; i++) {
            for(var j = 1, len = this.blocks2d.length - 1; j < len; j++) {
                // if there is a no neighbor either up down left or right, this block gets a collider
                if((this.blocks2d[i - 1][j] == undefined
                   || this.blocks2d[i + 1][j] == undefined
                   || this.blocks2d[i][j - 1] == undefined
                   || this.blocks2d[i][j + 1] == undefined)
                   && this.blocks2d[i][j] != undefined){
                    this.collidableBlocks.push(this.blocks[this.blocks2d[i][j]]);
                }
            }
        }
        
        // do a pass to simplify geometry even further by creating vertical and horizontal colliding rectangles
        // vertical pass
        
        // reset 2d array for use with new collidable blocks
        for(var i = 0; i < this.blocks2d.length; i++) {
            this.blocks2d[i] = new Array(40);
        }
        
        this.collidableBlocks.forEach(function(block){
            this.blocks2d[block.x / this.MAP_GRAIN][block.y / this.MAP_GRAIN] = false;
        }, this);
        
        console.log(this.blocks2d);
        
        var totalArrays = [];
        var workingArray = [];
        
        // find a block search down until no block, create
        for(var i = 1; i < this.blocks2d.length; i++) {
            for(var j = 1; j < this.blocks2d.length; j++) {
                // make sure there are at least two blocks, or else you get a lot of 1 block columns
                if((this.blocks2d[i][j] === false && this.blocks2d[i][j + 1] === false) || 
                   (workingArray.length > 0 && this.blocks2d[i][j] === false)) {
                    this.blocks2d[i][j] = true;
                    workingArray.push(this.blocks2d[i][j]);
                }
                else {
                    // if working array is not empty
                    if(workingArray.length > 0) {
                        // push working array to total array and then clear
                        totalArrays.push(workingArray);
                        workingArray = [];
                    }
                }
            }
        }
        
        // horizontal pass
        for(var j = 1; j < this.blocks2d.length; j++) {
            for(var i = 1; i < this.blocks2d.length; i++) {
                // make sure there are at least two blocks, or else you get a lot of 1 block columns
                if((this.blocks2d[i][j] === false && this.blocks2d[i + 1][j] === false) || 
                   (workingArray.length > 0 && this.blocks2d[i][j] === false)) {
                    this.blocks2d[i][j] = true;
                    workingArray.push(this.blocks2d[i][j]);
                }
                else {
                    // if working array is not empty
                    if(workingArray.length > 0) {
                        // push working array to total array and then clear
                        totalArrays.push(workingArray);
                        workingArray = [];
                    }
                }
            }
        }
        
        
        
        console.log(totalArrays);
        
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
			   && this.blocks[i].x == (truePointer.x) * this.MAP_GRAIN
			   && this.blocks[i].y == (truePointer.y) * this.MAP_GRAIN) {
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