var blockType = {
	STATIC: "STATIC",
	MOVEABLE: "MOVEABLE"
}

GameStates.Editor = function (game) {
	this.player;
	this.level;
	this.block = [];
	this.teleporter;
	this.map;
	this.graphics;
	this.originPointer;
	this.mapGrain = 40;	// size of map blocks
	this.worldBottomPadding = 300;
	this.playerCollisionGroup;
	this.blockCollisionGroup;
	this.timer;
	
	// layers
	this.blockLayer;
	
	// constants
	this.GRAVITY = 0;
	this.FALL_BUFFER = 200;
};

GameStates.Editor.prototype = {
	create: function () {
		// reset variables
		this.player = null;
		this.level = 0;
		
		// enable physics
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.defaultRestitution = 1;
		game.physics.p2.gravity.y = this.GRAVITY;
		game.physics.p2.damping = 1;
		
		// turn on collision callbacks
		game.physics.p2.setImpactEvents(true);
		this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
		this.blockCollisionGroup = game.physics.p2.createCollisionGroup();
		
		// create a layer for moveable blocks to live on
		this.blockLayer = game.add.group();
		
		// add graphics layer
		this.graphics = game.add.graphics(0, 0);
		this.graphics.alpha = 0.5;
		
		this.player = new Player(this, this.game.width / 2, this.game.height / 2, true);
		
		// place a block on click
		game.input.mouse.capture = true;
	},
	update: function () {
		this.player.update();
		
		// place blocks if mouse is down
		if(game.input.activePointer.leftButton.isDown) {
			this.placeBlock(game.input);
		}
	},
	preRender: function () {
		this.player.preRender();

		// clear graphics before potential drawing
		this.graphics.clear();

		if(game.input.activePointer.rightButton.isDown) {
			// Set the origin of the net
			if(this.originPointer == null) {
				this.originPointer = {
					x: game.input.x,
					y: game.input.y
				};
			}
			this.drawNet(game.input);
		}
		else {
			if(this.originPointer != null) {
				// create hitbox from net this handles dragging the box in any direction
				var a = { x: null, y: null };
				var b = { x: null, y: null };
				
				if( this.originPointer.x < game.input.x ) {
					a.x = this.originPointer.x;
					b.x = game.input.x;
				}
				else {
					a.x = game.input.x;
					b.x = this.originPointer.x;
				}
				
				if( this.originPointer.y < game.input.y ) {
					a.y = this.originPointer.y;
					b.y = game.input.y;
				}
				else {
					a.y = game.input.y;
					b.y = this.originPointer.y;
				}
				
				var hitbox = new Phaser.Rectangle(a.x, a.y, b.x - a.x, b.y - a.y);
				
				var toSplice = [];
				
				// remove blocks that overlap
				for(var i = 0, len = this.block.length; i < len; i++) {
					if(this.block[i] != null
					   && this.player.inventory.count < this.player.inventory.CAP
					   && this.block[i].type == blockType.MOVEABLE
					   && Phaser.Rectangle.intersects(this.block[i].sprite.getBounds(), hitbox)) {
						this.block[i].sprite.destroy();
						this.block[i] = null;
						this.player.inventory.change(1);
					}
				}
			}
			this.originPointer = null;
		}
	},
	placeBlock: function (pointer) {
		// get a pointer relative to camera
		var truePointer = {
			x: Math.floor(((pointer.x + game.camera.x) / this.mapGrain)),
			y: Math.floor(((pointer.y + game.camera.y) / this.mapGrain))
		};
		
		// check if there is a block at pointer location
		for(var i = 0, len = this.block.length; i < len; i++) {
			if(this.block[i] != null
			   && this.block[i].x == (truePointer.x + 0.5) * this.mapGrain
			   && this.block[i].y == (truePointer.y + 0.5) * this.mapGrain) {
				return;
			}
		}
		
		// place block if inventory allows
		if(this.player.inventory.count > 0) {
			var newBlock = new Block(this, truePointer.x, truePointer.y, this.mapGrain, blockType.MOVEABLE);
			this.block.push(newBlock);
			this.blockLayer.add(newBlock.sprite);
			this.player.inventory.change(-1);
		}
	},
	drawNet: function (pointer) {
		this.graphics.beginFill(0xff0000);
		this.graphics.drawRect(this.camera.x + this.originPointer.x, this.camera.y + this.originPointer.y, pointer.x - this.originPointer.x, pointer.y - this.originPointer.y);
	}
};
