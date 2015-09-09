// TODO move tasks into github?
// don't let player move on next level start until they hit the ground?
// maybe make custom physics for more control
// simpify geometry if there are multiple blocks in a straight line
// transitions from level to level and from title to levels
// click to place blocks and invetory and that whole system
// check for block overlap before placement and picking moveable blocks back up
var blockType = {
	STATIC: 0,
	MOVEABLE: 1
}

GameStates.Game = function (game) {
	this.player = null;
	this.level = 0;
	this.block = [];
	this.teleporter;
	this.map;
	
	this.GRAVITY = 1000;
	
	this.mapGrain = 40;	// size of map blocks
};

GameStates.Game.prototype = {
	create: function () {
		// enable physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.defaultRestitution = 1;
		game.physics.p2.gravity.y = this.GRAVITY;
		game.physics.p2.damping = 1;
		
		// get json
		this.map = JSON.parse(JSON.stringify(game.cache.getJSON('map')));
		
		this.makeLevel(this.level);
		
		// camera
		game.camera.follow(this.player.sprite);
		
		// place a block on click
		game.input.mouse.capture = true;
		
	},
	update: function () {
		this.player.update();
		
		// place blocks if mouse is down
		if(game.input.activePointer.leftButton.isDown) {
			this.placeBlock(game.input);
		}
		
		if(Phaser.Rectangle.intersects(this.player.sprite.getBounds(), this.teleporter.sprite.getBounds())) {
			// go to next level
			if(this.map.level[this.level + 1]) {
				this.makeLevel(this.level++);
			}
		}
	},
	placeBlock: function (pointer) {
		var truePointer = {
			x: Math.floor(((pointer.x + game.camera.x) / this.mapGrain)),
			y: Math.floor(((pointer.y + game.camera.y) / this.mapGrain))
		};
		
		// check if there is a block at pointer location
		for(var i = 0, len = this.block.length; i < len; i++) {
			if(this.block[i].x == (truePointer.x + 0.5) * this.mapGrain && this.block[i].y == (truePointer.y + 0.5) * this.mapGrain) {
				return;
			}
		}
		
		this.block.push(new Block(truePointer.x, truePointer.y, this.mapGrain, blockType.MOVEABLE));
	},
	makeLevel: function () {
		// clear block array
		this.block.forEach(function (block) {
			block.sprite.destroy();
		});
		this.block = [];
		
		// clear teleporter
		if(this.teleporter) {
			this.teleporter.sprite.destroy();
		}
		
		// create player
		if(this.player) {
			this.player.moveToStart(this.map.level[this.level].start.x * this.mapGrain + 0.5, this.map.level[this.level].start.y * this.mapGrain + 0.5);
		}
		else {
			this.player = new Player(this.map.level[this.level].start.x * this.mapGrain + 0.5, this.map.level[this.level].start.y * this.mapGrain + 0.5);
		}
		
		// create map
		for(var i = 0, len = this.map.level[this.level].block.length; i < len; i++) {
			this.block.push(new Block(this.map.level[this.level].block[i].x,
									  this.map.level[this.level].block[i].y,
									  this.mapGrain,
									  blockType.STATIC));
		}
		
		// create teleporter for this level
		this.teleporter = new Teleporter(this.map.level[this.level].teleporter.x,
										 this.map.level[this.level].teleporter.y,
										 this.mapGrain);
		
		// set the world bounds based on level
		// TODO check the block with the greatest value of x not just last element in array
		//		if the map is higher than the game height
		game.world.setBounds(0, 0, this.map.level[this.level].block[i - 1].x * this.mapGrain, game.height);
	}
};